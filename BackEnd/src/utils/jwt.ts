import jwt from "jsonwebtoken";

export interface JwtPayload {
    id: string;
    email: string;
    role: "admin" | "user";
    exp?: number;
}

export class jwtToken {
    private accessSecret: string;
    private refreshSecret: string;

    constructor() {
        const accessSecret = process.env.JWT_ACCESS_SECRET;
        const refreshSecret = process.env.JWT_REFRESH_SECRET;

        if (!accessSecret || !refreshSecret) {
            throw new Error("JWT secrets are not defined in environment variables");
        }

        this.accessSecret = accessSecret;
        this.refreshSecret = refreshSecret;
    }

    generateAccessToken(payload: JwtPayload): string {
        return jwt.sign(payload, this.accessSecret, { expiresIn: "1d" });
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
