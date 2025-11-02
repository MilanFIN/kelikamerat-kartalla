"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import { useMapTypeContext } from "./providers/mapcontext";
import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import { useTranslation } from "react-i18next";
import { Capacitor } from "@capacitor/core";
import { Geolocation } from "@capacitor/geolocation";
// @ts-ignore
import "leaflet.markercluster";
//import "leaflet.markercluster/dist/leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

interface StationMapProps {
  stations: any[];
  isLoading: boolean;
  isError: boolean;
  onStationSelect: (station: any) => void;
}

// ----------------------------
// Helper to recenter the map
// ----------------------------
function CenterMap({ position }: { position: LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    map.setView(position, 10);
  }, [position, map]);
  return null;
}

// ----------------------------
// Clustering Layer Component
// ----------------------------
function ClusterLayer({
  stations,
  cameraIcon,
  onStationSelect,
  t,
}: {
  stations: any[];
  cameraIcon: L.DivIcon;
  onStationSelect: (station: any) => void;
  t: any;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || !stations?.length) return;

    // Create the cluster group
    // @ts-expect-error
    const clusterGroup = L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 60,
      iconCreateFunction: (cluster:any) => {
        const count = cluster.getChildCount();
        let color =
          count < 10
            ? "rgba(37,99,235,0.9)"
            : count < 50
            ? "rgba(234,179,8,0.9)"
            : "rgba(239,68,68,0.9)";
        return L.divIcon({
          html: `
            <div style="
              background:${color};
              color:white;
              border-radius:50%;
              width:40px;
              height:40px;
              display:flex;
              align-items:center;
              justify-content:center;
              border:2px solid white;
              box-shadow:0 0 6px rgba(0,0,0,0.3);
            ">
              ${count}
            </div>`,
          className: "",
          iconSize: [40, 40],
        });
      },
    });

    // Add markers to the cluster group
    stations.forEach((station) => {
      const marker = L.marker(
        [station.coordinates[1], station.coordinates[0]],
        { icon: cameraIcon }
      );

      const popupHtml = `
        <div class="p-2 min-w-[200px]">
          <div class="mb-3">
            <strong class="text-base font-bold text-white block mb-1">
              ${station.name}
            </strong>
            <span class="text-xs text-white">
              ${t("updated")}: ${new Date(station.updatedTime).toLocaleString()}
            </span>
          </div>
          <button
            id="station-${station.id}"
            class="cluster-popup-btn w-full px-4 py-2 text-sm font-medium rounded-lg 
                   bg-blue-500 hover:bg-blue-600 text-white
                   transition-all duration-200 shadow-sm hover:shadow-md"
          >
            ${t("viewDetails")}
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);
      clusterGroup.addLayer(marker);
    });

    // Add cluster group to the map
    clusterGroup.addTo(map);

    // Attach button click events inside popups
    map.on("popupopen", (e) => {
      const button = e.popup.getElement()?.querySelector(".cluster-popup-btn") as
        | HTMLButtonElement
        | null;
      if (!button) return;

      const id = button.id.replace("station-", "");
      const station = stations.find((s) => s.id.toString() === id);
      if (station) {
        button.onclick = () => onStationSelect(station);
      }
    });

    // Cleanup on unmount
    return () => {
      map.removeLayer(clusterGroup);
    };
  }, [map, stations, cameraIcon, onStationSelect, t]);

  return null;
}

// ----------------------------
// Main Station Map Component
// ----------------------------
export default function StationMap({
  stations,
  isLoading,
  isError,
  onStationSelect,
}: StationMapProps) {
  const defaultCenter: LatLngExpression = [64.1807, 25.8032];
  const { tileUrl } = useMapTypeContext();
  const { t } = useTranslation();

  const [userPosition, setUserPosition] = useState<LatLngExpression | null>(
    null
  );

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

  // get device location (native platforms only)
  useEffect(() => {
    const fetchLocation = async () => {
      if (!Capacitor.isNativePlatform()) return;

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

      {userPosition && <CenterMap position={userPosition} />}

      {userPosition && (
        <Marker position={userPosition} icon={userIcon}>
          <Popup>{t("youAreHere", "You are here")}</Popup>
        </Marker>
      )}

      {!isLoading && !isError && (
        <ClusterLayer
          stations={stations}
          cameraIcon={cameraIcon}
          onStationSelect={onStationSelect}
          t={t}
        />
      )}
    </MapContainer>
  );
}
