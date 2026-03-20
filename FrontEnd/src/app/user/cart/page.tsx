"use client";

import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useCartStore } from "@/store/cartStore";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/button";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import toast from "react-hot-toast";

export default function CartPage() {
    const { items, removeItem, updateQuantity, getTotalPrice, getItemCount } = useCartStore();
    const [hasHydrated, setHasHydrated] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    useEffect(() => {
        setHasHydrated(true);
    }, []);

    if (!hasHydrated) {
        return (
            <ProtectedRoute allowedRole="user">
                <div className="min-h-screen pt-24 md:pt-32 pb-12 bg-slate-50 flex items-center justify-center">
                    <div className="animate-spin rounded-xl h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
                </div>
            </ProtectedRoute>
        );
    }

    const subtotal = getTotalPrice();

    return (
        <ProtectedRoute allowedRole="user">
            <div className="min-h-screen pt-24 md:pt-32 pb-12 md:pb-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl md:text-3xl font-black text-brand-blue-dark mb-8 flex items-center gap-3">
                        <ShoppingBag className="text-brand-orange" size={28} />
                        My Shopping Cart
                    </h1>

                    {items.length === 0 ? (
                        <div className="bg-white rounded-xl p-12 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                <ShoppingBag size={40} className="text-slate-300" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
                            <p className="text-slate-500 mb-8 max-w-sm">Looks like you haven't added any premium drone products to your cart yet.</p>
                            <Link href="/products">
                                <Button>Start Shopping</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Cart Items List */}
                            <div className="flex-1 space-y-4">
                                {items.map((item) => (
                                    <div key={item.id} className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-6 group hover:border-brand-blue/20 transition-colors">
                                        <div className="w-24 h-36 md:w-28 md:h-36 rounded-lg bg-slate-50 overflow-hidden flex-shrink-0 relative">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <Link href={`/products/${item.id}`} className="hover:text-brand-orange transition-colors">
                                                <h3 className="text-lg font-bold text-slate-900 truncate mb-1">{item.name}</h3>
                                            </Link>
                                            <div className="text-brand-blue font-black text-xl mb-4">
                                                ₹{Number(item.price).toLocaleString('en-IN')}
                                            </div>
                                            
                                            <div className="flex items-center gap-6">
                                                {/* Quantity Control */}
                                                <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                                                    <button 
                                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-slate-500 hover:text-brand-blue hover:shadow-sm transition-all shadow-sm"
                                                    >
                                                        <Minus size={14} strokeWidth={3} />
                                                    </button>
                                                    <span className="w-8 text-center font-bold text-sm text-slate-700">{item.quantity}</span>
                                                    <button 
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-slate-500 hover:text-brand-blue hover:shadow-sm transition-all shadow-sm"
                                                    >
                                                        <Plus size={14} strokeWidth={3} />
                                                    </button>
                                                </div>
                                                
                                                {/* Remove Button */}
                                                <button 
                                                    onClick={() => setItemToDelete(item.id)}
                                                    className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                                    title="Remove item"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="hidden sm:block text-right self-start">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total</p>
                                            <p className="text-xl font-black text-slate-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="w-full lg:w-[400px]">
                                <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm border border-slate-100 sticky top-32">
                                    <h3 className="text-xl font-black text-slate-900 mb-6">Order Summary</h3>
                                    
                                    <div className="space-y-4 mb-6">
                                        {/* Individual Items Breakdown */}
                                        <div className="space-y-3 pb-4 border-b border-slate-100">
                                            {items.map((item) => (
                                                <div key={`summary-${item.id}`} className="flex items-start justify-between text-sm">
                                                    <span className="text-slate-600 flex-1 pr-4 line-clamp-2">
                                                        {item.name} <span className="text-black-400 whitespace-nowrap ml-1">x {item.quantity}</span>
                                                    </span>
                                                    <span className="font-bold text-slate-900 whitespace-nowrap">
                                                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        {/* Subtotals */}
                                        <div className="flex items-center justify-between text-slate-600 pt-2">
                                            <span>Subtotal ({getItemCount()} items)</span>
                                            <span className="font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-slate-600">
                                            <span>Shipping estimate</span>
                                            <span className="font-bold text-emerald-500">Free</span>
                                        </div>
                                    </div>
                                    
                                    <div className="border-t border-slate-100 pt-6 mb-8">
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-bold text-slate-900">Total</span>
                                            <span className="text-2xl font-black text-brand-blue-dark">₹{subtotal.toLocaleString('en-IN')}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-2">Includes all taxes and duties</p>
                                    </div>
                                    
                                    <Button fullWidth icon={<ArrowRight size={20} />} className="py-4 text-base">
                                        Proceed to Checkout
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                onConfirm={() => {
                    if (itemToDelete) {
                        removeItem(itemToDelete);
                        setItemToDelete(null);
                        toast.success("Item removed from cart");
                    }
                }}
                title="Remove Item?"
                message="Are you sure you want to remove this item from your cart? You can always add it back later."
                confirmText="Yes, Remove it"
                cancelText="Keep Item"
                type="danger"
            />
        </ProtectedRoute>
    );
}
