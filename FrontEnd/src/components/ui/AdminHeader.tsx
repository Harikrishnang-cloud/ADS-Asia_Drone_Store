"use client";

import React from "react";
import { Search } from "lucide-react";

interface AdminHeaderProps {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    searchTerm?: string;
    onSearchChange?: (value: string) => void;
    searchPlaceholder?: string;
    actionButton?: React.ReactNode;
}

export default function AdminHeader({
    title,
    description,
    icon,
    searchTerm,
    onSearchChange,
    searchPlaceholder = "Search...",
    actionButton
}: AdminHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
                {icon && (
                    <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                        {icon}
                    </div>
                )}
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h2>
                    {description && <p className="text-slate-500 font-medium">{description}</p>}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                {onSearchChange !== undefined && (
                    <div className="relative w-full sm:w-80">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                            <Search size={18} />
                        </div>
                        <input 
                            type="text" 
                            placeholder={searchPlaceholder}
                            className="w-full bg-white border border-slate-200 pl-12 pr-4 py-3 rounded-2xl focus:outline-none focus:border-brand-orange transition-all shadow-sm font-medium"
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                )}
                {actionButton}
            </div>
        </div>
    );
}
