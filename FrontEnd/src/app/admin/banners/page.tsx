"use client";

import BannerManager from "@/components/admin/Banner/View/BannerManager";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function AdminBannersPage() {
    return (
        <ProtectedRoute allowedRole="admin">
             <BannerManager />
        </ProtectedRoute>
    );
}
