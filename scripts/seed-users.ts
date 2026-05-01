/**
 * Seed Test Users into Firestore
 * Run with: npx tsx scripts/seed-users.ts
 */
import * as admin from "firebase-admin";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = admin.firestore();

const testUsers = [
  {
    uid: "employee1_uid", // In reality, this would match Firebase Auth UID
    email: "employee1@onlyai.com",
    displayName: "John Employee",
    role: "employee",
    leaveBalance: 15,
    tenureMonths: 12,
  },
  {
    uid: "employee2_uid",
    email: "employee2@onlyai.com",
    displayName: "Jane Probation",
    role: "employee",
    leaveBalance: 20,
    tenureMonths: 1, // Will trigger REVIEW status
  },
];

async function seed() {
  console.log("🌱 Seeding test users...");
  for (const user of testUsers) {
    await db.collection("users").doc(user.uid).set(user);
    console.log(`✅ Seeded ${user.email}`);
  }
  console.log("✨ Seeding complete.");
}

seed().catch(console.error);
