"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Download, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstall() {
  const pathname = usePathname();
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Only proceed if we are on the homepage
    if (pathname !== "/") return;

    const handleBeforeInstallPrompt = (e: Event) => {
      if (window.matchMedia('(display-mode: standalone)').matches) return;
      const displayCount = parseInt(localStorage.getItem("pwa_prompt_display_count") || "0");
      if (displayCount >= 4) return;
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      localStorage.setItem("pwa_prompt_display_count", (displayCount + 1).toString());
      setTimeout(() => setIsVisible(true), 5000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, [pathname]);

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    setIsInstalling(true);
    
    // Slight delay to show the nice loading state we're adding
    await new Promise(resolve => setTimeout(resolve, 800));

    // Show the browser install prompt
    await installPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await installPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    setInstallPrompt(null);
    setIsInstalling(false);
    setIsVisible(false);
  };

  if (!isVisible || !installPrompt) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-12 md:w-96 z-[100] animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 flex flex-col gap-4 relative overflow-hidden group">
        {/* Background Glow */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-brand-orange/20 blur-2xl rounded-full group-hover:bg-brand-orange/30 transition-all duration-500"></div>
        
        {!isInstalling ? (
          <>
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-3 right-3 text-slate-500 hover:text-white transition-colors"
              aria-label="Close">
              <X size={18} />
            </button>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                <Download className="text-brand-orange" size={24} />
              </div>
              <div className="flex-1 pr-6">
                <h3 className="text-white font-bold text-base">Get the ADS App</h3>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">
              Install our app for a faster shopping experience and instant drone updates.
                </p>
              </div>
            </div>

            <button onClick={handleInstallClick}
              className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white font-semibold py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-lg shadow-brand-orange/20">
              <Download size={16} />
              Install ADS App
            </button>
          </>
        ) : (
          <div className="py-6 flex flex-col items-center gap-6 animate-in zoom-in-95 duration-300">
            {/* Using the loading design requested */}
            <div className="animate-bounce duration-1000">
              <Logo width={60} height={60} className="w-12" imageClassName="w-full h-auto" />
            </div>
            
            <div className="flex flex-col items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-blue animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 rounded-full bg-brand-orange animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 rounded-full bg-brand-blue animate-bounce"></span>
              </div>
              <span className="text-slate-400 text-xs font-medium tracking-wide">Preparing Installation...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
