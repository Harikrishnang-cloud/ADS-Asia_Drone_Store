import type { Iuser } from "../../Interface/user/user.models.interface.js";
import type { IuserService } from "../../Service/user/IuserService.js";
import type { Request, Response } from "express";
export class userController {
    private userService: IuserService;

    constructor(userService: IuserService) {
        this.userService = userService;
    }
    async userRegister(req: Request, res: Response) {
        try {
            const user: Iuser = req.body;
            const result = await this.userService.register(user);
            res.status(201).json({ success: true, message: "User registered successfully", result });
        } catch (error) {
            console.log("Error while registering user", error);
            if (error instanceof Error) {
                res.status(500).json({ success: false, message: error.message });
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
            const selectedUserData = {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
            if (user) {
                res.status(200).json({ success: true, message: "User logged in successfully", result: selectedUserData });
            }
        } catch (error) {
            console.log("Error while logging in user", error);
            if (error instanceof Error) {
                res.status(500).json({ success: false, message: error.message });
            }
        }
    }
}