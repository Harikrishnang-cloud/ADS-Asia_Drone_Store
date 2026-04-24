"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, ShoppingCart, User, Package } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export function MobileNav() {
  const pathname = usePathname();
  const items = useCartStore((state) => state.items);
  const [hasHydrated, setHasHydrated] = useState(false);

  // Sync cart count after hydration to avoid mismatch
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const cartCount = hasHydrated ? items.reduce((total, item) => total + item.quantity, 0) : 0;

  // Skip rendering on admin or auth pages if needed
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/auth")) {
    return null;
  }

  const navItems = [
    {
      label: "Home",
      icon: Home,
      path: "/",
    },
    {
      label: "Products",
      icon: LayoutGrid,
      path: "/products",
    },
    {
      label: "My Orders",
      icon: Package,
      path: "/user/orders",
    },
    {
      label: "Cart",
      icon: ShoppingCart,
      path: "/user/cart",
      badge: cartCount,
    },
    {
      label: "Account",
      icon: User,
      path: "/user/profile",
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] pointer-events-none">
      <nav className="pointer-events-auto bg-white/90 backdrop-blur-2xl border-t border-slate-100 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] rounded-sm overflow-hidden">
        <div className="flex items-center justify-around h-20 sm:h-10 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path || (item.path !== "/" && pathname?.startsWith(item.path));
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={item.path}
                className="relative flex flex-col items-center justify-center w-full h-full transition-all duration-300"
              >
                <div 
                  className={`relative flex items-center justify-center p-2 rounded-lg transition-all duration-500 ${
                    isActive 
                      ? "text-brand-orange bg-brand-orange/10" 
                      : "text-slate-600 hover:text-slate-500 active:scale-90"
                  }`}
                >
                  <Icon 
                    size={24} 
                    strokeWidth={isActive ? 2.5 : 2} 
                    className={`transition-transform duration-500 ${isActive ? "scale-110" : "scale-100"}`}
                  />
                  
                  {/* Cart Badge */}
                  {item.badge !== undefined && hasHydrated && item.badge > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-brand-orange text-[10px] font-bold text-white ring-2 ring-white shadow-sm">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </div>
                
                <span 
                  className={`text-[10px] font-semibold mt-1.5 transition-all duration-300 tracking-wide ${
                    isActive 
                      ? "text-brand-orange opacity-100 translate-y-0" 
                      : "text-slate-700 opacity-70 translate-y-0.5"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
        <div className="h-[env(safe-area-inset-bottom)] bg-transparent" />
      </nav>
    </div>
  );
}

export default MobileNav;
