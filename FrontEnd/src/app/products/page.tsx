"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import { Product } from "@/types/product.types";
import ProductCard from "@/components/products/ProductCard";
import Pagination from "@/components/ui/Pagination";
import { Filter, SlidersHorizontal, ChevronDown } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

function ProductsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    
    const search = searchParams.get("search") || "";
    const categoryParam = searchParams.get("category") || "All";
    const sortByParam = searchParams.get("sortBy") || "newest";

    const { data: rawProducts, loading } = useFirestoreCollection<Product>({
        collectionName: "products",
        orderByField: "createdAt",
        orderDirection: "desc"
    });

    const products = useMemo(() => {
        return rawProducts
            .filter(p => p.status === 'active' || p.status === 'coming_soon')
            .map(p => ({
                ...p,
                category: p.category === "All Products" ? "Drones" : p.category
            }));
    }, [rawProducts]);

    // States for non-URL filters (like price range and pagination)
    const [priceRange, setPriceRange] = useState<number>(250000); 
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasMounted, setHasMounted] = useState(false);
    const ITEMS_PER_PAGE = 12; 

    // Derived filters from URL
    const selectedCategory = categoryParam;
    const sortBy = sortByParam;

    const [showMobileFilters, setShowMobileFilters] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setHasMounted(true), 0);
        return () => clearTimeout(timeout);
    }, []);

    // Helper to update search params
    const updateFilters = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === "All") {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    useEffect(() => {
        setTimeout(() => setCurrentPage(1), 0);
    }, [selectedCategory, priceRange, sortBy, search]);
    const categories = useMemo(() => {
        const cats = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
        return ["All", ...cats];
    }, [products]);

    const suggestions = useMemo(() => {
        if (!search) return [];
        const query = search.toLowerCase();
        // Get unique names and categories that match
        const matchingNames = products
            .filter(p => p.name?.toLowerCase().includes(query))
            .map(p => p.name)
            .slice(0, 5);

        const matchingCategories = products
            .filter(p => p.category?.toLowerCase().includes(query))
            .map(p => p.category)
            .slice(0, 3);

        return Array.from(new Set([...matchingNames, ...matchingCategories]))
            .filter(s => s.toLowerCase() !== search.toLowerCase());
    }, [products, search]);

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

    // SEO Data
    const seoData: Record<string, { desc: string; faq: {q: string; a: string; link?: { text: string; url: string }}[] }> = {
        "All": {
            desc: "Browse our complete catalog of professional drones, agriculture UAVs, FPV drones, and premium accessories. Find exactly what you need at Asia Drone Store, Thiruvananthapuram.",
            faq: [
                { q: "Which drone is suitable for beginners?", a: "We recommend starting with consumer mini drones that have collision avoidance and intuitive controls." },
                { 
                    q: "Do I need DGCA registration in India?", 
                    a: "Yes, drones over 250 grams must be registered with the DGCA in India.",
                    link: { text: "For more details please visit:", url: "https://asiasoftlab.in/" }
                }
            ]
        },
        "Drones": {
            desc: "Discover top-tier consumer and professional drones perfect for aerial photography, mapping, and videography. Experience crystal clear 4K imaging and advanced flight modes.",
            faq: [
                { q: "What is the best drone for photography?", a: "Professional drones with 1-inch or larger sensors offer the best low-light performance and dynamic range." }
            ]
        },
        "Agriculture Drones": {
            desc: "Maximize crop yield with our advanced agriculture drones. Perfect for precision spraying, multispectral imaging, and crop health monitoring across farms in India.",
            faq: [
                { q: "How much area can an agriculture drone cover?", a: "A standard agriculture drone can spray up to 2-3 acres per hour depending on tank capacity and battery life." }
            ]
        },
        "Industrial UAVs": {
            desc: "Robust industrial UAVs built for land surveying, structural inspection, and public safety missions. Featuring thermal cameras, RTK modules, and extended flight times.",
            faq: [
                { q: "Are industrial drones weatherproof?", a: "Many industrial models feature IP43 or higher ratings, allowing them to fly in light rain and dusty environments." }
            ]
        },
        "Accessories": {
            desc: "Enhance your drone's capabilities with our wide range of premium accessories, including ND filters, landing pads, carrying cases, and high-capacity batteries.",
            faq: [
                { q: "How do I choose the right battery?", a: "Always purchase genuine batteries matched to your specific drone model to ensure safety and warranty compliance." }
            ]
        },
        "Spare Parts": {
            desc: "Genuine spare parts for drone repair and maintenance. From replacement propellers to gimbal motors, keep your drone flying safely.",
            faq: [
                { q: "Can I buy drone spare parts separately?", a: "Yes, we stock a comprehensive inventory of genuine replacement parts for immediate shipping." }
            ]
        }
    };

    const currentSeo = seoData[selectedCategory] || seoData["All"];

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": currentSeo.faq.map(f => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": f.a + (f.link ? ` ${f.link.text} ${f.link.url}` : "")
            }
        }))
    };

    // Paginate results
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredProducts, currentPage]);

    return (
        <main className="mx-auto w-full px-4 sm:px-8 pt-4 pb-20 md:pt-10 relative z-10 ">
            <div className="absolute inset-0 -z-10 pointer-events-none opacity-40"></div>
            {/* Page Header */}
            <div className="flex flex-col mb-4 md:mb-10 relative">
                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.5em] text-brand-orange mb-1 md:mb-3">Asia Drone Store Inventory</span>
                <h1 className="text-3xl md:text-5xl lg:text-7xl font-black tracking-tighter mb-2 md:mb-4 leading-tight">
                    {search ? `Search Results for "${search}"` : <>Professional <br className="hidden md:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-blue-dark to-brand-orange">Drone Solutions</span></>}
                </h1>
                <p className="text-slate-500 text-xs md:text-lg leading-relaxed max-w-2xl">
                    {search 
                        ? `Found ${filteredProducts.length} results matching your search.`
                        : "Browse our elite selection of UAVs, high-performance parts, and specialized accessories engineered for unique flight conditions."}
                </p>

                {search && suggestions.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mt-6 animate-in fade-in slide-in-from-top-4 duration-500">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">Suggestions:</span>
                        {suggestions.map((suggestion) => (
                            <button
                                key={suggestion}
                                onClick={() => updateFilters({ search: suggestion })}
                                className="px-4 py-1.5 bg-white border border-slate-200 hover:border-brand-orange hover:text-brand-orange text-slate-600 text-xs font-bold rounded-full transition-all duration-300 shadow-sm hover:shadow-brand-orange/10"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <div className="flex flex-col lg:flex-row gap-4 lg:gap-12 w-full">
                {/* Sidebar Filters */}
                <aside className={`w-full lg:w-72 shrink-0 ${showMobileFilters ? 'block' : 'hidden'} lg:block`}>
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
                                        onClick={() => updateFilters({ category: category })}
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
                                <h3 className="text-xs font-bold text-brand-blue-dark uppercase tracking-widest">Min Price</h3>
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
                    <div className="flex flex-row items-center justify-between bg-white border border-slate-100 p-2 md:p-4 rounded-lg shadow-sm shadow-brand-blue/5 mb-4 md:mb-8 w-full gap-2 md:gap-4">
                        <p className="hidden sm:block text-xs md:text-sm font-bold text-slate-500">
                            Showing <span className="text-slate-900 font-black">
                                {filteredProducts.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}
                            </span> to <span className="text-slate-900 font-black">
                                {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)}
                            </span> of <span className="text-slate-900 font-black">{filteredProducts.length}</span> Products
                        </p>
                        
                        <button 
                            onClick={() => setShowMobileFilters(!showMobileFilters)} 
                            className="lg:hidden flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 flex-1"
                        >
                            <Filter size={14} /> {showMobileFilters ? "Hide Filters" : "Filters"}
                        </button>

                        <div className="flex items-center gap-2 relative group flex-1 sm:flex-none">
                            <label className="hidden sm:block text-xs font-bold text-slate-400 uppercase tracking-widest shrink-0">Sort By:</label>
                            <div className="relative w-full sm:w-48">
                                <select
                                    className="w-full appearance-none bg-slate-50 border border-slate-200 text-[11px] md:text-sm font-bold text-slate-700 py-2 md:py-2.5 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange/20 cursor-pointer"
                                    value={sortBy}
                                    onChange={(e) => updateFilters({ sortBy: e.target.value })}>
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
                                onClick={() => { 
                                    setPriceRange(500000);
                                    updateFilters({ category: null, sortBy: null, search: null });
                                }}
                                className="mt-6 px-6 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )}
                </div>
                
            </div>
            {/* Category SEO Content */}
                {!search && (
                    <div className="mt-6 md:mt-8 p-6 bg-white border border-slate-100 rounded-xl shadow-sm">
                        <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-2">{selectedCategory === "All" ? "Explore Our Collection" : selectedCategory}</h2>
                        <p className="text-sm md:text-base text-slate-500 leading-relaxed max-w-4xl">{currentSeo.desc}</p>
                        
                        <div className="mt-6 pt-4 border-t border-slate-100">
                            <h3 className="text-sm font-bold text-slate-700 mb-4">Frequently Asked Questions</h3>
                            <div className="flex flex-col gap-4">
                                {currentSeo.faq.map((f, i) => (
                                    <div key={i}>
                                        <h4 className="text-sm font-semibold text-slate-800 mb-1">{f.q}</h4>
                                        <p className="text-xs md:text-sm text-slate-500">
                                            {f.a}
                                            {f.link && (
                                                <span className="ml-1">
                                                    {f.link.text}{" "}
                                                    <a href={f.link.url} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:text-brand-orange hover:underline font-medium transition-colors">
                                                        {f.link.url}
                                                    </a>
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
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
