"use client"

import React, { createContext, useContext } from "react"
import useLocalStorage from "../hooks/uselocalstorage"

// The only valid language values
export type Language = "en" | "fi"

export type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function useLanguageContext() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error("useLanguageContext must be used within a LanguageProvider")
  }
  return ctx
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persist language selection to localStorage
  const [language, setLanguage] = useLocalStorage<Language>("language", "en")

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}
