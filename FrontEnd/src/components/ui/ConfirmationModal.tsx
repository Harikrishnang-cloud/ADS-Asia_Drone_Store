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
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm-md">
            <div className="flex flex-col items-center text-center py-1 sm:py-2">

                <h3 className="text-base sm:text-2xl font-black text-slate-900 mb-1 sm:mb-3 tracking-tight">
                    {title}
                </h3>

                <p className="text-[11px] sm:text-base text-slate-500 font-medium leading-relaxed mb-4 sm:mb-8 max-w-xs">
                    {message}
                </p>

                <div className="flex flex-row gap-2 sm:gap-3 w-full mt-1 sm:mt-2">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 px-3 sm:px-4 h-[36px] sm:h-[48px] rounded-lg sm:rounded-[10px] text-[12px] sm:text-[15px] font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`flex-1 px-3 sm:px-4 h-[36px] sm:h-[48px] rounded-lg sm:rounded-[10px] text-[12px] sm:text-[15px] font-bold text-white shadow-md sm:shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${getButtonStyle()}`}>
                        {isLoading && <Loader2 className="animate-spin" size={16} />}
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
