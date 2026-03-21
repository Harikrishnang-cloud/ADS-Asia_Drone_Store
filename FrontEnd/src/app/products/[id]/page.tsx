"use client";

import React, { useState } from "react";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import { Product } from "@/types/product.types";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, ShoppingCart, Share2, ShieldCheck, Truck, RefreshCw, Package, Heart, Star, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import ProductGrid from "@/components/products/ProductGrid";
import toast from "react-hot-toast";

function ImageMagnifier({ src }: { src: string }) {
    const [[x, y], setXY] = useState([0, 0]);
    const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
    const [showMagnifier, setShowMagnifier] = useState(false);
    const magnifierSize = 250;
    const zoomLevel = 2.5;

    return (
        <div className="relative w-full h-full cursor-none">
            <img
                src={src}
                className="w-full h-full object-cover"
                onMouseEnter={(e) => {
                    const elem = e.currentTarget;
                    const { width, height } = elem.getBoundingClientRect();
                    setSize([width, height]);
                    setShowMagnifier(true);
                }}
                onMouseMove={(e) => {
                    const elem = e.currentTarget;
                    const { top, left } = elem.getBoundingClientRect();
                    // Calculate mouse position relative to image
                    const x = e.clientX - left;
                    const y = e.clientY - top;
                    setXY([x, y]);
                }}
                onMouseLeave={() => setShowMagnifier(false)}
                alt="Product"
            />

            <div
                style={{
                    display: showMagnifier ? "block" : "none",
                    position: "absolute",
                    pointerEvents: "none",
                    height: `${magnifierSize}px`,
                    width: `${magnifierSize}px`,
                    top: `${y - magnifierSize / 2}px`,
                    left: `${x - magnifierSize / 2}px`,
                    opacity: "1",
                    border: "2px solid white",
                    backgroundColor: "white",
                    backgroundImage: `url('${src}')`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
                    backgroundPositionX: `${-x * zoomLevel + magnifierSize / 2}px`,
                    backgroundPositionY: `${-y * zoomLevel + magnifierSize / 2}px`,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
                    borderRadius: "8px", // small rounding for modern premium feel, but still a square
                    zIndex: 50
                }}
            />
        </div>
    );
}

export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { data: products, loading } = useFirestoreCollection<Product>({collectionName: "products"});
    const { addItem } = useCartStore();
    const { addItem: addWishlist, removeItem: removeWishlist, isInWishlist } = useWishlistStore();
    
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const product = React.useMemo(() => {
        return products.find(p => p.id === id);
    }, [products, id]);

    const isWishlisted = product ? isInWishlist(product.id) : false;

    const handleAddToCart = () => {
        if (!product) return;
        addItem({
            id: product.id,
            name: product.name,
            price: Number(product.offerPrice || product.price),
            image: product.imageUrl,
            quantity: 1
        });
        toast.success(`${product.name} added to cart!`);
    };

    const handleToggleWishlist = () => {
        if (!product) return;
        if (isWishlisted) {
            removeWishlist(product.id);
            toast.success("Removed from wishlist");
        } else {
            addWishlist({
                id: product.id,
                name: product.name,
                price: Number(product.offerPrice || product.price),
                image: product.imageUrl
            });
            toast.success("Added to wishlist");
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
            } catch (error) {
                console.log("Sharing cancelled or failed");
            }
        } else {
            // Fallback for desktop/unsupported browsers
            navigator.clipboard.writeText(window.location.href);
            toast.success("Product link copied to clipboard!");
        }
    };

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
            <button onClick={() => router.back()}
                className="flex items-center gap-2 text-slate-400 hover:text-brand-orange transition-colors font-bold uppercase text-[10px] tracking-widest mb-10 cursor-pointer">
                <ChevronLeft size={16} /> Back
            </button>

            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                {/* Image Gallery */}
                <div className="w-full lg:w-1/2 space-y-6">
                    <div className="group aspect-square bg-white rounded-md border border-slate-100 overflow-hidden shadow-2xl shadow-slate-200/50">
                        <ImageMagnifier src={selectedImage || product.imageUrl} />
                    </div>
                    {product.images && product.images.length > 0 && (
                        <div className="grid grid-cols-4 gap-4">
                            <div 
                                onClick={() => setSelectedImage(product.imageUrl)} 
                                className={`aspect-square rounded-2xl border ${selectedImage === product.imageUrl || !selectedImage ? 'border-brand-orange' : 'border-slate-100'} overflow-hidden bg-white hover:border-brand-orange transition-all cursor-pointer`}>
                                <img src={product.imageUrl} alt={`${product.name} Main`} className="w-full h-full object-cover" />
                            </div>
                            {product.images.map((img, i) => (
                                <div 
                                    key={i} 
                                    onClick={() => setSelectedImage(img)}
                                    className={`aspect-square rounded-2xl border ${selectedImage === img ? 'border-brand-orange' : 'border-slate-100'} overflow-hidden bg-white hover:border-brand-orange transition-all cursor-pointer`}>
                                    <img src={img} alt={`${product.name} ${i}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="w-full lg:w-1/2 space-y-8">
                    <div className="space-y-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-orange bg-brand-orange/10 px-3 py-1.5 rounded-sm inline-block mb-2">{product.category}</span>
                        <h1 className="text-4xl md:text-5xl font-black text-brand-blue-dark tracking-tight leading-tight">{product.name}</h1>
                        
                        <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1 shadow-sm border border-slate-100 bg-white px-3 py-1.5 rounded-full">
                                <span className="text-sm font-black text-slate-700">4.8</span>
                                <div className="flex items-center gap-0.5 ml-1">
                                    {[1, 2, 3, 4, 5].map((_, i) => (
                                        <Star key={i} size={14} className={i < 4 ? "fill-brand-orange text-brand-orange" : "fill-slate-100 text-slate-200"} />
                                    ))}
                                </div>
                            </div>
                            <span className="text-sm font-bold text-slate-400 underline decoration-slate-200 underline-offset-4 cursor-pointer hover:text-brand-orange">124 Reviews</span>
                        </div>

                        <div className="flex items-center gap-4 mt-8">
                            {product.offerPrice ? (
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="text-4xl font-black text-brand-orange">
                                        <span className="font-sans font-semibold mr-1" style={{fontFamily: 'system-ui, Arial, sans-serif'}}>₹</span>
                                        {Number(product.offerPrice).toLocaleString('en-IN')}
                                    </span>
                                    <span className="text-xl text-slate-400 font-bold line-through">
                                        <span className="font-sans font-normal mr-0.5" style={{fontFamily: 'system-ui, Arial, sans-serif'}}>₹</span>
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
                                    <span className="font-sans font-semibold mr-1" style={{fontFamily: 'system-ui, Arial, sans-serif'}}>₹</span>
                                    {Number(product.price).toLocaleString('en-IN')}
                                </span>
                            )}
                            <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                                product.stock > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                            }`}>
                                {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                            </span>
                        </div>

                        <p className="text-slate-500 text-lg leading-relaxed pt-4 border-t border-slate-100">{product.description || "Experience the pinnacle of aerial technology. Designed for ultimate performance and reliability, this professional-grade drone solution is meticulously crafted to handle the most demanding environments across Asia seamlessly and securely."}</p>
                        
                        {/* Highlights */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            {["High Precision Engineering", "Certified Components", "Extended Battery Life", "Smart Tracking & Analytics"].map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-slate-600 text-sm font-semibold">
                                    <CheckCircle2 size={16} className="text-brand-orange shrink-0" />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-6">
                        <Button 
                            className="flex-1 py-4 text-sm tracking-widest shadow-xl shadow-brand-blue/20" 
                            icon={<ShoppingCart size={20} />}
                            onClick={handleAddToCart}>
                            Add to Cart
                        </Button>
                        <Button 
                            className="flex-1 py-4 text-sm tracking-widest bg-brand-orange hover:bg-brand-orange-dark border-brand-orange shadow-xl shadow-brand-orange/20 text-white"
                        >
                            Buy Now
                        </Button>
                        <div className="flex gap-3">
                            <button 
                                onClick={handleToggleWishlist}
                                className={`w-14 h-14 rounded-xl transition-all active:scale-95 shadow-sm flex items-center justify-center border cursor-pointer ${isWishlisted ? 'bg-red-50 text-red-500 border-red-100 hover:bg-red-100' : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50 hover:text-red-500'}`}
                                title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                            >
                                <Heart size={24} className={isWishlisted ? "fill-red-500" : ""} />
                            </button>
                            <button 
                                onClick={handleShare}
                                className="w-14 h-14 bg-white border border-slate-200 text-slate-400 rounded-xl hover:bg-slate-50 hover:text-brand-blue-dark transition-all active:scale-95 shadow-sm flex items-center justify-center cursor-pointer"
                                title="Share this product"
                            >
                                <Share2 size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Features/Trust badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-slate-100">
                        {[
                            { icon: <ShieldCheck size={20} />, label: "Full Warranty", subtext: "1 Year Coverage" },
                            { icon: <Truck size={20} />, label: "Safe Express", subtext: "Free over ₹10k" },
                            { icon: <RefreshCw size={20} />, label: "Easy Returns", subtext: "Within 14 Days" }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col gap-2 items-center sm:items-start text-center sm:text-left bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <div className="p-2.5 bg-brand-blue/10 text-brand-blue-dark rounded-lg w-fit">
                                    {item.icon}
                                </div>
                                <div>
                                    <span className="block text-[11px] font-black uppercase tracking-widest text-slate-900">{item.label}</span>
                                    <span className="block text-[10px] font-bold text-slate-400 mt-1">{item.subtext}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Product Specifications Section */}
            {product.specifications && product.specifications.length > 0 && (
                <div className="mt-20 pt-16 border-t border-slate-100">
                    <h2 className="text-2xl md:text-3xl font-black text-brand-blue-dark mb-10">Product Specifications</h2>
                    
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

            {/* Related Products Section */}
            {product && (
                <div className="mt-24 pt-16 border-t border-slate-100">
                    <ProductGrid 
                        title="You May Also Like" 
                        category={product.category} 
                        limit={4} 
                    />
                </div>
            )}
        </main>
    );
}
