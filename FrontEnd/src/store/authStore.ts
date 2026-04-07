import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/auth.service';
import { useCartStore } from './cartStore';
import { useWishlistStore } from './wishlistStore';
import { useNotificationStore } from './notificationStore';

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
    setAuth: (user: UserProfile | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            setAuth: (user) => set({ user }),
            logout: async () => {
                try {
                    await authService.logout();
                } catch (error) {
                    console.error("Backend logout failed:", error);
                } finally {
                    localStorage.removeItem('userData');

                    // Also clear admin data
                    localStorage.removeItem('adminData');

                    // Clear user-specific stores so new users get an empty cart/wishlist
                    useCartStore.getState().clearCart();
                    useWishlistStore.getState().clearWishlist();
                    useNotificationStore.getState().setNotifications([]);

                    set({ user: null });
                }
            },
        }),
        {
            name: 'ads-auth-storage',
        }
    )
);
