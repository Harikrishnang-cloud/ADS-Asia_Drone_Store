"use client";

import { useState, useMemo } from "react";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { useFirestoreCollection } from "./useFirestore";
import { User } from "@/types/user.types";

export const useUserLogic = () => {
    const { 
        data: users, 
        setData: setUsers, 
        loading, 
        refresh: fetchUsers 
    } = useFirestoreCollection<User>({
        collectionName: "users",
        orderByField: "createdAt",
        orderDirection: "desc"
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [userToUpdate, setUserToUpdate] = useState<User | null>(null);

    const filteredUsers = useMemo(() => {
        return users.filter(user => 
            (user.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
            (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    const handleToggleStatus = async () => {
        if (!userToUpdate) return;
        
        const user = userToUpdate;
        const newStatus = user.status === "active" ? "blocked" : "active";
        
        setUserToUpdate(null);
        setUpdatingId(user.id);
        const loadingToast = toast.loading(`${newStatus === "blocked" ? "Blocking" : "Unblocking"} user...`);
        
        try {
            const userRef = doc(db, "users", user.id);
            await updateDoc(userRef, {
                status: newStatus,
                updatedAt: Date.now()
            });
            
            setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
            toast.success(`User ${newStatus === "blocked" ? "blocked" : "unblocked"} successfully`, { id: loadingToast });
        } catch (error: unknown) {
            const err = error as { message?: string };
            console.error("Error updating user status:", err);
            toast.error(err.message || "Failed to update user status", { id: loadingToast });
        } finally {
            setUpdatingId(null);
        }
    };

    const stats = useMemo(() => ({
        total: users.length,
        active: users.filter(u => u.status !== 'blocked').length,
        blocked: users.filter(u => u.status === 'blocked').length
    }), [users]);

    return {
        users: filteredUsers,
        loading,
        searchTerm,
        setSearchTerm,
        updatingId,
        userToUpdate,
        setUserToUpdate,
        handleToggleStatus,
        stats,
        refresh: fetchUsers
    };
};
