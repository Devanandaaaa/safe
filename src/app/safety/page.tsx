"use client";

import { useState } from "react";
import { 
  ShieldCheck, 
  User, 
  LogOut,
  MapPin, 
  Navigation, 
  ShieldAlert, 
  Building, 
  Stethoscope, 
  PhoneCall, 
  Sun,
  Moon,
  Info,
  Menu
} from "lucide-react";
import { logOut } from "@/lib/firebase"; 
import { useRouter } from "next/navigation";

export default function SafetyDashboard() {
  const router = useRouter();
  
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [timeOfDay, setTimeOfDay] = useState<"day" | "night">("day");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setShowResults(false);
    
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 1500);
  };

  const handleLogout = async () => {
    await logOut();
    router.push("/login");
  };

  const safetyScore = timeOfDay === "day" ? 88 : 62;
  const riskLevel = timeOfDay === "day" ? "Low Risk" : "Moderate Risk";

  return (
    <>
      {/* 
        This style block forces the browser to remove the default white borders 
        and makes the background black, without needing an external CSS file! 
      */}
      <style dangerouslySetInnerHTML={{ __html: `
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          background-color: #050505 !important;
          overflow-x: hidden;
        }
      `}} />

      <div className="min-h-screen w-full flex flex-col bg-[#050505] font-sans">
        
        {/* Edge-to-Edge Header */}
        <header className="sticky top-0 z-50 bg-[#0A0A0A] border-b border-zinc-800 w-full px-6 lg:px-12 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="bg-[#088858] p-2 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-wide">SHE360+</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-[#4DEEA5] font-semibold text-sm">Route Intelligence</a>
            <a href="#" className="text-gray-400 hover:text-white transition text-sm font-medium">Live Map</a>
            <a href="#" className="text-gray-400 hover:text-white transition text-sm font-medium">Incidents</a>
          </nav>

          <div className="flex items-center gap-4">
            <button className="hidden md:flex items-center gap-2 text-gray-400 hover:text-white transition text-sm font-medium">
              <User className="w-4 h-4" /> Profile
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
            <button className="md:hidden text-gray-400 hover:text-white">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Fluid Main Content */}
        <main className="flex-grow w-full px-6 lg:px-12 py-10 flex flex-col gap-10">
          
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Predictive Route Analysis
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed max-w-3xl">
              Enter your starting point and destination to evaluate environmental safety, historical incident data, and emergency infrastructure along your path.
            </p>
          </div>

          {/* Full-Width Form Bar */}
          <div className="w-full bg-[#111111] border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-2xl">
            <form onSubmit={handleAnalyze} className="flex flex-col xl:flex-row gap-5 items-end w-full">
              
              <div className="w-full flex-[2]">
                <label className="block text-sm font-bold text-gray-300 mb-2">Starting Point</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Where are you now?"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full bg-[#050505] border border-zinc-700 text-white text-base pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-[#4DEEA5] focus:ring-1 focus:ring-[#4DEEA5] transition-all"
                    required
                  />
                </div>
              </div>

              <div className="w-full flex-[2]">
                <label className="block text-sm font-bold text-gray-300 mb-2">Destination</label>
                <div className="relative">
                  <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Where are you going?"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-[#050505] border border-zinc-700 text-white text-base pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-[#4DEEA5] focus:ring-1 focus:ring-[#4DEEA5] transition-all"
                    required
                  />
                </div>
              </div>

              <div className="w-full xl:w-auto flex-[1]">
                <label className="block text-sm font-bold text-gray-300 mb-2">Time of Travel</label>
                <div className="flex bg-[#050505] border border-zinc-700 rounded-xl p-1 h-[58px]">
                  <button
                    type="button"
                    onClick={() => setTimeOfDay("day")}
                    className={`flex-1 xl:w-32 flex items-center justify-center gap-2 rounded-lg text-sm font-bold transition-all ${
                      timeOfDay === "day" ? "bg-zinc-800 text-white shadow" : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    <Sun className="w-4 h-4" /> Day
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeOfDay("night")}
                    className={`flex-1 xl:w-32 flex items-center justify-center gap-2 rounded-lg text-sm font-bold transition-all ${
                      timeOfDay === "night" ? "bg-zinc-800 text-white shadow" : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    <Moon className="w-4 h-4" /> Night
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isAnalyzing}
                className="w-full xl:w-auto h-[58px] bg-[#088858] hover:bg-[#0E3B2E] text-white px-10 rounded-xl font-bold transition-colors flex items-center justify-center disabled:opacity-70 xl:flex-[0.5]"
              >
                {isAnalyzing ? "Scanning..." : "Analyze"}
              </button>
            </form>
          </div>

          {/* Expanded Results Area */}
          {showResults && (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-500 w-full">
              
              {/* Massive Interactive Map */}
              <div className="xl:col-span-3 flex flex-col gap-8 w-full">
                <div className="w-full h-[600px] bg-[#111111] border border-zinc-800 rounded-2xl flex items-center justify-center relative overflow-hidden">
                   <div className="text-center">
                      <Navigation className="w-16 h-16 text-[#4DEEA5] mx-auto mb-4 opacity-50" />
                      <p className="text-gray-400 font-bold tracking-widest uppercase text-base">Interactive Map Loaded</p>
                   </div>
                </div>
              </div>

              {/* Sidebar Data */}
              <div className="xl:col-span-1 flex flex-col gap-6 w-full">
                
                <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-bold text-lg">Safety Index</h3>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${timeOfDay === "day" ? "bg-emerald-500/10 text-[#4DEEA5]" : "bg-yellow-500/10 text-yellow-500"}`}>
                      {riskLevel}
                    </span>
                  </div>
                  <div className="flex items-end gap-2 mb-6">
                    <span className="text-7xl font-extrabold text-white leading-none">{safetyScore}</span>
                    <span className="text-2xl text-gray-500 font-bold mb-1">/ 100</span>
                  </div>
                  <div className="flex items-start gap-3 bg-[#050505] p-5 rounded-xl border border-zinc-800">
                    <Info className="w-6 h-6 text-[#4DEEA5] shrink-0 mt-0.5" />
                    <p className="text-gray-300 text-sm leading-relaxed font-medium">
                      {timeOfDay === "day" 
                        ? "Conditions are optimal. Normal precautions apply for this route during daylight hours." 
                        : "Visibility is reduced. Stick to well-lit main roads and avoid the park shortcut."}
                    </p>
                  </div>
                </div>

                <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-6 flex-grow">
                  <h3 className="text-white font-bold mb-6 flex items-center gap-2 text-lg">
                    <Building className="w-6 h-6 text-gray-400" />
                    Safe Havens
                  </h3>
                  
                  <div className="space-y-5">
                    <div className="bg-[#050505] border border-zinc-800 rounded-xl p-5">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-white flex items-center gap-2 text-base">
                          <ShieldAlert className="w-5 h-5 text-blue-400" /> Police Station
                        </span>
                        <span className="text-xs font-bold text-gray-400 bg-zinc-800 px-3 py-1.5 rounded">1.2 km</span>
                      </div>
                      <button className="w-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-sm font-bold py-3 rounded-lg flex justify-center items-center gap-2 transition-colors">
                         <PhoneCall className="w-4 h-4" /> Call Dispatch
                      </button>
                    </div>

                    <div className="bg-[#050505] border border-zinc-800 rounded-xl p-5">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-white flex items-center gap-2 text-base">
                          <Stethoscope className="w-5 h-5 text-red-400" /> City Hospital
                        </span>
                        <span className="text-xs font-bold text-gray-400 bg-zinc-800 px-3 py-1.5 rounded">2.5 km</span>
                      </div>
                      <button className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-bold py-3 rounded-lg flex justify-center items-center gap-2 transition-colors">
                         <Navigation className="w-4 h-4" /> Reroute Here
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </main>

        {/* Edge-to-Edge Footer */}
        <footer className="bg-[#0A0A0A] border-t border-zinc-800 w-full py-8 px-6 lg:px-12 mt-auto">
          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gray-500" />
              <span className="text-gray-500 font-medium text-sm">© 2026 SHE360+ Risk Intelligence. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-500 hover:text-white transition text-sm font-medium">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-white transition text-sm font-medium">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-white transition text-sm font-medium">Emergency Contacts</a>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}