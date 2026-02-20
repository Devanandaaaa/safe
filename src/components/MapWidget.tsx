'use client';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icons in Next.js
const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = defaultIcon;

interface MapWidgetProps {
    title: string;
    center: [number, number];
    zoom: number;
    markers?: Array<{
        id: string;
        position: [number, number];
        title: string;
        description?: string;
    }>;
}

export default function MapWidget({ title, center, zoom, markers = [] }: MapWidgetProps) {
    // Hydration fix for maps
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    if (!mounted) return <div className="h-full min-h-[400px] bg-slate-100 rounded-2xl animate-pulse"></div>;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-full flex flex-col">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">{title}</h3>
            <div className="flex-1 min-h-[400px] rounded-xl overflow-hidden border border-slate-200">
                <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {markers.map(marker => (
                        <Marker key={marker.id} position={marker.position}>
                            <Popup>
                                <strong>{marker.title}</strong>
                                {marker.description && <p className="text-sm mt-1">{marker.description}</p>}
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
}
