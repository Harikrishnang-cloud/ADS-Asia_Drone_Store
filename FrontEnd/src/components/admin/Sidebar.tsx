"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
    LayoutDashboard, 
    Image, 
    Layers, 
    Package, 
    ShoppingCart, 
    Users, 
    CreditCard, 
    Settings, 
    LogOut, 
    ChevronDown, 
    ChevronRight,
    Search,
    Bell,
    Wrench,
    Bolt
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import toast from "react-hot-toast";

interface NavItem {
    label: string;
    icon: React.ElementType;
    href?: string;
    subItems?: { label: string; href: string; icon: React.ElementType }[];
}

const navItems: NavItem[] = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
    { label: "Banners", icon: Image, href: "/admin/banners" },
    { label: "Categories", icon: Layers, href: "/admin/categories" },
    { 
        label: "Products", 
        icon: Package, 
        subItems: [
            { label: "All Products", href: "/admin/products", icon: Package },
            { label: "Spare Parts", href: "/admin/products/spare-parts", icon: Wrench },
            { label: "Accessories", href: "/admin/products/accessories", icon: Bolt },
        ] 
    },
    { label: "Orders", icon: ShoppingCart, href: "/admin/orders" },
    { label: "Users", icon: Users, href: "/admin/users" },
    { label: "Payments", icon: CreditCard, href: "/admin/payments" },
    { label: "User-Notifications", icon: Bell, href: "/admin/userNotifications" },
    { label: "Settings", icon: Settings, href: "/admin/settings" },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isProductsOpen, setIsProductsOpen] = useState(false);

    // Auto-expand products if current path matches
    useEffect(() => {
        if (pathname.includes("/admin/products")) {
            setIsProductsOpen(true);
        }
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem("adminData");
        localStorage.removeItem("adminAccessToken");
        localStorage.removeItem("adminRefreshToken");
        toast.success("Logged out successfully");
        router.push("/admin/login");
    };

    const isActive = (href: string) => pathname === href;
    const isChildActive = (subItems: { href: string }[]) => 
        subItems.some(item => pathname === item.href);

    return (
        <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-200 h-screen sticky top-0 z-50 shadow-sm transition-all duration-300">
            {/* Header / Logo */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-center">
                <Logo width={150} height={150} showText={true} textColor="text-brand-blue-dark" />
            </div>

            {/* Navigation items */}
            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
                {navItems.map((item) => {
                    const isExpandable = !!item.subItems;
                    const active = item.href ? isActive(item.href) : isChildActive(item.subItems || []);

                    if (isExpandable) {
                        return (
                            <div key={item.label} className="space-y-1">
                                <button
                                    onClick={() => setIsProductsOpen(!isProductsOpen)}
                                    className={`flex items-center justify-between w-full gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 group ${
                                        active 
                                        ? "bg-brand-blue-dark/5 text-brand-blue-dark" 
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon size={20} className={active ? "text-brand-orange" : "group-hover:text-brand-orange transition-colors"} />
                                        <span>{item.label}</span>
                                    </div>
                                    {isProductsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                </button>

                                {isProductsOpen && (
                                    <div className="ml-4 pl-4 border-l-2 border-slate-100 space-y-1 animate-in slide-in-from-top-2 duration-200">
                                        {item.subItems?.map((subItem) => (
                                            <Link
                                                key={subItem.href}
                                                href={subItem.href}
                                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                                    isActive(subItem.href)
                                                    ? "text-brand-orange bg-brand-orange/5"
                                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                                }`}
                                            >
                                                <subItem.icon size={16} />
                                                {subItem.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    return (
                        <Link
                            key={item.label}
                            href={item.href!}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 group ${
                                active 
                                ? "bg-brand-blue-dark/5 text-brand-blue-dark" 
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                        >
                            <item.icon size={20} className={active ? "text-brand-orange" : "group-hover:text-brand-orange transition-colors"} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-slate-100">
                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center w-full gap-2 bg-slate-50 text-slate-600 hover:bg-red-50 hover:text-red-600 px-4 py-3 rounded-xl transition-all font-bold text-sm border border-transparent hover:border-red-100"
                >
                    <LogOut size={18} />
                    Logout Account
                </button>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </aside>
    );
}
