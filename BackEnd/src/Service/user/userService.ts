import type { Iuser } from "../../Interface/user/user.models.interface.ts";
import type { IuserService } from "./IuserService.ts";
import type { IuserRepository } from "../../Repository/user/IuserRepository.ts";
import { bcryptPassword } from "../../utils/bcrypt.ts";
import { jwtToken } from "../../utils/jwt.ts";
import type { JwtPayload } from "../../utils/jwt.ts";
import { admin } from "../../Config/config.firebase.ts";

export class userService implements IuserService {
    private userRepository: IuserRepository;
    private bcryptPassword: bcryptPassword;
    private jwt: jwtToken;

    constructor(userRepository: IuserRepository) {
        this.userRepository = userRepository;
        this.bcryptPassword = new bcryptPassword();
        this.jwt = new jwtToken();
    }

    async register(user: Iuser): Promise<Iuser & { firebaseToken?: string }> {
        const userExists = await this.userRepository.findByEmail(user.email);
        if (userExists) {
            throw new Error("User already exists");
        }
        const hashedPassword = await this.bcryptPassword.hashPassword(user.password);
        const userData = { ...user, password: hashedPassword };
        const savedUser = await this.userRepository.register(userData);
        
        // Generate Firebase Custom Token for the new user
        const firebaseToken = await admin.auth().createCustomToken(savedUser._id!.toString());
        
        return { ...savedUser, firebaseToken };
    }

    async login(email: string, password: string): Promise<Iuser & { firebaseToken?: string } | null> {
        const userExists = await this.userRepository.findByEmail(email);
        if (!userExists) {
            throw new Error("User not found");
        }
        const isPasswordValid = await this.bcryptPassword.comparePassword(password, userExists.password);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }
        
        // Generate Firebase Custom Token to sync with Firestore Rules
        const firebaseToken = await admin.auth().createCustomToken(userExists._id!.toString());
        
        return { ...userExists, firebaseToken };
    }

    generateTokens(user: Iuser): { accessToken: string; refreshToken: string } {
        const payload: JwtPayload = {
            id: user._id || "",
            email: user.email,
            role: user.role
        };
        const accessToken = this.jwt.generateAccessToken(payload);
        const refreshToken = this.jwt.generateRefreshToken(payload);
        return { accessToken, refreshToken };
    }

    async refreshToken(refreshTokenStr: string): Promise<{ accessToken: string; firebaseToken?: string }> {
        // Check if token is blacklisted
        const isBlacklisted = await this.userRepository.isTokenBlacklisted(refreshTokenStr);
        if (isBlacklisted) {
            throw new Error("Token is blacklisted");
        }

        const decoded = this.jwt.verifyRefreshToken(refreshTokenStr);
        const payload: JwtPayload = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
        };
        const accessToken = this.jwt.generateAccessToken(payload);
        
        // Also refresh Firebase token to ensure user stays logged into Firestore
        const firebaseToken = await admin.auth().createCustomToken(decoded.id.toString());
        
        return { accessToken, firebaseToken };
    }

    async logout(refreshTokenStr: string): Promise<void> {
        try {
            const decoded = this.jwt.verifyRefreshToken(refreshTokenStr);
            // Blacklist the token until its original expiry
            const expiresAt = decoded.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            await this.userRepository.blacklistToken(refreshTokenStr, expiresAt);
        } catch (error) {
            // Even if token is invalid/expired, we don't necessarily need to throw if the goal is just logout
            // but for security we might want to know.
            console.error("Logout token verification failed:", error);
        }
    }
}