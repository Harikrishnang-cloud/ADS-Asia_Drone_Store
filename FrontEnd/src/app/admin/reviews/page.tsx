"use client";

import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Star, Search, Trash2, ShieldAlert } from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";

interface Review {
    id: string;
    userId: string;
    userName: string;
    productId: string;
    productName?: string;
    rating: number;
    comment?: string;
    createdAt?: number;
}

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/reviews/admin/all");
            if (data.success) {
                setReviews(data.reviews);
            }
        } catch (error: any) {
            console.error("Failed to fetch reviews:", error);
            toast.error("Failed to fetch reviews");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleDelete = async (reviewId: string) => {
        if (!confirm("Are you sure you want to delete this review?")) return;
        try {
            const { data } = await api.delete(`/reviews/admin/${reviewId}`);
            if (data.success) {
                toast.success("Review deleted successfully");
                fetchReviews();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete review");
        }
    };

    const filteredReviews = reviews.filter((review: Review) => {
        const term = searchTerm.toLowerCase();
        return (
            (review.productName?.toLowerCase() || "").includes(term) ||
            (review.userName?.toLowerCase() || "").includes(term) ||
            (review.comment?.toLowerCase() || "").includes(term)
        );
    });

    return (
        <ProtectedRoute allowedRole="admin">
            <div className="mb-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Manage Reviews</h1>
                        <p className="text-slate-500 font-medium">Monitor and moderate customer reviews</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full sm:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by product, user, or keyword..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"/>
                        </div>
                        <div className="flex gap-4 w-full sm:w-auto">
                            <div className="bg-brand-orange/10 px-4 py-2 rounded-md text-brand-orange text-sm font-bold whitespace-nowrap">
                                Total Reviews: {reviews.length}
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Rating</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider max-w-md">Comment</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mx-auto"></div>
                                        </td>
                                    </tr>
                                ) : filteredReviews.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                            <ShieldAlert className="mx-auto mb-3 text-slate-300" size={32} />
                                            <p className="font-medium text-slate-600">No reviews found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredReviews.map((review: Review) => (
                                        <tr key={review.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-slate-800 line-clamp-2">
                                                    {review.productName || "Unknown Product"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-slate-600 font-medium">
                                                    {review.userName || "Customer"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-0.5">
                                                    {[1, 2, 3, 4, 5].map((i) => (
                                                        <Star key={i} size={14} className={i <= review.rating ? "fill-brand-orange text-brand-orange" : "fill-slate-200 text-slate-200"} />
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 max-w-md">
                                                <p className="text-sm text-slate-600 line-clamp-2" title={review.comment || ""}>
                                                    {review.comment || <span className="text-slate-400 italic">No comment</span>}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                                                {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(review.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                                    title="Delete Review"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
