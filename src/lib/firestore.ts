import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// ==========================================
// MATERNAL RISK RADAR MODELS
// ==========================================

export interface MaternalCheckIn {
  id?: string;
  userId: string;
  date: string;
  moodScore: number;
  sleepHours: number;
  anxietyScore: number;
  supportScore: number;
  productivityLog: string[];
  notes?: string;
  moodTag: string;
  riskScore: number;
  createdAt?: Timestamp | null;
}

export interface MoodLog {
  id?: string;
  userId: string;
  moodTag: string;
  note?: string;
  createdAt: Timestamp;
}

// ==========================================
// DATABASE FUNCTIONS
// ==========================================

export const saveMaternalCheckIn = async (
  userId: string,
  data: Omit<MaternalCheckIn, "id" | "userId" | "createdAt">
) => {
  const ref = collection(db, "maternal_checkins");
  return addDoc(ref, { ...data, userId, createdAt: serverTimestamp() });
};

export const getMaternalCheckIns = async (userId: string, count = 7): Promise<MaternalCheckIn[]> => {
  const ref = collection(db, "maternal_checkins");
  const q = query(
    ref, 
    where("userId", "==", userId), 
    orderBy("createdAt", "desc"), // This ensures the latest entries appear first
    limit(count)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as MaternalCheckIn));
};
// NEW: Real-time Mood Log function
export const saveMoodLog = async (userId: string, moodTag: string, note?: string) => {
  const ref = collection(db, "mood_logs");
  return addDoc(ref, { 
    userId, 
    moodTag, 
    note, 
    createdAt: serverTimestamp() 
  });
};