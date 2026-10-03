// NEET PYQ + QBank-sourced practice tests — SECOND batch (50 more tests),
// published alongside the original 50 (different ids, e.g. neet_physics_subj2_01),
// not overwriting them. Content drawn from the same expanded CSV pools
// (data-neet-tests-batch2.json, built by build_tests2.py with a different
// shuffle seed so the draw differs from batch 1) and upserted here.
//
// 50 tests total:
//   - 10 Physics + 10 Chemistry + 10 Biology subject-wise tests
//     (45 Q, 45 min, Rs49 each)
//   - 10 half mock tests (90 Q: 30P/30C/30B, 90 min, Rs99 each)
//   - 10 full mock tests (180 Q: 45P/45C/90B, 180 min, Rs199 each)
//
// Usage:
//   node seed-neet-pyq-tests-batch2.js
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

  const raw = readFileSync(join(__dirname, "data-neet-tests-batch2.json"), "utf-8");
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

  console.log(`\nBatch 2 done — ${added} test(s) added, ${refreshed} refreshed (content updated in place).`);
  await client.close();
}

main().catch((err) => {
  console.error("Seeding failed (deploy will continue):", err);
});
// batch2 seed trigger 1791048887
