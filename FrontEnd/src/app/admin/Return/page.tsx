"use client";

import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Search, Filter, Eye, RotateCcw, Package, Clock, AlertCircle, CheckCircle2, XCircle} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, updateDoc, Timestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import Button from "@/components/ui/button";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface Order {
    id: string;
    userId: string;
    items: OrderItem[];
    total: number;
    status: string;
    createdAt: Timestamp | string | number | Date | null;
    deliveredAt?: number;
    returnReason?: string;
    returnComment?: string;
    contact: {
        name: string;
        email: string;
        phone: string;
    };
}

export default function AdminReturnPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [filterType, setFilterType] = useState<"all" | "returnable" | "returned">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

    const RETURN_WINDOW_MS = 5 * 24 * 60 * 60 * 1000;

    useEffect(() => {
        fetchDeliveredOrders();
    }, []);

    const fetchDeliveredOrders = async () => {
        setLoading(true);
        try {
            // Fetch all orders that are either Delivered or Returned
            const q = query(
                collection(db, "orders"),
                where("status", "in", ["Delivered", "delivered", "Returned", "Return Requested"])
            );
            const querySnapshot = await getDocs(q);
            const orderData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Order[];
            
            // Sort in memory to avoid Firestore index requirement
            orderData.sort((a, b) => {
                const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toMillis() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
                const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toMillis() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
                return dateB - dateA;
            });

            setOrders(orderData);
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const handleReturnOrder = async () => {
        if (!selectedOrder) return;
        setIsUpdating(true);
        try {
            const orderRef = doc(db, "orders", selectedOrder.id);
            await updateDoc(orderRef, { 
                status: "Returned",
                returnedAt: Date.now()
            });

            setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, status: "Returned" } : o));
            setSelectedOrder({ ...selectedOrder, status: "Returned" });
            toast.success("Order marked as Returned");
        } catch {
            toast.error("Failed to process return");
        } finally {
            setIsUpdating(false);
            setIsReturnModalOpen(false);
        }
    };

    const getDaysRemaining = (deliveredAt?: number) => {
        if (!deliveredAt) return 0;
        const now = Date.now();
        const diff = deliveredAt + RETURN_WINDOW_MS - now;
        return Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)));
    };

    const isWithinReturnWindow = (deliveredAt?: number) => {
        if (!deliveredAt) return false;
        const now = Date.now();
        return now - deliveredAt <= RETURN_WINDOW_MS;
    };

    const formatDate = (timestamp: Timestamp | string | number | Date | null) => {
        if (!timestamp) return 'N/A';
        const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
        return new Intl.DateTimeFormat('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).format(date);
    };

    const filteredOrders = orders.filter(o => {
        const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.contact.name.toLowerCase().includes(searchQuery.toLowerCase());
        
        const isCurrentlyReturned = o.status === "Returned" || o.status === "Return Requested";
        const isReturnable = (o.status.toLowerCase() === "delivered") && isWithinReturnWindow(o.deliveredAt);

        if (filterType === "returnable") return isReturnable && matchesSearch;
        if (filterType === "returned") return isCurrentlyReturned && matchesSearch;
        return matchesSearch;
    });

    return (
        <ProtectedRoute allowedRole="admin">
            <div className="pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Return Management</h2>
                        <p className="text-slate-500 font-medium">Manage product returns within the 5-day eligibility window.</p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by Order ID or Name..."
                            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-blue outline-none transition-all text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="text-slate-400 mr-2" size={18} />
                        {(["all", "returnable", "returned"] as const).map(type => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${filterType === type ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-3">
                        {loading ? (
                            <div className="p-10 text-center italic text-slate-400">Loading orders...</div>
                        ) : filteredOrders.length === 0 ? (
                            <div className="p-10 text-center bg-white rounded-xl border border-dashed border-slate-200 text-slate-400">
                                No matching orders found.
                            </div>
                        ) : (
                            filteredOrders.map(order => {
                                const daysLeft = getDaysRemaining(order.deliveredAt);
                                const isReturnable = (order.status.toLowerCase() === "delivered") && isWithinReturnWindow(order.deliveredAt);
                                
                                return (
                                    <div
                                        key={order.id}
                                        className={`p-4 bg-white rounded-xl border transition-all cursor-pointer group ${selectedOrder?.id === order.id ? 'border-brand-blue ring-1 ring-brand-blue/10' : 'border-slate-100 hover:border-slate-300 shadow-sm'}`}
                                        onClick={() => setSelectedOrder(order)}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-bold text-slate-900">{order.contact.name}</p>
                                                <p className="text-[10px] text-slate-400 font-black uppercase">#{order.id.slice(-6)}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                                    order.status === "Returned" ? "bg-red-50 text-red-600" :
                                                    order.status === "Return Requested" ? "bg-orange-50 text-orange-600" :
                                                    "bg-emerald-50 text-emerald-600"
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                        {order.status.toLowerCase() === "delivered" && (
                                            <div className="mt-3 flex items-center gap-2">
                                                <Clock size={12} className={isReturnable ? "text-brand-blue" : "text-slate-300"} />
                                                <span className={`text-[10px] font-bold ${isReturnable ? "text-slate-600" : "text-slate-400"}`}>
                                                    {isReturnable ? `${daysLeft} days remaining to return` : "Return window closed"}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <div className="lg:col-span-2">
                        {selectedOrder ? (
                            <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden h-fit transition-all duration-300">
                                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Return Detail View</h3>
                                    <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-900 transition-colors">
                                        <XCircle size={20} />
                                    </button>
                                </div>

                                <div className="p-8 space-y-8">
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Order Information</label>
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-slate-900">{selectedOrder.contact.name}</p>
                                                <p className="text-xs text-slate-500 font-medium">{selectedOrder.contact.email}</p>
                                                <p className="text-xs text-slate-500 font-medium">{selectedOrder.contact.phone}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4 text-right">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Financials</label>
                                            <div className="space-y-1">
                                                <p className="text-xl font-black text-brand-blue tracking-tighter">₹{selectedOrder.total.toLocaleString('en-IN')}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Total Amount</p>
                                            </div>
                                        </div>
                                    </div>

                                    {(selectedOrder.returnReason || selectedOrder.returnComment) && (
                                        <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100 space-y-3">
                                            <p className="text-[10px] font-black uppercase text-orange-600 tracking-widest flex items-center gap-2">
                                                <AlertCircle size={14} /> User Return Reason
                                            </p>
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-slate-900">{selectedOrder.returnReason}</p>
                                                {selectedOrder.returnComment && (
                                                    <p className="text-xs text-slate-500 font-medium italic">&quot;{selectedOrder.returnComment}&quot;</p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-brand-blue">
                                                <Package size={24} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black uppercase text-slate-400 tracking-wider">Delivery Date</p>
                                                <p className="text-sm font-bold text-slate-900">{formatDate(selectedOrder.deliveredAt || selectedOrder.createdAt)}</p>
                                            </div>
                                        </div>
                                        {selectedOrder.status.toLowerCase() === "delivered" && (
                                            <div className="text-right">
                                                {isWithinReturnWindow(selectedOrder.deliveredAt) ? (
                                                    <div className="space-y-1">
                                                        <p className="text-xs font-black text-emerald-600 uppercase">Eligible for Return</p>
                                                        <p className="text-[10px] text-slate-500 font-medium">{getDaysRemaining(selectedOrder.deliveredAt)} days left in window</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-1">
                                                        <p className="text-xs font-black text-red-500 uppercase">Non-Returnable</p>
                                                        <p className="text-[10px] text-slate-500 font-medium tracking-tight">Window closed after 5 days</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>


                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Items to return</label>
                                        <div className="space-y-3">
                                            {selectedOrder.items.map((item, idx) => (
                                                <div key={idx} className="flex gap-4 p-3 bg-white border border-slate-100 rounded-xl">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                        <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                                                        <p className="text-[10px] font-black text-brand-blue">₹{item.price.toLocaleString('en-IN')} x {item.quantity}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-slate-100">
                                        {selectedOrder.status === "Returned" ? (
                                            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-4">
                                                <CheckCircle2 size={24} className="text-emerald-500" />
                                                <div>
                                                    <p className="text-sm font-bold text-emerald-900 uppercase tracking-tight">Order Returned Successfully</p>
                                                    <p className="text-xs text-emerald-600 font-medium">This order has been processed and returned to inventory.</p>
                                                </div>
                                            </div>
                                        ) : selectedOrder.status === "Return Requested" || (selectedOrder.status.toLowerCase() === "delivered" && isWithinReturnWindow(selectedOrder.deliveredAt)) ? (
                                            <div className="flex flex-col gap-4">
                                                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-4">
                                                    <AlertCircle size={24} className="text-amber-500" />
                                                    <div>
                                                        <p className="text-sm font-bold text-amber-900 uppercase">Pending Return Action</p>
                                                        <p className="text-xs text-amber-600 font-medium">Verify product condition before finalizing the return.</p>
                                                    </div>
                                                </div>
                                                <Button 
                                                    variant="orange" 
                                                    size="sm"
                                                    className="w-fit"
                                                    icon={<RotateCcw size={18} />}

                                                    onClick={() => setIsReturnModalOpen(true)}
                                                    loading={isUpdating}
                                                    disabled={isUpdating}
                                                >
                                                    Process Full Return
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-4">
                                                <AlertCircle size={24} className="text-slate-400" />
                                                <div>
                                                    <p className="text-sm font-bold text-slate-600 uppercase">Return Window Closed</p>
                                                    <p className="text-xs text-slate-400 font-medium">Standard 5-day return policy has expired for this order.</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-10 flex flex-col items-center justify-center text-center h-[400px]">
                                <Eye className="text-slate-300 mb-4" size={40} />
                                <h4 className="text-lg font-bold text-slate-600 uppercase tracking-tighter">No Selection</h4>
                                <p className="text-sm text-slate-400 max-w-[200px] mt-2">Pick an order to manage its return status.</p>
                            </div>
                        )}
                    </div>
                </div>

                <ConfirmationModal
                    isOpen={isReturnModalOpen}
                    onClose={() => setIsReturnModalOpen(false)}
                    onConfirm={handleReturnOrder}
                    title="Process Return"
                    message="Are you sure you want to mark this order as Returned? This will update the order status and finalize the return process."
                    confirmText="Process Return"
                    type="warning"
                    isLoading={isUpdating}
                />
            </div>
        </ProtectedRoute>
    );
}
