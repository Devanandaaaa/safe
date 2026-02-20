'use client';
import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface ChartWidgetProps {
    title: string;
    type: 'line' | 'bar' | 'doughnut';
    data: any;
    options?: any;
}

export default function ChartWidget({ title, type, data, options }: ChartWidgetProps) {
    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    font: { family: 'ui-sans-serif, system-ui, sans-serif', size: 12 },
                    color: '#64748b'
                }
            },
        },
        ...options
    };

    const renderChart = () => {
        switch (type) {
            case 'line': return <Line data={data} options={defaultOptions} />;
            case 'bar': return <Bar data={data} options={defaultOptions} />;
            case 'doughnut': return <Doughnut data={data} options={{ ...defaultOptions, maintainAspectRatio: true }} />;
            default: return null;
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-full flex flex-col">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">{title}</h3>
            <div className="flex-1 min-h-[300px] relative w-full flex justify-center">
                {renderChart()}
            </div>
        </div>
    );
}
