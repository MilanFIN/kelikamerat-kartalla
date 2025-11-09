"use client"

import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query";
import "leaflet/dist/leaflet.css"
import "./App.css"
import Navbar from "./Navbar"
import StationMap from "./StationMap"
import StationModal from "./StationModal"
import MenuPanel from "./MenuPanel"
import { Routes, Route, useSearchParams, useNavigate } from "react-router-dom"
import { useLanguageContext } from "./providers/languagecontext"
import { useTranslation } from "react-i18next"

// --- Fetcher functions ---
async function fetchStations() {
  const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/stations")
  if (!res.ok) throw new Error("Network response was not ok")
  return res.json()
}

async function fetchInterestingStations() {
  const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/stuffhappens")
  if (!res.ok) throw new Error("Failed to fetch interesting stations")
  return res.json()
}

function App() {
  const [menuVisible, setMenuVisible] = useState(false)
  const [interestingStations, setInterestingStations] = useState<any[]>([])
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const { language } = useLanguageContext()

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language, i18n])

  // --- Fetch all stations ---
  const {
    data: stations,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["stations"],
    queryFn: fetchStations,
  })
  
  const fetchInteresting = async () => {
    try {
      const data = await fetchInterestingStations()
      console.log("Interesting stations:", data)
      setInterestingStations([...data])
    } catch (err) {
      console.error("Failed to fetch interesting stations:", err)
    }
  }


  const reloadInterestingStations = () => {
    if (!stations) return
    fetchInteresting()
  };

  // --- Fetch interesting stations (after stations have loaded) ---
  useEffect(() => {
    if (!stations) return
    fetchInteresting()
  }, [stations])

  const handleStationSelect = (station: { id: string; name: string }) => {
    navigate(`/station?id=${station.id}&name=${encodeURIComponent(station.name)}`)
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <StationMap
        stations={stations || []}
        interestingStations={interestingStations || []}
        isLoading={isLoading}
        isError={isError}
        onStationSelect={handleStationSelect}
      />

      <Navbar toggleMenu={() => setMenuVisible(!menuVisible)} />
      <MenuPanel
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onStationSelect={handleStationSelect}
        allStations={stations || []}
        interestingStations={interestingStations}
      />

      <Routes>
        <Route path="/" element={<></>} />
        <Route path="/station" element={<StationModalWrapper reloadInterestingStations={reloadInterestingStations}/>} />
      </Routes>
    </div>
  )
}

function StationModalWrapper({ reloadInterestingStations }: { reloadInterestingStations: () => void }) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const id = searchParams.get("id")
  const name = searchParams.get("name")

  return (
    <StationModal
      stationId={id}
      stationName={name || ""}
      onClose={() => navigate("/")}
      reloadInterestingStations={reloadInterestingStations}
    />
  )
}

export default App
