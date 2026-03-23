"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            toast.success("Transmission successful. Our team will contact you shortly.");
            setFormData({ name: "", email: "", subject: "", message: "" });
            setIsSubmitting(false);
        }, 1500);
    };

    // Advanced SVG Grid Background Pattern
    const gridPattern = {
        backgroundImage: `radial-gradient(#cbd5e1 1px, transparent 1px)`,
        backgroundSize: '32px 32px'
    };

    return (
        <main className="w-full min-h-screen bg-slate-50 relative overflow-hidden flex flex-col">
            
            {/* Tech Grid Background */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40" style={gridPattern}></div>
            
            {/* Ambient Animated Orbs */}
            <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-brand-orange/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2 animate-pulse" style={{ animationDuration: '8s' }}></div>
            <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-brand-blue/10 blur-[150px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/3 animate-pulse" style={{ animationDuration: '12s' }}></div>

            <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-12 w-full pt-28 md:pt-40 pb-20 relative z-10 flex-1 flex flex-col">
                
                {/* Advanced Header */}
                <div className="text-center max-w-3xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-6">
                        <span className="w-2 h-2 rounded-full bg-brand-orange animate-ping"></span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6 leading-tight">
                        Let's engineer the <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-blue-dark to-brand-orange">future of flight.</span>
                    </h1>
                    <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                        Whether you need advanced technical support, enterprise fleet solutions, or simply want to inquire about our proprietary drones, our specialists are on standby.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 flex-1">
                    
                    {/* Left Column: Premium Contact Hub */}
                    <div className="lg:col-span-5 flex flex-col gap-6 animate-in fade-in slide-in-from-left-12 duration-1000 delay-300">
                        
                        {/* Hero Contact Card */}
                        <div className="bg-brand-blue-dark rounded-xl p-8 md:p-10 text-white relative overflow-hidden shadow-2xl shadow-brand-blue-dark/20 group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-xl blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-orange/20 transition-colors duration-700"></div>
                            
                            <h3 className="text-2xl font-black mb-8 relative z-10">Direct Communications</h3>
                            
                            <div className="space-y-8 relative z-10">
                                <a href="mailto:enterprise@asiadronestore.com" className="flex items-start gap-5 group/item">
                                    <div>
                                        <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Enterprise Sales</p>
                                        <p className="text-lg font-bold group-hover/item:text-brand-orange transition-colors">enterprise@asiadronestore.com</p>
                                    </div>
                                </a>
                                
                                <a href="tel:+919876543210" className="flex items-start gap-5 group/item">
                                    <div>
                                        <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Technical Support</p>
                                        <p className="text-lg font-bold group-hover/item:text-brand-blue transition-colors">+91 98765 43210</p>
                                    </div>
                                </a>
                            </div>
                        </div>

                        {/* Interactive Location Card */}
                        <div className="bg-white rounded-xl p-8 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/50 group hover:border-brand-blue/20 transition-colors flex-1 flex flex-col">
                            <div className="flex items-center gap-4 mb-6">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900">Primary Headquarters</h3>
                                    <p className="text-sm font-bold text-slate-400">Asia Drone Store, 1st Floor - MG Corporate center, Uloor, Thiruvananthapuram, Kerala, India</p>
                                </div>
                            </div>
                            
                            <div className="relative w-full flex-1 min-h-[200px] rounded-xl overflow-hidden border border-slate-200">
                                <div className="absolute inset-0 bg-slate-100 animate-pulse"></div> {/* Loading skeleton */}
                                <iframe 
                                    src="https://www.google.com/maps?q=M.G.+Corporate+Center,+Thiruvananthapuram&output=embed"                                    className="absolute inset-0 w-full h-full z-10 filter grayscale opacity-90 transition-all duration-700 hover:grayscale-0 hover:opacity-100"
                                    style={{ border: 0 }} 
                                    allowFullScreen={false} 
                                    loading="lazy" 
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Advanced Form Interface */}
                    <div className="lg:col-span-7 bg-white/80 backdrop-blur-2xl rounded-xl p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-white flex flex-col justify-center animate-in fade-in slide-in-from-right-12 duration-1000 delay-500 relative">
                        
                        <div className="absolute top-0 right-0 w-1/2 h-1 bg-gradient-to-r from-transparent via-brand-blue to-brand-orange opacity-50"></div>
                        
                        <div className="mb-10">
                            <h2 className="text-3xl font-black text-slate-900 mb-3">Contact Us</h2>
                            <p className="text-slate-500 text-sm font-medium">Transmit your requirements into our highly secure portal. Operational response metrics dictate a reply within 24 hours.</p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Dynamic Input: Name */}
                                <div className={`relative rounded-xl border-2 transition-all duration-300 bg-white ${focusedField === 'name' ? 'border-brand-blue shadow-lg shadow-brand-blue/10' : 'border-slate-100 hover:border-slate-300'}`}>
                                    <label className={`absolute left-4 transition-all duration-300 pointer-events-none text-xs font-bold uppercase tracking-widest ${focusedField === 'name' || formData.name ? 'top-2 text-brand-blue scale-90' : 'top-4 text-slate-400'}`}>
                                        Name
                                    </label>
                                    <input 
                                        type="text" 
                                        name="name"
                                        required
                                        onFocus={() => setFocusedField('name')}
                                        onBlur={() => setFocusedField(null)}
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 pt-7 pb-2 bg-transparent outline-none text-slate-900 font-medium"
                                    />
                                </div>

                                {/* Dynamic Input: Email */}
                                <div className={`relative rounded-xl border-2 transition-all duration-300 bg-white ${focusedField === 'email' ? 'border-brand-blue shadow-lg shadow-brand-blue/10' : 'border-slate-100 hover:border-slate-300'}`}>
                                    <label className={`absolute left-4 transition-all duration-300 pointer-events-none text-xs font-bold uppercase tracking-widest ${focusedField === 'email' || formData.email ? 'top-2 text-brand-blue scale-90' : 'top-4 text-slate-400'}`}>
                                        Email
                                    </label>
                                    <input 
                                        type="email" 
                                        name="email"
                                        required
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 pt-7 pb-2 bg-transparent outline-none text-slate-900 font-medium"
                                    />
                                </div>
                            </div>
                            
                            {/* Dynamic Input: Subject */}
                            <div className={`relative rounded-xl border-2 transition-all duration-300 bg-white ${focusedField === 'subject' ? 'border-brand-orange shadow-lg shadow-brand-orange/10' : 'border-slate-100 hover:border-slate-300'}`}>
                                <label className={`absolute left-4 transition-all duration-300 pointer-events-none text-xs font-bold uppercase tracking-widest ${focusedField === 'subject' || formData.subject ? 'top-2 text-brand-orange scale-90' : 'top-4 text-slate-400'}`}>
                                    Subject
                                </label>
                                <input 
                                    type="text" 
                                    name="subject"
                                    onFocus={() => setFocusedField('subject')}
                                    onBlur={() => setFocusedField(null)}
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-4 pt-7 pb-2 bg-transparent outline-none text-slate-900 font-medium"
                                />
                            </div>

                            {/* Dynamic Input: Message */}
                            <div className={`relative rounded-xl border-2 transition-all duration-300 bg-white ${focusedField === 'message' ? 'border-brand-blue shadow-lg shadow-brand-blue/10' : 'border-slate-100 hover:border-slate-300'}`}>
                                <label className={`absolute left-4 transition-all duration-300 pointer-events-none text-xs font-bold uppercase tracking-widest ${focusedField === 'message' || formData.message ? 'top-3 text-brand-blue scale-90' : 'top-5 text-slate-400'}`}>
                                    Message
                                </label>
                                <textarea 
                                    name="message"
                                    required
                                    rows={6}
                                    onFocus={() => setFocusedField('message')}
                                    onBlur={() => setFocusedField(null)}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 pt-9 pb-3 bg-transparent outline-none text-slate-900 font-medium resize-none"
                                ></textarea>
                            </div>

                            <div className="pt-2">
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="group relative w-1/2 flex justify-center items-center gap-3 bg-slate-900 hover:bg-brand-blue-dark text-white p-5 rounded-xl font-black uppercase tracking-[0.2em] text-sm overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-brand-blue-dark/30 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    <span className="relative z-10">{isSubmitting ? 'Sending Message...' : 'Send Message'}</span>
                                    {!isSubmitting && <ArrowRight size={18} className="relative z-10 group-hover:translate-x-2 transition-transform duration-300" />}
                                    <div className="absolute inset-0 bg-gradient-to-r from-brand-orange to-brand-blue-dark opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                                </button>
                            </div>

                        </form>
                    </div>

                </div>
            </div>
        </main>
    );
}
