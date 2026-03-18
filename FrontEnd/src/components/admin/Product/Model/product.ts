import { Product, ProductFormData } from "@/types/product.types";
import React from "react";

export interface ProductManagerProps {
    products: Product[];
    loading: boolean;
    isAdding: boolean;
    setIsAdding: (isAdding: boolean) => void;
    editingId: string | null;
    isSaving: boolean;
    isDeleting: boolean;
    productToDelete: string | null;
    setProductToDelete: (id: string | null) => void;
    formData: ProductFormData;
    setFormData: (formData: ProductFormData) => void;
    handleEdit: (product: Product) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    confirmDelete: () => Promise<void>;
    resetForm: () => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    stats: {
        total: number;
        active: number;
        lowStock: number;
    };
}
