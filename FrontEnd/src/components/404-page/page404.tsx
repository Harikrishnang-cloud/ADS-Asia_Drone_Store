"use client";

import React from 'react';
import Link from 'next/link';
import { Home, Search, ArrowLeft, MessageSquare, Compass, ShieldAlert } from 'lucide-react';

export default function Page404() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6 overflow-hidden relative">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-orange/5 blur-[120px] rounded-full animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-blue/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="relative z-10 max-w-2xl w-full text-center">
                <div className="relative mb-12">
                    <h1 className="text-[12rem] md:text-[16rem] font-black text-slate-100 leading-none select-none tracking-tighter opacity-50">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center translate-y-8">
                        <div className="bg-white/80 backdrop-blur-md px-8 py-4 rounded-2xl border border-white shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                             <ShieldAlert className="text-brand-orange mx-auto mb-2 animate-bounce" size={48} />
                             <p className="text-brand-blue-dark font-black text-2xl uppercase tracking-widest">
                                Lost in the Sky?
                             </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 mb-12">
                    <h2 className="text-3xl md:text-4xl font-black text-brand-blue-dark tracking-tight">
                        Oops! This drone has flown <span className="text-brand-orange italic">off course</span>.
                    </h2>
                    <p className="text-slate-500 text-lg font-medium max-w-md mx-auto leading-relaxed">
                        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                    </p>
                </div>

                {/* Navigation Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                    <Link href="/" className="flex items-center justify-center gap-3 bg-brand-blue-dark text-white px-8 py-4 rounded-xl font-bold hover:bg-black transition-all group shadow-xl shadow-brand-blue/20">
                        <Home size={20} className="group-hover:-translate-y-1 transition-transform" />
                        Back to Home
                    </Link>
                    
                    <Link href="/support" className="flex items-center justify-center gap-3 bg-white text-brand-blue-dark border border-slate-200 px-8 py-4 rounded-xl font-bold hover:border-brand-orange hover:text-brand-orange transition-all group shadow-sm">
                        <MessageSquare size={20} className="group-hover:translate-x-1 transition-transform" />
                        Get Support
                    </Link>

                    <button 
                        onClick={() => window.history.back()}
                        className="sm:col-span-2 flex items-center justify-center gap-2 text-slate-400 font-bold py-2 hover:text-brand-blue-dark transition-colors group">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Go Back to Previous Page
                    </button>
                </div>

                {/* Quick Links / Suggestions */}
                <div className="mt-20 pt-10 border-t border-slate-100">
                    <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Popular Destinations</p>
                    <div className="flex flex-wrap justify-center gap-8">
                        {[
                            { name: "Products", icon: Compass, link: "/products" },
                            { name: "Support", icon: Search, link: "/support" }
                        ].map((item, idx) => (
                            <Link 
                                key={idx}
                                href={item.link}
                                className="flex items-center gap-2 text-slate-500 hover:text-brand-orange transition-colors font-bold group"
                            >
                                <item.icon size={16} className="text-slate-300 group-hover:text-brand-orange transition-colors" />
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
