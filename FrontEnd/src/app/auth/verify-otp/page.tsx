"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

import { authService } from "@/services/auth.service";


export default function VerifyOtpPage() {
    const [otp, setOtp] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [countdown, setCountdown] = useState(60);
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

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const data = await authService.verifyResetOtp({ email, otp });

            if (data.success) {
                setSuccess(data.message);
                setTimeout(() => {
                    router.push("/auth/reset-password");
                }, 1000);
            } else {
                setError(data.message || "Invalid Authorization Sequence");
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            const errorMsg = err.response?.data?.message || err.message || "Network Error. Sequence rejected.";
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (countdown > 0) return;

        setResendLoading(true);
        setError("");
        setSuccess("");

        try {
            const data = await authService.resendResetOtp(email);

            if (data.success) {
                setSuccess(data.message);
                setCountdown(60);
            } else {
                setError(data.message || "Failed to transmit new sequence");
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            const errorMsg = err.response?.data?.message || err.message || "Network Error.";
            setError(errorMsg);
        } finally {
            setResendLoading(false);
        }
    };

    if (!isMounted) return null;

    return (
        <div className="flex justify-center items-center min-h-screen bg-slate-50 relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] rounded-full bg-brand-blue/10 blur-[80px] pointer-events-none"></div>
            <div className="absolute -bottom-10 -right-10 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] rounded-full bg-brand-orange/10 blur-[80px] pointer-events-none"></div>

            <form onSubmit={handleSubmit} className="relative z-10 border border-slate-200 bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-2xl w-full max-w-md shadow-xl">
                <div className="flex flex-col items-center mb-8">
                    <Logo width={160} height={160} className="w-32 md:w-[160px]" imageClassName="w-full h-auto" />
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-orange -mt-2">Identity Verification</span>
                </div>


                <div className="mb-6 text-center">
                    <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                        Input the secure 6-digit flight clearance transmitted to
                        <br />
                        <span className="font-semibold text-slate-900 mt-1 border border-slate-200 bg-slate-100/50 px-3 py-1 rounded inline-block">
                            {email}
                        </span>
                    </p>
                </div>

                {error && <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-6 text-sm text-center font-medium animate-in fade-in">{error}</div>}
                {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 p-3 rounded-xl mb-6 text-sm text-center font-medium animate-in fade-in">{success}</div>}

                <div className="space-y-4">
                    <div>
                        <input
                            type="text"
                            maxLength={6}
                            placeholder="••••••"
                            required
                            className="bg-slate-50 border border-slate-200 text-brand-orange w-full p-4 rounded-xl focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all text-center text-3xl font-black tracking-[0.7em] placeholder:text-slate-300 uppercase"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || otp.length < 6}
                        className="bg-gradient-to-r from-brand-orange to-brand-orange-dark hover:from-brand-orange-dark hover:to-orange-700 active:scale-[0.98] disabled:opacity-50 text-white font-semibold w-full p-4 rounded-xl transition-all shadow-lg shadow-brand-orange/20 mt-4 uppercase tracking-widest text-sm"
                    >
                        {loading ? "Verifying Sequence..." : "Confirm Identity"}
                    </button>

                    <div className="text-center mt-6">
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={countdown > 0 || resendLoading}
                            className={`text-xs font-semibold uppercase tracking-wider transition-colors ${countdown > 0 ? "text-slate-400 cursor-not-allowed" : "text-brand-orange hover:text-brand-orange-dark"}`}
                        >
                            {resendLoading ? "Retransmitting..." : countdown > 0 ? `Retransmit available in ${countdown}s` : "Request New Sequence"}
                        </button>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200 text-center text-xs text-slate-500 font-medium">
                    <Link href="/auth/forgot-password" className="text-slate-500 hover:text-slate-700 transition-colors uppercase tracking-widest">
                        &larr; Re-enter Pilot Email
                    </Link>
                </div>
            </form>
        </div>
    );
}
