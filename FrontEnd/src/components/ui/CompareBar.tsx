"use client";

import React, { useEffect, useState } from "react";
import { useCompareStore } from "@/store/compareStore";
import { X, ArrowLeftRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "./button";

export default function CompareBar() {
    const { items, removeItem, clearCompare } = useCompareStore();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

    if (!mounted || items.length === 0) return null;

    return (
        <div className="fixed bottom-[80px] md:bottom-0 left-0 w-full bg-white border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] z-[90] animate-in slide-in-from-bottom-full duration-500 pb-safe md:pb-0">
            <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-3 md:py-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 md:gap-8 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 custom-scrollbar flex-1">
                        {items.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 bg-slate-50 p-2 md:p-3 rounded-xl border border-slate-100 min-w-[200px] md:min-w-[250px] relative group shrink-0">
                                <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden shrink-0 bg-white border border-slate-100">
                                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                                </div>
                                <div className="flex flex-col flex-1 min-w-0 pr-6">
                                    <span className="text-xs font-bold text-brand-orange uppercase tracking-wider truncate mb-0.5">{item.category}</span>
                                    <span className="text-xs md:text-sm font-bold text-slate-800 truncate">{item.name}</span>
                                </div>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                    title="Remove"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                        
                        {items.length < 3 && (
                            <div className="hidden md:flex items-center justify-center gap-3 bg-slate-50/50 p-3 rounded-xl border-2 border-dashed border-slate-200 min-w-[250px] opacity-70">
                                <span className="text-sm font-semibold text-slate-400">Add up to {3 - items.length} more {3 - items.length === 1 ? 'item' : 'items'}</span>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-between md:justify-start">
                        <button 
                            onClick={clearCompare}
                            className="text-sm font-bold text-slate-400 hover:text-slate-600 px-2 py-2 transition-colors cursor-pointer"
                        >
                            Clear All
                        </button>
                        <Button
                            variant="primary"
                            icon={<ArrowLeftRight size={18} />}
                            className="min-w-[150px] md:min-w-[180px] h-10 md:h-12 shadow-lg shadow-brand-blue/20"
                            onClick={() => router.push('/compare')}
                            disabled={items.length < 2}
                        >
                            {items.length < 2 ? 'Select 1 More' : 'Compare Now'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
