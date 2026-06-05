"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Mail, Lock, Chrome, User } from "lucide-react";
import {
    signInWithGoogle,
    signInWithEmail,
    registerWithEmail,
} from "@/lib/firebase";
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
                const credential = await registerWithEmail(
                    name.trim(),
                    email,
                    password
                );

                await setDoc(
                    doc(db, "users", credential.user.uid, "profile", "info"),
                    {
                        name: name.trim(),
                        email,
                        createdAt: new Date().toISOString(),
                    }
                );
            } else {
                await signInWithEmail(email, password);
            }

            router.push("/safety");
        } catch (err) {
            console.error("AUTH ERROR:", err);

            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Authentication failed");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        setError("");
        setLoading(true);

        try {
            const result = await signInWithGoogle();

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
        } catch (err) {
            console.error("GOOGLE AUTH ERROR:", err);

            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Google sign-in failed");
            }
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

                    <h1 className="text-3xl font-bold text-white">
                        SHE360+
                    </h1>

                    <p className="text-slate-400 mt-2 text-sm">
                        Risk Intelligence & Safety Platform
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">

                    {/* Toggle */}
                    <div className="flex rounded-xl bg-white/5 p-1 mb-6">
                        {(["register", "login"] as const).map((m) => (
                            <button
                                key={m}
                                onClick={() => {
                                    setMode(m);
                                    setError("");
                                }}
                                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                                    mode === m
                                        ? "bg-fuchsia-500 text-white"
                                        : "text-slate-400 hover:text-white"
                                }`}
                            >
                                {m === "register"
                                    ? "Create Account"
                                    : "Sign In"}
                            </button>
                        ))}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleEmailAuth} className="space-y-4">

                        {mode === "register" && (
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />

                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    className="w-full bg-white/10 border border-white/10 text-white rounded-xl pl-10 pr-4 py-3"
                                    required
                                />
                            </div>
                        )}

                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />

                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                className="w-full bg-white/10 border border-white/10 text-white rounded-xl pl-10 pr-4 py-3"
                                required
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />

                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                className="w-full bg-white/10 border border-white/10 text-white rounded-xl pl-10 pr-4 py-3"
                                minLength={6}
                                required
                            />
                        </div>

                        {error && (
                            <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white py-3 rounded-xl font-semibold"
                        >
                            {loading
                                ? "Please wait..."
                                : mode === "register"
                                ? "Create Account"
                                : "Sign In"}
                        </button>
                    </form>

                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-slate-500 text-xs">OR</span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    <button
                        onClick={handleGoogle}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl"
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