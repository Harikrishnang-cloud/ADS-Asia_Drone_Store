"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Wrench } from "lucide-react";

export default function AdminSparePartsPage() {
    return (
        <ProtectedRoute allowedRole="admin">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-brand-orange/10 rounded-lg">
                            <Wrench className="text-brand-orange w-5 h-5" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Spare Parts</h2>
                    </div>
                    <p className="text-slate-500 font-medium">Manage spare parts and components.</p>
                </div>

                <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                        <Wrench className="text-slate-300 w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Spare Parts Inventory</h3>
                    <p className="text-slate-500 text-center max-w-xs">Specific management for spare parts will appear here.</p>
                </div>
            </div>
        </ProtectedRoute>
    );
}
