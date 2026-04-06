import HelpCenter from "@/components/support/HelpCenter";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Help & Support | Asia Drone Store",
    description: "Get assistance with your drone orders, tracking, warranty, and technical support. Our Help Center is here to provide answers and guide you through any issues.",
};
const gridPattern = {
        backgroundImage: `radial-gradient(#cbd5e1 1px, transparent 2px)`,
        backgroundSize: '32px 32px'
    };

export default function HelpPage() {
    return (
        <main className="w-full relative z-10 flex flex-col flex-1 bg-slate-50/50">
            <div className="absolute inset-0 -z-10 pointer-events-none opacity-40" style={gridPattern}></div>
            <HelpCenter />
        </main>
    );
}
