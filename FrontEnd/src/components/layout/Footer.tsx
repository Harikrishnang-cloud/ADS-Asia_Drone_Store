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
        <footer className="bg-slate-900 text-white pt-8 md:pt-20 pb-20 md:pb-10 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[200px] md:w-[300px] h-[200px] md:h-[300px] bg-brand-orange/10 blur-[100px] md:blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-brand-blue/10 blur-[120px] md:blur-[150px] rounded-full pointer-events-none"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12 lg:gap-8 mb-8 md:mb-16">

                    {/* Brand Info */}
                    <div className="col-span-2 md:col-span-1 lg:col-span-1 space-y-4 md:space-y-6">
                        <Logo width={180} height={180} className="w-[120px] md:w-[180px]" />
                        <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-xs">
                            Asia Drone Store (ADS) is your premium destination for high-end drones, spare parts, and professional aerial accessories across Asia.
                        </p>
                        <div className="flex items-center gap-3 md:gap-4">
                            {footerLinks.social.map((item) => (
                                <a suppressHydrationWarning
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
                    <div className="col-span-1">
                        <h4 className="text-sm md:text-lg font-bold mb-4 md:mb-6 flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                            Quick Shop
                            <span className="w-6 md:w-8 h-[2px] bg-brand-orange mt-1 md:mt-0"></span>
                        </h4>
                        <ul className="space-y-4">
                            {footerLinks.shop.map((link) => (
                                <li key={link.name}>
                                    <Link suppressHydrationWarning
                                        href={link.href}
                                        className="text-slate-400 hover:text-brand-orange transition-colors flex items-center gap-1 md:gap-2 group text-xs md:text-sm"
                                    >
                                        <ArrowRight size={12} className="opacity-0 -ml-3 md:-ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 md:w-3.5 md:h-3.5" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>


                    {/* Quick Links: Company */}
                    <div className="col-span-1">
                        <h4 className="text-sm md:text-lg font-bold mb-4 md:mb-6 flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                            Company
                            <span className="w-6 md:w-8 h-[2px] bg-brand-orange mt-1 md:mt-0"></span>
                        </h4>
                        <ul className="space-y-4">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link suppressHydrationWarning
                                        href={link.href}
                                        className="text-slate-400 hover:text-brand-orange transition-colors flex items-center gap-1 md:gap-2 group text-xs md:text-sm"
                                    >
                                        <ArrowRight size={12} className="opacity-0 -ml-3 md:-ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 md:w-3.5 md:h-3.5" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact & Newsletter */}
                    <div className="col-span-2 md:col-span-1 lg:col-span-1 space-y-4 md:space-y-8">
                        <div>
                            <h4 className="text-sm md:text-lg font-bold mb-2 md:mb-6 flex items-center gap-2">
                                Newsletter
                                <span className="w-6 md:w-8 h-[2px] bg-brand-orange"></span>
                            </h4>
                            <p className="text-slate-400 text-xs md:text-sm mb-2 md:mb-4">Subscribe to get latest updates and offers.</p>
                            <div className="relative group flex items-center">
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg md:rounded-xl py-2 md:py-3 pl-3 md:pl-4 pr-10 md:pr-12 text-[10px] md:text-sm focus:outline-none focus:border-brand-orange transition-all"
                                    suppressHydrationWarning
                                />
                                <button
                                    type="button"
                                    onClick={handleSubscribe}
                                    disabled={isSubscribing}
                                    aria-label="Subscribe to newsletter"
                                    className="absolute right-1.5 md:right-2 top-1/2 -translate-y-1/2 bg-brand-orange p-1.5 md:p-2 rounded-md md:rounded-lg hover:bg-white hover:text-brand-orange transition-all duration-300 disabled:opacity-50"
                                    suppressHydrationWarning
                                >
                                    <Send className={`w-3 h-3 md:w-4 md:h-4 ${isSubscribing ? "opacity-50 cursor-wait" : ""}`} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3 md:space-y-4">
                            <div className="flex items-start gap-2 md:gap-4 text-[10px] md:text-sm text-slate-400 hover:text-white transition-colors cursor-pointer group">
                                <MapPin className="w-3.5 h-3.5 md:w-[18px] md:h-[18px] text-brand-orange flex-shrink-0 group-hover:scale-110 transition-transform" />
                                <span>{"Asia Softlab Pvt Ltd, 1st Floor - MG Corporate Center, Ulloor, Thiruvananthapuram, Kerala, 695011"}</span>
                            </div>
                            <div className="flex items-center gap-2 md:gap-4 text-[10px] md:text-sm text-slate-400 hover:text-white transition-colors cursor-pointer group">
                                <Phone className="w-3.5 h-3.5 md:w-[18px] md:h-[18px] text-brand-orange flex-shrink-0 group-hover:scale-110 transition-transform" />
                                <span>{"+91 70121 47575"}</span>
                            </div>
                            <div className="flex items-center gap-2 md:gap-4 text-[10px] md:text-sm text-slate-400 hover:text-white transition-colors cursor-pointer group">
                                <Mail className="w-3.5 h-3.5 md:w-[18px] md:h-[18px] text-brand-orange flex-shrink-0 group-hover:scale-110 transition-transform" />
                                <span>{"asiadronestore@gmail.com"}</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-6 md:pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-4">
                    {/* Left: Copyright */}
                    <div className="flex-1 text-center md:text-left">
                        <p className="text-slate-400 text-xs md:text-sm whitespace-nowrap">
                            © {hasMounted ? (currentYear || 2026) : 2026} <span className="text-brand-orange font-bold">Asia Drone Store</span>.
                        </p>
                    </div>

                    {/* Center: Credits */}
                    <div className="flex-1 text-center">
                        <p className="text-slate-500 text-[10px] md:text-sm">
                            Developed by <span className="text-slate-400 hover:text-brand-orange transition-colors cursor-pointer font-medium">Asia Softlab</span>
                        </p>
                    </div>

                    {/* Right: Legal Links */}
                    <div className="flex-1 flex flex-wrap items-center justify-center md:justify-end gap-4 md:gap-6">
                        <Link suppressHydrationWarning href="/privacy" className="text-slate-400 text-[10px] md:text-sm hover:text-brand-orange transition-all relative group">
                            Privacy Policy
                            <span className="absolute bg-brand-orange transition-all group-hover:w-full"></span>
                        </Link>
                        <Link suppressHydrationWarning href="/terms-and-conditions" className="text-slate-400 text-[10px] md:text-sm hover:text-brand-orange transition-all relative group">
                            Terms & Conditions
                            <span className="absolute bg-brand-orange transition-all group-hover:w-full"></span>
                        </Link>
                        <Link suppressHydrationWarning href="/help#faq" className="text-slate-400 text-[10px] md:text-sm hover:text-brand-orange transition-all relative group">
                            FAQ
                            <span className="absolute bg-brand-orange transition-all group-hover:w-full"></span>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
