// 1) Makes sure the "Raise" seller account (raiseacademy999@gmail.com) exists —
//    this becomes the owner of all official TestMandi tests going forward.
// 2) Moves every test/bundle/coupon/pass previously listed under
//    official@testmandi.in over to that account.
// 3) Upserts the chapter-wise NEET + JEE Main tests (20 Q, Rs29, 20 min).
//
// Safe to re-run — everything is idempotent.
// A newly created account gets a random password nobody knows; the owner sets
// their own through "Forgot password" on the login screen.

import "dotenv/config";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OLD_EMAIL = "official@testmandi.in";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set — skipping seed (deploy will continue).");
    return;
  }
  const data = JSON.parse(readFileSync(join(__dirname, "data-chapter-tests.json"), "utf-8"));
  const { sellerEmail, sellerName, tests: TESTS } = data;

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB_NAME || "testmandi");
  const users = db.collection("users");

  // ---- 1) seller account -------------------------------------------------
  let seller = await users.findOne({ email: sellerEmail });
  if (!seller) {
    const base = sellerName.replace(/[^a-zA-Z]/g, "").slice(0, 4).toUpperCase() || "USER";
    seller = {
      id: "u_" + Date.now(),
      role: "seller", name: sellerName, email: sellerEmail, phone: "",
      businessName: sellerName,
      passwordHash: await bcrypt.hash(crypto.randomBytes(24).toString("hex"), 10),
      bankDetails: null, createdAt: Date.now(),
      emailVerified: true, otpHash: null, otpExpiresAt: null, otpAttempts: 0,
      resetTokenHash: null, resetTokenExpiresAt: null, refreshTokens: [],
      referralCode: `${base}${Math.floor(1000 + Math.random() * 9000)}`,
      referredBy: null, referralBonusGranted: false, sellerReferralBonusTotal: 0, sellerReferralHistory: [],
      lastActiveAt: Date.now(),
    };
    await users.insertOne(seller);
    console.log(`Created seller account ${sellerEmail} ("${sellerName}") — use Forgot password to set a password.`);
  } else if (seller.role !== "seller") {
    console.warn(`WARNING: ${sellerEmail} exists with role "${seller.role}", not seller — tests will still be attached to it.`);
  } else {
    console.log(`Seller account ${sellerEmail} already exists.`);
  }
  const displayName = seller.businessName || seller.name || sellerName;

  // ---- 2) move official content to the new owner --------------------------
  for (const coll of ["tests", "bundles", "coupons", "scheduledTests", "allAccessPasses", "payouts"]) {
    const filter = { sellerEmail: OLD_EMAIL };
    const set = coll === "tests" || coll === "bundles"
      ? { sellerEmail, sellerName: displayName }
      : { sellerEmail };
    const r = await db.collection(coll).updateMany(filter, { $set: set });
    if (r.modifiedCount) console.log(`Moved ${r.modifiedCount} ${coll} from ${OLD_EMAIL} to ${sellerEmail}.`);
  }
  const grants = await db.collection("allAccessGrants").updateMany({ sellerEmail: OLD_EMAIL }, { $set: { sellerEmail } });
  if (grants.modifiedCount) console.log(`Moved ${grants.modifiedCount} allAccessGrants.`);

  // ---- 3) chapter tests ---------------------------------------------------
  const tests = db.collection("tests");
  let added = 0, refreshed = 0;
  for (const t of TESTS) {
    const exists = await tests.findOne({ id: t.id });
    await tests.updateOne(
      { id: t.id },
      {
        $set: {
          title: t.title, category: t.category, price: t.price, duration: t.duration,
          description: t.description, questions: t.questions,
          sellerEmail, sellerName: displayName,
        },
        $setOnInsert: { id: t.id, rating: 0, ratingCount: 0, createdAt: Date.now() },
      },
      { upsert: true }
    );
    exists ? refreshed++ : added++;
  }
  console.log(`\nChapter tests done — ${added} test(s) added, ${refreshed} refreshed.`);
  const owned = await tests.countDocuments({ sellerEmail });
  const stillOld = await tests.countDocuments({ sellerEmail: OLD_EMAIL });
  console.log(`Tests now owned by ${sellerEmail}: ${owned}. Still under ${OLD_EMAIL}: ${stillOld}.`);
  await client.close();
}

main().catch((err) => {
  console.error("Seeding failed (deploy will continue):", err);
});
