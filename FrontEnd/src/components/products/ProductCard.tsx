"use client";

import React from "react";
import { ShoppingCart, Heart } from "lucide-react";
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
            price: Number(product.price),
            image: product.imageUrl,
            quantity: 1
        });
        toast.success(`${product.name} added to cart!`);
    };

    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isWishlisted) {
            removeWishlist(product.id);
            toast.success("Removed from wishlist");
        } else {
            addWishlist({
                id: product.id,
                name: product.name,
                price: Number(product.price),
                image: product.imageUrl
            });
            toast.success("Added to wishlist");
        }
    };

    return (
        <div className="group bg-white border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-brand-blue/10 transition-all duration-500 flex flex-col h-full relative">
            {/* Status Badge */}
            <div className="absolute top-4 left-4 z-10">
                <span className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest shadow-sm ${product.stock > 0 ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
            </div>

            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden bg-slate-50">
                <Link href={`/products/${product.id}`} className="block w-full h-full">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                </Link>

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-brand-blue-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 pointer-events-none">
                    <button 
                        onClick={handleToggleWishlist}
                        className={`p-3 rounded-xl transition-all shadow-xl cursor-pointer pointer-events-auto z-20 relative ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-brand-blue-dark hover:bg-red-50 hover:text-red-500'}`}
                    >
                        <Heart size={20} className={isWishlisted ? "fill-white" : ""} />
                    </button>
                    <button 
                        onClick={handleAddToCart}
                        className="p-3 bg-brand-orange text-white rounded-xl hover:bg-brand-blue-dark transition-all shadow-xl cursor-pointer pointer-events-auto z-20 relative"
                    >
                        <ShoppingCart size={20} />
                    </button>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-6 flex flex-col flex-1">
                <div className="mb-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-orange/80">{product.category}</span>
                </div>
                <Link href={`/products/${product.id}`} className="block">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-orange transition-colors duration-300 line-clamp-1 mb-1">{product.name}</h3>
                </Link>
                <p className="text-slate-400 text-xs font-medium line-clamp-2 mb-4 flex-1">{product.description || "Premium drone solution for professional needs."}</p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Starting from</span>
                        <span className="text-xl font-black text-brand-blue-dark">₹{formattedPrice}</span>
                    </div>
                    <Link href={`/products/${product.id}`} className="px-5 py-2.5 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded cursor-pointer hover:bg-brand-orange transition-all shadow-lg active:scale-95">
                        Details
                    </Link>
                </div>
            </div>
        </div>
    );
}
