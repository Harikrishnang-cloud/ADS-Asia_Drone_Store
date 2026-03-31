"use client";

import React from "react";
import { Plus, Trash2, Edit2, Save, X, Package, AlertTriangle, CheckCircle2, Archive, Sparkles, Loader2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import AdminHeader from "@/components/ui/AdminHeader";
import StatsCard from "@/components/ui/StatsCard";
import TableSkeleton from "@/components/ui/TableSkeleton";
import Button from "@/components/ui/button";
import { useProductManager } from "../Controller/useProductManager";
import toast from "react-hot-toast";

export default function ProductManager({ category }: { category?: string }) {
    const {products,loading,isAdding,setIsAdding,editingId,isSaving,isDeleting,productToDelete,setProductToDelete,formData,setFormData,handleEdit,
        handleSubmit,confirmDelete,resetForm,searchTerm,setSearchTerm,stats
    } = useProductManager(category);

    const [isGeneratingDescription, setIsGeneratingDescription] = React.useState(false);

    const handleGenerateDescription = async () => {
        if (!formData.name) {
            toast.error("Please enter a Product Name first!");
            return;
        }

        setIsGeneratingDescription(true);
        const loadToast = toast.loading("AI is crafting the perfect description...");

        try {
            const res = await fetch("/api/generate-description", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    category: formData.category,
                    price: formData.price,
                    specifications: formData.specifications
                })
            });

            const data = await res.json();
            
            if (res.ok && data.description) {
                setFormData({...formData, description: data.description});
                toast.success("Description optimized!", { id: loadToast });
            } else {
                toast.error(data.error || "Generation failed", { id: loadToast });
            }
        } catch (error) {
            console.error(error);
            toast.error("Connection error to AI service.", { id: loadToast });
        } finally {
            setIsGeneratingDescription(false);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-20">
            <AdminHeader
                title="Product Catalog" 
                description={`Currently managing ${products.length} products`}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Search products..."
                actionButton={
                    <Button 
                        onClick={() => {if (isAdding) resetForm(); else setIsAdding(true);}}
                        variant="orange" 
                        icon={isAdding ? <X size={18} /> : <Plus size={18} />}>
                        {isAdding ? "Cancel" : "Add Product"}
                    </Button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard label="Total Products" value={stats.total} icon={<Package size={20} />} />
                <StatsCard label="Active Items" value={stats.active} icon={<CheckCircle2 size={20} />} className="border-emerald-100" />
                <StatsCard label="Low Stock" value={stats.lowStock} icon={<AlertTriangle size={20} />} className={stats.lowStock > 0 ? "border-amber-200 bg-amber-50" : ""} />
            </div>

            <Modal isOpen={isAdding} onClose={resetForm} title={editingId ? "Edit Product" : "Add New Product"} maxWidth="3xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Product Name</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter Product Name"
                                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/5 transition-all text-sm font-semibold"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Price (INR)</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            placeholder="0.00"
                                            className="w-full bg-slate-50 border border-slate-200 pl-3 pr-3 py-3 rounded-xl focus:outline-none focus:border-brand-orange transition-all text-sm font-semibold"
                                            value={formData.price}
                                            onChange={e => setFormData({...formData, price: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Offer Price</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            placeholder="0.00"
                                            className="w-full bg-slate-50 border border-slate-200 pl-3 pr-3 py-3 rounded-xl focus:outline-none focus:border-brand-orange transition-all text-sm font-semibold"
                                            value={formData.offerPrice || ''}
                                            onChange={e => setFormData({...formData, offerPrice: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Category</label>
                                <select 
                                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-brand-orange transition-all text-sm font-semibold appearance-none"
                                    value={formData.category}
                                    onChange={e => setFormData({...formData, category: e.target.value})}
                                >
                                    <option value="All Products">Products</option>
                                    <option value="Spare Parts">Spare Parts</option>
                                    <option value="Accessories">Accessories</option>
                                    {/* <option value="Drones">Drones</option>
                                    <option value="FPV Gear">FPV Gear</option> */}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Sub-Category (Optional)</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Battery, Controller, Motor"
                                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-brand-orange transition-all text-sm font-semibold"
                                    value={formData.subCategory}
                                    onChange={e => setFormData({...formData, subCategory: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Stock Inventory</label>
                                <input 
                                    type="number" 
                                    placeholder="Quantity in hand"
                                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-brand-orange transition-all text-sm font-semibold"
                                    value={formData.stock}
                                    onChange={e => setFormData({...formData, stock: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Main Image URL</label>
                                <input 
                                    type="text" 
                                    placeholder="https://..."
                                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-brand-orange transition-all text-sm font-semibold"
                                    value={formData.imageUrl}
                                    onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Availability Status</label>
                                <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
                                    <button 
                                        type="button" 
                                        onClick={() => setFormData({...formData, status: 'active'})}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-black uppercase transition-all rounded-lg ${formData.status === 'active' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                                        <CheckCircle2 size={14} /> Active
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setFormData({...formData, status: 'inactive'})}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-black uppercase transition-all rounded-lg ${formData.status === 'inactive' ? 'bg-white text-slate-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                                        <Archive size={14} /> Draft
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Related Images (Up to 4)</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[0, 1, 2].map((index) => (
                                <input 
                                    key={index}
                                    type="text" 
                                    placeholder={`Additional Image URL ${index + 1}`}
                                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-brand-orange transition-all text-sm font-semibold"
                                    value={formData.images?.[index] || ''}
                                    onChange={e => {
                                        const newImages = [...(formData.images || [])];
                                        newImages[index] = e.target.value;
                                        setFormData({...formData, images: newImages});
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-black uppercase tracking-wider text-slate-500">Description</label>
                            <button
                                type="button"
                                onClick={handleGenerateDescription}
                                disabled={isGeneratingDescription}
                                className="text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                            >
                                {isGeneratingDescription ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                AI Generate
                            </button>
                        </div>
                        <textarea 
                            rows={3}
                            placeholder="Detailed product features and specifications..."
                            className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-brand-orange transition-all text-sm font-semibold"
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}/>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-black uppercase tracking-wider text-slate-500">Product Specifications</label>
                            <button
                                type="button"
                                onClick={() => setFormData({...formData, specifications: [...(formData.specifications || []), {label: '', value: ''}]})}
                                className="text-xs font-bold text-brand-orange hover:text-brand-orange-dark cursor-pointer flex items-center gap-1"
                            >
                                <Plus size={14} /> Add Spec Row
                            </button>
                        </div>
                        <div className="space-y-3">
                            {formData.specifications?.map((spec, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <input
                                        type="text"
                                        placeholder="Label (e.g. Package Contains)"
                                        className="w-1/3 bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-brand-orange transition-all text-sm font-semibold"
                                        value={spec.label}
                                        onChange={e => {
                                            const newSpecs = [...(formData.specifications || [])];
                                            newSpecs[idx].label = e.target.value;
                                            setFormData({...formData, specifications: newSpecs});
                                        }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Value (e.g. 1 Drone, 1 Battery)"
                                        className="flex-1 bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-brand-orange transition-all text-sm font-semibold"
                                        value={spec.value}
                                        onChange={e => {
                                            const newSpecs = [...(formData.specifications || [])];
                                            newSpecs[idx].value = e.target.value;
                                            setFormData({...formData, specifications: newSpecs});
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                                        title="Remove row"
                                        onClick={() => {
                                            const newSpecs = formData.specifications?.filter((_, i) => i !== idx);
                                            setFormData({...formData, specifications: newSpecs});
                                        }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                            {(!formData.specifications || formData.specifications.length === 0) && (
                                <div className="text-center p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                                    <p className="text-sm text-slate-400 font-semibold mb-3">No detail rows added yet</p>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({...formData, specifications: [{label: '', value: ''}]})}
                                        className="text-xs font-bold text-brand-orange bg-brand-orange/10 px-4 py-2 rounded-lg hover:bg-brand-orange hover:text-white transition-all cursor-pointer"
                                    >
                                        Add Custom Specification
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                        <Button type="button" variant="ghost" onClick={resetForm}>
                            Cancel
                        </Button>
                        <Button type="submit" loading={isSaving} icon={<Save size={18} />}>
                            {editingId ? "Update Product" : "Save Product"}
                        </Button>
                    </div>
                </form>
            </Modal>

            {loading ? (
                <TableSkeleton rows={5} cols={5} />
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-500">Product Particulars</th>
                                    <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-500 text-center">Category</th>
                                    <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-500 text-center">Price</th>
                                    <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-500 text-center">In Stock</th>
                                    <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-500 text-center">Status</th>
                                    <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {products.length > 0 ? (
                                    products.map(product => (
                                        <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 flex-shrink-0">
                                                        {product.imageUrl ? (
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Package size={24} className="text-slate-300" />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-black text-slate-900 truncate group-hover:text-brand-orange transition-colors">{product.name}</p>
                                                        <p className="text-xs text-slate-400 font-bold tracking-tight truncate">{product.subCategory || "No Sub-Category"}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className="text-xs font-black uppercase tracking-widest bg-slate-100 text-slate-500 px-3 py-1 rounded-lg border border-slate-200">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-center font-black text-slate-700">
                                                {product.offerPrice ? (
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-brand-orange">₹ {Number(product.offerPrice).toLocaleString('en-IN')}</span>
                                                        <div className="flex items-center gap-1.5 mt-0.5">
                                                            <span className="text-[10px] text-slate-400 line-through">₹ {Number(product.price).toLocaleString('en-IN')}</span>
                                                            {product.offerPercentage && (
                                                                <span className="text-[9px] font-black bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-md">
                                                                    -{product.offerPercentage}%
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span>₹ {Number(product.price).toLocaleString('en-IN')}</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className={`text-sm font-black ${product.stock <= 5 ? "text-red-500" : "text-slate-900"}`}>{product.stock} Units</span>
                                                    {product.stock <= 5 && <span className="text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded-md">Low Stock</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm border ${
                                                    product.status === 'active' 
                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                                    : 'bg-slate-50 text-slate-500 border-slate-200'
                                                }`}>
                                                    {product.status === 'active' ? <CheckCircle2 size={12} /> : <Archive size={12} />}
                                                    {product.status}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all transform lg:translate-x-2 group-hover:translate-x-0">
                                                    <button 
                                                        onClick={() => handleEdit(product)}
                                                        className="p-2.5 bg-brand-orange/10 text-brand-orange rounded-xl hover:bg-brand-orange hover:text-white transition-all shadow-md"
                                                        title="Edit Product">
                                                        <Edit2 size={16} strokeWidth={2.5} />
                                                    </button>
                                                    <button 
                                                        onClick={() => setProductToDelete(product.id)}
                                                        className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-md"
                                                        title="Delete Product">
                                                        <Trash2 size={16} strokeWidth={2.5} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border-2 border-dashed border-slate-200">
                                                    <Archive size={40} className="text-slate-200" />
                                                </div>
                                                <h3 className="text-xl font-bold text-slate-900">No Products Catalogued</h3>
                                                <p className="text-slate-500 max-w-xs mt-1 text-sm">We couldn&apos;t find any products in your inventory. Add your first product to get started.</p>
                                                <button onClick={() => setIsAdding(true)} className="mt-6 text-brand-orange font-black uppercase text-xs tracking-widest hover:underline">+ New Entry</button>
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
                isOpen={!!productToDelete}
                onClose={() => setProductToDelete(null)}
                onConfirm={confirmDelete}
                title="Delete this Product"
                message="Are you sure you want to remove this product from your catalogue? This action is permanent and will remove the item from the customer facing store."
                confirmText="Yes, Delete"
                type="danger"
                isLoading={isDeleting}
            />
        </div>
    );
}
