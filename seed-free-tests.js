// One-time script: adds one free (₹0) practice test per exam category to
// your database. Safe to re-run — it skips any test whose id already exists.
//
// Usage:
//   cd testmandi-server
//   node seed-free-tests.js
//
// Reads MONGODB_URI (and optional MONGODB_DB_NAME) from your .env file, same
// as the main server — so this writes to whichever database your .env
// currently points at. To seed your LIVE Atlas database, run this with your
// production .env values; to seed local, use your local .env.

import "dotenv/config";
import { MongoClient } from "mongodb";

function q(text, options, correct, topic, explanation) {
  return { text, options, correct, topic, explanation };
}

const SELLER_EMAIL = "official@testmandi.in";
const SELLER_NAME = "TestMandi Free Practice";

const FREE_TESTS = [
  {
    id: "free_neet_1",
    title: "NEET Free Practice — Biology & Physics Basics",
    category: "NEET", price: 0, duration: 15,
    description: "A free sample set covering high-yield NEET biology and physics basics — a taste of what our paid tests cover.",
    questions: [
      q("Which nitrogenous base is unique to RNA?", ["Adenine", "Cytosine", "Uracil", "Guanine"], 2, "Molecular Biology", "Uracil replaces thymine in RNA."),
      q("A body moving with uniform velocity has:", ["Zero acceleration", "Constant acceleration", "Increasing speed", "Zero displacement"], 0, "Kinematics", "Uniform velocity implies no change in velocity, so acceleration is zero."),
      q("Mendel's law of independent assortment applies to genes located on:", ["The same chromosome, closely linked", "Different chromosomes", "The X chromosome only", "Mitochondrial DNA"], 1, "Genetics", "Independent assortment holds for genes on different chromosome pairs."),
      q("Newton's third law implies action-reaction pairs act on:", ["The same body", "Different bodies", "Only rigid bodies", "Only at contact"], 1, "Laws of Motion", "Action and reaction always act on two different bodies."),
    ],
  },
  {
    id: "free_jee_1",
    title: "JEE Main Free Practice — Coordinate Geometry Basics",
    category: "JEE Main", price: 0, duration: 15,
    description: "A free sample of JEE-style coordinate geometry questions.",
    questions: [
      q("The distance of point (3,4) from origin is:", ["5", "7", "25", "3"], 0, "Straight Lines", "Distance = sqrt(3^2+4^2) = 5."),
      q("Two lines are perpendicular when the product of their slopes is:", ["0", "1", "-1", "Undefined"], 2, "Straight Lines", "Perpendicular lines satisfy m1*m2 = -1."),
      q("Eccentricity of a parabola is:", ["0", "1", "Between 0 and 1", "Greater than 1"], 1, "Conic Sections", "A parabola always has eccentricity exactly 1."),
      q("The general equation of a circle is x^2+y^2+2gx+2fy+c=0. Its centre is:", ["(g,f)", "(-g,-f)", "(2g,2f)", "(-2g,-2f)"], 1, "Circles", "Centre of the general circle equation is (-g, -f)."),
    ],
  },
  {
    id: "free_upsc_1",
    title: "UPSC CSE Free Practice — Polity Basics",
    category: "UPSC CSE", price: 0, duration: 15,
    description: "A free sample covering foundational Indian polity facts for UPSC Prelims.",
    questions: [
      q("Fundamental Rights are enshrined in which Part of the Constitution?", ["Part II", "Part III", "Part IV", "Part V"], 1, "Fundamental Rights", "Fundamental Rights are covered under Part III, Articles 12-35."),
      q("Which article provides for the Right to Constitutional Remedies?", ["Article 19", "Article 21", "Article 32", "Article 44"], 2, "Fundamental Rights", "Article 32 is the 'heart and soul' of the Constitution per Dr. Ambedkar."),
      q("Residuary powers under the Indian Constitution rest with:", ["State Legislature", "Parliament", "President", "Judiciary"], 1, "Centre-State Relations", "Article 248 vests residuary powers in Parliament."),
      q("The Preamble was amended by which constitutional amendment?", ["24th", "42nd", "44th", "52nd"], 1, "Constitution", "The 42nd Amendment (1976) added 'Socialist, Secular, Integrity' to the Preamble."),
    ],
  },
  {
    id: "free_ssc_1",
    title: "SSC CGL Free Practice — Quant & Reasoning Basics",
    category: "SSC CGL", price: 0, duration: 15,
    description: "A free sample of SSC CGL-style quantitative aptitude and reasoning questions.",
    questions: [
      q("If a train 90m long crosses a pole in 9s, its speed is:", ["10 m/s", "9 m/s", "36 m/s", "45 m/s"], 0, "Quant", "Speed = distance/time = 90/9 = 10 m/s."),
      q("The simple interest on Rs.2000 at 5% p.a. for 3 years is:", ["Rs.200", "Rs.300", "Rs.100", "Rs.500"], 1, "Quant", "SI = PRT/100 = 2000*5*3/100 = Rs.300."),
      q("In a coding pattern where CAT=DBU, DOG equals:", ["EPH", "EPI", "FPH", "EOI"], 0, "Reasoning", "Each letter shifts +1: D->E, O->P, G->H."),
      q("Find the next number: 2, 6, 12, 20, ?", ["28", "30", "32", "26"], 1, "Reasoning", "Differences are 4,6,8,10 — next term is 20+10=30."),
    ],
  },
  {
    id: "free_banking_1",
    title: "IBPS Free Practice — Quant & Reasoning Basics",
    category: "Banking (IBPS)", price: 0, duration: 15,
    description: "A free sample matching IBPS PO/Clerk prelims difficulty and pacing.",
    questions: [
      q("If a train 120m long crosses a pole in 12s, its speed is:", ["10 m/s", "12 m/s", "36 m/s", "8 m/s"], 0, "Quant", "Speed = distance/time = 120/12 = 10 m/s."),
      q("The simple interest on Rs.1000 at 10% p.a. for 2 years is:", ["Rs.100", "Rs.150", "Rs.200", "Rs.250"], 2, "Quant", "SI = PRT/100 = 1000*10*2/100 = Rs.200."),
      q("In a coding-decoding pattern where CAT=DBU, DOG equals:", ["EPH", "EPI", "FPH", "EOI"], 0, "Reasoning", "Each letter shifts +1: D->E, O->P, G->H."),
      q("A sum doubles itself in 8 years at simple interest. The rate of interest is:", ["10%", "12.5%", "8%", "15%"], 1, "Quant", "For doubling, SI = Principal over 8 years, so rate = 100/8 = 12.5%."),
    ],
  },
  {
    id: "free_class10_1",
    title: "Class 10 Boards Free Practice — Trigonometry Basics",
    category: "Class 10 Boards", price: 0, duration: 15,
    description: "A free CBSE-pattern sample on basic trigonometric ratios and identities.",
    questions: [
      q("The value of sin30° + cos60° is:", ["0", "0.5", "1", "1.5"], 2, "Trigonometric Ratios", "sin30° = 0.5, cos60° = 0.5; sum = 1."),
      q("If tanθ = 1, θ equals:", ["30°", "45°", "60°", "90°"], 1, "Trigonometric Ratios", "tan45° = 1."),
      q("The identity sin²θ + cos²θ equals:", ["0", "1", "2", "tan²θ"], 1, "Identities", "This is the fundamental Pythagorean trigonometric identity."),
      q("The value of cos0° is:", ["0", "1", "-1", "Undefined"], 1, "Trigonometric Ratios", "cos0° = 1 by definition."),
    ],
  },
  {
    id: "free_class12_1",
    title: "Class 12 Boards Free Practice — Calculus Basics",
    category: "Class 12 Boards", price: 0, duration: 15,
    description: "A free CBSE-pattern sample on basic differentiation and integration.",
    questions: [
      q("The derivative of x² with respect to x is:", ["x", "2x", "x²", "2"], 1, "Differentiation", "Using the power rule, d/dx(x^n) = n*x^(n-1), so d/dx(x²) = 2x."),
      q("The integral of 1/x dx is:", ["x²/2", "ln|x| + C", "1/x² + C", "x + C"], 1, "Integration", "The standard integral of 1/x is the natural logarithm ln|x| + C."),
      q("The derivative of a constant is:", ["1", "0", "The constant itself", "Undefined"], 1, "Differentiation", "The rate of change of a constant is always zero."),
      q("d/dx(sin x) equals:", ["cos x", "-cos x", "-sin x", "tan x"], 0, "Differentiation", "The standard derivative of sin x is cos x."),
    ],
  },
  {
    id: "free_statepsc_1",
    title: "State PSC Free Practice — General Studies Basics",
    category: "State PSC", price: 0, duration: 15,
    description: "A free sample of general studies questions common across most State PSC prelims exams.",
    questions: [
      q("The Indian Constitution was adopted on:", ["15 August 1947", "26 January 1950", "26 November 1949", "2 October 1950"], 2, "Polity", "The Constitution was adopted by the Constituent Assembly on 26 November 1949, though it came into effect on 26 January 1950."),
      q("Which is the largest state in India by area?", ["Madhya Pradesh", "Maharashtra", "Rajasthan", "Uttar Pradesh"], 2, "Geography", "Rajasthan is India's largest state by land area."),
      q("The Reserve Bank of India was established in:", ["1935", "1947", "1950", "1969"], 0, "Economy", "The RBI was established on 1 April 1935 under the RBI Act, 1934."),
      q("Who was the first President of India?", ["Jawaharlal Nehru", "Dr. Rajendra Prasad", "Dr. B.R. Ambedkar", "Sardar Patel"], 1, "Polity", "Dr. Rajendra Prasad served as India's first President, from 1950 to 1962."),
    ],
  },
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
  const tests = db.collection("tests");

  let added = 0, skipped = 0;
  for (const test of FREE_TESTS) {
    const exists = await tests.findOne({ id: test.id });
    if (exists) {
      console.log(`Skipping "${test.title}" — already exists.`);
      skipped++;
      continue;
    }
    await tests.insertOne({
      ...test,
      sellerEmail: SELLER_EMAIL,
      sellerName: SELLER_NAME,
      rating: 0,
      ratingCount: 0,
      createdAt: Date.now(),
    });
    console.log(`Added "${test.title}" (${test.category}).`);
    added++;
  }

  console.log(`\nDone — ${added} test(s) added, ${skipped} skipped (already existed).`);
  await client.close();
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
