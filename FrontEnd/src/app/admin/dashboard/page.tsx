"use client";

import {Download, ArrowRight } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";
import { generateSalesReport, SalesData } from "@/lib/reportGenerator";

type ReportFilter = 'today' | 'weekly' | 'monthly' | 'custom';
type StatusFilter = 'all' | 'completed' | 'uncompleted';

export default function AdminDashboardPage() {
    const [dateTime, setDateTime] = useState(new Date());
    const [isGenerating, setIsGenerating] = useState(false);
    const [activeFilter, setActiveFilter] = useState<ReportFilter>('today');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
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

            // 1. Determine Date Range
            if (activeFilter === 'today') {
                startOfPeriod = new Date();
                startOfPeriod.setHours(0, 0, 0, 0);
                filterLabel = "Day: " + startOfPeriod.toLocaleDateString();
                q = query(ordersRef, where("createdAt", ">=", Timestamp.fromDate(startOfPeriod)));
            } else if (activeFilter === 'weekly') {
                startOfPeriod = new Date();
                startOfPeriod.setDate(now.getDate() - 7);
                filterLabel = "Last 7 Days";
                q = query(ordersRef, where("createdAt", ">=", Timestamp.fromDate(startOfPeriod)));
            } else if (activeFilter === 'monthly') {
                startOfPeriod = new Date(now.getFullYear(), now.getMonth(), 1);
                filterLabel = "Month: " + startOfPeriod.toLocaleString('default', { month: 'long' });
                q = query(ordersRef, where("createdAt", ">=", Timestamp.fromDate(startOfPeriod)));
            } else {
                if (!customDates.start || !customDates.end) {
                    toast.error("Set dates");
                    setIsGenerating(false);
                    return;
                }
                const start = new Date(customDates.start);
                const end = new Date(customDates.end);
                end.setHours(23, 59, 59, 999);
                filterLabel = "Custom Range";
                q = query(ordersRef, 
                    where("createdAt", ">=", Timestamp.fromDate(start)),
                    where("createdAt", "<=", Timestamp.fromDate(end))
                );
            }

            // 2. Fetch data (filtering by status in-memory to avoid index complexity)
            const querySnapshot = await getDocs(q);
            let orders = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as SalesData[];

            // 3. Apply Status Filter
            if (statusFilter === 'completed') {
                orders = orders.filter(o => o.status?.toLowerCase() === 'delivered');
                filterLabel += " (Completed)";
            } else if (statusFilter === 'uncompleted') {
                orders = orders.filter(o => o.status?.toLowerCase() !== 'delivered' && o.status?.toLowerCase() !== 'cancelled');
                filterLabel += " (Uncompleted)";
            }

            if (orders.length === 0) {
                toast.error("No results found");
                setIsGenerating(false);
                return;
            }

            generateSalesReport(orders, filterLabel);
            toast.success("Downloaded!");
        } catch (error) {
            console.error(error);
            toast.error("Error");
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
                             <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">System Overview</h2>
                         </div>
                         <p className="text-slate-500 font-medium">Manage and track your performance.</p>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                        <div className="px-4 py-2 text-sm font-bold text-slate-600 border-r border-slate-100">
                            {dateTime.toLocaleDateString()} | {dateTime.toLocaleTimeString()}
                        </div>
                        <div className="px-4 py-2 text-sm font-black text-brand-blue uppercase tracking-widest flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            Live Status
                        </div>
                    </div>
                </div>

                {/* Sales Report Tool with Dual Filters */}
                <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm mb-10 overflow-hidden">
                    <div className="flex flex-wrap items-center divide-x divide-slate-100">
                        {/*  Label Section */}
                        <div className="px-6 py-2 text-[15px] font-black text-slate-800 uppercase tracking-[0.1em]">
                            Sales Report
                        </div>

                        {/*  Date Filter Section */}
                        <div className="flex items-center gap-1 px-4 py-2">
                            {(['today', 'weekly', 'monthly', 'custom'] as ReportFilter[]).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setActiveFilter(f)}
                                    className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest cursor-pointer rounded-lg transition-all ${activeFilter === f ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>

                        

                        {/*  Custom Date Range Inputs */}
                        {activeFilter === 'custom' && (
                            <div className="flex items-center gap-2 px-6 py-2 animate-in slide-in-from-left-2 fade-in">
                                <input 
                                    type="date" 
                                    value={customDates.start}
                                    onChange={(e) => setCustomDates({...customDates, start: e.target.value})}
                                    className="bg-slate-50 border border-slate-100 rounded-md px-3 py-1.5 text-[10px] font-bold text-slate-700 outline-none w-32"
                                />
                                <ArrowRight size={12} className="text-slate-300" />
                                <input 
                                    type="date" 
                                    value={customDates.end}
                                    onChange={(e) => setCustomDates({...customDates, end: e.target.value})}
                                    className="bg-slate-50 border border-slate-100 rounded-md px-3 py-1.5 text-[10px] font-bold text-slate-700 outline-none w-32"
                                />
                            </div>
                        )}
                        {/*  Status Filter Section */}
                        <div className="flex items-center gap-1 px-4 py-2">
                            {(['all', 'completed', 'uncompleted'] as StatusFilter[]).map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setStatusFilter(s)}
                                    className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest cursor-pointer rounded-md transition-all flex items-center gap-2 ${statusFilter === s ? 'bg-black text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    {s === 'completed'}
                                    {s === 'uncompleted'}
                                    {s}
                                </button>
                            ))}
                        </div>

                        {/*  Download Action */}
                        <div className="ml-auto px-4 py-2">
                            <button 
                                onClick={handleDownloadReport}
                                disabled={isGenerating}
                                className={`flex items-center gap-3 px-8 py-2.5 rounded-lg text-[11px] font-black uppercase cursor-pointer tracking-widest transition-all ${isGenerating ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-black shadow-lg shadow-black/10 active:scale-[0.98]'}`}
                            >
                                <Download size={16} />
                                {isGenerating ? 'Generating...' : 'Download PDF'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
