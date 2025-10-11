import React, { createContext, useContext } from "react";
import useLocalStorage from "../hooks/uselocalstorage";

export type StoredStation = {
  id: string;
  name: string;
};

export type StationsContextType = {
  stations: StoredStation[];
  addStation: (station: StoredStation) => void;
  removeStation: (id: string) => void;
  clearStations: () => void;
};

const StationsContext = createContext<StationsContextType | null>(null);

export function useStationsContext() {
  const ctx = useContext(StationsContext);
  if (!ctx) {
    throw new Error("useStationsContext must be used within a StationsProvider");
  }
  return ctx;
}

export const StationsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [stations, setStations] = useLocalStorage<StoredStation[]>("stations", []);

  const addStation = (station: StoredStation) => {
    setStations((prev) => {
      // prevent duplicates by ID
      if (prev.some((s) => s.id === station.id)) return prev;
      return [...prev, station];
    });
  };

  const removeStation = (id: string) => {
    setStations((prev) => prev.filter((s) => s.id !== id));
  };

  const clearStations = () => setStations([]);

  return (
    <StationsContext.Provider
      value={{ stations, addStation, removeStation, clearStations }}
    >
      {children}
    </StationsContext.Provider>
  );
};
