"use client";

import { LayoutDashboard } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useState, useEffect } from "react";




export default function AdminDashboardPage() {
    const [dateTime, setDateTime] = useState(new Date());
    useEffect(() => {
        const interval = setInterval(() => {
            setDateTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);
   
    return (
        <ProtectedRoute allowedRole="admin">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-brand-orange/10 rounded-lg">
                                <LayoutDashboard className="text-brand-orange w-5 h-5" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Overview</h2>
                        </div>
                        <p className="text-slate-500 font-medium">Welcome back, Vishnu. Here's what's happening today. Lets see</p>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="px-4 py-2 text-sm font-bold text-slate-600 border-r border-slate-100">
                           Today : {new Date().toLocaleDateString()}, Time : {new Date().toLocaleTimeString()}
                        </div>
                        <div className="px-4 py-2 text-sm font-bold text-brand-orange">
                            Live Status
                        </div>
                    </div>
                </div>
                
               

               
            </div>
        </ProtectedRoute>
    );
}
