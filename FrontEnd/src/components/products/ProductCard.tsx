"use client";

import React from "react";
import { ShoppingCart, Heart, ArrowLeftRight } from "lucide-react";
import Image from "next/image";
import { Product } from "@/types/product.types";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCompareStore } from "@/store/compareStore";
import toast from "react-hot-toast";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const formattedPrice = Number(product.price).toLocaleString('en-IN');
    const { addItem } = useCartStore();
    const { addItem: addWishlist, removeItem: removeWishlist, isInWishlist } = useWishlistStore();
    const isWishlisted = isInWishlist(product.id);
    const { addItem: addCompare, removeItem: removeCompare, isInCompare, items: compareItems } = useCompareStore();
    const isCompared = isInCompare(product.id);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({
            id: product.id,
            name: product.name,
            price: Number(product.offerPrice || product.price),
            image: product.imageUrl,
            quantity: 1,
            rating: product.averageRating || product.rating,
            weight: product.weight,
            dimensions: product.dimensions
        });
        toast.success("Item added to cart");
    };

    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isWishlisted) {
            removeWishlist(product.id);
        } else {
            addWishlist({
                id: product.id,
                name: product.name,
                price: Number(product.offerPrice || product.price),
                image: product.imageUrl
            });
        }
    };

    const handleToggleCompare = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isCompared) {
            removeCompare(product.id);
        } else {
            if (compareItems.length >= 3) {
                toast.error("You can only compare up to 3 items");
                return;
            }
            addCompare({
                id: product.id,
                name: product.name,
                price: Number(product.offerPrice || product.price),
                image: product.imageUrl,
                category: product.category
            });
            toast.success("Added to comparison");
        }
    };

    return (
        <div className="group bg-white border border-slate-200 rounded-[8px] overflow-hidden flex flex-col h-full relative">

            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-20">
                <span className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-sm text-[8px] sm:text-[10px] font-black uppercase tracking-widest shadow-sm ${
                    product.status === 'coming_soon' ? 'bg-amber-500 text-white' :
                    product.stock > 0 ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                    {product.status === 'coming_soon' ? 'Coming Soon' : (product.stock > 0 ? 'In Stock' : 'Out of Stock')}
                </span>
            </div>


            <div className="relative aspect-square overflow-hidden bg-slate-50 text-center">
                <Link href={`/products/${product.id}`} className="block w-full h-full relative">
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                </Link>

                {/* Compare Action (Bottom Left) */}
                <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 z-30 opacity-100 lg:opacity-0 lg:-translate-y-3 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 transition-all duration-500 ease-out">
                    <button
                        onClick={handleToggleCompare}
                        className={`p-2 sm:p-2 rounded-full shadow-md transition-all active:scale-95 ${isCompared ? 'bg-brand-blue text-white' : 'bg-white/90 backdrop-blur-sm text-slate-400 hover:text-brand-blue hover:bg-white'}`}
                        title="Toggle Compare"
                    >
                        <ArrowLeftRight size={18} />
                    </button>
                </div>

                {/* Wishlist Action (Top Right) */}
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-30 opacity-100 lg:opacity-0 lg:-translate-y-3 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 transition-all duration-500 ease-out">
                    <button
                        onClick={handleToggleWishlist}
                        className={`p-2 sm:p-2 rounded-full shadow-md transition-all active:scale-95 ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white/90 backdrop-blur-sm text-slate-400 hover:text-red-500 hover:bg-white'}`}
                        title="Toggle Wishlist"
                    >
                        <Heart size={18} className={isWishlisted ? "fill-white" : ""} />
                    </button>
                </div>

                {/* Add to Cart Action (Bottom Right) */}
                {product.status !== 'coming_soon' && (
                    <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 z-30 opacity-100 lg:opacity-0 lg:translate-y-3 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 transition-all duration-500 ease-out lg:delay-75">
                        <button
                            onClick={handleAddToCart}
                            className="p-2 sm:p-2 bg-brand-orange/90 backdrop-blur-sm text-white rounded-lg shadow-md transition-all active:scale-95 hover:bg-brand-orange"
                            title="Add to Cart"
                        >
                            <ShoppingCart size={18} />
                        </button>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-2 md:p-3 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-1 mb-1 md:mb-2">
                    <Link href={`/products/${product.id}`} className="block flex-1 min-w-0">
                        <h3 className="text-[12px] sm:text-[13px] font-medium text-slate-800 group-hover:text-brand-orange transition-colors duration-300 line-clamp-2 leading-tight">{product.name}</h3>
                    </Link>
                    <div className="shrink-0">
                        <div className="flex items-center gap-0.5 sm:gap-1 bg-slate-50 border border-slate-100 px-1 py-0.5 md:px-2 md:py-0.5 rounded-sm shadow-sm">
                            <span className="text-[9px] sm:text-sm font-bold text-slate-700">{(product.averageRating || product.rating || 0).toFixed(1)}</span>
                            <span className="text-[8px] sm:text-[12px]">⭐</span>
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-1">
                    <div className="flex flex-col">
                        {product.offerPrice ? (
                            <div className="flex flex-wrap items-baseline gap-1.5">
                                <span className="text-[14px] sm:text-[16px] font-bold text-slate-900">₹{Number(product.offerPrice).toLocaleString('en-IN')}</span>
                                <span className="text-[11px] text-slate-400 line-through">₹{formattedPrice}</span>
                                {product.offerPercentage !== undefined && product.offerPercentage > 0 && (
                                    <span className="text-[10px] font-bold text-emerald-600">
                                        {product.offerPercentage}% Off
                                    </span>
                                )}
                            </div>
                        ) : (
                            <span className="text-[14px] sm:text-[16px] font-bold text-slate-900">₹{formattedPrice}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
