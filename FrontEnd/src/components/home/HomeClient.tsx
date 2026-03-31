"use client";

import { useAuthStore } from "@/store/authStore";

export default function HomeClient() {
    const { user } = useAuthStore();

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
