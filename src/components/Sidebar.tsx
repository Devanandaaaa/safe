"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShieldAlert, AlertTriangle, TrendingUp, ShieldCheck, Heart, LogOut, LogIn, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { logOut } from "@/lib/firebase";

const NAV_ITEMS = [
    { href: "/safety", label: "Safety Intelligence", icon: ShieldAlert, color: "text-indigo-400" },
    { href: "/maternal", label: "Maternal Risk Radar", icon: Heart, color: "text-fuchsia-400" },
    { href: "/domestic", label: "Domestic Risk Detector", icon: AlertTriangle, color: "text-rose-400" },
    { href: "/financial", label: "Financial Autonomy", icon: TrendingUp, color: "text-emerald-400" },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading } = useAuth();

    const handleLogout = async () => {
        await logOut();
        router.push("/login");
    };

    return (
        <aside className="w-72 bg-slate-900 text-white flex flex-col shadow-xl flex-shrink-0 z-20">
            <div className="p-6 flex items-center gap-3 border-b border-slate-800">
                <ShieldCheck className="w-8 h-8 text-fuchsia-400" />
                <div>
                    <h1 className="text-xl font-bold tracking-tight">SHE360+</h1>
                    <p className="text-xs text-slate-400">Risk Intelligence Platform</p>
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1">
                {NAV_ITEMS.map(({ href, label, icon: Icon, color }) => {
                    const active = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active
                                    ? "bg-white/10 text-white"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${color} group-hover:scale-110 transition-transform`} />
                            <span className="font-medium text-sm">{label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800 space-y-3">
                {/* SOS Button */}
                <Link href="/safety" className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl font-semibold shadow-lg shadow-rose-600/20 transition-all flex items-center justify-center gap-2 text-sm">
                    <ShieldAlert className="w-4 h-4" /> Emergency SOS
                </Link>

                {/* Auth */}
                {!loading && (
                    user ? (
                        <div className="flex items-center gap-2 px-2">
                            <div className="w-8 h-8 rounded-full bg-fuchsia-500/20 border border-fuchsia-400/30 flex items-center justify-center text-fuchsia-400 text-sm font-bold flex-shrink-0">
                                {user.email?.[0]?.toUpperCase() ?? <User className="w-4 h-4" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-slate-300 truncate">{user.email}</p>
                            </div>
                            <button onClick={handleLogout} title="Sign out"
                                className="text-slate-400 hover:text-rose-400 transition p-1 flex-shrink-0">
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <Link href="/login"
                            className="flex items-center justify-center gap-2 w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-xl text-sm font-medium transition">
                            <LogIn className="w-4 h-4" /> Sign In
                        </Link>
                    )
                )}
            </div>
        </aside>
    );
}
