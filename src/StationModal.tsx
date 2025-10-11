import { useState } from "react";
import ImageViewer from "./ImageViewer";
import { useStationsContext } from "./providers/stationscontext";

interface StationModalProps {
    stationId: any;
    stationName: string;
    onClose: () => void;
}

export default function StationModal({
    stationId,
    stationName,
    onClose,
}: StationModalProps) {
    const [copied, setCopied] = useState(false);

    const { stations, addStation, removeStation } = useStationsContext();
    const [isStarred, setIsStarred] = useState(
        stations.some((station: { id: any }) => station.id === stationId)
    );

    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 10000);
        } catch (err) {
            console.error("Failed to copy URL:", err);
        }
    };

    const handleToggleStar = () => {
        if (!isStarred) {
            addStation({ id: stationId, name: stationName });
        } else {
            removeStation(stationId);
        }
        setIsStarred((prev) => !prev);
    };

    return (
        <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                       z-30 max-w-2/3 max-h-2/3 shrink bg-white dark:bg-stone-700 
                       rounded-2xl shadow-lg p-6 flex flex-col"
        >
            <div className="relative w-full h-full grow">
                <h2 className="ml-4 text-xl font-bold h-1/5 text-black dark:text-white">
                    {stationName}
                </h2>

                <div className="flex flex-row">
                    {/* Copy URL Button */}
                    <button
                        onClick={handleCopyUrl}
                        className="ml-4 my-2 px-4 py-2 h-12 rounded-lg bg-stone-500 text-black hover:bg-stone-300 transition flex items-center justify-center"
                    >
                        {copied ? (
                            <span className="">Copied!</span>
                        ) : (
                            <img
                                src="/copy.svg"
                                alt="Copy URL"
                                title="Copy URL"
                                className="h-6 w-12"
                            />
                        )}
                    </button>
                    <button
                        onClick={handleToggleStar}
                        className="ml-2 my-2 px-4 py-2 h-12 rounded-lg bg-stone-500 text-black hover:bg-stone-300 transition"
                    >
                        <img
                            src={
                                isStarred
                                    ? "/star_full.svg"
                                    : "/star_outline.svg"
                            }
                            alt={isStarred ? "Starred" : "Not Starred"}
                            title={isStarred ? "Unstar" : "Star"}
                            className="h-8 w-12"
                        />
                    </button>
                </div>
                <div className="w-full flex h-4/5 shrink mt-4">
                    <ImageViewer stationId={stationId} />
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-1 right-1 py-3 px-4 rounded-lg 
                               text-stone-400 dark:text-stone-800 hover:text-stone-600 
                               bg-stone-800 dark:bg-stone-300"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}
