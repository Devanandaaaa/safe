"use client";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

const NO_SIDEBAR_PATHS = ["/login"];

export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const showSidebar = !NO_SIDEBAR_PATHS.includes(pathname);

    if (!showSidebar) {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-[#050505]">
            <Sidebar />
            {/* Changed bg-slate-50 to bg-[#050505] */}
            <main className="flex-1 flex flex-col max-h-screen overflow-hidden bg-[#050505]">
                {/* Removed p-8 padding so the page layout flows edge-to-edge */}
                <div className="flex-1 overflow-auto p-0 m-0">
                    {/* Removed max-w-7xl mx-auto to allow true full-width display */}
                    <div className="w-full h-full">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}