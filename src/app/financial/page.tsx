"use client";
import { useState, useEffect, useCallback } from "react";
import { TrendingUp, DollarSign, PiggyBank, AlertCircle, Lightbulb, CheckCircle } from "lucide-react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS, CategoryScale, LinearScale,
    BarElement, Title, Tooltip, Legend
} from "chart.js";
import { useAuth } from "@/context/AuthContext";
import { saveFinancialEntry, getFinancialEntries, type FinancialEntry } from "@/lib/firestore";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function computeDependency(income: number, savings: number, emergencyFund: number, hasOwnAccount: boolean): number {
    let score = 100;
    if (income > 0) score -= 30;
    if (savings > 0) score -= 20;
    if (emergencyFund >= 3) score -= 20; // 3+ months
    if (hasOwnAccount) score -= 15;
    if (income > 20000) score -= 15;
    return Math.max(0, Math.min(100, score));
}

const SUGGESTIONS = [
    { trigger: (e: FinancialEntry) => !e.hasOwnAccount, text: "Open a personal bank account in your name — this is a foundational step toward financial independence." },
    { trigger: (e: FinancialEntry) => e.savings < e.income * 0.1, text: "Aim to save at least 10% of your income each month, even if it's a small amount initially." },
    { trigger: (e: FinancialEntry) => e.emergencyFund < 3, text: "Build an emergency fund covering at least 3 months of expenses for financial security." },
    { trigger: (e: FinancialEntry) => e.income === 0, text: "Explore income-generating skills through free platforms like Coursera, NSDC, or Google Digital Garage." },
    { trigger: (e: FinancialEntry) => e.expenses > e.income * 0.8, text: "Your expenses are over 80% of income. Review and reduce non-essential spending." },
];

export default function FinancialPage() {
    const { user } = useAuth();
    const [form, setForm] = useState({
        income: 0, expenses: 0, savings: 0, emergencyFund: 0, hasOwnAccount: false,
    });
    const [month] = useState(new Date().toISOString().slice(0, 7));
    const [history, setHistory] = useState<FinancialEntry[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [saving, setSaving] = useState(false);

    const loadHistory = useCallback(async () => {
        if (!user) return;
        const data = await getFinancialEntries(user.uid);
        setHistory(data);
    }, [user]);

    useEffect(() => { loadHistory(); }, [loadHistory]);

    const dependency = computeDependency(form.income, form.savings, form.emergencyFund, form.hasOwnAccount);
    const vulnLevel = dependency < 25 ? "Strong" : dependency < 50 ? "Moderate" : dependency < 75 ? "Vulnerable" : "High Risk";
    const vulnColor = { Strong: "emerald", Moderate: "amber", Vulnerable: "orange", "High Risk": "rose" }[vulnLevel];

    const currentEntry: FinancialEntry = {
        userId: user?.uid ?? "",
        month,
        financialDependency: dependency,
        ...form,
    };

    const activeSuggestions = SUGGESTIONS.filter(s => s.trigger(currentEntry));

    const handleSubmit = async () => {
        if (!user) return;
        setSaving(true);
        await saveFinancialEntry(user.uid, { month, ...form, financialDependency: dependency });
        await loadHistory();
        setSubmitted(true);
        setSaving(false);
        setTimeout(() => setSubmitted(false), 4000);
    };

    const last6 = history.slice(0, 6).reverse();
    const barData = {
        labels: last6.map(h => h.month?.slice(5) ?? ""),
        datasets: [
            { label: "Income", data: last6.map(h => h.income), backgroundColor: "rgba(16,185,129,0.7)", borderRadius: 6 },
            { label: "Expenses", data: last6.map(h => h.expenses), backgroundColor: "rgba(239,68,68,0.7)", borderRadius: 6 },
            { label: "Savings", data: last6.map(h => h.savings), backgroundColor: "rgba(139,92,246,0.7)", borderRadius: 6 },
        ],
    };

    const numField = (label: string, key: keyof typeof form, icon: React.ReactNode) => (
        <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1.5">{icon}{label}</label>
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                <input
                    type="number" min={0}
                    value={form[key] as number || ""}
                    onChange={e => setForm(p => ({ ...p, [key]: Number(e.target.value) }))}
                    placeholder="0"
                    className="w-full border border-slate-200 rounded-xl pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:border-purple-400"
                />
            </div>
        </div>
    );

    return (
        <div className="space-y-6 pb-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-emerald-500" /> Financial Autonomy Monitor
                </h1>
                <p className="text-slate-500 text-sm mt-1">Finance tracking · Independence scoring · Personalized insights</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Form */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                    <h2 className="font-semibold text-slate-800">Monthly Finance Entry — {month}</h2>

                    {numField("Monthly Income", "income", <DollarSign className="w-4 h-4 text-emerald-500" />)}
                    {numField("Monthly Expenses", "expenses", <AlertCircle className="w-4 h-4 text-rose-500" />)}
                    {numField("Monthly Savings", "savings", <PiggyBank className="w-4 h-4 text-purple-500" />)}

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1.5">
                            <PiggyBank className="w-4 h-4 text-amber-500" /> Emergency Fund (months covered)
                        </label>
                        <input
                            type="number" min={0} max={24}
                            value={form.emergencyFund || ""}
                            onChange={e => setForm(p => ({ ...p, emergencyFund: Number(e.target.value) }))}
                            placeholder="0"
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400"
                        />
                    </div>

                    <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition">
                        <input
                            type="checkbox"
                            checked={form.hasOwnAccount}
                            onChange={e => setForm(p => ({ ...p, hasOwnAccount: e.target.checked }))}
                            className="accent-emerald-500"
                        />
                        <span className="text-sm text-slate-700">I have my own personal bank account</span>
                    </label>

                    {/* Score preview */}
                    <div className={`bg-${vulnColor}-50 border border-${vulnColor}-100 rounded-xl p-4`}>
                        <div className="flex items-center justify-between">
                            <span className={`text-sm font-semibold text-${vulnColor}-700`}>Dependency Score</span>
                            <span className={`text-2xl font-black text-${vulnColor}-600`}>{dependency}%</span>
                        </div>
                        <div className="mt-2 h-2 bg-white/60 rounded-full overflow-hidden">
                            <div className={`h-full bg-${vulnColor}-500 rounded-full transition-all`} style={{ width: `${dependency}%` }} />
                        </div>
                        <p className={`text-xs mt-1 text-${vulnColor}-600`}>{vulnLevel} — {dependency < 50 ? "Good financial footing" : "Action recommended"}</p>
                    </div>

                    {user ? (
                        <button
                            onClick={handleSubmit}
                            disabled={saving}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition"
                        >
                            {submitted
                                ? <span className="flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4" /> Saved!</span>
                                : saving ? "Saving..." : "Save Entry"}
                        </button>
                    ) : (
                        <p className="text-center text-amber-700 bg-amber-50 rounded-xl py-3 text-sm font-medium">Sign in to track your finances</p>
                    )}
                </div>

                {/* Right column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Chart */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <h2 className="font-semibold text-slate-800 mb-4">Income vs Expenses vs Savings</h2>
                        {last6.length > 0 ? (
                            <Bar
                                data={barData}
                                options={{
                                    responsive: true,
                                    plugins: { legend: { position: "bottom" } },
                                    scales: {
                                        y: { grid: { color: "#f1f5f9" } },
                                        x: { grid: { display: false } },
                                    },
                                }}
                            />
                        ) : (
                            <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
                                Add monthly entries to see your financial trends
                            </div>
                        )}
                    </div>

                    {/* Suggestions */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <h2 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
                            <Lightbulb className="w-5 h-5 text-amber-400" /> Personalized Insights
                        </h2>
                        {activeSuggestions.length === 0 ? (
                            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                <p className="text-sm text-emerald-700 font-medium">Great financial health! Keep maintaining your habits.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {activeSuggestions.map((s, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                                        <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-amber-800">{s.text}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* History table */}
                    {history.length > 0 && (
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                            <h2 className="font-semibold text-slate-800 mb-4">Entry History</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-slate-400 text-xs uppercase border-b border-slate-100">
                                            <th className="text-left pb-2">Month</th>
                                            <th className="text-right pb-2">Income</th>
                                            <th className="text-right pb-2">Expenses</th>
                                            <th className="text-right pb-2">Savings</th>
                                            <th className="text-right pb-2">Dependency</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {history.map((h, i) => (
                                            <tr key={i} className="hover:bg-slate-50">
                                                <td className="py-2 font-medium text-slate-700">{h.month}</td>
                                                <td className="py-2 text-right text-emerald-600">₹{h.income?.toLocaleString()}</td>
                                                <td className="py-2 text-right text-rose-600">₹{h.expenses?.toLocaleString()}</td>
                                                <td className="py-2 text-right text-purple-600">₹{h.savings?.toLocaleString()}</td>
                                                <td className="py-2 text-right">
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${h.financialDependency < 25 ? "bg-emerald-100 text-emerald-700" :
                                                            h.financialDependency < 50 ? "bg-amber-100 text-amber-700" :
                                                                "bg-rose-100 text-rose-700"
                                                        }`}>{h.financialDependency}%</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
