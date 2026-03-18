"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import NotificationManager from "@/components/admin/Notification/View/NotificationManager";

export default function AdminNotificationsPage() {
    return (
        <ProtectedRoute allowedRole="admin">
            <div className="py-6 px-4">
                <NotificationManager />
            </div>
        </ProtectedRoute>
    );
}
