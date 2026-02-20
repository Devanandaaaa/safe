import React from 'react';

interface MetricCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
    trendUp?: boolean;
}

export default function MetricCard({ title, value, icon, trend, trendUp }: MetricCardProps) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 text-slate-50 opacity-50 group-hover:scale-110 transition-transform duration-500">
                <div className="w-24 h-24">{icon}</div>
            </div>
            <div className="flex justify-between items-start z-10">
                <h3 className="text-slate-500 font-medium text-sm tracking-wide uppercase">{title}</h3>
                <div className="p-2 bg-slate-50 rounded-lg text-slate-700">
                    {icon}
                </div>
            </div>
            <div className="mt-4 z-10">
                <p className="text-3xl font-bold text-slate-800">{value}</p>
                {trend && (
                    <p className={`mt-2 text-sm font-medium flex items-center gap-1 ${trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                        <span className="text-lg leading-none">{trendUp ? '↑' : '↓'}</span>
                        {trend}
                    </p>
                )}
            </div>
        </div>
    );
}
