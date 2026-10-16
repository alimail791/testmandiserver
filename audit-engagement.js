// Read-only: who is due an inactivity email, and who sees the refer popup. Writes nothing.
import "dotenv/config";
import { MongoClient } from "mongodb";
const days = Number(process.env.INACTIVITY_DAYS) || 5;
const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const users = client.db(process.env.MONGODB_DB_NAME || "testmandi").collection("users");
const now = Date.now(), cutoff = now - days * 864e5;
const all = await users.find({}, { projection: { _id: 0, role: 1, emailVerified: 1, lastActiveAt: 1, inactiveReminderSentAt: 1, reminderEmailsOptOut: 1, referralCode: 1, createdAt: 1 } }).toArray();
const by = (f) => all.reduce((a, u) => ((a[f(u)] = (a[f(u)] || 0) + 1), a), {});
console.log("ENG roles", JSON.stringify(by((u) => u.role)));
console.log("ENG emailVerified false by role", JSON.stringify(by((u) => `${u.role}:${u.emailVerified === false ? "unverified" : "ok"}`)));
console.log("ENG referralCode missing by role", JSON.stringify(by((u) => `${u.role}:${u.referralCode ? "has" : "none"}`)));
const bu = all.filter((u) => ["buyer", "seller"].includes(u.role));
const stat = (u) => {
  if (u.emailVerified === false) return "skip-unverified";
  if (u.reminderEmailsOptOut) return "skip-optout";
  if (!u.lastActiveAt) return "no-lastActive";
  if (u.lastActiveAt >= cutoff) return "active-recently";
  if ((u.inactiveReminderSentAt || 0) >= u.lastActiveAt) return "already-emailed-this-absence";
  return "DUE-NOW";
};
console.log("ENG inactivity status", JSON.stringify(by.call(null, () => "") && bu.reduce((a, u) => ((a[stat(u)] = (a[stat(u)] || 0) + 1), a), {})));
const age = (t) => (t ? Math.floor((now - t) / 864e5) : "none");
console.log("ENG days since lastActive (buyer/seller)", JSON.stringify(bu.reduce((a, u) => ((a[age(u.lastActiveAt)] = (a[age(u.lastActiveAt)] || 0) + 1), a), {})));
console.log("ENG reminders ever sent", bu.filter((u) => u.inactiveReminderSentAt).length);
await client.close();
