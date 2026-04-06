"use client";

import React from "react";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import { Product } from "@/types/product.types";
import ProductCard from "./ProductCard";

interface ProductGridProps {
    category?: string;
    limit?: number;
    title?: string;
}

export default function ProductGrid({ category, limit, title }: ProductGridProps) {
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

    if (loading) {
        return (
            <div className="w-full">
                {title && <h2 className="text-2xl font-black text-slate-800 mb-8">{title}</h2>}
                <div className="grid grid-flow-col auto-cols-[48%] sm:auto-cols-[45%] md:auto-cols-[30%] lg:auto-cols-[23%] 2xl:auto-cols-[18%] gap-4 md:gap-8 overflow-x-auto pb-8 snap-x snap-mandatory custom-scrollbar">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="animate-pulse bg-slate-50 border border-slate-100 rounded-md h-[300px] sm:h-[400px] snap-center"></div>
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
