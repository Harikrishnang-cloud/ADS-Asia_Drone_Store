import HomeClient from "@/components/home/HomeClient";
import BannerSlider from "@/components/home/BannerSlider";

export default function Home() {
    return (
        <main className="w-full relative z-10 flex flex-col items-center flex-1 pb-20">
            {/* Ambient Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 md:w-[800px] md:h-[800px] bg-brand-blue/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>
            
            <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 mt-6">
                <BannerSlider />
                
                <div className="text-center space-y-4 max-w-2xl mx-auto px-4 mt-12">
                    <p className="text-slate-500 text-lg md:text-xl font-medium tracking-tight bg-slate-100/50 backdrop-blur-sm px-6 py-2 rounded-full inline-block">
                        Home Sweet Home 😁
                    </p>
                    <HomeClient />
                </div>
            </div>
        </main>
    );
}