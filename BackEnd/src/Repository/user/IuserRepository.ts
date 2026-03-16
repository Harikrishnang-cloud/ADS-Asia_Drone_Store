import type { Iuser } from "../../Interface/user/user.models.interface.ts";

export interface IuserRepository {
    findByEmail(email: string): Promise<Iuser | null>;
    findUserById(id: string): Promise<Iuser | null>;
    register(user: Iuser): Promise<Iuser>;
    blacklistToken(token: string, expiresAt: Date): Promise<boolean>;
    isTokenBlacklisted(token: string): Promise<boolean>;
}
