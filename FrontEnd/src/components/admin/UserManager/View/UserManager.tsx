"use client";

import React from "react";
import { Search, Mail, Phone, ShieldAlert, ShieldCheck, Calendar, User as UserIcon, CheckCircle2, XCircle, Users as UsersIcon, ShieldBan, UserCheck } from "lucide-react";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import AdminHeader from "@/components/ui/AdminHeader";
import StatsCard from "@/components/ui/StatsCard";
import TableSkeleton from "@/components/ui/TableSkeleton";
import Button from "@/components/ui/button";
import { useUserManager } from "../Controller/useManager";

export default function UserManager() {
    const {
        users, 
        loading, 
        searchTerm, 
        setSearchTerm, 
        updatingId, 
        userToUpdate, 
        setUserToUpdate, 
        handleToggleStatus, 
        stats,
        getAuthLabel,
        formatDate,
        formatTime
    } = useUserManager();

    return (
        <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
            <AdminHeader 
                title="Users Management" 
                description="Manage and monitor application users" 
                searchTerm={searchTerm} 
                onSearchChange={setSearchTerm} 
                searchPlaceholder="Search by name or email..."/>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard label="Total Registered" value={stats.total} icon={<UsersIcon size={20} />} />
                <StatsCard label="Active Accounts" value={stats.active} icon={<UserCheck size={20} />} />
                <StatsCard label="Blocked Accounts" value={stats.blocked} icon={<ShieldBan size={20} />} />
            </div>

            {loading ? (
                <TableSkeleton rows={5} cols={5} />
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
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
                                {users.length > 0 ? (
                                    users.map((user) => (
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
                                                                    <span className="w-1 h-1 rounded-xl bg-slate-200"></span>
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
                                            <td className="px-6 py-5 text-center">
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider shadow-sm ${
                                                    user.status === 'blocked' 
                                                    ? 'bg-red-50 text-red-600 border border-red-100' 
                                                    : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                }`}>
                                                    {user.status === 'blocked' ? <ShieldAlert size={12} /> : <ShieldCheck size={12} />}
                                                    {user.status || 'active'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2 text-sm font-medium text-slate-500 justify-center">
                                                    <Calendar size={14} className="text-slate-300" />
                                                    {formatDate(user.createdAt)}, {formatTime(user.createdAt)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <Button 
                                                    onClick={() => setUserToUpdate(user)}
                                                    loading={updatingId === user.id}
                                                    variant={user.status === 'blocked' ? 'secondary' : 'danger'}
                                                    className="p-2.5 min-w-[40px]"
                                                    title={user.status === 'blocked' ? 'Unblock User' : 'Block User'}>
                                                    {user.status === 'blocked' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="w-20 h-20 bg-slate-50 rounded-xl flex items-center justify-center mb-4">
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
            )}
            
            <ConfirmationModal 
                isOpen={!!userToUpdate}
                onClose={() => setUserToUpdate(null)}
                onConfirm={handleToggleStatus}
                title={userToUpdate?.status === "active" ? "Block User" : "Unblock User"}
                message={`Are you sure you want to ${userToUpdate?.status === "active" ? "BLOCK" : "UNBLOCK"} ${userToUpdate?.name}? This will affect their ability to log in and use the platform.`}
                confirmText={userToUpdate?.status === "active" ? "Yes, Block" : "Yes, Unblock"}
                type={userToUpdate?.status === "active" ? "danger" : "info"}
                isLoading={updatingId === userToUpdate?.id}
            />
        </div>
    );
}
