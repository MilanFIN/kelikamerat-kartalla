import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import "leaflet/dist/leaflet.css";
import Navbar from "./Navbar";
import StationMap from "./StationMap";
import StationModal from "./StationModal";
import MenuPanel from "./MenuPanel";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useSearchParams,
} from "react-router-dom";

// Fetcher function
async function fetchStations() {
    const res = await fetch("https://kelibackend.vercel.app/api/stations");
    if (!res.ok) {
        throw new Error("Network response was not ok");
    }
    return res.json();
}
import { useNavigate, useParams } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);
  const navigate = useNavigate();

  const {
    data: stations,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["stations"],
    queryFn: fetchStations,
  });


  const handleStationSelect = (station: { id: string; name: string }) => {
    navigate(`/station?id=${station.id}&name=${encodeURIComponent(station.name)}`);
  };
  

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <StationMap
        stations={stations || []}
        isLoading={isLoading}
        isError={isError}
        onStationSelect={handleStationSelect}
      />

      <Navbar count={count} toggleMenu={() => setMenuVisible(!menuVisible)} />
      <MenuPanel visible={menuVisible} onClose={() => setMenuVisible(false)} />

      <Routes>
        <Route path="/" 
        element={<></>}/>
        <Route
          path="/station"
          element={<StationModalWrapper />}
        />
      </Routes>
    </div>
  );
}

function StationModalWrapper() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
  
    const id = searchParams.get("id");
    const name = searchParams.get("name");
  
    return (
      <StationModal
        stationId={id}
        stationName={name || ""}
        onClose={() => navigate("/")}
      />
    );
  }


export default App;
