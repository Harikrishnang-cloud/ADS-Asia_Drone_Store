import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    rating?: number;
    reviews?: number;
    weight?: number;
    dimensions?: {
        length: number;
        width: number;
        height: number;
    };
    originalPrice?: number;
    offerPercentage?: number;
    stock?: number;
}

interface CartState {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getTotalPrice: () => number;
    getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) => {
                const currentItems = get().items;
                const existingItem = currentItems.find((i) => i.id === item.id);
                if (existingItem) {
                    set({
                        items: currentItems.map((i) =>
                            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
                        ),
                    });
                } else {
                    set({ items: [...currentItems, item] });
                }
            },
            removeItem: (id) => {
                set({ items: get().items.filter((i) => i.id !== id) });
            },
            updateQuantity: (id, quantity) => {
                const currentItems = get().items;
                const item = currentItems.find((i) => i.id === id);
                
                if (item && item.stock !== undefined) {
                    const productId = item.id.split('-combo-')[0];
                    if (quantity > item.quantity) {
                        const totalQty = currentItems
                            .filter(i => i.id.startsWith(productId))
                            .reduce((sum, i) => sum + i.quantity, 0);
                            
                        const diff = quantity - item.quantity;
                        
                        if (totalQty + diff > item.stock) {
                            toast.error(`Cannot add more. Only ${item.stock} items available in stock.`);
                            return;
                        }
                    }
                }

                set({
                    items: currentItems.map((i) =>
                        i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
                    ),
                });
            },
            clearCart: () => set({ items: [] }),
            getTotalPrice: () => {
                return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
            },
            getItemCount: () => {
                return get().items.reduce((count, item) => count + item.quantity, 0);
            },
        }),
        {
            name: 'ads-cart-storage',
        }
    )
);
