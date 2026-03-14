"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    Facebook, 
    Twitter, 
    Instagram, 
    Youtube, 
    Mail, 
    Phone, 
    MapPin, 
    ArrowRight,
    Send
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
    const pathname = usePathname();

    // Skip rendering footer on authentication or admin pages
    if (pathname?.startsWith("/auth") || pathname?.startsWith("/admin")) {
        return null;
    }

    const currentYear = new Date().getFullYear();

    const footerLinks = {
        shop: [
            { name: "Professional Drones", href: "/products/professional" },
            { name: "Photography Drones", href: "/products/photography" },
            { name: "Spare Parts", href: "/products/spare-parts" },
            { name: "Accessories", href: "/products/accessories" },
            { name: "New Arrivals", href: "/products/new-arrivals" },
        ],
        company: [
            { name: "About ADS", href: "/about" },
            { name: "Our Gallery", href: "/gallery" },
            { name: "Contact Us", href: "/contact" },
            { name: "Terms of Service", href: "/terms" },
            { name: "Privacy Policy", href: "/privacy" },
        ],
        social: [
            { name: "Facebook", icon: Facebook, href: "https://facebook.com" },
            { name: "Instagram", icon: Instagram, href: "https://instagram.com" },
            { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
            { name: "Youtube", icon: Youtube, href: "https://youtube.com" },
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
                        <Logo width={180} height={180} showText={true} textColor="text-white" />
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
                            <div className="relative group">
                                <input 
                                    type="email" 
                                    placeholder="your@email.com" 
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-brand-orange transition-all"
                                />
                                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-orange p-2 rounded-lg hover:bg-white hover:text-brand-orange transition-all duration-300">
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4 text-sm text-slate-400 hover:text-white transition-colors cursor-pointer group">
                                <MapPin size={18} className="text-brand-orange flex-shrink-0 group-hover:scale-110 transition-transform" />
                                <span>//////</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-400 hover:text-white transition-colors cursor-pointer group">
                                <Phone size={18} className="text-brand-orange flex-shrink-0 group-hover:scale-110 transition-transform" />
                                <span>+91 //////</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-400 hover:text-white transition-colors cursor-pointer group">
                                <Mail size={18} className="text-brand-orange flex-shrink-0 group-hover:scale-110 transition-transform" />
                                <span>//////</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-400 text-sm text-center text-white md:text-left">
                        © {currentYear} Asia Drone Store. All Rights Reserved. Built with <span className="text-brand-orange">Drone Store</span> by Asia Softlab.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6">
                        {/* privacy policy & terms and conditions */}
                    </div>
                </div>
            </div>
        </footer>
    );
}
