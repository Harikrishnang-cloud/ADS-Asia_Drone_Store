"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
    User, LogOut, Menu, X, Heart, ShoppingCart, Bell, Wallet,
    UserPlus, MessageCircle,
    Settings,
    History, Globe, UserCircle, HelpCircle, Search, ChevronRight
} from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import toast from "react-hot-toast";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { collection, query, orderBy, limit, getDocs, getDoc, doc, where, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { WishlistDropdown } from "./dropdowns/WishlistDropdown";
import { CartDropdown } from "./dropdowns/CartDropdown";
import { NotificationDropdown, Notification } from "./dropdowns/NotificationDropdown";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useNotificationStore } from "@/store/notificationStore";

const navLinks = [
    { name: "HOME", path: "/" },
    { name: "PRODUCTS", path: "/products" },
    { name: "ABOUT", path: "/about" },
    { name: "CONTACT", path: "/contact" },
    { name: "SUPPORT", path: "/help" },
];

export function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, logout, setAuth } = useAuthStore();
    const { items: cartItems, getItemCount } = useCartStore();
    const cartItemCount = getItemCount();
    const { items: wishlistItems } = useWishlistStore();
    const wishlistItemCount = wishlistItems.length;
    const { notifications, unreadCount: notificationCount, setNotifications, markAllAsRead } = useNotificationStore();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [unreadMessageCount, setUnreadMessageCount] = useState(0);
    const [hasHydrated, setHasHydrated] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setHasHydrated(true);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    const { isInitialized } = useAuth();

    useEffect(() => {
        if (!hasHydrated || !user?.id || !isInitialized) return;

        const fetchLatestUser = async () => {
            try {
                const userDoc = await getDoc(doc(db, "users", user.id!));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const updatedUser = { ...user, ...userData, id: userDoc.id };
                    setAuth(updatedUser);
                    localStorage.setItem("userData", JSON.stringify(updatedUser));
                }
            } catch (error: unknown) {
                console.error("Failed to fetch latest user data in Navbar:", error);
            }
        };

        fetchLatestUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasHydrated, user?.id, isInitialized]);


    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    useEffect(() => {

        const storedUserStr = localStorage.getItem("userData");
        if (storedUserStr && !user) {
            try {
                const storedUser = JSON.parse(storedUserStr);
                if (storedUser.role === 'user') {
                    setAuth(storedUser);
                }
            } catch (e) {
                console.error("Auth sync error", e);
            }
        }

        // Check for new messages since last viewing the messages page
        const checkMessages = async () => {
            if (!user?.id) return;
            try {
                const lastViewed = typeof window !== "undefined" ? localStorage.getItem("ads_messages_last_viewed") : null;
                const lastViewedTime = lastViewed ? parseInt(lastViewed) : 0;

                const q = query(
                    collection(db, "orders"),
                    where("userId", "==", user.id)
                );
                const querySnapshot = await getDocs(q);

                const count = querySnapshot.docs.filter(doc => {
                    const data = doc.data();
                    const messageTime = data.messageUpdatedAt || 0;
                    return data.adminMessage && messageTime > lastViewedTime;
                }).length;

                setUnreadMessageCount(count);
            } catch (error: unknown) {
                console.error("Error checking messages:", error);
            }
        };

        const checkNotifications = async () => {
            try {
                const lastRead = typeof window !== "undefined" ? localStorage.getItem("ads_notifications_last_read") : null;
                const lastReadTime = lastRead ? parseInt(lastRead) : 0;

                const q = query(
                    collection(db, "notifications"),
                    orderBy("createdAt", "desc"),
                    limit(10)
                );
                const querySnapshot = await getDocs(q);

                const fetchedNotifications = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    // Handle Firestore Timestamp if needed
                    const createdAt = data.createdAt instanceof Timestamp
                        ? data.createdAt.toMillis()
                        : typeof data.createdAt === 'number'
                            ? data.createdAt
                            : Date.now();

                    return {
                        id: doc.id,
                        title: data.title || "Notification",
                        message: data.message || "",
                        createdAt: createdAt,
                        type: data.type || "info",
                        read: createdAt <= lastReadTime
                    };
                }) as Notification[];

                setNotifications(fetchedNotifications);
            } catch (error: unknown) {
                console.error("Error checking notifications:", error);
            }
        };

        if (isInitialized) {
            checkNotifications();
            checkMessages();
        }
    }, [pathname, setNotifications, user, setAuth, isInitialized]);

    // Skip rendering navbar on authentication or admin pages
    if (pathname?.startsWith("/auth") || pathname?.startsWith("/admin")) {
        return null;
    }

    const handleLogout = () => {
        setIsLogoutModalOpen(true);
    };

    const confirmLogout = () => {
        logout();
        toast.success("Successfully logged out!");
        setIsLogoutModalOpen(false);
        router.push("/auth/login");
    };

    const isHomePage = pathname === "/";

    return (
        <>
            <nav
                className={`sticky top-0 z-50 transition-all duration-300 w-full ${isScrolled && isHomePage
                    ? "bg-transparent backdrop-blur-md py-3"
                    : "bg-white py-3 border-b border-slate-100 shadow-sm"
                    }`}>
                <div className="mx-auto px-4 md:px-8 flex justify-between items-center relative">

                    {/* Left Side: Logo */}
                    <div className="flex-shrink-0 z-50">
                        <Logo width={160} height={160} className="w-[120px] md:w-[160px]" imageClassName="w-full h-auto" />
                    </div>

                    {/* Center: Navigation Menu (Desktop) */}
                    <div className="hidden lg:flex items-center space-x-8 lg:space-x-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.path}
                                className={`relative text-[15px] font-medium transition-colors hover:text-brand-orange group py-2 ${pathname === link.path ? "text-brand-orange" : (isScrolled && isHomePage) ? "text-brand-blue-dark" : "text-brand-blue-dark"
                                    }`}
                            >
                                {link.name}
                                <span
                                    className={`absolute bottom-0 left-0 w-full h-[2px] bg-brand-orange transform origin-left transition-transform duration-300 ease-out ${pathname === link.path ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                                        }`}
                                ></span>
                            </Link>
                        ))}
                    </div>

                    {/* Right Side: Profile / Actions */}
                    <div className="hidden md:flex items-center gap-6 z-50">

                        {/* Search Bar - Desktop */}
                        <div className="relative group hidden lg:flex items-center">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && searchQuery.trim()) {
                                        router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                                    }
                                }}
                                suppressHydrationWarning
                                className={`w-48 lg:w-64 px-4 py-2 pl-10 text-sm rounded-full border transition-all duration-300 focus:w-64 lg:focus:w-80 outline-none ${isScrolled && isHomePage
                                    ? "bg-blue-dark/10 border-blue-dark/20 text-blue-dark placeholder:text-blue-dark/60 focus:bg-blue-dark/20 focus:border-blue-dark/40"
                                    : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-brand-blue/30 focus:shadow-md"
                                    }`}
                            />
                            <Search
                                size={16}
                                onClick={() => {
                                    if (searchQuery.trim()) {
                                        router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                                    }
                                }}
                                className={`absolute left-3.5 transition-colors cursor-pointer ${isScrolled && isHomePage ? "text-blue-dark/60 group-focus-within:text-blue-dark" : "text-slate-400 group-focus-within:text-brand-blue"
                                    }`}
                            />
                        </div>

                        {/* Action Icons */}
                        <div className="flex items-center gap-5 mr-2">
                            {/* Wishlist Icon with Dropdown */}
                            <div className="relative group cursor-pointer">
                                <Link href="/user/wishlist" className={`relative hover:text-brand-orange transition-colors flex items-center h-10 ${(isScrolled && isHomePage) ? "text-blue-dark" : "text-brand-blue-dark"}`}>
                                    <Heart size={20} strokeWidth={2} />
                                    {hasHydrated && wishlistItemCount > 0 && (
                                        <span className="absolute top-1 -right-2 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white px-1">
                                            {wishlistItemCount > 99 ? '99+' : wishlistItemCount}
                                        </span>
                                    )}
                                </Link>
                                {hasHydrated && <WishlistDropdown items={wishlistItems} />}
                            </div>

                            <div className="relative group cursor-pointer">
                                <Link href="/user/cart" className={`relative hover:text-brand-orange transition-colors flex items-center h-10 ${(isScrolled && isHomePage) ? "text-blue-dark" : "text-brand-blue-dark"}`}>
                                    <ShoppingCart size={20} strokeWidth={2} />
                                    {hasHydrated && cartItemCount > 0 && (
                                        <span className="absolute top-1 -right-2 min-w-[18px] h-[18px] bg-brand-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white px-1">
                                            {cartItemCount > 99 ? '99+' : cartItemCount}
                                        </span>
                                    )}
                                </Link>
                                {hasHydrated && <CartDropdown items={cartItems} />}
                            </div>

                            {/* Notification Icon with Dropdown */}
                            <div className="relative group cursor-pointer">
                                <Link href={user ? "/user/notifications" : "/auth/login"} className={`relative hover:text-brand-orange transition-colors flex items-center h-10 ${(isScrolled && isHomePage) ? "text-blue-dark" : "text-brand-blue-dark"}`}>
                                    <Bell size={20} strokeWidth={2} />
                                    {notificationCount > 0 && (
                                        <span className="absolute top-1 -right-2 min-w-[18px] h-[18px] bg-brand-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white px-1">
                                            {notificationCount > 9 ? '9+' : notificationCount}
                                        </span>
                                    )}
                                </Link>
                                <NotificationDropdown
                                    notifications={notifications}
                                    onMarkAllRead={() => {
                                        localStorage.setItem("ads_notifications_last_read", Date.now().toString());
                                        markAllAsRead();
                                    }}
                                />
                            </div>
                        </div>

                        {hasHydrated && user ? (
                            <div className="flex items-center gap-4">
                                <span className={`text-sm font-medium hidden xl:block ${(isScrolled && isHomePage) ? "text-blue-dark" : "text-brand-blue-dark"}`}>
                                    Welcome, <span className="text-brand-orange capitalize">{user?.name ? user.name.split(' ')[0] : 'User'}</span>
                                </span>

                                <div className="relative group cursor-pointer">

                                    <div className="w-[42px] h-[42px] rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-brand-blue-dark transition-all duration-300 group-hover:border-brand-orange group-hover:text-brand-orange group-hover:shadow-[0_0_12px_rgba(241,90,34,0.15)]">
                                        <User size={18} strokeWidth={2.5} />
                                    </div>

                                    {/* User Dropdown Menu - Redesigned Premium Style */}
                                    <div className="absolute top-[120%] right-0 w-72 bg-white rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right border border-slate-100 overflow-hidden translate-y-4 group-hover:translate-y-0 z-[100]">

                                        {/* User Header Section */}
                                        <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50/50">
                                            <div className="flex items-center gap-4">
                                                <Link href="/user/profile" className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-brand-blue transition-colors">
                                                    <div className="w-12 h-12 rounded-full bg-brand-blue-dark text-white flex items-center justify-center font-bold text-lg shadow-inner flex-shrink-0">
                                                        {user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'}
                                                    </div>
                                                    <div className="flex flex-col overflow-hidden">
                                                        <p className="font-bold text-slate-900 truncate leading-tight capitalize">{user?.name || 'User'}</p>
                                                        <p className="text-xs text-slate-500 truncate mt-1">{user?.email}</p>
                                                    </div>
                                                </Link>
                                            </div>

                                            {/* Wallet Summary in Dropdown */}
                                            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-brand-blue/10 text-brand-blue flex items-center justify-center">
                                                        <Wallet size={16} />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">Balance</span>
                                                </div>
                                                <span className="text-sm font-black text-brand-blue-dark">₹{(user?.walletBalance || 0).toLocaleString('en-IN')}</span>
                                            </div>
                                        </div>

                                        {/* Dropdown Scrollable Content */}
                                        <div className="max-h-[70vh] overflow-y-auto custom-scrollbar pt-2 pb-2">

                                            {/* Group 1: Learning & Shopping */}
                                            <div className="py-1 border-b border-slate-100">
                                                <Link href="/user/cart" className="flex items-center justify-between px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-brand-blue transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <ShoppingCart size={18} />
                                                        <span>My cart</span>
                                                    </div>
                                                    {hasHydrated && cartItemCount > 0 && (
                                                        <span className="w-5 h-5 bg-brand-orange text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                                                            {cartItemCount > 99 ? '99+' : cartItemCount}
                                                        </span>
                                                    )}
                                                </Link>
                                                <Link href="/user/wishlist" className="flex items-center justify-between px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-brand-blue transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <Heart size={18} />
                                                        <span>My Wishlist</span>
                                                    </div>
                                                    {hasHydrated && wishlistItemCount > 0 && (
                                                        <span className="w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                                                            {wishlistItemCount > 99 ? '99+' : wishlistItemCount}
                                                        </span>
                                                    )}
                                                </Link>
                                                <Link href="/user/refer" className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-brand-blue transition-colors">
                                                    <UserPlus size={18} />
                                                    <span>Refer a friend</span>
                                                </Link>
                                            </div>

                                            {/* Group 2: Comms */}
                                            <div className="py-1 border-b border-slate-100">
                                                <Link href="/user/notifications" className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-brand-blue transition-colors">
                                                    <Bell size={18} />
                                                    <span>Notifications</span>
                                                </Link>
                                                <Link href="/user/messages" className="flex items-center justify-between px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-brand-blue transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <MessageCircle size={18} />
                                                        <span>Messages</span>
                                                    </div>
                                                    {hasHydrated && unreadMessageCount > 0 && (
                                                        <span className="w-5 h-5 bg-brand-orange text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                                                            {unreadMessageCount > 9 ? '9+' : unreadMessageCount}
                                                        </span>
                                                    )}
                                                </Link>
                                            </div>

                                            {/* Group 3: Settings & Transactions */}
                                            <div className="py-1 border-b border-slate-100">
                                                <Link href="/user/settings" className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-brand-blue transition-colors">
                                                    <Settings size={18} />
                                                    <span>Account settings</span>
                                                </Link>
                                                <Link href="/user/orders" className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-brand-blue transition-colors">
                                                    <History size={18} />
                                                    <span>My Orders</span>
                                                </Link>
                                            </div>

                                            {/* Group 4: Localization - Locked for now */}
                                            <div className="py-1 border-b border-slate-100">
                                                <div className="flex items-center justify-between px-5 py-2.5 text-sm font-medium text-slate-400 opacity-60 cursor-not-allowed group/lang">
                                                    <div className="flex items-center gap-3">
                                                        <Globe size={18} />
                                                        <span>Language</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-slate-300">
                                                        <span className="capitalize">{user?.regional?.language || "English"}</span>
                                                        <ChevronRight size={14} strokeWidth={3} />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Group 5: Profile Management */}
                                            <div className="py-1 border-b border-slate-100">
                                                <Link href="/user/profile" className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-brand-blue transition-colors">
                                                    <UserCircle size={18} />
                                                    <span>My profile</span>
                                                </Link>
                                            </div>

                                            {/* Group 6: Footer Actions */}
                                            <div className="pt-1">
                                                <Link href="/help" className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-brand-blue transition-colors">
                                                    <HelpCircle size={18} />
                                                    <span>Help and Support</span>
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-left px-5 py-3 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors mt-1"
                                                >
                                                    <LogOut size={18} strokeWidth={2.5} />
                                                    Log out
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : hasHydrated ? (
                            <button onClick={() => router.push("/auth/login")}
                                className="bg-brand-blue hover:bg-[#003B73] text-white px-6 py-2.5 rounded-full text-[15px] font-medium transition-all duration-300 shadow-lg shadow-brand-blue/20 flex items-center gap-2 hover:-translate-y-0.5">
                                <User size={16} />
                                Sign In
                            </button>
                        ) : null}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="lg:hidden flex items-center z-50">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-brand-blue-dark hover:text-brand-orange transition-colors focus:outline-none p-2"
                            aria-label="Toggle Menu"
                        >
                            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation Menu (Moved outside nav to prevent fixed containing block bugs) */}
            <div
                className={`fixed inset-0 bg-white z-40 lg:hidden flex flex-col pt-28 px-6 overflow-y-auto transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                    }`}>
                <div className="flex flex-col space-y-2 text-center">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`text-xl font-medium tracking-wide py-4 border-b border-slate-100 ${pathname === link.path ? "text-brand-orange" : "text-brand-blue-dark hover:text-brand-blue"
                                }`}>
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Mobile Action Icons */}
                <div className="flex justify-center gap-10 mt-8 mb-4">
                    <Link href={hasHydrated && user ? "/user/wishlist" : "/auth/login"} onClick={() => setIsMobileMenuOpen(false)} className="relative text-brand-blue-dark hover:text-brand-orange transition-colors" title="Wishlist">
                        <Heart size={26} strokeWidth={2} />
                        {hasHydrated && wishlistItemCount > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white px-1">
                                {wishlistItemCount > 99 ? '99+' : wishlistItemCount}
                            </span>
                        )}
                    </Link>
                    <Link href={hasHydrated && user ? "/user/cart" : "/auth/login"} onClick={() => setIsMobileMenuOpen(false)} className="relative text-brand-blue-dark hover:text-brand-orange transition-colors" title="Cart">
                        <ShoppingCart size={26} strokeWidth={2} />
                        {hasHydrated && cartItemCount > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-brand-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white px-1">
                                {cartItemCount > 99 ? '99+' : cartItemCount}
                            </span>
                        )}
                    </Link>
                    <Link href={hasHydrated && user ? "/user/notifications" : "/auth/login"} onClick={() => setIsMobileMenuOpen(false)} className="relative text-brand-blue-dark hover:text-brand-orange transition-colors" title="Notifications">
                        <Bell size={26} strokeWidth={2} />
                        {notificationCount > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-brand-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white px-1">
                                {notificationCount > 9 ? '9+' : notificationCount}
                            </span>
                        )}
                    </Link>
                </div>

                <div className="mt-8 pb-10 flex flex-col items-center gap-6">
                    {hasHydrated && user ? (
                        <div className="w-full flex flex-col gap-4">
                            {/* Mobile Profile Header */}
                            <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-2xl w-full border border-slate-100 shadow-sm">
                                <div className="w-14 h-14 rounded-full bg-brand-blue-dark text-white flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-md">
                                    {user?.name ? user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() : 'U'}
                                </div>
                                <div className="text-left overflow-hidden">
                                    <p className="text-brand-blue-dark text-lg font-bold capitalize truncate">{user?.name || 'User'}</p>
                                    <p className="text-slate-500 text-xs truncate">{user?.email}</p>
                                </div>
                            </div>

                            {/* Mobile Quick Links Grid */}
                            <div className="grid grid-cols-2 gap-3 mt-2">
                                <Link
                                    href="/user/orders"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-slate-100 rounded-xl text-slate-600 hover:text-brand-blue transition-colors shadow-sm"
                                >
                                    <History size={20} />
                                    <span className="text-[11px] font-bold uppercase tracking-tight">Orders</span>
                                </Link>
                                <Link
                                    href="/user/profile"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-slate-100 rounded-xl text-slate-600 hover:text-brand-blue transition-colors shadow-sm"
                                >
                                    <UserCircle size={20} />
                                    <span className="text-[11px] font-bold uppercase tracking-tight">Profile</span>
                                </Link>
                                <Link
                                    href="/user/settings"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-slate-100 rounded-xl text-slate-600 hover:text-brand-blue transition-colors shadow-sm"
                                >
                                    <Settings size={20} />
                                    <span className="text-[11px] font-bold uppercase tracking-tight">Settings</span>
                                </Link>
                                <Link
                                    href="/user/messages"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="relative flex flex-col items-center justify-center gap-2 p-4 bg-white border border-slate-100 rounded-xl text-slate-600 hover:text-brand-blue transition-colors shadow-sm"
                                >
                                    <MessageCircle size={20} />
                                    <span className="text-[11px] font-bold uppercase tracking-tight">Messages</span>
                                    {hasHydrated && unreadMessageCount > 0 && (
                                        <span className="absolute top-2 right-2 w-5 h-5 bg-brand-orange text-white text-[10px] rounded-full flex items-center justify-center font-bold border-2 border-white">
                                            {unreadMessageCount > 9 ? '9+' : unreadMessageCount}
                                        </span>
                                    )}
                                </Link>
                            </div>

                            {/* Secondary Mobile Links */}
                            <div className="flex flex-col gap-1 px-1">
                                <Link href="/user/refer" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 py-3 text-slate-600 text-sm font-medium border-b border-slate-50">
                                    <UserPlus size={18} className="text-slate-400" />
                                    <span>Refer a friend</span>
                                </Link>
                                <Link href="/help" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 py-3 text-slate-600 text-sm font-medium border-b border-slate-50">
                                    <HelpCircle size={18} className="text-slate-400" />
                                    <span>Help and Support</span>
                                </Link>
                            </div>

                            <button
                                onClick={() => {
                                    handleLogout();
                                    setIsMobileMenuOpen(false);
                                }}
                                className="w-full bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 py-4 rounded-2xl transition-all font-bold flex items-center justify-center gap-3 mt-4 border border-red-100"
                            >
                                <LogOut size={20} strokeWidth={2.5} />
                                Sign Out
                            </button>
                        </div>
                    ) : hasHydrated ? (
                        <button
                            onClick={() => {
                                router.push("/auth/login");
                                setIsMobileMenuOpen(false);
                            }}
                            className="w-full bg-brand-blue hover:bg-[#003B73] text-white py-3.5 rounded-xl transition-all font-medium flex items-center justify-center gap-2 shadow-lg shadow-brand-blue/20"
                        >
                            <User size={18} />
                            Sign In / Register
                        </button>
                    ) : null}
                </div>
            </div>
            <ConfirmationModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={confirmLogout}
                title="Log Out"
                message="Are you sure you want to log out of your account? You will need to sign in again to access your private data."
                confirmText="Yes, Log Out"
                type="danger"
            />
        </>
    );
}

export default Navbar;
