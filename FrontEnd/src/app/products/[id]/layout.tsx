import { Metadata } from "next";
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const fallbackMetadata: Metadata = {
    title: "Product Not Found | Asia Drone Store",
    description: "The requested product could not be found.",
    keywords: ["drones", "buy drones online", "Asia Drone Store", "camera drones", "racing drones"],
    alternates: {
        canonical: "https://asiadronestore.com",
    },
    openGraph: {
        title: "Product Not Found | Asia Drone Store",
        description: "The requested product could not be found.",
        images: [
            {
                url: "https://asiadronestore.com/log-ads.png",
                width: 1200,
                height: 630,
                alt: "Asia Drone Store - Product Not Found",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Product Not Found | Asia Drone Store",
        description: "The requested product could not be found.",
        images: ["https://asiadronestore.com/log-ads.png"],
    },
    robots: {
        index: false,
        follow: false,
        googleBot: {
            index: false,
            follow: false,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    try {
        const resolvedParams = await params;
        const productRef = doc(db, 'products', resolvedParams.id);
        const productSnap = await getDoc(productRef);
        
        if (productSnap.exists()) {
            const product = productSnap.data();
            return {
                title: `${product.name} | Asia Drone Store`,
                description: product.description || `Buy ${product.name} at the best price from Asia Drone Store.`,
                keywords: [product.name, product.category, product.subCategory, "buy drone", "Asia Drone Store"].filter(Boolean) as string[],
                alternates: {
                    canonical: `https://asiadronestore.com/products/${resolvedParams.id}`,
                },
                openGraph: {
                    title: `${product.name} | Asia Drone Store`,
                    description: product.description || `Buy ${product.name} at the best price from Asia Drone Store.`,
                    images: product.imageUrl ? [
                        {
                            url: product.imageUrl,
                            width: 1200,
                            height: 630,
                            alt: product.name,
                        }
                    ] : [
                        {
                            url: "https://asiadronestore.com/log-ads.png",
                            width: 1200,
                            height: 630,
                            alt: "Asia Drone Store",
                        }
                    ],
                    locale: "en_US",
                    type: "website",
                },
                twitter: {
                    card: "summary_large_image",
                    title: `${product.name} | Asia Drone Store`,
                    description: product.description || `Buy ${product.name} at the best price from Asia Drone Store.`,
                    images: product.imageUrl ? [product.imageUrl] : ["https://asiadronestore.com/log-ads.png"],
                },
                robots: {
                    index: true,
                    follow: true,
                }
            };
        }
    } catch (error) {
        console.error("Error fetching product metadata:", error);
    }
    
    return fallbackMetadata;
}

export default function ProductLayout({children}:{
    children:React.ReactNode;
}){
    return <>{children}</>;
}