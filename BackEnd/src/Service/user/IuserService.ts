import type { Iuser } from "../../Interface/user/user.models.interface.ts";

export interface IuserService {
    register(user: Iuser): Promise<Iuser>;
    login(email: string, password: string): Promise<Iuser | null>;
    refreshToken(refreshToken: string): Promise<{ accessToken: string }>;
    logout(refreshToken: string): Promise<void>;
}