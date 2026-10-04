// NEET "Mixed" practice tests — 20 standalone tests, each 20 questions
// interleaved across Physics, Chemistry and Biology (7P/7C/6B, shuffled
// together so subjects aren't grouped in blocks). Published alongside the
// existing 100 subject-wise/half-mock/full-mock tests, not replacing them.
// Content drawn from the same PYQ + QBank pools
// (data-neet-tests-mixed.json, built by build_tests_mixed.py with its own
// shuffle seed) and upserted here.
//
// 20 tests total: 20 Q, 20 min, Rs29 each.
//
// Usage:
//   node seed-neet-mixed-tests.js
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

  const raw = readFileSync(join(__dirname, "data-neet-tests-mixed.json"), "utf-8");
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

  console.log(`\nMixed batch done — ${added} test(s) added, ${refreshed} refreshed (content updated in place).`);
  await client.close();
}

main().catch((err) => {
  console.error("Seeding failed (deploy will continue):", err);
});
// mixed seed trigger 1791090745
