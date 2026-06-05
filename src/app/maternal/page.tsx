"use client";

import { useState, useEffect, useCallback } from "react";
import { Heart, Sun, Smile, BookOpen } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { saveMaternalCheckIn, saveMoodLog, getMaternalCheckIns, type MaternalCheckIn } from "@/lib/firestore";

const MOOD_TAGS = [
    { label: "Happy", icon: "😊" }, { label: "Calm", icon: "😌" }, { label: "Tired", icon: "😴" },
    { label: "Anxious", icon: "😰" }, { label: "Overwhelmed", icon: "🌪️" }, { label: "Reflective", icon: "🤔" }
];

const CALM_VIDEOS = [
  { title: "10 Min Postpartum Meditation", url: "https://www.youtube.com/watch?v=k8vFgnZwd4U" },
  { title: "Deep Breathing for New Moms", url: "https://www.youtube.com/watch?v=F0Ldql9b3k0" },
  { title: "Gentle Postnatal Yoga", url: "https://www.youtube.com/watch?v=k3t8c4J2f0" }
];

export default function MaternalPage() {
    const { user } = useAuth();
    const [journalEntry, setJournalEntry] = useState("");
    const [mood, setMood] = useState("");
    const [saving, setSaving] = useState(false);
    const [history, setHistory] = useState<MaternalCheckIn[]>([]);

    const loadHistory = useCallback(async () => {
        if (!user) return;
        try {
            const data = await getMaternalCheckIns(user.uid);
            console.log("Fetched history:", data);
            setHistory(data);
        } catch (error) {
            console.error("Failed to load history:", error);
        }
    }, [user]);

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    const logMood = async (tag: string) => {
        if (!user) return;
        try {
            await saveMoodLog(user.uid, tag, "Real-time update");
            setMood(tag);
            alert(`Mood logged: ${tag}`);
        } catch (error) {
            console.error("Mood log failed:", error);
        }
    };

    const handleSubmit = async () => {
        if (!user) return;
        setSaving(true);
        try {
            await saveMaternalCheckIn(user.uid, {
                date: new Date().toISOString().split("T")[0],
                moodScore: 3, sleepHours: 7, anxietyScore: 2, supportScore: 4,
                productivityLog: [],
                notes: journalEntry,
                moodTag: mood || "None",
                riskScore: 30,
            });
            alert("Wellness journal saved!");
            setJournalEntry("");
            loadHistory();
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#050505] text-white p-6 lg:p-12 space-y-8">
            <h1 className="text-4xl font-extrabold flex items-center gap-4">
                <Heart className="w-10 h-10 text-[#4DEEA5]" /> Maternal Wellness Hub
            </h1>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-8">
                    {/* Mood Tracker */}
                    <section className="bg-[#111111] border border-zinc-800 rounded-3xl p-8">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Smile className="text-yellow-500" /> How is your heart feeling?</h2>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                            {MOOD_TAGS.map((m) => (
                                <button 
                                    key={m.label} 
                                    onClick={() => logMood(m.label)}
                                    className={`flex flex-col items-center p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${mood === m.label ? "bg-fuchsia-600 border-fuchsia-500 scale-105" : "bg-zinc-900 border-zinc-800 hover:border-zinc-600"}`}
                                >
                                    <span className="text-3xl mb-1">{m.icon}</span>
                                    <span className="text-xs font-bold">{m.label}</span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Daily Journal */}
                    <section className="bg-[#111111] border border-zinc-800 rounded-3xl p-8">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Sun className="text-amber-500" /> Daily Wellness Journal</h2>
                        <textarea value={journalEntry} onChange={(e) => setJournalEntry(e.target.value)} className="w-full h-32 bg-zinc-900 border border-zinc-700 rounded-xl p-4 mb-4 outline-none" placeholder="Reflect on your day..." />
                        <button onClick={handleSubmit} disabled={saving} className="w-full bg-[#088858] py-4 rounded-xl font-bold">
                            {saving ? "Saving..." : "Save Daily Log"}
                        </button>
                    </section>

                    {/* History Section */}
                    <section className="bg-[#111111] border border-zinc-800 rounded-3xl p-8">
                        <h2 className="text-xl font-bold mb-6 text-white">Previous Logs</h2>
                        <div className="space-y-4">
                            {history.length > 0 ? (
                                history.map((entry) => (
                                    <div key={entry.id} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                                        <p className="text-fuchsia-400 font-bold text-sm">{entry.date}</p>
                                        <p className="text-zinc-300 text-sm mt-1">{entry.notes}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-zinc-500 italic">No logs saved yet.</p>
                            )}
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <aside className="bg-[#111111] border border-zinc-800 rounded-3xl p-8 h-fit">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-3"><BookOpen className="text-fuchsia-500" /> Wellness Library</h2>
                    {CALM_VIDEOS.map((vid, i) => (
                        <a key={i} href={vid.url} target="_blank" className="block p-4 bg-zinc-900 mb-3 rounded-xl border border-zinc-800 hover:border-fuchsia-500 transition">
                            <p className="font-bold text-sm">{vid.title}</p>
                        </a>
                    ))}
                </aside>
            </div>
        </main>
    );
}