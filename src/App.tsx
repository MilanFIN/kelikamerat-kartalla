"use client"


import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import "leaflet/dist/leaflet.css"
import "./App.css";
import Navbar from "./Navbar"
import StationMap from "./StationMap"
import StationModal from "./StationModal"
import MenuPanel from "./MenuPanel"
import { Routes, Route, useSearchParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useLanguageContext } from "./providers/languagecontext"
import { useTranslation } from "react-i18next"

// Fetcher function
async function fetchStations() {
  const res = await fetch(import.meta.env.VITE_BACKEND_URL+"/api/stations")
  if (!res.ok) {
    throw new Error("Network response was not ok")
  }
  return res.json()
}

function App() {
  const [menuVisible, setMenuVisible] = useState(false)
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const { language } = useLanguageContext()

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language, i18n])

  const {
    data: stations,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["stations"],
    queryFn: fetchStations,
  })

  const handleStationSelect = (station: { id: string; name: string }) => {
    navigate(`/station?id=${station.id}&name=${encodeURIComponent(station.name)}`)
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <StationMap
        stations={stations || []}
        isLoading={isLoading}
        isError={isError}
        onStationSelect={handleStationSelect}
      />

      <Navbar toggleMenu={() => setMenuVisible(!menuVisible)} />
      <MenuPanel visible={menuVisible} onClose={() => setMenuVisible(false)} onStationSelect={handleStationSelect} />

      <Routes>
        <Route path="/" element={<></>} />
        <Route path="/station" element={<StationModalWrapper />} />
      </Routes>
    </div>
  )
}

function StationModalWrapper() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const id = searchParams.get("id")
  const name = searchParams.get("name")

  return <StationModal stationId={id} stationName={name || ""} onClose={() => navigate("/")} />
}

export default App
