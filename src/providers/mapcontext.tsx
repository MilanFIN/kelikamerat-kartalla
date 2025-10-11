import React, { createContext, useContext } from "react";
import useLocalStorage from "../hooks/uselocalstorage";
import { MapType, TILE_URLS } from "../constants/map";


export type MapTypeContextType = {
  mapType: MapType;
  setMapType: (type: MapType) => void;
  tileUrl: string;
};

const MapTypeContext = createContext<MapTypeContextType | null>(null);

export function useMapTypeContext() {
  const ctx = useContext(MapTypeContext);
  if (!ctx) {
    throw new Error("useMapTypeContext must be used within a MapTypeProvider");
  }
  return ctx;
}

/**
 * MapTypeProvider — provides the selected map type and corresponding tile URL.
 */
export const MapTypeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mapType, setMapType] = useLocalStorage<MapType>("mapType", MapType.BRIGHT);
  const tileUrl = TILE_URLS[mapType] ?? TILE_URLS[MapType.BRIGHT];

  return (
    <MapTypeContext.Provider value={{ mapType, setMapType, tileUrl }}>
      {children}
    </MapTypeContext.Provider>
  );
};
