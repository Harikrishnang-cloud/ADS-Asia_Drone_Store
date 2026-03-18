"use client";

import { useProductLogic } from "@/hooks/useProductLogic";
import { ProductManagerProps } from "../Model/product";

export function useProductManager(initialCategory?: string): ProductManagerProps {
    const {products,loading,isAdding,setIsAdding,editingId,isSaving,isDeleting,productToDelete,setProductToDelete,
        formData,setFormData,handleEdit,handleSubmit,confirmDelete,resetForm,searchTerm,setSearchTerm,stats} = useProductLogic(initialCategory);

    return {products,loading,isAdding,setIsAdding,editingId,isSaving,isDeleting,productToDelete,setProductToDelete,formData,
        setFormData,handleEdit,handleSubmit,confirmDelete,resetForm,searchTerm,setSearchTerm,stats
    };
}
