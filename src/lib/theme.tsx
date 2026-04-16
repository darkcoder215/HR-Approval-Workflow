"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// Two visual themes coexist: "classic" is the original warm off-white palette,
// "bold" is a dark-canvas dramatic reimagining. The user picks between them
// from a toggle in the header — their choice lives in localStorage so the
// selection survives refreshes. A small inline script in the root layout
// applies the saved attribute before first paint to avoid a theme flash.

export type Theme = "classic" | "bold";
const STORAGE_KEY = "thmanyah-theme";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "classic",
  setTheme: () => {},
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("classic");

  // Rehydrate from storage on mount. The inline script already set the DOM
  // attribute pre-paint; we just need to mirror it into React state so the
  // toggle button renders in the right position.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "bold" || saved === "classic") {
        setThemeState(saved);
      } else {
        document.documentElement.setAttribute("data-theme", "classic");
      }
    } catch {
      // localStorage may be unavailable (private mode, etc.) — fall back to classic.
    }
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    document.documentElement.setAttribute("data-theme", t);
    try {
      window.localStorage.setItem(STORAGE_KEY, t);
    } catch {
      // Ignore write failures — theme still applies for the current session.
    }
  };

  const toggle = () => setTheme(theme === "classic" ? "bold" : "classic");

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
