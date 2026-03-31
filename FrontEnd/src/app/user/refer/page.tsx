"use client";

import React, { useState, useEffect } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";
import { Copy, Check, Share2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ReferPage() {
    const { user } = useAuthStore();
    const [copied, setCopied] = useState(false);
    const [referralLink, setReferralLink] = useState("");

    useEffect(() => {
        const uniqueCode = user?.id ? user.id.slice(0, 8).toUpperCase() : (user?.name?.slice(0, 4).toUpperCase() || "USER") + "X9";
        const link = `${window.location.origin}/signup?ref=${uniqueCode}`;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setReferralLink(link);
    }, [user]);

    const handleCopy = () => {
        if (!referralLink) return;
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        toast.success("Referral link copied to clipboard!");
        setTimeout(() => setCopied(false), 3000);
    };

    const handleShare = async () => {
        if (!referralLink) return;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Join Asia Drone Store",
                    text: `Hey! Use my referral code to join Asia Drone Store and get an exclusive discount.`,
                    url: referralLink,
                });
            } catch {
                console.log("Sharing cancelled");
            }
        } else {
            handleCopy();
        }
    };

    return (
        <ProtectedRoute allowedRole="user">
            <div className="max-w-3xl mx-auto py-16 px-4 min-h-[80vh] flex flex-col items-center justify-center text-center">
                
                <h1 className="text-3xl md:text-5xl font-black text-brand-blue-dark tracking-tight mb-4">
                    Invite friends, to get rewards.
                </h1>
                
                <p className="text-slate-500 font-medium text-lg max-w-lg mb-12 leading-relaxed">
                    Share your unique link with friends. They get a discount on their first setup, and you earn wallet credits when they place an order.
                </p>

                {/* Functionality: The Link Box */}
                <div className="w-full max-w-md bg-white border-2 border-slate-100 shadow-sm rounded-xl p-1.5 flex flex-col sm:flex-row items-center justify-between gap-2 group transition-all hover:border-brand-blue/30 focus-within:border-brand-blue focus-within:ring-4 focus-within:ring-brand-blue/10">
                    <input 
                        type="text" 
                        readOnly 
                        value={referralLink} 
                        placeholder="Generating link..."
                        className="w-full bg-transparent px-4 py-3 text-slate-700 font-bold outline-none text-sm md:text-base truncate placeholder:text-slate-300 placeholder:font-medium text-center sm:text-left"
                    />
                    
                    <button 
                        onClick={handleCopy}
                        disabled={!referralLink}
                        className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-black uppercase tracking-widest text-[11px] transition-all shrink-0 ${
                            copied 
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                            : "bg-slate-900 text-white hover:bg-black"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {copied ? (
                            <><Check size={16} /> Copied</>
                        ) : (
                            <><Copy size={16} /> Copy</>
                        )}
                    </button>
                </div>

                {/* Additional Working Functionality Action */}
                <button 
                    onClick={handleShare}
                    disabled={!referralLink}
                    className="mt-8 flex items-center gap-2 text-brand-blue hover:text-brand-blue-dark font-bold tracking-wide transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Share2 size={18} />
                    <span>Or share directly</span>
                </button>
                
            </div>
        </ProtectedRoute>
    );
}
