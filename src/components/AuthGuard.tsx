"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const PUBLIC_PATHS = ["/login"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (loading) return;

        const isPublic = PUBLIC_PATHS.includes(pathname);

        if (!user && !isPublic) {
            // Not logged in → send to login
            router.replace("/login");
        } else if (user && isPublic) {
            // Already logged in → send to app
            router.replace("/safety");
        }
    }, [user, loading, pathname, router]);

    // Show nothing while auth state is loading
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-400 text-sm">Loading SHE360+...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
