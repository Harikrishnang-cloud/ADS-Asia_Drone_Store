import admin from "firebase-admin";
import fs from "fs";
import path from "path";


const keyPath =
  process.env.NODE_ENV === "production"
    ? "/home/ubuntu/ADS-Asia_Drone_Store/BackEnd/serviceAccountKey.json"
    : path.resolve("./serviceAccountKey.json");

let serviceAccount: any = {};

if (fs.existsSync(keyPath)) {
  serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf-8"));
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export { admin };
export default db;