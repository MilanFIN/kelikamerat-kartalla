"use client";

import { useEffect, useState } from "react";
import ImageViewer from "./ImageViewer";
import { useStationsContext } from "./providers/stationscontext";
import { useTranslation } from "react-i18next";
import { useLanguageContext } from "./providers/languagecontext";

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
    const { language } = useLanguageContext()

    const { stations, addStation, removeStation } = useStationsContext();
    const [isStarred, setIsStarred] = useState(
        stations.some((station: { id: any }) => station.id === stationId)
    );

    const [clearName, setClearName] = useState(stationName);

    const { t } = useTranslation();

    useEffect(() => {
        setClearName(stationName);
    }, [stationName]);

    //todo: make language change make the name change without reopening modal 
    const gotClearName = (newName: any) =>  {
        console.log(newName, language);
        if (newName && typeof newName === "object" && language in newName) {
            setClearName(newName[language]);
        }
    }

    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 7000);
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
                       z-30 max-w-9/10   max-h-[85vh] bg-white dark:bg-stone-800 
                       rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-700 
                       p-6 flex flex-col backdrop-blur-sm"
        >
            {" "}
            <button
                onClick={onClose}
                className="absolute top-3 right-3 p-2 rounded-lg text-stone-500 hover:text-stone-700 
                 dark:text-stone-400 dark:hover:text-stone-200 
                 hover:bg-stone-100 dark:hover:bg-stone-700 
                 transition-all duration-200 z-40"
                aria-label="Close modal"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>
            <div className="relative w-full h-full ">
                    <h2 className="text-2xl font-bold text-stone-900 dark:text-white leading-tight mb-4 mr-8">
                        {clearName}
                    </h2>

                <div className="flex gap-3 mb-6">
                    <button
                        onClick={handleCopyUrl}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg 
                                   bg-blue-500 hover:bg-blue-600 text-white font-medium
                                   transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                        {copied ? (
                            <>
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                                <span>{t("copied")}</span>
                            </>
                        ) : (
                            <>
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                    />
                                </svg>
                                <span>{t("copyUrl")}</span>
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleToggleStar}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium
                                   transition-all duration-200 shadow-sm hover:shadow-md
                                   ${
                                       isStarred
                                           ? "bg-amber-500 hover:bg-amber-600 text-white"
                                           : "bg-stone-100 hover:bg-stone-200 dark:bg-stone-700 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-200"
                                   }`}
                        aria-label={
                            isStarred ? "Remove bookmark" : "Add bookmark"
                        }
                    >
                        <svg
                            className="w-5 h-5"
                            fill={isStarred ? "currentColor" : "none"}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                        </svg>
                        <span>
                            {isStarred ? t("bookmarked") : t("bookmark")}
                        </span>
                    </button>
                </div>

                <div className="flex-1 w-full rounded-lg overflow-hidden  ">
                    <ImageViewer stationId={stationId} gotClearName={gotClearName} />
                </div>
            </div>
        </div>
    );
}
