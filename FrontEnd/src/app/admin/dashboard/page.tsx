"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Box, Users, Settings, LogOut, ShieldCheck } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Logo } from "@/components/ui/Logo";
import BannerManager from "@/components/admin/BannerManager";

export default function AdminDashboardPage() {
    const router = useRouter();
    const [currentView, setCurrentView] = useState<"dashboard" | "banners">("dashboard");

    const handleLogout = () => {
        localStorage.removeItem("adminData");
        localStorage.removeItem("adminAccessToken");
        localStorage.removeItem("adminRefreshToken");
        router.push("/admin/login");
    };

    return (
        <ProtectedRoute allowedRole="admin">
            <div className="min-h-screen bg-slate-50 text-slate-800 font-sans relative flex">
                {/* Sidebar Navigation */}
                <aside className="hidden md:flex flex-col w-64 bg-white/80 backdrop-blur-3xl border-r border-slate-200 h-screen sticky top-0 z-40 shadow-sm">
                    <div className="p-6 border-b border-slate-200">
                        <Logo width={160} height={160} showText={true} textColor="text-brand-blue-dark" />
                    </div>

                    <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                        <button 
                            onClick={() => setCurrentView("dashboard")}
                            className={`flex items-center w-full gap-3 px-4 py-3 rounded-xl font-bold transition-all shadow-sm cursor-pointer ${
                                currentView === "dashboard" 
                                ? "bg-brand-orange/10 text-brand-orange border border-brand-orange/20" 
                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            }`}
                        >
                            <LayoutDashboard size={18} />
                            Dashboard
                        </button>
                        <button 
                            onClick={() => setCurrentView("banners")}
                            className={`flex items-center w-full gap-3 px-4 py-3 rounded-xl font-bold transition-all shadow-sm cursor-pointer ${
                                currentView === "banners" 
                                ? "bg-brand-orange/10 text-brand-orange border border-brand-orange/20" 
                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            }`}
                        >
                            <Box size={18} />
                            Banners
                        </button>
                        <button className="flex items-center w-full gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-xl font-semibold transition-colors cursor-not-allowed opacity-50">
                            <Users size={18} />
                            Users
                        </button>
                        <button className="flex items-center w-full gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-xl font-semibold transition-colors cursor-not-allowed opacity-50">
                            <Settings size={18} />
                            Settings
                        </button>
                        <button className="flex items-center w-full gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-xl font-semibold transition-colors cursor-not-allowed opacity-50">
                            <Users size={18} />
                            Users
                        </button>
                        <button className="flex items-center w-full gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-xl font-semibold transition-colors cursor-not-allowed opacity-50">
                            <Settings size={18} />
                            Settings
                        </button>
                        <button className="flex items-center w-full gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-xl font-semibold transition-colors cursor-not-allowed opacity-50">
                            <Users size={18} />
                            Users
                        </button>
                        <button className="flex items-center w-full gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-xl font-semibold transition-colors cursor-not-allowed opacity-50">
                            <Settings size={18} />
                            Settings
                        </button>
                        
                        
                    </div>

                    <div className="p-4 border-t border-slate-200">
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center w-full gap-2 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 px-4 py-3 rounded-xl transition-all font-bold text-sm shadow-sm"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 w-full relative z-10 p-4 md:p-8 lg:p-12 overflow-y-auto">
                    {/* Ambient Background Elements */}
                    <div className="fixed top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand-orange/5 blur-[150px] pointer-events-none z-[-1]"></div>
                    
                    {/* Mobile Header */}
                    <header className="md:hidden flex justify-between items-center mb-8 bg-white/80 p-4 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="text-brand-orange w-6 h-6" />
                            <h1 className="text-xl font-black text-slate-900">ADS</h1>
                        </div>
                        <button onClick={handleLogout} className="p-2 bg-red-50 text-red-600 rounded-lg border border-red-100">
                            <LogOut size={18} />
                        </button>
                    </header>

                    {/* Conditional Rendering based on currentView */}
                    {currentView === "dashboard" ? (
                        <div className="animate-in fade-in duration-500">
                            <div className="mb-10">
                                <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">System Overview</h2>
                                <p className="text-slate-500">Welcome to the command center</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                    <h3 className="text-slate-500 font-bold uppercase text-xs tracking-widest mb-4">Total Users</h3>
                                    <div className="text-3xl font-black text-slate-900">000</div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                    <h3 className="text-slate-500 font-bold uppercase text-xs tracking-widest mb-4">Active Orders</h3>
                                    <div className="text-3xl font-black text-slate-900">000</div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                    <h3 className="text-slate-500 font-bold uppercase text-xs tracking-widest mb-4">Monthly Revenue</h3>
                                    <div className="text-3xl font-black text-slate-900">₹000</div>
                                </div>
                            </div>
                        </div>
                    ) : currentView === "banners" ? (
                        <div className="animate-in fade-in duration-500">
                            <BannerManager />
                        </div>
                    ) : null}
                </main>
            </div>
        </ProtectedRoute>
    );
}

