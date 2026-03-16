import db from "../../Config/config.firebase";
import type { Iuser } from "../../Interface/user/user.models.interface";
import type { IuserRepository } from "./IuserRepository";

const usersCollection = db.collection("users");
export class userRepository implements IuserRepository {

    async findByEmail(email: string): Promise<Iuser | null> {
        const snapshot = await usersCollection.where("email", "==", email).get()
        if (snapshot.empty) {
            return null;
        }
        let userData: Iuser | null = null;
        snapshot.forEach((doc) => {
            userData = { _id: doc.id, ...doc.data() } as Iuser;
        });
        return userData;
    }

    async findUserById(id: string): Promise<Iuser | null> {
        const doc = await usersCollection.doc(id).get();
        if (!doc.exists) {
            return null;
        }
        return { _id: doc.id, ...doc.data() } as Iuser;
    }

    async register(user: Iuser): Promise<Iuser> {
        const newUser = {
            ...user,
            createdAt: new Date()
        };
        const docRef = await usersCollection.add(newUser);
        return { ...newUser, _id: docRef.id };
    }

    async blacklistToken(token: string, expiresAt: Date): Promise<boolean> {
        await db.collection("blacklistedTokens").doc(token).set({
            token,
            expiresAt,
            createdAt: new Date()
        });
        return true;
    }

    async isTokenBlacklisted(token: string): Promise<boolean> {
        const doc = await db.collection("blacklistedTokens").doc(token).get();
        return doc.exists;
    }
}