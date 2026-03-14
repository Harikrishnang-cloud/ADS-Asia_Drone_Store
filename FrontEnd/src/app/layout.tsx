import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Asia Drone Store",
  description: "Drone e-commerce platform by asia softlab",
};

import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-slate-50 text-slate-800 font-sans relative overflow-x-hidden min-h-screen flex flex-col">
        <Toaster position="top-center" reverseOrder={false} />
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