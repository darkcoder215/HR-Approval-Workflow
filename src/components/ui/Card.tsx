"use client";

import React from "react";
import { useTheme } from "@/lib/theme";

// Tones match the shared Thmanyah extended palette. Each card can opt into a
// colored identity — classic mode paints a 3px top rail + a soft gradient wash,
// bold mode reimagines the same tone as a translucent glass tile with a
// matching colored border + soft colored glow. The component swaps between
// the two based on the active theme so a single `tone=` prop travels cleanly.
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

// Classic mode: rail + gradient wash. White canvas, cheerful vibe.
const classicTones: Record<CardTone, { rail: string; tint: string }> = {
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

// Bold mode: glass tile on dark canvas. Each tone picks its own colored
// border + inner gradient tint + outer glow so the card reads unmistakably.
const boldTones: Record<CardTone, { rail: string; surface: string; glow: string }> = {
  neutral: {
    rail: "",
    surface: "bg-white/[0.035] backdrop-blur-xl border border-white/10",
    glow: "",
  },
  green: {
    rail: "bg-thmanyah-green",
    surface: "bg-gradient-to-b from-thmanyah-green/[0.14] to-white/[0.02] backdrop-blur-xl border border-thmanyah-green/30",
    glow: "shadow-[0_0_40px_-8px_rgba(0,193,122,0.35)]",
  },
  blue: {
    rail: "bg-thmanyah-blue",
    surface: "bg-gradient-to-b from-thmanyah-blue/[0.18] to-white/[0.02] backdrop-blur-xl border border-thmanyah-blue/30",
    glow: "shadow-[0_0_40px_-8px_rgba(0,114,249,0.40)]",
  },
  amber: {
    rail: "bg-thmanyah-amber",
    surface: "bg-gradient-to-b from-thmanyah-amber/[0.16] to-white/[0.02] backdrop-blur-xl border border-thmanyah-amber/30",
    glow: "shadow-[0_0_40px_-8px_rgba(255,188,10,0.35)]",
  },
  pink: {
    rail: "bg-thmanyah-hot-pink",
    surface: "bg-gradient-to-b from-thmanyah-hot-pink/[0.16] to-white/[0.02] backdrop-blur-xl border border-thmanyah-hot-pink/30",
    glow: "shadow-[0_0_40px_-8px_rgba(255,0,183,0.35)]",
  },
  sky: {
    rail: "bg-thmanyah-sky",
    surface: "bg-gradient-to-b from-thmanyah-sky/[0.16] to-white/[0.02] backdrop-blur-xl border border-thmanyah-sky/35",
    glow: "shadow-[0_0_40px_-8px_rgba(132,219,229,0.35)]",
  },
  lavender: {
    rail: "bg-thmanyah-lavender",
    surface: "bg-gradient-to-b from-thmanyah-lavender/[0.18] to-white/[0.02] backdrop-blur-xl border border-thmanyah-lavender/35",
    glow: "shadow-[0_0_40px_-8px_rgba(209,196,226,0.35)]",
  },
  peach: {
    rail: "bg-thmanyah-peach",
    surface: "bg-gradient-to-b from-thmanyah-peach/[0.16] to-white/[0.02] backdrop-blur-xl border border-thmanyah-peach/35",
    glow: "shadow-[0_0_40px_-8px_rgba(255,145,114,0.35)]",
  },
  mint: {
    rail: "bg-thmanyah-mint",
    surface: "bg-gradient-to-b from-thmanyah-mint/[0.16] to-white/[0.02] backdrop-blur-xl border border-thmanyah-mint/35",
    glow: "shadow-[0_0_40px_-8px_rgba(178,226,186,0.35)]",
  },
  burgundy: {
    rail: "bg-thmanyah-burgundy",
    surface: "bg-gradient-to-b from-thmanyah-burgundy/[0.22] to-white/[0.02] backdrop-blur-xl border border-thmanyah-burgundy/40",
    glow: "shadow-[0_0_40px_-8px_rgba(130,0,58,0.40)]",
  },
};

export default function Card({
  children,
  className = "",
  padding = "md",
  tone = "neutral",
}: CardProps) {
  const { theme } = useTheme();

  if (theme === "bold") {
    const t = boldTones[tone];
    return (
      <div
        className={`
          relative rounded-2xl overflow-hidden
          ${t.surface}
          ${t.glow}
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

  const t = classicTones[tone];
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
