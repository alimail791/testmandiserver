// Blog posts for testmandi.in/blog — written by the admin in the
// /admin/blog editor (served by the frontend) and read by the frontend
// server, which renders the public blog pages.
//
//   Public:  GET /api/blog              published posts (no bodies)
//            GET /api/blog/:slug        one published post
//   Admin:   GET /api/admin/blog        every post, drafts included
//            GET /api/admin/blog/:id    one post for editing
//            POST /api/admin/blog       create
//            PUT /api/admin/blog/:id    update (and publish / unpublish)
//            DELETE /api/admin/blog/:id
import crypto from "crypto";
import { sanitizeHtml, slugify, excerptFrom } from "./blogHtml.js";

const summary = (p) => ({
  id: p.id, slug: p.slug, title: p.title, metaDescription: p.metaDescription,
  coverImageUrl: p.coverImageUrl, status: p.status, publishedAt: p.publishedAt, updatedAt: p.updatedAt,
  excerpt: p.metaDescription || excerptFrom(p.bodyHtml),
});

export async function registerBlogRoutes(app, { db, auth, requireRole }) {
  const posts = db.blogPosts;
  await posts.createIndex({ id: 1 }, { unique: true });
  await posts.createIndex({ slug: 1 }, { unique: true });
  await posts.createIndex({ status: 1, publishedAt: -1 });

  app.get("/api/blog", async (req, res) => {
    const list = await posts.find({ status: "published" }).sort({ publishedAt: -1 }).toArray();
    res.set("Cache-Control", "public, max-age=60");
    res.json({ posts: list.map(summary) });
  });

  app.get("/api/blog/:slug", async (req, res) => {
    const post = await posts.findOne({ slug: String(req.params.slug), status: "published" }, { projection: { _id: 0 } });
    if (!post) return res.status(404).json({ error: "Post not found." });
    res.set("Cache-Control", "public, max-age=60");
    res.json({ post });
  });

  const admin = [auth, requireRole("admin")];

  app.get("/api/admin/blog", ...admin, async (req, res) => {
    const list = await posts.find({}).sort({ updatedAt: -1 }).toArray();
    res.json({ posts: list.map(summary) });
  });

  app.get("/api/admin/blog/:id", ...admin, async (req, res) => {
    const post = await posts.findOne({ id: req.params.id }, { projection: { _id: 0 } });
    if (!post) return res.status(404).json({ error: "Post not found." });
    res.json({ post });
  });

  // Validates and cleans the editor's input. Returns { error } or { fields }.
  async function clean(body, id) {
    const title = String(body.title || "").trim().slice(0, 200);
    const slug = slugify(body.slug || title);
    const metaDescription = String(body.metaDescription || "").trim().slice(0, 300);
    const coverImageUrl = String(body.coverImageUrl || "").trim();
    const bodyHtml = sanitizeHtml(body.bodyHtml || "");
    if (!title) return { error: "Add a title." };
    if (!bodyHtml.replace(/<[^>]+>/g, "").trim()) return { error: "The post has no text yet." };
    if (coverImageUrl && !/^https?:\/\//i.test(coverImageUrl)) return { error: "The cover image address must start with https://" };
    const clash = await posts.findOne({ slug, ...(id ? { id: { $ne: id } } : {}) });
    if (clash) return { error: `Another post already uses the address /blog/${slug}. Change the URL slug.` };
    return { fields: { title, slug, metaDescription, coverImageUrl, bodyHtml } };
  }

  app.post("/api/admin/blog", ...admin, async (req, res) => {
    const { error, fields } = await clean(req.body || {});
    if (error) return res.status(400).json({ error });
    const now = Date.now();
    const publish = req.body.status === "published";
    const post = {
      id: crypto.randomBytes(8).toString("hex"), ...fields,
      status: publish ? "published" : "draft", publishedAt: publish ? now : null,
      createdAt: now, updatedAt: now, authorEmail: req.user.email,
    };
    await posts.insertOne(post);
    delete post._id;
    res.status(201).json({ post });
  });

  app.put("/api/admin/blog/:id", ...admin, async (req, res) => {
    const existing = await posts.findOne({ id: req.params.id });
    if (!existing) return res.status(404).json({ error: "Post not found." });
    const { error, fields } = await clean(req.body || {}, existing.id);
    if (error) return res.status(400).json({ error });
    const status = req.body.status === "published" ? "published" : req.body.status === "draft" ? "draft" : existing.status;
    const publishedAt = status === "published" ? existing.publishedAt || Date.now() : existing.publishedAt;
    await posts.updateOne({ id: existing.id }, { $set: { ...fields, status, publishedAt, updatedAt: Date.now() } });
    const post = await posts.findOne({ id: existing.id }, { projection: { _id: 0 } });
    res.json({ post });
  });

  app.delete("/api/admin/blog/:id", ...admin, async (req, res) => {
    const r = await posts.deleteOne({ id: req.params.id });
    if (!r.deletedCount) return res.status(404).json({ error: "Post not found." });
    res.json({ ok: true });
  });
}
