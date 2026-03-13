"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { 
    collection, 
    addDoc, 
    getDocs, 
    updateDoc, 
    deleteDoc, 
    doc, 
    query, 
    orderBy 
} from "firebase/firestore";
import { Plus, Trash2, Edit2, Save, X, Image as ImageIcon, ExternalLink } from "lucide-react";

interface Banner {
    id: string;
    title: string;
    imageUrl: string;
    link: string;
    status: "active" | "inactive";
    createdAt: number;
}

export default function BannerManager() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form states
    const [formData, setFormData] = useState({
        title: "",
        imageUrl: "",
        link: "",
        status: "active" as "active" | "inactive"
    });

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "banners"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const bannerData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Banner));
            setBanners(bannerData);
        } catch (error) {
            console.error("Error fetching banners:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateDoc(doc(db, "banners", editingId), {
                    ...formData,
                    updatedAt: Date.now()
                });
            } else {
                await addDoc(collection(db, "banners"), {
                    ...formData,
                    createdAt: Date.now()
                });
            }
            setIsAdding(false);
            setEditingId(null);
            setFormData({ title: "", imageUrl: "", link: "", status: "active" });
            fetchBanners();
        } catch (error) {
            console.error("Error saving banner:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this banner?")) return;
        try {
            await deleteDoc(doc(db, "banners", id));
            fetchBanners();
        } catch (error) {
            console.error("Error deleting banner:", error);
        }
    };

    const handleEdit = (banner: Banner) => {
        setFormData({
            title: banner.title,
            imageUrl: banner.imageUrl,
            link: banner.link,
            status: banner.status
        });
        setEditingId(banner.id);
        setIsAdding(true);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Banner Management</h2>
                    <p className="text-slate-500">Manage promotional banners for the home page</p>
                </div>
                <button 
                    onClick={() => {
                        setIsAdding(!isAdding);
                        setEditingId(null);
                        setFormData({ title: "", imageUrl: "", link: "", status: "active" });
                    }}
                    className="flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white px-4 py-2 rounded-xl transition-all font-bold shadow-lg shadow-brand-orange/20 cursor-pointer"
                >
                    {isAdding ? <X size={18} /> : <Plus size={18} />}
                    {isAdding ? "Cancel" : "Add Banner"}
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Banner Title</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Summer Sale 2024"
                                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-brand-orange"
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Image URL</label>
                                <input 
                                    type="text" 
                                    placeholder="https://example.com/banner.jpg"
                                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-brand-orange"
                                    value={formData.imageUrl}
                                    onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Action link (Optional)</label>
                                <input 
                                    type="text" 
                                    placeholder="/products/new-arrivals"
                                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-brand-orange"
                                    value={formData.link}
                                    onChange={e => setFormData({...formData, link: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Status</label>
                                <select 
                                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-brand-orange"
                                    value={formData.status}
                                    onChange={e => setFormData({...formData, status: e.target.value as "active" | "inactive"})}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end cursor-pointer">
                        <button 
                            type="submit"
                            className="flex items-center gap-2 bg-brand-blue-dark text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-900 transition-all shadow-lg cursor-pointer"
                        >
                            <Save size={18} />
                            {editingId ? "Update Banner" : "Save Banner"}
                        </button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="bg-slate-100 animate-pulse h-64 rounded-2xl"></div>
                    ))
                ) : banners.length > 0 ? (
                    banners.map(banner => (
                        <div key={banner.id} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300">
                            <div className="relative h-48 overflow-hidden bg-slate-50">
                                {banner.imageUrl ? (
                                    <img 
                                        src={banner.imageUrl} 
                                        alt={banner.title} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Invalid+Image+URL';
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <ImageIcon size={48} />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 flex gap-2 cursor-pointer">
                                    <button 
                                        onClick={() => handleEdit(banner)}
                                        className="p-2 bg-white/90 backdrop-blur shadow-sm rounded-lg text-slate-600 hover:text-brand-blue transition-colors cursor-pointer"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(banner.id)}
                                        className="p-2 bg-white/90 backdrop-blur shadow-sm rounded-lg text-slate-600 hover:text-red-500 transition-colors cursor-pointer"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className={`absolute bottom-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                    banner.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'
                                }`}>
                                    {banner.status}
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-slate-900 mb-1 truncate">{banner.title}</h3>
                                {banner.link && (
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <ExternalLink size={12} />
                                        <span className="truncate">{banner.link}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                        <ImageIcon size={48} className="text-slate-300 mb-4" />
                        <h3 className="text-lg font-bold text-slate-900">No Banners Found</h3>
                        <p className="text-slate-500 max-w-xs">Start adding banners to display promotions on your home page.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

