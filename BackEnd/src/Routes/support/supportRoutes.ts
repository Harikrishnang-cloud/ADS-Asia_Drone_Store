import express, { Router } from "express";
import { SupportController } from "../../Controllers/support/SupportController.ts";
import { adminMiddleware } from "../../Middleware/authMiddleware.ts";

export class supportRoutes {
    private supportController: SupportController;
    private router: Router;

    constructor() {
        this.supportController = new SupportController();
        this.router = express.Router();
        this.setRoutes();
    }

    private setRoutes() {
        // Public endpoints
        this.router.post("/contact", this.supportController.submitContact.bind(this.supportController));
        this.router.post("/newsletter", this.supportController.subscribeNewsletter.bind(this.supportController));

        // Admin endpoints
        this.router.get("/admin/contact", adminMiddleware, this.supportController.getContacts.bind(this.supportController));
        this.router.get("/admin/newsletter", adminMiddleware, this.supportController.getNewsletters.bind(this.supportController));
    }

    public getSupportRoutes(): Router {
        return this.router;
    }
}
