"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Logo } from "@/components/ui/Logo";


export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
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
            const res = await fetch("http://localhost:7878/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setSuccess(data.message);
                localStorage.setItem("resetEmail", email);
                setTimeout(() => {
                    router.push("/auth/verify-otp");
                }, 1500);
            } else {
                setError(data.message || "Failed to send OTP");
            }
        } catch (err: any) {
            setError(err.message || "Network Error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-slate-50 relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-brand-orange/10 blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-brand-blue/10 blur-[120px] pointer-events-none"></div>

            <form onSubmit={handleSubmit} className="relative z-10 border border-slate-200 bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-2xl w-full max-w-md shadow-xl">


                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-semibold text-slate-900">Reset Password</h2>
                    <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                        Enter your email address. We will transmit a secure, time-sensitive sequence to verify your identity.
                    </p>
                </div>

                {error && <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-6 text-sm text-center font-medium animate-in fade-in">{error}</div>}
                {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 p-3 rounded-xl mb-6 text-sm text-center font-medium animate-in fade-in">{success}</div>}

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Your Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            required
                            className="bg-slate-50 border border-slate-200 text-slate-900 w-full p-3.5 rounded-xl focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all placeholder:text-slate-400"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-brand-orange to-red-600 hover:from-red-600 hover:to-orange-700 active:scale-[0.98] disabled:opacity-50 text-white font-semibold w-full p-3.5 rounded-xl transition-all mt-4 shadow-lg shadow-brand-orange/20"
                    >
                        {loading ? "Transmitting..." : "Send Secure OTP"}
                    </button>
                </div>

                <div className="mt-8 text-center text-sm text-slate-500 font-medium flex items-center justify-center gap-2">
                    <Link href="/auth/login" className="text-brand-orange hover:text-brand-orange-dark transition-colors flex items-center gap-1">
                        &larr; Abort & Return to Base
                    </Link>
                </div>
            </form>
        </div>
    );
}
