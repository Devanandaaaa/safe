import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    addDoc,
    updateDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
    Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface SosContact {
    id?: string;
    name: string;
    phone: string;
    relation: string;
}

export interface MaternalCheckIn {
    id?: string;
    userId: string;
    date: string;
    moodScore: number;       // 1-5
    sleepHours: number;
    anxietyScore: number;    // 1-5
    supportScore: number;    // 1-5
    notes: string;
    riskScore: number;       // computed 0-100
    createdAt?: Timestamp;
}

export interface FinancialEntry {
    id?: string;
    userId: string;
    month: string;
    income: number;
    expenses: number;
    savings: number;
    emergencyFund: number;
    hasOwnAccount: boolean;
    financialDependency: number; // 0-100 lower = more independent
    createdAt?: Timestamp;
}

export interface DomesticEntry {
    id?: string;
    userId: string;
    date: string;
    isolationScore: number;   // 0-4
    aggressionScore: number;  // 0-4
    monitoringScore: number;  // 0-4
    threatScore: number;      // 0-4
    riskLevel: "Low" | "Moderate" | "High" | "Critical";
    totalScore: number;
    notes: string;
    createdAt?: Timestamp;
}

export interface SafetyAlert {
    id?: string;
    userId: string;
    type: "SOS" | "CheckIn";
    location?: { lat: number; lng: number };
    message: string;
    contacts: string[];
    createdAt?: Timestamp;
}

// ─────────────────────────────────────────────
// SOS CONTACTS
// ─────────────────────────────────────────────

export async function getSosContacts(userId: string): Promise<SosContact[]> {
    const snap = await getDocs(collection(db, "users", userId, "sosContacts"));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as SosContact));
}

export async function saveSosContact(userId: string, contact: SosContact) {
    if (contact.id) {
        await updateDoc(doc(db, "users", userId, "sosContacts", contact.id), { ...contact });
    } else {
        await addDoc(collection(db, "users", userId, "sosContacts"), contact);
    }
}

export async function sendSosAlert(userId: string, alert: Omit<SafetyAlert, "userId" | "createdAt">) {
    await addDoc(collection(db, "sosAlerts"), {
        userId,
        ...alert,
        createdAt: serverTimestamp(),
    });
}

// ─────────────────────────────────────────────
// MATERNAL RISK
// ─────────────────────────────────────────────

export async function saveMaternalCheckIn(userId: string, entry: Omit<MaternalCheckIn, "userId" | "createdAt">) {
    await addDoc(collection(db, "users", userId, "maternalCheckIns"), {
        userId,
        ...entry,
        createdAt: serverTimestamp(),
    });
}

export async function getMaternalCheckIns(userId: string): Promise<MaternalCheckIn[]> {
    const q = query(
        collection(db, "users", userId, "maternalCheckIns"),
        orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as MaternalCheckIn));
}

// ─────────────────────────────────────────────
// FINANCIAL
// ─────────────────────────────────────────────

export async function saveFinancialEntry(userId: string, entry: Omit<FinancialEntry, "userId" | "createdAt">) {
    const ref = doc(db, "users", userId, "financialEntries", entry.month);
    await setDoc(ref, { userId, ...entry, createdAt: serverTimestamp() }, { merge: true });
}

export async function getFinancialEntries(userId: string): Promise<FinancialEntry[]> {
    const q = query(
        collection(db, "users", userId, "financialEntries"),
        orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as FinancialEntry));
}

// ─────────────────────────────────────────────
// DOMESTIC RISK
// ─────────────────────────────────────────────

export async function saveDomesticEntry(userId: string, entry: Omit<DomesticEntry, "userId" | "createdAt">) {
    await addDoc(collection(db, "users", userId, "domesticEntries"), {
        userId,
        ...entry,
        createdAt: serverTimestamp(),
    });
}

export async function getDomesticEntries(userId: string): Promise<DomesticEntry[]> {
    const q = query(
        collection(db, "users", userId, "domesticEntries"),
        orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as DomesticEntry));
}
