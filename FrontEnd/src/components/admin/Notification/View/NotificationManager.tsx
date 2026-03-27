"use client";
import { Plus, Trash2, Tag, Bell, AlertCircle, Loader2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import useNotification from "../Controller/useNotification";
import AdminHeader from "@/components/ui/AdminHeader";
import Button from "@/components/ui/button";
import { X } from "lucide-react";


export default function NotificationManager() {
    const { notifications,formdataUpdate, setFormData, setNotificationToDelete, toggleIsAdding, loading, isAdding, isSaving, notificationToDelete, isDeleting, formData, fetchNotifications, handleSubmit, confirmDelete } = useNotification();

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <AdminHeader 
                title="User Notifications" 
                description="Broadcast important updates and offers to all platform users"
                actionButton={
                    <Button 
                        onClick={() => toggleIsAdding()}
                        variant="orange"
                        icon={isAdding ? <X size={18} /> : <Plus size={18} />}>
                        {isAdding ? "Cancel" : "New Notification"}
                    </Button>
                }
            />

            <Modal isOpen={isAdding} onClose={toggleIsAdding} title="Create Notification" maxWidth="lg">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                        <input
                            type="text"
                            className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-orange focus:outline-none"
                            value={formData.title}
                            name="title"
                            onChange={formdataUpdate}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                        <textarea
                            className="w-full border border-slate-300 rounded-lg p-2 h-32 focus:ring-2 focus:ring-brand-orange focus:outline-none"
                            value={formData.message}
                            onChange={formdataUpdate}
                            required/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                        <select
                            className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-orange focus:outline-none"
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value as any })}>
                            <option value="info">Information</option>
                            <option value="offer">Special Offer</option>
                            <option value="alert">Alert/Warning</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={toggleIsAdding} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer">Cancel</button>
                        <button type="submit" disabled={isSaving} className="bg-brand-blue-dark text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 cursor-pointer flex items-center gap-2">
                            {isSaving && <Loader2 size={16} className="animate-spin" />}
                            Send Now
                        </button>
                    </div>
                </form>
            </Modal>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-500">Type</th>
                            <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-500">Notification Content</th>
                            <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-500">Sent Date</th>
                            <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading ? (
                            Array(3).fill(0).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={4} className="px-6 py-4"><div className="h-6 bg-slate-100 rounded"></div></td>
                                </tr>
                            ))
                        ) : notifications.length > 0 ? (
                            notifications.map((notif) => (
                                <tr key={notif.id} className="hover:bg-slate-50 transition-colors text-sm">
                                    <td className="px-6 py-4 capitalize font-medium text-slate-700">
                                        <div className="flex items-center gap-2">
                                            {notif.type === 'offer' && <Tag size={16} className="text-orange-500" />}
                                            {notif.type === 'alert' && <AlertCircle size={16} className="text-red-500" />}
                                            {notif.type === 'info' && <Bell size={16} className="text-blue-500" />}
                                            {notif.type}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-800">{notif.title}</div>
                                        <div className="text-slate-500 truncate max-w-xs">{notif.message}</div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {new Date(notif.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => setNotificationToDelete(notif.id)} className="text-red-500 hover:bg-red-50 p-1 rounded cursor-pointer transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="py-10 text-center text-slate-400">No notifications sent yet</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <ConfirmationModal
                isOpen={!!notificationToDelete}
                onClose={() => setNotificationToDelete(null)}
                onConfirm={confirmDelete}
                title="Delete Notification"
                message="This will remove the notification for all users."
                confirmText="Delete"
                type="danger"
                isLoading={isDeleting}
            />
        </div>
    );
}
