import type { FormEvent } from "react";
import { Banner, BannerFormData } from "@/types/banner.types";

export interface BannerManagerProps {
    banners: Banner[];
    loading: boolean;
    isAdding: boolean;
    setIsAdding: (isAdding: boolean) => void;
    editingId: string | null;
    isSaving: boolean;
    isDeleting: boolean;
    bannerToDelete: string | null;
    setBannerToDelete: (id: string | null) => void;
    formData: BannerFormData;
    setFormData: (formData: BannerFormData) => void;
    handleEdit: (banner: Banner) => void;
    handleSubmit: (e: FormEvent) => Promise<void>;
    confirmDelete: () => Promise<void>;
    resetForm: () => void;
}
