import React from "react";

interface StatsCardProps {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
    className?: string;
}

export default function StatsCard({ label, value, icon, className = "" }: StatsCardProps) {
    return (
        <div className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between ${className}`}>
            <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{label}</h4>
                <div className="text-3xl font-black text-slate-900">{value}</div>
            </div>
            {icon && (
                <div className="w-12 h-12 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue shadow-sm">
                    {icon}
                </div>
            )}
        </div>
    );
}
