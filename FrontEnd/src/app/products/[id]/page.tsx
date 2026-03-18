"use client";

import React from "react";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import { Product } from "@/types/product.types";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, ShoppingCart, Share2, ShieldCheck, Truck, RefreshCw, Package } from "lucide-react";
import Button from "@/components/ui/button";

export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { data: products, loading } = useFirestoreCollection<Product>({
        collectionName: "products"
    });

    const product = React.useMemo(() => {
        return products.find(p => p.id === id);
    }, [products, id]);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 pt-32 pb-20 animate-pulse">
                <div className="flex flex-col md:flex-row gap-12">
                    <div className="w-full md:w-1/2 aspect-square bg-slate-50 rounded-[40px]"></div>
                    <div className="w-full md:w-1/2 space-y-6">
                        <div className="h-4 w-24 bg-slate-100 rounded-full"></div>
                        <div className="h-12 w-3/4 bg-slate-100 rounded-2xl"></div>
                        <div className="h-24 w-full bg-slate-100 rounded-2xl"></div>
                        <div className="h-12 w-1/3 bg-slate-100 rounded-2xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <Package size={64} className="text-slate-200 mb-6" />
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Product Not Found</h1>
                <p className="text-slate-500 mb-8">The product you're looking for doesn't exist or has been removed.</p>
                <Button onClick={() => router.push('/products')}>Back to Catalog</Button>
            </div>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-20 relative z-10">
            <button 
                onClick={() => router.back()}
                className="flex items-center gap-2 text-slate-400 hover:text-brand-orange transition-colors font-bold uppercase text-[10px] tracking-widest mb-10"
            >
                <ChevronLeft size={16} /> Back
            </button>

            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                {/* Image Gallery */}
                <div className="w-full lg:w-1/2 space-y-6">
                    <div className="aspect-square bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-2xl shadow-slate-200/50">
                        <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                    {product.images && product.images.length > 0 && (
                        <div className="grid grid-cols-4 gap-4">
                            {product.images.map((img, i) => (
                                <div key={i} className="aspect-square rounded-2xl border border-slate-100 overflow-hidden bg-white hover:border-brand-orange transition-all cursor-pointer">
                                    <img src={img} alt={`${product.name} ${i}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="w-full lg:w-1/2 space-y-8">
                    <div className="space-y-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-orange">{product.category}</span>
                        <h1 className="text-4xl md:text-5xl font-black text-brand-blue-dark tracking-tight leading-tight">{product.name}</h1>
                        <div className="flex items-center gap-4">
                            <span className="text-3xl font-bold text-brand-blue-dark">₹{Number(product.price).toLocaleString('en-IN')}</span>
                            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                product.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                            }`}>
                                {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                            </span>
                        </div>
                        <p className="text-slate-400 font-medium text-lg leading-relaxed">{product.description || "Designed for ultimate performance and reliability. This professional-grade drone solution is built to handle the most demanding environments in Asia."}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button className="flex-1 py-4 text-sm tracking-widest" icon={<ShoppingCart size={20} />}>Add to Cart</Button>
                        <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-all active:scale-95 shadow-sm">
                            <Share2 size={24} />
                        </button>
                    </div>

                    {/* Features/Trust badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-slate-100">
                        {[
                            { icon: <ShieldCheck size={20} />, label: "Full Warranty" },
                            { icon: <Truck size={20} />, label: "Safe Express" },
                            { icon: <RefreshCw size={20} />, label: "Easy Returns" }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col gap-2 items-center sm:items-start text-center sm:text-left">
                                <div className="p-2.5 bg-brand-blue/5 text-brand-blue rounded-xl w-fit">
                                    {item.icon}
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
