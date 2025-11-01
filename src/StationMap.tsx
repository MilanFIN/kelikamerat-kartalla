"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import { useMapTypeContext } from "./providers/mapcontext";
import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import { useTranslation } from "react-i18next";
import { Capacitor } from "@capacitor/core";
import { Geolocation } from "@capacitor/geolocation";

interface StationMapProps {
    stations: any[];
    isLoading: boolean;
    isError: boolean;
    onStationSelect: (station: any) => void;
}

// Small helper to center map after location is fetched
function CenterMap({ position }: { position: LatLngExpression }) {
    const map = useMap();
    useEffect(() => {
        map.setView(position, 10); // zoom closer when showing user location
    }, [position, map]);
    return null;
}

export default function StationMap({
    stations,
    isLoading,
    isError,
    onStationSelect,
}: StationMapProps) {
    const defaultCenter: LatLngExpression = [64.1807, 25.8032];
    const { tileUrl } = useMapTypeContext();
    const { t } = useTranslation();

    const [userPosition, setUserPosition] = useState<LatLngExpression | null>(null);

    // camera marker
    const cameraIcon = useMemo(() => {
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24">
        <title>Video Camera</title>
        <circle cx="12" cy="12" r="11" fill="white" stroke="#374151" stroke-width="1.5"/>
        <rect x="5.5" y="8" width="9" height="8" rx="1.3" fill="#1f2937" stroke="1f2937" stroke-width="1.2"/>
        <polygon points="14.5 9.2 19.5 7.5 19.5 16.5 14.5 14.8" fill="#1f2937" stroke="white" stroke-width="1.2" stroke-linejoin="round"/>
        </svg>`;
        return L.divIcon({
            className: "",
            html: svg,
            iconSize: [36, 36],
            iconAnchor: [18, 18],
            popupAnchor: [0, -18],
        });
    }, []);

    // blue dot for user location
    const userIcon = useMemo(() => {
        return L.divIcon({
            className: "",
            html: `
              <div style="
                width: 20px;
                height: 20px;
                background: rgba(37, 99, 235, 0.9);
                border: 2px solid white;
                border-radius: 50%;
                box-shadow: 0 0 8px rgba(37, 99, 235, 0.8);
              "></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
        });
    }, []);

    // get device location (only on native platforms)
    useEffect(() => {
        const fetchLocation = async () => {
            if (!Capacitor.isNativePlatform()) return; // skip on web

            try {
                const perm = await Geolocation.checkPermissions();
                if (perm.location !== "granted") {
                    await Geolocation.requestPermissions();
                }

                const position = await Geolocation.getCurrentPosition({
                    enableHighAccuracy: true,
                    timeout: 10000,
                });

                const coords: LatLngExpression = [
                    position.coords.latitude,
                    position.coords.longitude,
                ];
                setUserPosition(coords);
            } catch (err) {
                console.warn("Geolocation error:", err);
            }
        };

        fetchLocation();
    }, []);

    return (
        <MapContainer
            center={userPosition || defaultCenter}
            zoom={userPosition ? 10 : 6}
            scrollWheelZoom={true}
            className="absolute inset-0 z-10"
            attributionControl={true}
        >
            <TileLayer url={tileUrl} />

            {/* Recenter map when location updates */}
            {userPosition && <CenterMap position={userPosition} />}

            {/* Show user marker */}
            {userPosition && (
                <Marker position={userPosition} icon={userIcon}>
                    <Popup>{t("youAreHere", "You are here")}</Popup>
                </Marker>
            )}

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
                                    <strong className="text-base font-bold text-white block mb-1">
                                        {station.name}
                                    </strong>
                                    <span className="text-xs text-white">
                                        {t("updated")}:{" "}
                                        {new Date(station.updatedTime).toLocaleString()}
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
