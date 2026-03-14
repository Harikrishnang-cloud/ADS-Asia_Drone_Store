"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { 
    collection, 
    getDocs, 
    updateDoc, 
    doc, 
    query, 
    orderBy 
} from "firebase/firestore";
import { 
    Search, 
    Mail, 
    Phone, 
    ShieldAlert, 
    ShieldCheck, 
    Calendar, 
    User as UserIcon,
    MoreVertical,
    CheckCircle2,
    XCircle,
    Loader2
} from "lucide-react";

interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    authProvider: string;
    status: "active" | "blocked";
    createdAt: any;
    profileImage?: string;
}

export default function UserManager() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const userData = querySnapshot.docs.map(doc => ({id: doc.id,...doc.data()} as User));
            setUsers(userData);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleUserStatus = async (user: User) => {
        const newStatus = user.status === "active" ? "blocked" : "active";
        const message = `Are you sure you want to ${newStatus === "blocked" ? "BLOCK" : "UNBLOCK"} ${user.name}?`;
        
        if (!confirm(message)) return;

        setUpdatingId(user.id);
        try {
            const userRef = doc(db, "users", user.id);
            await updateDoc(userRef, {
                status: newStatus,
                updatedAt: Date.now()
            });
            
            // Update local state
            setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
        } catch (error) {
            console.error("Error updating user status:", error);
            alert("Failed to update user status");
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredUsers = users.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getAuthLabel = (provider: string) => {
        if (provider === "google") return "Google Authentication";
        return "Email Authentication";
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp) return "N/A";
        // Handle both JS timestamp and Firebase Timestamp
        const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };
    const formatTime = (timestamp: any) => {
        if (!timestamp) return "N/A";
        // Handle both JS timestamp and Firebase Timestamp
        const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Users Management</h2>
                    <p className="text-slate-500 font-medium">Manage and monitor application users</p>
                </div>

                <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                        <Search size={18} />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search by name or email..."
                        className="w-full bg-white border border-slate-200 pl-12 pr-4 py-3 rounded-2xl focus:outline-none focus:border-brand-orange transition-all shadow-sm font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Users Table / List */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-5 text-xs font-black uppercase tracking-wider text-slate-500 text-center">User Details</th>
                                <th className="px-6 py-5 text-xs font-black uppercase tracking-wider text-slate-500 text-center">Auth Method</th>
                                <th className="px-6 py-5 text-xs font-black uppercase tracking-wider text-slate-500 text-center">Account Status</th>
                                <th className="px-6 py-5 text-xs font-black uppercase tracking-wider text-slate-500 text-center">Joined Date</th>
                                <th className="px-6 py-5 text-xs font-black uppercase tracking-wider text-slate-500 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-100"></div>
                                                <div className="space-y-2">
                                                    <div className="h-4 w-32 bg-slate-100 rounded"></div>
                                                    <div className="h-3 w-40 bg-slate-100 rounded"></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><div className="h-4 w-32 bg-slate-100 rounded"></div></td>
                                        <td className="px-6 py-4"><div className="h-6 w-20 bg-slate-100 rounded-full"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 w-24 bg-slate-100 rounded"></div></td>
                                        <td className="px-6 py-4"><div className="h-8 w-8 ml-auto bg-slate-100 rounded-lg"></div></td>
                                    </tr>
                                ))
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                                                    {user.profileImage ? (
                                                        <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <UserIcon size={20} className="text-slate-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 group-hover:text-brand-orange transition-colors">{user.name || "N/A"}</p>
                                                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                                                        <Mail size={12} />
                                                        <span>{user.email}</span>
                                                        {user.phone && (
                                                            <>
                                                                <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                                                                <Phone size={12} />
                                                                <span>{user.phone}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-semibold text-slate-700">{getAuthLabel(user.authProvider)}</span>
                                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">PROVIDER: {user.authProvider || 'Email'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-sm ${
                                                user.status === 'blocked' 
                                                ? 'bg-red-50 text-red-600 border border-red-100' 
                                                : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                            }`}>
                                                {user.status === 'blocked' ? <ShieldAlert size={12} /> : <ShieldCheck size={12} />}
                                                {user.status || 'active'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                                                <Calendar size={14} className="text-slate-300" />
                                                {formatDate(user.createdAt)},{formatTime(user.createdAt)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button 
                                                onClick={() => toggleUserStatus(user)}
                                                disabled={updatingId === user.id}
                                                className={`p-2.5 rounded-xl transition-all shadow-sm active:scale-95 ${
                                                    user.status === 'blocked'
                                                    ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'
                                                    : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                                                }`}
                                                title={user.status === 'blocked' ? 'Unblock User' : 'Block User'}
                                            >
                                                {updatingId === user.id ? (
                                                    <Loader2 size={18} className="animate-spin" />
                                                ) : user.status === 'blocked' ? (
                                                    <CheckCircle2 size={18} />
                                                ) : (
                                                    <XCircle size={18} />
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                                <Search size={32} className="text-slate-200" />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900">No Users Found</h3>
                                            <p className="text-slate-400 max-w-xs text-sm mt-1">We couldn't find any users matching your current criteria.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Summary Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Registered</h4>
                    <div className="text-3xl font-black text-slate-900">{users.length}</div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Active Accounts</h4>
                    <div className="text-3xl font-black">{users.filter(u => u.status !== 'blocked').length}</div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Blocked Accounts</h4>
                    <div className="text-3xl font-black">{users.filter(u => u.status === 'blocked').length}</div>
                </div>
            </div>
        </div>
    );
}
