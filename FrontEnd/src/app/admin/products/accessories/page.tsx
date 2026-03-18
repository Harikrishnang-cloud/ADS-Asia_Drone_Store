"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ProductManager from "@/components/admin/Product/View/ProductManager";

export default function AdminAccessoriesPage() {
    return (
        <ProtectedRoute allowedRole="admin">
            <ProductManager category="Accessories" />
        </ProtectedRoute>
    );
}
