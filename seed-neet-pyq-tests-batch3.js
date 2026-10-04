// NEET PYQ + QBank-sourced practice tests — THIRD batch (100 more tests),
// published alongside the existing 120 (different ids, e.g.
// neet_physics_subj3_01), not overwriting them.
//
// 100 tests total:
//   - 20 Physics + 20 Chemistry + 20 Biology subject-wise tests
//     (45 Q, 45 min, Rs49 each) = 60 tests
//   - 20 half mock tests (90 Q: 30P/30C/30B, interleaved/mixed, 90 min, Rs99 each)
//   - 20 full mock tests (180 Q: 45P/45C/90B, combined/mixed, 180 min, Rs199 each)
//
// Usage:
//   node seed-neet-pyq-tests-batch3.js
//
// Safe to re-run — upserts by id.

import "dotenv/config";
import { MongoClient } from "mongodb";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set — skipping seed (deploy will continue).");
    return;
  }

  const raw = readFileSync(join(__dirname, "data-neet-tests-batch3.json"), "utf-8");
  const data = JSON.parse(raw);
  const { sellerEmail, sellerName, tests: TESTS } = data;

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB_NAME || "testmandi");
  const tests = db.collection("tests");
  const users = db.collection("users");

  const seller = await users.findOne({ email: sellerEmail });
  if (!seller) {
    console.warn(`WARNING: seller account ${sellerEmail} not found — inserting tests anyway.`);
  }

  let added = 0, refreshed = 0;
  for (const t of TESTS) {
    const exists = await tests.findOne({ id: t.id });
    await tests.updateOne(
      { id: t.id },
      {
        $set: {
          title: t.title,
          category: t.category,
          price: t.price,
          duration: t.duration,
          description: t.description,
          questions: t.questions,
          sellerEmail,
          sellerName,
        },
        $setOnInsert: {
          id: t.id,
          rating: 0,
          ratingCount: 0,
          createdAt: Date.now(),
        },
      },
      { upsert: true }
    );
    if (exists) {
      console.log(`Refreshed "${t.title}" — ${t.questions.length} questions, Rs${t.price}.`);
      refreshed++;
    } else {
      console.log(`Added "${t.title}" — ${t.questions.length} questions, Rs${t.price}.`);
      added++;
    }
  }

  console.log(`\nBatch 3 done — ${added} test(s) added, ${refreshed} refreshed (content updated in place).`);
  await client.close();
}

main().catch((err) => {
  console.error("Seeding failed (deploy will continue):", err);
});
