import admin from "firebase-admin";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const serviceAccount = require("../../serviceAccountKey.json");

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