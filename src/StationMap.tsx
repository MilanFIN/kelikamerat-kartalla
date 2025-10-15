"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import { useMapTypeContext } from "./providers/mapcontext";
import { useMemo } from "react";
import L from "leaflet";
import { useTranslation } from "react-i18next";

interface StationMapProps {
    stations: any[];
    isLoading: boolean;
    isError: boolean;
    onStationSelect: (station: any) => void;
}

export default function StationMap({
    stations,
    isLoading,
    isError,
    onStationSelect,
}: StationMapProps) {
    const center: LatLngExpression = [64.1807, 25.8032];
    const { tileUrl } = useMapTypeContext();
    const { t } = useTranslation();

    const cameraIcon = useMemo(() => {
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24">
        <title>Video Camera</title>
        <!-- Outer circular border -->
        <circle cx="12" cy="12" r="11" fill="white" stroke="#374151" stroke-width="1.5"/>
        
        <!-- Camera body (larger and taller) -->
        <rect x="5.5" y="8" width="9" height="8" rx="1.3" fill="#1f2937" stroke="1f2937" stroke-width="1.2"/>
        
        <!-- Lens protrusion (connected to body) -->
        <polygon points="14.5 9.2 19.5 7.5 19.5 16.5 14.5 14.8" fill="#1f2937" stroke="white" stroke-width="1.2" stroke-linejoin="round"/>
        </svg>
    `;
        // Use a divIcon with no extra classes so only the svg is visible
        return L.divIcon({
            className: "", // remove default .leaflet-div-icon styling
            html: svg,
            iconSize: [36, 36], // size of the icon (match svg width/height)
            iconAnchor: [18, 18], // point of the icon which will correspond to marker's location
            popupAnchor: [0, -18], // where popup opens relative to icon anchor
        });
    }, []);

    return (
        <MapContainer
            center={center}
            zoom={6}
            scrollWheelZoom={true}
            className="absolute inset-0 z-10"
            attributionControl={true}
        >
            <TileLayer url={tileUrl} />

            {!isLoading &&
                !isError &&
                stations?.map((station: any) => (
                    <Marker
                        key={station.id}
                        position={[
                            station.coordinates[1],
                            station.coordinates[0],
                        ]}
                        icon={cameraIcon}
                    >
                        <Popup>
                            <div className="p-2 min-w-[200px]">
                                <div className="mb-3">
                                    <strong className="text-base font-bold text-stone-900 block mb-1">
                                        {station.name}
                                    </strong>
                                    <span className="text-xs text-stone-600">
                                        {t("updated")}:{" "}
                                        {new Date(
                                            station.updatedTime
                                        ).toLocaleString()}
                                    </span>
                                </div>
                                <button
                                    onClick={() => onStationSelect(station)}
                                    className="w-full px-4 py-2 text-sm font-medium rounded-lg 
                                             bg-blue-500 hover:bg-blue-600 text-white
                                             transition-all duration-200 shadow-sm hover:shadow-md"
                                >
                                    {t("viewDetails")}
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
        </MapContainer>
    );
}
