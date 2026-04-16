"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { collection, getDocs, query } from "firebase/firestore";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Banner {
    id: string;
    title: string;
    imageUrl: string;
    videoUrl?: string;
    type?: "image" | "video";
    link: string;
    status: "active" | "inactive";
    createdAt?: number;
}

export default function BannerSlider() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActiveBanners = async () => {
            try {
                // Simplified query to avoid missing index errors
                const q = query(collection(db, "banners"));
                const querySnapshot = await getDocs(q);

                const bannerData = querySnapshot.docs
                    .map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    } as Banner))
                    .filter(b => b.status === "active") // Filter in JS
                    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)); // Sort in JS

                setBanners(bannerData);
            } catch (error) {
                console.error("Error fetching banners:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchActiveBanners();
    }, []);

    // Auto-slide logic with dynamic timing for video
    useEffect(() => {
        if (banners.length <= 1) return;

        const currentBanner = banners[current];
        const duration = currentBanner?.type === "video" ? 15000 : 5000; // 15s for video, 5s for images

        const timer = setInterval(() => {
            setCurrent(prev => (prev === banners.length - 1 ? 0 : prev + 1));
        }, duration);

        return () => clearInterval(timer);
    }, [banners, current]);

    if (loading) {
        return <div className="w-full h-[60vh] md:h-screen bg-slate-100 animate-pulse"></div>;
    }

    if (banners.length === 0) return null;

    const nextSlide = () => setCurrent(current === banners.length - 1 ? 0 : current + 1);
    const prevSlide = () => setCurrent(current === 0 ? banners.length - 1 : current - 1);

    return (
        <div className="relative w-full group overflow-hidden shadow-2xl">
            {/* Slides */}
            <div
                className="flex transition-transform duration-1000 cubic-bezier(0.4, 0, 0.2, 1) h-[60vh] sm:h-[75vh] lg:h-screen"
                style={{ transform: `translateX(-${current * 100}%)` }}>
                {banners.map((banner) => (
                    <div key={banner.id} className="min-w-full h-full relative">
                        {banner.type === "video" && banner.videoUrl ? (
                            <video
                                src={banner.videoUrl}
                                poster={banner.imageUrl}
                                className="w-full h-full object-cover select-none"
                                autoPlay
                                loop
                                muted
                                playsInline
                            />
                        ) : (
                            <Image
                                src={banner.imageUrl}
                                alt={banner.title}
                                fill
                                priority={banners.indexOf(banner) < 3}
                                className="w-full h-full object-cover select-none"
                                sizes="100vw"
                            />
                        )}

                        {/* Responsive Content Container */}
                        <div className="absolute inset-0 flex items-center">
                            <div className="container mx-auto px-6 md:px-12 lg:px-20">
                                <div className="max-w-3xl text-white">
                                    <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-6 uppercase tracking-tighter leading-none animate-in slide-in-from-bottom-8 duration-1000 drop-shadow-2xl">
                                        {banner.title}
                                    </h2>
                                    {banner.link && (
                                        <div className="animate-in slide-in-from-bottom-12 duration-1000 delay-300">
                                            <a href={banner.link}
                                                className="inline-flex items-center gap-3 bg-brand-orange hover:bg-white hover:text-brand-orange px-6 py-3 md:px-10 md:py-4 rounded-full font-black uppercase text-xs md:text-sm tracking-widest transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-orange/40">
                                                Explore Now
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {banners.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 md:p-5 rounded-full bg-white/5 backdrop-blur-xl text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-brand-orange hover:border-brand-orange hidden sm:flex items-center justify-center z-20">
                        <ChevronLeft size={28} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 md:p-5 rounded-full bg-white/5 backdrop-blur-xl text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-brand-orange hover:border-brand-orange hidden sm:flex items-center justify-center z-20">
                        <ChevronRight size={28} />
                    </button>

                    {/* Premium Pulse Indicators */}
                    <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
                        {banners.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className={`group relative h-1.5 transition-all duration-500 rounded-full ${current === i ? "w-12 bg-brand-orange" : "w-4 bg-white/30 hover:bg-white/60"
                                    }`}>
                                <span className={`absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white transition-opacity duration-300 ${current === i ? "opacity-100" : "opacity-0"}`}>
                                </span>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
