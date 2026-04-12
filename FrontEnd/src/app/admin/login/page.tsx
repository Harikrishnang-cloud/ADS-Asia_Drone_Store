"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/components/PasswordInput";
import toast from "react-hot-toast";

import { authService } from "@/services/auth.service";


export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const data = await authService.adminLogin({ email, password });

            if (data.success) {
                localStorage.setItem("adminData", JSON.stringify(data.result));
                toast.success("Welcome back, Vishnu");
                router.push("/admin/dashboard");
            } else {
                const errorMsg = data.message || "Invalid Admin Credentials";
                setError(errorMsg);
                toast.error(errorMsg);
            }
        } catch (err: unknown) {
            const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
            const errorMsg = errorObj.response?.data?.message || errorObj.message || "Network Error. Please try again.";
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-slate-50 relative overflow-hidden">
            {/* Defensive Abstract Background Elements */}
            <div className="absolute -top-10 -right-10 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] rounded-full bg-red-100 blur-[80px] pointer-events-none"></div>
            <div className="absolute -bottom-10 -left-10 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] rounded-full bg-brand-orange/10 blur-[80px] pointer-events-none"></div>

            <form onSubmit={handleSubmit} className="relative z-10 border border-slate-200 bg-white/80 backdrop-blur-2xl p-8 sm:p-10 rounded-2xl w-full max-w-md shadow-xl">
                {/* Brand Logo & Admin Shield */}
                <div className="flex flex-col items-center mb-4">
                    <h2 className="text-sm uppercase tracking-[0.1em] font-bold text-red-600 mt-4">Admin Portal</h2>
                </div>
                <div className="mb-6 text-center">
                    <p className="text-slate-500 text-sm font-medium">Authorized personnel only</p>
                </div>
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-6 text-sm text-center font-medium animate-in fade-in slide-in-from-top-1">
                        {error}
                    </div>
                )}

                <div className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Admin Identity</label>
                        <input
                            type="email"
                            placeholder="admin@example.com"
                            required
                            className="bg-slate-50 border border-slate-200 text-slate-900 w-full p-3.5 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-slate-400"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Security Key</label>
                        <PasswordInput
                            placeholder="••••••••"
                            required
                            className="bg-slate-50 border border-slate-200 text-slate-900 w-full p-3.5 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-slate-400"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-red-600 to-brand-orange-dark hover:from-red-500 hover:to-orange-600 active:scale-[0.98] disabled:opacity-50 text-white font-bold tracking-wide uppercase text-sm w-full p-4 rounded-xl transition-all mt-4 shadow-lg shadow-red-500/20"
                    >
                        {loading ? "Authenticating..." : "Login"}
                    </button>

                    <div className="text-center pt-4">
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-semibold">
                            Connection encrypted • IPv6 Secure
                        </span>
                    </div>
                </div>
            </form>
        </div>
    );
}
