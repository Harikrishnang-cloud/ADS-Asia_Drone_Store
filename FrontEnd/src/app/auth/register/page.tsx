"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { PasswordInput } from "@/components/PasswordInput";
import { Logo } from "@/components/ui/Logo";
import toast from "react-hot-toast";


export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        // ... (same logic)
        e.preventDefault();

        if (name.trim().length < 3) {
            setError("Name must be at least 3 characters long");
            return;
        }
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
            const res = await fetch("http://localhost:7878/user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role: "user"
                }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                toast.success("Account created successfully! Please log in.");
                router.push("/auth/login");
            } else {
                const errorMsg = data.message || "Registration failed";
                setError(errorMsg);
                toast.error(errorMsg);
            }
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : "Network Error. Please try again.";
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const loginWithGoogle = async () => {
        setLoading(true);
        setError("");
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const token = await user.getIdToken();

            const res = await fetch("http://localhost:7878/auth/google-login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ token })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("refreshToken", data.refreshToken);
                localStorage.setItem("userData", JSON.stringify(data.user));
                toast.success("Signed in with Google!");
                router.push("/");
            } else {
                const errorMsg = data.message || "Google registration failed";
                setError(errorMsg);
                toast.error(errorMsg);
            }
        } catch (err: any) {
            const errorMsg = err.message || "Google registration failed";
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-slate-50 relative overflow-hidden">
            {/* Abstract Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-brand-blue/10 blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-brand-orange/5 blur-[120px] pointer-events-none"></div>

            <form onSubmit={handleSubmit} className="relative z-10 border border-slate-200 bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-2xl w-full max-w-md shadow-xl">
                {/* Brand Logo Area */}
                <div className="flex flex-col items-center mb-8">
                    {/* <Logo width={140} height={160} /> */}
                    {/* <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-orange -mt-2">Fly Your Passion</span> */}
                </div>


                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-semibold text-slate-900">Join the Fleet</h2>
                    <p className="text-slate-500 text-sm mt-1">Create your ADS account</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-6 text-sm text-center font-medium animate-in fade-in slide-in-from-top-1">
                        {error}
                    </div>
                )}

                <div className="space-y-5">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            required
                            className="bg-slate-50 border border-slate-200 text-slate-900 w-full p-3.5 rounded-xl focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all placeholder:text-slate-400"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            suppressHydrationWarning
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            required
                            className="bg-slate-50 border border-slate-200 text-slate-900 w-full p-3.5 rounded-xl focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all placeholder:text-slate-400"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            suppressHydrationWarning
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Secure Password</label>
                        <PasswordInput
                            placeholder="Enter your password"
                            required
                            className="bg-slate-50 border border-slate-200 text-slate-900 w-full p-3.5 rounded-xl focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all placeholder:text-slate-400"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            suppressHydrationWarning
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-brand-orange to-brand-orange-dark hover:from-brand-orange-dark hover:to-orange-700 active:scale-[0.98] disabled:opacity-50 text-white font-semibold w-full p-3.5 rounded-xl transition-all mt-4 shadow-lg shadow-brand-orange/20"
                        suppressHydrationWarning
                    >
                        {loading ? "Registering..." : "Create Account"}
                    </button>

                    <div className="flex items-center my-6">
                        <div className="flex-grow border-t border-slate-200"></div>
                        <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-medium uppercase tracking-wider">or</span>
                        <div className="flex-grow border-t border-slate-200"></div>
                    </div>

                    <button
                        type="button"
                        onClick={loginWithGoogle}
                        disabled={loading}
                        className="flex flex-row items-center justify-center gap-3 bg-white text-slate-700 hover:bg-slate-50 active:scale-[0.98] disabled:opacity-50 font-semibold w-full p-3.5 rounded-xl transition-all shadow-sm border border-slate-200 hover:border-slate-300"
                        suppressHydrationWarning
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>
                </div>

                <div className="mt-8 text-center text-sm text-slate-500 font-medium">
                    Already part of ADS? <Link href="/auth/login" className="text-brand-orange hover:text-brand-orange-dark transition-colors">Log In</Link>
                </div>
            </form>
        </div>
    );
}