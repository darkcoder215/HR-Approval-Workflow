"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme";

// Small pill-shaped toggle the user drops into a top nav. Icon flips between
// moon (go-dark) and sun (go-light). RTL-friendly: the button itself is
// symmetric so no directional flip needed.
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isBold = theme === "bold";
  return (
    <button
      type="button"
      onClick={toggle}
      title={isBold ? "الوضع الكلاسيكي" : "الوضع الداكن"}
      aria-label={isBold ? "تبديل إلى الوضع الكلاسيكي" : "تبديل إلى الوضع الداكن"}
      className={`w-9 h-9 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer ${className}`}
    >
      {isBold ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
