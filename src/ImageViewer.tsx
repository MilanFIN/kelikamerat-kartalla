import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import ThumbnailScroller from "./ThumbnailScroller";
import { useTranslation } from "react-i18next";
import { App } from '@capacitor/app';

async function fetchCameraIds(stationId: string) {
    const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/stations/${stationId}`
    );
    if (!res.ok) {
        throw new Error("Failed to fetch camera IDs");
    }
    return res.json();
}

interface ImageViewerProps {
    stationId: string;
    gotClearName: (newNames: any) => void;
}

export default function ImageViewer({
    stationId,
    gotClearName,
}: ImageViewerProps) {
    const { t } = useTranslation();

    const { data, isLoading, isError } = useQuery({
        queryKey: ["stationCameras", stationId],
        queryFn: () => fetchCameraIds(stationId),
        select: (data) => ({
            cameras: data.cameras.map(
                (camera: { id: string; name: string; url: string }) => ({
                    id: camera.id,
                    name: camera.name,
                    url: camera.url,
                })
            ),
            operational: data.operational,
            updated: data.updated,
            clearNames: data.names,
        }),
    });

    const operational = isLoading ? null : data?.operational || false;
    const updated = data?.updated || null;

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedCameraId, setSelectedCameraId] = useState<string | null>(
        null
    );
    const [selectedCameraName, setSelectedCameraName] = useState<string | null>(
        null
    );
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [touchStartX, setTouchStartX] = useState<number | null>(null);

    useEffect(() => {
        if (data?.cameras?.length) {
            loadFullImage(data.cameras[0].id);
        }
        gotClearName(data?.clearNames || {});
    }, [data?.cameras]);

    const loadFullImage = async (cameraId: string) => {
        const camera = data?.cameras.find((cam: any) => cam.id === cameraId);
        if (camera) {
            setSelectedImage(camera.url);
            setSelectedCameraId(camera.id);
            setSelectedCameraName(camera.name);
        }
    };

    const handlePrev = (e?: React.MouseEvent | KeyboardEvent) => {
        e?.stopPropagation?.();
        if (!data?.cameras || !selectedCameraId) return;
        const currentIndex = data.cameras.findIndex(
            (cam: any) => cam.id === selectedCameraId
        );
        const prevIndex =
            currentIndex === 0 ? data.cameras.length - 1 : currentIndex - 1;
        loadFullImage(data.cameras[prevIndex].id);
    };

    const handleNext = (e?: React.MouseEvent | KeyboardEvent) => {
        e?.stopPropagation?.();
        if (!data?.cameras || !selectedCameraId) return;
        const currentIndex = data.cameras.findIndex(
            (cam: any) => cam.id === selectedCameraId
        );
        const nextIndex =
            currentIndex === data.cameras.length - 1 ? 0 : currentIndex + 1;
        loadFullImage(data.cameras[nextIndex].id);
    };

    // Optional: Keyboard navigation (← → keys)
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") handlePrev(e);
            if (e.key === "ArrowRight") handleNext(e);
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [data?.cameras, selectedCameraId]);

    const renderMessage = () => {
        if (isLoading) return "";
        if (isError) return "Error loading cameras";
        if (data?.cameras.length === 0) return "No cameras available";
        return null;
    };

    const calcImageSize = () => {
        const screenW = window.innerWidth * 0.5;
        const screenH = window.innerHeight * 0.6;
        return Math.min(screenW, screenH);
    };

    const [imageSize, setImageSize] = useState(calcImageSize);

    useEffect(() => {
        const handleResize = () => setImageSize(calcImageSize());
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartX(e.changedTouches[0].screenX);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX === null) return;
        const touchEndX = e.changedTouches[0].screenX;
        const deltaX = touchEndX - touchStartX;

        if (Math.abs(deltaX) < 50) return; // ignore small swipes

        if (deltaX > 0) handlePrev(); // swipe right → previous
        else handleNext(); // swipe left → next

        setTouchStartX(null);
    };

    useEffect(() => {
        const backHandler = App.addListener('backButton', (event: { preventDefault: () => void; }) => {
          if (isFullscreen) {
            // Exit fullscreen instead of going back
            setIsFullscreen(false);
            event.preventDefault(); // Stop default behavior
          }
        });
      
        return () => {
          backHandler.remove();
        };
      }, [isFullscreen]);

    const message = renderMessage();

    return (
        <div className="flex flex-col mt-2 items-start w-full h-full relative">
            {/* Status message */}
            {message && (
                <p
                    className={`text-sm ${
                        isError
                            ? "text-red-500"
                            : isLoading
                            ? "text-gray-500"
                            : "text-gray-400"
                    }`}
                >
                    {message}
                </p>
            )}

            <h3 className="text-xl font-semibold mb-1">
                {selectedCameraName
                    ? `${t("camera")}: ${selectedCameraName}`
                    : null}
            </h3>

            <h3 className="text-lg font-medium mb-2">
                {operational === null ? (
                    t("loading")
                ) : operational ? (
                    <div>
                        <div>{t("operational")}</div>
                        <div>
                            {t("updatedOn")}{" "}
                            {new Date(updated).toLocaleString("fi-FI")}
                        </div>
                    </div>
                ) : (
                    t("notavailable")
                )}
            </h3>

            {/* Main image */}
            {selectedImage ? (
                <div
                    style={{
                        maxWidth: imageSize,
                        maxHeight: (imageSize * 9) / 16,
                    }}
                    className="relative group cursor-pointer"
                    onClick={() => setIsFullscreen(true)}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    <img
                        src={selectedImage}
                        alt={`Camera ${selectedCameraId}`}
                        className="object-contain object-left rounded-lg w-full h-full transition-transform"
                    />

                    {/* Prev button */}
                    <button
                        onClick={handlePrev}
                        className="absolute top-1/2 left-2 -translate-y-1/2 
                        bg-black bg-opacity-40 text-white rounded-full p-2 pt-1
                        opacity-0 group-hover:opacity-100 transition text-lg"
                    >
                        ◀
                    </button>

                    {/* Next button */}
                    <button
                        onClick={handleNext}
                        className="absolute top-1/2 right-2 -translate-y-1/2 
                        bg-black bg-opacity-40 text-white rounded-full p-2 pt-1
                        opacity-0 group-hover:opacity-100 transition text-lg"
                    >
                        ▶
                    </button>
                </div>
            ) : (
                <div
                    style={{ width: imageSize, height: (imageSize * 9) / 16 }}
                    className="aspect-[16/9] bg-gray-200 rounded-lg animate-pulse"
                />
            )}

            {/* Thumbnails */}
            <div
                className="max-w-full overflow-x-scroll"
                style={{ width: imageSize }}
            >
                <ThumbnailScroller
                    thumbnails={data?.cameras || []}
                    selectedCameraId={selectedCameraId}
                    onThumbnailClick={loadFullImage}
                />
            </div>

            {/* Fullscreen overlay */}
            {isFullscreen &&
                createPortal(
                    <div
                        className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[9999] cursor-zoom-out"
                        onClick={() => setIsFullscreen(false)}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >
                        <img
                            src={selectedImage!}
                            alt="Fullscreen view"
                            className="max-w-[95%] max-h-[90%] object-contain rounded-lg transition-transform duration-300 scale-100"
                        />

                        {/* Prev / Next buttons in fullscreen */}
                        <button
                            onClick={handlePrev}
                            className="absolute top-1/2 left-6 -translate-y-1/2 
                            bg-black bg-opacity-40 text-white rounded-full p-3 text-2xl"
                        >
                            ◀
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute top-1/2 right-6 -translate-y-1/2 
                            bg-black bg-opacity-40 text-white rounded-full p-3 text-2xl"
                        >
                            ▶
                        </button>
                    </div>,
                    document.body
                )}
        </div>
    );
}
