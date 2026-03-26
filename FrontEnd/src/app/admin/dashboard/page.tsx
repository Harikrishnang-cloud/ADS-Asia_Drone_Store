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
                             <div className="p-2 bg-brand-blue/10 rounded-lg">
                                 <LayoutDashboard className="text-brand-blue w-6 h-6" />
                             </div>
                             <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">System Overview</h2>
                         </div>
                         <p className="text-slate-500 font-medium ml-11">Welcome back, Vishnu. Here's what's happening today. Lets see</p>
                    </div>
                    
                     <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                         <div className="px-4 py-2 text-sm font-bold text-slate-600 border-r border-slate-100 italic">
                            Today : {new Date().toLocaleDateString()}, Time : {new Date().toLocaleTimeString()}
                         </div>
                         <div className="px-4 py-2 text-sm font-black text-brand-blue uppercase tracking-widest">
                             Live Status
                         </div>
                     </div>
                </div>
               
            </div>
        </ProtectedRoute>
    );
}
