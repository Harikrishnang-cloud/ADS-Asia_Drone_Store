"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Sidebar } from "@/components/admin/Sidebar";
import { LogOut, Menu, ShieldCheck } from "lucide-react";


export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (pathname === "/admin/login") {
            setLoading(false);
            return;
        }

        const userStr = localStorage.getItem("adminData");
        if (!userStr) {
            router.push("/admin/login");
            return;
        }

        try {
            const user = JSON.parse(userStr);
            if (user && user.role === "admin") {
                setLoading(false);
            } else {
                router.push("/admin/login");
            }
        } catch {
            router.push("/admin/login");
        }
    }, [pathname, router]);

    const handleLogout = () => {
        localStorage.removeItem("adminData");
        localStorage.removeItem("adminAccessToken");
        localStorage.removeItem("adminRefreshToken");
        router.push("/admin/login");
    };

    if (loading && pathname !== "/admin/login") {
        return (
            <div className="flex flex-col gap-6 justify-center items-center min-h-screen bg-slate-50 text-slate-800">
                <Logo width={100} height={100} />
                <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-bold text-slate-500 tracking-widest mt-4">AUTHENTICATING...</p>
                </div>
            </div>
        );
    }

    // Don't show sidebar on login page
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex">
            {/* Desktop Sidebar */}
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <header className="md:hidden flex justify-between items-center p-4 bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
                    <div className="flex items-center gap-2">
                        <Logo width={120} height={40} showText={true} textColor="text-brand-blue-dark" />
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={handleLogout} 
                            className="p-2.5 bg-red-50 text-red-600 rounded-xl border border-red-100 hover:bg-red-100 transition-colors"
                            title="Logout"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 w-full relative p-4 md:p-8 lg:p-10 overflow-x-hidden transition-all duration-300">
                    {/* Ambient Background Blur Elements */}
                    <div className="fixed top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand-orange/5 blur-[150px] pointer-events-none z-[-1]"></div>
                    <div className="fixed bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand-blue-dark/5 blur-[150px] pointer-events-none z-[-1]"></div>
                    
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
