"use client";

import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { 
    ShoppingBag, Package, Truck, CheckCircle2, 
    XCircle, Clock, ChevronRight, MapPin, 
    CreditCard, Calendar, Hash, ArrowLeft,
    ChevronDown, ChevronUp, ExternalLink
} from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, getDocs, Timestamp, doc, updateDoc, increment } from "firebase/firestore";
import { useAuthStore } from "@/store/authStore";
import Button from "@/components/ui/button";
import toast from "react-hot-toast";
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
    items: OrderItem[];
    total: number;
    subtotal: number;
    shipping: number;
    status: string;
    paymentMethod: string;
    createdAt: any;
    shippingAddress: {
        address: string;
        city: string;
        state: string;
        zip: string;
        type: string;
    };
    contact: {
        name: string;
        email: string;
        phone: string;
    };
}

export default function OrdersPage() {
    const { user } = useAuthStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
    const [isCancelling, setIsCancelling] = useState(false);
    const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user?.id) return;

            try {
                console.log("Fetching orders for user ID:", user.id);
                // Simplified query to avoid composite index requirements
                const q = query(
                    collection(db, "orders"),
                    where("userId", "==", user.id)
                );
                
                const querySnapshot = await getDocs(q);
                console.log("Found orders count:", querySnapshot.size);
                
                const orderData = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    console.log("Order data:", doc.id, data);
                    return {
                        id: doc.id,
                        ...data
                    };
                }) as Order[];
                
                // Sort in memory instead
                orderData.sort((a, b) => {
                    const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toMillis() : new Date(a.createdAt).getTime();
                    const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toMillis() : new Date(b.createdAt).getTime();
                    return dateB - dateA;
                });
                
                setOrders(orderData);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    const getStatusStyles = (status: string) => {
        switch (status.toLowerCase()) {
            case 'delivered':
                return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', icon: CheckCircle2 };
            case 'processing':
                return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', icon: Clock };
            case 'shipped':
                return { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', icon: Truck };
            case 'cancelled':
                return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100', icon: XCircle };
            default:
                return { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-100', icon: Package };
        }
    };

    const toggleExpand = (orderId: string) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    const handleCancelOrder = async () => {
        if (!cancelOrderId || !user?.id) return;
        
        const orderToCancel = orders.find(o => o.id === cancelOrderId);
        if (!orderToCancel || orderToCancel.status.toLowerCase() !== 'processing') {
            toast.error("This order cannot be cancelled.");
            setCancelOrderId(null);
            return;
        }

        setIsCancelling(true);
        try {
            const orderRef = doc(db, "orders", cancelOrderId);
            
            // 1. Update order status
            await updateDoc(orderRef, { status: "Cancelled" });
            
            // 2. If paid via wallet, refund the money
            if (orderToCancel.paymentMethod.toLowerCase() === 'wallet') {
                const userRef = doc(db, "users", user.id);
                await updateDoc(userRef, {
                    walletBalance: increment(orderToCancel.total)
                });
                toast.success("Order cancelled and amount refunded to wallet!");
            } else {
                toast.success("Order cancelled successfully.");
            }

            // 3. Update local state
            setOrders(orders.map(o => o.id === cancelOrderId ? { ...o, status: "Cancelled" } : o));
            
        } catch (error) {
            console.error("Cancel failed:", error);
            toast.error("Failed to cancel order. Please try again.");
        } finally {
            setIsCancelling(false);
            setCancelOrderId(null);
        }
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp) return 'Date not available';
        const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
        return new Intl.DateTimeFormat('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).format(date);
    };

    return (
        <ProtectedRoute allowedRole="user">
            <div className="min-h-screen bg-slate-50 pt-24 md:pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Page Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                <ShoppingBag className="text-brand-blue" size={32} />
                                My Orders
                            </h1>
                            <p className="text-slate-500 font-medium ml-1">Track and manage your premium drone purchases.</p>
                        </div>
                        <Link href="/products">
                            <Button variant="secondary" size="sm" icon={<ChevronRight size={16} />}>
                                Continue Shopping
                            </Button>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
                            <p className="text-slate-500 font-bold animate-pulse">Retrieving your orders...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                <ShoppingBag className="text-slate-200 w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">No Orders Yet</h2>
                            <p className="text-slate-500 max-w-sm mb-8">It looks like you haven't placed any orders yet. Explore our featured drones and accessories!</p>
                            <Link href="/products">
                                <Button variant="orange" size="lg">Start Shopping</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order) => {
                                const styles = getStatusStyles(order.status);
                                const isExpanded = expandedOrderId === order.id;

                                return (
                                    <div key={order.id} className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-brand-blue shadow-lg ring-1 ring-brand-blue/10' : 'border-slate-200 hover:border-slate-300 shadow-sm'}`}>
                                        {/* Order Item Header (Collapsible trigger) */}
                                        <div className="p-6 md:p-8 cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-6" onClick={() => toggleExpand(order.id)}>
                                            <div className="flex items-center gap-4">
                                                <div className={`p-4 rounded-xl ${styles.bg} ${styles.text}`}>
                                                    <styles.icon size={28} />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Order ID: #{order.id.slice(-6).toUpperCase()}</span>
                                                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-tighter border ${styles.bg} ${styles.text} ${styles.border}`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-lg font-bold text-slate-800 line-clamp-1">
                                                        {order.items[0]?.name || "Product"}
                                                        {order.items.length > 1 && (
                                                            <span className="text-slate-400 font-medium text-sm ml-2">
                                                                (+{order.items.length - 1} more)
                                                            </span>
                                                        )}
                                                        <span className="mx-2 text-slate-300">|</span>
                                                        <span className="text-brand-blue">₹{order.total.toLocaleString('en-IN')}</span>
                                                    </h3>
                                                    <p className="text-sm text-slate-500 font-medium">Placed on {formatDate(order.createdAt)}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 w-full md:w-auto self-end md:self-center">
                                                <div className="flex -space-x-3 overflow-hidden">
                                                    {order.items.slice(0, 3).map((item, i) => (
                                                        <img 
                                                            key={i} 
                                                            src={item.image} 
                                                            alt={item.name} 
                                                            className="inline-block h-12 w-12 rounded-lg ring-2 ring-white object-cover bg-slate-50"
                                                        />
                                                    ))}
                                                    {order.items.length > 3 && (
                                                        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-slate-100 text-slate-500 ring-2 ring-white text-xs font-bold">
                                                            +{order.items.length - 3}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-2">
                                                    {isExpanded ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expanded Full Details */}
                                        {isExpanded && (
                                            <div className="border-t border-slate-100 bg-slate-50/50 animate-in slide-in-from-top-2 duration-300">
                                                <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
                                                    
                                                    {/* Items Column */}
                                                    <div className="lg:col-span-2 space-y-6">
                                                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                                            <Package size={16} /> Order Content
                                                        </h4>
                                                        <div className="space-y-4">
                                                            {order.items.map((item, idx) => (
                                                                <div key={idx} className="flex gap-5 bg-white p-4 rounded-lg border border-slate-100 shadow-sm group hover:shadow-md transition-shadow">
                                                                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0 py-1">
                                                                        <div className="flex justify-between items-start">
                                                                            <h5 className="font-bold text-slate-900 line-clamp-1 group-hover:text-brand-blue transition-colors">{item.name}</h5>
                                                                            <span className="font-black text-brand-blue ml-4">₹{item.price.toLocaleString('en-IN')}</span>
                                                                        </div>
                                                                        <p className="text-sm text-slate-500 mt-1">Quantity: <span className="font-bold text-slate-700">{item.quantity}</span></p>
                                                                        <div className="mt-3 flex gap-4">
                                                                            <button className="text-[10px] font-black uppercase tracking-widest text-brand-blue hover:text-brand-orange transition-colors flex items-center gap-1">
                                                                                <ExternalLink size={12} /> Product Specs
                                                                            </button>
                                                                            <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-blue transition-colors flex items-center gap-1">
                                                                                <ShoppingBag size={12} /> Buy Again
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {/* Step Progress Mockup */}
                                                        <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm mt-8">
                                                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Delivery Progress</h4>
                                                            {order.status.toLowerCase() === 'cancelled' ? (
                                                                <div className="flex items-center gap-4 p-4 bg-red-50 border border-red-100 rounded-xl">
                                                                    <XCircle size={24} className="text-red-500" />
                                                                    <div>
                                                                        <p className="text-sm font-bold text-red-900">Order Cancelled</p>
                                                                        <p className="text-xs text-red-600">This order has been cancelled and is no longer being processed.</p>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center relative">
                                                                    <div className="flex-1 flex flex-col items-center text-center gap-2 relative z-10">
                                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${['processing', 'shipped', 'delivered'].includes(order.status.toLowerCase()) ? 'bg-brand-blue text-white shadow-[0_0_10px_rgba(0,75,147,0.3)]' : 'bg-slate-100 text-slate-400'}`}>1</div>
                                                                        <span className="text-[10px] font-black uppercase">Confirmed</span>
                                                                    </div>
                                                                    <div className={`w-full h-1 -mx-2 mb-4 bg-slate-100 overflow-hidden`}>
                                                                        <div className={`h-full bg-brand-blue transition-all duration-1000 ${['shipped', 'delivered'].includes(order.status.toLowerCase()) ? 'w-full' : 'w-0'}`}></div>
                                                                    </div>
                                                                    <div className="flex-1 flex flex-col items-center text-center gap-2 relative z-10">
                                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${['shipped', 'delivered'].includes(order.status.toLowerCase()) ? 'bg-brand-blue text-white shadow-[0_0_10px_rgba(0,75,147,0.3)]' : 'bg-slate-100 text-slate-400'}`}>2</div>
                                                                        <span className="text-[10px] font-black uppercase">Shipped</span>
                                                                    </div>
                                                                    <div className={`w-full h-1 -mx-2 mb-4 bg-slate-100 overflow-hidden`}>
                                                                        <div className={`h-full bg-brand-blue transition-all duration-1000 ${['delivered'].includes(order.status.toLowerCase()) ? 'w-full' : 'w-0'}`}></div>
                                                                    </div>
                                                                    <div className="flex-1 flex flex-col items-center text-center gap-2 relative z-10">
                                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${order.status.toLowerCase() === 'delivered' ? 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-slate-100 text-slate-400'}`}>3</div>
                                                                        <span className="text-[10px] font-black uppercase">Delivered</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Summary Column */}
                                                    <div className="space-y-8">
                                                        <div>
                                                            <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                                                <MapPin size={16} /> Shipping Address
                                                            </h4>
                                                            <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-sm">
                                                                <p className="font-bold text-slate-900 mb-1">{order.contact.name}</p>
                                                                <p className="text-sm text-slate-500 leading-relaxed italic mb-3">{order.shippingAddress.address}</p>
                                                                <p className="text-sm text-slate-700 font-bold">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zip}</p>
                                                                <p className="text-xs text-slate-400 mt-3 font-medium flex items-center gap-2 border-t border-slate-50 pt-3">
                                                                    <Hash size={12} /> {order.contact.phone}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                                                <CreditCard size={16} /> Payment Info
                                                            </h4>
                                                            <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-sm">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Method</span>
                                                                    <span className="text-sm font-black text-slate-900 uppercase">{order.paymentMethod}</span>
                                                                </div>
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Status</span>
                                                                    <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">Paid</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Pricing Breakdown</h4>
                                                            <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm space-y-3">
                                                                <div className="flex justify-between text-sm">
                                                                    <span className="text-slate-500 font-medium">Subtotal</span>
                                                                    <span className="text-slate-900 font-bold">₹{order.subtotal?.toLocaleString('en-IN') || order.total.toLocaleString('en-IN')}</span>
                                                                </div>
                                                                <div className="flex justify-between text-sm">
                                                                    <span className="text-slate-500 font-medium">Shipping Fee</span>
                                                                    <span className="text-emerald-500 font-bold">{order.shipping === 0 ? 'Free' : `₹${order.shipping.toLocaleString('en-IN')}`}</span>
                                                                </div>
                                                                <div className="pt-3 border-t border-slate-100 mt-2 flex justify-between items-center text-lg font-black tracking-tight overflow-hidden">
                                                                    <span className="text-slate-900 text-sm italic opacity-50">Grand Total</span>
                                                                    <span className="text-brand-blue drop-shadow-sm">₹{order.total.toLocaleString('en-IN')}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-3 pt-2">
                                                            <div className="rounded-lg cursor-pointer">
                                                                <Button fullWidth variant="secondary" size="sm" icon={<Calendar size={14} />}>
                                                                    Download Invoice
                                                                </Button>
                                                            </div>
                                                            {order.status.toLowerCase() === 'processing' && (
                                                                <button 
                                                                    onClick={() => setCancelOrderId(order.id)}
                                                                    className="w-full py-2.5 rounded-lg text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 border border-red-100 transition-all flex items-center justify-center gap-2"
                                                                >
                                                                    <XCircle size={14} /> Cancel Order
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <ConfirmationModal 
                    isOpen={!!cancelOrderId}
                    onClose={() => setCancelOrderId(null)}
                    onConfirm={handleCancelOrder}
                    title="Cancel Order"
                    message="Are you sure you want to cancel this order? This action cannot be undone."
                    confirmText="Yes, Cancel Order"
                    type="danger"
                    isLoading={isCancelling}
                />
            </div>
        </ProtectedRoute>
    );
}
