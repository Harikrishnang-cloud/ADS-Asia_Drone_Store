"use client";

import React from "react";
import Link from "next/link";
import { Heart, ArrowRight, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import toast from "react-hot-toast";

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface WishlistDropdownProps {
  items?: WishlistItem[];
}

export function WishlistDropdown({ items = [] }: WishlistDropdownProps) {
  const isEmpty = items.length === 0;
  const { addItem } = useCartStore();
  const { removeItem } = useWishlistStore();

  const handleMoveToCart = (e: React.MouseEvent, item: WishlistItem) => {
    e.preventDefault();
    e.stopPropagation();
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
    <div className="absolute top-[120%] right-0 w-80 md:w-96 bg-white rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right border border-slate-100 overflow-hidden translate-y-4 group-hover:translate-y-0 z-[100]">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <Heart size={18} className="text-red-500 fill-red-500" />
          My Wishlist ({items.length})
        </h3>
        <Link href="/user/wishlist" className="text-xs font-semibold text-brand-blue hover:text-brand-orange transition-colors">
          View All
        </Link>
      </div>

      {/* Content */}
      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        {isEmpty ? (
          <div className="p-10 flex flex-col items-center justify-center text-center">
            <p className="text-slate-900 font-bold text-base mb-1">Your wishlist is empty</p>
            <p className="text-slate-500 text-sm">Save items you love here!</p>
            <Link href="/products" className="mt-6 px-6 py-2 bg-brand-blue text-white rounded-full text-sm font-medium hover:bg-brand-blue-dark transition-all transform hover:scale-105">Browse Products</Link>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 group/item">
                <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-110" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate mb-1">{item.name}</h4>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-brand-blue">₹{item.price.toFixed(2)}</p>
                    <button 
                      onClick={(e) => handleMoveToCart(e, item)}
                      className="p-1.5 bg-slate-100 hover:bg-brand-blue hover:text-white rounded-lg transition-colors" 
                      title="Move to Cart"
                    >
                      <ShoppingCart size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {!isEmpty && (
        <div className="p-4 border-t border-slate-100 bg-slate-50/30">
          <Link 
            href="/user/wishlist"
            className="w-full py-3 bg-white text-brand-blue border border-brand-blue rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-blue hover:text-white transition-all active:scale-[0.98]"
          >
            Manage Wishlist
            <ArrowRight size={18} />
          </Link>
        </div>
      )}
    </div>
  );
}
