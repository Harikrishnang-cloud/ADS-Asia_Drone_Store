"use client";

import React, { useState, useMemo } from "react";
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
        link: "",
        status: "active"
    });

    const resetForm = () => {
        setFormData({ title: "", imageUrl: "", link: "", status: "active" });
        setEditingId(null);
        setIsAdding(false);
    };

    const handleEdit = (banner: Banner) => {
        setFormData({
            title: banner.title,
            imageUrl: banner.imageUrl,
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
            if (editingId) {
                await updateDoc(doc(db, "banners", editingId), {...formData, updatedAt: Date.now()});
                toast.success("Banner updated successfully", { id: loadingToast });
            } else {
                await addDoc(collection(db, "banners"), {...formData, createdAt: Date.now()});
                toast.success("Banner created successfully", { id: loadingToast });
            }
            resetForm();
            fetchBanners();
        } catch (error: any) {
            console.error("Error saving banner:", error);
            toast.error(error.message || "Failed to save banner", { id: loadingToast });
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
        } catch (error: any) {
            console.error("Error deleting banner:", error);
            toast.error(error.message || "Failed to delete banner", { id: loadingToast });
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
