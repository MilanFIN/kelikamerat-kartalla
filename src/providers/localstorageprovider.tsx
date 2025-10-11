import React, { createContext, useContext, useState, useEffect } from "react";

const LocalStorageContext = createContext<{
  storedStations: any[];
  setStoredStations: React.Dispatch<React.SetStateAction<any[]>>;
}>({
  storedStations: [],
  setStoredStations: () => {},
});

/**
 * LocalStorageProvider — wraps your app and provides a shared localStorage-backed state
 */
interface LocalStorageProviderProps {
  children: React.ReactNode;
}

export function LocalStorageProvider({ children }: LocalStorageProviderProps) {
  const [storedStations, setStoredStations] = useState(() => {
    try {
      const item = localStorage.getItem("stations");
      return item ? JSON.parse(item) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage whenever stations change
  useEffect(() => {
    localStorage.setItem("stations", JSON.stringify(storedStations));
  }, [storedStations]);

  // Optional: cross-tab sync
  useEffect(() => {
    const handleStorage = (event:any) => {
      if (event.key === "stations") {
        try {
          setStoredStations(event.newValue ? JSON.parse(event.newValue) : []);
        } catch {
			setStoredStations([]);
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <LocalStorageContext.Provider value={{ storedStations, setStoredStations }}>
      {children}
    </LocalStorageContext.Provider>
  );
}

/**
 * useStations — convenience hook for using the shared stations state
 */
export function useStations() {
  const context = useContext(LocalStorageContext);
  if (!context) {
    throw new Error("useStations must be used within a LocalStorageProvider");
  }
  return context;
}
