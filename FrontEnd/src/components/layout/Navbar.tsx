"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { User, LogOut, Menu, X, Heart, ShoppingCart, Bell, 
    BookOpen, UserPlus, Presentation, MessageCircle, 
    Settings, CreditCard, Layers, BadgeDollarSign, 
    History, Globe, UserCircle, HelpCircle, UserPlus2
} from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import toast from "react-hot-toast";

export interface UserProfile {
    id?: string;
    name: string;
    email: string;
    role: string;
}

const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Gallery", path: "/gallery" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
];

export function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Handle scroll effect for dynamic navbar styling
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Check user authentication status on load and storage updates
    useEffect(() => {
        const checkUser = () => {
            const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
            const storedUserStr = typeof window !== "undefined" ? localStorage.getItem("userData") : null;

            if (token && storedUserStr) {
                try {
                    const storedUser = JSON.parse(storedUserStr);
                    // Explicitly only allow 'user' role on the main navbar
                    if (storedUser.role === 'user') {
                        setUser(storedUser);
                    } else {
                        setUser(null);
                    }
                } catch {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };

        checkUser();
        window.addEventListener('storage', checkUser);
        return () => window.removeEventListener('storage', checkUser);
    }, [pathname]);

    // Skip rendering navbar on authentication or admin pages
    if (pathname?.startsWith("/auth") || pathname?.startsWith("/admin")) {
        return null;
    }

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userData");
        setUser(null);
        toast.success("Successfully logged out!");
        router.push("/auth/login");
    };

    return (
        <nav 
            className={`sticky top-0 z-50 transition-all duration-300 w-full ${
                isScrolled 
                ? "bg-white/95 backdrop-blur-md shadow-lg shadow-black/5 py-3" 
                : "bg-white py-5 border-b border-slate-100"
            }`}>
            <div className="mx-auto px-4 md:px-8 flex justify-between items-center relative">
                
                {/* Left Side: Logo */}
                <div className="flex-shrink-0 z-50">
                    <Logo width={160} height={160} showText={true} textColor="text-brand-blue-dark" />
                </div>

                {/* Center: Navigation Menu (Desktop) */}
                <div className="hidden lg:flex items-center space-x-8 lg:space-x-10">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.name} 
                            href={link.path}
                            className={`relative text-[15px] font-medium transition-colors hover:text-brand-orange group py-2 ${
                                pathname === link.path ? "text-brand-orange" : "text-brand-blue-dark"
                            }`}
                        >
                            {link.name}
                            <span 
                                className={`absolute bottom-0 left-0 w-full h-[2px] bg-brand-orange transform origin-left transition-transform duration-300 ease-out ${
                                    pathname === link.path ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                                }`}
                            ></span>
                        </Link>
                    ))}
                </div>

                {/* Right Side: Profile / Actions */}
                <div className="hidden md:flex items-center gap-6 z-50">
                    
                    {/* Action Icons */}
                    <div className="flex items-center gap-5 mr-2">
                        <Link href={user ? "/wishlist" : "/auth/login"} className="text-brand-blue-dark hover:text-brand-orange transition-colors relative" title="Wishlist">
                            <Heart size={20} strokeWidth={2} />
                        </Link>
                        <Link href={user ? "/cart" : "/auth/login"} className="text-brand-blue-dark hover:text-brand-orange transition-colors relative" title="Cart">
                            <ShoppingCart size={20} strokeWidth={2} />
                        </Link>
                        <Link href={user ? "/notifications" : "/auth/login"} className="text-brand-blue-dark hover:text-brand-orange transition-colors relative" title="Notifications">
                            <Bell size={20} strokeWidth={2} />
                        </Link>
                    </div>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-slate-500 hidden xl:block">
                                Welcome, <span className="text-brand-blue-dark capitalize">{user.name.split(' ')[0]}</span>
                            </span>
                            
                            <div className="relative group cursor-pointer">
                               
                                <div className="w-[42px] h-[42px] rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-brand-blue-dark transition-all duration-300 group-hover:border-brand-orange group-hover:text-brand-orange group-hover:shadow-[0_0_12px_rgba(241,90,34,0.15)]">
                                    <User size={18} strokeWidth={2.5} />
                                </div>
                                
                                {/* User Dropdown Menu - Redesigned Premium Style */}
                                <div className="absolute top-[120%] right-0 w-72 bg-white rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right border border-slate-100 overflow-hidden translate-y-4 group-hover:translate-y-0 z-[100]">
                                    
                                    {/* User Header Section */}
                                    <div className="p-5 flex items-center gap-4 border-b border-slate-100 bg-slate-50/50">
                                        <div className="w-12 h-12 rounded-full bg-brand-blue-dark text-white flex items-center justify-center font-bold text-lg shadow-inner">
                                            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                        </div>
                                        <div className="flex flex-col overflow-hidden">
                                            <p className="font-bold text-slate-900 truncate leading-tight capitalize">{user.name}</p>
                                            <p className="text-xs text-slate-500 truncate mt-1">{user.email}</p>
                                        </div>
                                    </div>

                                    {/* Dropdown Scrollable Content */}
                                    <div className="max-h-[70vh] overflow-y-auto custom-scrollbar pt-2 pb-2">
                                        
                                        {/* Group 1: Learning & Shopping */}
                                        <div className="py-1 border-b border-slate-100">
                                            {/* <Link href="/my-learning" className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-brand-blue transition-colors">
                                                <BookOpen size={18} />
                                                <span>My learning</span>
                                            </Link> */}
                                            <Link href="/cart" className="flex items-center justify-between px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-brand-blue transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <ShoppingCart size={18} />
                                                    <span>My cart</span>
                                                </div>
                                                {/* <span className="w-5 h-5 bg-brand-orange text-white text-[10px] rounded-full flex items-center justify-center font-bold"></span> */}
                                            </Link>
                                            <Link href="/wishlist" className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-brand-blue transition-colors">
                                                <Heart size={18} />
                                                <span>My Wishlist</span>
                                            </Link>
                                            <Link href="/refer" className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-brand-blue transition-colors">
                                                <UserPlus size={18} />
                                                <span>Refer a friend</span>
                                            </Link>
                                            {/* <Link href="/teach" className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-brand-blue transition-colors">
                                                <Presentation size={18} />
                                                <span>Teach on ADS</span>
                                            </Link> */}
                                        </div>

                                        {/* Group 2: Comms */}
                                        <div className="py-1 border-b border-slate-100">
                                            <button className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-brand-blue transition-colors">
                                                <Bell size={18} />
                                                <span>Notifications</span>
                                            </button>
                                            <button className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-brand-blue transition-colors">
                                                <MessageCircle size={18} />
                                                <span>Messages</span>
                                            </button>
                                        </div>

                                        {/* Group 3: Settings & Transactions */}
                                        <div className="py-1 border-b border-slate-100">
                                            <Link href="/settings" className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-brand-blue transition-colors">
                                                <Settings size={18} />
                                                <span>Account settings</span>
                                            </Link>
                                            <Link href="/payments" className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-brand-blue transition-colors">
                                                <CreditCard size={18} />
                                                <span>Payment methods</span>
                                            </Link>
                                            {/* <Link href="/subscriptions" className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-brand-blue transition-colors">
                                                <Layers size={18} />
                                                <span>Subscriptions</span>
                                            </Link> */}
                                            {/* <button className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-brand-blue transition-colors">
                                                <BadgeDollarSign size={18} />
                                                <span>ADS credits</span>
                                            </button> */}
                                            <Link href="/orders" className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-brand-blue transition-colors">
                                                <History size={18} />
                                                <span>Purchase history</span>
                                            </Link>
                                        </div>

                                        {/* Group 4: Localization */}
                                        <div className="py-1 border-b border-slate-100">
                                            <div className="flex items-center justify-between px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer group/lang">
                                                <div className="flex items-center gap-3">
                                                    <Globe size={18} />
                                                    <span>Language</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-slate-400 group-hover/lang:text-brand-blue">
                                                    <span>English</span>
                                                    <Globe size={14} strokeWidth={3} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Group 5: Profile Management */}
                                        <div className="py-1 border-b border-slate-100">
                                            <Link href="/profile" className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-brand-blue transition-colors">
                                                <UserCircle size={18} />
                                                <span>Public profile</span>
                                            </Link>
                                            <Link href="/profile/edit" className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-brand-blue transition-colors">
                                                <UserCircle size={18} />
                                                <span>Edit profile</span>
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
                    ) : (
                        <button onClick={() => router.push("/auth/login")}
                            className="bg-brand-blue hover:bg-[#003B73] text-white px-6 py-2.5 rounded-full text-[15px] font-medium transition-all duration-300 shadow-lg shadow-brand-blue/20 flex items-center gap-2 hover:-translate-y-0.5">
                            <User size={16} />
                            Sign In
                        </button>
                    )}
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

            {/* Mobile Navigation Menu */}
            <div 
                className={`fixed inset-0 bg-white z-40 lg:hidden flex flex-col pt-28 px-6 overflow-y-auto transition-transform duration-300 ease-in-out ${
                    isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                }`}>
                <div className="flex flex-col space-y-2 text-center">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.name} 
                            href={link.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`text-xl font-medium tracking-wide py-4 border-b border-slate-100 ${
                                pathname === link.path ? "text-brand-orange" : "text-brand-blue-dark hover:text-brand-blue"
                            }`}>
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Mobile Action Icons */}
                <div className="flex justify-center gap-10 mt-8 mb-4">
                    <Link href={user ? "/wishlist" : "/auth/login"} onClick={() => setIsMobileMenuOpen(false)} className="text-brand-blue-dark hover:text-brand-orange transition-colors" title="Wishlist">
                        <Heart size={26} strokeWidth={2} />
                    </Link>
                    <Link href={user ? "/cart" : "/auth/login"} onClick={() => setIsMobileMenuOpen(false)} className="text-brand-blue-dark hover:text-brand-orange transition-colors" title="Cart">
                        <ShoppingCart size={26} strokeWidth={2} />
                    </Link>
                    <Link href={user ? "/notifications" : "/auth/login"} onClick={() => setIsMobileMenuOpen(false)} className="text-brand-blue-dark hover:text-brand-orange transition-colors" title="Notifications">
                        <Bell size={26} strokeWidth={2} />
                    </Link>
                </div>

                <div className="mt-8 pb-10 flex flex-col items-center gap-6">
                    {user ? (
                        <div className="w-full flex flex-col gap-4">
                            {/* Mobile Profile Header */}
                            <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-2xl w-full border border-slate-100 shadow-sm">
                                <div className="w-14 h-14 rounded-full bg-brand-blue-dark text-white flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-md">
                                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </div>
                                <div className="text-left overflow-hidden">
                                    <p className="text-brand-blue-dark text-lg font-bold capitalize truncate">{user.name}</p>
                                    <p className="text-slate-500 text-xs truncate">{user.email}</p>
                                </div>
                            </div>

                            {/* Mobile Quick Links Grid */}
                            <div className="grid grid-cols-2 gap-3 mt-2">
                                <Link 
                                    href="/my-learning" 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-slate-100 rounded-xl text-slate-600 hover:text-brand-blue transition-colors shadow-sm"
                                >
                                    <BookOpen size={20} />
                                    <span className="text-[11px] font-bold uppercase tracking-tight">Learning</span>
                                </Link>
                                <Link 
                                    href="/orders" 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-slate-100 rounded-xl text-slate-600 hover:text-brand-blue transition-colors shadow-sm"
                                >
                                    <History size={20} />
                                    <span className="text-[11px] font-bold uppercase tracking-tight">Orders</span>
                                </Link>
                                <Link 
                                    href="/profile" 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-slate-100 rounded-xl text-slate-600 hover:text-brand-blue transition-colors shadow-sm"
                                >
                                    <UserCircle size={20} />
                                    <span className="text-[11px] font-bold uppercase tracking-tight">Profile</span>
                                </Link>
                                <Link 
                                    href="/settings" 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-slate-100 rounded-xl text-slate-600 hover:text-brand-blue transition-colors shadow-sm"
                                >
                                    <Settings size={20} />
                                    <span className="text-[11px] font-bold uppercase tracking-tight">Settings</span>
                                </Link>
                            </div>

                            {/* Secondary Mobile Links */}
                            <div className="flex flex-col gap-1 px-1">
                                <Link href="/refer" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 py-3 text-slate-600 text-sm font-medium border-b border-slate-50">
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
                    ) : (
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
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
