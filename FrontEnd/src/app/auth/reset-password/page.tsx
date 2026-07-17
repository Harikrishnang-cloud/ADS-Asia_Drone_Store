"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/components/PasswordInput";


import { authService } from "@/services/auth.service";


export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [contact, setContact] = useState("");
    const [method, setMethod] = useState<'email' | 'phone'>("email");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
        const storedContact = localStorage.getItem("resetContact");
        const storedMethod = localStorage.getItem("resetMethod") as 'email' | 'phone';
        
        if (!storedContact) {
            router.push("/auth/forgot-password");
        } else {
            setContact(storedContact);
            if (storedMethod) setMethod(storedMethod);
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
            const data = await authService.resetPassword({ contact, password, method });

            if (data.success) {
                setSuccess(data.message);
                localStorage.removeItem("resetContact");
                localStorage.removeItem("resetMethod");
                setTimeout(() => {
                    router.push("/auth/login");
                }, 2000);
            } else {
                setError(data.message || "Failed to establish new security key");
            }
        } catch (err: unknown) {
            const errorObj = err as { response?: { data?: { message?: string } }, message?: string };
            const errorMsg = errorObj.response?.data?.message || errorObj.message || "Network Error.";
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (!isMounted) return null;

    return (
        <div className="flex justify-center items-center min-h-screen bg-slate-50 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] rounded-full bg-brand-orange/10 blur-[80px] pointer-events-none"></div>
            <div className="absolute -bottom-10 -left-10 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none"></div>

            <form onSubmit={handleSubmit} className="relative z-10 border border-white/50 bg-white/80 backdrop-blur-2xl p-5 sm:p-6 rounded-2xl w-full max-w-[340px] shadow-2xl animate-in fade-in zoom-in-95 duration-500 ease-out">
                {/* <div className="flex flex-col items-center mb-6">
                    <Logo width={120} height={120} className="w-24 md:w-[120px]" imageClassName="w-full h-auto" />
                    <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-emerald-600 -mt-2">Secure Protocol Active</span>
                </div> */}


                <div className="mb-4 text-center">
                    <h2 className="text-xl font-semibold text-slate-900">New Security Key</h2>
                    <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                        Identity verified. Establish a new pilot access code below.
                    </p>
                </div>

                {error && <div className="bg-red-50 border border-red-200 text-red-600 p-2.5 rounded-xl mb-4 text-xs text-center font-medium animate-in fade-in">{error}</div>}
                {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 p-2.5 rounded-xl mb-4 text-xs text-center font-medium animate-in fade-in">{success}</div>}

                <div className="space-y-3.5">
                    <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">New Access Code</label>
                        <PasswordInput
                            placeholder="••••••••"
                            required
                            className="bg-slate-50 border border-slate-200 text-slate-900 w-full px-3 py-2 text-sm rounded-xl focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all placeholder:text-slate-400"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Verify Access Code</label>
                        <PasswordInput
                            placeholder="••••••••"
                            required
                            className="bg-slate-50 border border-slate-200 text-slate-900 w-full px-3 py-2 text-sm rounded-xl focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all placeholder:text-slate-400"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 active:scale-[0.98] disabled:opacity-50 text-white font-semibold text-sm w-full py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 mt-2 uppercase tracking-widest"
                    >
                        {loading ? "Re-encrypting..." : "Initialize New Key"}
                    </button>
                    <div className="mt-4 text-center">
                        <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono">
                            End-to-End Encryption
                        </span>
                    </div>
                </div>
            </form>
        </div>
    );
}
