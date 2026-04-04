import { NavItem, SidebarViewProps } from "../Model/sidebar";
import { LayoutDashboard, Image, Layers, Package, Wrench, Bolt, ShoppingCart, Users, CreditCard, Bell, Settings, Star, Mail } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const navItems: NavItem[] = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
    { label: "Banners", icon: Image, href: "/admin/banners" },
    { label: "Categories (Maintenance)", icon: Layers, href: "/admin/categories" },
    { 
        label: "Products", 
        icon: Package, 
        subItems: [
            { label: "Products", href: "/admin/products", icon: Package },
            { label: "Spare Parts", href: "/admin/products/spare-parts", icon: Wrench },
            { label: "Accessories", href: "/admin/products/accessories", icon: Bolt },
        ] 
    },
    { label: "Orders", icon: ShoppingCart, href: "/admin/orders" },
    { label: "Users", icon: Users, href: "/admin/users" },
    { label: "Payments", icon: CreditCard, href: "/admin/payments" },
    { label: "User-Notifications", icon: Bell, href: "/admin/userNotifications" },
    { label: "Reviews", icon: Star, href: "/admin/reviews" },
    { 
        label: "Support", 
        icon: Mail, 
        subItems: [
            { label: "Contact Messages", href: "/admin/support/contact", icon: Mail },
            { label: "Newsletters", href: "/admin/support/newsletter", icon: Mail },
        ] 
    },
    { label: "Settings (Maintenance)", icon: Settings, href: "/admin/settings" },
    
];

export function useSidebar(): SidebarViewProps {
    const pathname = usePathname();
    const router = useRouter();
    const [openMenus, setOpenMenus] = useState<string[]>([]);
    const isActive = (href: string) => pathname === href;
    const isChildActive = (subItems: { href: string }[]) => subItems.some(item => pathname === item.href);

    useEffect(() => {
        const currentActiveMenu = navItems.find(item => 
            item.subItems && item.subItems.some(sub => pathname === sub.href)
        );
        if (currentActiveMenu) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setOpenMenus(prev => {
                if (!prev.includes(currentActiveMenu.label)) {
                    return [...prev, currentActiveMenu.label];
                }
                return prev;
            });
        }
    }, [pathname]);

    const toggleMenu = (label: string) => {
        setOpenMenus(prev => 
            prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
        );
    };

    const handleLogout = async () => {
        try {
            const refreshToken = localStorage.getItem("adminRefreshToken");
            if (refreshToken) {
                const { authService } = await import("@/services/auth.service");
                await authService.adminLogout(refreshToken);
            }
        } catch (error) {
            console.error("Admin logout error:", error);
        } finally {
            localStorage.removeItem("adminData");
            localStorage.removeItem("adminAccessToken");
            localStorage.removeItem("adminRefreshToken");
            toast.success("Logged out successfully");
            router.push("/admin/login");
        }
    };

    return {
        navItems,
        openMenus,
        toggleMenu,
        handleLogout,
        isActive,
        isChildActive
    }
}