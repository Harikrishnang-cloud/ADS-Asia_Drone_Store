"use client";

import React, { useMemo } from "react";
import { useCompareStore } from "@/store/compareStore";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import { Product } from "@/types/product.types";
import { X, ShoppingCart, Info, ArrowLeft, Check, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";

export default function ComparePage() {
    const { items, removeItem, clearCompare } = useCompareStore();
    const { data: allProducts, loading } = useFirestoreCollection<Product>({ collectionName: "products" });
    const { addItem: addToCart } = useCartStore();

    const compareProducts = useMemo(() => {
        return items.map(item => allProducts.find(p => p.id === item.id)).filter(Boolean) as Product[];
    }, [items, allProducts]);

    const handleAddToCart = (product: Product) => {
        addToCart({
            id: product.id,
            name: product.name,
            price: Number(product.offerPrice || product.price),
            image: product.imageUrl,
            quantity: 1
        });
        toast.success("Added to cart");
    };

    // Extract all unique specification keys across all compared products
    const allSpecKeys = useMemo(() => {
        const keys = new Set<string>();
        compareProducts.forEach(product => {
            product.specifications?.forEach(spec => {
                if (spec.label) keys.add(spec.label);
            });
        });
        return Array.from(keys);
    }, [compareProducts]);

    if (!items || items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                    <Info className="w-10 h-10 text-slate-400" />
                </div>
                <h1 className="text-2xl font-black text-slate-800 mb-2">Nothing to compare</h1>
                <p className="text-slate-500 mb-8 max-w-md">You haven&apos;t selected any products to compare. Go back and add some products to see how they stack up against each other.</p>
                <Link href="/products">
                    <Button variant="primary" icon={<ArrowLeft size={18} />}>Back to Products</Button>
                </Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
            </div>
        );
    }

    return (
        <div className="py-10 md:py-16 px-4 md:px-8 max-w-screen-3xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-2 uppercase tracking-tight">Compare Products</h1>
                    <p className="text-slate-500">Comparing {compareProducts.length} items</p>
                </div>
                <Button variant="ghost" onClick={clearCompare} className="text-red-500 hover:bg-red-50 hover:text-red-600">
                    Clear All
                </Button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden overflow-x-auto">
                <table className="w-full min-w-[800px] text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="p-6 border-b border-r border-slate-100 w-1/4 bg-slate-50/50 align-top">
                                <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Product Details</span>
                            </th>
                            {compareProducts.map(product => (
                                <th key={product.id} className="p-6 border-b border-r border-slate-100 w-1/4 align-top relative group">
                                    <button 
                                        onClick={() => removeItem(product.id)}
                                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                                        title="Remove from comparison"
                                    >
                                        <X size={18} />
                                    </button>
                                    <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-50 mb-4 border border-slate-100">
                                        <Image src={product.imageUrl} alt={product.name} fill className="object-cover p-2" sizes="(max-width: 768px) 100vw, 33vw" />
                                    </div>
                                    <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-2">{product.name}</h3>
                                    <div className="flex items-end gap-2 mb-4">
                                        <span className="text-xl font-black text-brand-orange">
                                            ₹{Number(product.offerPrice || product.price).toLocaleString('en-IN')}
                                        </span>
                                        {product.offerPrice && (
                                            <span className="text-sm text-slate-400 line-through font-semibold mb-0.5">
                                                ₹{Number(product.price).toLocaleString('en-IN')}
                                            </span>
                                        )}
                                    </div>
                                    <Button 
                                        onClick={() => handleAddToCart(product)} 
                                        className="w-full justify-center shadow-lg shadow-brand-blue/20" 
                                        icon={<ShoppingCart size={18} />}
                                    >
                                        Add to Cart
                                    </Button>
                                </th>
                            ))}
                            {/* Empty column if less than 3 products */}
                            {Array.from({ length: 3 - compareProducts.length }).map((_, i) => (
                                <th key={`empty-${i}`} className="p-6 border-b border-r border-slate-100 w-1/4 bg-slate-50/30 align-middle text-center">
                                    <div className="flex flex-col items-center justify-center opacity-50">
                                        <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center mb-4">
                                            <Plus className="w-8 h-8 text-slate-400" />
                                        </div>
                                        <span className="text-sm font-bold text-slate-400">Add Product</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {/* Basic Info */}
                        <tr>
                            <td className="p-4 md:p-6 border-b border-r border-slate-100 bg-slate-50/50 font-bold text-slate-600 text-sm">Category</td>
                            {compareProducts.map(product => (
                                <td key={product.id} className="p-4 md:p-6 border-b border-r border-slate-100 text-sm font-semibold text-slate-700">{product.category}</td>
                            ))}
                            {Array.from({ length: 3 - compareProducts.length }).map((_, i) => <td key={`empty-cat-${i}`} className="p-4 md:p-6 border-b border-r border-slate-100 bg-slate-50/30"></td>)}
                        </tr>
                        <tr>
                            <td className="p-4 md:p-6 border-b border-r border-slate-100 bg-slate-50/50 font-bold text-slate-600 text-sm">Status</td>
                            {compareProducts.map(product => (
                                <td key={product.id} className="p-4 md:p-6 border-b border-r border-slate-100 text-sm">
                                    {product.status === 'active' ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs"><Check size={14} /> In Stock</span>
                                    ) : product.status === 'coming_soon' ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 font-bold text-xs"><Info size={14} /> Coming Soon</span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 font-bold text-xs"><X size={14} /> Out of Stock</span>
                                    )}
                                </td>
                            ))}
                            {Array.from({ length: 3 - compareProducts.length }).map((_, i) => <td key={`empty-status-${i}`} className="p-4 md:p-6 border-b border-r border-slate-100 bg-slate-50/30"></td>)}
                        </tr>
                        
                        {/* Specifications */}
                        {allSpecKeys.length > 0 && (
                            <>
                                <tr>
                                    <td colSpan={4} className="p-4 border-b border-slate-100 bg-slate-100/50 font-black text-slate-800 text-sm uppercase tracking-wider">Specifications</td>
                                </tr>
                                {allSpecKeys.map(specKey => (
                                    <tr key={specKey} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4 md:p-6 border-b border-r border-slate-100 bg-slate-50/30 font-bold text-slate-600 text-sm capitalize">{specKey}</td>
                                        {compareProducts.map(product => {
                                            const specValue = product.specifications?.find(s => s.label === specKey)?.value;
                                            return (
                                                <td key={product.id} className="p-4 md:p-6 border-b border-r border-slate-100 text-sm text-slate-700">
                                                    {specValue ? specValue : <span className="text-slate-300">-</span>}
                                                </td>
                                            );
                                        })}
                                        {Array.from({ length: 3 - compareProducts.length }).map((_, i) => <td key={`empty-spec-${specKey}-${i}`} className="p-4 md:p-6 border-b border-r border-slate-100 bg-slate-50/30"></td>)}
                                    </tr>
                                ))}
                            </>
                        )}

                        {/* Features */}
                        <tr>
                            <td colSpan={4} className="p-4 border-b border-slate-100 bg-slate-100/50 font-black text-slate-800 text-sm uppercase tracking-wider">Features</td>
                        </tr>
                        <tr>
                            <td className="p-4 md:p-6 border-b border-r border-slate-100 bg-slate-50/50 font-bold text-slate-600 text-sm align-top">Highlights</td>
                            {compareProducts.map(product => (
                                <td key={product.id} className="p-4 md:p-6 border-b border-r border-slate-100 text-sm align-top">
                                    {product.features && product.features.length > 0 ? (
                                        <ul className="space-y-2">
                                            {product.features.map((feature, i) => (
                                                <li key={i} className="flex items-start gap-2 text-slate-700">
                                                    <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span className="text-slate-400 italic">No features listed</span>
                                    )}
                                </td>
                            ))}
                            {Array.from({ length: 3 - compareProducts.length }).map((_, i) => <td key={`empty-features-${i}`} className="p-4 md:p-6 border-b border-r border-slate-100 bg-slate-50/30"></td>)}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
