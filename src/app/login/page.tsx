"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Mail, Lock, Chrome, User } from "lucide-react";
import { signInWithGoogle, signInWithEmail, registerWithEmail } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function LoginPage() {
    const router = useRouter();
    const [mode, setMode] = useState<"login" | "register">("register");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const cleanError = (msg: string) =>
        msg.replace("Firebase: ", "").replace(/\(auth\/.*?\)\.?/, "").trim();

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (mode === "register" && !name.trim()) {
            setError("Please enter your full name.");
            return;
        }

        setLoading(true);
        try {
            if (mode === "register") {
                // 1. Create Firebase Auth account with display name
                const credential = await registerWithEmail(name.trim(), email, password);
                // 2. Save user profile to Firestore
                await setDoc(doc(db, "users", credential.user.uid, "profile", "info"), {
                    name: name.trim(),
                    email,
                    createdAt: new Date().toISOString(),
                });
            } else {
                await signInWithEmail(email, password);
            }
            router.push("/safety");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Authentication failed";
            setError(cleanError(msg));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        setError("");
        setLoading(true);
        try {
            const result = await signInWithGoogle();
            // Save Google user profile to Firestore if new
            await setDoc(
                doc(db, "users", result.user.uid, "profile", "info"),
                {
                    name: result.user.displayName ?? "",
                    email: result.user.email ?? "",
                    createdAt: new Date().toISOString(),
                },
                { merge: true }
            );
            router.push("/safety");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Google sign-in failed";
            setError(cleanError(msg));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-fuchsia-950 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-fuchsia-500/20 border border-fuchsia-400/30 mb-4">
                        <ShieldCheck className="w-8 h-8 text-fuchsia-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">SHE360+</h1>
                    <p className="text-slate-400 mt-1 text-sm">Risk Intelligence & Safety Platform</p>
                </div>

                {/* Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">

                    {/* Tab switcher */}
                    <div className="flex rounded-xl bg-white/5 p-1 mb-6">
                        {(["register", "login"] as const).map(m => (
                            <button
                                key={m}
                                onClick={() => { setMode(m); setError(""); }}
                                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === m
                                        ? "bg-fuchsia-500 text-white shadow"
                                        : "text-slate-400 hover:text-white"
                                    }`}
                            >
                                {m === "register" ? "Create Account" : "Sign In"}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleEmailAuth} className="space-y-4">

                        {/* Name — only on register */}
                        {mode === "register" && (
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Full name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                    autoFocus
                                    className="w-full bg-white/10 border border-white/10 text-white placeholder-slate-400 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-fuchsia-400 transition"
                                />
                            </div>
                        )}

                        {/* Email */}
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                className="w-full bg-white/10 border border-white/10 text-white placeholder-slate-400 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-fuchsia-400 transition"
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="password"
                                placeholder={mode === "register" ? "Password (min 6 characters)" : "Password"}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full bg-white/10 border border-white/10 text-white placeholder-slate-400 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-fuchsia-400 transition"
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <p className="text-rose-400 text-xs bg-rose-500/10 border border-rose-400/20 rounded-lg px-3 py-2">
                                ⚠️ {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-fuchsia-500 hover:bg-fuchsia-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-fuchsia-500/25"
                        >
                            {loading
                                ? "Please wait..."
                                : mode === "register"
                                    ? "Create Account & Continue"
                                    : "Sign In"}
                        </button>
                    </form>

                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-slate-500 text-xs">or</span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    <button
                        onClick={handleGoogle}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium py-3 rounded-xl transition"
                    >
                        <Chrome className="w-4 h-4" />
                        Continue with Google
                    </button>
                </div>

                <p className="text-center text-slate-500 text-xs mt-6">
                    Your data is encrypted and stored securely.
                </p>
            </div>
        </div>
    );
}
