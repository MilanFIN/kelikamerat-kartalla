import { useEffect, useRef, useState } from "react";
import { useStationsContext } from "./providers/stationscontext";
import { useMapTypeContext } from "./providers/mapcontext";
import { MapType } from "./constants/map";

interface MenuPanelProps {
    visible: boolean;
    onClose: () => void;
    onStationSelect: (station: any) => void;
}

export default function MenuPanel({ visible, onClose, onStationSelect }: MenuPanelProps) {
    const [isPortrait, setIsPortrait] = useState(
        typeof window !== "undefined"
            ? window.innerHeight > window.innerWidth
            : true
    );
    const panelRef = useRef<HTMLDivElement>(null);

    const { stations, removeStation } = useStationsContext();
    const { mapType, setMapType } = useMapTypeContext();

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
            className={`absolute bg-white dark:bg-stone-800 shadow-lg z-30
        ${
            isPortrait
                ? "top-16 left-0 w-full min-h-64"
                : "top-0 left-16 h-full min-w-64"
        }`}
        >
            <h2 className="p-4 font-bold text-stone-800 dark:text-stone-200">
                Menu
            </h2>

            <div className="px-4 mb-4 ">
                <h3 className="font-semibold text-stone-800 dark:text-stone-200 mb-2">
                    Map Style
                </h3>
                <div className="flex space-x-2">
                {Object.values(MapType).map((type) => (
                    <button
                        key={type as string}
                        onClick={() => setMapType(type as MapType)}
                        className={`px-4 py-2 rounded ${
                            mapType === type
                                ? "bg-blue-500 text-white"
                                : "bg-stone-700 dark:bg-stone-700 text-stone-200 dark:text-stone-200"
                        }`}
                    >
                        {type as string}
                    </button>
                ))}
                </div>
            </div>

            <div className="px-4 mb-8">
                <h3 className="font-semibold text-stone-800 dark:text-stone-200 mb-2">
                    Bookmarked
                </h3>
                <ul className=" space-y-2 text-stone-700 dark:text-stone-300">
                    {stations.length > 0 ? (
                      stations.map((station: any, index: any) => (
                        <li
                          key={index}
                          className="flex justify-between items-center"
                        >
                            <span
                            className="hover:bg-stone-500 dark:hover:bg-stone-500 rounded-lg grow cursor-pointer"
                            onClick={() => onStationSelect(station)}
                            >
                            {station.name}
                            </span>
                            <button
                              onClick={() => removeStation(station.id)}
                              className="mx-2 p-2 bg-stone-600 dark:bg-stone-600 hover:bg-stone-500 
                                   dark:hover:bg-stone-500 rounded-xl transition flex items-center justify-center"
                              aria-label="Remove station"
                            >
                              <img
                                src="/garbage.svg"
                                alt="Remove"
                                className="h-4 w-auto"
                              />
                            </button>
                        </li>
                      ))
                    ) : (
                      <li className="text-stone-500 dark:text-stone-400">
                        <span>&lt;none&gt;</span>
                      </li>
                    )}
                </ul>
            </div>
        </div>
    );
}
