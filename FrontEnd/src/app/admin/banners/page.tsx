"use client";

import BannerManager from "@/components/admin/BannerManager";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Image as ImageIcon } from "lucide-react";

export default function AdminBannersPage() {
    return (
        <ProtectedRoute allowedRole="admin">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-brand-orange/10 rounded-lg">
                            <ImageIcon className="text-brand-orange w-5 h-5" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Banner Management</h2>
                    </div>
                    <p className="text-slate-500 font-medium">Manage your homepage sliders and promotional banners.</p>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <BannerManager />
                </div>
            </div>
        </ProtectedRoute>
    );
}
