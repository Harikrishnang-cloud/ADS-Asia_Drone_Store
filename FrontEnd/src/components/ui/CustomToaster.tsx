"use client";

import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";

export function CustomToaster() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        // Initial check
        checkMobile();
        
        // Listen for window resize
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <Toaster 
            position={isMobile ? "bottom-center" : "top-center"}
            toastOptions={{ 
                className: 'responsive-toast' 
            }} 
            containerClassName="responsive-toast-container"
        />
    );
}
