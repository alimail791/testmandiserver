// Read-only audit: compares test ids defined in this repo's seed files with
// what is in MongoDB, and prints counts by seller and category. Writes nothing.
import "dotenv/config";
import { MongoClient } from "mongodb";
import { readFileSync, readdirSync } from "fs";

const expected = new Map(); // id -> source file
for (const f of readdirSync(".")) {
  if (f.startsWith("data-") && f.endsWith(".json")) {
    const d = JSON.parse(readFileSync(f, "utf-8"));
    const arr = Array.isArray(d) ? d : d.tests || Object.values(d).find(Array.isArray);
    for (const t of arr) expected.set(t.id, f);
  } else if (f.startsWith("seed-") && f.endsWith(".js") && !f.includes("pyq") && !f.includes("jee-tests") && !f.includes("mixed") && !f.includes("raise-chapter")) {
    for (const m of readFileSync(f, "utf-8").matchAll(/\{\s*id:\s*"([^"]+)",\s*title:/g)) expected.set(m[1], f);
  }
}

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db(process.env.MONGODB_DB_NAME || "testmandi");
const rows = await db.collection("tests").find({}, { projection: { _id: 0, id: 1, sellerEmail: 1, category: 1, createdAt: 1 } }).toArray();
const inDb = new Map(rows.map((r) => [r.id, r]));

const tally = (key) => Object.entries(rows.reduce((a, r) => ((a[key(r)] = (a[key(r)] || 0) + 1), a), {})).sort((a, b) => b[1] - a[1]);
console.log(`AUDIT total in DB: ${rows.length}; defined in repo: ${expected.size}`);
for (const [k, n] of tally((r) => r.sellerEmail)) console.log(`AUDIT seller ${k}: ${n}`);
for (const [k, n] of tally((r) => r.category)) console.log(`AUDIT category ${k}: ${n}`);

const missingByFile = {};
for (const [id, f] of expected) if (!inDb.has(id)) (missingByFile[f] ||= []).push(id);
for (const [f, ids] of Object.entries(missingByFile)) console.log(`AUDIT missing from DB (${f}): ${ids.length} e.g. ${ids.slice(0, 5).join(", ")}`);
const extra = rows.filter((r) => !expected.has(r.id));
console.log(`AUDIT in DB but not in repo: ${extra.length}`);
for (const [k, n] of Object.entries(extra.reduce((a, r) => ((a[`${r.sellerEmail} | ${r.category}`] = (a[`${r.sellerEmail} | ${r.category}`] || 0) + 1), a), {}))) console.log(`AUDIT   extra ${k}: ${n}`);
console.log(`AUDIT extra ids sample: ${extra.slice(0, 15).map((r) => r.id).join(", ")}`);
await client.close();
