import { NavItem, SidebarViewProps } from "../Model/sidebar";
import { LayoutDashboard, Image, Layers, Package, Wrench, Bolt, ShoppingCart, Users, CreditCard, Bell, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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

export function useSidebar(): SidebarViewProps {
    const pathname = usePathname();
    const router = useRouter();
    const [openMenus, setOpenMenus] = useState<string[]>([]);
    const isActive = (href: string) => pathname === href;
    const isChildActive = (subItems: { href: string }[]) => subItems.some(item => pathname === item.href);

    useEffect(() => {
        const currentActiveMenu = navItems.find(item => 
            item.subItems && isChildActive(item.subItems)
        );
        if (currentActiveMenu && !openMenus.includes(currentActiveMenu.label)) {
            setOpenMenus(prev => [...prev, currentActiveMenu.label]);
        }
    }, [pathname]);

    const toggleMenu = (label: string) => {
        setOpenMenus(prev => 
            prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
        );
    };

    const handleLogout = () => {
        localStorage.removeItem("adminData");
        localStorage.removeItem("adminAccessToken");
        localStorage.removeItem("adminRefreshToken");
        toast.success("Logged out successfully");
        router.push("/admin/login");
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