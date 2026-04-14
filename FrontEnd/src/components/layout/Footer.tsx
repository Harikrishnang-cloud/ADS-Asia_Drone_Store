"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, ArrowRight, Send } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "@/lib/axios";


export function Footer() {
    const pathname = usePathname();
    const [email, setEmail] = useState("");
    const [isSubscribing, setIsSubscribing] = useState(false);
    const [currentYear, setCurrentYear] = useState<number | null>(null);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setHasMounted(true);
            setCurrentYear(new Date().getFullYear());
        }, 0);
    }, []);

    const handleSubscribe = async () => {
        if (!email) {
            toast.error("Please enter your email address");
            return;
        }
        setIsSubscribing(true);
        try {
            const { data } = await api.post("/support/newsletter", { email });
            toast.success(data.message || "Subscribed successfully!");
            setEmail("");
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || "Failed to subscribe");
        } finally {
            setIsSubscribing(false);
        }
    };

    // Skip rendering footer on authentication or admin pages
    if (pathname?.startsWith("/auth") || pathname?.startsWith("/admin")) {
        return null;
    }

    const footerLinks = {
        shop: [
            { name: "Professional Drones", href: "/products?category=Atmos C" },
            { name: "Photography Drones", href: "/products?category=Atmos X" },
            { name: "Spare Parts", href: "/products?category=Spares" },
            { name: "Accessories", href: "/products?category=Accessories" },
            { name: "New Arrivals", href: "/products?sortBy=newest" },
        ],
        company: [
            { name: "About ADS", href: "/about" },
            { name: "Contact Us", href: "/contact" },
            { name: "Help Center", href: "/help" },
        ],
        social: [
            { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/asiadronestore.global" },
            { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/asiadronestore" },
            { name: "Twitter", icon: Twitter, href: "https://x.com/AsiaDroneStore" },
            { name: "Youtube", icon: Youtube, href: "https://www.youtube.com/@asiadronestore" },
        ]
    };

    return (
        <footer className="bg-slate-900 text-white pt-20 pb-10 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-orange/10 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-blue/10 blur-[150px] rounded-full pointer-events-none"></div>

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

                    {/* Brand Info */}
                    <div className="space-y-6">
                        <Logo width={180} height={180} className="w-[140px] md:w-[180px]" />
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                            Asia Drone Store (ADS) is your premium destination for high-end drones, spare parts, and professional aerial accessories across Asia.
                        </p>
                        <div className="flex items-center gap-4">
                            {footerLinks.social.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-orange transition-all duration-300 hover:-translate-y-1 group"
                                >
                                    <item.icon size={18} className="text-slate-300 group-hover:text-white" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links: Shop */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                            Quick Shop
                            <span className="w-8 h-[2px] bg-brand-orange"></span>
                        </h4>
                        <ul className="space-y-4">
                            {footerLinks.shop.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-slate-400 hover:text-brand-orange transition-colors flex items-center gap-2 group text-sm"
                                    >
                                        <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>


                    {/* Quick Links: Company */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                            Company
                            <span className="w-8 h-[2px] bg-brand-orange"></span>
                        </h4>
                        <ul className="space-y-4">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-slate-400 hover:text-brand-orange transition-colors flex items-center gap-2 group text-sm"
                                    >
                                        <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact & Newsletter */}
                    <div className="space-y-8">
                        <div>
                            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                                Newsletter
                                <span className="w-8 h-[2px] bg-brand-orange"></span>
                            </h4>
                            <p className="text-slate-400 text-sm mb-4">Subscribe to get latest updates and offers.</p>
                            <div className="relative group flex items-center">
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-brand-orange transition-all"
                                    suppressHydrationWarning
                                />
                                <button 
                                    type="button" 
                                    onClick={handleSubscribe}
                                    disabled={isSubscribing}
                                    aria-label="Subscribe to newsletter"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-orange p-2 rounded-lg hover:bg-white hover:text-brand-orange transition-all duration-300 disabled:opacity-50"
                                    suppressHydrationWarning
                                >
                                    <Send size={16} className={isSubscribing ? "opacity-50 cursor-wait" : ""} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4 text-sm text-slate-400 hover:text-white transition-colors cursor-pointer group">
                                <MapPin size={18} className="text-brand-orange flex-shrink-0 group-hover:scale-110 transition-transform" />
                                <span>{"Asia Softlab Pvt Ltd, 1st Floor - MG Corporate Center, Ulloor, Thiruvananthapuram, Kerala, 695011"}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-400 hover:text-white transition-colors cursor-pointer group">
                                <Phone size={18} className="text-brand-orange flex-shrink-0 group-hover:scale-110 transition-transform" />
                                <span>{"+91 70121 47575"}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-400 hover:text-white transition-colors cursor-pointer group">
                                <Mail size={18} className="text-brand-orange flex-shrink-0 group-hover:scale-110 transition-transform" />
                                <span>{"asiadronestore@gmail.com"}</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4">
                    {/* Left: Copyright */}
                    <div className="flex-1 text-center md:text-left">
                        <p className="text-slate-400 text-sm whitespace-nowrap">
                            © {hasMounted ? (currentYear || 2026) : 2026} <span className="text-brand-orange font-bold">Asia Drone Store</span>. All Rights Reserved. 
                        </p>
                    </div>

                    {/* Center: Credits */}
                    <div className="flex-1 text-center">
                        <p className="text-slate-500 text-sm">
                            Designed, Developed and Hosted by <span className="text-slate-400 hover:text-brand-orange transition-colors cursor-pointer font-medium">Asia Softlab Pvt. Ltd.</span>
                        </p>
                    </div>
                    
                    {/* Right: Legal Links */}
                    <div className="flex-1 flex items-center justify-center md:justify-end gap-6">
                        <Link href="/privacy" className="text-slate-400 text-sm hover:text-brand-orange transition-all relative group">
                            Privacy Policy
                            <span className="absolute bg-brand-orange transition-all group-hover:w-full"></span>
                        </Link>
                        <Link href="/Terms&Conditions" className="text-slate-400 text-sm hover:text-brand-orange transition-all relative group">
                            Terms & Conditions
                            <span className="absolute bg-brand-orange transition-all group-hover:w-full"></span>
                        </Link>
                        <Link href="/help#faq" className="text-slate-400 text-sm hover:text-brand-orange transition-all relative group">
                            FAQ
                            <span className="absolute bg-brand-orange transition-all group-hover:w-full"></span>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
