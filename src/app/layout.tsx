import Link from 'next/link';
import { ShieldAlert, AlertTriangle, TrendingUp, ShieldCheck } from 'lucide-react';
import './globals.css';

export const metadata = {
  title: 'Risk Intelligence Platform',
  description: 'Integrated risk intelligence modules for women to take preventive action',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 font-sans antialiased flex h-screen overflow-hidden">

        {/* Sidebar */}
        <aside className="w-72 bg-slate-900 text-white flex flex-col shadow-xl flex-shrink-0 z-20">
          <div className="p-6 flex items-center gap-3 border-b border-slate-800">
            <ShieldCheck className="w-8 h-8 text-fuchsia-400" />
            <h1 className="text-xl font-bold tracking-tight">Risk Intelligence</h1>
          </div>

          <nav className="flex-1 px-4 py-8 space-y-2">
            <Link
              href="/safety"
              className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-all duration-200 group"
            >
              <ShieldAlert className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Safety Intelligence</span>
            </Link>

            <Link
              href="/domestic"
              className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-all duration-200 group"
            >
              <AlertTriangle className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Domestic Risk Detector</span>
            </Link>

            <Link
              href="/financial"
              className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-all duration-200 group"
            >
              <TrendingUp className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Financial Autonomy Monitor</span>
            </Link>
          </nav>

          <div className="p-6 border-t border-slate-800">
            <button className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl font-semibold shadow-lg shadow-rose-600/20 transition-all flex items-center justify-center gap-2">
              <ShieldAlert className="w-5 h-5" />
              Emergency SOS
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col max-h-screen overflow-hidden bg-slate-50">
          <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 shadow-sm justify-between z-10 flex-shrink-0">
            <h2 className="text-xl font-semibold text-gray-800">Dashboard Overview</h2>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border-2 border-blue-200 shadow-sm">
                A
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto p-8 relative">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
