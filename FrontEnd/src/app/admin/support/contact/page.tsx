"use client";

import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Search, Mail, ShieldAlert } from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";

interface ContactMessage {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: string;
    createdAt: string;
}

export default function AdminContactPage() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/support/admin/contact");
            if (data.success) {
                setMessages(data.contacts);
            }
        } catch (error: any) {
            console.error("Failed to fetch contact messages:", error);
            toast.error("Failed to fetch messages");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const filteredMessages = messages.filter((msg: ContactMessage) => {
        const term = searchTerm.toLowerCase();
        return (
            (msg.name?.toLowerCase() || "").includes(term) ||
            (msg.email?.toLowerCase() || "").includes(term) ||
            (msg.subject?.toLowerCase() || "").includes(term)
        );
    });

    return (
        <ProtectedRoute allowedRole="admin">
            <div className="mb-10 w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-3">
                           
                            Contact Messages
                        </h1>
                        <p className="text-slate-500 font-medium">Monitor customer inquiries and messages</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden w-full">
                    <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
                        <div className="relative w-full sm:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name, email, or subject..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                            />
                        </div>
                        <div className="flex gap-4 w-full sm:w-auto">
                            <div className="bg-brand-orange/10 px-4 py-2 rounded-md text-brand-orange text-sm font-bold whitespace-nowrap">
                                Total Messages: {messages.length}
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left border-collapse min-w-max">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User Details</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-1/3">Message</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mx-auto mb-4"></div>
                                            <p className="font-medium">Loading messages...</p>
                                        </td>
                                    </tr>
                                ) : filteredMessages.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-16 text-center text-slate-500">
                                            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <ShieldAlert className="text-slate-300" size={32} />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-700 mb-1">No Messages Found</h3>
                                            <p className="font-medium text-slate-500">Your inbox is currently empty.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredMessages.map((msg: ContactMessage) => (
                                        <tr key={msg.id} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-slate-700">
                                                    {new Date(msg.createdAt).toLocaleDateString()}
                                                </div>
                                                <div className="text-xs text-slate-500 font-medium">
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-bold text-slate-800">{msg.name}</span>
                                                    <a href={`mailto:${msg.email}`} className="text-sm text-brand-blue hover:underline font-medium">
                                                        {msg.email}
                                                    </a>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 w-1/3">
                                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 group-hover:border-slate-200 transition-colors">
                                                    <h4 className="font-bold text-slate-800 text-sm mb-1">{msg.subject || 'No Subject'}</h4>
                                                    <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                                                        {msg.message}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${msg.status === 'unread' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                    {msg.status.toUpperCase()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
