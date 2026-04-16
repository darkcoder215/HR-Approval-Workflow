"use client";

import React from "react";

// Expanded palette per DESIGN_GUIDE_New so we can tint each stat differently
// instead of leaning on a single green accent.
type StatColor =
  | "green"
  | "amber"
  | "red"
  | "blue"
  | "black"
  | "mint"
  | "peach"
  | "sky"
  | "lavender"
  | "rose"
  | "pink"
  | "salmon"
  | "burgundy";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: StatColor;
}

const colorMap: Record<StatColor, string> = {
  green: "bg-thmanyah-green-light/40 text-thmanyah-green",
  mint: "bg-thmanyah-mint/40 text-emerald-700",
  amber: "bg-thmanyah-pale-yellow/60 text-amber-700",
  red: "bg-thmanyah-blush/60 text-thmanyah-red",
  peach: "bg-thmanyah-salmon/50 text-thmanyah-red",
  blue: "bg-thmanyah-aqua-pale/80 text-thmanyah-blue",
  sky: "bg-thmanyah-sky-light/70 text-thmanyah-blue",
  lavender: "bg-thmanyah-lavender/50 text-thmanyah-charcoal",
  rose: "bg-thmanyah-rose/60 text-thmanyah-burgundy",
  pink: "bg-thmanyah-pink-light/50 text-thmanyah-burgundy",
  salmon: "bg-thmanyah-salmon/60 text-thmanyah-red",
  burgundy: "bg-thmanyah-rose/60 text-thmanyah-burgundy",
  black: "bg-thmanyah-cream text-thmanyah-black",
};

export default function StatCard({
  label,
  value,
  icon,
  color = "black",
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-thmanyah-warm-border/60 flex items-start gap-4">
      <div
        className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${colorMap[color]}`}
      >
        {icon}
      </div>
      <div>
        <p className="font-display font-black text-[28px] leading-none">
          {value}
        </p>
        <p className="font-ui text-[13px] text-thmanyah-muted mt-1">{label}</p>
      </div>
    </div>
  );
}
