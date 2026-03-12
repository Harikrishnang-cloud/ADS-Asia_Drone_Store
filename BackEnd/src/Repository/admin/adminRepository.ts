import db from "../../Config/config.firebase.ts";
import type { Iadmin } from "../../Interface/admin/admin.models.interface.ts";
import type { Iuser } from "../../Interface/user/user.models.interface.ts";
import type { IadminRepository } from "./IadminRepository.ts";

const usersCollection = db.collection("users");

export class adminRepository implements IadminRepository {
    async createAdmin(email: string, name: string, password: string, role: string): Promise<Iadmin> {
        const newAdmin = {
            email,
            name,
            password,
            role,
            createdAt: new Date()
        };

        const docRef = await usersCollection.add(newAdmin);
        return { ...newAdmin, _id: docRef.id } as unknown as Iadmin;
    }

    async getUserByEmail(email: string): Promise<Iuser | null> {
        const snapshot = await usersCollection.where("email", "==", email).get();

        if (snapshot.empty) {
            return null;
        }

        let userData: Iuser | null = null;
        snapshot.forEach((doc) => {
            userData = { _id: doc.id, ...doc.data() } as Iuser;
        });

        return userData;
    }
}
