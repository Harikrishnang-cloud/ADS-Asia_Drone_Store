import db from "../../Config/config.firebase.ts";
import type { IReview } from "../../Interface/review/IReview.ts";
import type { IReviewRepository } from "./IReviewRepository.ts";

const reviewsCollection = db.collection("reviews");
const ordersCollection = db.collection("orders");
const productsCollection = db.collection("products");

export class ReviewRepository implements IReviewRepository {
    async createReview(review: IReview): Promise<IReview> {
        const newReview = { ...review, createdAt: Date.now(), updatedAt: Date.now() };
        const docRef = await reviewsCollection.add(newReview);
        return { ...newReview, id: docRef.id };
    }

    async updateReview(id: string, review: Partial<IReview>): Promise<IReview> {
        const docRef = reviewsCollection.doc(id);
        const updateData = { ...review, updatedAt: Date.now() };
        await docRef.update(updateData);
        const doc = await docRef.get();
        return { id: doc.id, ...doc.data() } as IReview;
    }

    async deleteReview(id: string): Promise<void> {
        await reviewsCollection.doc(id).delete();
    }

    async getReviewById(id: string): Promise<IReview | null> {
        const doc = await reviewsCollection.doc(id).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() } as IReview;
    }

    async getReviewsByProduct(productId: string): Promise<IReview[]> {
        const snapshot = await reviewsCollection.where("productId", "==", productId).get();
        const reviews: IReview[] = [];
        snapshot.forEach(doc => {
            reviews.push({ id: doc.id, ...doc.data() } as IReview);
        });
        return reviews.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }

    async getReviewsByUserAndProduct(userId: string, productId: string): Promise<IReview | null> {
        const snapshot = await reviewsCollection
            .where("userId", "==", userId)
            .where("productId", "==", productId)
            .limit(1)
            .get();

        if (snapshot.empty) return null;
        let review: IReview | null = null;
        snapshot.forEach(doc => {
            review = { id: doc.id, ...doc.data() } as IReview;
        });
        return review;
    }

    async getAllReviews(): Promise<IReview[]> {
        const snapshot = await reviewsCollection.get();
        const reviews: IReview[] = [];
        snapshot.forEach(doc => {
            reviews.push({ id: doc.id, ...doc.data() } as IReview);
        });
        return reviews.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }

    async hasUserCompletedOrder(userId: string, productId: string): Promise<boolean> {
        const snapshot = await ordersCollection
            .where("userId", "==", userId)
            .where("status", "in", ["Delivered", "delivered"])
            .get();

        if (snapshot.empty) return false;

        let hasCompleted = false;
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.items && Array.isArray(data.items)) {
                if (data.items.some((item: any) => item.id === productId)) {
                    hasCompleted = true;
                }
            }
        });

        return hasCompleted;
    }

    async updateProductRatingAvg(productId: string, avgRating: number, totalReviews: number): Promise<void> {
        await productsCollection.doc(productId).update({
            averageRating: avgRating,
            totalReviews: totalReviews
        });
    }

    async getProductById(productId: string): Promise<any> {
        const doc = await productsCollection.doc(productId).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() };
    }
}
