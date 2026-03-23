"use client";

import React from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, LogOut } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useSidebar } from "../Controller/useSidebar";

export default function Sidebar() {
    const {navItems, openMenus, toggleMenu, handleLogout, isActive, isChildActive} = useSidebar();

    return (
        <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-200 h-screen sticky top-0 z-50 shadow-sm transition-all duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-center">
                <Logo width={150} height={150} showText={true} textColor="text-brand-blue-dark" className="w-[120px] lg:w-[150px]" imageClassName="w-full h-auto" />
            </div>
            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
                {navItems.map((item) => {
                    const isExpandable = !!item.subItems;
                    const active = item.href ? isActive(item.href) : isChildActive(item.subItems || []);

                    if (isExpandable) {
                        return (
                            <div key={item.label} className="space-y-1">
                                <button
                                    onClick={() => toggleMenu(item.label)}
                                    className={`flex items-center justify-between w-full gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 group ${
                                        active 
                                        ? "bg-brand-blue-dark/5 text-brand-blue-dark" 
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                    }`}>
                                    <div className="flex items-center gap-3">
                                        <item.icon size={20} className={active ? "text-brand-orange" : "group-hover:text-brand-orange transition-colors"} />
                                        <span>{item.label}</span>
                                    </div>
                                    {openMenus.includes(item.label) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                </button>

                                {openMenus.includes(item.label) && (
                                    <div className="ml-4 pl-4 border-l-2 border-slate-100 space-y-1 animate-in slide-in-from-top-2 duration-200">
                                        {item.subItems?.map((subItem) => (
                                            <Link
                                                key={subItem.href}
                                                href={subItem.href}
                                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                                    isActive(subItem.href)
                                                    ? "text-brand-orange bg-brand-orange/5"
                                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                                }`}>
                                                <subItem.icon size={16} />
                                                {subItem.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    return (
                        <Link key={item.label} href={item.href!}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 group ${
                                active 
                                ? "bg-brand-blue-dark/5 text-brand-blue-dark" 
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            }`}>
                            <item.icon size={20} className={active ? "text-brand-orange" : "group-hover:text-brand-orange transition-colors"} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-slate-100">
                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center w-full gap-2 bg-slate-50 text-slate-600 hover:bg-red-50 hover:text-red-600 px-4 py-3 rounded-xl transition-all font-bold text-sm border border-transparent hover:border-red-100"
                >
                    <LogOut size={18} />
                    Logout Account
                </button>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </aside>
    );
}
