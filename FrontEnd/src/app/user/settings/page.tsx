"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Settings, Bell, Shield, Smartphone, Globe, ChevronRight } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const { logout } = useAuthStore();
    const router = useRouter();
    return (
        <ProtectedRoute allowedRole="user">
            <div className="max-w-4xl mx-auto py-12 px-4 min-h-[80vh]">
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-black text-brand-blue-dark tracking-tight mb-3">Account Settings</h1>
                    <p className="text-slate-500 font-medium">Manage your preferences, security, and account behaviors.</p>
                </div>

                <div className="bg-white border border-slate-100 rounded-lg p-4 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <div className="space-y-3">
                        {[
                            {
                                icon: <Bell size={24} className="text-brand-orange" />,
                                title: "Notifications",
                                description: "Manage email, SMS, and push notification alerts.",
                            },
                            {
                                icon: <Shield size={24} className="text-emerald-500" />,
                                title: "Security",
                                description: "Update your password or enable 2-Factor Authentication.",
                            },
                            {
                                icon: <Globe size={24} className="text-brand-blue" />,
                                title: "Language & Region",
                                description: "Set your preferred language and regional format.",
                            },
                            {
                                icon: <Smartphone size={24} className="text-purple-500" />,
                                title: "Linked Devices",
                                description: "View and manage devices connected to your account.",
                            }
                        ].map((setting, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-all cursor-pointer group border border-transparent hover:border-slate-100"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-slate-50 group-hover:bg-white rounded-xl shadow-sm border border-slate-100 transition-colors flex items-center justify-center shrink-0">
                                        {setting.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 group-hover:text-brand-blue-dark transition-colors">{setting.title}</h3>
                                        <p className="text-sm text-slate-500 mt-1 hidden sm:block">{setting.description}</p>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-slate-300 group-hover:text-brand-blue group-hover:bg-brand-blue/10 transition-all shrink-0">
                                    <ChevronRight size={20} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="text-sm font-semibold text-slate-400 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                            Version 1.0.0
                        </div>
                        <button onClick={() => { logout(); router.push("/auth/login") }} className="px-6 py-3 bg-red-50 text-red-600 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-red-100 hover:text-red-700 transition-colors border border-red-100 shadow-sm">
                            Deactivate Account
                        </button>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
