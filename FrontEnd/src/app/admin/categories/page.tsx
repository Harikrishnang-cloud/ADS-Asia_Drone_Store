"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Layers } from "lucide-react";

export default function AdminCategoriesPage() {
    return (
        <ProtectedRoute allowedRole="admin">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-brand-orange/10 rounded-lg">
                            <Layers className="text-brand-orange w-5 h-5" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Categories</h2>
                    </div>
                    <p className="text-slate-500 font-medium">Organize your products into logical categories.</p>
                </div>

                <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                        <Layers className="text-slate-300 w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Category Management</h3>
                    <p className="text-slate-500 text-center max-w-xs">Define and edit your product categories here.</p>
                </div>
            </div>
        </ProtectedRoute>
    );
}
