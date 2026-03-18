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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="animate-pulse bg-slate-50 border border-slate-100 rounded-3xl h-[400px]"></div>
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
                <div className="flex items-center justify-between mb-10 w-full relative">
                    <div className="flex flex-col">
                        <span className="text-sm font-black uppercase tracking-[0.3em] text-brand-orange mb-2">Exclusive Inventory</span>
                        <h2 className="text-3xl md:text-4xl font-black text-brand-blue-dark tracking-tight leading-none">{title}</h2>
                    </div>
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {displayProducts.map((product) => (
                    <div key={product.id} className="animate-in fade-in slide-in-from-bottom-5 duration-700">
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </section>
    );
}
