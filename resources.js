// Teaching resources — worksheets, notes, slides, question banks and other
// downloadable files that teachers sell alongside MCQ tests.
//
// Files live in an S3-compatible bucket (a Railway bucket in production),
// never in MongoDB. The bucket stays private: buyers get a short-lived signed
// download link only after the access check below, and cover/preview images
// are streamed through this API so nothing in the bucket is ever public.
import multer from "multer";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Defaults only — admins can add/remove types and class levels (stored in
// meta._id "resourceTaxonomy"); see getTaxonomy() below.
export const RESOURCE_TYPES = ["Worksheet", "Notes", "Question bank", "Slides", "Activity", "Lesson plan", "Study guide", "Other"];
export const RESOURCE_GRADES = ["Pre-primary", "Class 1-5", "Class 6-8", "Class 9-10", "Class 11-12", "College", "Competitive exams"];
export const RESOURCE_LANGUAGES = ["English", "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam", "Marathi", "Bengali", "Gujarati", "Other"];

const MAX_FILE_BYTES = 50 * 1024 * 1024;   // the resource itself
const MAX_IMAGE_BYTES = 3 * 1024 * 1024;   // cover / each preview page
const MAX_PREVIEWS = 4;
const DOWNLOAD_LINK_TTL_SECONDS = 5 * 60;

const FILE_TYPES = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/zip": "zip",
  "application/x-zip-compressed": "zip",
};
const FILE_EXTENSIONS = new Set(["pdf", "docx", "pptx", "xlsx", "zip"]);
const IMAGE_TYPES = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" };

/* ------------------------------------------------------------------ */
/* Storage                                                             */
/* ------------------------------------------------------------------ */
const bucketName = process.env.BUCKET_NAME;
const storageEnabled = !!(bucketName && process.env.BUCKET_ENDPOINT && process.env.BUCKET_ACCESS_KEY_ID && process.env.BUCKET_SECRET_ACCESS_KEY);
const s3 = storageEnabled
  ? new S3Client({
      endpoint: process.env.BUCKET_ENDPOINT,
      region: process.env.BUCKET_REGION || "auto",
      forcePathStyle: process.env.BUCKET_PATH_STYLE === "true",
      credentials: {
        accessKeyId: process.env.BUCKET_ACCESS_KEY_ID,
        secretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY,
      },
    })
  : null;

console.log(storageEnabled
  ? `Resource file storage configured (bucket ${bucketName}).`
  : "Resource file storage not configured — set BUCKET_* variables to enable resource uploads. See .env.example.");

async function putObject(key, buffer, contentType) {
  await s3.send(new PutObjectCommand({ Bucket: bucketName, Key: key, Body: buffer, ContentType: contentType }));
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_BYTES, files: 2 + MAX_PREVIEWS },
}).fields([
  { name: "file", maxCount: 1 },
  { name: "cover", maxCount: 1 },
  { name: "previews", maxCount: MAX_PREVIEWS },
]);

// Wraps multer so size/count errors come back as a readable JSON message
// instead of Express's default HTML error page.
function handleUpload(req, res, next) {
  upload(req, res, (err) => {
    if (!err) return next();
    const msg = err.code === "LIMIT_FILE_SIZE" ? "That file is too large. The limit is 50 MB for the resource and 3 MB per image."
      : err.code === "LIMIT_FILE_COUNT" || err.code === "LIMIT_UNEXPECTED_FILE" ? `Upload one resource file, one cover image and up to ${MAX_PREVIEWS} preview images.`
      : "The upload failed. Please try again.";
    res.status(400).json({ error: msg });
  });
}

function extOf(name) {
  return (name || "").split(".").pop().toLowerCase();
}

function safeFileName(name) {
  return (name || "resource").replace(/[^\w.\- ]+/g, "").trim().slice(0, 120) || "resource";
}

/* ------------------------------------------------------------------ */
/* Shapes                                                              */
/* ------------------------------------------------------------------ */
// What anyone can see. Storage keys never leave the server.
export function publicResource(r) {
  if (!r) return null;
  const { _id, fileKey, coverKey, previewKeys, ...rest } = r;
  return { ...rest, hasCover: !!coverKey, previewCount: (previewKeys || []).length };
}

function cleanTags(tags) {
  const list = Array.isArray(tags) ? tags : String(tags || "").split(",");
  return [...new Set(list.map((t) => String(t).trim()).filter(Boolean))].slice(0, 8).map((t) => t.slice(0, 30));
}

export async function hasResourceAccess(db, buyerEmail, resource) {
  if (!resource) return false;
  return !!(await db.resourcePurchases.findOne({ resourceId: resource.id, buyerEmail }));
}

/* ------------------------------------------------------------------ */
/* Routes                                                              */
/* ------------------------------------------------------------------ */
export function registerResourceRoutes(app, { db, auth, requireRole, sellerDisplayName, onPublished }) {
  let listCache = { at: 0, body: null };
  const LIST_TTL_MS = 60 * 1000;
  const invalidate = () => { listCache = { at: 0, body: null }; };

  // Resource categories (types) and class levels are admin-managed, like
  // exam categories for tests. Seeded with the defaults on first use.
  async function getTaxonomy() {
    let doc = await db.meta.findOne({ _id: "resourceTaxonomy" });
    if (!doc) {
      doc = { _id: "resourceTaxonomy", types: RESOURCE_TYPES, grades: RESOURCE_GRADES };
      await db.meta.updateOne({ _id: "resourceTaxonomy" }, { $setOnInsert: { types: doc.types, grades: doc.grades } }, { upsert: true });
    }
    return { types: doc.types || [], grades: doc.grades || [] };
  }

  app.get("/api/resources/options", async (req, res) => {
    const { types, grades } = await getTaxonomy();
    res.json({ types, grades, languages: RESOURCE_LANGUAGES, uploadsEnabled: storageEnabled });
  });

  const TAXONOMY_FIELD = { types: "resourceType", grades: "grade" };

  app.post("/api/admin/resource-taxonomy/:list", auth, requireRole("admin"), async (req, res) => {
    const list = req.params.list;
    if (!TAXONOMY_FIELD[list]) return res.status(404).json({ error: "Unknown list." });
    const name = String(req.body?.name || "").trim().slice(0, 40);
    if (!name) return res.status(400).json({ error: "Enter a name." });
    const tax = await getTaxonomy();
    if (tax[list].some((x) => x.toLowerCase() === name.toLowerCase())) return res.status(409).json({ error: "That one already exists." });
    await db.meta.updateOne({ _id: "resourceTaxonomy" }, { $push: { [list]: name } });
    res.json(await getTaxonomy());
  });

  app.delete("/api/admin/resource-taxonomy/:list/:name", auth, requireRole("admin"), async (req, res) => {
    const list = req.params.list;
    if (!TAXONOMY_FIELD[list]) return res.status(404).json({ error: "Unknown list." });
    const name = req.params.name;
    const inUse = await db.resources.countDocuments({ [TAXONOMY_FIELD[list]]: name, status: "live" });
    if (inUse > 0) return res.status(409).json({ error: `"${name}" is used by ${inUse} live resource(s). Remove or change those first.` });
    await getTaxonomy();
    await db.meta.updateOne({ _id: "resourceTaxonomy" }, { $pull: { [list]: name } });
    res.json(await getTaxonomy());
  });

  app.get("/api/resources", async (req, res) => {
    try {
      if (!listCache.body || Date.now() - listCache.at > LIST_TTL_MS) {
        const rows = await db.resources.find({ status: "live" }).sort({ createdAt: -1 }).toArray();
        listCache = { at: Date.now(), body: { resources: rows.map(publicResource) } };
      }
      res.set("Cache-Control", "public, max-age=30");
      res.json(listCache.body);
    } catch (err) {
      console.error("Listing resources failed:", err.message);
      res.status(500).json({ error: "Couldn't load resources right now." });
    }
  });

  app.get("/api/resources/mine", auth, requireRole("seller"), async (req, res) => {
    const mine = await db.resources.find({ sellerEmail: req.user.email, status: { $ne: "removed" } }).sort({ createdAt: -1 }).toArray();
    const withSales = await Promise.all(mine.map(async (r) => {
      const sales = await db.resourcePurchases.find({ resourceId: r.id }).toArray();
      return { ...publicResource(r), unitsSold: sales.length, gross: sales.reduce((s, p) => s + p.price, 0) };
    }));
    res.json({ resources: withSales });
  });

  app.get("/api/resources/:id", async (req, res) => {
    const r = await db.resources.findOne({ id: req.params.id });
    if (!r || r.status === "removed") return res.status(404).json({ error: "Resource not found." });
    res.json({ resource: publicResource(r) });
  });

  // Cover and preview images, streamed from the private bucket. slot is
  // "cover" or a preview index (0-based).
  app.get("/api/resources/:id/image/:slot", async (req, res) => {
    if (!storageEnabled) return res.status(404).end();
    const r = await db.resources.findOne({ id: req.params.id });
    if (!r) return res.status(404).end();
    const key = req.params.slot === "cover" ? r.coverKey : (r.previewKeys || [])[Number(req.params.slot)];
    if (!key) return res.status(404).end();
    try {
      const obj = await s3.send(new GetObjectCommand({ Bucket: bucketName, Key: key }));
      res.set("Content-Type", obj.ContentType || "image/jpeg");
      res.set("Cache-Control", "public, max-age=86400");
      obj.Body.pipe(res);
    } catch (err) {
      console.error("Image fetch failed:", err.message);
      res.status(404).end();
    }
  });

  app.post("/api/resources", auth, requireRole("seller"), handleUpload, async (req, res) => {
    if (!storageEnabled) return res.status(503).json({ error: "Resource uploads aren't switched on yet. Please try again later." });
    const b = req.body || {};
    const file = req.files?.file?.[0];
    const cover = req.files?.cover?.[0];
    const previews = req.files?.previews || [];

    const price = Number(b.price);
    const pages = Number(b.pages);
    if (!b.title?.trim()) return res.status(400).json({ error: "Add a title." });
    if (!file) return res.status(400).json({ error: "Attach the resource file (PDF, Word, PowerPoint, Excel or ZIP)." });
    if (!Number.isFinite(price) || price < 0 || price > 10000) return res.status(400).json({ error: "Price must be between ₹0 (free) and ₹10,000." });
    const tax = await getTaxonomy();
    if (!tax.types.includes(b.resourceType)) return res.status(400).json({ error: "Choose a resource type." });
    if (!tax.grades.includes(b.grade)) return res.status(400).json({ error: "Choose a class or level." });
    if (b.language && !RESOURCE_LANGUAGES.includes(b.language)) return res.status(400).json({ error: "Choose a language from the list." });

    const ext = extOf(file.originalname);
    if (!FILE_EXTENSIONS.has(ext) && !FILE_TYPES[file.mimetype]) {
      return res.status(400).json({ error: "The resource must be a PDF, Word, PowerPoint, Excel or ZIP file." });
    }
    for (const img of [cover, ...previews].filter(Boolean)) {
      if (!IMAGE_TYPES[img.mimetype]) return res.status(400).json({ error: "Cover and preview images must be PNG, JPG or WEBP." });
      if (img.size > MAX_IMAGE_BYTES) return res.status(400).json({ error: "Each image must be under 3 MB." });
    }

    const catDoc = await db.meta.findOne({ _id: "categories" });
    const category = b.category && (catDoc?.list || []).includes(b.category) ? b.category : null;

    const id = "r_" + Date.now();
    const base = `resources/${id}`;
    try {
      const fileKey = `${base}/file.${FILE_EXTENSIONS.has(ext) ? ext : FILE_TYPES[file.mimetype]}`;
      await putObject(fileKey, file.buffer, file.mimetype || "application/octet-stream");
      let coverKey = null;
      if (cover) {
        coverKey = `${base}/cover.${IMAGE_TYPES[cover.mimetype]}`;
        await putObject(coverKey, cover.buffer, cover.mimetype);
      }
      const previewKeys = [];
      for (let i = 0; i < previews.length; i++) {
        const k = `${base}/preview-${i}.${IMAGE_TYPES[previews[i].mimetype]}`;
        await putObject(k, previews[i].buffer, previews[i].mimetype);
        previewKeys.push(k);
      }

      const seller = await db.users.findOne({ email: req.user.email });
      const resource = {
        id, kind: "resource", status: "live",
        title: b.title.trim().slice(0, 140), description: (b.description || "").trim().slice(0, 4000),
        resourceType: b.resourceType, grade: b.grade, subject: (b.subject || "").trim().slice(0, 60),
        category, language: b.language || "English", tags: cleanTags(b.tags),
        pages: Number.isFinite(pages) && pages > 0 ? Math.round(pages) : null,
        price: Math.round(price),
        fileKey, fileName: safeFileName(file.originalname), fileSize: file.size, fileType: ext.toUpperCase(),
        coverKey, previewKeys,
        sellerEmail: req.user.email, sellerName: sellerDisplayName(seller),
        rating: 0, ratingCount: 0, downloads: 0, createdAt: Date.now(),
      };
      await db.resources.insertOne(resource);
      invalidate();
      res.json({ resource: publicResource(resource) });
      if (onPublished) onPublished(resource);
    } catch (err) {
      console.error("Resource upload failed:", err.message);
      res.status(502).json({ error: "We couldn't save your files. Please try again in a minute." });
    }
  });

  app.patch("/api/resources/:id", auth, requireRole("seller", "admin"), async (req, res) => {
    const r = await db.resources.findOne({ id: req.params.id });
    if (!r || r.status === "removed") return res.status(404).json({ error: "Resource not found." });
    if (req.user.role === "seller" && r.sellerEmail !== req.user.email) return res.status(403).json({ error: "You can only edit your own resources." });
    const b = req.body || {};
    const set = {};
    if (b.title !== undefined) { if (!String(b.title).trim()) return res.status(400).json({ error: "Title can't be empty." }); set.title = String(b.title).trim().slice(0, 140); }
    if (b.description !== undefined) set.description = String(b.description).trim().slice(0, 4000);
    if (b.price !== undefined) {
      const p = Number(b.price);
      if (!Number.isFinite(p) || p < 0 || p > 10000) return res.status(400).json({ error: "Price must be between ₹0 and ₹10,000." });
      set.price = Math.round(p);
    }
    if (b.tags !== undefined) set.tags = cleanTags(b.tags);
    await db.resources.updateOne({ id: r.id }, { $set: set });
    invalidate();
    res.json({ resource: publicResource(await db.resources.findOne({ id: r.id })) });
  });

  // Removing hides a resource from the marketplace but keeps its file, so
  // teachers who already bought it can still download it.
  app.delete("/api/resources/:id", auth, requireRole("seller", "admin"), async (req, res) => {
    const r = await db.resources.findOne({ id: req.params.id });
    if (!r) return res.status(404).json({ error: "Resource not found." });
    if (req.user.role === "seller" && r.sellerEmail !== req.user.email) return res.status(403).json({ error: "You can only remove your own resources." });
    await db.resources.updateOne({ id: r.id }, { $set: { status: "removed", removedAt: Date.now() } });
    invalidate();
    res.json({ ok: true });
  });

  app.get("/api/resources/:id/download", auth, async (req, res) => {
    if (!storageEnabled) return res.status(503).json({ error: "Downloads are temporarily unavailable." });
    const r = await db.resources.findOne({ id: req.params.id });
    if (!r) return res.status(404).json({ error: "Resource not found." });
    const isOwner = req.user.role === "seller" && r.sellerEmail === req.user.email;
    const isAdmin = req.user.role === "admin";
    const isBuyer = req.user.role === "buyer" && (await hasResourceAccess(db, req.user.email, r));
    if (!isOwner && !isAdmin && !isBuyer) return res.status(403).json({ error: "Buy this resource to download it." });
    try {
      const url = await getSignedUrl(s3, new GetObjectCommand({
        Bucket: bucketName, Key: r.fileKey,
        ResponseContentDisposition: `attachment; filename="${r.fileName.replace(/"/g, "")}"`,
      }), { expiresIn: DOWNLOAD_LINK_TTL_SECONDS });
      if (isBuyer) await db.resources.updateOne({ id: r.id }, { $inc: { downloads: 1 } });
      res.json({ url, fileName: r.fileName });
    } catch (err) {
      console.error("Signing download failed:", err.message);
      res.status(502).json({ error: "Couldn't prepare the download. Please try again." });
    }
  });

  app.get("/api/resource-purchases/mine", auth, requireRole("buyer"), async (req, res) => {
    const mine = await db.resourcePurchases.find({ buyerEmail: req.user.email }).sort({ ts: -1 }).toArray();
    res.json({ resourcePurchases: mine });
  });

  app.post("/api/resources/:id/rate", auth, requireRole("buyer"), async (req, res) => {
    const value = Number(req.body?.value);
    const reviewText = (req.body?.reviewText || "").trim().slice(0, 600);
    if (!value || value < 1 || value > 5) return res.status(400).json({ error: "Rating must be 1-5." });
    const r = await db.resources.findOne({ id: req.params.id });
    if (!r) return res.status(404).json({ error: "Resource not found." });
    if (!(await hasResourceAccess(db, req.user.email, r))) return res.status(403).json({ error: "You can only rate resources you've bought." });
    const buyer = await db.users.findOne({ email: req.user.email });
    if ((buyer.ratedResourceIds || []).includes(r.id)) return res.status(409).json({ error: "You've already rated this resource." });

    const newCount = (r.ratingCount || 0) + 1;
    const newRating = ((r.rating || 0) * (r.ratingCount || 0) + value) / newCount;
    await db.resources.updateOne({ id: r.id }, { $set: { rating: newRating, ratingCount: newCount } });
    await db.users.updateOne({ id: buyer.id }, { $push: { ratedResourceIds: r.id } });
    await db.reviews.insertOne({ id: "rev_" + Date.now(), resourceId: r.id, buyerEmail: buyer.email, buyerName: buyer.name, value, text: reviewText, ts: Date.now() });
    invalidate();
    res.json({ resource: publicResource(await db.resources.findOne({ id: r.id })) });
  });

  app.get("/api/resources/:id/reviews", async (req, res) => {
    const reviews = await db.reviews.find({ resourceId: req.params.id }).sort({ ts: -1 }).limit(50).toArray();
    const breakdown = await ratingBreakdown(db, { resourceId: req.params.id });
    res.json({ breakdown, reviews: reviews.map((r) => ({ buyerName: r.buyerName, value: r.value, text: r.text, ts: r.ts })) });
  });

  return { invalidate };
}

// Count of ratings at each star level (5..1) for one item.
export async function ratingBreakdown(db, match) {
  const rows = await db.reviews.aggregate([{ $match: match }, { $group: { _id: "$value", n: { $sum: 1 } } }]).toArray();
  const out = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  for (const r of rows) if (out[r._id] !== undefined) out[r._id] = r.n;
  return out;
}

/* ------------------------------------------------------------------ */
/* Test covers — optional seller-uploaded cover image for an MCQ test  */
/* ------------------------------------------------------------------ */
const coverUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: MAX_IMAGE_BYTES, files: 1 } }).single("cover");

export function registerTestCoverRoutes(app, { db, auth, requireRole, onTestChanged }) {
  app.post("/api/tests/:id/cover", auth, requireRole("seller", "admin"), (req, res, next) => {
    coverUpload(req, res, (err) => {
      if (!err) return next();
      res.status(400).json({ error: err.code === "LIMIT_FILE_SIZE" ? "The cover image must be under 3 MB." : "Upload one PNG, JPG or WEBP image." });
    });
  }, async (req, res) => {
    if (!storageEnabled) return res.status(503).json({ error: "Image uploads aren't switched on yet." });
    const test = await db.tests.findOne({ id: req.params.id }, { projection: { questions: 0 } });
    if (!test) return res.status(404).json({ error: "Test not found." });
    if (req.user.role === "seller" && test.sellerEmail !== req.user.email) return res.status(403).json({ error: "You can only change covers on your own tests." });
    const img = req.file;
    if (!img || !IMAGE_TYPES[img.mimetype]) return res.status(400).json({ error: "Choose a PNG, JPG or WEBP image." });
    try {
      // New key each time so browsers and the CDN never show a stale cover.
      const coverKey = `tests/${test.id}/cover-${Date.now()}.${IMAGE_TYPES[img.mimetype]}`;
      await putObject(coverKey, img.buffer, img.mimetype);
      await db.tests.updateOne({ id: test.id }, { $set: { coverKey, coverVersion: Date.now() } });
      if (onTestChanged) onTestChanged();
      res.json({ ok: true, hasCover: true, coverVersion: Date.now() });
    } catch (e) {
      console.error("Test cover upload failed:", e.message);
      res.status(502).json({ error: "Couldn't save the image. Please try again." });
    }
  });

  app.delete("/api/tests/:id/cover", auth, requireRole("seller", "admin"), async (req, res) => {
    const test = await db.tests.findOne({ id: req.params.id }, { projection: { questions: 0 } });
    if (!test) return res.status(404).json({ error: "Test not found." });
    if (req.user.role === "seller" && test.sellerEmail !== req.user.email) return res.status(403).json({ error: "You can only change covers on your own tests." });
    await db.tests.updateOne({ id: test.id }, { $set: { coverKey: null } });
    if (onTestChanged) onTestChanged();
    res.json({ ok: true, hasCover: false });
  });

  app.get("/api/tests/:id/cover", async (req, res) => {
    if (!storageEnabled) return res.status(404).end();
    const test = await db.tests.findOne({ id: req.params.id }, { projection: { coverKey: 1 } });
    if (!test?.coverKey) return res.status(404).end();
    try {
      const obj = await s3.send(new GetObjectCommand({ Bucket: bucketName, Key: test.coverKey }));
      res.set("Content-Type", obj.ContentType || "image/jpeg");
      res.set("Cache-Control", "public, max-age=86400");
      obj.Body.pipe(res);
    } catch (e) {
      res.status(404).end();
    }
  });
}
