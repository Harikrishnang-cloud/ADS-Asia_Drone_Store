"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
}

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = "md"
}: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const maxWidthClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        "3xl": "max-w-3xl",
        "4xl": "max-w-4xl",
        "5xl": "max-w-5xl",
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
            <div
                ref={modalRef}
                className={`relative w-full ${maxWidthClasses[maxWidth]} bg-white rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300 shadow-slate-900/20 border border-white/20`}>
                <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                    {title && <h3 className="text-xl font-black text-slate-900 tracking-tight">{title}</h3>}
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-200/50 rounded-lg transition-colors text-slate-400 hover:text-slate-900 cursor-pointer">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
}
