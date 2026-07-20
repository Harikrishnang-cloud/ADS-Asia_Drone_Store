import BannerSlider from "@/components/home/BannerSlider";
import ProductGrid from "@/components/products/ProductGrid";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Asia Drone Store | Buy Premium Drones, UAVs & Accessories in India",
    description: "Explore the finest collection of professional drones, agricultural UAVs, FPV drones, and high-quality drone accessories at Asia Drone Store. We serve Thiruvananthapuram, Kerala, and all of India.",
    keywords: "drones, DJI, agricultural drones, drone accessories, Asia Drone Store, UAV, professional drones, drone repair, drone parts, FPV drones, Thiruvananthapuram, Kerala, India",
    alternates: {
        canonical: "https://asiadronestore.com",
    },
    openGraph: {
        title: "Asia Drone Store | Buy Premium Drones & Accessories",
        description: "Your ultimate destination for professional consumer drones, agriculture drones, industrial UAVs, and accessories in Kerala, India.",
        url: "https://asiadronestore.com",
        siteName: "Asia Drone Store",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Asia Drone Store - Premium Drones",
            },
        ],
        locale: "en_IN",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Asia Drone Store | Premium Drones & Accessories",
        description: "Your ultimate destination for professional drones and aerial technology.",
        images: ["/log-ads.png"],
    },

    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export default function Home() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Asia Drone Store",
        "url": "https://asiadronestore.com",
        "description": "Premium Drones & Accessories store in Asia",
        "logo": "https://asiadronestore.com/log-ads.png",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://asiadronestore.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };

    return (
        <main className="w-full relative z-10 flex flex-col flex-1 overflow-x-hidden">
            <h1 className="sr-only">Buy Drones Online India - Consumer, Agriculture, Industrial UAVs, FPV Drones & Accessories at Asia Drone Store</h1>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="absolute inset-0 -z-20 pointer-events-none opacity-40"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] md:w-[700px] h-[300px] sm:h-[500px] md:h-[700px] bg-brand-blue/5 rounded-full blur-[40px] md:blur-[120px] pointer-events-none -z-10"></div>
            <div className="w-full">
                <BannerSlider />
                <div className="flex flex-col gap-6 md:gap-12 py-8 md:py-16">
                    <ProductGrid title="Featured Selection" category="Drones" limit={5} className="max-w-screen-3xl mx-auto px-4 md:px-8" />
                    <ProductGrid title="Spare Parts" category="Spare Parts" limit={5} className="max-w-screen-3xl mx-auto px-4 md:px-8" />
                    <ProductGrid title="Premium Accessories" category="Accessories" limit={5} className="max-w-screen-3xl mx-auto px-4 md:px-8" />

                    {/* Condensed Footer SEO Text */}
                    <div className="max-w-screen-3xl mx-auto px-6 md:px-8 w-full">
                        <div className="border-t border-slate-200 pt-6">
                            <h2 className="text-sm font-bold text-slate-700 mb-2">Your Trusted Drone Partner in India</h2>
                            <p className="text-xs text-slate-400 leading-relaxed text-justify">
                                Asia Drone Store, headquartered in Thiruvananthapuram, Kerala, is India&apos;s premier destination for high-performance aerial technology. We specialize in offering a comprehensive range of genuine DJI consumer drones, advanced agriculture drones for precision farming, and rugged industrial UAVs for surveying and mapping. Backed by our expert technical support, dedicated drone repair services in Kochi and Kerala, and nationwide fast shipping, we ensure that both hobbyists and enterprise professionals have access to the best drone accessories and spare parts on the market. Buy drones online with confidence and elevate your aerial experience with us.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}