import type { Iuser } from "../../Interface/user/user.models.interface.js";

export interface IuserService {
    register(user: Iuser): Promise<Iuser>;
    login(email: string, password: string): Promise<Iuser | null>;
}