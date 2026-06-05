"use client";

import { useState } from "react";
import { 
  ShieldAlert, 
  Phone, 
  FileText, 
  CheckCircle, 
  LogOut, 
  AlertTriangle 
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function DomesticPage() {
  const { user } = useAuth();
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Quick exit to a neutral site
  const quickExit = () => { window.location.href = "https://weather.com"; };

  const handleReport = async () => {
    if (!user || !description) return;
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, "users", user.uid, "domestic_reports"), {
        description,
        timestamp: serverTimestamp(),
        status: "reported"
      });
      setSubmitted(true);
      setDescription("");
      setTimeout(() => setSubmitted(false), 5000);
    } catch (e) {
      console.error("Error reporting incident:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      {/* Critical Header */}
      <div className="bg-rose-950 border border-rose-800 rounded-3xl p-8 text-center shadow-2xl">
        <ShieldAlert className="w-16 h-16 text-rose-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Domestic Safety Report</h1>
        <p className="text-rose-200">Your safety is the priority. This report is stored securely.</p>
        
        <div className="mt-8 flex gap-4 justify-center">
          <a href="tel:181" className="bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2">
            <Phone className="w-5 h-5" /> Call 181 (Helpline)
          </a>
          <button onClick={quickExit} className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-8 rounded-xl">
            Quick Exit
          </button>
        </div>
      </div>

      {/* Reporting Area */}
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-rose-500" /> Incident Report
        </h2>
        
        <textarea 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the incident, location, and any immediate concerns..."
          className="w-full h-40 border border-slate-200 rounded-2xl p-4 text-slate-800 focus:outline-none focus:border-rose-400 transition"
        />

        <button 
          onClick={handleReport}
          disabled={isSubmitting || !description}
          className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {submitted ? (
            <><CheckCircle className="w-5 h-5" /> Report Logged Securely</>
          ) : (
            isSubmitting ? "Submitting..." : "Submit Confidential Report"
          )}
        </button>
      </div>

      {/* Legal & Help Info */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6">
        <h3 className="font-bold text-slate-800 mb-4">Important Information</h3>
        <ul className="space-y-3 text-sm text-slate-600">
          <li className="flex gap-2">
            <span className="text-rose-500">✔</span> You have the right to reside in the shared household (PWDVA 2005).
          </li>
          <li className="flex gap-2">
            <span className="text-rose-500">✔</span> You can file for a Protection Order to prevent further harassment.
          </li>
          <li className="flex gap-2">
            <span className="text-rose-500">✔</span> All records saved here are private and protected by security rules.
          </li>
        </ul>
      </div>
    </div>
  );
}