"use client";
import { useState, useEffect, useCallback } from "react";
import { Heart, TrendingUp, Brain, Moon, Users, CheckCircle } from "lucide-react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS, CategoryScale, LinearScale,
    PointElement, LineElement, Title, Tooltip, Legend, Filler
} from "chart.js";
import { useAuth } from "@/context/AuthContext";
import { saveMaternalCheckIn, getMaternalCheckIns, type MaternalCheckIn } from "@/lib/firestore";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const QUESTIONS = [
    { key: "moodScore", label: "How is your overall mood today?", icon: Heart, color: "fuchsia" },
    { key: "sleepHours", label: "How many hours did you sleep last night?", icon: Moon, color: "indigo", isNumber: true, min: 0, max: 12 },
    { key: "anxietyScore", label: "How anxious or overwhelmed are you feeling?", icon: Brain, color: "rose" },
    { key: "supportScore", label: "How supported do you feel by those around you?", icon: Users, color: "emerald" },
];

function computeRisk(mood: number, sleep: number, anxiety: number, support: number): number {
    // Higher score = higher risk
    const moodRisk = ((5 - mood) / 4) * 30;
    const sleepRisk = sleep < 5 ? 25 : sleep < 7 ? 10 : 0;
    const anxietyRisk = ((anxiety - 1) / 4) * 30;
    const supportRisk = ((5 - support) / 4) * 15;
    return Math.round(moodRisk + sleepRisk + anxietyRisk + supportRisk);
}

const RESOURCES = [
    { title: "iCall India", desc: "Free counselling helpline", link: "https://icallhelpline.org", tag: "Helpline" },
    { title: "Vandrevala Foundation", desc: "24x7 mental health support", link: "https://www.vandrevalafoundation.com", tag: "24x7" },
    { title: "NIMHANS Helpline", desc: "National mental health helpline: 080-46110007", link: "tel:08046110007", tag: "National" },
];

export default function MaternalPage() {
    const { user } = useAuth();
    const [form, setForm] = useState({ moodScore: 3, sleepHours: 7, anxietyScore: 2, supportScore: 4 });
    const [notes, setNotes] = useState("");
    const [history, setHistory] = useState<MaternalCheckIn[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [saving, setSaving] = useState(false);

    const loadHistory = useCallback(async () => {
        if (!user) return;
        const data = await getMaternalCheckIns(user.uid);
        setHistory(data);
    }, [user]);

    useEffect(() => { loadHistory(); }, [loadHistory]);

    const riskScore = computeRisk(form.moodScore, form.sleepHours, form.anxietyScore, form.supportScore);
    const riskLevel = riskScore < 25 ? "Low" : riskScore < 50 ? "Moderate" : riskScore < 75 ? "High" : "Critical";
    const riskColor = { Low: "emerald", Moderate: "amber", High: "orange", Critical: "rose" }[riskLevel];

    const handleSubmit = async () => {
        if (!user) return;
        setSaving(true);
        const entry = {
            date: new Date().toISOString().split("T")[0],
            ...form,
            notes,
            riskScore,
        };
        await saveMaternalCheckIn(user.uid, entry);
        await loadHistory();
        setSubmitted(true);
        setSaving(false);
        setTimeout(() => setSubmitted(false), 4000);
    };

    const last7 = history.slice(0, 7).reverse();
    const chartData = {
        labels: last7.map(h => h.date?.slice(5) ?? ""),
        datasets: [{
            label: "Risk Score",
            data: last7.map(h => h.riskScore),
            fill: true,
            borderColor: "#e11d48",
            backgroundColor: "rgba(225,29,72,0.08)",
            tension: 0.4,
            pointBackgroundColor: "#e11d48",
        }],
    };

    return (
        <div className="space-y-6 pb-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Heart className="w-6 h-6 text-fuchsia-500" /> Maternal Risk Radar
                </h1>
                <p className="text-slate-500 text-sm mt-1">Periodic check-ins · Risk scoring · Mental health trends</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Check-in form */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                    <h2 className="font-semibold text-slate-800">Today's Check-In</h2>

                    {QUESTIONS.map(q => (
                        <div key={q.key}>
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                                <q.icon className={`w-4 h-4 text-${q.color}-500`} />
                                {q.label}
                            </label>
                            {q.isNumber ? (
                                <div className="flex items-center gap-3">
                                    <input
                                        type="range" min={q.min} max={q.max} step={0.5}
                                        value={form[q.key as keyof typeof form]}
                                        onChange={e => setForm(p => ({ ...p, [q.key]: Number(e.target.value) }))}
                                        className="flex-1 accent-indigo-500"
                                    />
                                    <span className="font-bold text-indigo-600 w-8 text-center">{form[q.key as keyof typeof form]}h</span>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(v => (
                                        <button
                                            key={v}
                                            onClick={() => setForm(p => ({ ...p, [q.key]: v }))}
                                            className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${form[q.key as keyof typeof form] === v
                                                    ? `bg-${q.color}-500 text-white border-${q.color}-500`
                                                    : "bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-300"
                                                }`}
                                        >{v}</button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Additional Notes (optional)</label>
                        <textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="How are you feeling? Any concerns?"
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm h-24 focus:outline-none focus:border-fuchsia-400 resize-none"
                        />
                    </div>

                    {/* Risk preview */}
                    <div className={`bg-${riskColor}-50 border border-${riskColor}-100 rounded-xl p-4`}>
                        <div className="flex items-center justify-between">
                            <span className={`text-sm font-semibold text-${riskColor}-700`}>Estimated Risk Score</span>
                            <span className={`text-2xl font-bold text-${riskColor}-600`}>{riskScore}/100</span>
                        </div>
                        <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full bg-${riskColor}-500 rounded-full transition-all`}
                                style={{ width: `${riskScore}%` }}
                            />
                        </div>
                        <p className={`text-xs text-${riskColor}-600 mt-1`}>Risk Level: <strong>{riskLevel}</strong></p>
                    </div>

                    {user ? (
                        <button
                            onClick={handleSubmit}
                            disabled={saving}
                            className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition"
                        >
                            {submitted ? <span className="flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4" /> Saved!</span>
                                : saving ? "Saving..." : "Submit Check-In"}
                        </button>
                    ) : (
                        <p className="text-center text-amber-700 bg-amber-50 rounded-xl py-3 text-sm font-medium">Sign in to save your check-in data</p>
                    )}
                </div>

                {/* Right column */}
                <div className="space-y-6">
                    {/* Trend Chart */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <h2 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
                            <TrendingUp className="w-5 h-5 text-rose-400" /> Risk Trend (Last 7 Check-ins)
                        </h2>
                        {last7.length > 0 ? (
                            <Line
                                data={chartData}
                                options={{
                                    responsive: true,
                                    plugins: { legend: { display: false } },
                                    scales: {
                                        y: { min: 0, max: 100, grid: { color: "#f1f5f9" } },
                                        x: { grid: { display: false } },
                                    },
                                }}
                            />
                        ) : (
                            <div className="h-40 flex items-center justify-center text-slate-400 text-sm">
                                Complete check-ins to see your trend
                            </div>
                        )}
                    </div>

                    {/* Resources */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <h2 className="font-semibold text-slate-800 mb-4">Support Resources</h2>
                        <div className="space-y-3">
                            {RESOURCES.map((r, i) => (
                                <a key={i} href={r.link} target="_blank" rel="noreferrer"
                                    className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-fuchsia-50 border border-transparent hover:border-fuchsia-100 transition group">
                                    <div>
                                        <p className="font-medium text-sm text-slate-800 group-hover:text-fuchsia-700">{r.title}</p>
                                        <p className="text-xs text-slate-500">{r.desc}</p>
                                    </div>
                                    <span className="text-xs bg-fuchsia-100 text-fuchsia-700 px-2 py-1 rounded-full font-medium">{r.tag}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
