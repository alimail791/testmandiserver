import "dotenv/config";
import express from "express";
import cors from "cors";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import Razorpay from "razorpay";
import nodemailer from "nodemailer";
import { initDB, getCollections } from "./db.js";

const mongoDb = await initDB();
const db = getCollections(mongoDb); // db.users, db.tests, db.meta, etc — real MongoDB collections

const app = express();
// Railway (and most hosts) sit your app behind a reverse proxy, which adds an
// X-Forwarded-For header. Without this, express-rate-limit throws on every
// request since it can't safely tell who the real client is.
app.set("trust proxy", 1);

// CORS_ORIGIN can be one URL or a comma-separated list (e.g. your local dev
// server plus your deployed frontend), so both can talk to this API at once.
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",").map((o) => o.trim()).filter(Boolean);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  },
}));
app.use(express.json({ limit: "2mb", verify: (req, res, buf) => { req.rawBody = buf; } }));

// Global limiter — generous, just stops runaway scripts.
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 600, standardHeaders: true, legacyHeaders: false }));

// Tighter limiter for auth endpoints — the ones worth protecting against brute force.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false,
  message: { error: "Too many attempts — please wait a few minutes and try again." },
});

const JWT_SECRET = process.env.JWT_SECRET || "dev-only-insecure-secret";
const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID !== "rzp_test_your_key_id") {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// RazorpayX (real seller payouts) — separate from the payment-gateway side
// above. Requires an actual RazorpayX current account (its own KYC/business
// verification with Razorpay, not just an API key). Falls back to the old
// simulated payout flow everywhere below if this isn't configured, so the
// app still works during development or before RazorpayX is set up.
const RAZORPAYX_ENABLED = !!(process.env.RAZORPAYX_ACCOUNT_NUMBER && razorpay);

// Payouts need a mandatory idempotency header (X-Payout-Idempotency, required
// by Razorpay since March 2025) that the general-purpose orders SDK call
// above doesn't need — calling the documented REST API directly here avoids
// any uncertainty about whether a given SDK version exposes that header.
async function razorpayXRequest(path, body, extraHeaders = {}) {
  const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64");
  const res = await fetch(`https://api.razorpay.com/v1${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Basic ${auth}`, ...extraHeaders },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data?.error?.description || `RazorpayX request to ${path} failed`);
    err.raw = data;
    throw err;
  }
  return data;
}

// Maps RazorpayX's own payout statuses onto the simpler labels this app
// already shows sellers (queued/pending/processing are all still "in
// flight"; reversed/rejected/cancelled/failed all mean it didn't go through).
function mapPayoutStatus(razorpayXStatus) {
  if (["processed"].includes(razorpayXStatus)) return "Completed";
  if (["reversed", "rejected", "cancelled", "failed"].includes(razorpayXStatus)) return "Failed";
  return "Processing"; // queued, pending, processing
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
function publicUser(u) {
  if (!u) return null;
  const { _id, passwordHash, verificationTokenHash, resetTokenHash, resetTokenExpiresAt, refreshTokens, ...rest } = u;
  return rest;
}

function signAccessToken(user) {
  return jwt.sign({ sub: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_TTL });
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// Issues both tokens for a login/register response, in one place. Rotates
// (prunes expired) refresh tokens on the user document as it goes.
async function issueSession(user) {
  const token = crypto.randomBytes(40).toString("hex");
  const newEntry = { tokenHash: hashToken(token), expiresAt: Date.now() + REFRESH_TOKEN_TTL_MS };
  // Buyers get exactly one active session — logging in elsewhere (or on
  // another device) signs them out everywhere else. Sellers/advertisers/admin
  // keep normal multi-device support.
  const freshTokens = user.role === "buyer"
    ? [newEntry]
    : [...(user.refreshTokens || []).filter((t) => t.expiresAt > Date.now()), newEntry];
  await db.users.updateOne({ id: user.id }, { $set: { refreshTokens: freshTokens } });
  return { token: signAccessToken(user), refreshToken: token };
}

function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Not logged in." });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Session expired — please log in again." });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "You don't have permission to do that." });
    }
    next();
  };
}

function isBlockedTest(test) {
  return test.ratingCount > 10 && test.rating < 3;
}

function sellerDisplayName(user) {
  return user.businessName || user.name;
}

function generateReferralCode(name) {
  const base = (name || "USER").replace(/[^a-zA-Z]/g, "").slice(0, 4).toUpperCase() || "USER";
  return `${base}${Math.floor(1000 + Math.random() * 9000)}`;
}

const AD_COST_HOMEPAGE = 500;
const AD_COST_CATEGORY = 200;

// Real email sending. Two options, tried in this order:
//
// 1. RESEND_API_KEY — sends via Resend's HTTPS API (https://resend.com, free
//    tier available). Recommended for Railway and similar hosts: many cloud
//    platforms block outbound SMTP ports (25/465/587) to prevent spam abuse,
//    which makes direct SMTP time out even when the credentials are correct.
//    An HTTP API call goes over normal HTTPS (443), which is never blocked.
//
// 2. SMTP_HOST/PORT/USER/PASS/FROM — works great for local development and
//    for hosts that do allow outbound SMTP (this includes plain VPS hosting).
//
// If neither is configured, this falls back to printing the link to the
// console, so local dev still works without needing real email credentials.
let mailer = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  mailer = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true", // true for port 465, false for 587/25
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

const emailMode = process.env.RESEND_API_KEY ? "resend" : mailer ? "smtp" : "none";
console.log(
  emailMode === "resend" ? "Email sending configured via Resend API." :
  emailMode === "smtp" ? `Email sending configured via SMTP host ${process.env.SMTP_HOST}` :
  "No email provider configured — emails will print to this console instead of sending. See .env.example."
);

async function sendEmail(to, subject, link, actionLabel) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #1B2A4A;">
      <h2 style="margin: 0 0 16px;">${subject}</h2>
      <p style="font-size: 14px; line-height: 1.5; color: #3B4C72;">Click the button below to continue. This link expires soon for your security.</p>
      <a href="${link}" style="display: inline-block; margin: 16px 0; padding: 12px 22px; background: #1B2A4A; color: #FBF7EE; text-decoration: none; border-radius: 6px; font-weight: 600;">${actionLabel}</a>
      <p style="font-size: 12px; color: #79705C;">If the button doesn't work, copy this link into your browser:<br>${link}</p>
      <p style="font-size: 12px; color: #79705C;">If you didn't request this, you can safely ignore this email.</p>
    </div>`;

  if (emailMode === "none") {
    console.log(`\n--- email not sent (no provider configured) ---\nTo: ${to}\nSubject: ${subject}\nLink: ${link}\n------------------------------------------------\n`);
    return;
  }

  try {
    if (emailMode === "resend") {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: process.env.RESEND_FROM || "TestMandi <onboarding@resend.dev>", to, subject, html }),
      });
      if (!res.ok) throw new Error(`Resend API responded ${res.status}: ${await res.text()}`);
    } else {
      await mailer.sendMail({ from: process.env.SMTP_FROM || process.env.SMTP_USER, to, subject, html });
    }
  } catch (err) {
    // Never let an email failure break registration/reset itself — log it
    // and let the request succeed; the user can use "resend" if needed.
    console.error("Email send failed:", err.message);
  }
}

// Used to build links inside emails — separate from CORS_ORIGIN (which can be
// a comma-separated list and isn't safe to put straight into a URL). Set this
// to your single real frontend URL, e.g. https://testmandi.in
const PUBLIC_APP_URL = process.env.PUBLIC_APP_URL || (process.env.CORS_ORIGIN || "http://localhost:5173").split(",")[0].trim();

/* ------------------------------------------------------------------ */
/* Auth                                                                 */
/* ------------------------------------------------------------------ */
app.post("/api/auth/register", authLimiter, async (req, res) => {
  const { role, name, email, phone, password, businessName, referralCodeUsed } = req.body || {};
  if (!["buyer", "seller", "advertiser"].includes(role)) return res.status(400).json({ error: "Invalid account type." });
  if (!name?.trim() || !email?.trim() || !password?.trim()) return res.status(400).json({ error: "Missing required fields." });
  if (password.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters." });
  if ((role === "seller" || role === "advertiser") && !businessName?.trim()) {
    return res.status(400).json({ error: "Institute/business name is required for this account type." });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existing = await db.users.findOne({ email: normalizedEmail });
  if (existing) return res.status(409).json({ error: "An account with that email already exists." });

  const passwordHash = await bcrypt.hash(password, 10);
  const verificationToken = crypto.randomBytes(24).toString("hex");
  const user = {
    id: "u_" + Date.now(),
    role, name: name.trim(), email: normalizedEmail, phone: (phone || "").trim(),
    businessName: (businessName || "").trim(), passwordHash, bankDetails: null, createdAt: Date.now(),
    emailVerified: false, verificationTokenHash: hashToken(verificationToken),
    resetTokenHash: null, resetTokenExpiresAt: null, refreshTokens: [],
  };

  if (role === "buyer") {
    user.referralCode = generateReferralCode(user.name);
    const referrer = referralCodeUsed
      ? await db.users.findOne({ role: "buyer", referralCode: referralCodeUsed.trim().toUpperCase() })
      : null;
    user.referredBy = referrer ? referrer.email : null;
    user.referralBonusGranted = false;
    user.referralRewards = [];
  }

  await db.users.insertOne(user);
  await sendEmail(user.email, "Verify your TestMandi account", `${PUBLIC_APP_URL}/?verify=${verificationToken}&uid=${user.id}`, "Verify email");

  const session = await issueSession(user);
  res.json({ ...session, user: publicUser(user) });
});

app.post("/api/auth/login", authLimiter, async (req, res) => {
  const { email, password, expectedRole } = req.body || {};
  const user = await db.users.findOne({ email: (email || "").trim().toLowerCase() });
  if (!user) return res.status(401).json({ error: "No matching account — check your details or register." });
  if (expectedRole && user.role !== expectedRole) return res.status(403).json({ error: "These credentials aren't an admin account." });

  const ok = await bcrypt.compare(password || "", user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Incorrect password." });

  const session = await issueSession(user);
  res.json({ ...session, user: publicUser(user) });
});

app.post("/api/auth/refresh", authLimiter, async (req, res) => {
  const { refreshToken } = req.body || {};
  if (!refreshToken) return res.status(400).json({ error: "Missing refresh token." });
  const tokenHash = hashToken(refreshToken);
  const user = await db.users.findOne({ refreshTokens: { $elemMatch: { tokenHash, expiresAt: { $gt: Date.now() } } } });
  if (!user) return res.status(401).json({ error: "Refresh token invalid or expired — please log in again." });

  // Rotate: remove the used refresh token, issue a fresh pair.
  const prunedTokens = (user.refreshTokens || []).filter((t) => t.tokenHash !== tokenHash);
  await db.users.updateOne({ id: user.id }, { $set: { refreshTokens: prunedTokens } });
  const session = await issueSession({ ...user, refreshTokens: prunedTokens });
  res.json({ ...session, user: publicUser(user) });
});

app.post("/api/auth/logout", async (req, res) => {
  const { refreshToken } = req.body || {};
  if (refreshToken) {
    const tokenHash = hashToken(refreshToken);
    await db.users.updateOne(
      { "refreshTokens.tokenHash": tokenHash },
      { $pull: { refreshTokens: { tokenHash } } }
    );
  }
  res.json({ ok: true });
});

app.post("/api/auth/verify-email", async (req, res) => {
  const { uid, token } = req.body || {};
  const user = await db.users.findOne({ id: uid });
  if (!user || !user.verificationTokenHash || user.verificationTokenHash !== hashToken(token || "")) {
    return res.status(400).json({ error: "That verification link is invalid or has already been used." });
  }
  await db.users.updateOne({ id: uid }, { $set: { emailVerified: true, verificationTokenHash: null } });
  res.json({ ok: true });
});

app.post("/api/auth/resend-verification", auth, async (req, res) => {
  const user = await db.users.findOne({ id: req.user.sub });
  if (!user) return res.status(404).json({ error: "Account not found." });
  if (user.emailVerified) return res.json({ ok: true, alreadyVerified: true });

  const verificationToken = crypto.randomBytes(24).toString("hex");
  await db.users.updateOne({ id: user.id }, { $set: { verificationTokenHash: hashToken(verificationToken) } });

  await sendEmail(user.email, "Verify your TestMandi account", `${PUBLIC_APP_URL}/?verify=${verificationToken}&uid=${user.id}`, "Verify email");
  res.json({ ok: true, emailConfigured: emailMode !== "none" });
});

app.post("/api/auth/forgot-password", authLimiter, async (req, res) => {
  const normalizedEmail = (req.body?.email || "").trim().toLowerCase();
  const user = await db.users.findOne({ email: normalizedEmail });
  // Always respond the same way whether or not the account exists, so this
  // endpoint can't be used to check which emails are registered. Whether
  // SMTP is configured at all is server-wide, not per-user, so it's safe to
  // include — it just lets the frontend show an accurate message.
  const genericResponse = { ok: true, message: "If that email is registered, a reset link has been sent.", emailConfigured: emailMode !== "none" };
  if (!user) return res.json(genericResponse);

  const resetToken = crypto.randomBytes(24).toString("hex");
  await db.users.updateOne(
    { id: user.id },
    { $set: { resetTokenHash: hashToken(resetToken), resetTokenExpiresAt: Date.now() + 60 * 60 * 1000 } } // 1 hour
  );

  await sendEmail(user.email, "Reset your TestMandi password", `${PUBLIC_APP_URL}/?reset=${resetToken}&uid=${user.id}`, "Reset password");
  res.json(genericResponse);
});

app.post("/api/auth/reset-password", authLimiter, async (req, res) => {
  const { uid, token, newPassword } = req.body || {};
  const user = await db.users.findOne({ id: uid });
  if (!user || !user.resetTokenHash || user.resetTokenHash !== hashToken(token || "") || user.resetTokenExpiresAt < Date.now()) {
    return res.status(400).json({ error: "That reset link is invalid or has expired — request a new one." });
  }
  if (!newPassword || newPassword.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters." });

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await db.users.updateOne(
    { id: uid },
    { $set: { passwordHash, resetTokenHash: null, resetTokenExpiresAt: null, refreshTokens: [] } } // log out everywhere
  );
  res.json({ ok: true });
});

app.get("/api/auth/me", auth, async (req, res) => {
  const user = await db.users.findOne({ id: req.user.sub });
  if (!user) return res.status(404).json({ error: "Account not found." });
  res.json({ user: publicUser(user) });
});

// Change your own email and/or password (any logged-in role — surfaced in
// the UI for admin first, since that account has no email-recovery flow
// worth relying on for itself).
app.post("/api/auth/update-account", auth, authLimiter, async (req, res) => {
  const { currentPassword, newEmail, newPassword } = req.body || {};
  if (!currentPassword) return res.status(400).json({ error: "Enter your current password to confirm this change." });
  const user = await db.users.findOne({ id: req.user.sub });
  if (!user) return res.status(404).json({ error: "Account not found." });

  const ok = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Current password is incorrect." });

  const update = {};
  if (newEmail && newEmail.trim().toLowerCase() !== user.email) {
    const email = newEmail.trim().toLowerCase();
    const taken = await db.users.findOne({ email, id: { $ne: user.id } });
    if (taken) return res.status(409).json({ error: "That email is already in use by another account." });
    update.email = email;
  }
  if (newPassword) {
    if (newPassword.length < 8) return res.status(400).json({ error: "New password must be at least 8 characters." });
    update.passwordHash = await bcrypt.hash(newPassword, 10);
    update.refreshTokens = []; // log out everywhere else on password change
  }
  if (Object.keys(update).length === 0) return res.status(400).json({ error: "Nothing to update." });

  await db.users.updateOne({ id: user.id }, { $set: update });
  const fresh = await db.users.findOne({ id: user.id });
  const session = await issueSession(fresh);
  res.json({ ...session, user: publicUser(fresh) });
});

/* ------------------------------------------------------------------ */
/* Settings — persisted, admin-controlled platform config              */
/* ------------------------------------------------------------------ */
const DEFAULT_SELLER_SHARE = 70;

async function getSellerSharePercent() {
  const doc = await db.meta.findOne({ _id: "settings" });
  return doc?.sellerSharePercent ?? DEFAULT_SELLER_SHARE;
}

app.get("/api/settings", async (req, res) => {
  res.json({ sellerSharePercent: await getSellerSharePercent() });
});

app.put("/api/admin/settings", auth, requireRole("admin"), async (req, res) => {
  const pct = Number(req.body?.sellerSharePercent);
  if (!Number.isFinite(pct) || pct < 10 || pct > 95) {
    return res.status(400).json({ error: "sellerSharePercent must be a number between 10 and 95." });
  }
  await db.meta.updateOne({ _id: "settings" }, { $set: { sellerSharePercent: pct } }, { upsert: true });
  res.json({ sellerSharePercent: pct });
});

/* ------------------------------------------------------------------ */
/* Categories                                                          */
/* ------------------------------------------------------------------ */
app.get("/api/categories", async (req, res) => {
  const doc = await db.meta.findOne({ _id: "categories" });
  res.json({ categories: doc?.list || [] });
});

app.post("/api/categories", auth, requireRole("admin"), async (req, res) => {
  const name = (req.body?.name || "").trim();
  if (!name) return res.status(400).json({ error: "Category name required." });
  const doc = await db.meta.findOne({ _id: "categories" });
  if ((doc?.list || []).some((c) => c.toLowerCase() === name.toLowerCase())) {
    return res.status(409).json({ error: "That category already exists." });
  }
  await db.meta.updateOne({ _id: "categories" }, { $push: { list: name } });
  const updated = await db.meta.findOne({ _id: "categories" });
  res.json({ categories: updated.list });
});

app.delete("/api/categories/:name", auth, requireRole("admin"), async (req, res) => {
  const name = req.params.name;
  const inUse = await db.tests.findOne({ category: name });
  if (inUse) return res.status(409).json({ error: "Category is still used by live tests — reassign or remove those first." });
  await db.meta.updateOne({ _id: "categories" }, { $pull: { list: name } });
  const updated = await db.meta.findOne({ _id: "categories" });
  res.json({ categories: updated.list });
});

/* ------------------------------------------------------------------ */
/* Tests                                                                */
/* ------------------------------------------------------------------ */
app.get("/api/tests", async (req, res) => {
  const all = await db.tests.find({}).toArray();
  res.json({ tests: all.filter((t) => !isBlockedTest(t)) });
});

app.get("/api/tests/mine", auth, requireRole("seller"), async (req, res) => {
  const mine = await db.tests.find({ sellerEmail: req.user.email }).toArray();
  const withSales = await Promise.all(mine.map(async (t) => {
    const sales = await db.purchases.find({ testId: t.id }).toArray();
    return { ...t, unitsSold: sales.length, gross: sales.reduce((s, p) => s + p.price, 0) };
  }));
  res.json({ tests: withSales });
});

app.post("/api/tests", auth, requireRole("seller"), async (req, res) => {
  const { title, category, price, duration, description, questions } = req.body || {};
  if (!title?.trim() || !category || !price || !duration || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: "Missing required test fields, or no questions supplied." });
  }
  const seller = await db.users.findOne({ email: req.user.email });
  const test = {
    id: "t_" + Date.now(),
    title: title.trim(), category, price: Number(price), duration: Number(duration),
    description: description || "", questions,
    sellerEmail: req.user.email, sellerName: sellerDisplayName(seller),
    rating: 0, ratingCount: 0, createdAt: Date.now(),
  };
  await db.tests.insertOne(test);
  res.json({ test });
});

app.delete("/api/tests/:id", auth, requireRole("admin"), async (req, res) => {
  const result = await db.tests.deleteOne({ id: req.params.id });
  if (result.deletedCount === 0) return res.status(404).json({ error: "Test not found." });
  // A test can't be sold on its own after this, but leave any bundle references
  // alone rather than silently rewriting a seller's bundle contents.
  res.json({ ok: true });
});

app.post("/api/tests/:id/rate", auth, requireRole("buyer"), async (req, res) => {
  const value = Number(req.body?.value);
  if (!value || value < 1 || value > 5) return res.status(400).json({ error: "Rating must be 1-5." });
  const test = await db.tests.findOne({ id: req.params.id });
  if (!test) return res.status(404).json({ error: "Test not found." });

  const directPurchase = await db.purchases.findOne({ testId: test.id, buyerEmail: req.user.email });
  let purchased = !!directPurchase;
  if (!purchased) {
    const myBundlePurchases = await db.bundlePurchases.find({ buyerEmail: req.user.email }).toArray();
    for (const p of myBundlePurchases) {
      const bundle = await db.bundles.findOne({ id: p.bundleId });
      if (bundle?.testIds.includes(test.id)) { purchased = true; break; }
    }
  }
  if (!purchased) return res.status(403).json({ error: "You can only rate tests you've purchased." });

  const buyer = await db.users.findOne({ email: req.user.email });
  const ratedTestIds = buyer.ratedTestIds || [];
  if (ratedTestIds.includes(test.id)) return res.status(409).json({ error: "You've already rated this test." });

  const newCount = test.ratingCount + 1;
  const newRating = (test.rating * test.ratingCount + value) / newCount;
  await db.tests.updateOne({ id: test.id }, { $set: { rating: newRating, ratingCount: newCount } });
  await db.users.updateOne({ id: buyer.id }, { $push: { ratedTestIds: test.id } });

  const updatedTest = await db.tests.findOne({ id: test.id });
  res.json({ test: updatedTest });
});

/* ------------------------------------------------------------------ */
/* Bundles                                                              */
/* ------------------------------------------------------------------ */
app.get("/api/bundles", async (req, res) => {
  const all = await db.bundles.find({}).toArray();
  res.json({ bundles: all });
});

app.get("/api/bundles/mine", auth, requireRole("seller"), async (req, res) => {
  const mine = await db.bundles.find({ sellerEmail: req.user.email }).toArray();
  const withSales = await Promise.all(mine.map(async (b) => {
    const sales = await db.bundlePurchases.find({ bundleId: b.id }).toArray();
    return { ...b, unitsSold: sales.length, gross: sales.reduce((s, p) => s + p.price, 0) };
  }));
  res.json({ bundles: withSales });
});

app.post("/api/bundles", auth, requireRole("seller"), async (req, res) => {
  const { title, description, price, testIds } = req.body || {};
  if (!title?.trim() || !price || !Array.isArray(testIds) || testIds.length < 2) {
    return res.status(400).json({ error: "A bundle needs a title, a price, and at least 2 tests." });
  }
  const ownedTests = await db.tests.find({ id: { $in: testIds }, sellerEmail: req.user.email }).toArray();
  if (ownedTests.length !== testIds.length) return res.status(403).json({ error: "You can only bundle your own published tests." });

  const seller = await db.users.findOne({ email: req.user.email });
  const bundle = {
    id: "b_" + Date.now(), title: title.trim(), description: description || "", price: Number(price), testIds,
    sellerEmail: req.user.email, sellerName: sellerDisplayName(seller), createdAt: Date.now(),
  };
  await db.bundles.insertOne(bundle);
  res.json({ bundle });
});

app.delete("/api/bundles/:id", auth, requireRole("admin"), async (req, res) => {
  const result = await db.bundles.deleteOne({ id: req.params.id });
  if (result.deletedCount === 0) return res.status(404).json({ error: "Bundle not found." });
  res.json({ ok: true });
});

/* ------------------------------------------------------------------ */
/* Ads                                                                  */
/* ------------------------------------------------------------------ */
app.get("/api/ads", async (req, res) => {
  const active = await db.ads.find({ endTs: { $gt: Date.now() } }).toArray();
  res.json({ ads: active });
});

app.get("/api/ads/mine", auth, requireRole("advertiser"), async (req, res) => {
  const mine = await db.ads.find({ advertiserEmail: req.user.email }).sort({ startTs: -1 }).toArray();
  res.json({ ads: mine });
});

app.delete("/api/ads/:id", auth, requireRole("admin"), async (req, res) => {
  const result = await db.ads.deleteOne({ id: req.params.id });
  if (result.deletedCount === 0) return res.status(404).json({ error: "Ad not found." });
  res.json({ ok: true });
});

/* ------------------------------------------------------------------ */
/* Referrals                                                            */
/* ------------------------------------------------------------------ */
app.get("/api/referrals/mine", auth, requireRole("buyer"), async (req, res) => {
  const user = await db.users.findOne({ email: req.user.email });
  const referredCount = await db.users.countDocuments({ referredBy: user.email });
  res.json({ referralCode: user.referralCode, referredCount, rewards: user.referralRewards || [] });
});

/* ------------------------------------------------------------------ */
/* Checkout — real Razorpay order creation + signature verification.   */
/* The server always computes the amount itself (never trusts a client-  */
/* sent price) and remembers what each order was for, so verify() can't  */
/* be tricked into unlocking something the buyer didn't actually pay for. */
/* ------------------------------------------------------------------ */
app.post("/api/checkout/create-order", auth, authLimiter, async (req, res) => {
  if (!razorpay) return res.status(503).json({ error: "Payments aren't configured yet — add RAZORPAY_KEY_ID / SECRET to .env." });

  const { kind, itemId, adDraft, applyReward } = req.body || {};
  let amount, description, rewardId = null;

  if (kind === "test" || kind === "bundle") {
    if (req.user.role !== "buyer") return res.status(403).json({ error: "Only buyer accounts can purchase tests or bundles." });
    const item = kind === "test" ? await db.tests.findOne({ id: itemId }) : await db.bundles.findOne({ id: itemId });
    if (!item) return res.status(404).json({ error: "Item not found." });
    amount = item.price;
    description = item.title;

    if (applyReward) {
      const buyer = await db.users.findOne({ email: req.user.email });
      const reward = (buyer.referralRewards || []).find((r) => !r.used);
      if (reward) { rewardId = reward.id; amount = Math.round(amount * 0.5); }
    }
  } else if (kind === "ad") {
    if (req.user.role !== "advertiser") return res.status(403).json({ error: "Only advertiser accounts can purchase ads." });
    if (!adDraft?.headline?.trim() || !adDraft?.body?.trim() || !adDraft?.days || adDraft.days < 1) {
      return res.status(400).json({ error: "Ad headline, text, and at least 1 day are required." });
    }
    const catDoc = await db.meta.findOne({ _id: "categories" });
    if (adDraft.placement !== "homepage" && !(catDoc?.list || []).includes(adDraft.placement)) {
      return res.status(400).json({ error: "Invalid ad placement." });
    }
    const costPerDay = adDraft.placement === "homepage" ? AD_COST_HOMEPAGE : AD_COST_CATEGORY;
    amount = costPerDay * Number(adDraft.days);
    description = `Ad: ${adDraft.headline}`;
  } else {
    return res.status(400).json({ error: "Invalid checkout kind." });
  }

  // Free items (price 0, or a reward discount that brings it to 0) never touch
  // Razorpay at all — Razorpay doesn't support zero-amount orders anyway, and
  // there's nothing to pay for.
  if (amount <= 0) {
    const pending = { kind, itemId: itemId || null, adDraft: adDraft || null, rewardId, amount: 0 };
    const result = await completeCheckout(pending, req.user.email, null);
    return res.json({ free: true, success: true, ...result });
  }

  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency: "INR",
      receipt: `${kind}_${Date.now()}`,
    });

    await db.pendingOrders.insertOne({
      orderId: order.id, kind, itemId: itemId || null, adDraft: adDraft || null, rewardId,
      amount, buyerEmail: req.user.email, createdAt: Date.now(),
    });

    res.json({ order, keyId: process.env.RAZORPAY_KEY_ID, amount, description });
  } catch (err) {
    const detail = err?.error?.description || err?.message || JSON.stringify(err);
    console.error("Razorpay create-order error:", detail);
    res.status(502).json({ error: "Razorpay order creation failed.", detail });
  }
});

async function completeCheckout(pending, buyerEmail, paymentId) {
  let result;
  if (pending.kind === "ad") {
    const advertiser = await db.users.findOne({ email: buyerEmail });
    const ad = {
      id: "ad_" + Date.now(), advertiserEmail: buyerEmail, advertiserName: sellerDisplayName(advertiser),
      headline: pending.adDraft.headline, body: pending.adDraft.body, placement: pending.adDraft.placement,
      days: Number(pending.adDraft.days), cost: pending.amount,
      startTs: Date.now(), endTs: Date.now() + Number(pending.adDraft.days) * 86400000,
    };
    await db.ads.insertOne(ad);
    result = { ad };
  } else {
    const priorTestPurchases = await db.purchases.countDocuments({ buyerEmail });
    const priorBundlePurchases = await db.bundlePurchases.countDocuments({ buyerEmail });
    const isFirstPurchase = priorTestPurchases === 0 && priorBundlePurchases === 0;

    if (pending.kind === "bundle") {
      const purchase = {
        id: "bp_" + Date.now(), bundleId: pending.itemId, buyerEmail,
        price: pending.amount, paymentId: paymentId || null, ts: Date.now(),
      };
      await db.bundlePurchases.insertOne(purchase);
      result = { purchase };
    } else {
      const purchase = {
        id: "p_" + Date.now(), testId: pending.itemId, buyerEmail,
        price: pending.amount, paymentId: paymentId || null, ts: Date.now(),
      };
      await db.purchases.insertOne(purchase);
      result = { purchase };
    }

    const buyer = await db.users.findOne({ email: buyerEmail });
    if (pending.rewardId) {
      const updatedRewards = (buyer.referralRewards || []).map((r) => (r.id === pending.rewardId ? { ...r, used: true } : r));
      await db.users.updateOne({ id: buyer.id }, { $set: { referralRewards: updatedRewards } });
    }
    if (isFirstPurchase && buyer.referredBy && !buyer.referralBonusGranted) {
      await db.users.updateOne({ id: buyer.id }, { $set: { referralBonusGranted: true } });
      await db.users.updateOne(
        { email: buyer.referredBy },
        { $push: { referralRewards: { id: "rw_" + Date.now(), ts: Date.now(), used: false, fromBuyerName: buyer.name } } }
      );
    }
  }
  return result;
}

app.post("/api/checkout/verify", auth, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: "Missing payment verification fields." });
  }

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");
  if (expected !== razorpay_signature) {
    return res.status(400).json({ error: "Payment signature verification failed — this payment was not recorded." });
  }

  const pending = await db.pendingOrders.findOne({ orderId: razorpay_order_id, buyerEmail: req.user.email });
  if (!pending) return res.status(404).json({ error: "No matching pending order found for this account." });
  await db.pendingOrders.deleteOne({ orderId: razorpay_order_id });

  const result = await completeCheckout(pending, req.user.email, razorpay_payment_id);
  res.json({ success: true, ...result });
});

app.get("/api/purchases/mine", auth, requireRole("buyer"), async (req, res) => {
  const mine = await db.purchases.find({ buyerEmail: req.user.email }).toArray();
  res.json({ purchases: mine });
});

app.get("/api/bundle-purchases/mine", auth, requireRole("buyer"), async (req, res) => {
  const mine = await db.bundlePurchases.find({ buyerEmail: req.user.email }).toArray();
  res.json({ bundlePurchases: mine });
});

/* ------------------------------------------------------------------ */
/* Attempts                                                             */
/* ------------------------------------------------------------------ */
app.post("/api/attempts", auth, requireRole("buyer"), async (req, res) => {
  const { testId, score, total, answers, topicMap, timeTakenSeconds } = req.body || {};
  const purchasedDirectly = await db.purchases.findOne({ testId, buyerEmail: req.user.email });
  let unlockedViaBundle = false;
  if (!purchasedDirectly) {
    const myBundlePurchases = await db.bundlePurchases.find({ buyerEmail: req.user.email }).toArray();
    for (const p of myBundlePurchases) {
      const bundle = await db.bundles.findOne({ id: p.bundleId });
      if (bundle?.testIds.includes(testId)) { unlockedViaBundle = true; break; }
    }
  }
  if (!purchasedDirectly && !unlockedViaBundle) return res.status(403).json({ error: "You can only attempt tests you've purchased." });

  const attempt = {
    id: "a_" + Date.now(), testId, buyerEmail: req.user.email,
    score, total, answers, topicMap, timeTakenSeconds, ts: Date.now(), ratingGiven: null,
  };
  await db.attempts.insertOne(attempt);
  res.json({ attempt });
});

app.get("/api/attempts/mine", auth, requireRole("buyer"), async (req, res) => {
  const mine = await db.attempts.find({ buyerEmail: req.user.email }).toArray();
  res.json({ attempts: mine });
});

/* ------------------------------------------------------------------ */
/* Seller payouts                                                       */
/* ------------------------------------------------------------------ */
app.post("/api/payouts/bank", auth, requireRole("seller"), async (req, res) => {
  const { accName, accountNumber, ifsc, bankName, upiId } = req.body || {};
  const hasBank = accountNumber?.trim() && ifsc?.trim() && bankName?.trim();
  const hasUpi = upiId?.trim();
  if (!accName?.trim() || (!hasBank && !hasUpi)) {
    return res.status(400).json({ error: "Enter your name, plus either full bank details or a UPI ID." });
  }
  // Loose but real validation — VPA-style id like name@bank.
  if (hasUpi && !/^[\w.+-]{2,}@[a-zA-Z]{2,}$/.test(upiId.trim())) {
    return res.status(400).json({ error: "That doesn't look like a valid UPI ID (e.g. yourname@upi)." });
  }

  const bankDetails = {
    accName: accName.trim(),
    ...(hasBank ? { last4: accountNumber.slice(-4), ifsc: ifsc.trim().toUpperCase(), bankName: bankName.trim() } : {}),
    ...(hasUpi ? { upiId: upiId.trim().toLowerCase() } : {}),
  };
  const update = { bankDetails };

  if (RAZORPAYX_ENABLED && hasBank) {
    try {
      // Reuse an existing Contact for this seller if we've already made one,
      // rather than creating a new one every time they update their bank details.
      const existing = await db.users.findOne({ email: req.user.email });
      let contactId = existing?.razorpayContactId;
      if (!contactId) {
        const contact = await razorpayXRequest("/contacts", {
          name: accName.trim(), email: req.user.email, type: "vendor", reference_id: req.user.sub,
        });
        contactId = contact.id;
      }
      const fundAccount = await razorpayXRequest("/fund_accounts", {
        contact_id: contactId, account_type: "bank_account",
        bank_account: { name: accName.trim(), ifsc: ifsc.trim().toUpperCase(), account_number: accountNumber.replace(/\s+/g, "") },
      });
      update.razorpayContactId = contactId;
      update.razorpayFundAccountId = fundAccount.id;
      update.payoutsReady = true;
    } catch (err) {
      console.error("RazorpayX contact/fund-account creation failed:", err.message);
      // Still save the display bank details below — better than losing the
      // seller's input — but flag that real payouts aren't wired up for them yet.
      update.payoutsReady = false;
    }
  } else {
    // UPI-only sellers (or RazorpayX not configured) always go through manual
    // admin review — there's no automated UPI payout path here.
    update.payoutsReady = false;
  }

  await db.users.updateOne({ email: req.user.email }, { $set: update });
  res.json({ bankDetails, payoutsReady: update.payoutsReady ?? false });
});

async function sellerGrossEarnings(sellerEmail) {
  const myTests = await db.tests.find({ sellerEmail }).toArray();
  const myBundles = await db.bundles.find({ sellerEmail }).toArray();
  const myTestIds = myTests.map((t) => t.id);
  const myBundleIds = myBundles.map((b) => b.id);
  const testSales = await db.purchases.find({ testId: { $in: myTestIds } }).toArray();
  const bundleSales = await db.bundlePurchases.find({ bundleId: { $in: myBundleIds } }).toArray();
  return testSales.reduce((s, p) => s + p.price, 0) + bundleSales.reduce((s, p) => s + p.price, 0);
}

app.get("/api/payouts/mine", auth, requireRole("seller"), async (req, res) => {
  const user = await db.users.findOne({ email: req.user.email });
  const gross = await sellerGrossEarnings(req.user.email);
  const history = await db.payouts.find({ sellerEmail: req.user.email }).toArray();
  // A failed transfer never actually left the business account, so it must
  // not count against how much the seller has "used up" of their earnings —
  // otherwise a failed payout would permanently strand that money.
  const withdrawn = history.filter((p) => !["Failed", "Rejected"].includes(p.status)).reduce((s, p) => s + p.amount, 0);
  res.json({
    bankDetails: user.bankDetails, history, grossEarnings: gross, withdrawn,
    payoutsReady: !!user.payoutsReady, // true = withdrawals are real bank transfers; false = simulated
  });
});

app.post("/api/payouts/withdraw", auth, requireRole("seller"), async (req, res) => {
  const user = await db.users.findOne({ email: req.user.email });
  if (!user.bankDetails) return res.status(400).json({ error: "Add your bank details first." });

  const sellerShare = await getSellerSharePercent();
  const gross = await sellerGrossEarnings(req.user.email);
  const earn = Math.round(gross * (sellerShare / 100));
  const history = await db.payouts.find({ sellerEmail: req.user.email }).toArray();
  const alreadyWithdrawn = history.filter((p) => !["Failed", "Rejected"].includes(p.status)).reduce((s, p) => s + p.amount, 0);
  const available = Math.max(0, earn - alreadyWithdrawn);
  if (available <= 0) return res.status(400).json({ error: "Nothing available to withdraw." });

  const record = { id: "w_" + Date.now(), sellerEmail: req.user.email, amount: available, status: "Processing", ts: Date.now() };

  if (RAZORPAYX_ENABLED && user.razorpayFundAccountId) {
    try {
      const payout = await razorpayXRequest("/payouts", {
        account_number: process.env.RAZORPAYX_ACCOUNT_NUMBER,
        fund_account_id: user.razorpayFundAccountId,
        amount: Math.round(available * 100), // paise
        currency: "INR",
        mode: "IMPS",
        purpose: "payout",
        queue_if_low_balance: true,
        reference_id: record.id,
        narration: "TestMandi seller earnings",
      }, { "X-Payout-Idempotency": crypto.randomUUID() });

      record.razorpayPayoutId = payout.id;
      record.status = mapPayoutStatus(payout.status);
      await db.payouts.insertOne(record);
      return res.json({ payout: record });
    } catch (err) {
      console.error("RazorpayX payout failed:", err.message);
      return res.status(502).json({ error: "The bank transfer couldn't be started — please try again shortly, or contact support if it keeps failing.", detail: err.message });
    }
  }

  // Fallback: no RazorpayX fund account on file for this seller (either
  // RazorpayX isn't configured on this deployment yet, or their bank-details
  // save didn't complete a fund account setup). Rather than pretending money
  // moved, this queues the request for an admin to pay manually (bank
  // transfer/UPI) and mark as paid — see /api/admin/payouts.
  record.status = "Pending admin review";
  await db.payouts.insertOne(record);
  res.json({ payout: record, manualReview: true });
});

// RazorpayX calls this when a payout's status changes asynchronously (e.g. a
// queued payout finally clears, or an IMPS transfer that started "processing"
// later completes or fails). Configure this URL as a webhook in your Razorpay
// dashboard (Account & Settings -> Webhooks) with the "payout" events enabled,
// using the same secret as RAZORPAYX_WEBHOOK_SECRET below.
app.post("/api/webhooks/razorpayx-payout", async (req, res) => {
  const secret = process.env.RAZORPAYX_WEBHOOK_SECRET;
  if (!secret) return res.status(503).json({ error: "Webhook secret not configured." });

  const signature = req.headers["x-razorpay-signature"];
  const expected = crypto.createHmac("sha256", secret).update(req.rawBody).digest("hex");
  if (signature !== expected) return res.status(400).json({ error: "Invalid webhook signature." });

  const event = req.body;
  const payoutEntity = event?.payload?.payout?.entity;
  if (payoutEntity?.id) {
    await db.payouts.updateOne(
      { razorpayPayoutId: payoutEntity.id },
      { $set: { status: mapPayoutStatus(payoutEntity.status) } }
    );
  }
  res.json({ ok: true });
});

/* ------------------------------------------------------------------ */
/* Notifications                                                        */
/* ------------------------------------------------------------------ */
app.get("/api/notifications", auth, async (req, res) => {
  const relevant = await db.notifications.find({ $or: [{ audience: "both" }, { audience: req.user.role }] }).sort({ ts: -1 }).toArray();
  res.json({ notifications: relevant });
});

app.post("/api/notifications", auth, requireRole("admin"), async (req, res) => {
  const { title, message, audience, offerCode } = req.body || {};
  if (!title?.trim() || !message?.trim()) return res.status(400).json({ error: "Title and message are required." });
  const n = { id: "n_" + Date.now(), title: title.trim(), message: message.trim(), audience: audience || "both", offerCode: offerCode || null, ts: Date.now() };
  await db.notifications.insertOne(n);
  res.json({ notification: n });
});

/* ------------------------------------------------------------------ */
/* Admin                                                                */
/* ------------------------------------------------------------------ */
app.get("/api/admin/accounts", auth, requireRole("admin"), async (req, res) => {
  const all = await db.users.find({}).toArray();
  res.json({ users: all.map(publicUser) });
});

app.delete("/api/admin/accounts/:email", auth, requireRole("admin"), async (req, res) => {
  await db.users.deleteOne({ email: req.params.email });
  res.json({ ok: true });
});

app.get("/api/admin/overview", auth, requireRole("admin"), async (req, res) => {
  const purchases = await db.purchases.find({}).toArray();
  const gmv = purchases.reduce((s, p) => s + p.price, 0);
  res.json({
    gmv,
    testsLive: await db.tests.countDocuments(),
    sellers: await db.users.countDocuments({ role: "seller" }),
    buyers: await db.users.countDocuments({ role: "buyer" }),
  });
});

// Full data dump for the admin dashboard's revenue-by-seller and catalogue
// tables — small enough at this scale to just ship everything at once
// rather than build a dozen narrow aggregation endpoints.
app.get("/api/admin/all-data", auth, requireRole("admin"), async (req, res) => {
  const [tests, bundles, purchases, bundlePurchases, ads] = await Promise.all([
    db.tests.find({}).toArray(),
    db.bundles.find({}).toArray(),
    db.purchases.find({}).toArray(),
    db.bundlePurchases.find({}).toArray(),
    db.ads.find({}).toArray(),
  ]);
  res.json({ tests, bundles, purchases, bundlePurchases, ads });
});

// Sellers without a RazorpayX fund account get queued here instead of an
// automatic transfer — an admin pays them manually (bank transfer/UPI
// outside this system) and confirms it below.
app.get("/api/admin/payouts", auth, requireRole("admin"), async (req, res) => {
  const payouts = await db.payouts.find({ status: "Pending admin review" }).sort({ ts: 1 }).toArray();
  const emails = [...new Set(payouts.map((p) => p.sellerEmail))];
  const sellers = await db.users.find({ email: { $in: emails } }).toArray();
  const bankBySeller = Object.fromEntries(sellers.map((u) => [u.email, { name: u.businessName || u.name, bankDetails: u.bankDetails }]));
  res.json({ payouts: payouts.map((p) => ({ ...p, seller: bankBySeller[p.sellerEmail] })) });
});

app.post("/api/admin/payouts/:id/resolve", auth, requireRole("admin"), async (req, res) => {
  const { outcome, reference } = req.body || {}; // outcome: 'paid' | 'rejected'
  if (!["paid", "rejected"].includes(outcome)) return res.status(400).json({ error: "outcome must be 'paid' or 'rejected'." });
  const payout = await db.payouts.findOne({ id: req.params.id });
  if (!payout) return res.status(404).json({ error: "Payout not found." });
  if (payout.status !== "Pending admin review") return res.status(400).json({ error: "This payout has already been resolved." });

  await db.payouts.updateOne({ id: req.params.id }, { $set: {
    status: outcome === "paid" ? "Completed" : "Rejected",
    manualReference: reference || null,
    resolvedAt: Date.now(),
  } });
  res.json({ ok: true });
});

/* ------------------------------------------------------------------ */
/* Support chatbot proxy (keeps the Anthropic API key server-side)      */
/* ------------------------------------------------------------------ */
const chatLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, max: 30, standardHeaders: true, legacyHeaders: false,
  message: { error: "Too many chat messages — please slow down a little." },
});

app.post("/api/chat", chatLimiter, async (req, res) => {
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.includes("your-key-here")) {
    return res.status(503).json({ error: "Chatbot isn't configured yet — add ANTHROPIC_API_KEY to .env." });
  }
  const { messages, roleHint, name } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) return res.status(400).json({ error: "No messages supplied." });

  const catDoc = await db.meta.findOne({ _id: "categories" });
  const categories = (catDoc?.list || []).join(", ");
  const who = roleHint ? `They are logged in as a ${roleHint} named ${name || "a user"}.` : "They are not logged in yet.";
  const system = `You are the support assistant embedded in TestMandi, a B2B MCQ test marketplace for Indian competitive exams.
Sellers (teachers, institutes, schools, exam bodies) configure and publish MCQ tests via Seller Studio. Buyers (candidates)
browse the Marketplace by category (${categories}), buy a test through Razorpay checkout, attempt it under My Learning, and
get an instant score report with topic-wise analysis, accuracy, and time taken. Sellers withdraw earnings to their bank
account from a Bank & payouts panel. Buyers can rate a test 1-5 stars; a test with more than 10 ratings averaging below 3
stars is automatically hidden from the marketplace. Admins manage the profit split, exam categories, and accounts.
${who}
Answer briefly (2-5 sentences, plain language, no markdown headers). Don't invent policies you weren't told about here.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 400,
        system,
        messages: messages.map((m) => ({ role: m.role, content: m.text })),
      }),
    });
    const data = await response.json();
    const reply = (data.content || []).filter((c) => c.type === "text").map((c) => c.text).join("\n").trim();
    res.json({ reply: reply || "Sorry, I couldn't find an answer to that — try rephrasing?" });
  } catch (err) {
    res.status(502).json({ error: "Couldn't reach the chatbot right now.", detail: err.message });
  }
});

/* ------------------------------------------------------------------ */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`TestMandi API listening on http://localhost:${PORT}`));
