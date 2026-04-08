 "use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstall() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the default browser prompt
      e.preventDefault();
      // Store the event for later use
      setInstallPrompt(e as BeforeInstallPromptEvent);
      // Show our custom prompt UI after a short delay
      setTimeout(() => setIsVisible(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
       setIsVisible(false);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    // Show the browser install prompt
    await installPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await installPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    // We used the prompt, so clear it
    setInstallPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible || !installPrompt) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-12 md:w-96 z-[100] animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 flex flex-col gap-4 relative overflow-hidden group">
        {/* Background Glow */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-brand-orange/20 blur-2xl rounded-full group-hover:bg-brand-orange/30 transition-all duration-500"></div>
        
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-3 right-3 text-slate-500 hover:text-white transition-colors"
          aria-label="Close"
        >
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

        <button
          onClick={handleInstallClick}
          className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white font-semibold py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-lg shadow-brand-orange/20"
        >
          <Download size={16} />
          Install ADS App
        </button>
      </div>
    </div>
  );
}
