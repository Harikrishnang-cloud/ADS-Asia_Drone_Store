"use client";

import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Search, ShieldAlert } from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";

interface NewsletterSub {
    id: string;
    email: string;
    status: string;
    subscribedAt: string;
}

export default function AdminNewsletterPage() {
    const [subscribers, setSubscribers] = useState<NewsletterSub[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchSubscribers = async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/support/admin/newsletter");
            if (data.success) {
                setSubscribers(data.subscriptions);
            }
        } catch (error: unknown) {
            console.error("Failed to fetch newsletters:", error);
            toast.error("Failed to fetch newsletters");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const filteredSubscribers = subscribers.filter((sub: NewsletterSub) => {
        const term = searchTerm.toLowerCase();
        return (
            (sub.email?.toLowerCase() || "").includes(term)
        );
    });

    return (
        <ProtectedRoute allowedRole="admin">
            <div className="mb-10 w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-3">
                            
                            Newsletter Subscribers
                        </h1>
                        <p className="text-slate-500 font-medium">Manage your mailing list</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden w-full">
                    <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
                        <div className="relative w-full sm:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by email address..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                            />
                        </div>
                        <div className="flex gap-4 w-full sm:w-auto">
                            <div className="bg-brand-blue/10 px-4 py-2 rounded-md text-brand-blue text-sm font-bold whitespace-nowrap">
                                Total Subscribers: {subscribers.length}
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left border-collapse min-w-max">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Subscribed Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mx-auto mb-4"></div>
                                            <p className="font-medium">Loading subscribers...</p>
                                        </td>
                                    </tr>
                                ) : filteredSubscribers.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-16 text-center text-slate-500">
                                            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <ShieldAlert className="text-slate-300" size={32} />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-700 mb-1">No Subscribers Found</h3>
                                            <p className="font-medium text-slate-500">No one has subscribed to the newsletter yet.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredSubscribers.map((sub: NewsletterSub) => (
                                        <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4">
                                                <a href={`mailto:${sub.email}`} className="font-bold text-slate-800 hover:text-brand-blue transition-colors">
                                                    {sub.email}
                                                </a>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${sub.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                                                    {sub.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
                                                {new Date(sub.subscribedAt).toLocaleDateString()} {new Date(sub.subscribedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
