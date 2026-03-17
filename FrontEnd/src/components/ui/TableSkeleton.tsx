import React from "react";

interface TableSkeletonProps {
    rows?: number;
    cols?: number;
}

export default function TableSkeleton({ rows = 5, cols = 5 }: TableSkeletonProps) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            {Array(cols).fill(0).map((_, i) => (
                                <th key={i} className="px-6 py-5">
                                    <div className="h-3 w-20 bg-slate-100 rounded animate-pulse"></div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {Array(rows).fill(0).map((_, i) => (
                            <tr key={i} className="animate-pulse">
                                {Array(cols).fill(0).map((_, j) => (
                                    <td key={j} className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            {j === 0 && <div className="w-10 h-10 rounded-xl bg-slate-100"></div>}
                                            <div className="space-y-2">
                                                <div className={`h-4 ${j === 0 ? 'w-32' : 'w-24'} bg-slate-100 rounded`}></div>
                                                {j === 0 && <div className="h-3 w-40 bg-slate-100 rounded"></div>}
                                            </div>
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
