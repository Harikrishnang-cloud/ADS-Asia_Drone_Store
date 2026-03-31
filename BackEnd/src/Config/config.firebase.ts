import admin from "firebase-admin";
import fs from "fs";
import path from "path";

let serviceAccount: any = {};
const keyPath = path.resolve(process.cwd(), "serviceAccountKey.json");
if (fs.existsSync(keyPath)) {
  serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf-8"));
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || serviceAccount.client_email,
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || serviceAccount.private_key)?.replace(/\\n/g, "\n"),
  }),
});

const db = admin.firestore();

export { admin };
export default db;