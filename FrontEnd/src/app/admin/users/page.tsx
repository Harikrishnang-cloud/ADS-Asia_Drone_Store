"use client";

import UserManager from "@/components/admin/UserManager";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function AdminUsersPage() {
    return (
        <ProtectedRoute allowedRole="admin">
            <UserManager />
        </ProtectedRoute>
    );
}
