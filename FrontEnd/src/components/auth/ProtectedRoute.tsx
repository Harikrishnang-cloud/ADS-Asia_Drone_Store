"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRole?: 'user' | 'admin';
}

export default function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = () => {
            // Determine storage keys based on target route or role
            const isAdminPath = pathname.startsWith('/admin');
            const targetRole = allowedRole || (isAdminPath ? 'admin' : 'user');
            
            const tokenKey = targetRole === 'admin' ? "adminAccessToken" : "accessToken";
            const userKey = targetRole === 'admin' ? "adminData" : "userData";

            const token = localStorage.getItem(tokenKey);
            const storedUserStr = localStorage.getItem(userKey);

            if (!token || !storedUserStr) {
                // If not logged in for this specific context, redirect
                if (isAdminPath) {
                    router.push("/admin/login");
                } else if (allowedRole === 'user') {
                    router.push("/auth/login");
                } else {
                    // Default fallback
                    setIsAuthorized(false);
                    router.push("/auth/login");
                }
                return;
            }

            try {
                const user = JSON.parse(storedUserStr);
                
                // Check if user is blocked
                if (user.status === 'blocked') {
                    console.warn("Access denied: User account is blocked.");
                    localStorage.removeItem(tokenKey);
                    localStorage.removeItem(userKey);
                    toast.error("Your account has been blocked. Please contact support.");
                    router.push(isAdminPath ? "/admin/login?error=blocked" : "/auth/login?error=blocked");
                    return;
                }

                // Role-based logic
                if (targetRole && user.role !== targetRole) {
                    console.warn(`Access denied: context requires ${targetRole}, but user is ${user.role}`);
                    // Redirect to their respective dashboard
                    router.push(user.role === 'admin' ? "/admin/dashboard" : "/");
                    return;
                }

                setIsAuthorized(true);
            } catch (err) {
                localStorage.removeItem(tokenKey);
                localStorage.removeItem(userKey);
                router.push(isAdminPath ? "/admin/login" : "/auth/login");
            }
        };
        
        checkAuth();
    }, [router, allowedRole, pathname]);

    if (isAuthorized === null) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-brand-orange"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-400">ADS</div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
