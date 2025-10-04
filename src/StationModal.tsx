import ImageViewer from "./ImageViewer";

interface StationModalProps {
    stationId: any;
    stationName: string;
    onClose: () => void;
}

export default function StationModal({ stationId, stationName, onClose }: StationModalProps) {
    return (
        <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                       z-30 max-w-2/3 max-h-2/3 shrink bg-white dark:bg-stone-700 
                       rounded-2xl shadow-lg p-6 flex flex-col"
        >
            <div className="relative w-full h-full grow">
                <h2 className="text-xl font-bold h-1/5 text-black dark:text-white">
                    {stationName}
                </h2>
                <div className="w-full flex h-4/5 shrink mt-8">
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
