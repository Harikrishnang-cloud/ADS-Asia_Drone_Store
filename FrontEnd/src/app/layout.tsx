import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { Inter } from "next/font/google";
import { CustomToaster } from "@/components/ui/CustomToaster";
import { AuthProvider } from "@/context/AuthContext";
import { PWAInstall } from "@/components/layout/PWAInstall";
import CompareBar from "@/components/ui/CompareBar";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  metadataBase: new URL("https://asiadronestore.com"),
  title: "Asia Drone Store | Premium Drones, UAVs & Accessories in India",
  description: "Asia Drone Store is your trusted source for consumer, agricultural, and industrial drones in Thiruvananthapuram, Kerala, India. Buy premium drones, accessories, and spare parts.",
  keywords: ["drones India", "drone services in kerala", "drone repair kochi", "drone repair kerala", "buy drone kerala", 
    "buy drones online", "DJI drones Kerala", "agriculture drones", "industrial UAVs", "drone accessories", "Asia Drone Store Thiruvananthapuram"],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.webp",
    apple: "/log-ads.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Asia Drone Store",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Asia Drone Store | Premium Drones & Accessories",
    description: "Discover a wide range of drones and accessories for consumers, agriculture, and industries at Asia Drone Store, Kerala, India.",
    url: "https://asiadronestore.com",
    siteName: "Asia Drone Store",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Asia Drone Store | Premium Drones",
    description: "Top-quality consumer and agricultural drones from Asia Drone Store.",
  },
};

export const viewport = {
  themeColor: "#004b93",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Asia Drone Store",
    "url": "https://asiadronestore.com",
    "logo": "https://asiadronestore.com/log-ads.png",
    "description": "Premium Drones & Accessories store in Asia",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Thiruvananthapuram, Kottayam",
      "addressRegion": "Kerala",
      "addressCountry": "IN"
    }
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Asia Drone Store",
    "image": "https://asiadronestore.com/log-ads.png",
    "url": "https://asiadronestore.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Thiruvananthapuram, Kottayam",
      "addressRegion": "Kerala",
      "addressCountry": "IN"
    }
  };

  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`bg-slate-50 text-slate-800 relative overflow-x-hidden min-h-screen flex flex-col`}
        style={{ fontFamily: `'RupeeSystem', ${inter.style.fontFamily}` }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
        
        <AuthProvider>
          <CustomToaster />
          <div className="fixed -top-10 -left-10 w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] rounded-full bg-brand-blue/5 blur-[80px] md:blur-[120px] pointer-events-none -z-10"></div>
          <div className="fixed bottom-0 -right-10 w-[200px] sm:w-[300px] md:w-[400px] h-[200px] sm:h-[300px] md:h-[400px] rounded-full bg-brand-orange/5 blur-[80px] md:blur-[120px] pointer-events-none -z-10"></div>
          <Navbar />
          <main>
            {children}
          </main>
          <Footer />
          <MobileNav />
          <CompareBar />
          <PWAInstall />
        </AuthProvider>
      </body>
    </html>
  );
}