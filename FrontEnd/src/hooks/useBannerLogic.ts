"use client";

import React, { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import toast from "react-hot-toast";
import { useFirestoreCollection } from "./useFirestore";
import { Banner, BannerFormData } from "@/types/banner.types";

export const useBannerLogic = () => {
    const { 
        data: banners, 
        loading, 
        refresh: fetchBanners 
    } = useFirestoreCollection<Banner>({
        collectionName: "banners",
        orderByField: "createdAt",
        orderDirection: "desc"
    });

    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [bannerToDelete, setBannerToDelete] = useState<string | null>(null);

    const [formData, setFormData] = useState<BannerFormData>({
        title: "",
        imageUrl: "",
        videoUrl: "",
        type: "image",
        link: "",
        status: "active"
    });

    const resetForm = () => {
        setFormData({ title: "", imageUrl: "", videoUrl: "", type: "image", link: "", status: "active" });
        setEditingId(null);
        setIsAdding(false);
    };

    const handleEdit = (banner: Banner) => {
        setFormData({
            title: banner.title,
            imageUrl: banner.imageUrl,
            videoUrl: banner.videoUrl || "",
            type: banner.type || "image",
            link: banner.link,
            status: banner.status
        });
        setEditingId(banner.id);
        setIsAdding(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const loadingToast = toast.loading(editingId ? "Updating banner..." : "Creating banner...");
        
        try {
            const dataToSave = {
                ...formData,
                updatedAt: Date.now()
            };
            
            // Cleanup: ensure redundant data is removed based on type
            if (dataToSave.type === 'image') {
                delete dataToSave.videoUrl;
            }

            if (editingId) {
                await updateDoc(doc(db, "banners", editingId), dataToSave);
                toast.success("Banner updated successfully", { id: loadingToast });
            } else {
                await addDoc(collection(db, "banners"), { ...dataToSave, createdAt: Date.now() });
                toast.success("Banner created successfully", { id: loadingToast });
            }
            resetForm();
            fetchBanners();
        } catch (error: unknown) {
            console.error("Error saving banner:", error);
            const err = error as { message?: string };
            toast.error(err.message || "Failed to save banner", { id: loadingToast });
        } finally {
            setIsSaving(false);
        }
    };

    const confirmDelete = async () => {
        if (!bannerToDelete) return;
        
        setIsDeleting(true);
        const loadingToast = toast.loading("Deleting banner...");
        try {
            await deleteDoc(doc(db, "banners", bannerToDelete));
            toast.success("Banner deleted successfully", { id: loadingToast });
            setBannerToDelete(null);
            fetchBanners();
        } catch (error: unknown) {
            console.error("Error deleting banner:", error);
            const err = error as { message?: string };
            toast.error(err.message || "Failed to delete banner", { id: loadingToast });
        } finally {
            setIsDeleting(false);
        }
    };

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
};
