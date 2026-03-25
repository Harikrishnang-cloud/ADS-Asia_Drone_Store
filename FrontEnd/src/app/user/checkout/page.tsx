"use client";

import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useCartStore } from "@/store/cartStore";
import { Lock, CreditCard, CheckCircle, ShoppingBag, ArrowLeft, Wallet, Banknote, Smartphone, MapPin, Clock, Truck, PackageCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import toast from "react-hot-toast";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { useAuthStore } from "@/store/authStore";
import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, doc, Timestamp, increment } from "firebase/firestore";
import Script from "next/script";
import api from "@/lib/axios";

export default function CheckoutPage() {
    const { items, getTotalPrice, clearCart } = useCartStore();
    const { user } = useAuthStore();
    const router = useRouter();
    const [hasHydrated, setHasHydrated] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
        setHasHydrated(true);
    }, []);

    // Redirect to cart if empty and hydrated
    useEffect(() => {
        if (hasHydrated && items.length === 0 && !showSuccessModal) {
            router.push("/user/cart");
        }
    }, [hasHydrated, items.length, router, showSuccessModal]);

    const subtotal = getTotalPrice();
    const shipping = subtotal < 10000 ? 0 : 200;
    const actualShipping = subtotal < 10000 ? 0 : 200;
    const total = subtotal + actualShipping;

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zip: "",
    });

    const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "wallet" | "cod" | "online">("razorpay");

    // Dynamic checking of the address from context storage
    const [savedAddresses, setSavedAddresses] = useState<any[]>([]);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                firstName: prev.firstName || (user.name ? user.name.split(' ')[0] : ""),
                lastName: prev.lastName || (user.name ? user.name.split(' ').slice(1).join(' ') : ""),
                email: prev.email || user.email || "",
                phone: prev.phone || user.phone || ""
            }));

            if (user.addresses && user.addresses.length > 0) {
                setSavedAddresses(user.addresses.map(addr => ({
                    id: addr.id,
                    type: addr.type,
                    address: addr.address,
                    city: addr.city,
                    state: addr.state,
                    zip: addr.pin,
                    isPrimary: addr.isPrimary
                })));

                // Set selected address to primary by default
                const primary = user.addresses.find(a => a.isPrimary) || user.addresses[0];
                setSelectedAddressId(primary.id);
            } else if (user.address) {
                const legacyAddr = {
                    id: 'primary',
                    type: "Primary Address",
                    address: user.address,
                    city: user.city || "Not Set",
                    state: user.state || "Not Set",
                    zip: user.pin || "Not Set",
                    isPrimary: true
                };
                setSavedAddresses([legacyAddr]);
                setSelectedAddressId(legacyAddr.id);
            } else {
                setSavedAddresses([]);
            }
        }
    }, [user]);

    const walletBalance = user?.walletBalance || 0;

    const isCodAvailable = total < 1000;
    const isWalletAvailable = walletBalance > 0 && walletBalance >= total;

    useEffect(() => {
        if (!isCodAvailable && paymentMethod === "cod") {
            setPaymentMethod("razorpay");
        }
        if (!isWalletAvailable && paymentMethod === "wallet") {
            setPaymentMethod("razorpay");
        }
    }, [isCodAvailable, isWalletAvailable, paymentMethod]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const newErrors: any = {};
        if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
        if (!/^[A-Za-z]+$/.test(formData.firstName)) newErrors.firstName = "First name must contain only letters";
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
        if (!/^[A-Za-z]+$/.test(formData.lastName)) newErrors.lastName = "Last name must contain only letters";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Enter a valid email address";
        }
        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!/^\d+$/.test(formData.phone)) {
            newErrors.phone = "Phone must contain only numbers";
        } else if (formData.phone.length !== 10) {
            newErrors.phone = "Phone number must be exactly 10 digits";
        } else if (!/^[6-9]/.test(formData.phone)) {
            newErrors.phone = "Phone number must start with 6, 7, 8, or 9";
        }
        else if (!/^[0-9]+$/.test(formData.phone)) {
            newErrors.phone = "Phone must be only numbers";
        }

        if (savedAddresses.length > 0 && !selectedAddressId) {
            newErrors.address = "Please select a shipping address";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePlaceOrder = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            toast.error("Please fix the errors in your shipping details.");
            return;
        }

        if (savedAddresses.length === 0) {
            toast.error("You need a saved address in your profile to checkout.");
            return;
        }

        if (!user || !user.id) {
            toast.error("User session not found. Please log in again.");
            return;
        }

        setIsProcessing(true);
        
        const selectedAddress = savedAddresses.find(a => a.id === selectedAddressId);
        
        const orderData = {
            userId: user.id,
            items: items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            })),
            total: total,
            subtotal: subtotal,
            shipping: actualShipping,
            paymentMethod: paymentMethod,
            status: "Processing",
            createdAt: Timestamp.now(),
            shippingAddress: {
                address: selectedAddress.address,
                city: selectedAddress.city,
                state: selectedAddress.state,
                zip: selectedAddress.zip,
                type: selectedAddress.type
            },
            contact: {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                phone: formData.phone
            }
        };

        const createOrder = async (razorpayData?: any) => {
            try {
                const finalOrderData = {
                    ...orderData,
                    razorpay: razorpayData || null,
                    status: (razorpayData || paymentMethod === "wallet" || paymentMethod === "cod") ? "Processing" : "Pending"
                };

                // If wallet, update user's balance
                if (paymentMethod === "wallet") {
                    const userRef = doc(db, "users", user.id!);
                    await updateDoc(userRef, {
                        walletBalance: increment(-total)
                    });
                }

                await addDoc(collection(db, "orders"), finalOrderData);
                
                // Show success
                setIsProcessing(false);
                setShowSuccessModal(true);
            } catch (error) {
                console.error("Order failed:", error);
                toast.error("Failed to place order. Please try again.");
                setIsProcessing(false);
            }
        };

        const initiateRazorpay = async () => {
            console.log("Initiating Razorpay payment for amount:", total);
            try {
                // 1. Create order in Backend
                const orderRes = await api.post("/payment/create-order", { amount: total });
                console.log("Order created in backend:", orderRes.data);
                const order = orderRes.data.order;

                if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
                    throw new Error("Razorpay Key ID missing in environment variables.");
                }

                // 2. Open Razorpay Modal
                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    amount: order.amount,
                    currency: order.currency,
                    name: "Asia Drone Store",
                    description: "Premium Drone Purchase",
                    order_id: order.id,
                    handler: async function (response: any) {
                        try {
                            // 3. Verify Payment
                            const verifyRes = await api.post("/payment/verify-payment", {
                                order_id: response.razorpay_order_id,
                                payment_id: response.razorpay_payment_id,
                                signature: response.razorpay_signature
                            });

                            if (verifyRes.data.success) {
                                await createOrder({
                                    orderId: response.razorpay_order_id,
                                    paymentId: response.razorpay_payment_id
                                });
                            } else {
                                toast.error("Payment verification failed. Please contact support.");
                                setIsProcessing(false);
                            }
                        } catch (err) {
                            console.error("Verification failed:", err);
                            toast.error("Payment verification failed.");
                            setIsProcessing(false);
                        }
                    },
                    prefill: {
                        name: `${formData.firstName} ${formData.lastName}`,
                        email: formData.email,
                        contact: formData.phone
                    },
                    theme: {
                        color: "#0066CC"
                    },
                    modal: {
                        ondismiss: function() {
                            setIsProcessing(false);
                        }
                    }
                };
                
                console.log("Opening Razorpay Modal with options:", options);
                
                if (typeof (window as any).Razorpay === 'undefined') {
                    throw new Error("Razorpay SDK not loaded. Please check your internet connection and refresh.");
                }

                const rzp = new (window as any).Razorpay(options);
                rzp.open();

            } catch (error: any) {
                console.error("Razorpay initiation failed:", error);
                toast.error(error.response?.data?.message || "Failed to initiate payment. Server might be down.");
                setIsProcessing(false);
            }
        };

        if (paymentMethod === "razorpay" || paymentMethod === "online") {
            initiateRazorpay();
        } else {
            createOrder();
        }
    };

    const handleSuccessComplete = () => {
        clearCart();
        setShowSuccessModal(false);
        router.push("/user/orders");
    };

    if (!hasHydrated || items.length === 0) {
        return (
            <ProtectedRoute allowedRole="user">
                <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-brand-orange"></div>
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-400">ADS</div>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute allowedRole="user">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
            <div className="min-h-screen pt-24 md:pt-32 pb-12 md:pb-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <Link href="/user/cart" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-blue mb-4 transition-colors">
                            <ArrowLeft size={16} />
                            Back to Cart
                        </Link>
                        <h1 className="text-2xl md:text-3xl font-black text-brand-blue-dark flex items-center gap-3 tracking-tight">
                            <Lock className="text-brand-orange" size={28} />
                            Secure Checkout
                        </h1>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Side - Forms */}
                        <div className="flex-1 space-y-8">
                            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-8">
                                {/* Contact Info */}
                                <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm border border-slate-100">
                                    <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center text-sm font-bold">1</span>
                                        Contact Information
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-slate-700 ml-1">First Name*</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                suppressHydrationWarning
                                                className={`w-full px-4 py-3 rounded-xl bg-slate-50 border outline-none transition-all text-slate-900 ${errors.firstName ? 'border-red-500 ring-2 ring-red-500/10' : 'border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20'}`}
                                                placeholder="Enter first name"
                                            />
                                            {errors.firstName && <p className="text-[10px] font-bold text-red-500 ml-2">{errors.firstName}</p>}
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Last Name*</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                suppressHydrationWarning
                                                className={`w-full px-4 py-3 rounded-xl bg-slate-50 border outline-none transition-all text-slate-900 ${errors.lastName ? 'border-red-500 ring-2 ring-red-500/10' : 'border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20'}`}
                                                placeholder="Enter last name"
                                            />
                                            {errors.lastName && <p className="text-[10px] font-bold text-red-500 ml-2">{errors.lastName}</p>}
                                        </div>
                                        <div className="space-y-1 md:col-span-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Email Address*</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                suppressHydrationWarning
                                                className={`w-full px-4 py-3 rounded-xl bg-slate-50 border outline-none transition-all text-slate-900 ${errors.email ? 'border-red-500 ring-2 ring-red-500/10' : 'border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20'}`}
                                                placeholder="Enter email address"
                                            />
                                            {errors.email && <p className="text-[10px] font-bold text-red-500 ml-2">{errors.email}</p>}
                                        </div>
                                        <div className="space-y-1 md:col-span-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Phone Number*</label>
                                            <div className="relative">
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    suppressHydrationWarning
                                                    className={`w-full px-4 py-3 rounded-xl bg-slate-50 border outline-none transition-all text-slate-900 ${errors.phone ? 'border-red-500 ring-2 ring-red-500/10' : 'border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20'}`}
                                                    placeholder="Enter 10-digit phone number"
                                                />
                                            </div>
                                            {errors.phone && <p className="text-[10px] font-bold text-red-500 ml-2">{errors.phone}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                {savedAddresses.length > 0 ? (
                                    <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm border border-slate-100">
                                        <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="w-8 h-8 rounded-lg bg-brand-blue/10 text-brand-blue flex items-center justify-center text-sm font-bold">2</span>
                                                Shipping Address
                                            </div>
                                            {errors.address && <p className="text-[10px] font-black uppercase text-red-500 bg-red-50 px-3 py-1 rounded-full border border-red-100">{errors.address}</p>}
                                            <Link href="/user/profile" className="text-sm font-bold text-brand-blue hover:text-brand-orange transition-colors">
                                                Manage
                                            </Link>
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {savedAddresses.map((addr) => (
                                                <div
                                                    key={addr.id}
                                                    onClick={() => setSelectedAddressId(addr.id)}
                                                    className={`p-4 border-2 rounded-lg relative cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-brand-blue bg-brand-blue/5' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                                                >
                                                    <div className="absolute top-4 right-4 text-brand-blue">
                                                        {selectedAddressId === addr.id ? (
                                                            <CheckCircle size={20} className="fill-brand-blue text-white" />
                                                        ) : (
                                                            <div className="w-5 h-5 rounded-full border-2 border-slate-200" />
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <MapPin size={16} className={selectedAddressId === addr.id ? "text-brand-blue" : "text-slate-400"} />
                                                        <span className={`font-bold ${selectedAddressId === addr.id ? "text-slate-900" : "text-slate-600"}`}>{addr.type}</span>
                                                    </div>
                                                    <p className="text-sm text-slate-500 leading-relaxed pr-8">
                                                        {addr.address}<br />
                                                        {addr.city}, {addr.state} {addr.zip}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm border border-slate-100 min-h-[250px] flex flex-col items-center justify-center text-center">
                                        <div className="w-16 h-16 bg-brand-blue/5 rounded-full flex items-center justify-center mb-4">
                                            <MapPin className="text-brand-blue" size={24} />
                                        </div>
                                        <h2 className="text-xl font-black text-slate-900 mb-2">No Address Found</h2>
                                        <p className="text-slate-500 mb-6 max-w-[280px]">You need a delivery address to complete your checkout. Let's add one to your profile.</p>
                                        <Link href="/user/profile">
                                            <Button type="button" variant="primary" icon={<MapPin size={18} />}>
                                                Add New Address
                                            </Button>
                                        </Link>
                                    </div>
                                )}

                                {/* Payment Method */}
                                <div className="bg-white rounded-lg  p-6 md:p-8 shadow-sm border border-slate-100">
                                    <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center text-sm font-bold">3</span>
                                        Payment Methods
                                    </h2>

                                    <div className="space-y-4">
                                        {/* Stripe Option */}
                                        <div
                                            onClick={() => setPaymentMethod("razorpay")}
                                            className={`p-4 border-2 rounded-xl flex items-start gap-4 cursor-pointer relative overflow-hidden transition-all shadow-sm ${paymentMethod === 'razorpay' ? 'border-brand-blue bg-brand-blue/5' : 'border-slate-100 bg-white hover:border-brand-blue/30'}`}
                                        >
                                            <div className="absolute top-0 right-0 w-16 h-16 bg-brand-blue/10 rounded-bl-full -z-10 opacity-0 transition-opacity" style={{ opacity: paymentMethod === 'razorpay' ? 1 : 0 }}></div>
                                            <div className="mt-1 flex-shrink-0">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMethod === 'razorpay' ? 'border-brand-blue' : 'border-slate-300'}`}>
                                                    {paymentMethod === 'razorpay' && <div className="w-2.5 h-2.5 rounded-full bg-brand-blue"></div>}
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className={`font-bold flex items-center gap-2 flex-wrap transition-colors ${paymentMethod === 'razorpay' ? 'text-brand-blue-dark' : 'text-slate-700'}`}>
                                                    <CreditCard size={18} className={paymentMethod === 'razorpay' ? 'text-brand-blue' : 'text-slate-400'} />
                                                    Credit / Debit Card via Razorpay
                                                </h3>
                                                <p className="text-sm text-slate-500 mt-1 leading-relaxed">You will be redirected to the secure Razorpay portal after placing your order to complete the payment.</p>
                                            </div>
                                        </div>

                                        {/* Wallet Option */}
                                        <div
                                            onClick={() => isWalletAvailable && setPaymentMethod("wallet")}
                                            className={`p-4 border-2 rounded-xl flex items-start gap-4 relative overflow-hidden transition-all shadow-sm ${!isWalletAvailable
                                                    ? 'opacity-60 cursor-not-allowed border-slate-100 bg-slate-50'
                                                    : paymentMethod === 'wallet'
                                                        ? 'border-brand-blue bg-brand-blue/5 cursor-pointer'
                                                        : 'border-slate-100 bg-white hover:border-brand-blue/30 cursor-pointer'
                                                }`}
                                        >
                                            <div className="absolute top-0 right-0 w-16 h-16 bg-brand-blue/10 rounded-bl-full -z-10 opacity-0 transition-opacity" style={{ opacity: paymentMethod === 'wallet' ? 1 : 0 }}></div>
                                            <div className="mt-1 flex-shrink-0">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMethod === 'wallet' ? 'border-brand-blue' : 'border-slate-300'}`}>
                                                    {paymentMethod === 'wallet' && <div className="w-2.5 h-2.5 rounded-full bg-brand-blue"></div>}
                                                </div>
                                            </div>
                                            <div className="w-full">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 w-full">
                                                    <h3 className={`font-bold flex items-center gap-2 flex-wrap transition-colors ${!isWalletAvailable ? 'text-slate-500' : paymentMethod === 'wallet' ? 'text-brand-blue-dark' : 'text-slate-700'}`}>
                                                        <Wallet size={18} className={!isWalletAvailable ? 'text-slate-400' : paymentMethod === 'wallet' ? 'text-brand-blue' : 'text-slate-400'} />
                                                        Use Wallet Balance
                                                    </h3>
                                                    <span className="font-black text-sm text-brand-blue bg-brand-blue/5 px-2.5 py-1 rounded-lg border border-brand-blue/10 w-fit">₹{walletBalance.toLocaleString('en-IN')}</span>
                                                </div>
                                                <p className="text-sm text-slate-500 mt-1 leading-relaxed">Pay instantly using your available wallet funds.</p>
                                                {!isWalletAvailable && (
                                                    <p className="text-xs font-bold text-red-500 mt-2 bg-red-50 inline-block px-2 py-1 rounded-md">Insufficient balance for this order</p>
                                                )}
                                            </div>
                                        </div>
                                        {/* Online Payment */}
                                        <div
                                            onClick={() => setPaymentMethod("online")}
                                            className={`p-4 border-2 rounded-xl flex items-start gap-4 cursor-pointer relative overflow-hidden transition-all shadow-sm ${paymentMethod === 'online' ? 'border-brand-blue bg-brand-blue/5' : 'border-slate-100 bg-white hover:border-brand-blue/30'}`}
                                        >
                                            <div className="absolute top-0 right-0 w-16 h-16 bg-brand-blue/10 rounded-bl-full -z-10 opacity-0 transition-opacity" style={{ opacity: paymentMethod === 'online' ? 1 : 0 }}></div>
                                            <div className="mt-1 flex-shrink-0">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMethod === 'online' ? 'border-brand-blue' : 'border-slate-300'}`}>
                                                    {paymentMethod === 'online' && <div className="w-2.5 h-2.5 rounded-full bg-brand-blue"></div>}
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className={`font-bold flex items-center gap-2 flex-wrap transition-colors ${paymentMethod === 'online' ? 'text-brand-blue-dark' : 'text-slate-700'}`}>
                                                    <Smartphone size={18} className={paymentMethod === 'online' ? 'text-brand-blue' : 'text-slate-400'} />
                                                    UPI / GPay / PhonePe
                                                </h3>
                                                <p className="text-sm text-slate-500 mt-1 leading-relaxed">Pay instantly using any UPI app on your mobile device.</p>
                                            </div>
                                        </div>

                                        {/* COD Option */}
                                        <div
                                            onClick={() => isCodAvailable && setPaymentMethod("cod")}
                                            className={`p-4 border-2 rounded-xl flex items-start gap-4 relative overflow-hidden transition-all shadow-sm ${!isCodAvailable
                                                    ? 'opacity-60 cursor-not-allowed border-slate-100 bg-slate-50'
                                                    : paymentMethod === 'cod'
                                                        ? 'border-brand-blue bg-brand-blue/5 cursor-pointer'
                                                        : 'border-slate-100 bg-white hover:border-brand-blue/30 cursor-pointer'
                                                }`}
                                        >
                                            <div className="absolute top-0 right-0 w-16 h-16 bg-brand-blue/10 rounded-bl-full -z-10 opacity-0 transition-opacity" style={{ opacity: paymentMethod === 'cod' ? 1 : 0 }}></div>
                                            <div className="mt-1 flex-shrink-0">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMethod === 'cod' ? 'border-brand-blue' : 'border-slate-300'}`}>
                                                    {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-brand-blue"></div>}
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className={`font-bold flex items-center gap-2 flex-wrap transition-colors ${!isCodAvailable ? 'text-slate-500' : paymentMethod === 'cod' ? 'text-brand-blue-dark' : 'text-slate-700'}`}>
                                                    <Banknote size={18} className={!isCodAvailable ? 'text-slate-400' : paymentMethod === 'cod' ? 'text-brand-blue' : 'text-slate-400'} />
                                                    Cash on Delivery (COD)
                                                </h3>
                                                <p className="text-sm text-slate-500 mt-1 leading-relaxed">Pay with cash upon the delivery of your premium drone products.</p>
                                                {!isCodAvailable && (
                                                    <p className="text-xs font-bold text-red-500 mt-2 bg-red-50 inline-block px-2 py-1 rounded-md">Unavailable for orders ₹1,000 and above</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-5 flex items-center gap-2 font-medium">
                                        <Lock size={12} className="text-emerald-500" /> SSL Encrypted Checkout. We do not store your payment credentials.
                                    </p>
                                </div>
                            </form>
                        </div>

                        {/* Right Side - Order Summary */}
                        <div className="w-full lg:w-[420px]">
                            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm border border-slate-100 sticky top-32 group hover:shadow-lg transition-all duration-300">
                                <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                    <ShoppingBag size={20} className="text-brand-orange" />
                                    Order Summary
                                </h2>

                                <div className="space-y-4 mb-6 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-4">
                                            <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0 relative">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                <div className="absolute bottom-0 right-0 bg-brand-blue text-white text-[10px] font-bold px-1.5 py-0.5 rounded-tl-lg">
                                                    x{item.quantity}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                <h4 className="text-sm font-bold text-slate-900 line-clamp-2 mb-1">{item.name}</h4>
                                                <p className="text-brand-blue font-bold text-sm">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3 py-5 border-y border-slate-100 mb-6 border-dashed">
                                    <div className="flex items-center justify-between text-sm text-slate-600">
                                        <span className="font-medium">Subtotal</span>
                                        <span className="font-bold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-slate-600">
                                        <span className="font-medium">Estimated Shipping</span>
                                        <span className="font-bold text-emerald-500">{actualShipping === 0 ? "Free" : `₹${actualShipping.toLocaleString('en-IN')}`}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mb-8">
                                    <span className="text-xl font-bold text-slate-900">Total</span>
                                    <span className="text-3xl font-black text-brand-blue-dark">₹{total.toLocaleString('en-IN')}</span>
                                </div>

                                <Button
                                    type="submit"
                                    form="checkout-form"
                                    fullWidth
                                    loading={isProcessing}
                                    size="lg"
                                    icon={<CheckCircle size={20} />}
                                    className="text-base shadow-brand-blue/20"
                                >
                                    Place Order Securely
                                </Button>
                                <p className="text-xs text-center text-slate-500 mt-4 leading-relaxed">
                                    By placing your order, you agree to our <Link href="/support/terms" className="text-brand-blue hover:underline">Terms of Service</Link> and <Link href="/support/privacy" className="text-brand-blue hover:underline">Privacy Policy</Link>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            <ConfirmationModal
                isOpen={showSuccessModal}
                onClose={handleSuccessComplete}
                onConfirm={handleSuccessComplete}
                title="Order Received!"
                message="Your order has been placed successfully. Thank you for shopping with Asia Drone Store!"
                confirmText="Continue Shopping"
                cancelText="Close"
                type="info"
            />
        </ProtectedRoute>
    );
}
