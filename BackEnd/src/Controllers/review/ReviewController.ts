import type { Request, Response } from "express";
import { ReviewService } from "../../Service/review/ReviewService.ts";
import { userRepository } from "../../Repository/user/userRepository.ts";
import db from "../../Config/config.firebase.ts";

export class ReviewController {
    private reviewService: ReviewService;
    private userRepo: userRepository;

    constructor() {
        this.reviewService = new ReviewService();
        this.userRepo = new userRepository();
    }

    async addReview(req: Request, res: Response): Promise<void> {
        try {
            const { productId, rating, comment } = req.body;
            const userId = req.user?.id;
            
            if (!userId) {
                res.status(401).json({ success: false, message: "Unauthorized" });
                return;
            }

            // Get User Name
            const userDoc = await this.userRepo.findUserById(userId);
            const userName = userDoc ? userDoc.name : "Anonymous";

            const review = await this.reviewService.addReview(userId, userName, { productId, rating, comment });
            res.status(201).json({ success: true, message: "Review added successfully", review });
        } catch (error: any) {
            console.error("Add review error:", error.message);
            res.status(400).json({ success: false, message: error.message || "Failed to add review" });
        }
    }

    async getReviewsForProduct(req: Request, res: Response): Promise<void> {
        try {
            const productId = req.params.productId as string;
            const reviews = await this.reviewService.getReviewsForProduct(productId);
            res.status(200).json({ success: true, reviews });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || "Failed to fetch reviews" });
        }
    }

    async updateReview(req: Request, res: Response): Promise<void> {
        try {
            const reviewId = req.params.reviewId as string;
            const { rating, comment } = req.body;
            const userId = req.user?.id;

            if (!userId) {
                res.status(401).json({ success: false, message: "Unauthorized" });
                return;
            }

            const updatedReview = await this.reviewService.updateReview(userId, reviewId, { rating, comment });
            res.status(200).json({ success: true, message: "Review updated successfully", review: updatedReview });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message || "Failed to update review" });
        }
    }

    async deleteReview(req: Request, res: Response): Promise<void> {
        try {
            const reviewId = req.params.reviewId as string;
            const userId = req.user?.id;
            const userRole = req.user?.role;

            if (!userId || !userRole) {
                res.status(401).json({ success: false, message: "Unauthorized" });
                return;
            }

            await this.reviewService.deleteReview(userId, userRole, reviewId);
            res.status(200).json({ success: true, message: "Review deleted successfully" });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message || "Failed to delete review" });
        }
    }

    async getAllReviews(req: Request, res: Response): Promise<void> {
        try {
            const reviews = await this.reviewService.getAllReviewsForAdmin();
            res.status(200).json({ success: true, reviews });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || "Failed to fetch reviews" });
        }
    }

    async getTopReviewedProducts(req: Request, res: Response): Promise<void> {
        try {
            const limit = parseInt(req.query.limit as string) || 5;
            
            const snapshot = await db.collection("products")
                .orderBy("totalReviews", "desc")
                .orderBy("averageRating", "desc")
                .limit(limit)
                .get();
            
            const products = [];
            for (const doc of snapshot.docs) {
                products.push({ id: doc.id, ...doc.data() });
            }

            res.status(200).json({ success: true, products });
        } catch (error: any) {
            console.error("Top products error:", error.message);
            res.status(500).json({ success: false, message: error.message || "Failed to fetch top reviewed products" });
        }
    }
}
