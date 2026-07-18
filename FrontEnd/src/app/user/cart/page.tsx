"use client";

import React, { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/button";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import Pagination from "@/components/ui/Pagination";
import toast from "react-hot-toast";
import dynamic from 'next/dynamic';

const ProductGrid = dynamic(() => import("@/components/products/ProductGrid"), {
    loading: () => <div className="h-64 sm:h-96 animate-pulse bg-slate-50 rounded-xl" />,
    ssr: false
});

export default function CartPage() {
    const { items, removeItem, updateQuantity, getTotalPrice, getItemCount } = useCartStore();
    const [hasHydrated, setHasHydrated] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 6;

    useEffect(() => {
        const timeout = setTimeout(() => setHasHydrated(true), 0);
        return () => clearTimeout(timeout);
    }, []);

    // Pagination calculations
    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

    // Safety clamp for calculation
    const safePage = Math.max(1, Math.min(currentPage, totalPages || 1));

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setTimeout(() => setCurrentPage(totalPages), 0);
        }
    }, [items.length, currentPage, totalPages]);

    const paginatedItems = items.slice(
        (safePage - 1) * ITEMS_PER_PAGE,
        safePage * ITEMS_PER_PAGE
    );

    if (!hasHydrated) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-brand-orange"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-400">ADS</div>
                </div>
            </div>
        );
    }

    const subtotal = getTotalPrice();

    return (
        <>
            <div className="min-h-screen pt-6 md:pt-12 pb-12 md:pb-16 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl md:text-3xl font-black text-brand-blue-dark mb-8 flex items-center gap-3">
                        My Shopping Cart
                    </h1>

                    {items.length === 0 ? (
                        <div className="bg-white rounded-xl p-12 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                <ShoppingBag size={40} className="text-slate-300" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
                            <p className="text-slate-500 mb-8 max-w-sm">Looks like you haven&apos;t added any premium drone products to your cart yet.</p>
                            <Link href="/products">
                                <Button>Start Shopping</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Cart Items Grid/List */}
                            <div className="flex-1">
                                <div className="grid grid-cols-2 md:grid-cols-1 gap-3 sm:gap-4 mb-8">
                                    {paginatedItems.map((item) => (
                                        <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-brand-blue/10 transition-all border border-slate-100 group flex flex-row items-center p-3 md:p-6 gap-3 md:gap-6 relative">
                                            {/* Image Section */}
                                            <div className="w-20 h-24 sm:w-28 sm:h-32 md:w-28 md:h-36 bg-slate-50 relative rounded-lg overflow-hidden flex-shrink-0">
                                                <Link href={`/products/${item.id}`} className="block w-full h-full">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                </Link>
                                            </div>

                                            {/* Info Section */}
                                            <div className="flex flex-col flex-1 py-1 md:p-0 min-w-0">
                                                <div className="flex justify-between items-start gap-2 mb-1">
                                                    <Link href={`/products/${item.id}`} className="block flex-1 min-w-0">
                                                        <h3 className="text-[11px] sm:text-base md:text-lg font-bold text-slate-900 group-hover:text-brand-orange transition-colors duration-300 line-clamp-2 leading-tight">
                                                            {item.name}
                                                        </h3>
                                                    </Link>
                                                    <button
                                                        onClick={() => setItemToDelete(item.id)}
                                                        className="p-1.5 text-slate-300 hover:text-red-500 bg-slate-50 hover:bg-red-50 rounded-md transition-colors md:hidden shrink-0"
                                                        title="Remove from cart"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>

                                                <div className="flex flex-col gap-1.5 md:gap-3 mt-1 md:mt-2">
                                                    <div className="flex flex-wrap items-baseline gap-1.5">
                                                        <span className="font-black text-brand-blue-dark text-sm sm:text-lg">
                                                            <span className="font-sans font-semibold mr-0.5" style={{ fontFamily: 'system-ui, Arial, sans-serif' }}>₹</span>
                                                            {Number(item.price).toLocaleString('en-IN')}
                                                        </span>
                                                        {item.originalPrice && item.originalPrice > item.price && (
                                                            <span className="text-[9px] sm:text-xs text-slate-400 line-through">
                                                                <span className="font-sans font-normal mr-0.5" style={{ fontFamily: 'system-ui, Arial, sans-serif' }}>₹</span>
                                                                {Number(item.originalPrice).toLocaleString('en-IN')}
                                                            </span>
                                                        )}
                                                        {item.offerPercentage !== undefined && item.offerPercentage > 0 && (
                                                            <span className="text-[9px] sm:text-[10px] font-bold text-emerald-600">
                                                                {item.offerPercentage}% Off
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Quantity Control */}
                                                    <div className="flex items-center gap-1 sm:gap-3 bg-slate-50 p-1 rounded-md border border-slate-100 self-start">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                            className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded bg-white text-slate-500 hover:text-brand-blue shadow-sm cursor-pointer disabled:opacity-50"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <Minus size={10} strokeWidth={3} />
                                                        </button>
                                                        <span className="w-4 sm:w-8 text-center font-bold text-[10px] sm:text-sm text-slate-700">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded bg-white text-slate-500 hover:text-brand-blue shadow-sm cursor-pointer"
                                                        >
                                                            <Plus size={10} strokeWidth={3} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Desktop Remove Button & Total */}
                                                <div className="hidden md:flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                                                    <Button
                                                        variant="ghost-danger"
                                                        size="sm"
                                                        onClick={() => setItemToDelete(item.id)}
                                                        className="gap-2"
                                                    >
                                                        <Trash2 size={16} />
                                                        Remove
                                                    </Button>
                                                    <div className="text-right">
                                                        <span className="text-xs text-slate-400 font-bold uppercase tracking-widest block">Subtotal</span>
                                                        <span className="text-lg font-black text-slate-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {totalPages > 1 && (
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={(page) => {
                                            setCurrentPage(page);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                    />
                                )}
                            </div>

                            {/* Order Summary */}
                            <div className="w-full lg:w-[400px]">
                                <div className="bg-white rounded-lg p-4 md:p-8 shadow-sm border border-slate-100 sticky top-32">
                                    <h3 className="text-base md:text-xl font-black text-slate-900 mb-4 md:mb-6">Order Summary</h3>

                                    <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                                        {/* Individual Items Breakdown */}
                                        <div className="space-y-2 md:space-y-3 pb-3 md:pb-4 border-b border-slate-100">
                                            {items.map((item) => (
                                                <div key={`summary-${item.id}`} className="flex items-start justify-between text-[11px] md:text-sm">
                                                    <span className="text-slate-600 flex-1 pr-4 line-clamp-2">
                                                        {item.name} <span className="text-black-400 whitespace-nowrap ml-1 font-bold">x {item.quantity}</span>
                                                    </span>
                                                    <span className="font-bold text-slate-900 whitespace-nowrap">
                                                        <span className="font-sans font-semibold mr-0.5" style={{ fontFamily: 'system-ui, Arial, sans-serif' }}>₹</span>
                                                        {(item.price * item.quantity).toLocaleString('en-IN')}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Subtotals */}
                                        <div className="flex items-center justify-between text-slate-600 pt-1 md:pt-2 text-xs md:text-base">
                                            <span>Subtotal ({getItemCount()} items)</span>
                                            <span className="font-bold">
                                                <span className="font-sans font-semibold mr-0.5" style={{ fontFamily: 'system-ui, Arial, sans-serif' }}>₹</span>
                                                {subtotal.toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                        {subtotal < 10000 && (
                                            <div className="flex items-center justify-between text-slate-600 text-xs md:text-base">
                                                <span>Shipping estimate</span>
                                                <span className="font-bold text-emerald-500">Free</span>
                                            </div>
                                        )}
                                        {subtotal > 10000 && (
                                            <div className="flex items-center justify-between text-slate-600 text-xs md:text-base">
                                                <span>Shipping estimate</span>
                                                <span className="font-bold text-emerald-500">
                                                    <span className="font-sans font-semibold mr-0.5" style={{ fontFamily: 'system-ui, Arial, sans-serif' }}>₹</span>
                                                    200
                                                </span>
                                            </div>
                                        )}
                                        <p className="text-[9px] md:text-xs text-slate-400 mt-1 md:mt-2">Free shipping on orders above ₹10,000</p>
                                    </div>

                                    <div className="border-t border-slate-100 pt-4 md:pt-6 mb-6 md:mb-8">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm md:text-lg font-bold text-slate-900">Total</span>
                                            <span className="text-lg md:text-2xl font-black text-brand-blue-dark">
                                                <span className="font-sans font-semibold mr-0.5" style={{ fontFamily: 'system-ui, Arial, sans-serif' }}>₹</span>
                                                {subtotal.toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                        <p className="text-[9px] md:text-xs text-slate-400 mt-1 md:mt-2">Includes all taxes and duties</p>
                                    </div>

                                    <Link href="/user/checkout" className="flex justify-end md:block w-full">
                                        <Button icon={<ArrowRight className="w-3.5 h-3.5 md:w-5 md:h-5" />} className="w-auto md:w-full h-9 md:h-14 py-0 px-5 md:py-4 md:px-0 text-[11px] md:text-base tracking-wide md:tracking-normal">
                                            Proceed to Checkout
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-12 md:mt-16 pt-8 border-t border-slate-100">
                        <ProductGrid title="You May Also Like" limit={6} />
                    </div>
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
        </>
    );
}
