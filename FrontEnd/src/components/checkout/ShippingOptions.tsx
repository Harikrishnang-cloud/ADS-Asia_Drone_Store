import React from 'react';
import { Truck, Clock, ShieldCheck, Loader2 } from 'lucide-react';

interface ShippingOption {
    id: string;
    name: string;
    description: string;
    price: number;
    estimatedDelivery: string;
}

interface ShippingOptionsProps {
    options: ShippingOption[];
    selectedId: string | null;
    onSelect: (option: ShippingOption) => void;
    isLoading: boolean;
}

export const ShippingOptions: React.FC<ShippingOptionsProps> = ({ 
    options, 
    selectedId, 
    onSelect, 
    isLoading 
}) => {
    if (isLoading) {
        return (
            <div className="bg-white rounded-xl p-8 border border-slate-100 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-brand-blue" size={32} />
                <p className="text-sm font-bold text-slate-500 italic">Fetching live DHL shipping rates...</p>
            </div>
        );
    }

    if (options.length === 0) {
        return (
            <div className="bg-white rounded-xl p-6 md:p-8 border border-amber-100 bg-amber-50/30 flex flex-col items-center justify-center text-center">
                <Truck className="text-amber-500 mb-4" size={32} />
                <h3 className="text-sm font-bold text-slate-900 mb-1">No DHL shipping options available</h3>
                <p className="text-xs text-slate-500 max-w-xs">Please verify your delivery address or contact support if the issue persists.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center text-sm font-bold">4</span>
                Select Delivery Method
            </h2>

            <div className="space-y-4">
                {options.map((option) => (
                    <div
                        key={option.id}
                        onClick={() => onSelect(option)}
                        className={`p-4 border-2 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                            selectedId === option.id 
                            ? 'border-brand-blue bg-brand-blue/5' 
                            : 'border-slate-50 bg-white hover:border-slate-200'
                        }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                selectedId === option.id ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-400'
                            }`}>
                                <Truck size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">{option.name}</h3>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                                        <Clock size={12} /> {option.estimatedDelivery}
                                    </span>
                                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                                        <ShieldCheck size={12} /> DHL Insured
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-black text-brand-blue-dark">₹{option.price.toLocaleString('en-IN')}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rate Includes Fuel Surcharge</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
