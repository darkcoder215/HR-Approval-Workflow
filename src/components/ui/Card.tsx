"use client";

import React from "react";

// Tones match the shared Thmanyah extended palette. When specified, the card
// grows a 3px top rail in the chosen hue and its background picks up a very
// light tint — enough to telegraph identity without drowning the surface.
export type CardTone =
  | "neutral"
  | "green"
  | "blue"
  | "amber"
  | "pink"
  | "sky"
  | "lavender"
  | "peach"
  | "mint"
  | "burgundy";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  tone?: CardTone;
}

const paddings = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const tones: Record<CardTone, { rail: string; tint: string }> = {
  neutral: { rail: "", tint: "bg-white" },
  green: { rail: "bg-thmanyah-green", tint: "bg-gradient-to-b from-thmanyah-green-light/20 to-white" },
  blue: { rail: "bg-thmanyah-blue", tint: "bg-gradient-to-b from-thmanyah-aqua-pale/50 to-white" },
  amber: { rail: "bg-thmanyah-amber", tint: "bg-gradient-to-b from-thmanyah-pale-yellow/35 to-white" },
  pink: { rail: "bg-thmanyah-hot-pink", tint: "bg-gradient-to-b from-thmanyah-rose/30 to-white" },
  sky: { rail: "bg-thmanyah-sky", tint: "bg-gradient-to-b from-thmanyah-sky-light/40 to-white" },
  lavender: { rail: "bg-thmanyah-lavender", tint: "bg-gradient-to-b from-thmanyah-lavender/25 to-white" },
  peach: { rail: "bg-thmanyah-peach", tint: "bg-gradient-to-b from-thmanyah-blush/40 to-white" },
  mint: { rail: "bg-thmanyah-mint", tint: "bg-gradient-to-b from-thmanyah-mint/25 to-white" },
  burgundy: { rail: "bg-thmanyah-burgundy", tint: "bg-gradient-to-b from-thmanyah-rose/30 to-white" },
};

export default function Card({
  children,
  className = "",
  padding = "md",
  tone = "neutral",
}: CardProps) {
  const t = tones[tone];
  return (
    <div
      className={`
        relative rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden
        ${t.tint}
        ${paddings[padding]}
        ${className}
      `}
    >
      {tone !== "neutral" && (
        <div
          aria-hidden
          className={`absolute inset-x-0 top-0 h-[3px] ${t.rail}`}
        />
      )}
      {children}
    </div>
  );
}
