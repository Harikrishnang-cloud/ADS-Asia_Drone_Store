"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { authService } from "@/services/auth.service";


export default function ForgotPasswordPage() {
    const [method, setMethod] = useState<'email' | 'phone'>("email");
    const [contact, setContact] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const data = await authService.forgotPassword(contact, method);

            if (data.success) {
                setSuccess(data.message);
                localStorage.setItem("resetContact", contact);
                localStorage.setItem("resetMethod", method);
                setTimeout(() => {
                    router.push("/auth/verify-otp");
                }, 1500);
            } else {
                setError(data.message || "Failed to send OTP");
            }
        } catch (err: unknown) {
            const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
            const errorMsg = errorObj.response?.data?.message || errorObj.message || "Network Error. Please try again.";
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-slate-50 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] rounded-full bg-brand-orange/10 blur-[80px] pointer-events-none"></div>
            <div className="absolute -bottom-10 -left-10 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] rounded-full bg-brand-blue/10 blur-[80px] pointer-events-none"></div>

            <form onSubmit={handleSubmit} className="relative z-10 border border-white/50 bg-white/80 backdrop-blur-2xl p-5 sm:p-6 rounded-2xl w-full max-w-[340px] shadow-2xl animate-in fade-in zoom-in-95 duration-500 ease-out">


                <div className="mb-4 text-center">
                    <h2 className="text-xl font-semibold text-slate-900">Reset Password</h2>
                    <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                        Choose your preferred verification method. We will transmit a secure, time-sensitive sequence to verify your identity.
                    </p>
                </div>

                <div className="flex p-1 bg-slate-100 rounded-xl mb-4">
                    <button
                        type="button"
                        onClick={() => { setMethod('email'); setContact(""); setError(""); }}
                        className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${method === 'email' ? 'bg-white text-brand-orange shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Email
                    </button>
                    <button
                        type="button"
                        id="phone-method-btn"
                        onClick={() => { setMethod('phone'); setContact(""); setError(""); }}
                        className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${method === 'phone' ? 'bg-white text-brand-orange shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Phone
                    </button>
                </div>

                {error && <div className="bg-red-50 border border-red-200 text-red-600 p-2.5 rounded-xl mb-4 text-xs text-center font-medium animate-in fade-in">{error}</div>}
                {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 p-2.5 rounded-xl mb-4 text-xs text-center font-medium animate-in fade-in">{success}</div>}

                <div className="space-y-3.5">
                    <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                            {method === 'email' ? 'Your Email' : 'Mobile Number'}
                        </label>
                        <input
                            type={method === 'email' ? 'email' : 'tel'}
                            placeholder={method === 'email' ? 'Enter your email' : 'Enter 10-digit number'}
                            required
                            className="bg-slate-50 border border-slate-200 text-slate-900 w-full px-3 py-2 text-sm rounded-xl focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all placeholder:text-slate-400"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-brand-orange to-red-600 hover:from-red-600 hover:to-orange-700 active:scale-[0.98] disabled:opacity-50 text-white font-semibold text-sm w-full py-2.5 rounded-xl transition-all mt-2 shadow-lg shadow-brand-orange/20"
                    >
                        {loading ? "Transmitting..." : "Send Secure OTP"}
                    </button>
                </div>

                <div className="mt-5 text-center text-xs text-slate-500 font-medium flex items-center justify-center gap-1">
                    <Link href="/auth/login" className="text-brand-orange hover:text-brand-orange-dark transition-colors flex items-center gap-1">
                        &larr; Abort & Return to Base
                    </Link>
                </div>
            </form>
        </div>
    );
}
