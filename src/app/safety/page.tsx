"use client";
import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { ShieldAlert, Phone, MapPin, Users, CheckCircle, AlertTriangle, Navigation } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getSosContacts, saveSosContact, sendSosAlert, type SosContact } from "@/lib/firestore";

const MapWidget = dynamic(() => import("@/components/MapWidget"), { ssr: false });

const RISK_ZONES = [
    { id: "z1", position: [28.6139, 77.209] as [number, number], title: "⚠️ High Risk Zone", description: "Multiple incidents reported. Avoid after dark." },
    { id: "z2", position: [28.6229, 77.218] as [number, number], title: "⚠️ Moderate Risk", description: "Poor lighting reported." },
    { id: "z3", position: [28.605, 77.199] as [number, number], title: "✅ Safe Zone", description: "Well-lit, active foot traffic." },
];

const SAFE_ROUTES = [
    { label: "Route A – Well-lit main road", time: "12 min", safe: true },
    { label: "Route B – Police patrol zone", time: "15 min", safe: true },
    { label: "Route C – Shorter but isolated", time: "8 min", safe: false },
];

export default function SafetyPage() {
    const { user } = useAuth();
    const [contacts, setContacts] = useState<SosContact[]>([]);
    const [newContact, setNewContact] = useState({ name: "", phone: "", relation: "" });
    const [sosSent, setSosSent] = useState(false);
    const [addingContact, setAddingContact] = useState(false);
    const [saving, setSaving] = useState(false);

    const loadContacts = useCallback(async () => {
        if (!user) return;
        const data = await getSosContacts(user.uid);
        setContacts(data);
    }, [user]);

    useEffect(() => { loadContacts(); }, [loadContacts]);

    const handleSOS = async () => {
        if (!user) return;
        await sendSosAlert(user.uid, {
            type: "SOS",
            message: "🚨 SOS triggered from SHE360+ Safety Intelligence module.",
            contacts: contacts.map(c => c.phone),
        });
        setSosSent(true);
        setTimeout(() => setSosSent(false), 5000);
    };

    const handleSaveContact = async () => {
        if (!user || !newContact.name || !newContact.phone) return;
        setSaving(true);
        await saveSosContact(user.uid, newContact);
        setNewContact({ name: "", phone: "", relation: "" });
        setAddingContact(false);
        await loadContacts();
        setSaving(false);
    };

    return (
        <div className="space-y-6 pb-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <ShieldAlert className="w-6 h-6 text-indigo-500" /> Safety Intelligence
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">GPS risk mapping · Safe routes · SOS alerts</p>
                </div>
                <button
                    onClick={handleSOS}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg transition-all ${sosSent
                            ? "bg-emerald-500 text-white shadow-emerald-500/30"
                            : "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30 animate-pulse"
                        }`}
                >
                    {sosSent ? <><CheckCircle className="w-5 h-5" /> SOS Sent!</> : <><AlertTriangle className="w-5 h-5" /> 🚨 SOS</>}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Map */}
                <div className="lg:col-span-2">
                    <MapWidget
                        title="Area Risk Map – New Delhi (Demo)"
                        center={[28.6139, 77.209]}
                        zoom={14}
                        markers={RISK_ZONES}
                    />
                </div>

                {/* Safe Routes */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h2 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
                        <Navigation className="w-5 h-5 text-indigo-400" /> Safe Route Suggestions
                    </h2>
                    <div className="space-y-3">
                        {SAFE_ROUTES.map((route, i) => (
                            <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${route.safe ? "bg-emerald-50 border-emerald-100" : "bg-rose-50 border-rose-100"}`}>
                                <div>
                                    <p className={`font-medium text-sm ${route.safe ? "text-emerald-800" : "text-rose-800"}`}>{route.label}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{route.time} walk</p>
                                </div>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${route.safe ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                                    {route.safe ? "✅ Safe" : "⚠️ Avoid"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Crowd Alerts */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h2 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
                        <MapPin className="w-5 h-5 text-rose-400" /> Live Risk Alerts
                    </h2>
                    <div className="space-y-3">
                        {[
                            { area: "Connaught Place", level: "High", detail: "Overcrowded, poor visibility" },
                            { area: "Lajpat Nagar Market", level: "Moderate", detail: "Busy – stay alert" },
                            { area: "Lodhi Garden", level: "Low", detail: "Safe, patrolled area" },
                        ].map((alert, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <div>
                                    <p className="font-medium text-sm text-slate-800">{alert.area}</p>
                                    <p className="text-xs text-slate-500">{alert.detail}</p>
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${alert.level === "High" ? "bg-rose-100 text-rose-700" :
                                        alert.level === "Moderate" ? "bg-amber-100 text-amber-700" :
                                            "bg-emerald-100 text-emerald-700"
                                    }`}>{alert.level}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SOS Contacts */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                            <Users className="w-5 h-5 text-fuchsia-400" /> Trusted SOS Contacts
                            {!user && <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Sign in to save contacts</span>}
                        </h2>
                        {user && (
                            <button
                                onClick={() => setAddingContact(true)}
                                className="text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium px-3 py-1.5 rounded-lg transition"
                            >
                                + Add Contact
                            </button>
                        )}
                    </div>

                    {addingContact && (
                        <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100 grid grid-cols-3 gap-3">
                            <input placeholder="Name" value={newContact.name} onChange={e => setNewContact(p => ({ ...p, name: e.target.value }))}
                                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400" />
                            <input placeholder="Phone" value={newContact.phone} onChange={e => setNewContact(p => ({ ...p, phone: e.target.value }))}
                                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400" />
                            <input placeholder="Relation" value={newContact.relation} onChange={e => setNewContact(p => ({ ...p, relation: e.target.value }))}
                                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400" />
                            <div className="col-span-3 flex gap-2">
                                <button onClick={handleSaveContact} disabled={saving}
                                    className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition">
                                    {saving ? "Saving..." : "Save Contact"}
                                </button>
                                <button onClick={() => setAddingContact(false)} className="text-sm text-slate-500 hover:text-slate-700 px-4 py-2">Cancel</button>
                            </div>
                        </div>
                    )}

                    {contacts.length === 0 ? (
                        <div className="text-center py-8 text-slate-400">
                            <Phone className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            <p className="text-sm">{user ? "No contacts added yet. Add trusted contacts for SOS alerts." : "Sign in to manage your SOS contacts."}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {contacts.map(c => (
                                <div key={c.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="w-10 h-10 rounded-full bg-fuchsia-100 flex items-center justify-center text-fuchsia-700 font-bold text-sm">
                                        {c.name[0]?.toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm text-slate-800">{c.name}</p>
                                        <p className="text-xs text-slate-500">{c.phone} · {c.relation}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}