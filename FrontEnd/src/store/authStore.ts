import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/auth.service';

export interface UserAddress {
    id: string;
    type: string; // "Home", "Work", "Office", etc.
    address: string;
    city: string;
    state: string;
    pin: string;
    isPrimary: boolean;
}

export interface UserProfile {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    pin?: string;
    addresses?: UserAddress[];
    profileImage?: string;
    walletBalance?: number;
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
                        await authService.logout(refreshToken);
                    }
                } catch (error) {
                    console.error("Backend logout failed:", error);
                } finally {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('userData');
                    
                    // Also clear admin tokens just in case
                    localStorage.removeItem('adminAccessToken');
                    localStorage.removeItem('adminRefreshToken');
                    localStorage.removeItem('adminData');
                    
                    set({ user: null, accessToken: null });
                }
            },
        }),
        {
            name: 'ads-auth-storage',
        }
    )
);
