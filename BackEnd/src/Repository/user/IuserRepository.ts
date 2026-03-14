import type { Iuser } from "../../Interface/user/user.models.interface.ts";

export interface IuserRepository {
    findByEmail(email: string): Promise<Iuser | null>;
    register(user: Iuser): Promise<Iuser>;
}
