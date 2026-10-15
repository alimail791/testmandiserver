// Follow a seller — buyers (and other sellers) follow a store and get an
// email when that seller publishes a new test or teaching resource.
//
// Followed sellers are kept on the follower's own user document
// (`followingSellers`, a list of seller emails), so a follower count is just a
// count of users whose list contains that email — no counter to drift.

const NOTIFY_BATCH_MAX = 500;     // followers emailed per new listing
const NOTIFY_GAP_MS = 600;        // stay well under the email provider's rate limit

function slugify(title) {
  return (title || "test").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "test";
}

function escapeHtml(s) {
  return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function registerFollowRoutes(app, { db, auth, requireRole, sendPlainEmail, unsubSig, publicAppUrl, publicApiUrl, sellerDisplayName }) {
  const findSeller = (email) => db.users.findOne({ email: String(email || "").toLowerCase(), role: "seller" });

  app.get("/api/sellers/:email/profile", async (req, res) => {
    const seller = await findSeller(req.params.email);
    if (!seller) return res.status(404).json({ error: "Seller not found." });
    const [followerCount, testCount, resourceCount] = await Promise.all([
      db.users.countDocuments({ followingSellers: seller.email }),
      db.tests.countDocuments({ sellerEmail: seller.email }),
      db.resources.countDocuments({ sellerEmail: seller.email, status: "live" }),
    ]);
    res.set("Cache-Control", "public, max-age=30");
    res.json({ sellerEmail: seller.email, name: sellerDisplayName(seller), followerCount, testCount, resourceCount });
  });

  app.post("/api/sellers/:email/follow", auth, requireRole("buyer", "seller"), async (req, res) => {
    const seller = await findSeller(req.params.email);
    if (!seller) return res.status(404).json({ error: "Seller not found." });
    if (seller.email === req.user.email) return res.status(400).json({ error: "You can't follow your own store." });
    await db.users.updateOne({ email: req.user.email }, { $addToSet: { followingSellers: seller.email } });
    res.json({ following: true, followerCount: await db.users.countDocuments({ followingSellers: seller.email }) });
  });

  app.delete("/api/sellers/:email/follow", auth, requireRole("buyer", "seller"), async (req, res) => {
    const email = String(req.params.email || "").toLowerCase();
    await db.users.updateOne({ email: req.user.email }, { $pull: { followingSellers: email } });
    res.json({ following: false, followerCount: await db.users.countDocuments({ followingSellers: email }) });
  });

  app.get("/api/sellers/me/followers", auth, requireRole("seller"), async (req, res) => {
    res.json({ followerCount: await db.users.countDocuments({ followingSellers: req.user.email }) });
  });

  // Emails every follower about a newly published test or resource. Runs in
  // the background — never blocks or fails the seller's publish request.
  async function notifyFollowers(sellerEmail, item) {
    try {
      const followers = await db.users.find(
        { followingSellers: sellerEmail, reminderEmailsOptOut: { $ne: true }, emailVerified: { $ne: false } },
        { projection: { id: 1, email: 1, name: 1 } },
      ).limit(NOTIFY_BATCH_MAX).toArray();
      if (!followers.length) return;
      const seller = await db.users.findOne({ email: sellerEmail });
      const storeName = escapeHtml(seller ? sellerDisplayName(seller) : item.sellerName);
      const isRes = item.kind === "resource";
      const link = `${publicAppUrl.replace(/\/$/, "")}/${isRes ? "resources" : "tests"}/${item.id}/${slugify(item.title)}`;
      const price = Number(item.price) ? `₹${item.price}` : "Free";
      for (const f of followers) {
        const first = escapeHtml((f.name || "there").split(" ")[0]);
        const unsub = `${publicApiUrl.replace(/\/$/, "")}/api/email/unsubscribe?uid=${encodeURIComponent(f.id)}&sig=${unsubSig(f.id)}`;
        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #1B2A4A;">
            <p style="font-size: 14px; color: #3B4C72; margin: 0 0 8px;">Hi ${first}, ${storeName} just published a new ${isRes ? "resource" : "test"}:</p>
            <h2 style="margin: 0 0 6px; font-size: 20px;">${escapeHtml(item.title)}</h2>
            <p style="font-size: 14px; color: #3B4C72; margin: 0 0 18px;">${price}</p>
            <a href="${link}" style="display:inline-block;background:#2F7A4F;color:#fff;padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:600;">View it on TestMandi</a>
            <p style="font-size: 11px; color: #79705C; margin-top: 22px;">You get this because you follow ${storeName} on TestMandi. <a href="${unsub}" style="color:#79705C;">Unsubscribe</a>.</p>
          </div>`;
        await sendPlainEmail(f.email, `New from ${seller ? sellerDisplayName(seller) : item.sellerName}: ${item.title}`, html);
        await new Promise((r) => setTimeout(r, NOTIFY_GAP_MS));
      }
      console.log(`Notified ${followers.length} follower(s) of ${sellerEmail} about ${item.id}`);
    } catch (err) {
      console.error("Follower notification failed:", err.message);
    }
  }

  return { notifyFollowers };
}
