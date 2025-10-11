import { useEffect, useRef, useState } from "react";
import { useStationsContext } from "./providers/stationscontext";

interface MenuPanelProps {
    visible: boolean;
    onClose: () => void;
}

export default function MenuPanel({ visible, onClose }: MenuPanelProps) {
    const [isPortrait, setIsPortrait] = useState(
        typeof window !== "undefined"
            ? window.innerHeight > window.innerWidth
            : true
    );
    const panelRef = useRef<HTMLDivElement>(null);

    const { stations, removeStation } = useStationsContext();

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
                ? "top-16 left-0 w-full h-48"
                : "top-0 left-16 h-full w-64"
        }`}
        >
            <h2 className="p-4 font-bold text-stone-800 dark:text-stone-200">
                Menu
            </h2>
            <ul className="px-4 space-y-2 text-stone-700 dark:text-stone-300">
                {stations.map((station: any, index: any) => (
                    <li
                        key={index}
                        className="flex justify-between items-center"
                    >
                        <span>{station.name}</span>
                        <button
                            onClick={() => removeStation(station.id)}
                            className="text-red-500 hover:text-red-700"
                        >
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
