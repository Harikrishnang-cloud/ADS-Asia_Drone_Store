import HelpCenter from "@/components/support/HelpCenter";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Help & Support | Asia Drone Store",
    description: "Get assistance with your drone orders, tracking, warranty, and technical support. Our Help Center is here to provide answers and guide you through any issues.",
};

export default function HelpPage() {
    return (
        <main className="w-full">
            <HelpCenter />
        </main>
    );
}
