import { AuthProvider } from "@/context/AuthContext";
import AuthGuard from "@/components/AuthGuard";
import AppShell from "@/components/AppShell";
import "./globals.css";

export const metadata = {
  title: "SHE360+ | Risk Intelligence Platform",
  description: "Multi-dimensional risk detection and resilience platform for women",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-gray-900 font-sans antialiased">
        <AuthProvider>
          <AuthGuard>
            <AppShell>
              {children}
            </AppShell>
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
