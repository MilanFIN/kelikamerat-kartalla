import { useEffect, useState } from "react";

interface NavbarProps {
  toggleMenu: () => void;
}

export default function Navbar({ toggleMenu }: NavbarProps) {
  const [isPortrait, setIsPortrait] = useState(
    typeof window !== "undefined" ? window.innerHeight > window.innerWidth : true
  );

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`${
        isPortrait
          ? "w-full top-0 left-0 flex flex-row"
          : "h-full left-0 top-0 flex flex-col"
      } fixed bg-stone-700 dark:bg-stone-700 shadow-lg z-20`}
    >
      <button
        onClick={toggleMenu}
        className="m-2 px-3 py-2 text-sm font-bold text-stone-200 dark:text-stone-200 
                   bg-stone-600 dark:bg-stone-600 hover:bg-stone-500 dark:hover:bg-stone-500 
                   rounded-xl transition"
      >
        ···
      </button>

      {/* Action button */}
      <button
        className="m-2 px-3 py-2 text-sm font-bold text-stone-200 dark:text-stone-200 
                   bg-stone-600 dark:bg-stone-600 hover:bg-stone-500 dark:hover:bg-stone-500 
                   rounded-xl transition"
      >
        A
      </button>

      {/* Settings button */}
      <button
        className="m-2 px-3 py-2 text-sm font-bold text-stone-200 dark:text-stone-200 
                   bg-stone-600 dark:bg-stone-600 hover:bg-stone-500 dark:hover:bg-stone-500 
                   rounded-xl transition"
      >
        S
      </button>

      {/* Google Play button */}
      <a
        href="https://play.google.com/store"
        target="_blank"
        rel="noopener noreferrer"
        className="m-2 p-2 bg-stone-600 dark:bg-stone-600 hover:bg-stone-500 
                   dark:hover:bg-stone-500 rounded-xl transition flex items-center justify-center"
      >
        <img
          src={isPortrait ? "/google_play_horizontal.svg" : "/google_play_vertical.svg"}
          alt="Get it on Google Play"
          className="h-8 w-auto"
        />
      </a>

      {/* GitHub button */}
      <a
        href="https://github.com/your-repo"
        target="_blank"
        rel="noopener noreferrer"
        className="m-2 p-2 bg-stone-600 dark:bg-stone-600 hover:bg-stone-200 
                   dark:hover:bg-stone-500 rounded-xl transition flex items-center justify-center"
      >
        <img
          src="/github-mark-white.svg"
          alt="GitHub"
          className="h-8 w-8"
        />
      </a>
    </div>
  );
}
