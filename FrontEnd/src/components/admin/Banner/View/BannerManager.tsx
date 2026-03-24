"use client";

import React from "react";
import { Plus, Trash2, Edit2, Save, X, Image as ImageIcon, ExternalLink, LayoutPanelLeft, Play, Film, Monitor } from "lucide-react";
import Modal from "@/components/ui/Modal";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import AdminHeader from "@/components/ui/AdminHeader";
import StatsCard from "@/components/ui/StatsCard";
import TableSkeleton from "@/components/ui/TableSkeleton";
import Button from "@/components/ui/button";
import { useBannerManager } from "../Controller/useBanner";

export default function BannerManager() {
    const {banners,loading,isAdding,setIsAdding,editingId,isSaving,isDeleting,bannerToDelete,setBannerToDelete,formData,setFormData,handleEdit,handleSubmit,confirmDelete,resetForm} = useBannerManager();

    return (
        <div className="p-4 md:p-8 space-y-10">
            <AdminHeader 
                title="Banner Management"
                description={`You have ${banners.length} banners currently in rotation`}
                actionButton={
                    <Button 
                        onClick={() => {if (isAdding) resetForm(); else setIsAdding(true);}}
                        variant="orange"
                        icon={isAdding ? <X size={18} /> : <Plus size={18} />}>
                        {isAdding ? "Cancel" : "Create New Banner"}
                    </Button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <StatsCard label="Total Banners" value={banners.length} icon={<LayoutPanelLeft size={20} />} />
                <StatsCard label="Active" value={banners.filter(b => b.status === 'active').length} className="border-emerald-100" />
                <StatsCard label="Inactive" value={banners.filter(b => b.status === 'inactive').length} />
            </div>

            <Modal isOpen={isAdding} onClose={resetForm} title={editingId ? "Edit Banner" : "Create New Banner"} maxWidth="2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Banner Title (Optional)</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Summer Sale 2026"
                                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/5 transition-all"
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Banner Type</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        type="button"
                                        onClick={() => setFormData({...formData, type: 'image'})}
                                        className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 ${
                                            formData.type === 'image' 
                                            ? 'border-brand-orange bg-brand-orange/5 text-brand-orange shadow-lg shadow-brand-orange/10' 
                                            : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                                        }`}>
                                        <ImageIcon size={20} />
                                        <span className="font-bold text-sm">Image</span>
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setFormData({...formData, type: 'video'})}
                                        className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 ${
                                            formData.type === 'video' 
                                            ? 'border-brand-orange bg-brand-orange/5 text-brand-orange shadow-lg shadow-brand-orange/10' 
                                            : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                                        }`}>
                                        <Film size={20} />
                                        <span className="font-bold text-sm">Video</span>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                                    {formData.type === 'video' ? 'Image URL (Optional Thumbnail)' : 'Image URL'}
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="https://example.com/banner.jpg"
                                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/5 transition-all text-sm"
                                    value={formData.imageUrl}
                                    onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                                    required={formData.type === 'image'}
                                />
                                {formData.type === 'video' ? (
                                    <p className="mt-1.5 text-[10px] text-slate-400 font-medium italic">An optional image that displays while the video loads.</p>
                                ) : (
                                    <p className="mt-1.5 text-[10px] text-slate-400 font-medium italic">High resolution wide format (21:9 or 16:9) recommended.</p>
                                )}
                            </div>
                            {formData.type === 'video' && (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2">
                                        <Play size={14} className="text-brand-orange" />
                                        Video Link (Direct URL)
                                    </label>
                                    <input 
                                        type="text" 
                                        placeholder="https://example.com/banner.mp4"
                                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/5 transition-all text-sm"
                                        value={formData.videoUrl}
                                        onChange={e => setFormData({...formData, videoUrl: e.target.value})}
                                        required={formData.type === 'video'}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Action Link (Optional)</label>
                                <input 
                                    type="text" 
                                    placeholder="/products/new-arrivals"
                                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/5 transition-all"
                                    value={formData.link}
                                    onChange={e => setFormData({...formData, link: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Status</label>
                                <select 
                                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/5 transition-all appearance-none"
                                    value={formData.status}
                                    onChange={e => setFormData({...formData, status: e.target.value as "active" | "inactive"})}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={resetForm}>
                            Cancel
                        </Button>
                        <Button type="submit" loading={isSaving} icon={<Save size={18} />}>
                            {editingId ? "Update Banner" : "Save Banner"}
                        </Button>
                    </div>
                </form>
            </Modal>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="bg-slate-100 animate-pulse h-64 rounded-2xl"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {banners.length > 0 ? (banners.map(banner => (
                        <div key={banner.id} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300">
                            <div className="relative aspect-[21/9] sm:aspect-video overflow-hidden bg-slate-900">
                                {banner.type === 'video' && banner.videoUrl ? (
                                    <div className="relative w-full h-full">
                                        <video 
                                            src={banner.videoUrl} 
                                            className="w-full h-full object-cover opacity-60" 
                                            muted 
                                            playsInline 
                                            onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                                            onMouseOut={(e) => (e.target as HTMLVideoElement).pause()}
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="p-4 bg-white/20 backdrop-blur-md rounded-full text-white">
                                                <Play size={32} fill="currentColor" />
                                            </div>
                                        </div>
                                    </div>
                                ) : banner.imageUrl ? (
                                    <img 
                                        src={banner.imageUrl} 
                                        alt={banner.title} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        onError={(e) => {(e.target as HTMLImageElement).src = 'https://placehold.co/1200x400?text=Invalid+Image+URL';}}/>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <ImageIcon size={48} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute top-4 right-4 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                    <button 
                                        onClick={() => handleEdit(banner)}
                                        className="p-2.5 bg-white/95 backdrop-blur shadow-xl rounded-xl text-slate-700 hover:text-brand-orange transition-colors cursor-pointer"
                                        title="Edit Banner">
                                        <Edit2 size={16} strokeWidth={2.5} />
                                    </button>
                                    <button 
                                        onClick={() => setBannerToDelete(banner.id)}
                                        className="p-2.5 bg-white/95 backdrop-blur shadow-xl rounded-xl text-slate-700 hover:text-red-500 transition-colors cursor-pointer"
                                        title="Delete Banner">
                                        <Trash2 size={16} strokeWidth={2.5} />
                                    </button>
                                </div>

                                <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
                                    <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm ${
                                        banner.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'
                                    }`}>
                                        {banner.status}
                                    </div>
                                    {banner.type === 'video' && (
                                        <div className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm bg-brand-orange text-white flex items-center gap-1.5">
                                            <Film size={10} strokeWidth={3} />
                                            Video
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="font-bold text-slate-900 mb-1.5 truncate text-lg">{banner.title || "Untitled Banner"}</h3>
                                {banner.link && (
                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                                        <ExternalLink size={12} className="text-brand-orange" />
                                        <span className="truncate">{banner.link}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))) : (
                        <div className="col-span-full py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                            <ImageIcon size={48} className="text-slate-300 mb-4" />
                            <h3 className="text-lg font-bold text-slate-900">No Banners Found</h3>
                            <p className="text-slate-500 max-w-xs">Start adding banners to display promotions on your home page.</p>
                        </div>
                    )}
                </div>
            )}
            <ConfirmationModal 
                isOpen={!!bannerToDelete}
                onClose={() => setBannerToDelete(null)}
                onConfirm={confirmDelete}
                title="Delete Banner"
                message="Are you sure you want to delete this banner? This action cannot be undone and it will be removed from the home page rotation."
                confirmText="Yes, Delete it"
                type="danger"
                isLoading={isDeleting}/>
        </div>
    );
}
