"use client";

import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {
    ShoppingCart, Search, Filter, Eye,
    MoreHorizontal, CheckCircle2, Truck,
    Clock, XCircle, ChevronDown, Package,
    User, Mail, Phone, MapPin, Hash, ArrowUpRight
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs, doc, updateDoc, Timestamp, deleteDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import Button from "@/components/ui/button";

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
    paymentMethod: string;
    createdAt: any;
    shippingAddress: {
        address: string;
        city: string;
        state: string;
        zip: string;
    };
    contact: {
        name: string;
        email: string;
        phone: string;
    };
    trackingId?: string;
    trackingLink?: string;
    adminMessage?: string;
    messageUpdatedAt?: number;
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [filterStatus, setFilterStatus] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [trackingId, setTrackingId] = useState("");
    const [trackingLink, setTrackingLink] = useState("");
    const [adminMessage, setAdminMessage] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        if (selectedOrder) {
            setTrackingId(selectedOrder.trackingId || "");
            setTrackingLink(selectedOrder.trackingLink || "");
            setAdminMessage(selectedOrder.adminMessage || "");
        }
    }, [selectedOrder]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const orderData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Order[];
            setOrders(orderData);
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        setIsUpdating(true);
        try {
            const orderRef = doc(db, "orders", orderId);
            await updateDoc(orderRef, { status: newStatus });

            // Update local state
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            if (selectedOrder?.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }

            toast.success(`Order status updated to ${newStatus}`);
        } catch (error) {
            toast.error("Failed to update status");
        } finally {
            setIsUpdating(false);
        }
    };

    const updateTrackingInfo = async () => {
        if (!selectedOrder) return;
        setIsUpdating(true);
        try {
            const orderRef = doc(db, "orders", selectedOrder.id);
            const updateData = {
                trackingId: trackingId.trim(),
                trackingLink: trackingLink.trim(),
                adminMessage: adminMessage.trim(),
                messageUpdatedAt: Date.now()
            };
            await updateDoc(orderRef, updateData);

            // Update local state
            setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, ...updateData } : o));
            setSelectedOrder({ ...selectedOrder, ...updateData });

            toast.success("Shipping information updated");
        } catch (error) {
            toast.error("Failed to update shipping info");
        } finally {
            setIsUpdating(false);
        }
    };

    const deleteOrder = async (orderId: string) => {
        if (!window.confirm("Are you sure you want to delete this order? This cannot be undone.")) return;

        try {
            await deleteDoc(doc(db, "orders", orderId));
            setOrders(orders.filter(o => o.id !== orderId));
            setSelectedOrder(null);
            toast.success("Order deleted successfully");
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp) return 'No Date';
        const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
        return new Intl.DateTimeFormat('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const getStatusStyles = (status: string) => {
        switch (status.toLowerCase()) {
            case 'delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'processing': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'shipped': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
            case 'out for delivery': return 'bg-orange-50 text-orange-600 border-orange-100';
            case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    const filteredOrders = orders.filter(o => {
        const matchesStatus = filterStatus === "All" || o.status === filterStatus;
        const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.contact.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <ProtectedRoute allowedRole="admin">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-brand-blue/10 rounded-lg">
                                <ShoppingCart className="text-brand-blue w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Order Management</h2>
                        </div>
                        <p className="text-slate-500 font-medium ml-11">Manage customer fulfillment and update delivery status.</p>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by Order ID, Name or Email..."
                            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-blue outline-none transition-all text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <Filter className="text-slate-400 mr-2" size={18} />
                        {["All", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${filterStatus === status ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Orders List Table */}
                    <div className="lg:col-span-1 space-y-2">
                        {loading ? (
                            <div className="bg-white rounded-lg p-20 flex flex-col items-center justify-center border border-slate-100 shadow-sm">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-blue mb-4"></div>
                                <p className="font-bold text-slate-400 italic">Syncing with orders collection...</p>
                            </div>
                        ) : filteredOrders.length === 0 ? (
                            <div className="bg-white rounded-lg p-20 flex flex-col items-center justify-center border border-slate-100 text-center shadow-sm">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                    <Package className="text-slate-200" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 uppercase">No Orders Found</h3>
                                <p className="text-slate-500 max-w-xs mt-2 font-medium">Try adjusting your filters or search terms.</p>
                            </div>
                        ) : (
                            filteredOrders.map(order => (
                                <div
                                    key={order.id}
                                    className={`bg-white rounded-lg border transition-all cursor-pointer p-4 group ${selectedOrder?.id === order.id ? 'border-brand-blue ring-1 ring-brand-blue/10 bg-brand-blue/[0.02]' : 'border-slate-100 hover:border-slate-300 shadow-sm'}`}
                                    onClick={() => setSelectedOrder(order)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                                                <User className="text-slate-400" size={20} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-slate-900">{order.contact.name}</span>
                                                    <span className="text-[10px] text-slate-400 font-black uppercase">#{order.id.slice(-6)}</span>
                                                </div>
                                                <p className="text-xs text-slate-500 font-medium">{formatDate(order.createdAt)}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-brand-blue tracking-tighter">₹{order.total.toLocaleString('en-IN')}</p>
                                            <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-widest mt-1 ${getStatusStyles(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Order Details Panel */}
                    <div className="lg:col-span-2 space-y-6">
                        {selectedOrder ? (
                            <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden animate-in slide-in-from-right-4 duration-500 h-fit sticky top-6">
                                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Order Detail View</h3>
                                    <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-900 transition-colors">
                                        <XCircle size={20} />
                                    </button>
                                </div>

                                <div className="p-6 space-y-8">
                                    {/* Action Header */}
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2">
                                            Update Fulfillment Status
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {["Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"].map(s => (
                                                <button
                                                    key={s}
                                                    disabled={isUpdating}
                                                    onClick={() => updateOrderStatus(selectedOrder.id, s)}
                                                    className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${selectedOrder.status === s ? getStatusStyles(s) + ' shadow-sm' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-800 hover:text-slate-800'}`}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Tracking Info */}
                                    <div className="space-y-4 pt-4 border-t border-slate-100">
                                        <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2">
                                            Shipping & Messages
                                        </label>
                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                placeholder="Tracking ID (e.g. DHL123456)"
                                                className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-blue outline-none transition-all text-sm"
                                                value={trackingId}
                                                onChange={(e) => setTrackingId(e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Tracking Link (URL)"
                                                className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-blue outline-none transition-all text-sm"
                                                value={trackingLink}
                                                onChange={(e) => setTrackingLink(e.target.value)}
                                            />
                                            <textarea
                                                placeholder="Message to user..."
                                                rows={2}
                                                className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-blue outline-none transition-all text-sm resize-none"
                                                value={adminMessage}
                                                onChange={(e) => setAdminMessage(e.target.value)}
                                            />
                                            <Button 
                                                variant="orange"
                                                size="sm"
                                                onClick={updateTrackingInfo}
                                                disabled={isUpdating}
                                            >
                                                {isUpdating ? "Updating..." : "Send to User"}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Customer Brief */}
                                    <div className="bg-slate-50 rounded-xl p-5 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <Mail className="text-slate-300" size={16} />
                                            <span className="text-xs font-bold text-slate-600 line-clamp-1">{selectedOrder.contact.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Phone className="text-slate-300" size={16} />
                                            <span className="text-xs font-bold text-slate-600">{selectedOrder.contact.phone}</span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <MapPin className="text-slate-300 mt-1" size={16} />
                                            <p className="text-xs font-medium text-slate-500 italic leading-relaxed">
                                                {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.zip}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Items List */}
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-between">
                                            Items Summary <span>{selectedOrder.items.length} Units</span>
                                        </h4>
                                        <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
                                            {selectedOrder.items.map((item, idx) => (
                                                <div key={idx} className="flex gap-4 p-3 bg-white border border-slate-100 rounded-xl">
                                                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                        <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                                                        <p className="text-[10px] font-black text-brand-blue">₹{item.price.toLocaleString('en-IN')} x {item.quantity}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Total Footer */}
                                    <div className="pt-6 border-t border-slate-100">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase">Payment Method</p>
                                                <p className="text-xs font-bold text-slate-900 uppercase">{selectedOrder.paymentMethod}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-slate-400 uppercase">Grand Total</p>
                                                <p className="text-2xl font-black text-brand-blue tracking-tighter">₹{selectedOrder.total.toLocaleString('en-IN')}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <Button variant="secondary" size="sm" icon={<Hash size={14} />}>
                                                Print Invoice
                                            </Button>
                                            <button
                                                onClick={() => deleteOrder(selectedOrder.id)}
                                                className="p-2.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors border border-red-100"
                                            >
                                                <XCircle size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-10 flex flex-col items-center justify-center text-center h-[500px]">
                                <Eye className="text-slate-300 mb-4" size={40} />
                                <h4 className="text-lg font-bold text-slate-600">No Detail Selected</h4>
                                <p className="text-sm text-slate-400 max-w-[200px] mt-2">Pick an order from the list to see and manage its details.</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </ProtectedRoute>
    );
}
