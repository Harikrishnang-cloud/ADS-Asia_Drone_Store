"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { 
    collection, 
    addDoc, 
    getDocs, 
    deleteDoc, 
    doc, 
    query, 
    orderBy 
} from "firebase/firestore";
import { Plus, Trash2, Bell, Tag, AlertCircle, Save, Loader2, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import Modal from "@/components/ui/Modal";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

interface Notification {
    id: string;
    title: string;
    message: string;
    type: "offer" | "info" | "alert";
    createdAt: number;
}

export default function NotificationManager() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [notificationToDelete, setNotificationToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        message: "",
        type: "info" as "offer" | "info" | "alert"
    });

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Notification));
            setNotifications(data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            toast.error("Failed to load notifications");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.message) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsSaving(true);
        const loadingToast = toast.loading("Sending...");

        try {
            await addDoc(collection(db, "notifications"), {
                ...formData,
                createdAt: Date.now()
            });
            toast.success("Notification sent!", { id: loadingToast });
            setIsAdding(false);
            setFormData({ title: "", message: "", type: "info" });
            fetchNotifications();
        } catch (error) {
            toast.error("Failed to send", { id: loadingToast });
        } finally {
            setIsSaving(false);
        }
    };

    const confirmDelete = async () => {
        if (!notificationToDelete) return;
        setIsDeleting(true);
        try {
            await deleteDoc(doc(db, "notifications", notificationToDelete));
            toast.success("Deleted");
            setNotificationToDelete(null);
            fetchNotifications();
        } catch (error) {
            toast.error("Delete failed");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">User Notifications</h2>
                    <p className="text-slate-500 text-sm">Broadcast updates to all users</p>
                </div>
                <button 
                    onClick={() => setIsAdding(true)}
                    className="bg-brand-orange text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2 cursor-pointer"
                >
                    <Plus size={18} />
                    New Notification
                </button>
            </div>

            <Modal 
                isOpen={isAdding} 
                onClose={() => setIsAdding(false)} 
                title="Create Notification"
                maxWidth="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                        <input 
                            type="text" 
                            className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-orange focus:outline-none"
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                        <textarea 
                            className="w-full border border-slate-300 rounded-lg p-2 h-32 focus:ring-2 focus:ring-brand-orange focus:outline-none"
                            value={formData.message}
                            onChange={e => setFormData({...formData, message: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                        <select 
                            className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-orange focus:outline-none"
                            value={formData.type}
                            onChange={e => setFormData({...formData, type: e.target.value as any})}
                        >
                            <option value="info">Information</option>
                            <option value="offer">Special Offer</option>
                            <option value="alert">Alert/Warning</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button 
                            type="button"
                            onClick={() => setIsAdding(false)}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={isSaving}
                            className="bg-brand-blue-dark text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 cursor-pointer flex items-center gap-2"
                        >
                            {isSaving && <Loader2 size={16} className="animate-spin" />}
                            Send Now
                        </button>
                    </div>
                </form>
            </Modal>

            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 text-sm font-semibold text-slate-600">Type</th>
                            <th className="px-6 py-3 text-sm font-semibold text-slate-600">Notification</th>
                            <th className="px-6 py-3 text-sm font-semibold text-slate-600">Sent</th>
                            <th className="px-6 py-3 text-sm font-semibold text-slate-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
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
                                        <button 
                                            onClick={() => setNotificationToDelete(notif.id)}
                                            className="text-red-500 hover:bg-red-50 p-1 rounded cursor-pointer transition-colors"
                                        >
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
