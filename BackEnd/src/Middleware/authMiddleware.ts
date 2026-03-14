import type { Request, Response, NextFunction } from "express";
import { jwtToken } from "../utils/jwt.ts";
import type { JwtPayload } from "../utils/jwt.ts";


// Extend Express Request to include user data
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

const jwt = new jwtToken();
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer")) {
            res.status(401).json({ success: false, message: "Access token is required" });
            return;
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            res.status(401).json({ success: false, message: "Access token is required" });
            return;
        }

        const decoded = jwt.verifyAccessToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid or expired access token" });
        return;
    }
};

export const adminMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    // First run the authMiddleware to verify token and attach req.user
    authMiddleware(req, res, () => {
        if (req.user && req.user.role === "admin") {
            next();
        } else {
            res.status(403).json({ success: false, message: "Access denied. Admin privileges required." });
            return;
        }
    });
};

export const userMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    // First run the authMiddleware to verify token and attach req.user
    authMiddleware(req, res, () => {
        if (req.user && req.user.role === "user") {
            next();
        } else {
            res.status(403).json({ success: false, message: "Access denied. User privileges required." });
            return;
        }
    });
};
