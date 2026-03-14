import HomeClient from "@/components/home/HomeClient";
import BannerSlider from "@/components/home/BannerSlider";

export default function Home() {
    return (
        <main className="w-full relative z-10 flex flex-col flex-1 pb-20 overflow-x-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 md:w-[800px] md:h-[800px] bg-brand-blue/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>
            
            <div className="w-full">
                <BannerSlider />
            </div>
            
            <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 mx-auto mt-12">
                {/* Home Content */}
            </div>
        </main>
    );
}