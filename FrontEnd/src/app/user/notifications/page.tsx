"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Tag, Info, AlertCircle, ChevronRight } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Link from "next/link";

interface Notification {
    id: string;
    title: string;
    message: string;
    type: "offer" | "info" | "alert";
    createdAt: number;
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "offer" | "info" | "alert">("all");

    const { isInitialized } = useAuth();

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Notification));
                setNotifications(data);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            } finally {
                setLoading(false);
            }
        };

        if (isInitialized) {
            fetchNotifications();
        } else if (!isInitialized) {
            // Optional: You can keep loading true or handle otherwise
        }
        
        // Reset notification count on storage
        if (typeof window !== "undefined") {
            localStorage.setItem("ads_notifications_last_read", Date.now().toString());
            window.dispatchEvent(new Event('storage'));
        }
    }, [isInitialized]);

    const filteredNotifications = notifications.filter(n => 
        filter === "all" ? true : n.type === filter
    );

    return (
        <ProtectedRoute allowedRole="user">
            <div className="min-h-screen bg-slate-50 pt-24 md:pt-32 pb-12">
                <div className="max-w-3xl mx-auto px-4">
                    {/* Simple Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-brand-blue-dark mb-6 md:mb-8">My Notifications</h1>
                            <p className="text-slate-500 text-sm mt-1">Recent updates and offers for you</p>
                        </div>
                        {/* <div className="bg-white border border-slate-200 px-3 py-1 rounded text-xs font-bold text-slate-400">
                            {notifications.length} Total
                        </div> */}
                    </div>

                    {/* Simple Filter Pills */}
                    <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                        {["all", "offer", "info", "alert"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f as "all" | "offer" | "info" | "alert")}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors cursor-pointer capitalize ${
                                    filter === f 
                                    ? "bg-brand-blue-dark text-white border-brand-blue-dark" 
                                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    {/* Standard Message List */}
                    <div className="space-y-3">
                        {loading ? (
                            Array(3).fill(0).map((_, i) => (
                                <div key={i} className="h-24 bg-white border border-slate-100 rounded-xl animate-pulse"></div>
                            ))
                        ) : filteredNotifications.length > 0 ? (
                            filteredNotifications.map((notif) => (
                                <div 
                                    key={notif.id} 
                                    className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors shadow-sm"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`p-2 rounded-lg shrink-0 ${
                                            notif.type === 'offer' ? 'bg-orange-50 text-orange-600' :
                                            notif.type === 'alert' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                                        }`}>
                                            {notif.type === 'offer' ? <Tag size={18} /> : 
                                             notif.type === 'alert' ? <AlertCircle size={18} /> : <Info size={18} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-slate-800 leading-snug">{notif.title}</h3>
                                                <span className="text-[10px] uppercase font-bold text-slate-400">
                                                    {new Date(notif.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                                                {notif.message}
                                            </p>
                                            {notif.type === 'offer' && (
                                                <Link 
                                                    href="/products" 
                                                    className="inline-flex items-center gap-1 mt-3 text-xs font-bold text-brand-orange hover:gap-2 transition-all"
                                                >
                                                    View Offers <ChevronRight size={14} />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 bg-white border border-dashed border-slate-300 rounded-2xl text-center">
                                <p className="text-slate-400 font-medium">No notifications to display.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
