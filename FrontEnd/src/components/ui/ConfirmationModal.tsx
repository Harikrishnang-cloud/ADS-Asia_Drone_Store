"use client";

import Modal from "./Modal";
import { Loader2 } from "lucide-react";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: "danger" | "warning" | "info";
    isLoading?: boolean;
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "info",
    isLoading = false
}: ConfirmationModalProps) {
    const getButtonStyle = () => {
        if (type === "danger") return "bg-red-600 hover:bg-red-700 shadow-red-200";
        if (type === "warning") return "bg-amber-600 hover:bg-amber-700 shadow-amber-200";
        return "bg-brand-blue hover:bg-brand-blue-dark shadow-brand-blue/20";
    };


    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
            <div className="flex flex-col items-center text-center py-2">
                {/* <div className={`p-4 ${style.iconBg} rounded-lg mb-6`}>
                    {style.icon}
                </div> */}

                <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
                    {title}
                </h3>

                <p className="text-slate-500 font-medium leading-relaxed mb-8 max-w-xs">
                    {message}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 px-6 py-3.5 rounded-lg font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`flex-1 px-6 py-3.5 rounded-lg font-bold text-white shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${getButtonStyle()}`}>
                        {isLoading && <Loader2 className="animate-spin" size={18} />}
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
