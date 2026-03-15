import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function WishlistPage() {
    return (
        <ProtectedRoute allowedRole="user">
            <div className="min-h-screen pt-24 md:pt-32 pb-12 md:pb-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-brand-blue-dark mb-6 md:mb-8">My Wishlist</h1>
                    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 min-h-[300px] md:min-h-[400px] flex flex-col items-center justify-center text-center">
                        <p className="text-slate-500 text-base md:text-lg">Your wishlist is currently empty.</p>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
