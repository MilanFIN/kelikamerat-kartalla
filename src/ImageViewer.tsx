import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import ThumbnailScroller from "./ThumbnailScroller";
import { useTranslation } from "react-i18next";

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

export default function ImageViewer({ stationId, gotClearName }: ImageViewerProps) {
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
            clearNames: data.names
        }),
    });

    const operational = data?.operational || false;
    const updated = data?.updated || null;

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedCameraId, setSelectedCameraId] = useState<string | null>(
        null
    );

    const [selectedCameraName, setSelectedCameraName] = useState<string | null>(
        null
    );

    useEffect(() => {
        if (data?.cameras?.length) {
            loadFullImage(data?.cameras[0]?.id);
        }
        gotClearName(data?.clearNames || {});
    }, [data?.cameras]);

    // Load full image when a camera is selected
    const loadFullImage = async (cameraId: string) => {
        const camera = data?.cameras.find(
            (cam: { id: string }) => cam.id === cameraId
        );
        if (camera) {
            setSelectedImage(camera.url);
            setSelectedCameraId(camera.id);
            setSelectedCameraName(camera.name);
        }
    };

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
        const handleResize = () => {
            setImageSize(calcImageSize());
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const message = renderMessage();

    return (
        <div className="flex flex-col mt-2 items-start w-full h-full">
            {/* Status message if needed */}
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
                {selectedCameraName ? `${t("camera")}: ${selectedCameraName}` : null}
            </h3>

            <h3 className="text-lg font-medium mb-2">
                {operational ? (
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

            {/* Full image (or placeholder) */}
            {selectedImage ? (
                <div
                    style={{
                        maxWidth: imageSize,
                        maxHeight: (imageSize * 9) / 16,
                    }}
                    className="relative group"
                >
                    <img
                        src={selectedImage}
                        alt={`Camera ${selectedCameraId}`}
                        className="object-contain object-left rounded-lg w-full h-full"
                    />

                    {/* Prev button */}
                    <button
                        className="absolute top-1/2 left-2 -translate-y-1/2 
               bg-black bg-opacity-40 text-white rounded-full p-2 pt-1
               opacity-0 group-hover:opacity-100 transition text-lg"
                    >
                        ◀
                    </button>

                    {/* Next button */}
                    <button
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
                    className="aspect-[16/9]  bg-gray-200 rounded-lg animate-pulse"
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
        </div>
    );
}
