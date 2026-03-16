import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserProfile {
    id?: string;
    name: string;
    email: string;
    role: string;
}

interface AuthState {
    user: UserProfile | null;
    accessToken: string | null;
    setAuth: (user: UserProfile | null, token: string | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            setAuth: (user, token) => set({ user, accessToken: token }),
            logout: async () => {
                try {
                    const refreshToken = localStorage.getItem('refreshToken');
                    if (refreshToken) {
                        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7878'}/user/logout`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ refreshToken }),
                        });
                    }
                } catch (error) {
                    console.error("Backend logout failed:", error);
                } finally {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('userData');
                    set({ user: null, accessToken: null });
                }
            },
        }),
        {
            name: 'ads-auth-storage',
        }
    )
);
