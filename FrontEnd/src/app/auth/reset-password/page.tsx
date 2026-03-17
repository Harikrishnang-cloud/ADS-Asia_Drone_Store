"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/components/PasswordInput";
import { ShieldCheck } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

import { authService } from "@/services/auth.service";


export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
        const storedEmail = localStorage.getItem("resetEmail");
        if (!storedEmail) {
            router.push("/auth/forgot-password");
        } else {
            setEmail(storedEmail);
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (password !== confirmPassword) {
            setError("Security keys do not match");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Security key must be at least 6 characters");
            setLoading(false);
            return;
        }

        try {
            const data = await authService.resetPassword({ email, password });

            if (data.success) {
                setSuccess(data.message);
                localStorage.removeItem("resetEmail");
                setTimeout(() => {
                    router.push("/auth/login");
                }, 2000);
            } else {
                setError(data.message || "Failed to establish new security key");
            }
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || err.message || "Network Error.";
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (!isMounted) return null;

    return (
        <div className="flex justify-center items-center min-h-screen bg-slate-50 relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-brand-orange/10 blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none"></div>

            <form onSubmit={handleSubmit} className="relative z-10 border border-slate-200 bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-2xl w-full max-w-md shadow-xl">
                <div className="flex flex-col items-center mb-8">
                    <Logo width={160} height={160} />
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-600 -mt-2">Secure Protocol Active</span>
                </div>


                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-semibold text-slate-900">New Security Key</h2>
                    <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                        Identity verified. Establish a new pilot access code below.
                    </p>
                </div>

                {error && <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-6 text-sm text-center font-medium animate-in fade-in">{error}</div>}
                {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 p-3 rounded-xl mb-6 text-sm text-center font-medium animate-in fade-in">{success}</div>}

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">New Access Code</label>
                        <PasswordInput
                            placeholder="••••••••"
                            required
                            className="bg-slate-50 border border-slate-200 text-slate-900 w-full p-3.5 rounded-xl focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all placeholder:text-slate-400"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Verify Access Code</label>
                        <PasswordInput
                            placeholder="••••••••"
                            required
                            className="bg-slate-50 border border-slate-200 text-slate-900 w-full p-3.5 rounded-xl focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all placeholder:text-slate-400"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 active:scale-[0.98] disabled:opacity-50 text-white font-semibold w-full p-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 mt-4 uppercase tracking-widest text-sm"
                    >
                        {loading ? "Re-encrypting Access..." : "Initialize New Key"}
                    </button>
                    <div className="mt-4 text-center">
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                            End-to-End Encryption
                        </span>
                    </div>
                </div>
            </form>
        </div>
    );
}
