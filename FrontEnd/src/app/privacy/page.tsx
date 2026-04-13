"use client";

import React, { useState, useEffect } from "react";
import {ArrowRight, Mail, Phone, MapPin } from "lucide-react";

export default function PrivacyPolicy() {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setHasMounted(true);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    const sections = [
        {
            id: "introduction",
            title: "1. Introduction",
            content: "Welcome to Asia Drone Store (ADS). Your privacy is of paramount importance to us. This Privacy Policy outlines how Asia Drone Store collects, uses, processes, and protects your personal information when you visit our website or use our services. By using our platform, you agree to the collection and use of information in accordance with this policy."
        },
        {
            id: "data-collection",
            title: "2. Information We Collect",
            content: "We collect various types of information to provide and improve our service to you:",
            list: [
                "Personal Identification Information: Name, email address, phone number, and shipping/billing address.",
                "Payment Information: We use secure third-party payment processors. We do not store your full credit card details on our servers.",
                "Technical Data: IP address, browser type, device information, and usage patterns through cookies and similar technologies.",
                "Order History: Details about the products you purchase and your interactions with our support team."
            ]
        },
        {
            id: "usage",
            title: "3. How We Use Your Information",

            content: "We use the collected data for various purposes, including:",
            list: [
                "To process and fulfill your drone orders and provide order updates.",
                "To provide customer support and handle warranty/repair requests.",
                "To notify you about changes to our service or new product launches.",
                "To detect, prevent, and address technical issues or fraudulent activities.",
                "To improve our website performance and user experience."
            ]
        },
        {
            id: "security",
            title: "4. Data Security",
            content: "The security of your data is a top priority. We implement professional-grade security measures to protect your personal information. However, please remember that no method of transmission over the Internet or method of electronic storage is 100% secure. We strive to use commercially acceptable means to protect your personal data, including SSL encryption and restricted access protocols."
        },
        {
            id: "Refund Policy",
            title: "5. Refund & Return Policy",
            content: "We want you to be completely satisfied with your drone equipment. You may return most new, unopened items within 7 days of delivery for a full refund. Items must be in their original packaging with all accessories and seals intact. Please note that used drones or products with activated software/firmware are not eligible for a full refund due to safety and technical compliance standards."
        },
        {
            id: "cookies",
            title: "6. Cookie Policy",
            content: "Asia Drone Store uses cookies to track activity on our platform and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service."
        },
    
    ];

    if (!hasMounted) return null;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Hero Section */}
            <div className="bg-brand-blue-dark text-white py-20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-blue rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-orange rounded-full blur-[100px]"></div>
                </div>
                
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <span className="text-brand-orange font-bold tracking-[0.3em] uppercase text-sm mb-4 block animate-in fade-in slide-in-from-bottom-4 duration-700">Legal Center</span>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-1000">Privacy <span className="text-brand-orange">Policy</span></h1>
                    <p className="text-slate-300 max-w-2xl mx-auto text-lg leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                        At Asia Drone Store, we are committed to protecting your personal data and your privacy. Learn how we handle your information with transparency.
                    </p>
                    <div className="mt-8 text-slate-400 text-sm font-medium">
                        Last Updated: April 13, 2026
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 -mt-10 relative z-20">
                <div className="flex flex-col lg:flex-row gap-12">
                    
                    {/* Table of Contents - Desktop Only */}
                    <div className="hidden lg:block w-1/4 sticky top-32 h-fit space-y-4">
                        <div className="bg-white rounded-xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
                            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                                
                                On This Page
                            </h3>
                            <nav className="space-y-3 smooth-scroll">
                                <ul className="space-y-4">
                                  {sections.map((section) => (
                                    <li key={section.id}>
                                      <a
                                        href={`#${section.id}`}
                                        className="text-slate-400 hover:text-brand-orange transition-colors flex items-center gap-2 group text-sm"
                                      >
                                        <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                        {section.title}
                                      </a>
                                    </li>
                                    ))}
                                </ul>
                                <a href="/contact" className="block text-sm text-slate-500 hover:text-brand-blue transition-colors py-1 hover:translate-x-1 duration-200 font-bold border-t border-slate-50 pt-3 mt-3 text-brand-orange">
                                    Contact Support
                                </a>
                            </nav>
                        </div>

                        <div className="bg-brand-blue rounded-xl p-6 text-white shadow-xl shadow-brand-blue/20">
                            <h4 className="font-bold mb-2">Secure Store</h4>
                            <p className="text-sm text-slate-200 leading-relaxed">
                                All transactions and personal data are protected by industry-standard encryption protocols.
                            </p>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="w-full lg:w-3/4 space-y-12">
                        <div className="bg-white rounded-xl p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100">
                            {sections.map((section) => (
                                <section key={section.id} id={section.id} className="mb-16 last:mb-0 transform transition-all duration-500">
                                    <div className="flex items-center gap-4 mb-6">
                                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{section.title}</h2>
                                    </div>
                                    <p className="text-slate-600 leading-relaxed text-lg mb-6">
                                        {section.content}
                                    </p>
                                    {section.list && (
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {section.list.map((item, index) => (
                                                <li key={index} className="flex gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-700 text-sm items-start">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </section>
                            ))}

                            <div className="h-px bg-slate-100 my-16"></div>

                            {/* Contact Support Section in Content */}
                            <section id="contact" className="bg-slate-900 rounded-xl p-8 md:p-10 text-white relative overflow-hidden">
                                <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-orange/20 rounded-full blur-3xl"></div>
                                
                                <h2 className="text-3xl font-black mb-6 relative z-10">Still have questions?</h2>
                                <p className="text-slate-400 mb-8 relative z-10 text-lg">
                                    If you have any questions about this Privacy Policy or our practices, please contact our legal team at:
                                </p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all duration-300">
                                            <Mail size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Email Us</p>
                                            <p className="text-slate-200 font-medium">asiadronestore@gmail.com</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all duration-300">
                                            <Phone size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Call Us</p>
                                            <p className="text-slate-200 font-medium">+91 70121 47575</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 group col-span-1 md:col-span-2">
                                        <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all duration-300 flex-shrink-0">
                                            <MapPin size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Head Office</p>
                                            <p className="text-slate-200 font-medium leading-relaxed">
                                                Asia Softlab Pvt Ltd, 1st Floor - MG Corporate Center, Ulloor, Thiruvananthapuram, Kerala, 695011
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
