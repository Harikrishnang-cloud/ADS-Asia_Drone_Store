import type { Iuser } from "../../Interface/user/user.models.interface.ts";

export interface IuserService {
    register(user: Iuser): Promise<Iuser>;
    login(email: string, password: string): Promise<Iuser | null>;
    refreshToken(refreshToken: string): { accessToken: string };
}