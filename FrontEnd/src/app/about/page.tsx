"use client";

import React from "react";
import { 
    ShieldCheck, 
    Target, 
    Headphones, 
    Zap, 
    Globe, 
    Award,
    ChevronRight,
    Play
} from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/button";

export default function AboutPage() {
    return (
        <div className="bg-slate-50 flex flex-col">

            {/* Hero Section */}
            <section className="pt-32 pb-20 md:pt-40 md:pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-blue/[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl space-y-6 relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-blue/5 border border-brand-blue/10 text-[10px] font-black uppercase tracking-widest text-brand-blue">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse"></span>
                            Since 2018
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[1.1]">
                            Elevating Your Aerial Experience.
                        </h1>
                        <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl">
                            Welcome to Asia Drone Store. We don't just sell drones; we provide the wings for your imagination, creativity, and professional aspirations. As the leading premium drone retailer, we are committed to pushing the boundaries of what's possible in the sky.
                        </p>
                        <div className="pt-4 flex flex-wrap gap-4">
                            <Link href="/products">
                                <Button variant="primary" size="lg" icon={<ChevronRight size={18} />}>
                                    Explore Our Catalog
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button variant="secondary" size="lg">
                                    Get in Touch
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="py-24 bg-slate-50 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center justify-center gap-2">
                            <Award size={16} /> The ADS Advantage
                        </h2>
                        <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                            Why choose us as your aviation partner?
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: ShieldCheck,
                                title: "Guaranteed Authenticity",
                                desc: "Every drone we sell is 100% authentic, sourced directly from manufacturers with full warranty backing. No grey market imports."
                            },
                            {
                                icon: Zap,
                                title: "Cutting-Edge Selection",
                                desc: "We curate our inventory. If a drone doesn't meet our strict standards for durability, camera quality, and flight stability, we don't stock it."
                            },
                            {
                                icon: Headphones,
                                title: "Technical Support",
                                desc: "Our team consists of certified drone pilots. Whether you need help with initial setup, firmware updates, or advanced flight maneuvers, we're here."
                            },
                            {
                                icon: Globe,
                                title: "Nationwide Free Shipping",
                                desc: "Premium tech deserves premium delivery. We offer fully insured, expedited shipping on all orders over ₹50,000, right to your doorstep."
                            },
                            {
                                icon: Target,
                                title: "Price Match Guarantee",
                                desc: "We are committed to offering you the best value. Find a lower price from an authorized retailer, and we will match it instantly."
                            },
                            {
                                icon: Award,
                                title: "Certified Repair Center",
                                desc: "Crashes happen. Our in-house repair facility is equipped with OEM parts and trained engineers to get you back in the air quickly."
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6 border border-slate-100 group-hover:bg-brand-blue group-hover:border-brand-blue transition-colors">
                                    <feature.icon className="text-slate-600 group-hover:text-white transition-colors" size={24} />
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 mb-3">{feature.title}</h4>
                                <p className="text-sm font-medium text-slate-500 leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-white border-t border-slate-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
                        Ready to take<br />your creativity higher?
                    </h2>
                    <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto">
                        Join thousands of creators, professionals, and hobbyists who trust Asia Drone Store for all their aerial needs.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link href="/products" className="w-full sm:w-auto">
                            <Button variant="orange" size="lg" className="w-full" icon={<ChevronRight size={18} />}>
                                Shop Drones Now
                            </Button>
                        </Link>
                        <Link href="/contact" className="w-full sm:w-auto">
                            <Button variant="secondary" size="lg" className="w-full">
                                Speak to an Expert
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
