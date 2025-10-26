interface Thumbnail {
    id: string;
    url: string;
}

interface ThumbnailScrollerProps {
    thumbnails: Thumbnail[];
    selectedCameraId: string | null;
    onThumbnailClick: (cameraId: string) => void;
}

export default function ThumbnailScroller({
    thumbnails,
    selectedCameraId,
    onThumbnailClick,
}: ThumbnailScrollerProps) {
    const placeholders = Array.from({ length: 3 });

    return (
        <div className="flex gap-2  h-16 flex-shrink-0 mt-2 scrollbar-always">
            {(thumbnails.length ? thumbnails : placeholders).map((thumb, idx) =>
                thumb ? (
                    <div
                        key={(thumb as Thumbnail).id}
                        onClick={() =>
                            onThumbnailClick((thumb as Thumbnail).id)
                        }
                        className={`w-24 aspect-[16/9] border rounded-lg overflow-hidden flex-shrink-0 cursor-pointer ${
                            selectedCameraId === (thumb as Thumbnail).id
                                ? "opacity-100"
                                : "opacity-60 hover:opacity-100"
                        }`}
                    >
                        <img
                            src={(thumb as Thumbnail).url + "?thumbnail=true"}
                            alt={`Thumbnail ${(thumb as Thumbnail).id}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <div
                        key={idx}
                        className="w-24 aspect-[16/9] border rounded-lg overflow-hidden flex-shrink-0 bg-gray-200 animate-pulse"
                    />
                )
            )}
        </div>
    );
}
