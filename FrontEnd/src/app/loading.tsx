import { Logo } from "@/components/ui/Logo";

export default function Loading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full min-h-[60vh] relative z-10 px-4">
      {/* Soft Glow Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 bg-brand-blue/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      {/* Brand Animation */}
      <div className="relative flex flex-col items-center gap-6">
        <div className="animate-bounce duration-1000">
          <Logo width={100} height={100} />
        </div>
        
        {/* Modern Loading Indicator */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-blue animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-2 h-2 rounded-full bg-brand-orange animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-2 h-2 rounded-full bg-brand-blue animate-bounce"></span>
          </div>
          <span className="text-slate-400 text-sm font-medium tracking-wide">Loading Experience...</span>
        </div>
      </div>
    </div>
  );
}
