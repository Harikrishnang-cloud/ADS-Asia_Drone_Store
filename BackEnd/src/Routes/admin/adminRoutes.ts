import { Router } from "express";
import { adminControllers } from "../../Controllers/admin/adminControllers.ts";
import { adminMiddleware } from "../../Middleware/authMiddleware.ts";

export class adminRoutes {
    private router: Router;
    private adminControllers: adminControllers;

    constructor() {
        this.router = Router();
        this.adminControllers = new adminControllers();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Admin login does not require token
        this.router.post("/login", this.adminControllers.login);
        this.router.post("/logout", this.adminControllers.logout);

        // Protected routes
        this.router.get("/dashboard", adminMiddleware, this.adminControllers.getDashboard);
    }

    public getAdminRoutes(): Router {
        return this.router;
    }
}
