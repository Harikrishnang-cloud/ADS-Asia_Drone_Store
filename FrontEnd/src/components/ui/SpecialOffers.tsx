import React from 'react';
import { Lock } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';
import { Product } from '@/types/product.types';

interface SpecialOffersProps {
    product?: Product;
}

export default function SpecialOffers({ product }: SpecialOffersProps) {
    const { items, addItem, removeItem } = useCartStore();

    const handleApplyDeal = (qty: number, discountPercentage: number) => {
        if (!product) {
            toast.error("This offer can only be applied from a specific product page.");
            return;
        }

        const existingQtyInCart = items
            .filter(item => item.id.startsWith(product.id))
            .reduce((sum, item) => sum + item.quantity, 0);

        if (existingQtyInCart + qty > product.stock) {
            toast.error(`Cannot add. Only ${product.stock} available (You have ${existingQtyInCart} in cart).`);
            return;
        }

        const basePrice = Number(product.price);
        const discountedPrice = basePrice * (1 - (discountPercentage / 100));

        addItem({
            id: `${product.id}-combo-${qty}`,
            name: `${product.name} (Combo of ${qty})`,
            price: discountedPrice,
            image: product.imageUrl,
            quantity: qty,
            rating: product.rating,
            reviews: product.reviews,
            weight: product.weight,
            dimensions: product.dimensions,
            originalPrice: basePrice,
            offerPercentage: discountPercentage,
            stock: product.stock
        });

        toast.success(`Combo deal added! ${qty} items in your cart.`);
    };

    const handleRemoveDeal = (qty: number) => {
        if (!product) return;
        removeItem(`${product.id}-combo-${qty}`);
        toast.success(`Combo deal removed from cart.`);
    };

    const isApplied = (qty: number) => {
        if (!product) return false;
        return items.some(item => item.id === `${product.id}-combo-${qty}`);
    };

    return (
        <div className="w-full mx-auto flex flex-col md:flex-row rounded-[15px] overflow-hidden shadow-md border border-slate-200">
            {/* Combo Deals Section */}
            <div className="bg-slate-100 flex-1 flex flex-col">
                <div className="p-4 space-y-4">
                    {/* Deal 1 */}
                    <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                        <div className="space-y-1">
                            <span className="inline-block bg-brand-blue text-white text-[10px] font-bold px-2 py-0.5 mb-1">Most Popular</span>
                            <h3 className="font-bold text-slate-800 text-base leading-tight">Buy 2 • Save 5%</h3>
                            <p className="text-slate-500 text-xs">Perfect for personal use</p>
                        </div>
                        <div className="flex gap-2">
                            {isApplied(2) ? (
                                <>
                                    <button
                                        disabled
                                        className="transition-colors text-white font-bold text-sm px-4 py-2 rounded-lg shadow-sm bg-emerald-500 cursor-default">
                                        Applied ✔
                                    </button>
                                    <button
                                        onClick={() => handleRemoveDeal(2)}
                                        className="transition-colors text-slate-500 hover:text-red-500 hover:bg-red-50 text-xs font-bold px-3 py-2 rounded-lg border border-slate-200 cursor-pointer">
                                        Remove
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => handleApplyDeal(2, 5)}
                                    className="transition-colors text-white font-bold text-sm px-4 py-2 rounded-lg shadow-sm bg-brand-orange hover:bg-brand-orange-dark cursor-pointer">
                                    Select Now
                                </button>
                            )}
                        </div>
                    </div>
                    {/* Deal 2 */}
                    <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                        <div className="space-y-1">
                            <h3 className="font-bold text-slate-800 text-base leading-tight">Buy 3 • Save 8%</h3>
                            <p className="text-slate-500 text-xs">Best value combo</p>
                        </div>
                        <div className="flex gap-2">
                            {isApplied(3) ? (
                                <>
                                    <button
                                        disabled
                                        className="transition-colors text-white font-bold text-sm px-4 py-2 rounded-lg shadow-sm bg-emerald-500 cursor-default">
                                        Applied ✔
                                    </button>
                                    <button
                                        onClick={() => handleRemoveDeal(3)}
                                        className="transition-colors text-slate-500 hover:text-red-500 hover:bg-red-50 text-xs font-bold px-3 py-2 rounded-lg border border-slate-200 cursor-pointer">
                                        Remove
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => handleApplyDeal(3, 8)}
                                    className="transition-colors text-white font-bold text-sm px-4 py-2 rounded-lg shadow-sm bg-brand-orange hover:bg-brand-orange-dark cursor-pointer">
                                    Select Now
                                </button>
                            )}
                        </div>
                    </div>
                    {/* Deal 3 */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h3 className="font-bold text-slate-800 text-base leading-tight">Buy 10 • Save 10%</h3>
                            <p className="text-slate-500 text-xs">Perfect for gifting</p>
                        </div>
                        <div className="flex gap-2">
                            {isApplied(10) ? (
                                <>
                                    <button
                                        disabled
                                        className="transition-colors text-white font-bold text-sm px-4 py-2 rounded-lg shadow-sm bg-emerald-500 cursor-default">
                                        Applied ✔
                                    </button>
                                    <button
                                        onClick={() => handleRemoveDeal(10)}
                                        className="transition-colors text-slate-500 hover:text-red-500 hover:bg-red-50 text-xs font-bold px-3 py-2 rounded-lg border border-slate-200 cursor-pointer">
                                        Remove
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => handleApplyDeal(10, 10)}
                                    className="transition-colors text-white font-bold text-sm px-4 py-2 rounded-lg shadow-sm bg-brand-orange hover:bg-brand-orange-dark cursor-pointer">
                                    Select Now
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <div className="bg-slate-200/60 p-3 text-center">
                    <p className="text-slate-700 font-medium text-xs">Discount auto-applied at checkout</p>
                </div>
            </div>

            {/* Bulk Pricing Banner */}
            <div className="bg-gradient-to-br from-brand-orange/5 to-brand-orange/10 p-4 md:p-5 relative overflow-hidden border-t md:border-t-0 md:border-l border-brand-orange/20 flex-1 flex flex-col justify-center">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-orange/20 rounded-full blur-2xl opacity-60"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-brand-orange/20 rounded-full blur-2xl opacity-60"></div>

                <div className="relative z-10 flex flex-col items-start gap-4">
                    <span className="inline-block bg-brand-orange text-white text-[10px] font-bold px-3 py-1 tracking-wider">
                        SPECIAL OFFER
                    </span>

                    <div className="flex gap-4">

                        <div>
                            <h3 className="text-xl md:text-2xl font-black text-brand-blue-dark leading-tight mb-2">
                                Looking for Bulk Pricing (30+ Qty)?
                            </h3>
                            <p className="text-brand-blue text-sm font-medium">
                                Get exclusive deals & priority support for large orders
                            </p>
                        </div>
                    </div>

                    <Link
                        href="https://wa.me/917012147575?text=I'm%20interested%20in%20bulk%20pricing"
                        target="_blank"
                        className="w-52 mt-2 self-end bg-emerald-500 hover:bg-emerald-600 transition-colors text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
                    >
                        {/* Custom WhatsApp Icon SVG */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <path d="M12.002 0h-.005A11.967 11.967 0 000 11.963c0 2.115.548 4.148 1.587 5.952L.15 23.366l5.589-1.465a11.93 11.93 0 006.262 1.761h.006A11.969 11.969 0 0024 11.965C24 5.367 18.625 0 12.002 0zm0 21.666h-.004a9.927 9.927 0 01-5.068-1.385l-.364-.216-3.766.987.997-3.674-.236-.376a9.92 9.92 0 01-1.52-5.337C2.04 6.223 6.49 1.77 12.002 1.77c5.511 0 9.96 4.453 9.96 9.965 0 5.512-4.449 9.931-9.96 9.931z" />
                            <path d="M17.472 14.18c-.3-.151-1.774-.876-2.048-.976-.275-.101-.475-.152-.676.151-.2.302-.774.976-.949 1.177-.175.201-.35.226-.65.075-1.127-.565-2.073-1.077-2.871-2.457-.2-.347.2-.321.493-.907.1-.199.05-.375-.025-.525-.075-.151-.676-1.63-.925-2.23-.243-.587-.49-.508-.676-.517-.175-.008-.375-.008-.575-.008-.2 0-.525.075-.8.375-.275.301-1.05 1.026-1.05 2.5s1.075 2.89 1.225 3.09c.15.201 2.1 3.208 5.088 4.498.711.308 1.266.492 1.698.63.714.227 1.365.195 1.879.118.577-.087 1.774-.726 2.024-1.428.25-.701.25-1.302.175-1.428-.075-.126-.275-.201-.575-.351z" />
                        </svg>
                        Contact Us
                    </Link>
                </div>
            </div>
        </div>
    );
}
