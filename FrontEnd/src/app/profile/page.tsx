"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import UserProfile from "@/components/profile/UserProfile";

export default function ProfilePage() {
    return (
        <ProtectedRoute allowedRole="user">
            <div className="py-12 px-4 min-h-[80vh] bg-slate-50/50">
                <UserProfile isEdit={false} />
            </div>
        </ProtectedRoute>
    );
}
