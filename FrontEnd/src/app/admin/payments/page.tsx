"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Calendar, ArrowUpRight, ArrowDownLeft, Filter, RefreshCw, Loader2, ChevronDown } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminHeader from "@/components/ui/AdminHeader";

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
    createdAt: { toDate?: () => Date } | null; // Simplfied for the way it's used here; could be Timestamp | Date | etc.
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
                <AdminHeader 
                    title="Payment History"
                    description="Monitor wallet top-ups and financial records"
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    searchPlaceholder="Search by name, email or ID..."
                    actionButton={
                        <button 
                            onClick={fetchTransactions}
                            className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-600 shadow-sm"
                            title="Refresh Data"
                        >
                            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                        </button>
                    }
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
    
    {/* Filter */}
    <div className="relative group">
        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer" size={20} />
        <select 
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl 
                       outline-none focus:border-brand-blue transition-all 
                       font-semibold text-slate-700 shadow-sm appearance-none cursor-pointer h-full"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
        >
            <option value="all">All Types</option>
            <option value="topup">Wallet Top-up</option>
            <option value="order">Order Payment</option>
            <option value="refund">Refunds</option>
        </select>
    </div>
    {/* Total Revenue */}
    <div className="bg-green-900/90 rounded-xl flex items-center justify-between 
                    text-white shadow-lg px-5 py-4">
        <div className="font-bold text-lg tracking-wide uppercase opacity-80">
            Total Revenue
        </div>
        <div className="flex flex-col items-end">
            <span className="text-xs font-semibold uppercase opacity-70">
                Processed
            </span>
            <span className="text-xl font-bold">
                {filteredTransactions.reduce((acc, t) => acc + t.amount, 0).toFixed(2)}
            </span>
        </div>
    </div>

    {/* Safe Gateway Card */}
    <div className="bg-brand-blue/90 rounded-xl flex items-center justify-between 
                    text-white shadow-lg px-5 py-4 h-full">
        
        <div className="font-bold text-lg tracking-wide uppercase opacity-80">
            Safe Gateway
        </div>

        <div className="flex flex-col items-end">
            <span className="text-xs font-semibold uppercase opacity-70">
                Processed
            </span>
            <span className="text-xl font-bold">
                {filteredTransactions.length} Records
            </span>
        </div>
    </div>

</div>

                {/* Main Table Container */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm shadow-slate-200/50">
                    <div className="overflow-x-auto overflow-y-hidden custom-scrollbar">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-100 font-black text-sm uppercase tracking-tighter text-slate-400">
                                    <th className="px-6 py-5 text-left font-black tracking-widest uppercase">Transaction Info</th>
                                    <th className="px-6 py-5 text-left font-black tracking-widest uppercase">Member Details</th>
                                    <th className="px-6 py-5 text-left font-black tracking-widest uppercase">Type</th>
                                    <th className="px-6 py-5 text-left font-black tracking-widest uppercase">Amount</th>
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
                                                    {t.type === 'order' || t.type === 'topup' ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}
                                                    {t.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-6">
                                                <span className={`text-lg font-black tracking-tight font-mono ${t.type === 'topup' ? 'text-emerald-600' : 'text-slate-900'}`}>
                                                    {t.type === 'order' || t.type === 'topup' ? '+' : '-'}₹{(t.amount || 0).toLocaleString('en-IN')}
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
                                                    t.status === 'success' || t.status === 'Success' ? 'bg-green-600 text-white border-green-600' :
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
