"use client";

import { useEffect, useState } from "react";
import { UserProfile } from "@/components/layout/Navbar";

export default function HomeClient() {
    const [user, setUser] = useState<UserProfile | null>(null);

    useEffect(() => {
        const storedUserStr = localStorage.getItem("userData");
        if (storedUserStr) {
            try {
                setUser(JSON.parse(storedUserStr));
            } catch (e) {
                console.error("Auth sync error", e);
            }
        }
    }, []);

    return (
        <>
            {user && user.role === 'user' && (
                <span className="block mt-4 text-brand-blue text-sm md:text-base animate-in fade-in slide-in-from-bottom-2 duration-700">
                    Welcome back, <span className="font-bold border-b border-brand-blue/20">{user.name}</span>!
                </span>
            )}
        </>
    );
}
