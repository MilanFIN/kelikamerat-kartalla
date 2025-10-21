"use client"

import { useEffect, useState } from "react"

interface NavbarProps {
  toggleMenu: () => void
}

export default function Navbar({ toggleMenu }: NavbarProps) {
  const [isPortrait, setIsPortrait] = useState(
    typeof window !== "undefined" ? window.innerHeight > window.innerWidth : true,
  )

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div
      className={`${
        isPortrait ? "w-full h-20 top-0 left-0 flex flex-row items-center" : "h-full w-20 left-0 top-0 flex flex-col items-center"
      } fixed bg-stone-800/95 dark:bg-stone-900/95 backdrop-blur-sm shadow-lg z-20 ${
        isPortrait ? "px-2 py-2" : "px-2 py-3"
      }`}
    >
      <button
        onClick={toggleMenu}
        className="m-1.5 px-4 py-2.5 text-base font-semibold text-white
                   bg-stone-700 hover:bg-stone-600 rounded-xl transition-all duration-200
                   shadow-sm hover:shadow-md flex items-center justify-center"
        aria-label="Toggle menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <a
        href="https://play.google.com/store/apps/details?id=com.kelikamerat.kartalla"
        target="_blank"
        rel="noopener noreferrer"
        className="m-1.5 p-2.5 bg-stone-700 hover:bg-stone-600 rounded-xl 
                   transition-all duration-200 flex items-center justify-center
                   shadow-sm hover:shadow-md"
        aria-label="Get it on Google Play"
      >
        <img
          src={isPortrait ? "/google_play_horizontal.svg" : "/google_play_vertical.svg"}
          alt="Get it on Google Play"
          className="h-8 w-auto"
        />
      </a>

      <a
        href="https://github.com/MilanFIN/kelikamerat-kartalla"
        target="_blank"
        rel="noopener noreferrer"
        className="m-1.5 p-2.5 bg-stone-700 hover:bg-stone-600 rounded-xl 
                   transition-all duration-200 flex items-center justify-center
                   shadow-sm hover:shadow-md"
        aria-label="View on GitHub"
      >
        <img src="/github-mark-white.svg" alt="GitHub" className="h-8 w-8" />
      </a>
    </div>
  )
}
