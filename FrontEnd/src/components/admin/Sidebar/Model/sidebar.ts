import type { ElementType } from "react";

export interface NavItem {
    label: string;
    icon: ElementType;
    href?: string;
    subItems?: { label: string; href: string; icon: ElementType }[];
}
export interface SidebarViewProps {
    navItems: NavItem[]
    openMenus: string[]
    toggleMenu: (label: string) => void;
    handleLogout: () => void;
    isActive: (href: string) => boolean;
    isChildActive: (subItems: any[]) => boolean;
}