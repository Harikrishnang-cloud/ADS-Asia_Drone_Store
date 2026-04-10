"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Bell, Shield, Smartphone, Globe, ChevronRight, LogOut, Trash2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useRouter, useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

function SettingsContent() {
    const { user, logout, setAuth } = useAuthStore();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    
    const section = searchParams.get("section");

    const [preferences, setPreferences] = useState({
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        marketingEmails: true
    });

    const [regional, setRegional] = useState({
        language: "English",
        currency: "INR (₹)",
        timezone: "IST (UTC+05:30)"
    });

    const regionalSettingsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (user?.id) {
            const fetchPrefs = async () => {
                try {
                    const docSnap = await getDoc(doc(db, "users", user.id as string));
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        if (data.preferences) {
                            setPreferences(data.preferences);
                        }
                        if (data.regional) {
                            setRegional(data.regional);
                        }
                    }
                } catch (error) {
                    console.error("Error fetching preferences:", error);
                }
            };
            fetchPrefs();
        }
    }, [user?.id]);

    useEffect(() => {
        if (section === "regional") {
            setTimeout(() => {
                regionalSettingsRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }, [section]);

    const handlePreferenceChange = async (key: string, value: boolean) => {
        const updatedPrefs = { ...preferences, [key]: value };
        setPreferences(updatedPrefs);

        if (!user?.id) return;

        try {
            await updateDoc(doc(db, "users", user.id as string), {
                preferences: updatedPrefs
            });
            // Update local store and localStorage
            const updatedUser = { ...user, preferences: updatedPrefs };
            setAuth(updatedUser);
            localStorage.setItem("userData", JSON.stringify(updatedUser));
            toast.success("Preference updated");
        } catch (error) {
            console.error("Error updating preference:", error);
            toast.error("Failed to update preference");
            // Simple revert (not perfectly atomic but good for UI)
            setPreferences(preferences);
        }
    };

    const handleRegionalChange = async (key: string, value: string) => {
        const updatedRegional = { ...regional, [key]: value };
        setRegional(updatedRegional);

        if (!user?.id) return;

        try {
            await updateDoc(doc(db, "users", user.id as string), {
                regional: updatedRegional
            });
            const updatedUser = { ...user, regional: updatedRegional };
            setAuth(updatedUser);
            localStorage.setItem("userData", JSON.stringify(updatedUser));
            toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} preference updated`);
        } catch (error) {
            console.error("Error updating regional setting:", error);
            toast.error("Failed to update regional settings");
            setRegional(regional);
        }
    };

    const settingItems = [
        {
            icon: <Bell size={24} className="text-brand-orange" />,
            title: "Notifications",
            description: "View and manage your recent alerts and status updates.",
            href: "/user/notifications"
        },
        {
            icon: <Shield size={24} className="text-emerald-500" />,
            title: "Security",
            description: "Update your password or manage account security settings.",
            href: "/user/profile/edit"
        },
        {
            icon: <Globe size={24} className="text-brand-blue" />,
            title: "Language & Region",
            description: "Set your preferred language and regional format.",
            href: "scroll-to-regional"
        },
        {
            icon: <Smartphone size={24} className="text-purple-500" />,
            title: "Linked Devices",
            description: "View and manage devices connected to your account.",
            href: "#"
        }
    ];

    return (
        <ProtectedRoute allowedRole="user">
            <div className="max-w-4xl mx-auto py-12 px-4 min-h-[80vh]">
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-black text-brand-blue-dark tracking-tight mb-3">Account Settings</h1>
                    <p className="text-slate-500 font-medium">Manage your preferences, security, and account behaviors.</p>
                </div>

                <div className="space-y-8">
                    {/* Navigation Hub */}
                    <div className="bg-white border border-slate-100 rounded-xl p-2 shadow-sm">
                        <div className="space-y-1">
                            {settingItems.map((setting, index) => (
                                <div
                                    key={index}
                                    onClick={() => {
                                        if (setting.href === "#") {
                                            toast.success(`${setting.title} settings are coming soon!`);
                                        } else if (setting.href === "scroll-to-regional") {
                                            regionalSettingsRef.current?.scrollIntoView({ behavior: 'smooth' });
                                        } else {
                                            router.push(setting.href);
                                        }
                                    }}
                                    className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-all cursor-pointer group border border-transparent hover:border-slate-100"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 bg-slate-50 group-hover:bg-white rounded-xl shadow-sm border border-slate-100 transition-colors flex items-center justify-center shrink-0">
                                            {setting.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800 group-hover:text-brand-blue-dark transition-colors">{setting.title}</h3>
                                            <p className="text-sm text-slate-500 mt-1 hidden sm:block">{setting.description}</p>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-slate-300 group-hover:text-brand-blue group-hover:bg-brand-blue/10 transition-all shrink-0">
                                        <ChevronRight size={20} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Preference Toggles */}
                    <div className="bg-white border border-slate-100 rounded-xl p-8 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Communication Preferences</h2>
                        <p className="text-sm text-slate-500 mb-8">Choose how you want to be notified about your orders and account activity.</p>

                        <div className="space-y-6">
                            {[
                                { key: "emailNotifications", label: "Email Notifications", desc: "Receive order updates and account alerts via email." },
                                { key: "pushNotifications", label: "Push Notifications", desc: "Get real-time alerts on your browser or mobile device." },
                                { key: "smsNotifications", label: "SMS Alerts", desc: "Important status updates sent directly to your phone." },
                                { key: "marketingEmails", label: "Marketing & Promotions", desc: "Stay informed about new products and exclusive deals." }
                            ].map((pref) => (
                                <div key={pref.key} className="flex items-center justify-between group">
                                    <div className="flex-1 pr-4">
                                        <h4 className="font-bold text-slate-800 text-sm md:text-base group-hover:text-brand-blue transition-colors">{pref.label}</h4>
                                        <p className="text-xs md:text-sm text-slate-500">{pref.desc}</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={preferences[pref.key as keyof typeof preferences]}
                                            onChange={(e) => handlePreferenceChange(pref.key, e.target.checked)}
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Regional Settings */}
                <div ref={regionalSettingsRef} className="mt-8 bg-white border border-slate-100 rounded-xl p-8 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Language & Region</h2>
                    <p className="text-sm text-slate-500 mb-8">Customize your experience with your preferred localizations.</p>

                    <div className="space-y-6">
                        {/* Language Selector */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
                            <div className="flex-1 pr-4">
                                <h4 className="font-bold text-slate-800 text-sm md:text-base">Display Language</h4>
                                <p className="text-xs md:text-sm text-slate-500">The language used throughout the application interface.</p>
                            </div>
                            <select
                                className="w-full md:w-64 p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-brand-blue text-sm font-bold text-slate-700 cursor-pointer"
                                value={regional.language}
                                onChange={(e) => handleRegionalChange("language", e.target.value)}
                            >
                                <option value="English">English (US)</option>
                                <option value="English UK">English (UK)</option>
                                <option value="Hindi">Hindi (हिन्दी)</option>
                                <option value="Malayalam">Malayalam (മലയാളം)</option>
                                <option value="Tamil">Tamil (தமிழ்)</option>
                            </select>
                        </div>

                        {/* Currency Selector */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
                            <div className="flex-1 pr-4">
                                <h4 className="font-bold text-slate-800 text-sm md:text-base">Preferred Currency</h4>
                                <p className="text-xs md:text-sm text-slate-500">Set your default currency for product prices and payments.</p>
                            </div>
                            <select
                                className="w-full md:w-64 p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-brand-blue text-sm font-bold text-slate-700 cursor-pointer"
                                value={regional.currency}
                                onChange={(e) => handleRegionalChange("currency", e.target.value)}
                            >
                                <option value="INR (₹)">INR (₹) - Indian Rupee</option>
                                <option value="USD ($)">USD ($) - US Dollar</option>
                                <option value="EUR (€)">EUR (€) - Euro</option>
                                <option value="AED (د.إ)">AED (د.إ) - UAE Dirham</option>
                            </select>
                        </div>

                        {/* Timezone Selector */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
                            <div className="flex-1 pr-4">
                                <h4 className="font-bold text-slate-800 text-sm md:text-base">Regional Timezone</h4>
                                <p className="text-xs md:text-sm text-slate-500">Dates and times will be displayed in this timezone.</p>
                            </div>
                            <select
                                className="w-full md:w-64 p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-brand-blue text-sm font-bold text-slate-700 cursor-pointer"
                                value={regional.timezone}
                                onChange={(e) => handleRegionalChange("timezone", e.target.value)}
                            >
                                <option value="IST (UTC+05:30)">IST (UTC+05:30) - India</option>
                                <option value="GMT (UTC+00:00)">GMT (UTC+00:00) - Greenwich</option>
                                <option value="EST (UTC-05:00)">EST (UTC-05:00) - Eastern Time</option>
                                <option value="GST (UTC+04:00)">GST (UTC+04:00) - Gulf Standard</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="bg-red-50/30 border border-red-100 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 mt-8">
                    <div>
                        <h3 className="text-lg font-bold text-red-900 mb-1">Danger Zone</h3>
                        <p className="text-sm text-red-700/70 font-medium">Permanently delete your account and all associated data.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsLogoutModalOpen(true)}
                            className="px-6 py-3 bg-white text-slate-700 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-slate-50 transition-colors border border-slate-200 shadow-sm flex items-center gap-2 cursor-pointer"
                        >
                            <LogOut size={16} /> SignOut
                        </button>
                        <button
                            onClick={() => router.push("/user/profile/edit")}
                            className="px-6 py-3 bg-red-600 text-white rounded-lg text-sm font-black uppercase tracking-widest hover:bg-red-700 transition-colors shadow-lg shadow-red-200 flex items-center gap-2 cursor-pointer"
                        >
                            <Trash2 size={16} /> Delete Account
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={() => { logout(); router.push("/auth/login"); }}
                title="Log Out"
                message="Are you sure you want to log out of your account? You will need to sign in again to access your private data."
                confirmText="Yes, Log Out"
                type="danger"
            />
        </ProtectedRoute>
    );
}

export default function SettingsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-10 h-10 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <SettingsContent />
        </Suspense>
    );
}
