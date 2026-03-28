import type { IReview } from "../../Interface/review/IReview";

export interface IReviewRepository {
    createReview(review: IReview): Promise<IReview>;
    updateReview(id: string, review: Partial<IReview>): Promise<IReview>;
    deleteReview(id: string): Promise<void>;
    getReviewById(id: string): Promise<IReview | null>;
    getReviewsByProduct(productId: string): Promise<IReview[]>;
    getReviewsByUserAndProduct(userId: string, productId: string): Promise<IReview | null>;
    getAllReviews(): Promise<IReview[]>;
    hasUserCompletedOrder(userId: string, productId: string): Promise<boolean>;
    updateProductRatingAvg(productId: string, avgRating: number, totalReviews: number): Promise<void>;
    getProductById(productId: string): Promise<any>;
}
