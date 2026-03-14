import db from "../Config/config.firebase.js";

const usersCollection = db.collection("users");

export class authRepository {
    async findUserByEmail(email: string) {
        const snapshot = await usersCollection.where("email", "==", email).get();

        if (snapshot.empty) {
            return null;
        }

        let userData: any = null;

        snapshot.forEach((doc) => {
            userData = { _id: doc.id, ...doc.data() };
        });

        return userData;
    }

    async updateResetToken(userId: string, resetData: { resetOtp: string | null, resetOtpExpiry: Date | null }) {
        await usersCollection.doc(userId).update(resetData);
        return true;
    }

    async updatePassword(userId: string, newPasswordHash: string) {
        await usersCollection.doc(userId).update({
            password: newPasswordHash,
            resetOtp: null,
            resetOtpExpiry: null
        });
        return true;
    }

    async createUser(userData: any) {
        let docRef;
        if (userData._id) {
            docRef = usersCollection.doc(userData._id);
        } else {
            docRef = usersCollection.doc();
            userData._id = docRef.id;
        }
        await docRef.set({
            ...userData,
            createdAt: new Date()
        });
        return userData;
    }
}
