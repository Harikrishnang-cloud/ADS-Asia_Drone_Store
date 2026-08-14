"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Star, User, Loader2, MessageSquare, Trash2, Edit2 } from "lucide-react";
import Button from "@/components/ui/button";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";

interface Review {
    id: string;
    userId: string;
    userName: string;
    productId: string;
    rating: number;
    comment?: string;
    createdAt?: number;
}

interface ProductReviewsProps {
    productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
    const { user } = useAuthStore();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`/reviews/product/${productId}`);
                if (data.success) {
                    setReviews(data.reviews);
                }
            } catch (error) {
                console.error("Failed to fetch reviews:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [productId]);

    const averageRating = reviews.length
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : "0.0";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error("Please login to continue");
            return;
        }

        setSubmitting(true);
        try {
            if (editingReviewId) {
                const { data } = await api.put(`/reviews/${editingReviewId}`, {
                    rating,
                    comment
                });
                if (data.success) {
                    toast.success("Review updated");
                    setEditingReviewId(null);
                    setComment("");
                    setRating(5);
                    // Re-trigger useEffect by changing productId slightly or use a refresh trigger
                    window.location.reload(); 
                }
            } else {
                const { data } = await api.post("/reviews", {
                    productId,
                    rating,
                    comment
                });
                if (data.success) {
                    toast.success("Review added");
                    setComment("");
                    setRating(5);
                    window.location.reload();
                }
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || "Unable to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (reviewId: string) => {
        if (!confirm("Are you sure you want to delete this review?")) return;

        try {
            const { data } = await api.delete(`/reviews/${reviewId}`);
            if (data.success) {
                toast.success("Review deleted");
                window.location.reload();
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || "Unable to delete review");
        }
    };

    const handleEditClick = (review: Review) => {
        setEditingReviewId(review.id);
        setRating(review.rating);
        setComment(review.comment || "");
        document.getElementById("review-form")?.scrollIntoView({ behavior: 'smooth' });
    };

    const formatDate = (timestamp?: number) => {
        if (!timestamp) return "";
        return new Date(timestamp).toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const hasUserReviewed = user && reviews.some(r => r.userId === user.id);

    return (
        <div className="mt-10 md:mt-16 border-t border-slate-100">
            <h2 className="text-2xl md:text-3xl font-black text-brand-blue-dark mb-6 md:mb-10">Customer Reviews</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                {/* Review Stats */}
                <div className="lg:col-span-1 border border-slate-100 rounded-lg p-5 md:p-8 bg-white h-fit shadow-lg shadow-slate-200/50">
                    <div className="flex flex-col items-center justify-center text-center space-y-3 md:space-y-4">
                        <div className="text-5xl md:text-6xl font-black text-slate-800">{averageRating}</div>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Star
                                    key={i}
                                    size={24}
                                    className={i <= Number(averageRating) ? "fill-yellow-400 text-yellow-400" : "fill-slate-100 text-slate-200"}
                                />
                            ))}
                        </div>
                        <p className="text-slate-500 font-medium">Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
                    </div>

                    {/* Form */}
                    <div id="review-form" className="mt-8 md:mt-10 border-t border-slate-100 pt-6 md:pt-8">
                        <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-4 md:mb-6">
                            {editingReviewId ? "Update Review" : "Write a Review"}
                        </h3>
                        {!user ? (
                            <div className="bg-slate-50 p-6 rounded-2xl text-center">
                                <MessageSquare size={32} className="mx-auto text-slate-300 mb-3" />
                                <p className="text-slate-500 font-medium text-sm mb-4">You need to be logged in to write a review.</p>
                                <Button onClick={() => window.location.href = '/auth/login'} variant="secondary" fullWidth>Log In to Review</Button>
                            </div>
                        ) : hasUserReviewed && !editingReviewId ? (
                            <div className="bg-emerald-50 p-6 rounded-lg text-center border border-emerald-100">
                                <p className="text-emerald-700 font-bold text-sm">You have already reviewed this product.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Rating</label>
                                    <div className="flex items-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                type="button"
                                                key={star}
                                                onClick={() => setRating(star)}
                                                className="focus:outline-none transition-transform hover:scale-110"
                                            >
                                                <Star
                                                    size={32}
                                                    className={
                                                        star <= rating
                                                            ? "fill-yellow-400 text-yellow-400 drop-shadow-sm"
                                                            : "fill-slate-100 text-slate-200"
                                                    }
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Your Comment (Optional)</label>
                                    <textarea
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue resize-none transition-all"
                                        placeholder="Share your experience with this drone..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    ></textarea>
                                </div>
                                <div className="flex gap-3">
                                    <Button type="submit" fullWidth disabled={submitting}>
                                        {submitting ? <Loader2 className="animate-spin" /> : editingReviewId ? "Update Review" : "Post Review"}
                                    </Button>
                                    {editingReviewId && (
                                        <Button
                                            variant="secondary"
                                            type="button"
                                            onClick={() => {
                                                setEditingReviewId(null);
                                                setComment("");
                                                setRating(5);
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    )}
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                {/* Reviews List */}
                <div className="lg:col-span-2 space-y-4 md:space-y-6">
                    {loading ? (
                        <div className="flex justify-center py-10 md:py-20">
                            <Loader2 size={40} className="text-slate-300 animate-spin" />
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="bg-slate-50 border border-slate-100 rounded-lg p-8 md:p-12 text-center h-full flex flex-col items-center justify-center">
                            <MessageSquare className="text-slate-200 mb-4 md:mb-6 w-12 h-12 md:w-16 md:h-16" />
                            <h4 className="text-lg md:text-xl font-bold text-slate-700 mb-2">No reviews yet</h4>
                            <p className="text-slate-500 text-sm md:text-base">Be the first to review this product!</p>
                        </div>
                    ) : (
                        reviews.map((review) => (
                            <div key={review.id} className="bg-white border border-slate-100 p-4 sm:p-5 md:p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-3 md:mb-4">
                                    <div className="flex items-center gap-3 md:gap-4">
                                        <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 flex-shrink-0">
                                            <User size={20} className="md:w-6 md:h-6" />
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-sm md:text-base text-slate-900">{review.userName || "Customer"}</h5>
                                            <p className="text-[10px] md:text-xs text-slate-400 font-medium">{formatDate(review.createdAt)}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <Star
                                                    key={i}
                                                    size={16}
                                                    className={i <= review.rating ? "fill-yellow-400 text-yellow-400" : "fill-slate-100 text-slate-200"}
                                                />
                                            ))}
                                        </div>
                                        {user && user.id === review.userId && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEditClick(review)}
                                                    className="text-[10px] font-bold uppercase tracking-widest text-brand-blue hover:text-brand-orange transition-colors cursor-pointer flex items-center gap-1"
                                                >
                                                    <Edit2 size={12} /> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(review.id)}
                                                    className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors cursor-pointer flex items-center gap-1"
                                                >
                                                    <Trash2 size={12} /> Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {review.comment ? (
                                    <p className="text-slate-600 leading-relaxed text-sm md:text-base">{review.comment}</p>
                                ) : (
                                    <p className="text-slate-400 italic text-sm">No comment provided.</p>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
