"use client";

import React from "react";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import { useState, useEffect } from "react";

import { Product } from "@/types/product.types";
import ProductCard from "./ProductCard";

interface ProductGridProps {
    category?: string;
    limit?: number;
    title?: string;
}

export default function ProductGrid({ category, limit, title }: ProductGridProps) {
    const [hasHydrated, setHasHydrated] = useState(false);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setHasHydrated(true);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    const { data: products, loading } = useFirestoreCollection<Product>({
        collectionName: "products",
        orderByField: "createdAt",
        orderDirection: "desc"
    });


    const displayProducts = React.useMemo(() => {
        let filtered = products;
        if (category) {
            filtered = products.filter(p => p.category === category);
        }
        if (limit) {
            filtered = filtered.slice(0, limit);
        }
        return filtered;
    }, [products, category, limit]);

    if (!hasHydrated || loading) {
        return (
            <div className="w-full">
                {title && (
                    <div className="flex flex-col mb-6 md:mb-8">
                        <div className="w-32 h-3 bg-slate-100 rounded animate-pulse mb-2"></div>
                        <div className="w-64 h-8 bg-slate-100 rounded animate-pulse"></div>
                    </div>
                )}
                <div className="grid grid-flow-col auto-cols-[48%] sm:auto-cols-[45%] md:auto-cols-[30%] lg:auto-cols-[23%] 2xl:auto-cols-[18%] gap-3 md:gap-6 lg:gap-8 overflow-x-auto pb-4 md:pb-8 snap-x snap-mandatory custom-scrollbar">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="animate-pulse bg-white border border-slate-100 rounded-xl h-[350px] sm:h-[420px] md:h-[480px] snap-center">
                            <div className="aspect-square bg-slate-50 w-full"></div>
                            <div className="p-4 space-y-3">
                                <div className="h-4 bg-slate-50 w-3/4 rounded"></div>
                                <div className="h-4 bg-slate-50 w-1/2 rounded"></div>
                                <div className="pt-4 border-t border-slate-50 flex flex-col gap-2">
                                    <div className="h-3 bg-slate-50 w-1/4 rounded"></div>
                                    <div className="h-6 bg-slate-50 w-1/2 rounded"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }


    if (displayProducts.length === 0) {
        return (
            <div className="py-20 flex flex-col items-center justify-center text-center opacity-50">
                <div className="w-20 h-20 bg-slate-100 rounded-full mb-6 flex items-center justify-center pointer-events-none">
                    <span className="text-4xl text-slate-300"></span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No products found</h3>

            </div>
        );
    }

    return (
        <section className="w-full">
            {title && (
                <div className="flex items-center justify-between mb-6 md:mb-8 w-full relative">
                    <div className="flex flex-col">
                        <span className="text-xs md:text-sm font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-brand-orange mb-1 md:mb-2">Exclusive Inventory</span>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-brand-blue-dark tracking-tight leading-none">{title}</h2>
                    </div>
                </div>
            )}
            <div className="grid grid-flow-col auto-cols-[48%] sm:auto-cols-[45%] md:auto-cols-[30%] lg:auto-cols-[23%] 2xl:auto-cols-[18%] gap-3 md:gap-6 lg:gap-8 overflow-x-auto pb-4 md:pb-8 snap-x snap-mandatory custom-scrollbar">
                {displayProducts.map((product) => (
                    <div key={product.id} className="animate-in fade-in slide-in-from-bottom-5 duration-700 snap-center h-full">
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </section>
    );
}
