"use client";

import React from "react";
import { ShoppingCart, Heart } from "lucide-react";
import Image from "next/image";
import { Product } from "@/types/product.types";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import toast from "react-hot-toast";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const formattedPrice = Number(product.price).toLocaleString('en-IN');
    const { addItem } = useCartStore();
    const { addItem: addWishlist, removeItem: removeWishlist, isInWishlist } = useWishlistStore();
    const isWishlisted = isInWishlist(product.id);

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
        });
        toast.success(`${product.name} added to cart!`);
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

    return (
        <div className="group bg-white border border-slate-100 rounded-xl sm:rounded-xl lg:rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-brand-blue/10 transition-all duration-500 flex flex-col h-full relative">

            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-20">
                <span className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-sm text-[8px] sm:text-[10px] font-black uppercase tracking-widest shadow-sm ${product.stock > 0 ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
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

                {/* Wishlist Action (Top Right) */}
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-30 opacity-100 lg:opacity-0 lg:-translate-y-3 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 transition-all duration-500 ease-out">
                    <button
                        onClick={handleToggleWishlist}
                        className={`p-2 rounded-full shadow-md transition-all active:scale-95 ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white/90 backdrop-blur-sm text-slate-400 hover:text-red-500 hover:bg-white'}`}
                        title="Toggle Wishlist"
                    >
                        <Heart size={16} className={isWishlisted ? "fill-white" : ""} />
                    </button>
                </div>

                {/* Add to Cart Action (Bottom Right) */}
                <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 z-30 opacity-100 lg:opacity-0 lg:translate-y-3 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 transition-all duration-500 ease-out lg:delay-75">
                    <button
                        onClick={handleAddToCart}
                        className="p-2 bg-brand-orange/90 backdrop-blur-sm text-white rounded-lg shadow-md transition-all active:scale-95 hover:bg-brand-orange"
                        title="Add to Cart"
                    >
                        <ShoppingCart size={16} />
                    </button>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-3 sm:p-5 md:p-6 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-2 md:mb-3">
                    <Link href={`/products/${product.id}`} className="block flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base md:text-lg font-extrabold text-slate-900 group-hover:text-brand-orange transition-colors duration-300 line-clamp-2 md:line-clamp-1 leading-tight">{product.name}</h3>
                    </Link>
                    <div className="shrink-0">
                        <div className="flex items-center gap-0.5 sm:gap-1 bg-slate-50 border border-slate-100 px-1.5 py-0.5 md:px-2 md:py-0.5 rounded-sm shadow-sm">
                            <span className="text-[10px] sm:text-sm font-bold text-slate-700">{(product.averageRating || product.rating || 0).toFixed(1)}</span>
                            <span className="text-[10px] sm:text-[12px]">⭐</span>
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-3 md:pt-4 border-t border-slate-100">
                    <div className="flex flex-col">
                        <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1 hidden sm:block">Starting from</span>
                        {product.offerPrice ? (
                            <div className="flex flex-wrap items-baseline gap-2">
                                <span className="text-base sm:text-lg md:text-xl font-black text-brand-orange">₹{Number(product.offerPrice).toLocaleString('en-IN')}</span>
                                <span className="text-[11px] sm:text-sm text-slate-400 font-medium line-through">₹{formattedPrice}</span>
                                {product.offerPercentage && (
                                    <span className="text-[9px] font-black uppercase bg-emerald-50 text-emerald-700 px-1 py-0.5 rounded-xs mt-1">
                                        {product.offerPercentage}% OFF
                                    </span>
                                )}
                            </div>
                        ) : (
                            <span className="text-base sm:text-lg md:text-xl font-black text-brand-blue-dark">₹{formattedPrice}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
