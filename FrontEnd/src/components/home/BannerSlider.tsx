"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Banner {
    id: string;
    title: string;
    imageUrl: string;
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

    // Auto-slide every 5 seconds
    useEffect(() => {
        if (banners.length <= 1) return;
        
        const timer = setInterval(() => {
            setCurrent(prev => (prev === banners.length - 1 ? 0 : prev + 1));
        }, 5000);
        
        return () => clearInterval(timer);
    }, [banners]);

    if (loading) {
        return <div className="w-full h-[300px] md:h-[500px] bg-slate-100 rounded-3xl animate-pulse mb-10"></div>;
    }

    if (banners.length === 0) return null;

    const nextSlide = () => setCurrent(current === banners.length - 1 ? 0 : current + 1);
    const prevSlide = () => setCurrent(current === 0 ? banners.length - 1 : current - 1);

    return (
        <div className="relative w-full group mb-12 overflow-hidden rounded-[2rem] md:rounded-[3rem] shadow-2xl">
            {/* Slides */}
            <div 
                className="flex transition-transform duration-700 ease-in-out h-[300px] md:h-[500px]"
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {banners.map((banner) => (
                    <div key={banner.id} className="min-w-full h-full relative">
                        <img 
                            src={banner.imageUrl} 
                            alt={banner.title} 
                            className="w-full h-full object-cover"
                        />
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                        
                        {/* Content */}
                        <div className="absolute bottom-10 left-10 md:bottom-16 md:left-16 text-white max-w-xl">
                            <h2 className="text-3xl md:text-6xl font-black mb-4 uppercase tracking-tighter animate-in slide-in-from-bottom-4 duration-700 drop-shadow-lg">
                                {banner.title}
                            </h2>
                            {banner.link && (
                                <a 
                                    href={banner.link}
                                    className="inline-flex items-center gap-2 bg-brand-orange hover:bg-white hover:text-brand-orange px-8 py-3 rounded-full font-black uppercase text-sm tracking-widest transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-brand-orange/30"
                                >
                                    Explore Now
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            {banners.length > 1 && (
                <>
                    <button 
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button 
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20"
                    >
                        <ChevronRight size={24} />
                    </button>
                    
                    {/* Indicators */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                        {banners.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className={`w-3 h-3 rounded-full transition-all ${
                                    current === i ? "bg-brand-orange w-8" : "bg-white/40 hover:bg-white/60"
                                }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
