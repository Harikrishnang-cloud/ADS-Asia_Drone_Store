import { authRepository } from "../Repository/auth.repository.ts";
import { sendResetOTPEmail } from "../utils/email.service.ts";
import bcrypt from "bcrypt";
import { admin } from "../Config/config.firebase.ts";
import { jwtToken } from "../utils/jwt.ts";

export class authService {
    private repo: authRepository;
    private jwtUtils: jwtToken;

    constructor() {
        this.repo = new authRepository();
        this.jwtUtils = new jwtToken();
    }

    async forgotPassword(email: string) {
        const user = await this.repo.findUserByEmail(email);
        if (!user) {
            console.log(`❌ Error: User with email ${email} DOES NOT exist in Firebase database.`);
            throw new Error("User not found");
        }
        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`Generated OTP is:  ${otp}`);
        // Expiry 5 mins from now
        const expiry = new Date(Date.now() + 5 * 60 * 1000);

        await this.repo.updateResetToken(user._id, { resetOtp: otp, resetOtpExpiry: expiry });

        // Send Email
        await sendResetOTPEmail(user.name, email, otp);

        return { message: "OTP sent to email successfully" };
    }

    async verifyResetOtp(email: string, otp: string) {
        const user = await this.repo.findUserByEmail(email);
        
        if (!user) {
            throw new Error("User not found");
        }

        if (user.resetOtp !== otp) {
            throw new Error("Invalid OTP");
        }

        if (!user.resetOtpExpiry || new Date() > new Date(user.resetOtpExpiry)) {
            throw new Error("OTP Expired");
        }

        return { message: "OTP verified successfully" };
    }

    async resetPassword(email: string, password: string) {
        const user = await this.repo.findUserByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }

        console.log(`Resetting Password for: ${email} `);
        console.log(`New Password is: ${password}`);


        const hashedPassword = await bcrypt.hash(password, 10);
        await this.repo.updatePassword(user._id, hashedPassword);

        return { message: "Password reset successfully" };
    }

    async resendResetOtp(email: string) {
        const user = await this.repo.findUserByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }

        if (user.resetOtpExpiry) {
            const timeRemaining = new Date(user.resetOtpExpiry).getTime() - Date.now();
            if (timeRemaining > 4 * 60 * 1000) {
                throw new Error("Please wait 60 seconds before requesting a new OTP");
            }
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 5 * 60 * 1000);

        await this.repo.updateResetToken(user._id, { resetOtp: otp, resetOtpExpiry: expiry });
        await sendResetOTPEmail(user.name,email, otp);

        return { message: "New OTP sent to email successfully" };
    }

    async googleLogin(token: string) {
        try {
            const decodedToken = await admin.auth().verifyIdToken(token);
            const { email, name, picture, uid } = decodedToken;

            if (!email) {
                throw new Error("No email found in Firebase token");
            }

            let user = await this.repo.findUserByEmail(email);

            if (!user) {
                user = await this.repo.createUser({
                    name: name || "Google User",
                    email: email,
                    image: picture || "",
                    provider: "google",
                    firebaseUid: uid,
                    role: "user"
                });
            }

            const accessToken = this.jwtUtils.generateAccessToken({ id: user._id, email: user.email, role: user.role || "user" });
            const refreshToken = this.jwtUtils.generateRefreshToken({ id: user._id, email: user.email, role: user.role || "user" });

            return {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: user.role || "user"
                },
                accessToken,
                refreshToken
            };
        } catch (error) {
            console.error("Google Login Error:", error);
            throw new Error("Invalid or expired Google token");
        }
    }
}
