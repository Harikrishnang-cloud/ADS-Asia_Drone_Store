import type { Request, Response } from "express";
import { authService } from "../Service/auth.service.ts";

export class authController {
    private service: authService;

    constructor() {
        this.service = new authService();
    }

    async forgotPassword(req: Request, res: Response) {
        try {
            const { contact, method } = req.body; // method: 'email' | 'phone'
            if (!contact) {
                return res.status(400).json({ success: false, message: "Contact information is required" });
            }

            const result = await this.service.forgotPassword(contact, method || 'email');
            return res.status(200).json({ success: true, message: result.message });
        } catch (error: any) {
            if (error.message === "User not found") {
                return res.status(404).json({ success: false, message: error.message });
            }
            return res.status(500).json({ success: false, message: "Server error during forgot password" });
        }
    }

    async verifyResetOtp(req: Request, res: Response) {
        try {
            const { contact, otp, method } = req.body;
            if (!contact || !otp) {
                return res.status(400).json({ success: false, message: "Contact and OTP are required" });
            }

            await this.service.verifyResetOtp(contact, otp, method || 'email');
            return res.status(200).json({ success: true, message: "OTP verified correctly" });
        } catch (error: any) {
            if (error.message === "User not found") {
                return res.status(404).json({ success: false, message: error.message });
            }
            if (error.message === "Invalid OTP" || error.message === "OTP Expired") {
                return res.status(401).json({ success: false, message: error.message });
            }
            return res.status(500).json({ success: false, message: "Server error during OTP verification" });
        }
    }

    async resetPassword(req: Request, res: Response) {
        try {
            const { contact, password, method } = req.body;
            if (!contact || !password) {
                return res.status(400).json({ success: false, message: "Contact and new password are required" });
            }

            await this.service.resetPassword(contact, password, method || 'email');
            return res.status(200).json({ success: true, message: "Password reset successfully" });
        } catch (error: any) {
            if (error.message === "User not found") {
                return res.status(404).json({ success: false, message: error.message });
            }
            return res.status(500).json({ success: false, message: "Server error during password reset" });
        }
    }

    async resendResetOtp(req: Request, res: Response) {
        try {
            const { contact, method } = req.body;
            if (!contact) {
                return res.status(400).json({ success: false, message: "Contact is required" });
            }

            const result = await this.service.resendResetOtp(contact, method || 'email');
            return res.status(200).json({ success: true, message: result.message });
        } catch (error: any) {
            if (error.message === "User not found") {
                return res.status(404).json({ success: false, message: error.message });
            }
            if (error.message === "Please wait 60 seconds before requesting a new OTP") {
                return res.status(400).json({ success: false, message: error.message });
            }
            return res.status(500).json({ success: false, message: "Server error during OTP resend" });
        }
    }

    async googleLogin(req: Request, res: Response) {
        try {
            const { token } = req.body;
            if (!token) {
                return res.status(400).json({ success: false, message: "Token is required" });
            }

            const loginResponse = await this.service.googleLogin(token);

            // Set secure cookies for Google login
            const isProduction = process.env.NODE_ENV === "production";
            res.cookie("accessToken", loginResponse.accessToken, {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? "none" : "lax",
                maxAge: 15 * 60 * 1000
            });

            res.cookie("refreshToken", loginResponse.refreshToken, {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? "none" : "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            const { accessToken, refreshToken, ...safeResponse } = loginResponse;
            return res.status(200).json({ success: true, message: "Google login successful", ...safeResponse });
        } catch (error: any) {
            return res.status(401).json({ success: false, message: error.message || "Invalid or expired Google token" });
        }
    }
}
