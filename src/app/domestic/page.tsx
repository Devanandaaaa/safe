"use client";
import { useState, useEffect, useCallback } from "react";
import { Shield, AlertTriangle, Phone, BookOpen, Users, CheckCircle, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { saveDomesticEntry, getDomesticEntries, type DomesticEntry } from "@/lib/firestore";

const SECTIONS = [
    {
        key: "isolationScore",
        label: "Isolation",
        icon: Users,
        color: "rose",
        questions: [
            "Are you frequently prevented from seeing friends or family?",
            "Do you feel monitored when communicating with others?",
            "Has your partner limited your access to phone/internet?",
            "Do you feel alone in dealing with problems?",
        ],
    },
    {
        key: "aggressionScore",
        label: "Aggression / Control",
        icon: AlertTriangle,
        color: "orange",
        questions: [
            "Have you experienced physical force or intimidation?",
            "Are you frequently criticized, humiliated, or belittled?",
            "Do you feel afraid of your partner's anger?",
            "Has property been damaged during arguments?",
        ],
    },
    {
        key: "monitoringScore",
        label: "Surveillance / Monitoring",
        icon: Lock,
        color: "amber",
        questions: [
            "Are your calls, messages, or location tracked without consent?",
            "Do you have to report your whereabouts constantly?",
            "Are your finances controlled by someone else?",
            "Are your personal decisions overridden regularly?",
        ],
    },
    {
        key: "threatScore",
        label: "Threats / Escalation",
        icon: Shield,
        color: "red",
        questions: [
            "Have you received direct threats of harm?",
            "Are threats made regarding children or loved ones?",
            "Has violence escalated in frequency or severity?",
            "Do you feel unsafe in your own home?",
        ],
    },
];

function getRiskLevel(score: number): DomesticEntry["riskLevel"] {
    if (score <= 3) return "Low";
    if (score <= 7) return "Moderate";
    if (score <= 11) return "High";
    return "Critical";
}

const EMERGENCY_PLAN = [
    { step: "1", action: "Memorize key phone numbers (police: 112, women helpline: 181)" },
    { step: "2", action: "Keep important documents (ID, bank cards) accessible" },
    { step: "3", action: "Identify a trusted person who you can call day or night" },
    { step: "4", action: "Know the nearest shelter / safe place in your area" },
    { step: "5", action: "Have a packed bag ready if you need to leave quickly" },
];

export default function DomesticPage() {
    const { user } = useAuth();
    const [scores, setScores] = useState({ isolationScore: 0, aggressionScore: 0, monitoringScore: 0, threatScore: 0 });
    const [answers, setAnswers] = useState<Record<string, boolean[]>>({
        isolationScore: [false, false, false, false],
        aggressionScore: [false, false, false, false],
        monitoringScore: [false, false, false, false],
        threatScore: [false, false, false, false],
    });
    const [notes, setNotes] = useState("");
    const [history, setHistory] = useState<DomesticEntry[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [saving, setSaving] = useState(false);

    const loadHistory = useCallback(async () => {
        if (!user) return;
        const data = await getDomesticEntries(user.uid);
        setHistory(data);
    }, [user]);

    useEffect(() => { loadHistory(); }, [loadHistory]);

    const toggleAnswer = (sectionKey: string, idx: number) => {
        const newAnswers = { ...answers, [sectionKey]: answers[sectionKey].map((v, i) => i === idx ? !v : v) };
        setAnswers(newAnswers);
        const newScore = newAnswers[sectionKey].filter(Boolean).length;
        setScores(prev => ({ ...prev, [sectionKey]: newScore }));
    };

    const totalScore = scores.isolationScore + scores.aggressionScore + scores.monitoringScore + scores.threatScore;
    const riskLevel = getRiskLevel(totalScore);
    const riskColor = { Low: "emerald", Moderate: "amber", High: "orange", Critical: "rose" }[riskLevel];

    const handleSubmit = async () => {
        if (!user) return;
        setSaving(true);
        await saveDomesticEntry(user.uid, {
            date: new Date().toISOString().split("T")[0],
            ...scores,
            riskLevel,
            totalScore,
            notes,
        });
        await loadHistory();
        setSubmitted(true);
        setSaving(false);
        setTimeout(() => setSubmitted(false), 4000);
    };

    return (
        <div className="space-y-6 pb-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Shield className="w-6 h-6 text-rose-500" /> Domestic Risk Detector
                </h1>
                <p className="text-slate-500 text-sm mt-1">Pattern-based risk scoring · Emergency planning · Discreet support</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Assessment */}
                <div className="lg:col-span-2 space-y-4">
                    {SECTIONS.map(section => (
                        <div key={section.key} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                            <h2 className={`font-semibold text-slate-800 flex items-center gap-2 mb-4`}>
                                <section.icon className={`w-5 h-5 text-${section.color}-500`} />
                                {section.label}
                                <span className={`ml-auto text-sm font-bold text-${section.color}-600 bg-${section.color}-50 px-2 py-0.5 rounded-full`}>
                                    {scores[section.key as keyof typeof scores]}/4
                                </span>
                            </h2>
                            <div className="space-y-2">
                                {section.questions.map((q, i) => (
                                    <label key={i} className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all border ${answers[section.key][i]
                                            ? `bg-${section.color}-50 border-${section.color}-200`
                                            : "bg-slate-50 border-transparent hover:bg-slate-100"
                                        }`}>
                                        <input
                                            type="checkbox"
                                            checked={answers[section.key][i]}
                                            onChange={() => toggleAnswer(section.key, i)}
                                            className={`mt-0.5 accent-rose-500`}
                                        />
                                        <span className="text-sm text-slate-700">{q}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Additional notes (stored securely)</label>
                        <textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="Describe any specific incidents or concerns..."
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm h-24 resize-none focus:outline-none focus:border-rose-400"
                        />
                        {user ? (
                            <button
                                onClick={handleSubmit}
                                disabled={saving}
                                className="mt-3 w-full bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition"
                            >
                                {submitted
                                    ? <span className="flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4" /> Assessment Saved</span>
                                    : saving ? "Saving..." : "Save Assessment"}
                            </button>
                        ) : (
                            <p className="mt-3 text-center text-amber-700 bg-amber-50 rounded-xl py-3 text-sm font-medium">Sign in to save your assessment securely</p>
                        )}
                    </div>
                </div>

                {/* Right panel */}
                <div className="space-y-4">
                    {/* Risk Score */}
                    <div className={`bg-${riskColor}-50 border border-${riskColor}-200 rounded-2xl p-5`}>
                        <h2 className={`font-semibold text-${riskColor}-800 mb-3`}>Risk Assessment</h2>
                        <div className={`text-5xl font-black text-${riskColor}-600 mb-1`}>{totalScore}<span className="text-2xl font-normal text-${riskColor}-400">/16</span></div>
                        <div className={`text-lg font-bold text-${riskColor}-700`}>{riskLevel} Risk</div>
                        <div className="mt-3 h-2 bg-white/60 rounded-full overflow-hidden">
                            <div className={`h-full bg-${riskColor}-500 rounded-full transition-all duration-500`}
                                style={{ width: `${(totalScore / 16) * 100}%` }} />
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                            {SECTIONS.map(s => (
                                <div key={s.key} className={`bg-white/70 rounded-lg p-2`}>
                                    <p className="text-slate-500">{s.label}</p>
                                    <p className={`font-bold text-${s.color}-600`}>{scores[s.key as keyof typeof scores]}/4</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* History */}
                    {history.length > 0 && (
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                            <h2 className="font-semibold text-slate-800 mb-3">Recent Assessments</h2>
                            <div className="space-y-2">
                                {history.slice(0, 5).map((h, i) => (
                                    <div key={i} className="flex items-center justify-between text-sm">
                                        <span className="text-slate-500">{h.date}</span>
                                        <span className={`font-bold px-2 py-0.5 rounded-full text-xs ${h.riskLevel === "Critical" ? "bg-rose-100 text-rose-700" :
                                                h.riskLevel === "High" ? "bg-orange-100 text-orange-700" :
                                                    h.riskLevel === "Moderate" ? "bg-amber-100 text-amber-700" :
                                                        "bg-emerald-100 text-emerald-700"
                                            }`}>{h.riskLevel} ({h.totalScore})</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Emergency Plan */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <h2 className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
                            <BookOpen className="w-4 h-4 text-rose-400" /> Emergency Plan
                        </h2>
                        <div className="space-y-2">
                            {EMERGENCY_PLAN.map(item => (
                                <div key={item.step} className="flex items-start gap-3 text-sm text-slate-600">
                                    <span className="flex-shrink-0 w-5 h-5 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center text-xs font-bold">{item.step}</span>
                                    {item.action}
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-2">
                            <a href="tel:112" className="flex items-center gap-1 bg-rose-600 text-white text-xs font-semibold px-3 py-2 rounded-xl justify-center hover:bg-rose-700 transition">
                                <Phone className="w-3 h-3" /> Police: 112
                            </a>
                            <a href="tel:181" className="flex items-center gap-1 bg-fuchsia-600 text-white text-xs font-semibold px-3 py-2 rounded-xl justify-center hover:bg-fuchsia-700 transition">
                                <Phone className="w-3 h-3" /> Women: 181
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}