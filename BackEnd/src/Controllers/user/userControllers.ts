import type { Iuser } from "../../Interface/user/user.models.interface.ts";
import type { IuserService } from "../../Service/user/IuserService.ts";
import { userService } from "../../Service/user/userService.ts";
import type { Request, Response } from "express";

export class userController {
    private userService: userService;

    constructor(userService: userService) {
        this.userService = userService;
    }

    async userRegister(req: Request, res: Response) {
        try {
            const user: Iuser = req.body;
            const { firebaseToken, ...result } = await this.userService.register(user);
            res.status(201).json({ 
                success: true, 
                message: "User registered successfully", 
                result,
                firebaseToken 
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ success: false, message: error.message });
            } else {
                res.status(500).json({ success: false, message: "Something went wrong" });
            }
        }
    }

    async userLogin(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const user = await this.userService.login(email, password);
            if (!user) {
                res.status(401).json({ success: false, message: "Invalid credentials" });
                return;
            }

            // Generate JWT tokens
            const tokens = this.userService.generateTokens(user);

            const selectedUserData = {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            };

            res.status(200).json({
                success: true,
                message: "User logged in successfully",
                result: selectedUserData,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                firebaseToken: user.firebaseToken
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ success: false, message: error.message });
            } else {
                res.status(500).json({ success: false, message: "Something went wrong" });
            }
        }
    }

    async refreshToken(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                res.status(400).json({ success: false, message: "Refresh token is required" });
                return;
            }
            const result = await this.userService.refreshToken(refreshToken);
            res.status(200).json({ 
                success: true, 
                message: "Token refreshed successfully", 
                accessToken: result.accessToken,
                firebaseToken: result.firebaseToken
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(401).json({ success: false, message: error.message || "Invalid or expired refresh token" });
            } else {
                res.status(500).json({ success: false, message: "Something went wrong" });
            }
        }
    }

    async logout(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                res.status(400).json({ success: false, message: "Refresh token is required" });
                return;
            }
            await this.userService.logout(refreshToken);
            res.status(200).json({ success: true, message: "Logged out successfully" });
        } catch (error) {
            res.status(500).json({ success: false, message: "Logout failed" });
        }
    }

    async getUserProfile(req: Request, res: Response) {
        try {
            const user = req.user;
            if (!user) {
                res.status(401).json({ success: false, message: "Unauthorized" });
                return;
            }
            res.status(200).json({ success: true, message: "User profile fetched successfully", result: user });
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ success: false, message: error.message });
            } else {
                res.status(500).json({ success: false, message: "Something went wrong" });
            }
        }
    }
}