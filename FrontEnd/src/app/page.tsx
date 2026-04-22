import BannerSlider from "@/components/home/BannerSlider";
import ProductGrid from "@/components/products/ProductGrid";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Asia Drone Store | Premium Drones & Accessories",
    description: "Explore the finest collection of professional drones, agricultural UAVs, and high-quality drone accessories. Asia Drone Store provides cutting-edge aerial solutions for enthusiasts and professionals alike.",
    keywords: "drones, DJI, agricultural drones, drone accessories, Asia Drone Store, UAV, professional drones, drone repair, drone parts",
    alternates: {
        canonical: "https://asiadronestore.online",
    },
    openGraph: {
        title: "Asia Drone Store | Premium Drones & Accessories",
        description: "Explore the finest collection of professional drones and accessories. Your one-stop shop for high-performance aerial technology.",
        url: "https://asiadronestore.online",
        siteName: "Asia Drone Store",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Asia Drone Store - Premium Drones",
            },
        ],
        locale: "en_US",
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
        "url": "https://asiadronestore.online",
        "description": "Premium Drones & Accessories store in Asia",
        "logo": "https://asiadronestore.online/log-ads.png",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://asiadronestore.online/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };

    return (
        <main className="w-full relative z-10 flex flex-col flex-1 overflow-x-hidden">
            <h1 className="sr-only">Asia Drone Store - Premium Drones, UAVs and Accessories in Asia</h1>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="absolute inset-0 -z-20 pointer-events-none opacity-40"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] md:w-[700px] h-[300px] sm:h-[500px] md:h-[700px] bg-brand-blue/5 rounded-full blur-[40px] md:blur-[120px] pointer-events-none -z-10"></div>
            <div className="w-full">

                <BannerSlider />
                <div className="flex flex-col gap-6 md:gap-12 py-8 md:py-16">
                    <section className="max-w-screen-3xl mx-auto px-4 md:px-8 w-full">
                        <ProductGrid title="Featured Selection" category="All Products" limit={5} />
                    </section>

                    <section className="max-w-screen-3xl mx-auto px-4 md:px-8 w-full">
                        <ProductGrid title="Spare Parts" category="Spare Parts" limit={5} />
                    </section>
                    
                    <section className="max-w-screen-3xl mx-auto px-4 md:px-8 w-full">
                        <ProductGrid title="Premium Accessories" category="Accessories" limit={5} />
                    </section>
                </div>
            </div>
        </main>
    );
}