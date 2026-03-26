"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import NotificationManager from "@/components/admin/Notification/View/NotificationManager";

export default function AdminNotificationsPage() {
    return (
        <ProtectedRoute allowedRole="admin">
            <div className="animate-in fade-in duration-500">
                <NotificationManager />
            </div>
        </ProtectedRoute>
    );
}
