import express from "express";
import type { Request, Response } from "express";
import { userController } from "../../Controllers/user/userControllers.js";

export class userRoutes {
    private userController: userController;
    private userRoutes: express.Router;

    constructor(userController: userController) {
        this.userController = userController;
        this.userRoutes = express.Router();
        this.setRoutes();
    }

    private setRoutes() {
        this.userRoutes.post("/user/register", (req: Request, res: Response) => {
            this.userController.userRegister(req, res);
        });
        this.userRoutes.post("/user/login", (req: Request, res: Response) => {
            this.userController.userLogin(req, res);
        });
    }

    public getUserRoutes() {
        return this.userRoutes;
    }
}