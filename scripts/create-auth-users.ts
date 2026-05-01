/**
 * Create Firebase Auth Users
 * Run with: npx tsx scripts/create-auth-users.ts
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

const auth = admin.auth();

const testUsers = [
  {
    uid: "employee1_uid",
    email: "employee1@onlyai.com",
    password: "employee1",
    displayName: "John Employee",
  },
  {
    uid: "employee2_uid",
    email: "employee2@onlyai.com",
    password: "employee2",
    displayName: "Jane Probation",
  },
];

async function seed() {
  console.log("🔐 Creating auth users...");
  for (const user of testUsers) {
    try {
      await auth.createUser({
        uid: user.uid,
        email: user.email,
        password: user.password,
        displayName: user.displayName,
      });
      console.log(`✅ Created ${user.email}`);
    } catch (e: any) {
      if (e.code === 'auth/email-already-exists') {
        console.log(`ℹ️ User ${user.email} already exists.`);
      } else {
        console.error(`❌ Error creating ${user.email}:`, e.message);
      }
    }
  }
  console.log("✨ Auth setup complete.");
}

seed().catch(console.error);
