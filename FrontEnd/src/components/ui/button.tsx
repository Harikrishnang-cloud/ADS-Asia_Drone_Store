"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "ghost" | "orange" | "outline-danger" | "ghost-danger";
    size?: "default" | "sm" | "lg" | "icon" | "icon-sm";
    loading?: boolean;
    icon?: React.ReactNode;
    iconPosition?: "left" | "right";
    fullWidth?: boolean;
}

export default function Button({
    children,
    variant = "primary",
    size = "default",
    loading = false,
    icon,
    iconPosition = "left",
    fullWidth = false,
    className = "",
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

    const sizes = {
        default: "text-sm px-4 py-2.5 md:text-base md:px-6 md:py-3",
        sm: "text-xs px-3 py-1.5 md:text-sm md:px-4 md:py-2",
        lg: "text-base px-5 py-3 md:text-lg md:px-8 md:py-4",
        icon: "p-2 md:p-2.5",
        "icon-sm": "w-7 h-7 md:w-8 md:h-8",
    };

    const variants = {
        primary: "bg-brand-blue-dark text-white hover:bg-black shadow-lg shadow-brand-blue/10",
        orange: "bg-brand-orange text-white hover:bg-brand-orange-dark shadow-lg shadow-brand-orange/20",
        secondary: "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50",
        danger: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100",
        "outline-danger": "bg-transparent text-red-500 border border-red-200 hover:bg-red-50 hover:border-red-300",
        "ghost-danger": "bg-transparent text-slate-400 hover:bg-red-50 hover:text-red-500",
        ghost: "bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700"
    };

    const widthStyle = fullWidth ? "w-full" : "";

    return (
        <button
            className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${widthStyle} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <Loader2 className="animate-spin" size={18} />
            ) : (
                icon && iconPosition === "left" && <span className="flex-shrink-0">{icon}</span>
            )}
            {children}
            {!loading && icon && iconPosition === "right" && <span className="flex-shrink-0">{icon}</span>}
        </button>
    );
}
