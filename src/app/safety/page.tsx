'use client';

export default function SafetyPage() {
    return (
        <div className="p-10 max-w-6xl mx-auto space-y-10">

            <h1 className="text-4xl font-bold text-rose-600">
                Safety Intelligence
            </h1>

            {/* SAFE ROUTE */}
            <section className="bg-white p-6 shadow rounded space-y-4">
                <h2 className="text-2xl font-semibold">Safe Route Planning</h2>
                <input className="border p-3 w-full" placeholder="Enter destination..." />
                <button className="bg-rose-500 text-white px-4 py-2 rounded">
                    Find Safe Route
                </button>

                <div className="h-64 bg-gray-200 flex items-center justify-center">
                    Map will appear here
                </div>
            </section>

            {/* EMERGENCY */}
            <section className="bg-white p-6 shadow rounded space-y-4">
                <h2 className="text-2xl font-semibold">Emergency Check-In</h2>
                <button className="bg-red-600 text-white px-6 py-3 rounded text-lg">
                    🚨 Panic Button
                </button>
                <button className="bg-purple-600 text-white px-4 py-2 rounded">
                    Start Safe Journey
                </button>
            </section>

            {/* RISK MAP */}
            <section className="bg-white p-6 shadow rounded space-y-4">
                <h2 className="text-2xl font-semibold">Area Risk Mapping</h2>
                <div className="h-64 bg-gray-200 flex items-center justify-center">
                    Heatmap here
                </div>
            </section>

        </div>
    );
}