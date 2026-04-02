"use client";

import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { 
    MessageCircle, Calendar, 
    ArrowRight, ShoppingBag, Mail,
    Search
} from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { useAuthStore } from "@/store/authStore";

interface Order {
    id: string;
    adminMessage?: string;
    status: string;
    createdAt: Timestamp | string | number | Date | null;
    items: { image: string; name: string }[];
}

export default function MessagesPage() {
    const { user } = useAuthStore();
    const [messages, setMessages] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const { isInitialized } = useAuth();

    useEffect(() => {
        const fetchMessages = async () => {
            if (!user?.id) return;

            try {
                const q = query(
                    collection(db, "orders"),
                    where("userId", "==", user.id)
                );
                
                const querySnapshot = await getDocs(q);
                
                const orderWithMessages = querySnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() } as Order))
                    .filter(order => order.adminMessage && order.adminMessage.trim() !== "");
                
                // Sort by date descending
                orderWithMessages.sort((a, b) => {
                    const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toMillis() : new Date(a.createdAt || 0).getTime();
                    const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toMillis() : new Date(b.createdAt || 0).getTime();
                    return dateB - dateA;
                });
                
                setMessages(orderWithMessages);
                
                // Set last viewed timestamp for unread badge logic
                if (typeof window !== "undefined") {
                    localStorage.setItem("ads_messages_last_viewed", Date.now().toString());
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
            } finally {
                setLoading(false);
            }
        };

        if (isInitialized) {
            fetchMessages();
        }
    }, [user, isInitialized]);

    const formatDate = (timestamp: Timestamp | string | number | Date | null) => {
        if (!timestamp) return 'No Date';
        const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
        return new Intl.DateTimeFormat('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const filteredMessages = messages.filter(m => 
        m.adminMessage?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <ProtectedRoute allowedRole="user">
            <div className="min-h-screen bg-slate-50 pt-24 md:pt-32 pb-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                <MessageCircle className="text-brand-blue" size={32} />
                                Support Messages
                            </h1>
                            <p className="text-slate-500 font-medium ml-1">View official updates and messages regarding your orders.</p>
                        </div>
                        
                        {/* Search Bar */}
                        <div className="relative w-full md:w-72">
                            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search messages or Order IDs..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-brand-blue outline-none transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
                            <p className="text-slate-500 font-bold animate-pulse">Loading your messages...</p>
                        </div>
                    ) : filteredMessages.length === 0 ? (
                        <div className="bg-white rounded-lg p-16 border border-slate-100 shadow-sm flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                <Mail className="text-slate-200 w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">No Messages Found</h2>
                            <p className="text-slate-500 max-w-sm mb-8">
                                {searchQuery 
                                    ? "We couldn't find any messages matching your search criteria." 
                                    : "You don't have any support messages yet. Official updates about your orders will appear here."}
                            </p>
                            <Link href="/user/orders">
                                <button className="px-6 py-3 bg-brand-blue text-white rounded-lg font-bold hover:bg-brand-blue/90 transition-all flex items-center gap-2">
                                    <ShoppingBag size={18} /> View My Orders
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {filteredMessages.map((msg) => (
                                <div key={msg.id} className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">
                                    <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
                                        
                                        {/* Avatar & Icon */}
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                                                <Mail size={24} />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 space-y-4">
                                            <div className="flex flex-wrap items-center justify-between gap-4">
                                                <div className="space-y-0.5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue/60">Official Support Message</span>
                                                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                        <span className="text-xs font-bold text-slate-400">Order #{msg.id.slice(-6).toUpperCase()}</span>
                                                    </div>
                                                    <h3 className="text-sm font-bold text-slate-500 flex items-center gap-2">
                                                        <Calendar size={14} /> {formatDate(msg.createdAt)}
                                                    </h3>
                                                </div>
                                                <Link 
                                                    href={`/user/orders?id=${msg.id}`}
                                                    className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-blue transition-colors"
                                                >
                                                    View Order <ArrowRight size={14} />
                                                </Link>
                                            </div>

                                            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-50">
                                                <p className="text-lg font-bold text-slate-800 leading-relaxed italic">
                                                    &quot;{msg.adminMessage}&quot;
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between pt-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex -space-x-2">
                                                        {msg.items?.slice(0, 3).map((item, i) => (
                                                            <div key={i} className="w-8 h-8 rounded-lg ring-2 ring-white overflow-hidden bg-slate-100">
                                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                <img src={item.image} alt="" className="w-full h-full object-cover" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase text-slate-400">
                                                        {msg.items?.[0]?.name || "Product Update"} 
                                                        {msg.items?.length > 1 && ` +${msg.items.length - 1} more`}
                                                    </span>
                                                </div>
                                                
                                                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                                    msg.status.toLowerCase() === 'delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                    msg.status.toLowerCase() === 'shipped' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                                    msg.status.toLowerCase() === 'out for delivery' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                                    'bg-blue-50 text-blue-600 border-blue-100'
                                                }`}>
                                                    {msg.status}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
