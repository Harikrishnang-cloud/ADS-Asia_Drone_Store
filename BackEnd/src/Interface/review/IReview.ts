export interface IReview {
    id?: string;
    userId: string;
    userName: string;
    productId: string;
    productName?: string;
    rating: number; // 1-5
    comment?: string;
    createdAt?: any;
    updatedAt?: any;
}
