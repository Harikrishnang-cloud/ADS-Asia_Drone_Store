"use client";

import { useState, useEffect, useRef } from "react";
import api from "@/lib/axios";
import { db, storage } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import Script from "next/script";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { User, Mail, Phone, MapPin, Camera, Save, Trash2, Loader2, Edit3, ChevronLeft, Lock, RefreshCcw, Wallet, CreditCard, Plus, Check, Home, Briefcase, MapPinned } from "lucide-react";
import { UserAddress, UserProfile as UserProfileType } from "@/store/authStore";
import Image from "next/image";
import { PasswordInput } from "@/components/PasswordInput";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/auth.service";

interface UserProfileProps {
    isEdit?: boolean;
}

export default function UserProfile({ isEdit = false }: UserProfileProps) {
    const { user: authUser, setAuth } = useAuthStore();
    const [user, setUser] = useState<UserProfileType | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const [formData, setFormData] = useState({
        profileImage: "",
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pin: "",
        addresses: [] as UserAddress[]
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const [addMoneyAmount, setAddMoneyAmount] = useState("");
    const [isAddingMoney, setIsAddingMoney] = useState(false);

    // Reset Password States
    const [resetData, setResetData] = useState({
        newPassword: "",
        confirmPassword: ""
    });
    const [resetErrors, setResetErrors] = useState<Record<string, string>>({});
    const [isResetting, setIsResetting] = useState(false);

    const { isInitialized } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            const userId = authUser?.id;

            if (!userId) {
                const storedUserStr = localStorage.getItem("userData");
                if (storedUserStr) {
                    const storedUser = JSON.parse(storedUserStr);
                    if (!(storedUser.id || storedUser.uid)) {
                        router.push("/auth/login");
                        return;
                    }
                } else {
                    router.push("/auth/login");
                    return;
                }
            }

            if (!userId) {
                setLoading(false);
                return;
            }

            try {
                const docSnap = await getDoc(doc(db, "users", userId as string));
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setUser({ ...data, id: docSnap.id });
                    setFormData({
                        profileImage: data.profileImage || "",
                        name: data.name || "",
                        phone: data.phone || "",
                        address: data.address || "",
                        city: data.city || "",
                        state: data.state || "",
                        pin: data.pin || "",
                        addresses: data.addresses || []
                    });
                }
            } catch (err: unknown) {
                console.error("Failed to load profile:", err);
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        if (isInitialized) {
            fetchData();
        }
    }, [router, authUser?.id, setAuth, isInitialized]);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim() || formData.name.trim().length < 3) {
            newErrors.name = "Name must be at least 3 characters long";

        }
        if (formData.phone) {
            // Remove any non-numeric characters for length check if needed, 
            // but react-phone-input-2 usually returns digits.
            // For India (+91), total length is 12. 
            // We want at least 10 digits for the main number plus country code.
            if (formData.phone.length < 10) {
                newErrors.phone = "Please enter a valid phone number";
            }
        }
        // Removed Top-Level PIN validation here because it's replaced by the address list below

        // Validate individual addresses in the list
        formData.addresses.forEach((addr) => {
            if (!addr.address || addr.address.trim().length < 5) {
                newErrors[`address_${addr.id}`] = "Address is too short (min 5 chars)";
            }
            if (!addr.city || !addr.city.trim()) {
                newErrors[`city_${addr.id}`] = "City is required";
            }
            if (!addr.pin || !/^\d{6}$/.test(addr.pin.toString())) {
                newErrors[`pin_${addr.id}`] = "6-digit PIN code required";
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddAddress = () => {
        const newAddr: UserAddress = {
            id: Date.now().toString(),
            type: "Home",
            address: "",
            city: "",
            state: "",
            pin: "",
            isPrimary: formData.addresses.length === 0
        };
        setFormData({ ...formData, addresses: [...formData.addresses, newAddr] });
        toast.success("New address form added!");
    };

    const handleAddressChange = (id: string, field: keyof UserAddress, value: string | boolean | number) => {
        let finalValue = value;
        // If it's the PIN field, try to store it as a number if the user has changed the type
        if (field === 'pin' && typeof value === 'string') {
            const parsed = parseInt(value);
            if (!isNaN(parsed)) finalValue = parsed;
        }

        const updated = formData.addresses.map((addr: UserAddress) => {
            if (addr.id === id) {
                return { ...addr, [field]: finalValue };
            }
            return addr;
        });
        setFormData({ ...formData, addresses: updated });
    };

    const handleRemoveAddress = (id: string) => {
        const updated = formData.addresses.filter((addr: UserAddress) => addr.id !== id);
        // If we removed the primary, make the first one primary
        if (updated.length > 0 && !updated.find((a: UserAddress) => a.isPrimary)) {
            updated[0].isPrimary = true;
        }
        setFormData({ ...formData, addresses: updated });
        toast.success("Address removed!");
    };

    const handleSetPrimary = (id: string) => {
        const updated = formData.addresses.map((addr: UserAddress) => ({
            ...addr,
            isPrimary: addr.id === id
        }));
        setFormData({ ...formData, addresses: updated });
        toast.success("Primary address updated!");
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            toast.error("Please fix the errors before saving");
            return;
        }

        // Before saving, ensure the primary address is synced to the top-level fields
        const primary = formData.addresses.find(a => a.isPrimary) || formData.addresses[0];
        const finalData = {
            ...formData,
            address: primary?.address || "",
            city: primary?.city || "",
            state: primary?.state || "",
            pin: primary?.pin || ""
        };

        setIsSaving(true);
        try {
            if (!user?.id) throw new Error("User ID missing");
            await updateDoc(doc(db, "users", user.id), finalData);
            const updatedUser = { ...user, ...finalData };
            localStorage.setItem("userData", JSON.stringify(updatedUser));
            setAuth(updatedUser);
            toast.success("Profile updated!");
            router.push("/user/profile");
        } catch (err: unknown) {
            console.error("Update failed:", err);
            toast.error("Update failed");
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        // Simple file type check
        if (!file.type.startsWith('image/')) {
            toast.error("Please upload an image file");
            return;
        }

        setIsUploading(true);
        const storageRef = ref(storage, `profiles/${user.id}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', null,
            () => {
                toast.error("Upload failed");
                setIsUploading(false);
            },
            async () => {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                if (!user?.id) throw new Error("User ID missing");
                await updateDoc(doc(db, "users", user.id!), { profileImage: url });
                const updatedUser = { ...user, profileImage: url };
                setUser(updatedUser);
                localStorage.setItem("userData", JSON.stringify(updatedUser));
                setAuth(updatedUser);
                toast.success("Image updated!");
                setIsUploading(false);
            }
        );
    };

    const handleDelete = () => {
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        setIsDeleting(true);
        try {
            if (!user?.id) throw new Error("User ID missing");
            await deleteDoc(doc(db, "users", user.id!));
            localStorage.clear();
            window.dispatchEvent(new Event('storage'));
            router.push("/");
            toast.success("Account deleted");
        } catch (err: unknown) {
            console.error("Delete failed:", err);
            toast.error("Delete failed");
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.email) return;

        const newResetErrors: Record<string, string> = {};
        if (!resetData.newPassword) {
            newResetErrors.newPassword = "New password is required";
        } else if (resetData.newPassword.length < 6) {
            newResetErrors.newPassword = "Password must be at least 6 characters";
        }

        if (resetData.newPassword !== resetData.confirmPassword) {
            newResetErrors.confirmPassword = "Passwords do not match";
        }

        setResetErrors(newResetErrors);

        if (Object.keys(newResetErrors).length > 0) return;

        setIsResetting(true);
        try {
            const data = await authService.resetPassword({
                email: user.email,
                password: resetData.newPassword
            });

            if (data.success) {
                toast.success("Password reset successfully!");
                setResetData({ newPassword: "", confirmPassword: "" });
            } else {
                toast.error(data.message || "Reset failed");
            }
        } catch (err: unknown) {
            const errorObj = err as { response?: { data?: { message?: string } }, message?: string };
            const errorMsg = errorObj.response?.data?.message || errorObj.message || "An error occurred during password reset";
            toast.error(errorMsg);
        } finally {
            setIsResetting(false);
        }
    };

    const handleAddMoney = async (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseInt(addMoneyAmount);
        if (isNaN(amount) || amount <= 10) {
            toast.error("Minimum top-up amount is ₹10");
            return;
        }

        setIsAddingMoney(true);
        console.log("Initiating Wallet Top-up for amount:", amount);

        try {
            // 1. Create Razorpay order in Backend
            const orderRes = await api.post("/payment/create-order", { amount });
            const order = orderRes.data.order;

            if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
                throw new Error("Razorpay Key ID missing.");
            }

            // 2. Open Razorpay Modal
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "Asia Drone Store",
                description: "Wallet Top-up",
                order_id: order.id,
                handler: async function (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
                    try {
                        // 3. Verify Payment and update balance on backend
                        const verifyRes = await api.post("/payment/verify-wallet-topup", {
                            order_id: response.razorpay_order_id,
                            payment_id: response.razorpay_payment_id,
                            signature: response.razorpay_signature,
                            amount: amount
                        });

                        if (verifyRes.data.success && user) {
                            // Update local state by re-fetching or updating directly
                            const newBalance = (user.walletBalance || 0) + amount;
                            const updatedUser = { ...user, walletBalance: newBalance };
                            setUser(updatedUser);
                            localStorage.setItem("userData", JSON.stringify(updatedUser));
                            setAuth(updatedUser);
                            
                            toast.success(`₹${amount.toLocaleString('en-IN')} added to wallet!`);
                            setAddMoneyAmount("");
                        } else {
                            toast.error(verifyRes.data.message || "Top-up failed.");
                        }
                    } catch (err) {
                        console.error("Top-up verification failed:", err);
                        toast.error("Transaction verification failed.");
                    } finally {
                        setIsAddingMoney(false);
                    }
                },
                prefill: {
                    name: user?.name || "",
                    email: user?.email || "",
                    contact: user?.phone || ""
                },
                theme: { color: "#0066CC" },
                modal: {
                    ondismiss: function() {
                        setIsAddingMoney(false);
                    }
                }
            };
            if (!user) throw new Error("User not found");

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (typeof (window as any).Razorpay === 'undefined') {
                throw new Error("Razorpay SDK not loaded.");
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function (response: { error: { description: string } }) {
                toast.error("Payment failed. " + response.error.description);
                setIsAddingMoney(false);
            });
            rzp.open();

        } catch (error: unknown) {
            console.error("Wallet Top-up failed:", error);
            const err = error as { message?: string };
            toast.error(err.message || "Failed to initiate payment.");
            setIsAddingMoney(false);
        }
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-brand-blue" size={40} /></div>;
    if (!user) return null;

    return (
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
            
            {/* Main Profile Info Card */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 h-full">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">{isEdit ? "Edit Profile" : "My Profile"}</h1>
                    {!isEdit && (
                        <Link
                            href="/user/profile/edit"
                            className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg text-sm font-bold hover:bg-brand-blue-dark transition-all cursor-pointer"
                        >
                            <Edit3 size={16} /> Edit
                        </Link>
                    )}
                    {isEdit && (
                        <Link
                            href="/user/profile"
                            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-all font-medium text-sm"
                        >
                            <ChevronLeft size={16} /> Back
                        </Link>
                    )}
                </div>

                <div className="flex flex-col items-center mb-10">
                    <div className="relative w-36 h-36 rounded-full bg-slate-100 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center group">
                        {user.profileImage ? (
                            <Image src={user.profileImage} alt="Profile" className="w-full h-full object-cover" fill />
                        ) : (
                            <User size={80} className="text-slate-300" />
                        )}
                        {isUploading && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <Loader2 className="animate-spin text-white" />
                            </div>
                        )}
                    </div>
                    {isEdit && (
                        <>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="mt-4 text-sm font-medium text-brand-blue flex items-center gap-2 hover:underline cursor-pointer"
                            >
                                <Camera size={16} /> Change Photo
                            </button>
                            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                        </>
                    )}
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide opacity-70">Email Address</label>
                        <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed">
                            <Mail size={18} />
                            <span className="font-medium">{user.email}</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide opacity-70">Full Name</label>
                        {isEdit ? (
                            <div className="space-y-1">
                                <input
                                    type="text"
                                    className={`w-full p-4 border rounded-xl outline-none transition-all ${errors.name ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5'}`}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter your full name"
                                />
                                {errors.name && <p className="text-red-500 text-xs font-medium ml-1">{errors.name}</p>}
                            </div>
                        ) : (
                            <p className="p-4 bg-white border border-slate-100 rounded-xl font-bold text-slate-800">{user.name || "Not set"}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide opacity-70">Phone Number</label>
                        {isEdit ? (
                            <div className="space-y-1 phone-input-container">
                                <PhoneInput
                                    country={'in'}
                                    value={formData.phone}
                                    onChange={(phone) => setFormData({ ...formData, phone })}
                                    inputProps={{
                                        name: 'phone',
                                        required: true,
                                        autoFocus: false
                                    }}
                                    containerClass={errors.phone ? 'error-phone' : ''}
                                />
                                {errors.phone && <p className="text-red-500 text-xs font-medium ml-1">{errors.phone}</p>}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 p-4 bg-white border border-slate-100 rounded-xl font-bold text-slate-800">
                                <Phone size={16} className="text-slate-400" />
                                <span>{formData.phone ? `+${formData.phone}` : "Not set"}</span>
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide opacity-70">Saved Addresses</label>
                            {isEdit && (
                                <button
                                    type="button"
                                    onClick={handleAddAddress}
                                    className="flex items-center gap-2 text-xs font-bold text-brand-blue hover:text-brand-orange transition-all"
                                >
                                    <Plus size={14} /> Add Address
                                </button>
                            )}
                        </div>

                        <div className="space-y-4">
                            {isEdit ? (
                                formData.addresses.length > 0 ? (
                                    formData.addresses.map((addr: UserAddress, idx: number) => (
                                        <div key={addr.id} className="p-5 bg-slate-50 border border-slate-200 rounded relative space-y-4">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-black uppercase text-slate-400">Address {idx + 1}</span>
                                                    {addr.isPrimary && <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Primary</span>}
                                                </div>
                                                <button onClick={() => handleRemoveAddress(addr.id)} className="text-red-400 hover:text-red-500 transition-all p-1">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="col-span-2 space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-500 ml-1 uppercase">Type</label>
                                                    <select
                                                        className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-brand-blue bg-white text-sm"
                                                        value={addr.type}
                                                        onChange={(e) => handleAddressChange(addr.id, "type", e.target.value)}
                                                    >
                                                        <option value="Home">Home</option>
                                                        <option value="Work">Work</option>
                                                        <option value="Office">Office</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </div>
                                                <div className="col-span-2 space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-500 ml-1 uppercase">Full Address</label>
                                                    <textarea
                                                        className={`w-full p-3 border rounded-xl outline-none transition-all text-sm min-h-[80px] ${errors[`address_${addr.id}`] ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-brand-blue bg-white'}`}
                                                        placeholder="Building, street, area..."
                                                        value={addr.address}
                                                        onChange={(e) => handleAddressChange(addr.id, "address", e.target.value)}
                                                    />
                                                    {errors[`address_${addr.id}`] && <p className="text-red-500 text-[9px] font-bold ml-1">{errors[`address_${addr.id}`]}</p>}
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-500 ml-1 uppercase">City</label>
                                                    <input
                                                        className={`w-full p-3 border rounded-xl outline-none transition-all text-sm ${errors[`city_${addr.id}`] ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-brand-blue bg-white'}`}
                                                        placeholder="City"
                                                        value={addr.city}
                                                        onChange={(e) => handleAddressChange(addr.id, "city", e.target.value)}
                                                    />
                                                    {errors[`city_${addr.id}`] && <p className="text-red-500 text-[9px] font-bold ml-1">{errors[`city_${addr.id}`]}</p>}
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-500 ml-1 uppercase">State</label>
                                                    <input
                                                        className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-brand-blue bg-white text-sm"
                                                        placeholder="State"
                                                        value={addr.state}
                                                        onChange={(e) => handleAddressChange(addr.id, "state", e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-500 ml-1 uppercase">PIN Code</label>
                                                    <input
                                                        className={`w-full p-3 border rounded-xl outline-none transition-all text-sm ${errors[`pin_${addr.id}`] ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-brand-blue bg-white'}`}
                                                        placeholder="PIN"
                                                        value={addr.pin}
                                                        onChange={(e) => handleAddressChange(addr.id, "pin", e.target.value)}
                                                    />
                                                    {errors[`pin_${addr.id}`] && <p className="text-red-500 text-[9px] font-bold ml-1">{errors[`pin_${addr.id}`]}</p>}
                                                </div>
                                                <div className="flex items-center gap-2 pt-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSetPrimary(addr.id)}
                                                        disabled={addr.isPrimary}
                                                        className={`flex items-center gap-2 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all ${addr.isPrimary ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-white border border-slate-200 text-slate-500 hover:border-brand-blue hover:text-brand-blue'}`}
                                                    >
                                                        {addr.isPrimary ? <><Check size={12} /> Primary</> : "Set as Primary"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center">
                                        <MapPinned size={32} className="text-slate-300 mb-2" />
                                        <p className="text-sm text-slate-500 font-medium">No addresses added yet.</p>
                                        <button onClick={handleAddAddress} className="mt-4 text-xs font-bold text-brand-blue hover:underline">Add your first address</button>
                                    </div>
                                )
                            ) : (
                                user.addresses && user.addresses.length > 0 ? (
                                    user.addresses.map((addr: UserAddress) => (
                                        <div key={addr.id} className={`p-5 rounded-2xl border transition-all ${addr.isPrimary ? 'border-brand-blue bg-brand-blue/5 shadow-[0_4px_12px_rgba(0,102,204,0.05)]' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className={`p-2 rounded-lg ${addr.isPrimary ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-500'}`}>
                                                        {addr.type === 'Home' ? <Home size={16} /> : addr.type === 'Work' || addr.type === 'Office' ? <Briefcase size={16} /> : <MapPin size={16} />}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                                            {addr.type}
                                                            {addr.isPrimary && <span className="text-[9px] bg-brand-orange text-white px-1.5 py-0.5 rounded-full uppercase tracking-tighter">Primary</span>}
                                                        </h4>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-600 font-medium leading-relaxed mt-3">
                                                {addr.address}<br />
                                                <span className="text-slate-500">
                                                    {addr.city}, {addr.state} - <span className="font-bold text-slate-700">{addr.pin}</span>
                                                </span>
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-5 bg-white border border-slate-100 rounded-2xl flex items-center gap-3 text-slate-500">
                                        <MapPin size={18} className="opacity-50" />
                                        <span className="text-sm font-medium">No address information provided.</span>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    {isEdit && (
                        <div className="pt-6 flex flex-col gap-4">
                            <button
                                onClick={handleUpdate}
                                disabled={isSaving}
                                className="w-full bg-brand-blue text-white py-4 rounded-xl font-bold hover:bg-brand-blue-dark transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-brand-blue/20"
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Save Information</>}
                            </button>

                            <div className="pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="w-full text-red-500 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-red-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <Trash2 size={16} /> Danger: Permanent Account Deletion
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Wallet Card */}
            {!isEdit && (
                <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-100 h-fit">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-brand-blue/10 flex items-center justify-center">
                            <Wallet size={20} className="text-brand-blue" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">My Wallet</h2>
                    </div>

                    <div className="bg-brand-blue/5 border border-brand-blue/20 rounded-lg p-6 mb-8 flex items-center justify-between overflow-hidden relative">
                        <div className="relative z-10">
                            <p className="text-sm font-semibold text-brand-blue-dark/70 uppercase tracking-wider mb-1">Available Balance</p>
                            <p className="text-4xl font-black text-brand-blue-dark">₹{(user.walletBalance || 0).toLocaleString('en-IN')}</p>
                        </div>
                        <Wallet size={80} className="text-brand-blue opacity-10 absolute -right-4 -bottom-4 z-0 rotate-[-15deg]" />
                    </div>

                    <form onSubmit={handleAddMoney} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Add Money to Wallet (Online Payment)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">₹</span>
                                <input
                                    type="number"
                                    className="w-full p-4 pl-10 border border-slate-200 rounded-lg outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all text-lg font-bold"
                                    placeholder="Enter amount"
                                    value={addMoneyAmount}
                                    onChange={(e) => setAddMoneyAmount(e.target.value)}
                                    min="10"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isAddingMoney}
                            className="w-fit px-4 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-2"
                        >
                            {isAddingMoney ? <Loader2 className="animate-spin" size={20} /> : <><CreditCard size={18} /> Pay Online</>}
                        </button>
                    </form>
                </div>
            )}

            {/* Reset Password Card */}
            {isEdit && (
                <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-100 h-fit">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center">
                            <Lock size={20} className="text-brand-orange" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">Security & Password</h2>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide opacity-70">New Password</label>
                            <PasswordInput
                                className={`w-full p-4 border rounded-xl outline-none transition-all ${resetErrors.newPassword ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5'}`}
                                placeholder="Enter new password"
                                value={resetData.newPassword}
                                onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
                            />
                            {resetErrors.newPassword && <p className="text-red-500 text-xs font-medium mt-1 ml-1">{resetErrors.newPassword}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide opacity-70">Confirm New Password</label>
                            <PasswordInput
                                className={`w-full p-4 border rounded-xl outline-none transition-all ${resetErrors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5'}`}
                                placeholder="Confirm new password"
                                value={resetData.confirmPassword}
                                onChange={(e) => setResetData({ ...resetData, confirmPassword: e.target.value })}
                            />
                            {resetErrors.confirmPassword && <p className="text-red-500 text-xs font-medium mt-1 ml-1">{resetErrors.confirmPassword}</p>}
                        </div>

                        <button
                            onClick={handleResetPassword}
                            disabled={isResetting}
                            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-2"
                        >
                            {isResetting ? <Loader2 className="animate-spin" size={20} /> : <><RefreshCcw size={18} /> Update Password</>}
                        </button>
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Account"
                message="Are you sure you want to delete your account? This action is permanent and cannot be undone. All your data will be removed."
                confirmText="Yes, Delete Account"
                type="danger"
                isLoading={isDeleting}
            />
        </div>
    )
}
