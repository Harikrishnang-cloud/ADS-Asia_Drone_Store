"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import UserProfile from "@/components/user/UserProfile";

export default function ProfileEditPage() {
    return (
        <ProtectedRoute allowedRole="user">
            <div className="py-12 px-4 min-h-[80vh] bg-slate-50/50">
                <UserProfile isEdit={true} />
            </div>
        </ProtectedRoute>
    );
}
