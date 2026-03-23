"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { CreditCard, Plus, ShieldCheck, ArrowRight } from "lucide-react";

export default function PaymentsPage() {
    return (
        <ProtectedRoute allowedRole="user">
            <div className="max-w-4xl mx-auto py-12 px-4 min-h-[80vh]">
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-black text-brand-blue-dark tracking-tight mb-3">Payment Methods</h1>
                    <p className="text-slate-500 font-medium">Manage your saved cards and payment preferences.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Add New Card Button */}
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-brand-blue/50 hover:bg-brand-blue/5 transition-all group min-h-[200px]">
                        <div className="w-14 h-14 bg-slate-100 group-hover:bg-brand-blue/10 rounded-full flex items-center justify-center mb-4 transition-colors">
                            <Plus size={24} className="text-slate-400 group-hover:text-brand-blue transition-colors" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700 group-hover:text-brand-blue-dark transition-colors">Add New Payment Method</h3>
                        <p className="text-sm text-slate-500 mt-2">Credit card, Debit card, or UPI</p>
                    </div>

                    {/* Info Card */}
                    <div className="bg-gradient-to-br from-brand-blue-dark to-brand-blue rounded-2xl p-6 sm:p-8 text-white flex flex-col justify-between min-h-[200px] shadow-xl shadow-brand-blue/20 relative overflow-hidden">
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <ShieldCheck size={28} className="text-brand-orange" />
                                <h3 className="text-xl font-bold text-orange-400">Secure Checkout</h3>
                            </div>
                            <p className="text-slate-200 text-sm leading-relaxed mb-6 font-medium">
                                We use industry-standard encryption to protect your payment details. Your data is always safe with Asia Drone Store.
                            </p>
                            <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider cursor-pointer hover:text-brand-orange transition-colors w-fit">
                                Learn More <ArrowRight size={16} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional lightweight section */}
                <div className="mt-12 bg-white border border-slate-100 rounded-2xl p-5 sm:p-8 shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-slate-50 text-slate-600 rounded-xl">
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Saved Cards</h2>
                            <p className="text-sm text-slate-500 mt-1">You currently have no saved cards.</p>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
