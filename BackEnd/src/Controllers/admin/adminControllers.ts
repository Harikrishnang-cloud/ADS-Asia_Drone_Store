import type { Request, Response } from "express";
import { adminService } from "../../Service/admin/adminService.ts";

export class adminControllers {
    private adminService: adminService;

    constructor() {
        this.adminService = new adminService();
    }

    login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ success: false, message: "Email and password are required" });
            }

            const { user, tokens } = await this.adminService.login(email, password);

            const selectedUserData = {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            };
            return res.status(200).json({success: true, message: "Admin logged in successfully", result: selectedUserData, ...tokens});
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "Admin not found" || error.message === "Invalid password") {
                    return res.status(401).json({ success: false, message: "Invalid credentials" });
                } else if (error.message === "Access denied: Not an Admin") {
                    return res.status(403).json({ success: false, message:"forbidden",error:error.message});
                } else {
                    return res.status(500).json({ success: false, message:"internal server error",error:error.message });
                }
            } else {
                return res.status(500).json({ success: false, message: "internal server error" });
            }
        }
    };

    getDashboard = async (req: Request, res: Response) => {
        return res.status(200).json({ success: true, message: "Welcome to Admin Dashboard" });
    };
}
