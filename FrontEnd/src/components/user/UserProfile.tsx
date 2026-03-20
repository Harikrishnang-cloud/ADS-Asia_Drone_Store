"use client";

import { useState, useEffect, useRef } from "react";
import { db, storage } from "@/lib/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { User, Mail, Phone, MapPin, Camera, Save, Trash2, Loader2, Edit3, ChevronLeft, Lock, RefreshCcw, Wallet, CreditCard } from "lucide-react";
import { PasswordInput } from "@/components/PasswordInput";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/auth.service";

interface UserProfileProps {
    isEdit?: boolean;
}

export default function UserProfile({ isEdit = false }: UserProfileProps) {
    const { user: authUser, setAuth } = useAuthStore();
    const [user, setUser] = useState<any>(null);
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
        pin: ""
    });

    const [errors, setErrors] = useState<any>({});
    
    const [addMoneyAmount, setAddMoneyAmount] = useState("");
    const [isAddingMoney, setIsAddingMoney] = useState(false);

    // Reset Password States
    const [resetData, setResetData] = useState({
        newPassword: "",
        confirmPassword: ""
    });
    const [resetErrors, setResetErrors] = useState<any>({});
    const [isResetting, setIsResetting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const userId = authUser?.id;
            
            if (!userId) {
                // If not in store, check localStorage as fallback
                const storedUserStr = localStorage.getItem("userData");
                if (storedUserStr) {
                    const storedUser = JSON.parse(storedUserStr);
                    if (storedUser.id || storedUser.uid) {
                        // We have a user in localStorage, but maybe not in store yet
                        // (though authStore persist should handle this)
                    } else {
                        router.push("/auth/login");
                        return;
                    }
                } else {
                    router.push("/auth/login");
                    return;
                }
            }

            if (!userId) {
                // ... logic to handle redirect or check localStorage ...
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
                        pin: data.pin || ""
                    });
                }
            } catch (error) {
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [router]);

    const validate = () => {
        const newErrors: any = {};
        if (!formData.name.trim() || formData.name.trim().length < 3) {
            newErrors.name = "Name must be at least 3 characters long";
            
        }
        if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = "Phone number must be exactly 10 digits";
        }
        if (formData.address && formData.address.trim().length < 10) {
            newErrors.address = "Address should be at least 10 characters long";
        }
        if (formData.pin && !/^\d{6}$/.test(formData.pin)) {
            newErrors.pin = "PIN code must be exactly 6 digits";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validate()) {
            toast.error("Please fix the errors before saving");
            return;
        }

        setIsSaving(true);
        try {
            await updateDoc(doc(db, "users", user.id), { ...formData });
            const updatedUser = { ...user, ...formData };
            localStorage.setItem("userData", JSON.stringify(updatedUser));
            setAuth(updatedUser, localStorage.getItem("accessToken"));
            toast.success("Profile updated!");
            router.push("/user/profile");
        } catch (error) {
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
                await updateDoc(doc(db, "users", user.id), { profileImage: url });
                const updatedUser = { ...user, profileImage: url };
                setUser(updatedUser);
                localStorage.setItem("userData", JSON.stringify(updatedUser));
                setAuth(updatedUser, localStorage.getItem("accessToken"));
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
            await deleteDoc(doc(db, "users", user.id));
            localStorage.clear();
            window.dispatchEvent(new Event('storage'));
            router.push("/");
            toast.success("Account deleted");
        } catch (error) {
            toast.error("Delete failed");
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const newResetErrors: any = {};
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
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || err.message || "An error occurred during password reset";
            toast.error(errorMsg);
        } finally {
            setIsResetting(false);
        }
    };

    const handleAddMoney = async (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseInt(addMoneyAmount);
        if (isNaN(amount) || amount <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        setIsAddingMoney(true);

        // Simulate secure online payment delay
        setTimeout(async () => {
            try {
                const newBalance = (user.walletBalance || 0) + amount;
                await updateDoc(doc(db, "users", user.id), { walletBalance: newBalance });
                const updatedUser = { ...user, walletBalance: newBalance };
                setUser(updatedUser);
                localStorage.setItem("userData", JSON.stringify(updatedUser));
                setAuth(updatedUser, localStorage.getItem("accessToken"));
                
                toast.success(`Successfully added ₹${amount.toLocaleString('en-IN')} to wallet!`);
                setAddMoneyAmount("");
            } catch (error) {
                toast.error("Failed to add money");
            } finally {
                setIsAddingMoney(false);
            }
        }, 1500);
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-brand-blue" size={40} /></div>;
    if (!user) return null;

    return (
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                            <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
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
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                            <div className="space-y-1">
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        type="tel" 
                                        className={`w-full p-4 pl-12 border rounded-xl outline-none transition-all ${errors.phone ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5'}`}
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        placeholder="e.g. 9876543210"
                                    />
                                </div>
                                {errors.phone && <p className="text-red-500 text-xs font-medium ml-1">{errors.phone}</p>}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 p-4 bg-white border border-slate-100 rounded-xl font-bold text-slate-800">
                                 <Phone size={16} className="text-slate-400" />
                                 <span>{user.phone || "Not set"}</span>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide opacity-70">Delivery Address with Pincode</label>
                        {isEdit ? (
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-4 text-slate-400" size={18} />
                                        <textarea 
                                            className={`w-full p-4 pl-12 border rounded-xl outline-none transition-all min-h-[120px] resize-none ${errors.address ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5'}`}
                                            value={formData.address}
                                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                                            placeholder="Enter your full delivery address"
                                        />
                                    </div>
                                    {errors.address && <p className="text-red-500 text-xs font-medium ml-1">{errors.address}</p>}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <input type="text" className="w-full p-4 border rounded-xl outline-none transition-all border-slate-200 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5" placeholder="City" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                                    </div>
                                    <div className="space-y-1">
                                        <input type="text" className="w-full p-4 border rounded-xl outline-none transition-all border-slate-200 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5" placeholder="State/UT" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} />
                                    </div>
                                    <div className="space-y-1">
                                        <input type="text" className={`w-full p-4 border rounded-xl outline-none transition-all focus:ring-4 focus:ring-brand-blue/5 ${errors.pin ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-brand-blue'}`} placeholder="PIN Code" value={formData.pin} onChange={(e) => setFormData({...formData, pin: e.target.value})} />
                                        {errors.pin && <p className="text-red-500 text-xs font-medium ml-1">{errors.pin}</p>}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-start gap-2 p-4 bg-white border border-slate-100 rounded-xl font-bold text-slate-800 leading-relaxed">
                                 <MapPin size={16} className="text-slate-400 mt-1" />
                                 <span>
                                     {user.address ? (
                                         <>
                                            {user.address} <br/>
                                            <span className="text-sm font-medium text-slate-500 block mt-1">
                                                {user.city && `${user.city}, `}{user.state && `${user.state}`} {user.pin && `- ${user.pin}`}
                                            </span>
                                         </>
                                     ) : "Not set"}
                                 </span>
                            </div>
                        )}
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
                                onChange={(e) => setResetData({...resetData, newPassword: e.target.value})}
                            />
                            {resetErrors.newPassword && <p className="text-red-500 text-xs font-medium mt-1 ml-1">{resetErrors.newPassword}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide opacity-70">Confirm New Password</label>
                            <PasswordInput 
                                className={`w-full p-4 border rounded-xl outline-none transition-all ${resetErrors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5'}`}
                                placeholder="Confirm new password"
                                value={resetData.confirmPassword}
                                onChange={(e) => setResetData({...resetData, confirmPassword: e.target.value})}
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
