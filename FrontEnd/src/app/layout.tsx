import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Asia Drone Store",
  description: "Drone e-commerce platform by asia softlab",
  icons: {
    icon: "/favicon.webp",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`bg-slate-50 text-slate-800 relative overflow-x-hidden min-h-screen flex flex-col`}
        style={{ fontFamily: `'RupeeSystem', ${poppins.style.fontFamily}` }}>
        <Toaster />

        <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand-blue/5 blur-[500px] pointer-events-none -z-10"></div>
        <div className="fixed bottom-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-brand-orange/5 blur-[100px] pointer-events-none -z-10"></div>

        <Navbar />

        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}