"use client";

import React, { useState, useMemo } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import toast from "react-hot-toast";
import { useFirestoreCollection } from "./useFirestore";
import { Product, ProductFormData } from "@/types/product.types";

export const useProductLogic = (initialCategory?: string) => {
    const { data: products, loading, refresh: fetchProducts } = useFirestoreCollection<Product>({
        collectionName: "products",
        orderByField: "createdAt",
        orderDirection: "desc"
    });

    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const [formData, setFormData] = useState<ProductFormData>({
        name: "",
        description: "",
        price: "",
        category: initialCategory || "All Products",
        subCategory: "",
        imageUrl: "",
        images: [],
        specifications: [],
        stock: "",
        status: "active",
        offerPrice: ""
    });

    const resetForm = () => {
        setFormData({ 
            name: "", 
            description: "", 
            price: "", 
            category: initialCategory || "All Products", 
            subCategory: "", 
            imageUrl: "", 
            images: [], 
            specifications: [],
            stock: "", 
            status: "active",
            offerPrice: ""
        });
        setEditingId(null);
        setIsAdding(false);
    };

    const handleEdit = (product: Product) => {
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            subCategory: product.subCategory || "",
            imageUrl: product.imageUrl,
            images: product.images || [],
            specifications: product.specifications || [],
            stock: product.stock,
            status: product.status,
            offerPrice: product.offerPrice || ""
        });
        setEditingId(product.id);
        setIsAdding(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name || !formData.price || !formData.imageUrl) {
            toast.error("Please fill in required fields (Name, Price, Image URL)");
            return;
        }

        setIsSaving(true);
        const loadingToast = toast.loading(editingId ? "Updating product..." : "Creating product...");
        
        try {
            const parsedPrice = Number(formData.price);
            const parsedOfferPrice = formData.offerPrice ? Number(formData.offerPrice) : undefined;
            
            let offerPercentage: number | undefined = undefined;
            if (parsedOfferPrice !== undefined && parsedOfferPrice < parsedPrice) {
                offerPercentage = Math.round(((parsedPrice - parsedOfferPrice) / parsedPrice) * 100);
            }

            const productData = {
                ...formData,
                images: formData.images ? formData.images.filter(img => img && img.trim() !== '') : [],
                specifications: formData.specifications ? formData.specifications.filter(s => s.label.trim() !== '' && s.value.trim() !== '') : [],
                price: parsedPrice,
                offerPrice: parsedOfferPrice,
                offerPercentage: offerPercentage,
                stock: Number(formData.stock),
                updatedAt: Date.now()
            };

            if (editingId) {
                await updateDoc(doc(db, "products", editingId), productData);
                toast.success("Product updated successfully", { id: loadingToast });
            } else {
                await addDoc(collection(db, "products"), {
                    ...productData,
                    createdAt: Date.now()
                });
                toast.success("Product created successfully", { id: loadingToast });
            }
            resetForm();
            fetchProducts();
        } catch (error: unknown) {
            console.error("Error saving product:", error);
            const err = error as { message?: string };
            toast.error(err.message || "Failed to save product", { id: loadingToast });
        } finally {
            setIsSaving(false);
        }
    };

    const confirmDelete = async () => {
        if (!productToDelete) return;
        
        setIsDeleting(true);
        const loadingToast = toast.loading("Deleting product...");
        try {
            await deleteDoc(doc(db, "products", productToDelete));
            toast.success("Product deleted successfully", { id: loadingToast });
            setProductToDelete(null);
            fetchProducts();
        } catch (error: unknown) {
            console.error("Error deleting product:", error);
            const err = error as { message?: string };
            toast.error(err.message || "Failed to delete product", { id: loadingToast });
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredProducts = useMemo(() => {
        let list = products;
        if (initialCategory) {
            list = list.filter(p => p.category === initialCategory);
        }
        return list.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.subCategory && p.subCategory.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [products, searchTerm, initialCategory]);

    const stats = useMemo(() => ({
        total: products.length,
        active: products.filter(p => p.status === 'active').length,
        lowStock: products.filter(p => p.stock <= 5).length
    }), [products]);

    return {
        products: filteredProducts,
        loading,
        isAdding,
        setIsAdding,
        editingId,
        isSaving,
        isDeleting,
        productToDelete,
        setProductToDelete,
        formData,
        setFormData,
        handleEdit,
        handleSubmit,
        confirmDelete,
        resetForm,
        searchTerm,
        setSearchTerm,
        stats
    };
};
