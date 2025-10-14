import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import ThumbnailScroller from "./ThumbnailScroller";

async function fetchCameraIds(stationId: string) {
    const res = await fetch(
        `https://kelibackend.vercel.app/api/stations/${stationId}`
    );
    if (!res.ok) {
        throw new Error("Failed to fetch camera IDs");
    }
    return res.json(); // [{ id: "C0150301" }, ...]
}

interface ImageViewerProps {
    stationId: string;
}

export default function ImageViewer({ stationId }: ImageViewerProps) {
    const {
        data: cameraIds,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["stationCameras", stationId],
        queryFn: () => fetchCameraIds(stationId),
    });

    const [thumbnails, setThumbnails] = useState<{ id: string; url: string }[]>(
        []
    );
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedCameraId, setSelectedCameraId] = useState<string | null>(
        null
    );

    // Fetch thumbnails
    useEffect(() => {
        if (!cameraIds) return;
        
        setSelectedImage(null);
        setSelectedCameraId(null);
        setThumbnails([]);

        let isMounted = true;
        const fetchThumbnails = async () => {
            const results: { id: string; url: string }[] = [];

            for (const cam of cameraIds) {
                try {
                    const res = await fetch(
                        `https://kelibackend.vercel.app/api/cameras/${cam.id}?thumbnail=true`
                    );
                    if (res.ok) {
                        const blob = await res.blob();
                        const url = URL.createObjectURL(blob);
                        results.push({ id: cam.id, url });
                    }
                } catch (e) {
                    console.error("Failed to fetch thumbnail", cam.id, e);
                }
            }

            if (isMounted) {
                setThumbnails(results);
                if (results.length > 0) {
                    // Load first full image by default
                    loadFullImage(results[0].id);
                }
            }
        };

        fetchThumbnails();

        return () => {
            isMounted = false;
            thumbnails.forEach((thumb) => URL.revokeObjectURL(thumb.url));
        };
    }, [cameraIds]);

    // Load full image when a camera is selected
    const loadFullImage = async (cameraId: string) => {
        try {
            const res = await fetch(
                `https://kelibackend.vercel.app/api/cameras/${cameraId}`
            );
            if (res.ok) {
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                setSelectedImage(url);
                setSelectedCameraId(cameraId);
            }
        } catch (e) {
            console.error("Failed to load full image", cameraId, e);
        }
    };

    const renderMessage = () => {
        if (isLoading) return "";
        if (isError) return "Error loading cameras";
        if (!cameraIds || cameraIds.length === 0) return "No cameras available";
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
            <div className="max-w-full overflow-x-scroll"
                style={{ width: imageSize }}>
                <ThumbnailScroller
                    thumbnails={thumbnails}
                    selectedCameraId={selectedCameraId}
                    onThumbnailClick={loadFullImage}
                />
            </div>
        </div>
    );
}
