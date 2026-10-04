// JEE Main practice tests — built from the same real PYQ + QBank
// Physics/Chemistry question pools used for the NEET tests (re-used per
// the user's choice, relabeled under category "JEE Main").
//
// 120 tests total:
//   - 40 Physics subject-wise tests (25 Q, 45 min, Rs49 each)
//   - 40 Chemistry subject-wise tests (25 Q, 45 min, Rs49 each)
//   - 40 Mixed Physics+Chemistry tests (50 Q: 25P+25C interleaved, 90 min, Rs99 each)
//
// Usage:
//   node seed-jee-tests.js
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

  const raw = readFileSync(join(__dirname, "data-jee-tests.json"), "utf-8");
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

  console.log(`\nJEE Main batch done — ${added} test(s) added, ${refreshed} refreshed (content updated in place).`);
  await client.close();
}

main().catch((err) => {
  console.error("Seeding failed (deploy will continue):", err);
});
