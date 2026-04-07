"use client";

import React, { useEffect, useState } from "react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/button";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import Pagination from "@/components/ui/Pagination";
import toast from "react-hot-toast";

export default function WishlistPage() {
    const { items, removeItem } = useWishlistStore();
    const { addItem } = useCartStore();
    const [hasHydrated, setHasHydrated] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 12; // Standardised for 4 rows (12/16 items)

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHasHydrated(true);
    }, []);

    // Pagination calculations
    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
    
    // Auto-adjust page if current page becomes empty after deletion
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCurrentPage(totalPages);
        }
    }, [items.length, currentPage, totalPages]);

    const paginatedItems = items.slice(
        (currentPage - 1) * ITEMS_PER_PAGE, 
        currentPage * ITEMS_PER_PAGE
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

    const handleMoveToCart = (item: { id: string; name: string; price: number; image: string }) => {
        addItem({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: 1
        });
        removeItem(item.id);
        toast.success(`${item.name} moved to cart!`);
    };

    return (
        <>
            <div className="min-h-screen pt-24 md:pt-32 pb-12 md:pb-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-2xl md:text-3xl font-black text-brand-blue-dark flex items-center gap-3">
                            <Heart className="text-red-500 fill-red-500" size={28} />
                            My Wishlist
                        </h1>
                        {items.length > 0 && (
                            <span className="text-sm font-bold text-slate-500 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-100">
                                {items.length} Items Saved
                            </span>
                        )}
                    </div>

                    {items.length === 0 ? (
                        <div className="bg-white rounded-xl p-12 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                <Heart size={40} className="text-slate-300" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Your wishlist is empty</h2>
                            <p className="text-slate-500 mb-8 max-w-sm">Save your favorite drones and accessories here to easily find them later.</p>
                            <Link href="/products">
                                <Button>Start Browsing</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {paginatedItems.map((item) => (
                                    <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl hover:shadow-brand-blue/10 transition-all border border-slate-100 group flex flex-col">
                                        <div className="aspect-square bg-slate-50 relative overflow-hidden">
                                            <Link href={`/products/${item.id}`} className="block w-full h-full">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img 
                                                    src={item.image} 
                                                    alt={item.name} 
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                                />
                                            </Link>
                                        </div>
                                        <div className="p-5 flex flex-col flex-1">
                                            <Link href={`/products/${item.id}`} className="block mb-2 flex-1">
                                                <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-orange transition-colors duration-300 line-clamp-2">
                                                    {item.name}
                                                </h3>
                                            </Link>
                                            <div className="font-black text-brand-blue text-lg mb-4">
                                                <span className="font-sans font-semibold mr-0.5" style={{fontFamily: 'system-ui, Arial, sans-serif'}}>₹</span>
                                                {Number(item.price).toLocaleString('en-IN')}
                                            </div>
                                            <div className="flex gap-2 mt-auto">
                                                <Button 
                                                    variant="ghost-danger"
                                                    size="icon"
                                                    onClick={() => setItemToDelete(item.id)}
                                                    className="bg-slate-50 border-none shadow-sm cursor-pointer"
                                                    title="Remove from wishlist"
                                                >
                                                    <Trash2 size={20} />
                                                </Button>
                                                <Button 
                                                    onClick={() => handleMoveToCart(item)}
                                                    className="flex-1 py-3 text-sm rounded-xl cursor-pointer" 
                                                    icon={<ShoppingCart size={18} />}
                                                >
                                                    Move to Cart
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Pagination 
                                currentPage={currentPage} 
                                totalPages={totalPages} 
                                onPageChange={(page) => {
                                    setCurrentPage(page);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }} 
                            />
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
                        toast.success("Item removed from wishlist");
                    }
                }}
                title="Remove from Wishlist?"
                message="Are you sure you want to remove this item from your wishlist?"
                confirmText="Yes, Remove it"
                cancelText="Keep Item"
                type="danger"
            />
        </>
    );
}
