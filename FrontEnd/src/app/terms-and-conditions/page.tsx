"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Mail, Phone, MapPin, ExternalLink } from "lucide-react";

export default function TermsAndConditions() {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setHasMounted(true);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    const sections = [
        {
            id: "acceptance",
            title: "1. Acceptance of Terms",
            content: "By accessing and using the Asia Drone Store (ADS) website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. These terms apply to all visitors, users, and others who access or use the Service. If you disagree with any part of the terms, then you may not access the Service."
        },
        {
            id: "eligibility",
            title: "2. Eligibility",
            content: "You must be at least 18 years of age to use this website. By using this website and by agreeing to these terms and conditions, you warrant and represent that you are at least 18 years of age. If you are under 18, you may only use the services with the involvement and consent of a parent or guardian."
        },
        {
            id: "accounts",
            title: "3. User Accounts",
            content: "When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.",
            list: [
                "You are responsible for safeguarding the password that you use to access the Service.",
                "You agree not to disclose your password to any third party.",
                "You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.",
                "We reserve the right to refuse service, terminate accounts, or cancel orders at our sole discretion."
            ]
        },
        {
            id: "products-pricing",
            title: "4. Products and Pricing",
            content: "We strive to provide accurate information regarding our drone products and pricing. However, errors may occur.",
            list: [
                "All prices are subject to change without notice.",
                "We reserve the right to modify or discontinue any product at any time.",
                "In the event of a pricing error, we reserve the right to cancel any orders placed at the incorrect price.",
                "Product images are for illustrative purposes and may vary slightly from the actual product."
            ]
        },
        {
            id: "shipping",
            title: "5. Shipping and Delivery",
            content: "Asia Drone Store delivers across India and selected international regions. Delivery times are estimates and not guaranteed.",
            list: [
                "Risk of loss and title for items purchased pass to you upon delivery to the carrier.",
                "Any shipping delays caused by customs or courier services are beyond our control.",
                "Shipping costs are calculated at checkout based on location and weight."
            ]
        },
        {
            id: "intellectual-property",
            title: "6. Intellectual Property",
            content: "The Service and its original content, features, and functionality are and will remain the exclusive property of Asia Drone Store and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Asia Drone Store."
        },
        {
            id: "prohibited",
            title: "7. Prohibited Activities",
            content: "You agree not to engage in any of the following prohibited activities:",
            list: [
                "Using the Service for any illegal purpose or in violation of any local, state, or international law.",
                "Violating or encouraging others to violate the rights of third parties.",
                "Interfering with security-related features of the Service.",
                "Engaging in any automated use of the system, such as using scripts to send comments or messages."
            ]
        },
        {
            id: "drone-safety",
            title: "8. Drone Safety & Regulations",
            subtitle: "For more Details Visit our Official Pilot Training (please visit)",
            content: "Operating a drone requires responsibility and adherence to local laws. By purchasing from us, you agree to:",
            list: [
                "Comply with all local civil aviation authority (e.g., DGCA in India) regulations.",
                "Obtain all necessary permits and licenses for drone operation in your region.",
                "Not fly drones over restricted areas, airports, or crowded public spaces without authorization.",
                "Accept full responsibility for any any damage or injury caused by the operation of products purchased from ADS."
            ]
        },
        {
            id: "limitation-liability",
            title: "9. Limitation of Liability",
            content: "In no event shall Asia Drone Store, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service."
        },
        {
            id: "governing-law",
            title: "10. Governing Law",
            content: "These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights."
        },
        {
            id: "changes",
            title: "11. Changes to Terms",
            content: "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion."
        }
    ];

    if (!hasMounted) return null;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Hero Section */}
            <div className="bg-brand-blue-dark text-white py-12 md:py-20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-48 h-48 md:w-96 md:h-96 bg-brand-blue rounded-full blur-[50px] md:blur-[100px]"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-48 h-48 md:w-96 md:h-96 bg-brand-orange rounded-full blur-[50px] md:blur-[100px]"></div>
                </div>
                
                <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
                    <span className="text-brand-orange font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase text-[10px] md:text-sm mb-2 md:mb-4 block animate-in fade-in slide-in-from-bottom-4 duration-700">Legal Agreement</span>
                    <h1 className="text-2xl sm:text-4xl md:text-6xl font-black mb-4 md:mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-1000">Terms & <span className="text-brand-orange">Conditions</span></h1>
                    <p className="text-slate-300 max-w-2xl mx-auto text-xs sm:text-sm md:text-lg leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 px-2">
                        Please read these terms and conditions carefully before using our services. Your use of Asia Drone Store constitutes acceptance of these terms.
                    </p>
                    <div className="mt-6 md:mt-8 text-slate-400 text-[10px] md:text-sm font-medium">
                        Last Updated : 17 July, 2026
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 -mt-10 relative z-20">
                <div className="flex flex-col lg:flex-row gap-12">
                    
                    {/* Table of Contents - Desktop Only */}
                    <div className="hidden lg:block w-1/4 sticky top-32 h-fit space-y-4">
                        <div className="bg-white rounded-xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
                            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                                Navigation
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
                                    Need help? Contact us
                                </a>
                            </nav>
                        </div>

                        <div className="bg-brand-blue rounded-xl p-6 text-white shadow-xl shadow-brand-blue/20">
                            <h4 className="font-bold mb-2 flex items-center gap-2">
                                Compliance
                            </h4>
                            <p className="text-sm text-slate-200 leading-relaxed">
                                We operate in full compliance with local aviation and e-commerce regulations for drone technology.
                            </p>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="w-full lg:w-3/4 space-y-6 md:space-y-12">
                        <div className="bg-white rounded-xl p-4 sm:p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100">
                            {sections.map((section) => (
                                <section key={section.id} id={section.id} className="mb-8 md:mb-16 last:mb-0 transform transition-all duration-500">
                                    <div className="flex items-center gap-2 md:gap-4 mb-3 md:mb-6">
                                        <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{section.title}</h2>
                                    </div>
                                    <p className="text-slate-600 leading-relaxed text-xs sm:text-sm md:text-lg mb-3 md:mb-4">
                                        {section.content}
                                    </p>
                                    {section.subtitle && (
                                        <Link 
                                            href="https://asiasoftlab.in" 
                                            target="_blank"
                                            className="inline-flex items-center gap-1.5 md:gap-2 text-brand-orange hover:text-brand-blue font-bold text-[10px] md:text-sm transition-colors mb-4 md:mb-6 group bg-orange-50 px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-orange-100"
                                        >
                                            {section.subtitle}
                                            <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform md:w-[16px] md:h-[16px]" />
                                        </Link>
                                    )}
                                    {section.list && (
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                                            {section.list.map((item, index) => (
                                                <li key={index} className="flex gap-2 md:gap-3 bg-slate-50 p-2 sm:p-4 rounded-lg md:rounded-xl border border-slate-100 text-slate-700 text-[10px] sm:text-sm items-start">
                                                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-brand-orange mt-1.5 flex-shrink-0"></div>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </section>
                            ))}

                            <div className="h-px bg-slate-100 my-8 md:my-16"></div>

                            {/* Contact Support Section in Content */}
                            <section id="contact" className="bg-slate-900 rounded-xl p-4 sm:p-8 md:p-10 text-white relative overflow-hidden">
                                <div className="absolute -top-10 -right-10 md:-top-20 md:-right-20 w-32 h-32 md:w-64 md:h-64 bg-brand-orange/20 rounded-full blur-2xl md:blur-3xl"></div>
                                
                                <h2 className="text-lg sm:text-2xl md:text-3xl font-black mb-3 md:mb-6 relative z-10 flex items-center gap-2 md:gap-3">
                                    Legal Inquiries
                                </h2>
                                <p className="text-slate-400 mb-6 md:mb-8 relative z-10 text-[10px] sm:text-sm md:text-lg">
                                    If you have any questions or concerns regarding these Terms and Conditions, please reach out to our legal department:
                                </p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 relative z-10">
                                    <div className="flex items-center gap-3 md:gap-4 group">
                                        <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg bg-slate-800 flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all duration-300">
                                            <Mail className="w-4 h-4 md:w-5 md:h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] md:text-xs text-slate-500 font-bold uppercase tracking-widest">Email Us</p>
                                            <p className="text-[11px] md:text-base text-slate-200 font-medium">asiadronestore@gmail.com</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 md:gap-4 group">
                                        <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg bg-slate-800 flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all duration-300">
                                            <Phone className="w-4 h-4 md:w-5 md:h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] md:text-xs text-slate-500 font-bold uppercase tracking-widest">Call Us</p>
                                            <p className="text-[11px] md:text-base text-slate-200 font-medium">+91 70121 47575</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 md:gap-4 group col-span-1 md:col-span-2">
                                        <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg bg-slate-800 flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all duration-300 flex-shrink-0">
                                            <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] md:text-xs text-slate-500 font-bold uppercase tracking-widest">Head Office</p>
                                            <p className="text-[10px] md:text-base text-slate-200 font-medium leading-relaxed">
                                                Asia Softlab Pvt Ltd, 1st Floor - MG Corporate Centre, Ulloor, Thiruvananthapuram, Kerala, 695011
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