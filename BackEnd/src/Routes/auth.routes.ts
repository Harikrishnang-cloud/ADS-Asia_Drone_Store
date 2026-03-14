import { Router } from "express";
import { authController } from "../Controllers/auth.controller.ts";

export class authRoutes {
    private router: Router;
    private controller: authController;

    constructor() {
        this.router = Router();
        this.controller = new authController();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post("/forgot-password", this.controller.forgotPassword.bind(this.controller));
        this.router.post("/verify-reset-otp", this.controller.verifyResetOtp.bind(this.controller));
        this.router.post("/reset-password", this.controller.resetPassword.bind(this.controller));
        this.router.post("/resend-reset-otp", this.controller.resendResetOtp.bind(this.controller));
        this.router.post("/google-login", this.controller.googleLogin.bind(this.controller));
    }

    public getAuthRoutes() {
        return this.router;
    }
}
