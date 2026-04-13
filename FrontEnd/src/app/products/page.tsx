"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import { Product } from "@/types/product.types";
import ProductCard from "@/components/products/ProductCard";
import Pagination from "@/components/ui/Pagination";
import { Filter, SlidersHorizontal, ChevronDown } from "lucide-react";
import { useSearchParams } from "next/navigation";

function ProductsContent() {
    const searchParams = useSearchParams();
    const search = searchParams.get("search") || "";

    const { data: products, loading } = useFirestoreCollection<Product>({
        collectionName: "products",
        orderByField: "createdAt",
        orderDirection: "desc"
    });

    // Filter states
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [priceRange, setPriceRange] = useState<number>(250000); 
    const [sortBy, setSortBy] = useState<string>("newest");

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasMounted, setHasMounted] = useState(false);
    const ITEMS_PER_PAGE = 12; 

    useEffect(() => {
        const timeout = setTimeout(() => setHasMounted(true), 0);
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        setTimeout(() => setCurrentPage(1), 0);
    }, [selectedCategory, priceRange, sortBy, search]);
    const categories = useMemo(() => {
        const cats = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
        return ["All", ...cats];
    }, [products]);

    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (search) {
            const query = search.toLowerCase();
            result = result.filter(p => 
                p.name?.toLowerCase().includes(query) || 
                p.category?.toLowerCase().includes(query)
            );
        }

        // 1. Category Filter
        if (selectedCategory !== "All") {
            result = result.filter(p => p.category === selectedCategory);
        }

        // 2. Price Filter (using offer price if available, else regular price)
        result = result.filter(p => {
            const price = Number(p.offerPrice || p.price);
            return price <= priceRange;
        });

        // 3. Sorting
        result.sort((a, b) => {
            const priceA = Number(a.offerPrice || a.price);
            const priceB = Number(b.offerPrice || b.price);
            const ratingA = Number(a.rating || 0);
            const ratingB = Number(b.rating || 0);

            switch (sortBy) {
                case "price_asc":
                    return priceA - priceB;
                case "price_desc":
                    return priceB - priceA;
                case "rating_desc":
                case "popularity":
                    return (ratingB || Number(b.reviews || 0)) - (ratingA || Number(a.reviews || 0));
                case "rating_asc":
                    return ratingA - ratingB;
                case "name_asc":
                    return a.name.localeCompare(b.name);
                case "name_desc":
                    return b.name.localeCompare(a.name);
                case "newest":
                default:
                    return (b.createdAt || 0) - (a.createdAt || 0);
            }
        });

        return result;
    }, [products, selectedCategory, priceRange, sortBy, search]);

    // Paginate results
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredProducts, currentPage]);

    return (
        <main className="mx-auto w-full px-4 sm:px-8 pt-24 pb-20 md:pt-10 relative z-10 ">
            <div className="absolute inset-0 -z-10 pointer-events-none opacity-40"></div>
            {/* Page Header */}
           
            <div className="flex flex-col mb-10 relative">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-orange mb-3">Asia Drone Store Inventory</span>
                <h1 className="text-5xl md:text-7xl lg:text-7xl font-black tracking-tighter mb-4">
                    {search ? `Search Results for "${search}"` : <>Professional <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-blue-dark to-brand-orange">Drone Solutions</span></>}
                </h1>
                <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-2xl">
                    {search 
                        ? `Found ${filteredProducts.length} results matching your search.`
                        : "Browse our elite selection of UAVs, high-performance parts, and specialized accessories engineered for unique flight conditions."}
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full">
                {/* Sidebar Filters */}
                <aside className="w-full lg:w-72 shrink-0">
                    <div className="sticky top-24 bg-white border border-slate-100 p-6 rounded-lg shadow-sm shadow-brand-blue/5">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
                            <SlidersHorizontal size={20} className="text-brand-orange" />
                            <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider">Filters</h2>
                        </div>

                        {/* Category Filter */}
                        <div className="mb-8">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Categories</h3>
                            <div className="flex flex-col gap-2">
                                {hasMounted ? categories.map(category => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`text-left px-3 py-2 rounded-md text-sm font-semibold transition-all duration-300 cursor-pointer ${selectedCategory === category
                                                ? 'bg-brand-orange/10 text-brand-orange'
                                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                            }`}
                                    >
                                        {category}
                                        <span className="float-right text-xs opacity-50 mt-0.5">
                                            {category === "All"
                                                ? products.length
                                                : products.filter(p => p.category === category).length}
                                        </span>
                                    </button>
                                )) : (
                                    <div className="space-y-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-9 bg-slate-50 animate-pulse rounded-md"></div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Price Range Filter */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Max Price</h3>
                                <span className="text-sm font-black text-brand-blue-dark">₹{priceRange.toLocaleString('en-IN')}</span>
                            </div>
                            <input
                                type="range"
                                min="10000"
                                max="500000"
                                step="1000"
                                value={priceRange}
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-orange"
                            />
                            <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2">
                                <span>₹ 10 K</span>
                                <span>₹ 5 Lakh</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Product Grid Area */}
                <div className="flex-1 flex flex-col">
                    {/* Toolbar (Sort & Results Count) */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white border border-slate-100 p-4 rounded-lg shadow-sm shadow-brand-blue/5 mb-8 w-full gap-4">
                        <p className="text-sm font-bold text-slate-500">
                            Showing <span className="text-slate-900 font-black">
                                {filteredProducts.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}
                            </span> to <span className="text-slate-900 font-black">
                                {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)}
                            </span> of <span className="text-slate-900 font-black">{filteredProducts.length}</span> Products
                        </p>

                        <div className="flex items-center gap-3 relative group w-full sm:w-auto">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest shrink-0">Sort By:</label>
                            <div className="relative w-full sm:w-48">
                                <select
                                    className="w-full appearance-none bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 py-2.5 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange/20 cursor-pointer"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}>
                                    <option value="newest">What&apos;s New</option>
                                    <option value="popularity">Popularity</option>
                                    <option value="price_asc">Price: Low to High</option>
                                    <option value="price_desc">Price: High to Low</option>
                                    <option value="rating_desc">Rating: High to Low</option>
                                    <option value="rating_asc">Rating: Low to High</option>
                                    <option value="name_asc">Name: A-Z</option>
                                    <option value="name_desc">Name: Z-A</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-6">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="animate-pulse bg-slate-50 border border-slate-100 rounded-xl h-[300px] sm:h-[400px]"></div>
                            ))}
                        </div>
                    ) : paginatedProducts.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-6">
                                {paginatedProducts.map((product) => (
                                    <div key={product.id} className="h-full flex flex-col">
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={(page) => {
                                    setCurrentPage(page);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                            />
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 opacity-60 bg-white border border-slate-100 rounded-3xl">
                            <Filter size={48} className="text-slate-300 mb-4" />
                            <h3 className="text-xl font-black text-slate-900 mb-2">No products found</h3>
                            <p className="text-slate-500 font-medium text-center max-w-sm">Try adjusting your filters or price range to find what you&apos;re looking for.</p>
                            <button
                                onClick={() => { setSelectedCategory("All"); setPriceRange(500000); }}
                                className="mt-6 px-6 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading products...</div>}>
            <ProductsContent />
        </Suspense>
    );
}
