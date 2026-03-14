"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Settings } from "lucide-react";

export default function AdminSettingsPage() {
    return (
        <ProtectedRoute allowedRole="admin">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-brand-orange/10 rounded-lg">
                            <Settings className="text-brand-orange w-5 h-5" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h2>
                    </div>
                    <p className="text-slate-500 font-medium">Configure your administrative preferences and system variables.</p>
                </div>

                <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                        <Settings className="text-slate-300 w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Settings Configuration</h3>
                    <p className="text-slate-500 text-center max-w-xs">Global system settings will be manageable here.</p>
                </div>
            </div>
        </ProtectedRoute>
    );
}
