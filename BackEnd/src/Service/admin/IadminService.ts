import type { Iuser } from "../../Interface/user/user.models.interface.ts";

export interface IadminService {
    login(email: string, password: string): Promise<{ user: Iuser, tokens: { accessToken: string, refreshToken: string } }>;
}
