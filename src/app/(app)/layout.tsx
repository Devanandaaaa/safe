import Sidebar from "@/components/Sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // The main wrapper: full screen, flex row, dark background
    <div className="flex h-screen w-full bg-[#050505] overflow-hidden font-sans">
      
      {/* Your existing Sidebar component */}
      <Sidebar />

      {/* 
        The Content Area: flex-1 takes up the remaining space. 
        We use bg-[#050505] to match the dashboard, and remove all padding (p-0) 
      */}
      <main className="flex-1 h-full overflow-y-auto bg-[#050505] relative m-0 p-0">
        {children}
      </main>
      
    </div>
  );
}