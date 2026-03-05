import type { Iuser } from "../../Interface/user/user.models.interface.js";

export interface IuserRepository {
    findByEmail(email: string): Promise<Iuser | null>;
    register(user: Iuser): Promise<Iuser>;
}
