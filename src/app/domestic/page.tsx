'use client';
import { useState } from "react";
import { AlertTriangle, Shield, Upload, Phone, X } from "lucide-react";

export default function DomesticReportPage() {
    const [submitted, setSubmitted] = useState(false);

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">

            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Support & Report</h1>
                    <p className="text-slate-500 text-sm">Your safety matters. Report discreetly.</p>
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                    <X />
                </button>
            </div>

            {/* Emergency buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button className="bg-rose-500 hover:bg-rose-600 text-white p-4 rounded-xl flex items-center gap-3 shadow">
                    <AlertTriangle /> Emergency Alert
                </button>
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-xl flex items-center gap-3 shadow">
                    <Phone /> Call Trusted Contact
                </button>
            </div>

            {/* Report form */}
            {!submitted ? (
                <div className="bg-white p-6 rounded-xl shadow space-y-4">
                    <h2 className="font-semibold text-lg flex items-center gap-2">
                        <Shield /> Submit a Report
                    </h2>

                    <select className="w-full border rounded-lg p-3">
                        <option>Select Incident Type</option>
                        <option>Physical Abuse</option>
                        <option>Emotional Abuse</option>
                        <option>Financial Control</option>
                        <option>Digital Surveillance</option>
                        <option>Threat/Intimidation</option>
                    </select>

                    <textarea
                        placeholder="Describe what happened (optional)"
                        className="w-full border rounded-lg p-3 h-28"
                    />

                    <input type="file" className="w-full border rounded-lg p-2" />

                    <button
                        onClick={() => setSubmitted(true)}
                        className="w-full bg-slate-900 text-white py-3 rounded-lg hover:bg-slate-800"
                    >
                        Submit Securely
                    </button>
                </div>
            ) : (
                <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl text-center">
                    <h3 className="font-semibold text-emerald-700">Report Sent Safely</h3>
                    <p className="text-sm text-emerald-600 mt-1">
                        Your report is stored securely and help resources are available.
                    </p>
                </div>
            )}
        </div>
    );
}