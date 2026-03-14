import type { Request, Response } from "express";
import { authService } from "../Service/auth.service.ts";

export class authController {
    private service: authService;

    constructor() {
        this.service = new authService();
    }

    async forgotPassword(req: Request, res: Response) {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ success: false, message: "Email is required" });
            }

            await this.service.forgotPassword(email);
            return res.status(200).json({ success: true, message: "OTP sent to email successfully" });
        } catch (error: any) {
            if (error.message === "User not found") {
                return res.status(404).json({ success: false, message: error.message });
            }
            return res.status(500).json({ success: false, message: "Server error during forgot password" });
        }
    }

    async verifyResetOtp(req: Request, res: Response) {
        try {
            const { email, otp } = req.body;
            if (!email || !otp) {
                return res.status(400).json({ success: false, message: "Email and OTP are required" });
            }

            await this.service.verifyResetOtp(email, otp);
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
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ success: false, message: "Email and new password are required" });
            }

            await this.service.resetPassword(email, password);
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
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ success: false, message: "Email is required" });
            }

            await this.service.resendResetOtp(email);
            return res.status(200).json({ success: true, message: "New OTP sent to email successfully" });
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
            return res.status(200).json({ success: true, message: "Google login successful", ...loginResponse });
        } catch (error: any) {
            return res.status(401).json({ success: false, message: error.message || "Invalid or expired Google token" });
        }
    }
}
