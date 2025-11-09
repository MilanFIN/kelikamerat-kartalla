"use client";

import { useEffect, useRef, useState } from "react";
import { useStationsContext } from "./providers/stationscontext";
import { useMapTypeContext } from "./providers/mapcontext";
import { useLanguageContext } from "./providers/languagecontext";
import { MapType } from "./constants/map";
import { useTranslation } from "react-i18next";

interface MenuPanelProps {
    visible: boolean;
    onClose: () => void;
    onStationSelect: (station: any) => void;
    allStations?: any[];
    interestingStations?: any[];
}

export default function MenuPanel({
    visible,
    onClose,
    onStationSelect,
    allStations = [],
    interestingStations = [],
}: MenuPanelProps) {
    const [isPortrait, setIsPortrait] = useState(
        typeof window !== "undefined"
            ? window.innerHeight > window.innerWidth
            : true
    );
    const panelRef = useRef<HTMLDivElement>(null);

    const { stations, removeStation } = useStationsContext();
    const { mapType, setMapType } = useMapTypeContext();
    const { language, setLanguage } = useLanguageContext();
    const { t } = useTranslation();

    // Detect orientation change
    useEffect(() => {
        const handleResize = () => {
            setIsPortrait(window.innerHeight > window.innerWidth);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: PointerEvent) => {
            if (
                panelRef.current &&
                !panelRef.current.contains(e.target as Node)
            ) {
                onClose();
            }
        };

        if (visible) {
            document.addEventListener("pointerdown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("pointerdown", handleClickOutside);
        };
    }, [visible, onClose]);

    if (!visible) return null;

    return (
        <div
            ref={panelRef}
            className={`absolute bg-stone-800 dark:bg-stone-800 shadow-2xl z-30 
                       border-r border-stone-700 dark:border-stone-700 overflow-y-scroll
                       ${
                           isPortrait
                               ? "top-20 left-0 w-full min-h-64 border-b"
                               : "top-0 left-20 h-full w-80"
                       }`}
        >
            <div className="p-6 border-b border-stone-700 dark:border-stone-700">
                <h2 className="text-2xl font-bold text-white dark:text-white">
                    {t("menu")}
                </h2>
            </div>

            {/* Map Style */}
            <div className="p-6 border-b border-stone-700 dark:border-stone-700">
                <h3 className="text-sm font-semibold text-stone-400 dark:text-stone-400 uppercase tracking-wide mb-3">
                    {t("mapStyle")}
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                    {Object.values(MapType).map((type) => (
                        <button
                            key={type as string}
                            onClick={() => setMapType(type as MapType)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200
                            ${
                                mapType === type
                                    ? "bg-blue-500 text-white shadow-md"
                                    : "bg-stone-700 dark:bg-stone-700 text-stone-300 dark:text-stone-300 hover:bg-stone-600 dark:hover:bg-stone-600"
                            }`}
                        >
                            {type as string}
                        </button>
                    ))}
                </div>

                {/* Language Selector */}
                <div>
                    <h3 className="text-sm font-semibold text-stone-400 dark:text-stone-400 uppercase tracking-wide mb-3">
                        {t("language")}
                    </h3>
                    <div className="flex gap-3">
                        {/* Finnish */}
                        <button
                            onClick={() => setLanguage("fi")}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                                language === "fi"
                                    ? "bg-blue-500 text-white shadow-md"
                                    : "bg-stone-700 dark:bg-stone-700 hover:bg-stone-600 dark:hover:bg-stone-600 text-stone-300 dark:text-stone-300"
                            }`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 900 600"
                                className="w-6 h-4"
                            >
                                <rect width="900" height="600" fill="#fff" />
                                <rect
                                    x="0"
                                    y="240"
                                    width="900"
                                    height="120"
                                    fill="#003580"
                                />
                                <rect
                                    x="240"
                                    y="0"
                                    width="120"
                                    height="600"
                                    fill="#003580"
                                />
                            </svg>
                            <span>{t("fi")}</span>
                        </button>

                        {/* English */}
                        <button
                            onClick={() => setLanguage("en")}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                                language === "en"
                                    ? "bg-blue-500 text-white shadow-md"
                                    : "bg-stone-700 dark:bg-stone-700 hover:bg-stone-600 dark:hover:bg-stone-600 text-stone-300 dark:text-stone-300"
                            }`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 60 30"
                                className="w-6 h-4"
                            >
                                <path fill="#012169" d="M0,0v30h60V0z" />
                                {/* White diagonals */}
                                <path
                                    stroke="#fff"
                                    strokeWidth="6"
                                    d="M0,0l60,30M60,0L0,30"
                                />
                                {/* Red diagonals (fixed) */}
                                <path
                                    stroke="#C8102E"
                                    strokeWidth="2"
                                    d="M0,0l60,30M60,0L0,30"
                                />
                                {/* White cross */}
                                <path
                                    stroke="#fff"
                                    strokeWidth="10"
                                    d="M30,0v30M0,15h60"
                                />
                                {/* Red cross */}
                                <path
                                    stroke="#C8102E"
                                    strokeWidth="6"
                                    d="M30,0v30M0,15h60"
                                />
                            </svg>
                            <span>{t("en")}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Bookmarked Stations */}
            <div className="p-6 border-b border-stone-700 dark:border-stone-700">
                <h3 className="text-sm font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wide mb-3">
                    {t("bookmarkedStations")}
                </h3>
                <ul className="space-y-2">
                    {stations.length > 0 ? (
                        stations.map((station: any, index: any) => (
                            <li
                                key={index}
                                className="flex items-center gap-2 group"
                            >
                                <button
                                    className="flex-1 text-left px-3 py-2.5 rounded-lg 
                                         bg-stone-700/50 dark:bg-stone-700/50 
                                         hover:bg-stone-700 dark:hover:bg-stone-700
                                         text-stone-300 dark:text-stone-300
                                         transition-all duration-200 font-medium"
                                    onClick={() => onStationSelect(station)}
                                >
                                    {station.name}
                                </button>
                                <button
                                    onClick={() => removeStation(station.id)}
                                    className="p-2.5 bg-stone-700 dark:bg-stone-700 
                                       hover:bg-red-500 dark:hover:bg-red-500
                                       hover:text-white
                                       text-stone-400 dark:text-stone-400
                                       rounded-lg transition-all duration-200 
                                       "
                                    aria-label="Remove station"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                </button>
                            </li>
                        ))
                    ) : (
                        <li className="text-stone-400 dark:text-stone-400 text-center py-8 italic">
                            No bookmarked stations yet
                        </li>
                    )}
                </ul>
            </div>
            <div className="p-6">
                <h3 className="text-sm font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wide mb-3">
                    {t("interestingStations")}
                </h3>
                <ul className="space-y-2">
                    {interestingStations.length > 0 ? (
                        interestingStations.map((station: any, index: any) => {
                            // find the full station object in allStations by ID
                            const matchedStation = allStations?.find(
                                (s: any) => s.id === station.stationId
                            );
                            console.log("Interesting station:", station);
                            console.log("Matched station:", matchedStation);

                            return (
                                <li
                                    key={index}
                                    className="flex items-center gap-2 group"
                                >
                                    <button
                                        className="flex-1 text-left px-3 py-2.5 rounded-lg 
                       bg-stone-700/50 dark:bg-stone-700/50 
                       hover:bg-stone-700 dark:hover:bg-stone-700
                       text-stone-300 dark:text-stone-300
                       transition-all duration-200 font-medium"
                                        onClick={() =>
                                            onStationSelect(matchedStation)
                                        }
                                    >
                                        <span className="font-bold text-red-500 dark:text-red-500">
                                            +
                                            {new Intl.NumberFormat(
                                                "fi-FI"
                                            ).format(station.count)}
                                        </span>{" "}
                                        {matchedStation?.name ||
                                            "Unknown station"}
                                    </button>
                                </li>
                            );
                        })
                    ) : (
                        <li className="text-stone-400 dark:text-stone-400 text-center py-8 italic">
                            Nothing interesting has been reported yet
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}
