import express, { Router } from "express";
import { ReviewController } from "../../Controllers/review/ReviewController.ts";
import { userMiddleware, adminMiddleware } from "../../Middleware/authMiddleware.ts";

export class reviewRoutes {
    private reviewController: ReviewController;
    private router: Router;

    constructor() {
        this.reviewController = new ReviewController();
        this.router = express.Router();
        this.setRoutes();
    }

    private setRoutes() {
        // Public/Product specific
        this.router.get("/product/:productId", this.reviewController.getReviewsForProduct.bind(this.reviewController));
        this.router.get("/top-products", this.reviewController.getTopReviewedProducts.bind(this.reviewController));

        // User Routes (Logged-in users)
        this.router.post("/", userMiddleware, this.reviewController.addReview.bind(this.reviewController));
        this.router.put("/:reviewId", userMiddleware, this.reviewController.updateReview.bind(this.reviewController));
        this.router.delete("/:reviewId", userMiddleware, this.reviewController.deleteReview.bind(this.reviewController));

        // Admin Routes
        this.router.get("/admin/all", adminMiddleware, this.reviewController.getAllReviews.bind(this.reviewController));
        this.router.delete("/admin/:reviewId", adminMiddleware, this.reviewController.deleteReview.bind(this.reviewController));
    }

    public getReviewRoutes(): Router {
        return this.router;
    }
}
