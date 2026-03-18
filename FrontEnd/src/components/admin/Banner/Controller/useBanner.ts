"use client";

import { useBannerLogic } from "@/hooks/useBannerLogic";
import { BannerManagerProps } from "../Model/banner";

export function useBannerManager(): BannerManagerProps {
    const {
        banners,
        loading,
        isAdding,
        setIsAdding,
        editingId,
        isSaving,
        isDeleting,
        bannerToDelete,
        setBannerToDelete,
        formData,
        setFormData,
        handleEdit,
        handleSubmit,
        confirmDelete,
        resetForm
    } = useBannerLogic();

    return {
        banners,
        loading,
        isAdding,
        setIsAdding,
        editingId,
        isSaving,
        isDeleting,
        bannerToDelete,
        setBannerToDelete,
        formData,
        setFormData,
        handleEdit,
        handleSubmit,
        confirmDelete,
        resetForm
    };
}
