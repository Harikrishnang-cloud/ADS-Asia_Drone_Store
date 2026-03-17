import express from "express";
import type { Request, Response } from "express";
import { userController } from "../../Controllers/user/userControllers.ts";
import { authMiddleware, userMiddleware } from "../../Middleware/authMiddleware.ts";

export class userRoutes {
    private userController: userController;
    private userRoutes: express.Router;

    constructor(userController: userController) {
        this.userController = userController;
        this.userRoutes = express.Router();
        this.setRoutes();
    }

    private setRoutes() {
        // Public routes (no auth required)
        this.userRoutes.post("/user/register", (req: Request, res: Response) => {
            this.userController.userRegister(req, res);
        })
        this.userRoutes.post("/user/login", (req: Request, res: Response) => {
            this.userController.userLogin(req, res);
        })
        this.userRoutes.post("/user/refresh-token", (req: Request, res: Response) => {
            this.userController.refreshToken(req, res);
        })
        this.userRoutes.post("/user/logout", (req: Request, res: Response) => {
            this.userController.logout(req, res);
        })

        // Protected routes (auth required)
        this.userRoutes.get("/user/profile", userMiddleware, (req: Request, res: Response) => {
            this.userController.getUserProfile(req, res);
        });
    }

    public getUserRoutes() {
        return this.userRoutes;
    }
}