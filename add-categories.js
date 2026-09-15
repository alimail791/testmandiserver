// One-time script: adds every category in NEW_CATEGORIES that doesn't
// already exist. Safe to re-run — duplicates are skipped automatically.
//
// Usage:
//   cd testmandi-server
//   node add-categories.js

import "dotenv/config";
import { MongoClient } from "mongodb";

const NEW_CATEGORIES = [
  "NEET", "JEE Main", "UPSC CSE", "SSC CGL", "Banking (IBPS)",
  "Class 10 Boards", "Class 12 Boards", "State PSC",
  "CLAT", "GATE", "Railways RRB", "CAT", "SBI All exams", "SSC Exams",
  "NDA Exams", "AFCAT", "MAT", "CUET", "NATA", "TNPSC", "CDS", "AIIMS",
  "JIPMER", "NEET PG", "TRB", "TET", "UGC NET", "NIFT", "IIFT",
  "BITS AT", "VITEEE", "SRMJEEE", "APPSC", "APSC", "ICAR",
  "NEET Foundation", "Olympiad", "Agniveer Exams", "Other Exams", "CSIR NET",
];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set — check your .env file.");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB_NAME || "testmandi");
  const meta = db.collection("meta");

  const doc = await meta.findOne({ _id: "categories" });
  const existing = new Set(doc?.list || []);

  let added = 0, skipped = 0;
  for (const name of NEW_CATEGORIES) {
    if (existing.has(name)) {
      console.log(`Skipping "${name}" — already exists.`);
      skipped++;
      continue;
    }
    await meta.updateOne({ _id: "categories" }, { $addToSet: { list: name } });
    console.log(`Added "${name}".`);
    added++;
  }

  console.log(`\nDone — ${added} categor${added === 1 ? "y" : "ies"} added, ${skipped} skipped (already existed).`);
  await client.close();
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
