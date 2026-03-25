"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CreditCard, Search, Calendar, User, ArrowUpRight, ArrowDownLeft, Filter, RefreshCw, Loader2 } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

interface Transaction {
    id: string;
    userId: string;
    userName?: string;
    userEmail?: string;
    amount: number;
    type: 'topup' | 'order_payment' | 'refund' | 'order';
    paymentMethod: string;
    status: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    createdAt: any;
}

export default function AdminPaymentsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "transactions"), orderBy("createdAt", "desc"), limit(100));
            const querySnapshot = await getDocs(q);
            const data: Transaction[] = [];
            querySnapshot.forEach((doc) => {
                data.push({ id: doc.id, ...doc.data() } as Transaction);
            });
            setTransactions(data);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTransactions = transactions.filter(t => {
        const matchesSearch = (t.userName?.toLowerCase().includes(searchTerm.toLowerCase())) || 
                           (t.userEmail?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (t.id.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesFilter = filterType === "all" || t.type === filterType;
        return matchesSearch && matchesFilter;
    });

    return (
        <ProtectedRoute allowedRole="admin">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header Container */}
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-brand-blue/10 rounded-lg">
                                <CreditCard className="text-brand-blue w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Payment History</h2>
                        </div>
                        <p className="text-slate-500 font-medium ml-11">Monitor wallet top-ups and financial records.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button 
                            onClick={fetchTransactions}
                            className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-600 shadow-sm"
                            title="Refresh Data"
                        >
                            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                        </button>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="relative group flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-blue transition-colors" size={20} />
                        <input 
                            type="text"
                            placeholder="Search by name, email or ID..."
                            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all font-medium text-slate-700 shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="relative group">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <select 
                            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-brand-blue transition-all font-bold text-slate-700 shadow-sm appearance-none cursor-pointer"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="all">All Types</option>
                            <option value="topup">Wallet Top-up</option>
                            <option value="order">Order Payment</option>
                            <option value="refund">Refunds</option>
                        </select>
                    </div>

                    <div className="bg-brand-blue/90 rounded-2xl p-4 flex items-center justify-between text-white shadow-xl shadow-brand-blue/20 overflow-hidden relative group">
                        <div className="relative z-10 font-black text-xl italic tracking-widest uppercase opacity-70">
                            Safe Gateway
                        </div>
                        <div className="relative z-10 flex flex-col items-end">
                            <span className="text-[10px] font-bold uppercase tracking-tighter opacity-80">Processed</span>
                            <span className="text-2xl font-black">{filteredTransactions.length} Records</span>
                        </div>
                        <CreditCard size={80} className="absolute -left-4 -bottom-4 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                </div>

                {/* Main Table Container */}
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm shadow-slate-200/50">
                    <div className="overflow-x-auto overflow-y-hidden custom-scrollbar">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-100 italic font-black text-xs uppercase tracking-tighter text-slate-400">
                                    <th className="px-6 py-5 text-left font-black tracking-widest uppercase">Transaction Info</th>
                                    <th className="px-6 py-5 text-left font-black tracking-widest uppercase">Member Details</th>
                                    <th className="px-6 py-5 text-left font-black tracking-widest uppercase">Type</th>
                                    <th className="px-6 py-5 text-left font-black tracking-widest uppercase font-mono italic">Amount</th>
                                    <th className="px-6 py-5 text-left font-black tracking-widest uppercase">Processor ID</th>
                                    <th className="px-6 py-5 text-left font-black tracking-widest uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="py-20">
                                            <div className="flex flex-col items-center justify-center gap-4">
                                                <Loader2 className="animate-spin text-brand-blue" size={40} strokeWidth={3} />
                                                <p className="text-slate-400 font-black uppercase tracking-[0.2em] animate-pulse">Retrieving Ledger...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredTransactions.length > 0 ? (
                                    filteredTransactions.map((t) => (
                                        <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group cursor-default">
                                            <td className="px-6 py-6">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs font-mono font-bold text-slate-400">ID: {t.id.substring(0, 10)}...</span>
                                                    <div className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                                                        <Calendar size={14} className="text-slate-400" />
                                                        {t.createdAt?.toDate ? t.createdAt.toDate().toLocaleDateString() : 'N/A'} 
                                                        <span className="text-[10px] text-slate-400 font-medium">{t.createdAt?.toDate ? t.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 font-bold truncate">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-brand-blue-dark font-black text-xs shadow-inner">
                                                        {t.userName ? t.userName.substring(0, 2).toUpperCase() : '??'}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-slate-800 font-black text-sm uppercase tracking-tight truncate max-w-[150px]">{t.userName || 'Unknown Member'}</span>
                                                        <span className="text-xs text-slate-400 font-medium -mt-1 truncate max-w-[150px]">{t.userEmail || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 font-bold truncate uppercase tracking-tighter">
                                                <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black border uppercase tracking-wider flex items-center gap-1.5 w-fit ${
                                                    t.type === 'topup' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                                    t.type === 'order' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                    'bg-blue-50 text-blue-600 border-blue-100'
                                                }`}>
                                                    {t.type === 'topup' ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}
                                                    {t.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-6">
                                                <span className={`text-lg font-black italic tracking-tight font-mono ${t.type === 'topup' ? 'text-emerald-600' : 'text-slate-900'}`}>
                                                    {t.type === 'topup' ? '+' : '-'}₹{(t.amount || 0).toLocaleString('en-IN')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.paymentMethod}</span>
                                                    <span className="text-xs font-mono font-bold text-slate-600 truncate max-w-[120px]" title={t.razorpayPaymentId}>
                                                        {t.razorpayPaymentId || 'N/A'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-widest text shadow-sm ${
                                                    t.status === 'success' || t.status === 'Success' ? 'bg-brand-blue text-white border-brand-blue' :
                                                    'bg-slate-100 text-slate-500 border-slate-200'
                                                }`}>
                                                    {t.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-20 text-center">
                                            <p className="text-slate-400 font-black uppercase tracking-[0.2em]">No financial logs recorded yet.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
