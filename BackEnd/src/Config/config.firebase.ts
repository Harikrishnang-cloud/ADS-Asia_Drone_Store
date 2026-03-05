import admin from "firebase-admin";
const serviceAccount = require("../../serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: "https://ads-asia-drone-store-default-rtdb.asia-southeast1.firebasedatabase.app"
});
const db = admin.firestore();

export default db;
