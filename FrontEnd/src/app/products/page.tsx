import ProductGrid from "@/components/products/ProductGrid";

export default function ProductsPage() {
    return (
        <main className="max-w-screen-2xl mx-auto px-4 sm:px-8 pt-24 md:pt-32 pb-12 md:pb-24 relative z-10 w-full flex-1 min-h-screen">
            <div className="flex flex-col mb-16 relative">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-orange mb-3">Asia Drone Store Inventory</span>
                <h1 className="text-4xl md:text-6xl font-black text-brand-blue-dark mb-4 tracking-tighter">Professional <br/> Drone Solutions</h1>
                <p className="text-slate-400 font-medium max-w-xl text-lg">Browse our elite selection of UAVs, high-performance parts, and specialized accessories engineered for Asia's unique flight conditions.</p>
            </div>
            
            <ProductGrid />
        </main>
    );
}
