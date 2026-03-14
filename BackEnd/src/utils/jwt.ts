import jwt from "jsonwebtoken";

export interface JwtPayload {
    id: string;
    email: string;
    role: "admin" | "user";
}

export class jwtToken {
    private accessSecret: string;
    private refreshSecret: string;

    constructor() {
        this.accessSecret = process.env.JWT_ACCESS_SECRET || "default_access_secret";
        this.refreshSecret = process.env.JWT_REFRESH_SECRET || "default_refresh_secret";
    }

    generateAccessToken(payload: JwtPayload): string {
        return jwt.sign(payload, this.accessSecret, { expiresIn: "15m" });
    }

    generateRefreshToken(payload: JwtPayload): string {
        return jwt.sign(payload, this.refreshSecret, { expiresIn: "7d" });
    }

    verifyAccessToken(token: string): JwtPayload {
        return jwt.verify(token, this.accessSecret) as JwtPayload;
    }

    verifyRefreshToken(token: string): JwtPayload {
        return jwt.verify(token, this.refreshSecret) as JwtPayload;
    }
}
