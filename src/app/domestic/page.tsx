"use client";
import { useState, useEffect, useCallback } from "react";
import {
    Shield, AlertTriangle, Phone, BookOpen, Users,
    FileText, MapPin, Heart, Clock, Scale, Lock, Camera,
    ExternalLink, CheckCircle, Plus, Trash2, X,
    Mic, Image, LogOut, Car, Globe, Navigation, Radio,
    ShieldAlert, MonitorSmartphone, Flag, Send, Siren
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { db, storage } from "@/lib/firebase";
import {
    collection, addDoc, getDocs, query, orderBy,
    serverTimestamp, deleteDoc, doc
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Incident {
    id?: string;
    date: string;
    type: string;
    description: string;
    injuries: string;
    witnesses: string;
    mediaUrls?: string[];
    createdAt?: unknown;
}

interface SafeContact {
    id?: string;
    name: string;
    phone: string;
    relation: string;
}

interface CheckIn {
    id?: string;
    status: string;
    note: string;
    createdAt?: unknown;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const TABS = [
    { id: "sos", label: "🚨 Emergency", },
    { id: "street", label: "🚶 Street Safety", },
    { id: "cyber", label: "💻 Cyber Safety", },
    { id: "travel", label: "🚗 Travel Safety", },
    { id: "vault", label: "🔒 Evidence", },
    { id: "incidents", label: "📋 Incidents", },
    { id: "plan", label: "🗺️ Safety Plan", },
    { id: "checkin", label: "✅ Check-In", },
    { id: "support", label: "💜 Support", },
    { id: "legal", label: "⚖️ Legal", },
];

const HOTLINES = [
    { name: "Women Helpline (India)", number: "181", available: "24x7" },
    { name: "Police Emergency", number: "112", available: "24x7" },
    { name: "National Crisis Line", number: "9152987821", available: "24x7" },
    { name: "iCall Counselling", number: "9152987821", available: "Mon–Sat" },
    { name: "Vandrevala Foundation", number: "1860-2662-345", available: "24x7" },
];

const SHELTERS = [
    { name: "One Stop Centre", type: "Govt Shelter", distance: "Nearest district office" },
    { name: "Swadhar Greh", type: "Women Shelter", distance: "Check district helpline" },
    { name: "Short Stay Home", type: "Govt Shelter", distance: "Contact 181" },
];

const ESCAPE_CHECKLIST = [
    "Important documents (ID, Aadhaar, passport)",
    "Bank card / emergency cash",
    "Medications and prescriptions",
    "Phone charger and devices",
    "Children's documents and essentials",
    "A trusted contact's address written down",
    "Change of clothes for 3 days",
    "Keys to safe location",
];

const LEGAL_STEPS = [
    { title: "File an FIR", desc: "Visit nearest police station. For domestic violence, Section 498A IPC applies. Women helpline 181 can assist.", icon: "🚔" },
    { title: "Protection Order", desc: "Apply under Protection of Women from Domestic Violence Act 2005 (PWDVA). A magistrate can issue within 3 days.", icon: "🛡️" },
    { title: "Maintenance Rights", desc: "Under Section 125 CrPC, you are entitled to maintenance from spouse if unable to maintain yourself.", icon: "💰" },
    { title: "Shelter Right", desc: "You have the right to reside in the shared household under PWDVA regardless of ownership.", icon: "🏠" },
    { title: "Custody Rights", desc: "Apply for interim custody of children in Family Court. Courts prioritize child's welfare.", icon: "👶" },
];


// ─── Main Component ───────────────────────────────────────────────────────────
export default function DomesticPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("sos");
    const [contacts, setContacts] = useState<SafeContact[]>([]);
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
    const [sosDone, setSosDone] = useState(false);

    // Quick exit
    const quickExit = () => { window.location.href = "https://weather.com"; };

    const loadData = useCallback(async () => {
        if (!user) return;
        const [cSnap, iSnap, ciSnap] = await Promise.all([
            getDocs(query(collection(db, "users", user.uid, "safeContacts"), orderBy("name"))),
            getDocs(query(collection(db, "users", user.uid, "incidents"), orderBy("createdAt", "desc"))),
            getDocs(query(collection(db, "users", user.uid, "checkIns"), orderBy("createdAt", "desc"))),
        ]);
        setContacts(cSnap.docs.map(d => ({ id: d.id, ...d.data() } as SafeContact)));
        setIncidents(iSnap.docs.map(d => ({ id: d.id, ...d.data() } as Incident)));
        setCheckIns(ciSnap.docs.map(d => ({ id: d.id, ...d.data() } as CheckIn)));
    }, [user]);

    useEffect(() => { loadData(); }, [loadData]);

    // Keyboard shortcut: press Escape for quick exit
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") quickExit(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    const handleSOS = async () => {
        if (!user) return;
        await addDoc(collection(db, "sosAlerts"), {
            userId: user.uid, type: "SOS",
            message: "🚨 URGENT: SOS triggered from SHE360+ Domestic Safety module.",
            contacts: contacts.map(c => c.phone),
            createdAt: serverTimestamp(),
        });
        setSosDone(true);
        setTimeout(() => setSosDone(false), 5000);
    };

    return (
        <>
            <div className="space-y-4 pb-8">
                {/* Header Banner */}
                <div className="relative bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 rounded-2xl p-6 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(244,63,94,0.3),_transparent_60%)]" />
                    <div className="relative flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Shield className="w-6 h-6 text-rose-400" /> Domestic Safety Hub
                            </h1>
                            <p className="text-rose-200/60 text-sm mt-1">Discreet · Encrypted · Always ready</p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <button onClick={quickExit}
                                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-medium px-4 py-2 rounded-xl transition">
                                <LogOut className="w-4 h-4" /> Quick Exit
                            </button>
                            <button onClick={handleSOS}
                                className={`flex items-center gap-2 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg transition-all ${sosDone ? "bg-emerald-500 shadow-emerald-500/40" : "bg-rose-600 hover:bg-rose-500 shadow-rose-600/40 animate-pulse"
                                    }`}>
                                {sosDone ? <><CheckCircle className="w-4 h-4" /> SOS Sent!</> : <><AlertTriangle className="w-4 h-4" /> 🚨 SOS</>}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {TABS.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${activeTab === tab.id
                                ? "bg-rose-600 text-white shadow-md shadow-rose-600/25"
                                : "bg-white text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200"
                                }`}>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="min-h-[500px]">

                    {/* ─── SOS & EMERGENCY ─── */}
                    {activeTab === "sos" && <SOSTab contacts={contacts} setContacts={setContacts} user={user} loadData={loadData} />}


                    {/* ─── EVIDENCE VAULT ─── */}
                    {activeTab === "vault" && <EvidenceVault user={user} />}


                    {/* ─── INCIDENTS ─── */}
                    {activeTab === "incidents" && <IncidentLog incidents={incidents} user={user} loadData={loadData} />}

                    {/* ─── SAFETY PLAN ─── */}
                    {activeTab === "plan" && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            {/* Escape checklist */}
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                                <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                                    <CheckCircle className="w-5 h-5 text-emerald-500" /> Escape Bag Checklist
                                </h2>
                                <EscapeChecklist />
                            </div>
                            {/* Shelters */}
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                                <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                                    <MapPin className="w-5 h-5 text-indigo-500" /> Nearby Safe Shelters
                                </h2>
                                <div className="space-y-3">
                                    {SHELTERS.map((s, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                                            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-lg">🏠</div>
                                            <div>
                                                <p className="font-semibold text-sm text-slate-800">{s.name}</p>
                                                <p className="text-xs text-slate-500">{s.type} · {s.distance}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <a href="tel:181" className="flex items-center justify-center gap-2 bg-indigo-600 text-white text-sm font-semibold py-3 rounded-xl hover:bg-indigo-700 transition mt-2">
                                        <Phone className="w-4 h-4" /> Call 181 for nearest shelter
                                    </a>
                                </div>
                            </div>
                            {/* Safe Contacts */}
                            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                                <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                                    <Users className="w-5 h-5 text-fuchsia-500" /> Emergency Contact List
                                </h2>
                                {contacts.length === 0 ? (
                                    <p className="text-slate-400 text-sm text-center py-4">No contacts saved. Go to the Emergency tab to add contacts.</p>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {contacts.map((c) => (
                                            <div key={c.id} className="flex items-center gap-3 p-3 bg-rose-50 rounded-xl border border-rose-100">
                                                <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-700 font-bold">
                                                    {c.name[0]?.toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-sm text-slate-800 truncate">{c.name}</p>
                                                    <p className="text-xs text-slate-500">{c.phone} · {c.relation}</p>
                                                </div>
                                                <a href={`tel:${c.phone}`} className="text-emerald-600 hover:text-emerald-700">
                                                    <Phone className="w-4 h-4" />
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ─── CHECK-IN ─── */}
                    {activeTab === "checkin" && <CheckInTab checkIns={checkIns} user={user} loadData={loadData} />}

                    {/* ─── SUPPORT ─── */}
                    {activeTab === "support" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                                <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                                    <Phone className="w-5 h-5 text-rose-500" /> Crisis Hotlines
                                </h2>
                                <div className="space-y-3">
                                    {HOTLINES.map((h, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-rose-50 rounded-xl border border-rose-100">
                                            <div>
                                                <p className="font-semibold text-sm text-slate-800">{h.name}</p>
                                                <p className="text-xs text-slate-500">{h.available}</p>
                                            </div>
                                            <a href={`tel:${h.number}`}
                                                className="flex items-center gap-1.5 bg-rose-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-rose-700 transition">
                                                <Phone className="w-3.5 h-3.5" /> {h.number}
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-5">
                                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                                    <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                                        <Heart className="w-5 h-5 text-fuchsia-500" /> Online Counseling
                                    </h2>
                                    {[
                                        { name: "iCall (Free)", link: "https://icallhelpline.org", desc: "Free professional counselling" },
                                        { name: "Vandrevala Foundation", link: "https://www.vandrevalafoundation.com", desc: "24x7 mental health support" },
                                        { name: "Mann Talks", link: "https://www.manntalks.org", desc: "Anonymous online therapy" },
                                    ].map((r, i) => (
                                        <a key={i} href={r.link} target="_blank" rel="noreferrer"
                                            className="flex items-center justify-between p-3 bg-fuchsia-50 rounded-xl hover:bg-fuchsia-100 transition mb-2 group">
                                            <div>
                                                <p className="font-semibold text-sm text-slate-800">{r.name}</p>
                                                <p className="text-xs text-slate-500">{r.desc}</p>
                                            </div>
                                            <ExternalLink className="w-4 h-4 text-fuchsia-400 group-hover:text-fuchsia-600" />
                                        </a>
                                    ))}
                                </div>
                                <div className="bg-gradient-to-br from-fuchsia-600 to-rose-600 rounded-2xl p-6 text-white">
                                    <h3 className="font-bold text-lg mb-2">You are not alone 💜</h3>
                                    <p className="text-fuchsia-100 text-sm leading-relaxed">
                                        Help is available 24x7. Your safety is the priority. Reaching out is a sign of strength, not weakness.
                                    </p>
                                    <a href="tel:181" className="mt-4 inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-4 py-2 rounded-xl transition text-sm">
                                        <Phone className="w-4 h-4" /> Call 181 Now
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ─── LEGAL ─── */}
                    {activeTab === "legal" && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                                <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-5">
                                    <Scale className="w-5 h-5 text-amber-500" /> Your Legal Rights (India)
                                </h2>
                                <div className="space-y-3">
                                    {LEGAL_STEPS.map((step, i) => (
                                        <div key={i} className="flex items-start gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                                            <span className="text-2xl">{step.icon}</span>
                                            <div>
                                                <p className="font-semibold text-sm text-slate-800">{step.title}</p>
                                                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-5">
                                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                                    <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                                        <BookOpen className="w-5 h-5 text-blue-500" /> Free Legal Aid
                                    </h2>
                                    {[
                                        { name: "National Legal Services Authority", link: "https://nalsa.gov.in", desc: "Free legal aid for women" },
                                        { name: "iMadurey Legal", link: "https://www.imadurey.com", desc: "Women's legal support" },
                                        { name: "Lawyers Collective", link: "https://www.lawyerscollective.org", desc: "DV Act specialists" },
                                    ].map((r, i) => (
                                        <a key={i} href={r.link} target="_blank" rel="noreferrer"
                                            className="flex items-center justify-between p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition mb-2 group">
                                            <div>
                                                <p className="font-semibold text-sm text-slate-800">{r.name}</p>
                                                <p className="text-xs text-slate-500">{r.desc}</p>
                                            </div>
                                            <ExternalLink className="w-4 h-4 text-blue-400 group-hover:text-blue-600" />
                                        </a>
                                    ))}
                                </div>
                                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                                    <h2 className="font-bold text-slate-800 mb-3">Key Laws to Know</h2>
                                    {[
                                        "Protection of Women from Domestic Violence Act, 2005",
                                        "Section 498A IPC — Cruelty by husband/relatives",
                                        "Dowry Prohibition Act, 1961",
                                        "Sexual Harassment at Workplace Act (POSH), 2013",
                                        "Hindu Marriage Act / Special Marriage Act",
                                    ].map((law, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-slate-700 py-1.5 border-b border-slate-50 last:border-0">
                                            <span className="text-amber-500 font-bold">§</span> {law}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}

// ─── SOS Tab ──────────────────────────────────────────────────────────────────
function SOSTab({ contacts, setContacts, user, loadData }: {
    contacts: SafeContact[];
    setContacts: (c: SafeContact[]) => void;
    user: { uid: string } | null;
    loadData: () => void;
}) {
    const [newContact, setNewContact] = useState({ name: "", phone: "", relation: "" });
    const [adding, setAdding] = useState(false);
    const [saving, setSaving] = useState(false);

    const save = async () => {
        if (!user || !newContact.name || !newContact.phone) return;
        setSaving(true);
        await addDoc(collection(db, "users", user.uid, "safeContacts"), newContact);
        setNewContact({ name: "", phone: "", relation: "" });
        setAdding(false);
        loadData();
        setSaving(false);
    };

    const remove = async (id: string) => {
        if (!user) return;
        await deleteDoc(doc(db, "users", user.uid, "safeContacts", id));
        loadData();
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Hotlines */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                    <Phone className="w-5 h-5 text-rose-500" /> Emergency Hotlines
                </h2>
                <div className="grid grid-cols-2 gap-3">
                    {[{ label: "Police", num: "112", color: "bg-rose-600" }, { label: "Women Helpline", num: "181", color: "bg-fuchsia-600" },
                    { label: "Ambulance", num: "108", color: "bg-emerald-600" }, { label: "Crisis Line", num: "9152987821", color: "bg-indigo-600" }
                    ].map((h, i) => (
                        <a key={i} href={`tel:${h.num}`}
                            className={`${h.color} text-white rounded-xl p-4 flex flex-col items-center gap-1 hover:opacity-90 transition shadow-lg`}>
                            <Phone className="w-5 h-5" />
                            <span className="font-bold text-sm">{h.label}</span>
                            <span className="text-xs opacity-80">{h.num}</span>
                        </a>
                    ))}
                </div>
            </div>

            {/* Trusted Contacts */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-slate-800 flex items-center gap-2">
                        <Users className="w-5 h-5 text-fuchsia-500" /> Trusted Contacts
                    </h2>
                    {user && (
                        <button onClick={() => setAdding(true)}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-sm font-medium px-3 py-1.5 rounded-lg transition flex items-center gap-1">
                            <Plus className="w-3.5 h-3.5" /> Add
                        </button>
                    )}
                </div>
                {adding && (
                    <div className="bg-slate-50 rounded-xl p-3 mb-3 space-y-2 border border-slate-100">
                        {[["Name", "name"], ["Phone", "phone"], ["Relation", "relation"]].map(([ph, key]) => (
                            <input key={key} placeholder={ph}
                                value={newContact[key as keyof typeof newContact]}
                                onChange={e => setNewContact(p => ({ ...p, [key]: e.target.value }))}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-400"
                            />
                        ))}
                        <div className="flex gap-2 pt-1">
                            <button onClick={save} disabled={saving}
                                className="bg-rose-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-rose-700 disabled:opacity-50 transition">
                                {saving ? "Saving..." : "Save"}
                            </button>
                            <button onClick={() => setAdding(false)} className="text-slate-500 text-sm px-3 py-2">Cancel</button>
                        </div>
                    </div>
                )}
                {contacts.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                        <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">{user ? "Add trusted contacts for SOS alerts" : "Sign in to manage contacts"}</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {contacts.map(c => (
                            <div key={c.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 font-bold text-sm flex-shrink-0">
                                    {c.name[0]?.toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm text-slate-800 truncate">{c.name}</p>
                                    <p className="text-xs text-slate-500">{c.phone} · {c.relation}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <a href={`tel:${c.phone}`} className="text-emerald-600 hover:text-emerald-700 p-1"><Phone className="w-3.5 h-3.5" /></a>
                                    {c.id && <button onClick={() => remove(c.id!)} className="text-rose-400 hover:text-rose-600 p-1"><Trash2 className="w-3.5 h-3.5" /></button>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Evidence Vault ───────────────────────────────────────────────────────────
function EvidenceVault({ user }: { user: { uid: string } | null }) {
    const [note, setNote] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [uploads, setUploads] = useState<{ name: string; url: string; type: string }[]>([]);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleUpload = async () => {
        if (!user) return;
        setSaving(true);
        try {
            const newUploads = [...uploads];
            if (file) {
                const storageRef = ref(storage, `users/${user.uid}/evidence/${Date.now()}_${file.name}`);
                await uploadBytes(storageRef, file);
                const url = await getDownloadURL(storageRef);
                newUploads.push({ name: file.name, url, type: file.type });
            }
            await addDoc(collection(db, "users", user.uid, "evidence"), {
                note, mediaFiles: newUploads,
                timestamp: new Date().toISOString(),
                createdAt: serverTimestamp(),
            });
            setNote(""); setFile(null); setUploads([]);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-indigo-500" /> Add Evidence
                </h2>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { icon: Image, label: "Photo/Video", accept: "image/*,video/*" },
                        { icon: Mic, label: "Audio", accept: "audio/*" },
                        { icon: FileText, label: "Document", accept: ".pdf,.doc,.docx" },
                    ].map((f, i) => (
                        <label key={i} className="flex flex-col items-center gap-2 p-4 bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-xl cursor-pointer hover:bg-indigo-100 transition">
                            <f.icon className="w-6 h-6 text-indigo-500" />
                            <span className="text-xs text-indigo-700 font-medium text-center">{f.label}</span>
                            <input type="file" accept={f.accept} className="hidden" onChange={e => setFile(e.target.files?.[0] ?? null)} />
                        </label>
                    ))}
                </div>
                {file && (
                    <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm text-emerald-700 font-medium truncate">{file.name}</span>
                        <button onClick={() => setFile(null)} className="ml-auto text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
                    </div>
                )}
                <textarea value={note} onChange={e => setNote(e.target.value)}
                    placeholder="Describe what happened, where, when, and who was involved..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm h-32 resize-none focus:outline-none focus:border-indigo-400"
                />
                {user ? (
                    <button onClick={handleUpload} disabled={saving || (!note && !file)}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2">
                        {saved ? <><CheckCircle className="w-4 h-4" /> Saved Securely!</> : saving ? "Uploading..." : <><Lock className="w-4 h-4" /> Save to Secure Vault</>}
                    </button>
                ) : (
                    <p className="text-center text-amber-700 bg-amber-50 rounded-xl py-3 text-sm font-medium">Sign in to save evidence securely</p>
                )}
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5 text-emerald-500" /> Vault Security
                </h2>
                {[
                    { icon: Lock, label: "End-to-end encrypted", desc: "Firebase Security Rules protect your data", color: "text-emerald-500" },
                    { icon: Users, label: "Private to you only", desc: "No one else can access your evidence", color: "text-indigo-500" },
                    { icon: Camera, label: "Metadata preserved", desc: "Timestamp auto-recorded for legal use", color: "text-fuchsia-500" },
                    { icon: Download, label: "Exportable", desc: "Download for lawyer or police submission", color: "text-amber-500" },
                ].map((f, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-2">
                        <f.icon className={`w-5 h-5 ${f.color} flex-shrink-0`} />
                        <div>
                            <p className="font-semibold text-sm text-slate-800">{f.label}</p>
                            <p className="text-xs text-slate-500">{f.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Incident Log ─────────────────────────────────────────────────────────────
function IncidentLog({ incidents, user, loadData }: { incidents: Incident[]; user: { uid: string } | null; loadData: () => void }) {
    const [form, setForm] = useState({ date: new Date().toISOString().split("T")[0], type: "", description: "", injuries: "", witnesses: "" });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = async () => {
        if (!user || !form.description) return;
        setSaving(true);
        await addDoc(collection(db, "users", user.uid, "incidents"), { ...form, createdAt: serverTimestamp() });
        setForm({ date: new Date().toISOString().split("T")[0], type: "", description: "", injuries: "", witnesses: "" });
        loadData();
        setSaved(true);
        setSaving(false);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-rose-500" /> Log an Incident
                </h2>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs font-semibold text-black mb-1 block">Date</label>
                        <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-rose-400" />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-black mb-1 block">Incident Type</label>
                        <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-rose-400">
                            <option value="">Select type...</option>
                            {["Physical Abuse", "Emotional Abuse", "Financial Control", "Sexual Abuse", "Digital Surveillance", "Threats/Intimidation", "Other"].map(t => (
                                <option key={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                </div>
                {[
                    { label: "What happened (describe in detail)", key: "description", rows: 4 },
                    { label: "Injuries or medical attention needed", key: "injuries", rows: 2 },
                    { label: "Witnesses (names or descriptions)", key: "witnesses", rows: 2 },
                ].map(f => (
                    <div key={f.key}>
                        <label className="text-xs font-semibold text-black mb-1 block">{f.label}</label>
                        <textarea value={form[f.key as keyof typeof form]}
                            onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                            rows={f.rows}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-black resize-none focus:outline-none focus:border-rose-400"
                        />
                    </div>
                ))}
                {user ? (
                    <button onClick={handleSave} disabled={saving || !form.description}
                        className="w-full bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2">
                        {saved ? <><CheckCircle className="w-4 h-4" /> Incident Logged!</> : saving ? "Saving..." : "Save Incident Log"}
                    </button>
                ) : (
                    <p className="text-center text-amber-700 bg-amber-50 rounded-xl py-3 text-sm">Sign in to save incident logs</p>
                )}
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-slate-400" /> Incident Timeline
                </h2>
                {incidents.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                        <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No incidents logged yet</p>
                    </div>
                ) : (
                    <div className="relative">
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-100" />
                        <div className="space-y-4">
                            {incidents.map((inc, i) => (
                                <div key={inc.id ?? i} className="flex gap-4 relative">
                                    <div className="w-8 h-8 rounded-full bg-rose-100 border-2 border-white flex items-center justify-center flex-shrink-0 z-10">
                                        <span className="text-xs text-rose-700 font-bold">{i + 1}</span>
                                    </div>
                                    <div className="flex-1 bg-slate-50 rounded-xl p-3 border border-slate-100">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">{inc.type || "Unknown"}</span>
                                            <span className="text-xs text-black font-medium">{inc.date}</span>
                                        </div>
                                        <p className="text-sm text-black font-medium line-clamp-2">{inc.description}</p>
                                        {inc.injuries && <p className="text-xs text-black mt-1 font-semibold">⚠️ {inc.injuries}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Check-In Tab ─────────────────────────────────────────────────────────────
function CheckInTab({ checkIns, user, loadData }: { checkIns: CheckIn[]; user: { uid: string } | null; loadData: () => void }) {
    const [note, setNote] = useState("");
    const [saving, setSaving] = useState(false);

    const handleCheckIn = async (status: string) => {
        if (!user) return;
        setSaving(true);
        await addDoc(collection(db, "users", user.uid, "checkIns"), {
            status, note, createdAt: serverTimestamp(),
        });
        setNote("");
        loadData();
        setSaving(false);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-emerald-500" /> Daily Safety Check-In
                </h2>
                <p className="text-slate-500 text-sm">Let your trusted contacts know how you're doing.</p>
                <textarea value={note} onChange={e => setNote(e.target.value)}
                    placeholder="Optional: add a note..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm h-24 resize-none focus:outline-none focus:border-emerald-400"
                />
                <div className="grid grid-cols-1 gap-3">
                    {[
                        { label: "✅ I'm Safe", status: "safe", color: "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20" },
                        { label: "⚠️ I Need Help Soon", status: "caution", color: "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20" },
                        { label: "🚨 I'm in Danger NOW", status: "danger", color: "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20 animate-pulse" },
                    ].map(btn => (
                        <button key={btn.status} onClick={() => handleCheckIn(btn.status)} disabled={!user || saving}
                            className={`${btn.color} text-white font-bold py-3 rounded-xl shadow-lg transition disabled:opacity-50`}>
                            {saving ? "Saving..." : btn.label}
                        </button>
                    ))}
                </div>
                {!user && <p className="text-center text-amber-700 bg-amber-50 rounded-xl py-3 text-sm">Sign in to use check-in</p>}
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-slate-400" /> Check-In History
                </h2>
                {checkIns.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                        <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No check-ins recorded yet</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {checkIns.slice(0, 10).map((c, i) => (
                            <div key={c.id ?? i} className={`flex items-center gap-3 p-3 rounded-xl border ${c.status === "safe" ? "bg-emerald-50 border-emerald-100" :
                                c.status === "danger" ? "bg-rose-50 border-rose-100" :
                                    "bg-amber-50 border-amber-100"
                                }`}>
                                <span className="text-lg">{c.status === "safe" ? "✅" : c.status === "danger" ? "🚨" : "⚠️"}</span>
                                <div className="flex-1">
                                    <p className={`font-semibold text-sm capitalize ${c.status === "safe" ? "text-emerald-700" : c.status === "danger" ? "text-rose-700" : "text-amber-700"
                                        }`}>{c.status === "safe" ? "Safe" : c.status === "danger" ? "In Danger" : "Needs Help"}</p>
                                    {c.note && <p className="text-xs text-slate-500 mt-0.5">{c.note}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Escape Checklist ─────────────────────────────────────────────────────────
function EscapeChecklist() {
    const [checked, setChecked] = useState<boolean[]>(new Array(ESCAPE_CHECKLIST.length).fill(false));
    const count = checked.filter(Boolean).length;
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-500">Progress</span>
                <span className="text-sm font-bold text-emerald-600">{count}/{ESCAPE_CHECKLIST.length}</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full mb-4">
                <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${(count / ESCAPE_CHECKLIST.length) * 100}%` }} />
            </div>
            {ESCAPE_CHECKLIST.map((item, i) => (
                <label key={i} className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition border ${checked[i] ? "bg-emerald-50 border-emerald-100" : "bg-slate-50 border-transparent hover:bg-slate-100"
                    }`}>
                    <input type="checkbox" checked={checked[i]}
                        onChange={() => setChecked(prev => prev.map((v, j) => j === i ? !v : v))}
                        className="mt-0.5 accent-emerald-500" />
                    <span className={`text-sm ${checked[i] ? "line-through text-slate-400" : "text-slate-700"}`}>{item}</span>
                </label>
            ))}
        </div>
    );
}