"use client";

import React from "react";
import {ShieldCheck, Target, Headphones, Zap, Globe, Award, ChevronRight} from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/button";

export default function AboutPage() {
    return (
        <div className="bg-slate-50 flex flex-col">
            {/* Hero Section */}
            <section className="pt-8 pb-8 md:pt-20 md:pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute inset-0 -z-10 pointer-events-none opacity-40"></div>
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-blue/[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col items-center justify-center">
                        <div className="text-left md:text-center max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <h1 className="text-3xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[1.1] mb-4 md:mb-6">
                                Elevating Your <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-blue-dark to-brand-orange">Aerial Experience.</span>
                            </h1>
                            <p className="text-slate-500 text-xs md:text-lg leading-relaxed max-w-2xl mx-auto">
                                Welcome to Asia Drone Store. We don&apos;t just sell drones; we provide the wings for your imagination, creativity, and professional aspirations. As the leading premium drone retailer, we are committed to pushing the boundaries of what&apos;s possible in the sky.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Combined SEO Content Block */}
            <section className="py-8 md:py-12 bg-white space-y-8 md:space-y-16 border-t border-slate-100">
                {/* Intro Section for SEO */}
                <div className="max-w-screen-xl mx-auto px-4 md:px-8 text-center">
                    <h2 className="text-lg md:text-3xl font-black text-brand-blue-dark mb-2 md:mb-4 tracking-tight">Welcome to Asia Drone Store – India&apos;s Premium Drone Hub</h2>
                    <p className="text-xs md:text-base text-slate-500 max-w-4xl mx-auto leading-relaxed">
                        Based in Thiruvananthapuram, Kerala, Asia Drone Store is a leading provider of top-tier consumer drones, agriculture drones, industrial UAVs, and FPV drones. Whether you are a professional aerial photographer, an agricultural expert needing precision farming tools, or a hobbyist searching for the best FPV drones, we have you covered. We also stock a massive inventory of drone accessories, drone cameras, batteries, controllers, and genuine spare parts.
                    </p>
                </div>

                {/* Category SEO Text Block */}
                <div className="max-w-screen-xl mx-auto px-4 md:px-8">
                    <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
                        <h2 className="text-base md:text-2xl font-bold text-slate-800 mb-4 text-center md:text-left">Discover the Perfect Drone for Every Industry</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            <div>
                                <h3 className="text-sm md:text-base font-semibold text-brand-orange mb-1 md:mb-2">Consumer Drones</h3>
                                <p className="text-xs md:text-sm text-slate-500 leading-relaxed">Elevate your photography and videography with state-of-the-art consumer drones. Perfect for travel, vlogging, and capturing stunning aerial 4K footage with ease.</p>
                            </div>
                            <div>
                                <h3 className="text-sm md:text-base font-semibold text-brand-orange mb-1 md:mb-2">Agriculture Drones</h3>
                                <p className="text-xs md:text-sm text-slate-500 leading-relaxed">Transform modern farming with our agricultural UAVs. Optimize crop spraying, field monitoring, and yield analysis to ensure maximum efficiency in agriculture.</p>
                            </div>
                            <div>
                                <h3 className="text-sm md:text-base font-semibold text-brand-orange mb-1 md:mb-2">Industrial & FPV Drones</h3>
                                <p className="text-xs md:text-sm text-slate-500 leading-relaxed">Explore our range of industrial drones designed for surveying, mapping, and inspections. For thrill-seekers, we offer high-speed FPV drones delivering unmatched agility.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Why Choose Us SEO Text Block */}
                <div className="max-w-screen-xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-6 md:mb-8">
                        <h2 className="text-lg md:text-3xl font-black text-brand-blue-dark mb-2 md:mb-4">Why Choose Asia Drone Store?</h2>
                        <p className="text-xs md:text-base text-slate-500 max-w-3xl mx-auto">
                            At Asia Drone Store, we sell more than just drones. We provide end-to-end aerial solutions tailored to industries across India. Here is why customers trust us:
                        </p>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                        <div className="bg-white p-4 md:p-6 rounded-lg text-center border border-slate-100 flex flex-col justify-center shadow-sm">
                            <h3 className="text-xs md:text-base font-bold text-slate-800 mb-1 md:mb-2">Genuine Products</h3>
                            <p className="text-[10px] md:text-xs text-slate-500 leading-tight">We stock only authentic drones, batteries, and drone cameras.</p>
                        </div>
                        <div className="bg-white p-4 md:p-6 rounded-lg text-center border border-slate-100 flex flex-col justify-center shadow-sm">
                            <h3 className="text-xs md:text-base font-bold text-slate-800 mb-1 md:mb-2">Expert Support</h3>
                            <p className="text-[10px] md:text-xs text-slate-500 leading-tight">Our technical team is ready to assist you with setup and repair.</p>
                        </div>
                        <div className="bg-white p-4 md:p-6 rounded-lg text-center border border-slate-100 flex flex-col justify-center shadow-sm">
                            <h3 className="text-xs md:text-base font-bold text-slate-800 mb-1 md:mb-2">Fast Shipping</h3>
                            <p className="text-[10px] md:text-xs text-slate-500 leading-tight">Enjoy secure delivery anywhere in India from our warehouse.</p>
                        </div>
                        <div className="bg-white p-4 md:p-6 rounded-lg text-center border border-slate-100 flex flex-col justify-center shadow-sm">
                            <h3 className="text-xs md:text-base font-bold text-slate-800 mb-1 md:mb-2">Broad Range</h3>
                            <p className="text-[10px] md:text-xs text-slate-500 leading-tight">From replacement propellers to thermal drone payloads.</p>
                        </div>
                    </div>
                </div>

            </section>

            {/* Core Values Section */}
            <section className="py-6 md:py-12 bg-slate-50 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                        <h2 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400 flex items-center justify-center gap-1 md:gap-2">
                            <Award size={14} className="md:w-[16px] md:h-[16px]" /> The ADS Advantage
                        </h2>
                        <h3 className="text-xl md:text-4xl font-black text-slate-900 tracking-tight">
                            Why choose us as your aviation partner?
                        </h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
                        {[
                            {
                                icon: ShieldCheck,
                                title: "Guaranteed Authenticity",
                                desc: "Every drone we sell is 100% authentic, sourced directly from manufacturers with full warranty backing. No grey market imports.",
                                gradient: "from-blue-500 to-cyan-400"
                            },
                            {
                                icon: Zap,
                                title: "Cutting-Edge Selection",
                                desc: "We curate our inventory. If a drone doesn&apos;t meet our strict standards for durability, camera quality, and flight stability, we don&apos;t stock it.",
                                gradient: "from-orange-500 to-amber-400"
                            },
                            {
                                icon: Headphones,
                                title: "Technical Support",
                                desc: "Our team consists of certified drone pilots. Whether you need help with initial setup, firmware updates, or advanced flight maneuvers, we're here.",
                                gradient: "from-purple-500 to-pink-500"
                            },
                            {
                                icon: Globe,
                                title: "Nationwide Free Shipping",
                                desc: "Premium tech deserves premium delivery. We offer fully insured, expedited shipping on all orders over ₹50,000, right to your doorstep.",
                                gradient: "from-emerald-500 to-teal-400"
                            },
                            {
                                icon: Target,
                                title: "Price Match Guarantee",
                                desc: "We are committed to offering you the best value. Find a lower price from an authorized retailer, and we will match it instantly.",
                                gradient: "from-rose-500 to-red-400"
                            },
                            {
                                icon: Award,
                                title: "Certified Repair Center",
                                desc: "Crashes happen. Our in-house repair facility is equipped with OEM parts and trained engineers to get you back in the air quickly.",
                                gradient: "from-indigo-500 to-brand-blue"
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-white p-4 md:p-10 rounded-lg md:rounded-2xl border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
                                <div className={`absolute top-0 right-0 w-12 h-12 md:w-24 md:h-24 rounded-bl-[50px] md:rounded-bl-[100px] -mr-4 -mt-4 md:-mr-8 md:-mt-8 transition-all duration-500 bg-gradient-to-br ${feature.gradient} opacity-80 group-hover:opacity-100 group-hover:scale-110`}></div>
                                <div className="relative z-10 w-10 h-10 md:w-14 md:h-14 bg-slate-50 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-8 border border-slate-100 group-hover:bg-brand-blue group-hover:border-brand-blue group-hover:scale-110 transition-all duration-300 shadow-inner">
                                    <feature.icon className="w-5 h-5 md:w-[26px] md:h-[26px] text-slate-600 group-hover:text-white transition-colors" />
                                </div>      
                                <h4 className="text-[12px] md:text-xl font-black text-slate-900 mb-1.5 md:mb-4 tracking-tight group-hover:text-brand-blue transition-colors leading-tight">{feature.title}</h4>
                                <p className="text-[10px] md:text-sm font-medium text-slate-500 leading-relaxed md:leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 md:py-20 bg-white border-t border-slate-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 md:space-y-8">
                    <h2 className="text-2xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
                        Ready to take<br />your creativity higher?
                    </h2>
                    <p className="text-xs md:text-lg text-slate-500 font-medium max-w-xl mx-auto">
                        Join thousands of creators, professionals, and hobbyists who trust Asia Drone Store for all their aerial needs.
                    </p>
                    <div className="flex flex-row items-center justify-between gap-3 pt-4 w-full max-w-sm mx-auto sm:max-w-none sm:justify-center sm:gap-4">
                        <Link href="/products" className="w-full sm:w-auto flex-1">
                            <Button variant="orange" size="lg" className="w-full !text-[11px] !py-2.5 !px-2 md:!text-lg md:!py-4 md:!px-8" 
                            icon={<ChevronRight size={18} className="w-4 h-4 md:w-5 md:h-5" />}>
                                Shop Drones
                            </Button>
                        </Link>
                        <Link href="/contact" className="w-full sm:w-auto flex-1">
                            <Button variant="secondary" size="lg" className="w-full !text-[11px] !py-2.5 !px-2 md:!text-lg md:!py-4 md:!px-8"
                            icon={<ChevronRight size={18} className="w-4 h-4 md:w-5 md:h-5" />}>
                                Speak to an Expert
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
