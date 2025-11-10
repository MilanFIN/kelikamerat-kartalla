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
  reloadInterestingStations: () => void;
}

export default function StationModal({
  stationId,
  stationName,
  onClose,
  reloadInterestingStations,
}: StationModalProps) {
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<"idle" | "ok" | "error">("idle");
  const { language } = useLanguageContext();

  const { stations, addStation, removeStation } = useStationsContext();
  const [isStarred, setIsStarred] = useState(
    stations.some((station: { id: any }) => station.id === stationId)
  );

  const [clearName, setClearName] = useState(stationName);
  const { t } = useTranslation();

  useEffect(() => {
    setClearName(stationName);
  }, [stationName]);

  const gotClearName = (newName: any) => {
    if (newName && typeof newName === "object" && language in newName) {
      setClearName(newName[language]);
    }
  };

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

  const handleSendStation = async () => {
    try {
      if (sendStatus != "idle") return; // Prevent multiple sends
      setSending(true);
      setSendStatus("idle");

      const res = await fetch(
        "https://kelibackend.vercel.app/api/stuffhappens",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({"stationId": stationId} ),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Request failed");
      setSendStatus("ok");
      reloadInterestingStations();
    } catch (err) {
      console.error("Error sending stationId:", err);
      setSendStatus("error");
      setTimeout(() => setSendStatus("idle"), 4000);
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                 z-30 max-w-9/10 max-h-[85vh] bg-stone-800 dark:bg-stone-800 
                 rounded-2xl shadow-2xl border border-stone-700 dark:border-stone-700 
                 p-6 flex flex-col backdrop-blur-sm"
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-3 p-2 rounded-lg text-stone-400 hover:text-stone-200 
                 hover:bg-stone-700 transition-all duration-200 z-40"
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

      <div className="relative w-full h-full">
        <h2 className="text-2xl font-bold text-white mb-4 mr-8">
          {clearName}
        </h2>

        <div className="flex flex-wrap gap-3 mb-6">
          {/* Copy URL */}
          <button
            onClick={handleCopyUrl}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg 
                       bg-blue-500 hover:bg-blue-600 text-white font-medium
                       transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {copied ? "✅ Copied!" : t("copyUrl")}
          </button>

          {/* Bookmark */}
          <button
            onClick={handleToggleStar}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium
                       transition-all duration-200 shadow-sm hover:shadow-md
                       ${
                         isStarred
                           ? "bg-amber-500 hover:bg-amber-600 text-white"
                           : "bg-stone-700 hover:bg-stone-600 text-stone-200"
                       }`}
          >
            {isStarred ? t("bookmarked") : t("bookmark")}
          </button>

          {/* 🔴 Send Button */}
          <button
            onClick={handleSendStation}
            disabled={sending}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium
                       transition-all duration-200 shadow-sm hover:shadow-md
                       ${
                         sending
                           ? "bg-red-300 cursor-not-allowed"
                           : "bg-red-500 hover:bg-red-600 text-white"
                       }`}
          >
            {sending
              ? t("sending")
              : sendStatus === "ok"
              ? "✅ "+ t("sent") +"!"
              : sendStatus === "error"
              ? "⚠️ " + t("error")
              : t("send")}
          </button>
        </div>

        <div className="flex-1 w-full rounded-lg overflow-hidden">
          <ImageViewer stationId={stationId} gotClearName={gotClearName} />
        </div>
      </div>
    </div>
  );
}
