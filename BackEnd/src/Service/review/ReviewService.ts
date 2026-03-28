import type { IReview } from "../../Interface/review/IReview.ts";
import { ReviewRepository } from "../../Repository/review/ReviewRepository.ts";

export class ReviewService {
    private reviewRepo: ReviewRepository;

    constructor() {
        this.reviewRepo = new ReviewRepository();
    }

    async addReview(userId: string, userName: string, data: { productId: string, rating: number, comment?: string }): Promise<IReview> {
        const { productId, rating, comment } = data;

        // Validation: Must be 1-5
        if (rating < 1 || rating > 5) {
            throw new Error("Rating must be between 1 and 5.");
        }

        // Validation: Only one review per user per product
        const existingReview = await this.reviewRepo.getReviewsByUserAndProduct(userId, productId);
        if (existingReview) {
            throw new Error("You have already reviewed this product.");
        }

        // Validation: Check if the user has a completed order
        const hasOrdered = await this.reviewRepo.hasUserCompletedOrder(userId, productId);
        if (!hasOrdered) {
            throw new Error("You can only review products that you have purchased and received.");
        }

        const product = await this.reviewRepo.getProductById(productId);
        const productName = product ? product.name : "Unknown Product";

        // Create review
        const newReview: IReview = {
            userId,
            userName,
            productId,
            productName,
            rating
        };
        if (comment !== undefined) {
            newReview.comment = comment;
        }
        const savedReview = await this.reviewRepo.createReview(newReview);

        // Update product aggregations
        await this.updateProductAverages(productId);

        return savedReview;
    }

    async getReviewsForProduct(productId: string): Promise<IReview[]> {
        return await this.reviewRepo.getReviewsByProduct(productId);
    }

    async updateReview(userId: string, reviewId: string, updates: { rating?: number, comment?: string }): Promise<IReview> {
        const review = await this.reviewRepo.getReviewById(reviewId);
        if (!review) throw new Error("Review not found.");

        if (review.userId !== userId) {
            throw new Error("You can only update your own reviews.");
        }

        if (updates.rating && (updates.rating < 1 || updates.rating > 5)) {
            throw new Error("Rating must be between 1 and 5.");
        }

        const updated = await this.reviewRepo.updateReview(reviewId, updates);
        await this.updateProductAverages(review.productId);
        return updated;
    }

    async deleteReview(userId: string, userRole: string, reviewId: string): Promise<void> {
        const review = await this.reviewRepo.getReviewById(reviewId);
        if (!review) throw new Error("Review not found.");

        // Admins can delete any review
        if (userRole !== "admin" && review.userId !== userId) {
            throw new Error("You can only delete your own reviews.");
        }

        await this.reviewRepo.deleteReview(reviewId);
        await this.updateProductAverages(review.productId);
    }

    async getAllReviewsForAdmin(): Promise<IReview[]> {
        return await this.reviewRepo.getAllReviews();
    }

    private async updateProductAverages(productId: string): Promise<void> {
        const reviews = await this.reviewRepo.getReviewsByProduct(productId);
        const totalReviews = reviews.length;
        if (totalReviews === 0) {
            await this.reviewRepo.updateProductRatingAvg(productId, 0, 0);
            return;
        }

        const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
        // Calculate average rounded to 1 decimal place
        const avgRating = Math.round((sum / totalReviews) * 10) / 10;
        await this.reviewRepo.updateProductRatingAvg(productId, avgRating, totalReviews);
    }
}
