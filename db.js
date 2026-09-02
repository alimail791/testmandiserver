import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const DEFAULT_CATEGORIES = [
  "NEET", "JEE Main", "UPSC CSE", "SSC CGL", "Banking (IBPS)",
  "Class 10 Boards", "Class 12 Boards", "State PSC",
];

function q(text, options, correct, topic, explanation) {
  return { text, options, correct, topic, explanation };
}

// Mirrors the old demo data — only inserted if SEED_DEMO_DATA=true and the
// tests collection is empty, so a real deployment stays empty by default.
const DEMO_TESTS = [
  {
    id: "t1", title: "NEET Biology — Genetics & Evolution Sprint",
    sellerEmail: "seed@demo.testmandi.in", sellerName: "Dr. Meera's Biology Lab", category: "NEET", price: 149,
    duration: 20, rating: 4.7, ratingCount: 182,
    description: "20-min sprint covering Mendelian genetics, molecular basis of inheritance, and evolution — high-yield NEET topics.",
    questions: [
      q("Which nitrogenous base is unique to RNA?", ["Adenine", "Cytosine", "Uracil", "Guanine"], 2, "Molecular Biology", "Uracil replaces thymine in RNA."),
      q("Mendel's law of independent assortment applies to genes located on:", ["The same chromosome, closely linked", "Different chromosomes", "The X chromosome only", "Mitochondrial DNA"], 1, "Genetics", "Independent assortment holds for genes on different chromosome pairs."),
      q("Darwinian fitness refers to:", ["Physical strength", "Reproductive success", "Body size", "Speed of movement"], 1, "Evolution", "Fitness is a measure of reproductive output, not physical prowess."),
      q("A test cross is used to determine:", ["Phenotype of F2", "Genotype of a dominant phenotype individual", "Mutation rate", "Linkage distance only"], 1, "Genetics", "Crossing with a homozygous recessive reveals unknown genotype."),
      q("Analogous organs are a result of:", ["Divergent evolution", "Convergent evolution", "Genetic drift", "Co-dominance"], 1, "Evolution", "Analogous structures arise from convergent evolution under similar selection pressure."),
    ],
  },
  {
    id: "t2", title: "NEET Physics — Mechanics Rapid Fire",
    sellerEmail: "seed@demo.testmandi.in", sellerName: "Apex Physics Institute", category: "NEET", price: 129,
    duration: 25, rating: 4.5, ratingCount: 96,
    description: "Numerical-heavy set on kinematics, laws of motion, and work-energy for last-mile NEET revision.",
    questions: [
      q("A body moving with uniform velocity has:", ["Zero acceleration", "Constant acceleration", "Increasing speed", "Zero displacement"], 0, "Kinematics", "Uniform velocity implies no change in velocity, so acceleration is zero."),
      q("The work done by a centripetal force on a body in circular motion is:", ["Positive", "Negative", "Zero", "Depends on radius"], 2, "Work-Energy", "Centripetal force is always perpendicular to velocity, so work done is zero."),
      q("Newton's third law implies action-reaction pairs act on:", ["The same body", "Different bodies", "Only rigid bodies", "Only at contact"], 1, "Laws of Motion", "Action and reaction always act on two different bodies."),
      q("Impulse is equal to change in:", ["Force", "Momentum", "Velocity only", "Acceleration"], 1, "Laws of Motion", "Impulse-momentum theorem: impulse = change in momentum."),
    ],
  },
  {
    id: "t3", title: "JEE Main — Coordinate Geometry Essentials",
    sellerEmail: "seed@demo.testmandi.in", sellerName: "QuantEdge Academy", category: "JEE Main", price: 179,
    duration: 30, rating: 4.6, ratingCount: 64,
    description: "Straight lines, circles, and conic sections framed as JEE-style problem sets with full solutions.",
    questions: [
      q("The distance of point (3,4) from origin is:", ["5", "7", "25", "3"], 0, "Straight Lines", "Distance = sqrt(3^2+4^2) = 5."),
      q("The general equation of a circle is x^2+y^2+2gx+2fy+c=0. Its centre is:", ["(g,f)", "(-g,-f)", "(2g,2f)", "(-2g,-2f)"], 1, "Circles", "Centre of the general circle equation is (-g, -f)."),
      q("Eccentricity of a parabola is:", ["0", "1", "Between 0 and 1", "Greater than 1"], 1, "Conic Sections", "A parabola always has eccentricity exactly 1."),
      q("Two lines are perpendicular when the product of their slopes is:", ["0", "1", "-1", "Undefined"], 2, "Straight Lines", "Perpendicular lines satisfy m1*m2 = -1."),
      q("Length of latus rectum of y^2=4ax is:", ["a", "2a", "4a", "8a"], 2, "Conic Sections", "For y^2=4ax, latus rectum length = 4a."),
    ],
  },
  {
    id: "t4", title: "UPSC CSE Prelims — Polity Foundations",
    sellerEmail: "seed@demo.testmandi.in", sellerName: "CivilPrep Mentors", category: "UPSC CSE", price: 199,
    duration: 25, rating: 4.8, ratingCount: 211,
    description: "Constitutional framework, fundamental rights, and centre-state relations for Prelims GS-1.",
    questions: [
      q("The Preamble was amended by which constitutional amendment?", ["24th", "42nd", "44th", "52nd"], 1, "Constitution", "The 42nd Amendment (1976) added 'Socialist, Secular, Integrity' to the Preamble."),
      q("Fundamental Rights are enshrined in which Part of the Constitution?", ["Part II", "Part III", "Part IV", "Part V"], 1, "Fundamental Rights", "Fundamental Rights are covered under Part III, Articles 12-35."),
      q("Which article provides for the Right to Constitutional Remedies?", ["Article 19", "Article 21", "Article 32", "Article 44"], 2, "Fundamental Rights", "Article 32 is the 'heart and soul' of the Constitution per Dr. Ambedkar."),
      q("Residuary powers under the Indian Constitution rest with:", ["State Legislature", "Parliament", "President", "Judiciary"], 1, "Centre-State Relations", "Article 248 vests residuary powers in Parliament."),
    ],
  },
  {
    id: "t5", title: "IBPS PO — Quant & Reasoning Booster",
    sellerEmail: "seed@demo.testmandi.in", sellerName: "NumberCrunch Banking", category: "Banking (IBPS)", price: 99,
    duration: 20, rating: 4.3, ratingCount: 58,
    description: "Speed-focused quant and reasoning set matching IBPS PO prelims difficulty and pacing.",
    questions: [
      q("If a train 120m long crosses a pole in 12s, its speed is:", ["10 m/s", "12 m/s", "36 m/s", "8 m/s"], 0, "Quant", "Speed = distance/time = 120/12 = 10 m/s."),
      q("In a coding-decoding pattern where CAT=DBU, DOG equals:", ["EPH", "EPI", "FPH", "EOI"], 0, "Reasoning", "Each letter shifts +1: D->E, O->P, G->H."),
      q("The simple interest on Rs.1000 at 10% p.a. for 2 years is:", ["Rs.100", "Rs.150", "Rs.200", "Rs.250"], 2, "Quant", "SI = PRT/100 = 1000*10*2/100 = Rs.200."),
    ],
  },
  {
    id: "t6", title: "Class 10 Boards — Trigonometry Practice Set",
    sellerEmail: "seed@demo.testmandi.in", sellerName: "Apex Physics Institute", category: "Class 10 Boards", price: 79,
    duration: 20, rating: 4.4, ratingCount: 40,
    description: "CBSE-pattern trigonometry questions with step-marked solutions, ideal for board exam drilling.",
    questions: [
      q("The value of sin30° + cos60° is:", ["0", "0.5", "1", "1.5"], 2, "Trigonometric Ratios", "sin30° = 0.5, cos60° = 0.5; sum = 1."),
      q("If tanθ = 1, θ equals:", ["30°", "45°", "60°", "90°"], 1, "Trigonometric Ratios", "tan45° = 1."),
      q("The identity sin²θ + cos²θ equals:", ["0", "1", "2", "tan²θ"], 1, "Identities", "This is the fundamental Pythagorean trigonometric identity."),
    ],
  },
];

const DEMO_BUNDLE = {
  id: "b1", title: "NEET Physics + Biology Combo", description: "Both NEET sprints together at a discount — mechanics plus genetics & evolution.",
  price: 220, testIds: ["t1", "t2"], sellerEmail: "seed@demo.testmandi.in", sellerName: "Apex Physics Institute", createdAt: Date.now(),
};

let client = null;

/**
 * Connects to MongoDB Atlas, ensures indexes exist, and seeds an admin
 * account + default categories on first run. Returns the native MongoDB
 * Db object — index.js gets typed collection handles from getCollections().
 */
export async function initDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Get a free connection string from MongoDB Atlas " +
      "(a free M0 cluster) and put it in your .env file — see .env.example."
    );
  }

  client = new MongoClient(uri);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB_NAME || "testmandi");

  const c = getCollections(db);

  // Unique indexes — our own string ids (not Mongo's auto _id) are what the
  // rest of the app looks things up by, so they need to actually be unique.
  await c.users.createIndex({ email: 1 }, { unique: true });
  await c.users.createIndex({ id: 1 }, { unique: true });
  await c.tests.createIndex({ id: 1 }, { unique: true });
  await c.bundles.createIndex({ id: 1 }, { unique: true });
  await c.purchases.createIndex({ id: 1 }, { unique: true });
  await c.bundlePurchases.createIndex({ id: 1 }, { unique: true });
  await c.attempts.createIndex({ id: 1 }, { unique: true });
  await c.notifications.createIndex({ id: 1 }, { unique: true });
  await c.payouts.createIndex({ id: 1 }, { unique: true });
  await c.ads.createIndex({ id: 1 }, { unique: true });
  await c.pendingOrders.createIndex({ orderId: 1 }, { unique: true });

  // Categories live as one document (a simple string list) rather than a
  // whole collection, since they're just admin-managed tags.
  const catDoc = await c.meta.findOne({ _id: "categories" });
  if (!catDoc) {
    await c.meta.insertOne({ _id: "categories", list: DEFAULT_CATEGORIES });
  }

  const adminEmail = (process.env.ADMIN_EMAIL || "admin@testmandi.in").toLowerCase();
  const existingAdmin = await c.users.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 10);
    await c.users.insertOne({
      id: "u_admin", role: "admin", name: "Admin", email: adminEmail, phone: "", businessName: "",
      passwordHash, bankDetails: null, emailVerified: true, verificationTokenHash: null,
      resetTokenHash: null, resetTokenExpiresAt: null, refreshTokens: [], createdAt: Date.now(),
    });
    console.log(`Seeded admin account -> ${adminEmail} (password from .env)`);
  }

  if (process.env.SEED_DEMO_DATA === "true") {
    const testCount = await c.tests.countDocuments();
    if (testCount === 0) {
      await c.tests.insertMany(DEMO_TESTS);
      await c.bundles.insertOne(DEMO_BUNDLE);
      console.log(`Seeded ${DEMO_TESTS.length} demo tests and 1 demo bundle`);
    }
  }

  console.log("Connected to MongoDB Atlas.");
  return db;
}

export function getCollections(db) {
  return {
    users: db.collection("users"),
    tests: db.collection("tests"),
    bundles: db.collection("bundles"),
    purchases: db.collection("purchases"),
    bundlePurchases: db.collection("bundlePurchases"),
    attempts: db.collection("attempts"),
    notifications: db.collection("notifications"),
    payouts: db.collection("payouts"),
    ads: db.collection("ads"),
    pendingOrders: db.collection("pendingOrders"),
    meta: db.collection("meta"),
  };
}

export async function closeDB() {
  if (client) await client.close();
}
