"use client";

import React, { useState } from "react";
import { Search, ChevronDown, MessageCircle, Mail, Phone, ExternalLink, ShoppingBag, Truck, Shield, Key, CreditCard, User, ArrowRight } from "lucide-react";

const Whatsapp = ({ className = '', size = 24 }: { className?: string; size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
    </svg>
);

const FAQS = [
    {
        category: "Ordering",
        question: "How do I track my drone order?",
        answer: "You can track your order by logging into your account and visiting the 'Orders' section. Once your drone is shipped, you'll receive an email with a tracking number and a link to our shipping partner's portal."
    },
    {
        category: "Ordering",
        question: "Can I cancel my order after it has been placed?",
        answer: "Orders can only be canceled within 1 hour of placement. After this window, the order enters our automated processing system and cannot be stopped. You may initiate a return once the item arrives."
    },
    {
        category: "Shipping",
        question: "What is your return policy for accessories?",
        answer: "We offer a 14-day return policy for unopened accessories. For drones and electronic components, returns are only accepted if the product is DOA (Dead on Arrival) or has a verified manufacturing defect."
    },
    {
        category: "Warranty",
        question: "How long does the warranty last?",
        answer: "Most of our drones come with a 1-year limited manufacturer warranty. Spare parts and batteries usually have a 6-month warranty. You can find specific warranty details on each product page."
    },
    {
        category: "Shipping",
        question: "Do you offer international shipping?",
        answer: "Yes, we ship to most countries in Asia. Shipping costs and delivery times vary by location. You can estimate shipping costs at checkout after entering your delivery address."
    },
    {
        category: "Account",
        question: "How do I reset my account password?",
        answer: "You can reset your password by clicking 'Forgot Password' on the login page. Follow the instructions sent to your registered email address to create a new secure password."
    },
    {
        category: "Payments",
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards, PayPal, and local bank transfers. For enterprise clients, we also offer invoice-based payment terms upon credit approval."
    }
];

const CATEGORIES = [
    { icon: ShoppingBag, color: 'text-brand-blue', name: "Ordering", description: "Payment methods, taxes, and order status" },
    { icon: Truck, color: 'text-brand-orange', name: "Shipping", description: "Delivery times, tracking, and shipping costs" },
    { icon: Shield, color: 'text-brand-blue', name: "Warranty", description: "Policy details, claims, and repairs" },
    { icon: Key, color: 'text-brand-orange', name: "Account", description: "Login issues, security, and profile settings" },
    { icon: CreditCard, color: 'text-brand-blue', name: "Payments", description: "Invoices, refunds, and promo codes" },
    { icon: User, color: 'text-brand-orange', name: "Pilot Support", description: "Technical help, apps, and firmware" },
];

export default function HelpCenter() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const filteredFaqs = FAQS.filter(faq => {
        const matchesCategory = selectedCategory ? faq.category === selectedCategory : true;
        const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-brand-blue-dark pt-32 pb-10 md:pt-48 md:pb-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/10 blur-[100px] rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-blue/10 blur-[100px] rounded-full"></div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
                        How can we <span className="text-brand-orange italic underline decoration-white/20 underline-offset-8">help</span> you today?
                    </h1>
                    <p className="text-blue-100/70 text-lg mb-10 max-w-2xl mx-auto font-medium">
                        Search our knowledge base or browse categories below to find answers to your questions.
                    </p>

                    <div className="max-w-2xl mx-auto relative group">
                        <div className="absolute inset-0 bg-brand-orange/20 blur-xl group-focus-within:bg-brand-orange/30 transition-all rounded-2xl"></div>
                        <div className="relative flex items-center bg-white rounded-md shadow-2xl p-2">
                            <Search className="text-slate-400 ml-4" size={24} />
                            <input type="text"
                                placeholder="Search for troubleshooting, warranty, orders..."
                                className="w-full px-4 py-4 text-slate-900 outline-none font-medium placeholder:text-slate-400"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)} />
                            <button className="bg-brand-blue hover:bg-brand-blue-dark text-white px-8 py-4 rounded-lg font-bold transition-all flex items-center gap-2 group cursor-pointer">
                                Search
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm">
                        <span className="text-blue-100/50 font-bold uppercase tracking-widest text-[10px]"></span>
                        {["Warranty", "Shipping", "Refunds", "Account"].map(tag => (
                            <button key={tag} onClick={() => setSearchQuery(tag)} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/20 hover:border-white/30 transition-all font-medium">
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="container mx-auto px-6 py-20 -mt-10 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {CATEGORIES.map((category) => {
                        const isSelected = selectedCategory === category.name && selectedCategory === category.description;
                        const words = category.description.split(" ");

                        return (
                            <button key={category.name + category.description}
                                onClick={() => setSelectedCategory(isSelected ? null : category.name + category.description)}
                                className={`relative overflow-hidden p-8 rounded-xl border text-left transition-all duration-1000 group cursor-pointer hover:-translate-y-2 ${isSelected
                                    ? "bg-white border-brand-orange shadow-2xl ring-4 ring-brand-orange/5"
                                    : "bg-white border-slate-100 shadow-sm hover:shadow-xl"
                                    }`}>
                                <div className={`absolute -bottom-1/4 -right-1/4 w-[150%] h-[150%] bg-brand-blue-dark transition-all duration-1000 ease-out rotate-12 translate-y-full group-hover:translate-y-0 group-hover:rotate-0 z-0 ${isSelected ? "opacity-0" : "opacity-100"
                                    }`} />
                                <div className="relative z-10 h-full flex flex-col">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-all duration-1000 ${isSelected ? "bg-brand-orange/10 shadow-inner" : "bg-slate-50 group-hover:bg-white/10 group-hover:shadow-lg"
                                        }`}>
                                        <category.icon
                                            size={32}
                                            className={`transition-all duration-500 ${isSelected ? "text-brand-orange scale-110" : `${category.color} group-hover:text-white group-hover:scale-110 group-hover:rotate-12`}`} />
                                    </div>
                                    <h3 className={`text-2xl font-black mb-3 transition-colors duration-300 ${isSelected ? "text-brand-orange" : "text-brand-blue-dark group-hover:text-white"}`}>
                                        {category.name}
                                    </h3>
                                    <p className={`flex flex-wrap gap-x-1.5 font-medium leading-relaxed transition-colors duration-300 ${isSelected ? "text-slate-500" : "text-slate-400 group-hover:text-white/80"
                                        }`}>
                                        {words.map((word, i) => (
                                            <span key={word + i} className="inline-block transition-colors duration-300">
                                                {word}
                                            </span>
                                        ))}
                                    </p>
                                    <div className="mt-auto pt-8">
                                        <div className={`h-1.5 rounded-full transition-all duration-500 ${isSelected ? "w-16 bg-brand-orange" : "w-0 group-hover:w-16 bg-brand-orange"
                                            }`} />
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* FAQ Section */}
            <section className="container mx-auto px-6 py-20">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-brand-blue-dark mb-4">Frequently Asked Questions</h2>
                        <div className="w-20 h-1.5 bg-brand-orange mx-auto rounded-full"></div>
                    </div>

                    <div className="space-y-4 cursor-pointer">
                        {filteredFaqs.length > 0 ? (
                            filteredFaqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-lg border border-slate-100 overflow-hidden transition-all shadow-sm hover:shadow-md">
                                    <button
                                        className="w-full px-8 py-6 flex items-center justify-between text-left group cursor-pointer"
                                        onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                                        <span className={`text-lg font-bold transition-colors ${openFaq === index ? 'text-brand-orange' : 'text-brand-blue-dark group-hover:text-brand-blue'}`}>
                                            {faq.question}
                                        </span>
                                        <ChevronDown
                                            size={20}
                                            className={`text-slate-400 transition-transform duration-300 ${openFaq === index ? 'rotate-180 text-brand-orange' : ''}`} />
                                    </button>
                                    <div className={`px-8 transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-96 pb-8' : 'max-h-0 overflow-hidden'}`}>
                                        <p className="text-slate-600 leading-relaxed font-medium">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 border-dashed">
                                <p className="text-slate-400 font-bold italic">No questions found matching your search.</p>
                                <button
                                    onClick={() => { setSearchQuery(""); setSelectedCategory(null); }}
                                    className="mt-4 text-brand-blue font-bold hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Contact Support Section */}
            <section className="bg-white py-24">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-5xl font-black text-brand-blue-dark mb-6">Still need assistance?</h2>
                    <p className="text-slate-500 text-lg mb-16 max-w-2xl mx-auto font-medium">
                        Our expert support team is ready to help you with any technical issues or inquiries.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 cursor-pointer">
                        {/* Live Chat */}
                        <a href="/contact" className="block w-full relative p-8 rounded-xl bg-white border border-slate-100 group overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-xl text-center">
                            {/* Opposite Direction Background */}
                            <div className="absolute -top-1/4 -right-1/4 w-[150%] h-[150%] bg-brand-blue-dark transition-all duration-1000 ease-out rotate-12 -translate-y-full group-hover:translate-y-0 group-hover:rotate-0 z-0" />
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-slate-50 mb-8 transition-all duration-1000 group-hover:bg-white/10 group-hover:shadow-lg">
                                    <MessageCircle className="text-brand-blue group-hover:text-white group-hover:scale-110 transition-all duration-1000" size={32} />
                                </div>

                                <h4 className="text-2xl font-black mb-3 text-brand-blue-dark group-hover:text-white transition-colors duration-300">
                                    Live Chat
                                </h4>

                                <p className="text-slate-500 text-sm mb-8 group-hover:text-white/70 font-medium">Wait time: &lt; 2 mins</p>
                                <span className="text-lg font-bold text-brand-blue flex items-center gap-2 group-hover:text-brand-orange transition-all duration-300">
                                    Start Chat <ExternalLink size={18} />
                                </span>

                                <div className="mt-8 h-1.5 w-0 group-hover:w-16 bg-brand-orange rounded-full transition-all duration-500" />
                                <p className="text-slate-500 text-sm mb-8 group-hover:text-white/70 font-medium">The chat feature will be available after completing some updates. We appreciate your patience.</p>
                            </div>
                        </a>

                        {/* Email Support */}
                        <a href="mailto:asiadronestore@gmail.com" className="block w-full relative p-8 rounded-xl bg-white border border-slate-100 group overflow-hidden cursor-pointer transition-all duration-1000 hover:-translate-y-2 hover:shadow-xl text-center">
                            <div className="absolute -bottom-1/4 -right-1/4 w-[150%] h-[150%] bg-brand-blue-dark transition-all duration-1000 ease-out rotate-12 translate-y-full group-hover:translate-y-0 group-hover:rotate-0 z-0" />
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-slate-50 mb-8 transition-all duration-1000 group-hover:bg-white/10 group-hover:shadow-lg">
                                    <Mail className="text-brand-orange group-hover:text-white group-hover:scale-110 transition-all duration-1000" size={32} />
                                </div>
                                <h4 className="text-2xl font-black mb-3 text-brand-blue-dark group-hover:text-white transition-colors duration-300">Email Us</h4>
                                <p className="text-slate-500 text-sm mb-8 group-hover:text-white/70 font-medium">Response: &lt; 24 hours</p>
                                <span className="text-lg font-bold text-brand-orange flex items-center gap-2 group-hover:text-white transition-all duration-300">
                                    Send Email <ArrowRight size={18} />
                                </span>
                                <div className="mt-8 h-1.5 w-0 group-hover:w-16 bg-brand-orange rounded-full transition-all duration-500" />
                                <p className="text-slate-500 text-sm mb-8 group-hover:text-white/70 font-medium"></p>
                            </div>
                        </a>

                        {/* Phone Support */}
                        <a href="tel:+917012147575" className="block w-full relative p-8 rounded-xl bg-white border border-slate-100 group overflow-hidden cursor-pointer transition-all duration-1000 hover:-translate-y-2 hover:shadow-xl text-center">

                            <div className="absolute -top-1/4 -right-1/4 w-[150%] h-[150%] bg-brand-blue-dark transition-all duration-1000 ease-out rotate-12 -translate-y-full group-hover:translate-y-0 group-hover:rotate-0 z-0" />
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-slate-50 mb-8 transition-all duration-1000 group-hover:bg-white/10 group-hover:shadow-lg">
                                    <Phone className="text-brand-blue group-hover:text-white group-hover:scale-110 group-hover:rotate-12 transition-all duration-500" size={32} />
                                </div>
                                
                                <h4 className="text-2xl font-black mb-3 text-brand-blue-dark group-hover:text-white transition-colors duration-300">
                                    Call Support
                                </h4>
                                <p className="text-slate-500 text-sm mb-4 group-hover:text-white/70 font-medium">Response: &lt; 24 hours</p>
                                <div className="text-sm mb-6 flex flex-col items-center text-slate-500 group-hover:text-white/80 font-medium leading-relaxed">
                                    {["Monday - Saturday", "9:30 AM - 5:30 PM"].map((line, i) => (
                                        <span key={i} className="transition-all duration-500">
                                            {line}
                                        </span>
                                    ))}
                                </div>
                                <span className="text-lg font-bold text-brand-blue group-hover:text-brand-orange transition-all duration-300">
                                    +91 70121 47575
                                </span>
                                <div className="mt-8 h-1.5 w-0 group-hover:w-16 bg-brand-orange rounded-full transition-all duration-500" />
                            </div>
                        </a>
                        {/* WhatsApp Support */}
                        <a href="https://wa.me/917012147575" target="_blank" rel="noopener noreferrer" className="block w-full relative p-8 rounded-xl bg-white border border-slate-100 group overflow-hidden cursor-pointer transition-all duration-1000 hover:-translate-y-2 hover:shadow-xl text-center">
                            <div className="absolute -bottom-1/4 -right-1/4 w-[150%] h-[150%] bg-brand-blue-dark transition-all duration-1000 ease-out rotate-12 translate-y-full group-hover:translate-y-0 group-hover:rotate-0 z-0" />
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-slate-50 mb-8 transition-all duration-1000 group-hover:bg-white/10 group-hover:shadow-lg">
                                    <Whatsapp className="text-brand-orange group-hover:text-white group-hover:scale-110 transition-all duration-1000" size={32} />
                                </div>
                                <h4 className="text-2xl font-black mb-3 text-brand-blue-dark group-hover:text-white transition-colors duration-300">WhatsApp</h4>
                                <p className="text-slate-500 text-sm mb-8 group-hover:text-white/70 font-medium">Fast responses on mobile</p>
                                <span className="text-lg font-bold text-brand-orange flex items-center gap-2 group-hover:text-white transition-all duration-300">
                                    Message Us <ArrowRight size={18} />
                                </span>
                                <div className="mt-8 h-1.5 w-0 group-hover:w-16 bg-brand-orange rounded-full transition-all duration-500" />
                            </div>
                        </a>

                    </div>
                </div>
            </section>
        </div>
    );
}
