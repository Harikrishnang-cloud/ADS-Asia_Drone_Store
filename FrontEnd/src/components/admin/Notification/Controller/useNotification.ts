import React, { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/firebase";
import {collection, addDoc, getDocs, deleteDoc, doc, query, orderBy} from "firebase/firestore";
import toast from "react-hot-toast";
import { Notification } from "../Model/notification";

function useNotification(){
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [notificationToDelete, setNotificationToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        message: "",
        type: "info" as "offer" | "info" | "alert"
    });

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Notification));
            setNotifications(data);
        } catch {
            toast.error("Failed to load notifications");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.message) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsSaving(true);
        const loadingToast = toast.loading("Sending...");

        try {
            await addDoc(collection(db, "notifications"), {
                ...formData,
                createdAt: Date.now()
            });
            toast.success("Notification sent!", { id: loadingToast });
            setIsAdding(false);
            resetForm();
            fetchNotifications();
        } catch {
            toast.error("Failed to send", { id: loadingToast });
        } finally {
            setIsSaving(false);
        }
    };

    const confirmDelete = async () => {
        if (!notificationToDelete) return;
        setIsDeleting(true);
        try {
            await deleteDoc(doc(db, "notifications", notificationToDelete));
            toast.success("Deleted");
            setNotificationToDelete(null);
            fetchNotifications();
        } catch {
            toast.error("Delete failed");
        } finally {
            setIsDeleting(false);
        }
    }
    const resetForm = () => {
        setFormData({ title: "", message: "", type: "info" as "offer" | "info" | "alert" });
    }
    const toggleIsAdding = () => {
        setIsAdding(!isAdding);
    }
    const formdataUpdate = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }
    return{
        notifications,
        loading,
        isAdding,
        isSaving,
        notificationToDelete,
        isDeleting,
        formData,
        fetchNotifications,
        handleSubmit,
        confirmDelete,
        toggleIsAdding,
        setFormData,
        setNotificationToDelete,
        formdataUpdate
    }
}

export default useNotification;