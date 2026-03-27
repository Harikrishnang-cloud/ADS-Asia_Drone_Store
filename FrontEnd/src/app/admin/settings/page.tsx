"use client";

import React, { useState, useEffect } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Settings, Save, Mail, Phone, Truck, Percent, ShieldAlert, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import Button from "@/components/ui/button";

interface SystemSettings {
    storeEmail: string;
    supportPhone: string;
    shippingFee: number;
    taxPercentage: number;
    maintenanceMode: boolean;
    lowStockThreshold: number;
}

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<SystemSettings>({
        storeEmail: "",
        supportPhone: "",
        shippingFee: 0,
        taxPercentage: 18,
        maintenanceMode: false,
        lowStockThreshold: 5
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const docRef = doc(db, "settings", "global");
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                setSettings(docSnap.data() as SystemSettings);
            } else {
                // Initialize default settings if they don't exist
                await setDoc(docRef, settings);
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
            toast.error("Failed to load settings");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const docRef = doc(db, "settings", "global");
            await updateDoc(docRef, { ...settings });
            toast.success("Settings updated successfully!");
        } catch (error) {
            console.error("Error updating settings:", error);
            toast.error("Failed to save changes");
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : (type === "number" ? parseFloat(value) : value)
        }));
    };

    return (
        <ProtectedRoute allowedRole="admin">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl">
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">System Settings (Under Maintenance)</h2>
                    </div>
                    <p className="text-slate-500 font-medium">Configure global platform variables and preferences.</p>
                </div>

                {loading ? (
                    <div className="bg-white p-20 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                        <Loader2 className="animate-spin text-brand-blue mb-4" size={32} />
                        <p className="text-slate-400 font-bold italic">Loading system configurations...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSave} className="space-y-8">
                        {/* Section: General */}
                        <div className="bg-white pointer-events-none opacity-50 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            {/* when chache the disabled div - remove pointer-events-none opacity-50 */}
                            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                                <h3 className="text-sm font-black uppercase text-slate-700 tracking-wider">General Information</h3>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-slate-400">Store Support Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                        <input
                                            type="email"
                                            name="storeEmail"
                                            value={settings.storeEmail}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:border-brand-blue outline-none transition-all text-sm"
                                            placeholder="support@asiadronestore.com"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-slate-400">Customer Care Phone</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                        <input
                                            type="text"
                                            name="supportPhone"
                                            value={settings.supportPhone}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:border-brand-blue outline-none transition-all text-sm"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: Financials */}
                        <div className="bg-white pointer-events-none opacity-50 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                                <h3 className="text-sm font-black uppercase text-slate-700 tracking-wider">Pricing & Fees</h3>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-slate-400">Shipping Fee (₹)</label>
                                    <div className="relative">
                                        <Truck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                        <input
                                            type="number"
                                            name="shippingFee"
                                            value={settings.shippingFee}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:border-brand-blue outline-none transition-all text-sm font-bold"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-slate-400">Tax Percentage (GST %)</label>
                                    <div className="relative">
                                        <Percent className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                        <input
                                            type="number"
                                            name="taxPercentage"
                                            value={settings.taxPercentage}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:border-brand-blue outline-none transition-all text-sm font-bold"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: Operations */}
                        <div className="bg-white pointer-events-none opacity-50 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                                <h3 className="text-sm font-black uppercase text-slate-700 tracking-wider">Operations & Reliability</h3>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-100">
                                    <div className="flex items-center gap-3">
                                        <ShieldAlert className="text-orange-500" size={24} />
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">Maintenance Mode</p>
                                            <p className="text-xs text-slate-500">Temporarily disable user access to the storefront.</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            name="maintenanceMode"
                                            checked={settings.maintenanceMode}
                                            onChange={handleChange}
                                            className="sr-only peer" 
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                                    </label>
                                </div>

                                <div className="space-y-2 max-w-xs">
                                    <label className="text-xs font-black uppercase text-slate-400">Low Stock Threshold</label>
                                    <input
                                        type="number"
                                        name="lowStockThreshold"
                                        value={settings.lowStockThreshold}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:border-brand-blue outline-none transition-all text-sm font-bold"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 pointer-events-none opacity-50">
                            <Button 
                                type="submit"
                                variant="primary" 
                                size="lg"
                                icon={<Save size={18} />}
                                disabled={saving}
                            >
                                {saving ? "Applying Changes..." : "Save System Config"}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </ProtectedRoute>
    );
}
