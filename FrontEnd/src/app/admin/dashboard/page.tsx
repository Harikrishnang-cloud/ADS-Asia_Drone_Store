"use client";

import { LayoutDashboard, Download, Calendar, ArrowRight } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";
import { generateSalesReport } from "@/lib/reportGenerator";

type ReportFilter = 'today' | 'weekly' | 'monthly' | 'custom';

export default function AdminDashboardPage() {
    const [dateTime, setDateTime] = useState(new Date());
    const [isGenerating, setIsGenerating] = useState(false);
    const [activeFilter, setActiveFilter] = useState<ReportFilter>('today');
    const [customDates, setCustomDates] = useState({ start: '', end: '' });

    useEffect(() => {
        const interval = setInterval(() => {
            setDateTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleDownloadReport = async () => {
        setIsGenerating(true);
        try {
            const ordersRef = collection(db, "orders");
            let q;
            const now = new Date();
            let startOfPeriod: Date;
            let filterLabel = "";

            if (activeFilter === 'today') {
                startOfPeriod = new Date();
                startOfPeriod.setHours(0, 0, 0, 0);
                filterLabel = "Daily Report - " + startOfPeriod.toLocaleDateString();
                q = query(ordersRef, where("createdAt", ">=", Timestamp.fromDate(startOfPeriod)));
            } else if (activeFilter === 'weekly') {
                startOfPeriod = new Date(now);
                startOfPeriod.setDate(now.getDate() - 7);
                filterLabel = "Weekly Report (Last 7 Days)";
                q = query(ordersRef, where("createdAt", ">=", Timestamp.fromDate(startOfPeriod)));
            } else if (activeFilter === 'monthly') {
                startOfPeriod = new Date(now.getFullYear(), now.getMonth(), 1);
                filterLabel = "Monthly Report - " + startOfPeriod.toLocaleString('default', { month: 'long', year: 'numeric' });
                q = query(ordersRef, where("createdAt", ">=", Timestamp.fromDate(startOfPeriod)));
            } else {
                if (!customDates.start || !customDates.end) {
                    toast.error("Please select both dates");
                    setIsGenerating(false);
                    return;
                }
                const start = new Date(customDates.start);
                const end = new Date(customDates.end);
                end.setHours(23, 59, 59, 999);
                filterLabel = `Custom Report (${start.toLocaleDateString()} - ${end.toLocaleDateString()})`;
                q = query(ordersRef, 
                    where("createdAt", ">=", Timestamp.fromDate(start)),
                    where("createdAt", "<=", Timestamp.fromDate(end))
                );
            }

            const querySnapshot = await getDocs(q);
            const orders = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as any[];

            if (orders.length === 0) {
                toast.error("No sales found");
                setIsGenerating(false);
                return;
            }

            generateSalesReport(orders, filterLabel);
            toast.success("Ready!");
        } catch (error) {
            console.error(error);
            toast.error("Failed");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <ProtectedRoute allowedRole="admin">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header Row */}
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                             <div className="p-2 bg-brand-blue/10 rounded-lg">
                                 <LayoutDashboard className="text-brand-blue w-6 h-6" />
                             </div>
                             <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">System Overview</h2>
                         </div>
                         <p className="text-slate-500 font-medium ml-11">Welcome back. Here's what's happening today.</p>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                        <div className="px-4 py-2 text-sm font-bold text-slate-600 border-r border-slate-100 italic">
                            Today : {dateTime.toLocaleDateString()}, Time : {dateTime.toLocaleTimeString()}
                        </div>
                        <div className="px-4 py-2 text-sm font-black text-brand-blue uppercase tracking-widest">
                            Live Status
                        </div>
                    </div>
                </div>

                {/* Minimal Sales Report Tool (Styled like the Status Box) */}
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 mb-10">
                    <div className="flex flex-wrap items-center bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex-1">
                        <div className="px-4 py-2 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-r border-slate-100">
                            Sales Report
                        </div>
                        
                        <div className="flex items-center gap-1 px-4 border-r border-slate-100">
                            {(['today', 'weekly', 'monthly', 'custom'] as ReportFilter[]).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setActiveFilter(f)}
                                    className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeFilter === f ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>

                        {activeFilter === 'custom' && (
                            <div className="flex items-center gap-2 px-4 border-r border-slate-100 animate-in slide-in-from-left-2 fade-in">
                                <input 
                                    type="date" 
                                    value={customDates.start}
                                    onChange={(e) => setCustomDates({...customDates, start: e.target.value})}
                                    className="bg-transparent text-[11px] font-bold text-slate-700 outline-none w-28"
                                />
                                <ArrowRight size={12} className="text-slate-300" />
                                <input 
                                    type="date" 
                                    value={customDates.end}
                                    onChange={(e) => setCustomDates({...customDates, end: e.target.value})}
                                    className="bg-transparent text-[11px] font-bold text-slate-700 outline-none w-28"
                                />
                            </div>
                        )}

                        <button 
                            onClick={handleDownloadReport}
                            disabled={isGenerating}
                            className={`ml-auto flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black uppercase tracking-widest transition-all ${isGenerating ? 'bg-slate-100 text-slate-400' : 'bg-brand-blue text-white hover:bg-slate-900'}`}
                        >
                            {isGenerating ? 'Processing...' : (
                                <>
                                    <Download size={16} />
                                    Download
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
