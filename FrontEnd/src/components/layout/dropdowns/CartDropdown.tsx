"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart, X, ArrowRight, ShoppingBag } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartDropdownProps {
  items?: CartItem[];
  onClose?: () => void;
}

export function CartDropdown({ items = [], onClose }: CartDropdownProps) {
  const isEmpty = items.length === 0;

  return (
    <div className="absolute top-[120%] right-0 w-80 md:w-96 bg-white rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right border border-slate-100 overflow-hidden translate-y-4 group-hover:translate-y-0 z-[100]">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <ShoppingCart size={18} className="text-brand-blue" />
          Shopping Cart ({items.length})
        </h3>
        <Link href="/user/cart" className="text-xs font-semibold text-brand-blue hover:text-brand-orange transition-colors">
          View All
        </Link>
      </div>

      {/* Content */}
      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        {isEmpty ? (
          <div className="p-10 flex flex-col items-center justify-center text-center">
            {/* <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag size={24} className="text-slate-400" />
            </div> */}
            <p className="text-slate-900 font-bold text-base mb-1">Your cart is empty</p>
            <p className="text-slate-500 text-sm">Add some items to get started!</p>
            <Link 
              href="/products" 
              className="mt-6 px-6 py-2 bg-brand-blue text-white rounded-full text-sm font-medium hover:bg-brand-blue-dark transition-all transform hover:scale-105"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 group/item">
                <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-100">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-110" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate mb-1">{item.name}</h4>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                    <p className="text-sm font-bold text-brand-blue">${(item.price * item.quantity).toFixed(2)}</p>
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
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">Subtotal</span>
            <span className="text-lg font-bold text-slate-900">
              ${items.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}
            </span>
          </div>
          <button className="w-full py-3 bg-brand-orange text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-orange/90 transition-all hover:shadow-lg hover:shadow-brand-orange/20 active:scale-[0.98]">
            Checkout
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
