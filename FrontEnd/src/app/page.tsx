import BannerSlider from "@/components/home/BannerSlider";
import ProductGrid from "@/components/products/ProductGrid";

export default function Home() {
    return (
        <main className="w-full relative z-10 flex flex-col flex-1 overflow-x-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 md:w-[800px] md:h-[800px] bg-brand-blue/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>
            <div className="w-full">
                <BannerSlider />
                
                <section className="max-w-screen-3xl mx-auto px-4 md:px-8 py-10 md:py-10 space-y-10">
                    <ProductGrid title="Featured Selection" category="All Products" limit={5} />
                </section>
                <section className="max-w-screen-3xl mx-auto px-4 md:px-8 py-10 md:py-10 space-y-10">
                    <ProductGrid title="Spare Parts" category="Spare Parts" limit={5} />
                </section>
                <section className="max-w-screen-3xl mx-auto px-4 md:px-8 py-10 md:py-10 space-y-10">
                    <ProductGrid title="Premium Accessories" category="Accessories" limit={5} />
                </section>
            </div>
        </main>
    );
}