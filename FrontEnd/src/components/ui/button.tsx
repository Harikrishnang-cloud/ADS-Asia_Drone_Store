"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "ghost" | "orange";
    loading?: boolean;
    icon?: React.ReactNode;
    fullWidth?: boolean;
}

export default function Button({
    children,
    variant = "primary",
    loading = false,
    icon,
    fullWidth = false,
    className = "",
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";
    
    const variants = {
        primary: "bg-brand-blue-dark text-white hover:bg-black shadow-lg shadow-brand-blue/10",
        orange: "bg-brand-orange text-white hover:bg-brand-orange-dark shadow-lg shadow-brand-orange/20",
        secondary: "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50",
        danger: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100",
        ghost: "bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700"
    };

    const widthStyle = fullWidth ? "w-full" : "";

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <Loader2 className="animate-spin" size={18} />
            ) : (
                icon && <span className="flex-shrink-0">{icon}</span>
            )}
            {children}
        </button>
    );
}
