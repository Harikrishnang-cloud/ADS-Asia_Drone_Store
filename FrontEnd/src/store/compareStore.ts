import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CompareItem {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
}

interface CompareState {
    items: CompareItem[];
    addItem: (item: CompareItem) => void;
    removeItem: (id: string) => void;
    clearCompare: () => void;
    isInCompare: (id: string) => boolean;
}

export const useCompareStore = create<CompareState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) => {
                const currentItems = get().items;
                if (currentItems.length >= 3) {
                    throw new Error("You can only compare up to 3 items at a time.");
                }
                if (!currentItems.find((i) => i.id === item.id)) {
                    set({ items: [...currentItems, item] });
                }
            },
            removeItem: (id) => {
                set({ items: get().items.filter((i) => i.id !== id) });
            },
            clearCompare: () => set({ items: [] }),
            isInCompare: (id) => {
                return !!get().items.find((i) => i.id === id);
            },
        }),
        {
            name: 'ads-compare-storage',
        }
    )
);
