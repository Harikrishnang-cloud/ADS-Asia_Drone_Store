"use client";

import { useUserLogic } from "@/hooks/useUserLogic";
import { UserManagerProps } from "../Model/userManager";

export function useUserManager(): UserManagerProps {
    const {users,loading,searchTerm,setSearchTerm,updatingId,userToUpdate,setUserToUpdate,handleToggleStatus,stats} = useUserLogic();

    const getAuthLabel = (provider: string) => {
        if (provider === "google") return "Google Authentication";
        return "Email Authentication";
    }

    const formatDate = (timestamp: any) => {
        if (!timestamp) return "N/A";
        const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
        return date.toLocaleDateString('en-IN', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        });
    }

    const formatTime = (timestamp: any) => {
        if (!timestamp) return "N/A";
        const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
        return date.toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    return {
        users,
        loading,
        searchTerm,
        setSearchTerm,
        updatingId,
        userToUpdate,
        setUserToUpdate,
        handleToggleStatus,
        stats,
        getAuthLabel,
        formatDate,
        formatTime
    };
}