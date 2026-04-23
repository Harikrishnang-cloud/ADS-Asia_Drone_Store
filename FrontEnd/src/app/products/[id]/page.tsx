"use client";

import React, { useState } from "react";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import { Product } from "@/types/product.types";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, X, Maximize2, ShoppingCart, Share2, Package, Heart, Star, CheckCircle2, Minus, Plus } from "lucide-react";
import Button from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import Image from "next/image";
import toast from "react-hot-toast";
import dynamic from 'next/dynamic';

const ProductGrid = dynamic(() => import("@/components/products/ProductGrid"), {
    loading: () => <div className="h-96 animate-pulse bg-slate-50 rounded-xl" />,
    ssr: false
});

const ProductReviews = dynamic(() => import("@/components/products/ProductReviews"), {
    loading: () => <div className="h-96 animate-pulse bg-slate-50 rounded-xl" />,
    ssr: false
});


export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { data: products, loading } = useFirestoreCollection<Product>({ collectionName: "products" });
    const { addItem } = useCartStore();
    const { addItem: addWishlist, removeItem: removeWishlist, isInWishlist } = useWishlistStore();

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [quantity, setQuantity] = useState<number>(1);

    const product = React.useMemo(() => {
        return products.find(p => p.id === id);
    }, [products, id]);

    // Keyboard controls for modal
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isModalOpen || !product) return;

            const allImages = [product.imageUrl, ...(product.images || [])];
            const curr = allImages.indexOf(selectedImage || product.imageUrl);

            if (e.key === "Escape") setIsModalOpen(false);
            if (e.key === "ArrowLeft") {
                const next = (curr - 1 + allImages.length) % allImages.length;
                setSelectedImage(allImages[next]);
            }
            if (e.key === "ArrowRight") {
                const next = (curr + 1) % allImages.length;
                setSelectedImage(allImages[next]);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isModalOpen, selectedImage, product]);

    const isWishlisted = product ? isInWishlist(product.id) : false;
    const handleAddToCart = () => {
        if (!product) return;
        addItem({
            id: product.id,
            name: product.name,
            price: Number(product.offerPrice || product.price),
            image: product.imageUrl,
            quantity: quantity,
            rating: product.rating,
            reviews: product.reviews,
        });
        toast.success(`${product.name} added to cart!`);
    };

    const handleToggleWishlist = () => {
        if (!product) return;
        if (isWishlisted) {
            removeWishlist(product.id);

        } else {
            addWishlist({
                id: product.id,
                name: product.name,
                price: Number(product.offerPrice || product.price),
                image: product.imageUrl
            });

        }
    };

    const handleShare = async () => {
        if (!product) return;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: String(product.name),
                    text: `Check out ${product.name} at Asia Drone Store!`,
                    url: window.location.href,
                });
            } catch {
                console.log("Sharing cancelled or failed");
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Product link copied to clipboard!");
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-6 pb-20 animate-pulse">
                <div className="w-16 h-4 bg-slate-100 rounded mb-4"></div>
                <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
                    {/* Left: Image Skeleton */}
                    <div className="w-full lg:w-1/2">
                        <div className="aspect-square bg-slate-100 rounded-xl"></div>
                        <div className="grid grid-cols-4 gap-4 mt-6">
                            {[1, 2, 3, 4].map(i => <div key={i} className="aspect-square bg-slate-100 rounded-xl"></div>)}
                        </div>
                    </div>
                    {/* Right: Info Skeleton */}
                    <div className="w-full lg:w-1/2 space-y-8">
                        <div className="space-y-4">
                            <div className="w-24 h-6 bg-slate-100 rounded"></div>
                            <div className="w-full h-12 bg-slate-100 rounded"></div>
                            <div className="w-48 h-6 bg-slate-100 rounded"></div>
                        </div>
                        <div className="w-32 h-10 bg-slate-100 rounded"></div>
                        <div className="space-y-3 pt-6 border-t border-slate-100">
                            <div className="w-full h-4 bg-slate-100 rounded"></div>
                            <div className="w-full h-4 bg-slate-100 rounded"></div>
                            <div className="w-3/4 h-4 bg-slate-100 rounded"></div>
                        </div>
                        <div className="flex gap-4 pt-4">
                            <div className="w-32 h-14 bg-slate-100 rounded-xl"></div>
                            <div className="flex-1 h-14 bg-slate-100 rounded-xl"></div>
                            <div className="w-14 h-14 bg-slate-100 rounded-xl"></div>
                        </div>
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
                <p className="text-slate-500 mb-8">The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
                <Button onClick={() => router.push('/products')}>Back to Catalog</Button>
            </div>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-6 pb-6 relative z-10">
            <button onClick={() => router.back()}
                className="flex items-center gap-2 text-slate-400 hover:text-brand-orange transition-colors font-bold uppercase text-[10px] tracking-widest mb-4 cursor-pointer">
                <ChevronLeft size={16} /> Back
            </button>

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                {/* Image Gallery */}
                <div className="w-full lg:w-1/2 space-y-4">
                    <div
                        onClick={() => setIsModalOpen(true)}
                        className="group aspect-square bg-white rounded-xl border border-slate-100 overflow-hidden shadow-2xl shadow-slate-200/50 flex items-center justify-center relative cursor-zoom-in"
                    >
                        <Image
                            src={selectedImage || product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover rounded-xl transition-transform duration-700 group-hover:scale-105"
                            priority
                        />
                        {/* Fullscreen Trigger Overlay */}
                        <div className="absolute inset-0 bg-brand-blue-dark/0 group-hover:bg-brand-blue-dark/5 transition-colors duration-300" />
                        <button
                            className="absolute bottom-4 right-4 p-3 bg-white/90 backdrop-blur-md rounded-full text-slate-700 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:text-brand-orange hover:scale-110 shadow-xl z-20"
                            title="View Fullscreen"
                        >
                            <Maximize2 size={20} />
                        </button>
                    </div>
                    {/* Thumbnails */}
                    {product.images && product.images.length > 0 && (
                        <div className="grid grid-cols-4 gap-3 md:gap-4 mt-6">
                            {/* Main Image Thumbnail */}
                            <button
                                onClick={() => setSelectedImage(product.imageUrl)}
                                className={`group relative aspect-square rounded-xl border-2 transition-all duration-300 overflow-hidden bg-white ${selectedImage === product.imageUrl || !selectedImage
                                    ? 'border-brand-orange shadow-md shadow-brand-orange/10 scale-[1.02]'
                                    : 'border-slate-100 hover:border-slate-300'
                                    }`}>
                                <Image 
                                    src={product.imageUrl} 
                                    alt="Main thumbnail" 
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110" 
                                />
                                {(selectedImage === product.imageUrl || !selectedImage) && <div className="absolute inset-0 bg-brand-orange/5" />}
                            </button>

                            {/* Additional Images Thumbnails */}
                            {product.images.slice(0, 4).map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedImage(img)}
                                    className={`group relative aspect-square rounded-xl border-2 transition-all duration-300 overflow-hidden bg-white ${selectedImage === img
                                        ? 'border-brand-orange shadow-md shadow-brand-orange/10 scale-[1.02]'
                                        : 'border-slate-100 hover:border-slate-300'
                                        }`}>
                                    <Image 
                                        src={img} 
                                        alt={`Thumbnail ${i + 1}`} 
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110" 
                                    />
                                    {selectedImage === img && <div className="absolute inset-0 bg-brand-orange/5" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="w-full lg:w-1/2 space-y-4">
                    <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-orange bg-brand-orange/10 px-3 py-1.5 rounded-sm inline-block mb-2">{product.category}</span>
                        <h1 className="text-4xl md:text-5xl font-black text-brand-blue-dark tracking-tight leading-tight">{product.name}</h1>

                        <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1 shadow-sm border border-slate-100 bg-white px-3 py-1.5 rounded-full">
                                <span className="text-sm font-black text-slate-700">{(product.averageRating || product.rating || 0).toFixed(1)}</span>
                                <div className="flex items-center gap-0.5 ml-1">
                                    {[1, 2, 3, 4, 5].map((_, i) => (
                                        <Star key={i} size={14} className={i < Math.round(product.averageRating || product.rating || 0) ? "fill-brand-orange text-brand-orange" : "fill-slate-100 text-slate-200"} />
                                    ))}
                                </div>
                            </div>
                            <span className="text-sm font-bold text-slate-400 underline decoration-slate-200 underline-offset-4 cursor-pointer hover:text-brand-orange">{product.totalReviews || product.reviews || 0} Reviews</span>
                        </div>

                        <div className="flex items-center gap-4 mt-4">
                            {product.offerPrice ? (
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="text-4xl font-black text-brand-orange">
                                        <span className="font-sans font-semibold mr-1" style={{ fontFamily: 'system-ui, Arial, sans-serif' }}>₹</span>
                                        {Number(product.offerPrice).toLocaleString('en-IN')}
                                    </span>
                                    <span className="text-xl text-slate-400 font-bold line-through">
                                        <span className="font-sans font-normal mr-0.5" style={{ fontFamily: 'system-ui, Arial, sans-serif' }}>₹</span>
                                        {Number(product.price).toLocaleString('en-IN')}
                                    </span>
                                    {product.offerPercentage && (
                                        <span className="text-sm font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-200 shadow-sm shadow-emerald-500/20">
                                            {product.offerPercentage}% OFF
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <span className="text-4xl font-black text-brand-blue-dark">
                                    <span className="font-sans font-semibold mr-1" style={{ fontFamily: 'system-ui, Arial, sans-serif' }}>₹</span>
                                    {Number(product.price).toLocaleString('en-IN')}
                                </span>
                            )}
                            <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${product.stock > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                                }`}>
                                {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                            </span>
                        </div>

                        <p className="text-slate-500 text-lg leading-relaxed pt-2 border-t border-slate-100">{product.description || "Experience the pinnacle of aerial technology. Designed for ultimate performance and reliability, this professional-grade drone solution is meticulously crafted to handle the most demanding environments across Asia seamlessly and securely."}</p>

                        {/* Highlights */}
                        <div className="grid grid-cols-2 gap-2 pt-1">
                            {["High Precision Engineering", "Certified Components", "Extended Battery Life", "Smart Tracking & Analytics"].map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-slate-600 text-sm font-semibold">
                                    <CheckCircle2 size={16} className="text-brand-orange shrink-0" />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-row flex-wrap items-center w-full gap-2.5 md:gap-3 pt-4">
                        <div className="flex items-center h-11 md:h-14 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden w-24 md:w-32 shrink-0">
                            <button
                                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                className="w-10 md:w-12 h-full flex items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-50 hover:text-brand-orange transition-colors active:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={quantity <= 1}
                            >
                                <Minus className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                            </button>
                            <div className="flex-1 h-full flex items-center justify-center font-bold text-slate-700 text-base md:text-lg border-x border-slate-100">
                                {quantity}
                            </div>
                            <button
                                onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                                className="w-10 md:w-12 h-full flex items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-50 hover:text-brand-orange transition-colors active:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={quantity >= product.stock}
                            >
                                <Plus className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                            </button>
                        </div>
                        <Button className="flex-1 min-w-[140px] py-3 md:py-4 h-11 md:h-14 text-xs md:text-sm tracking-widest shadow-xl shadow-brand-blue/20" icon={<ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />} onClick={handleAddToCart}>
                            Add to Cart
                        </Button>
                        <div className="flex gap-2.5 md:gap-3">
                            <button
                                onClick={handleToggleWishlist}
                                className={`w-11 md:w-14 h-11 md:h-14 rounded-xl transition-all active:scale-95 shadow-sm flex items-center justify-center border cursor-pointer ${isWishlisted ? 'bg-red-50 text-red-500 border-red-100 hover:bg-red-100' : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50 hover:text-red-500'}`}
                                title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                            >
                                <Heart className={`w-5 h-5 md:w-6 md:h-6 ${isWishlisted ? "fill-red-500" : ""}`} />
                            </button>
                            <button
                                onClick={handleShare}
                                className="w-11 md:w-14 h-11 md:h-14 bg-white border border-slate-200 text-slate-400 rounded-xl hover:bg-slate-50 hover:text-brand-blue-dark transition-all active:scale-95 shadow-sm flex items-center justify-center cursor-pointer"
                                title="Share this product"
                            >
                                <Share2 className="w-5 h-5 md:w-6 md:h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Specifications Section */}
            {product.specifications && product.specifications.length > 0 && (
                <div className="mt-8 pt-4 border-t border-slate-100">
                    <h2 className="text-2xl md:text-2xl font-black text-brand-blue-dark mb-4">Product Specifications</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
                        {product.specifications.map((spec, i) => (
                            <div key={i} className="pb-4 border-b border-slate-100">
                                <h3 className="text-sm font-black text-slate-900 mb-2 tracking-wide">{spec.label}</h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed">{spec.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Reviews Section */}
            {product && (
                <ProductReviews productId={product.id} />
            )}

            {/* Related Products Section */}
            {product && (
                <div className="mt-8 pt-4 border-t border-slate-100">
                    <ProductGrid
                        title="You May Also Like"
                        category={product.category}
                        limit={5}
                    />
                </div>
            )}

            {/* Professional Image Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-8">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-950/95 backdrop-blur-md transition-opacity duration-300"
                        onClick={() => setIsModalOpen(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative w-full h-full flex flex-col items-center justify-center z-10 p-4 pt-16 md:pt-20">
                        {/* Close Button */}
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-24 right-24 md:top-24 md:right-24 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-300 z-50 backdrop-blur-xl border border-white/10"
                        >
                            <X size={28} />
                        </button>

                        {/* Main Image Container */}
                        <div className="relative max-w-5xl w-full h-full flex items-center justify-center">
                            {/* Navigation Arrows */}
                            <button
                                onClick={() => {
                                    const allImages = [product.imageUrl, ...(product.images || [])];
                                    const curr = allImages.indexOf(selectedImage || product.imageUrl);
                                    const next = (curr - 1 + allImages.length) % allImages.length;
                                    setSelectedImage(allImages[next]);
                                }}
                                className="absolute left-0 md:-left-16 p-4 text-white/50 hover:text-white hover:bg-white/5 rounded-full transition-all duration-300"
                            >
                                <ChevronLeft size={48} />
                            </button>

                            <div className="relative w-full h-full max-h-[85vh]">
                                <Image
                                    src={selectedImage || product.imageUrl}
                                    alt={product.name}
                                    fill
                                    className="object-contain rounded-lg shadow-2xl transition-all duration-500 scale-100 select-none"
                                />
                            </div>

                            <button
                                onClick={() => {
                                    const allImages = [product.imageUrl, ...(product.images || [])];
                                    const curr = allImages.indexOf(selectedImage || product.imageUrl);
                                    const next = (curr + 1) % allImages.length;
                                    setSelectedImage(allImages[next]);
                                }}
                                className="absolute right-0 md:-right-16 p-4 text-white/50 hover:text-white hover:bg-white/5 rounded-full transition-all duration-300"
                            >
                                <ChevronRight size={48} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
