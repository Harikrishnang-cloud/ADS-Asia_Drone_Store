import db from "../../Config/config.firebase.js";
import type { Iuser } from "../../Interface/user/user.models.interface.js";
import type { IuserRepository } from "./IuserRepository.js";

export class userRepository implements IuserRepository {
    async findByEmail(email: string): Promise<Iuser | null> {
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', email).get();
        if (snapshot.empty) {
            return null;
        }
        let userData: Iuser | null = null;
        snapshot.forEach(doc => {
            userData = { _id: doc.id, ...doc.data() } as Iuser;
        });
        return userData;
    }
    async findUserById(id:string):Promise<Iuser|null>{
        const userRef = db.collection('users').doc(id);
        const doc = await userRef.get();
        if (!doc.exists) {
            return null;
        }
        return doc.data() as Iuser;
    }

    async register(user: Iuser): Promise<Iuser> {
        const usersRef = db.collection('users');
        const newUser = { ...user, createdAt: new Date() };
        const docRef = await usersRef.add(newUser);
        return { ...newUser, _id: docRef.id };
    }
}
