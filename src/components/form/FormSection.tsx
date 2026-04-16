"use client";

import React from "react";

// Tone palette mirrors DESIGN_GUIDE_New §3 and the SECTION_TONES map in
// settings/page.tsx. Picking a varied hue per section keeps a long form
// readable instead of leaning on a single green accent.
export type FormSectionTone =
  | "green"
  | "blue"
  | "amber"
  | "pink"
  | "sky"
  | "lavender"
  | "peach"
  | "mint";

interface ToneClasses {
  header: string;
  headerHighlight: string;
  icon: string;
  iconHighlight: string;
  highlightBorder: string;
}

const TONES: Record<FormSectionTone, ToneClasses> = {
  green: {
    header: "bg-thmanyah-cream",
    headerHighlight: "bg-thmanyah-green-light/20",
    icon: "text-thmanyah-green",
    iconHighlight: "text-thmanyah-green",
    highlightBorder: "border-thmanyah-green/20",
  },
  blue: {
    header: "bg-thmanyah-aqua-pale/60",
    headerHighlight: "bg-thmanyah-aqua-pale/80",
    icon: "text-thmanyah-blue",
    iconHighlight: "text-thmanyah-blue",
    highlightBorder: "border-thmanyah-blue/25",
  },
  amber: {
    header: "bg-thmanyah-pale-yellow/40",
    headerHighlight: "bg-thmanyah-pale-yellow/70",
    icon: "text-amber-700",
    iconHighlight: "text-amber-700",
    highlightBorder: "border-thmanyah-amber/30",
  },
  pink: {
    header: "bg-thmanyah-rose/40",
    headerHighlight: "bg-thmanyah-rose/60",
    icon: "text-thmanyah-burgundy",
    iconHighlight: "text-thmanyah-burgundy",
    highlightBorder: "border-thmanyah-burgundy/20",
  },
  sky: {
    header: "bg-thmanyah-sky-light/50",
    headerHighlight: "bg-thmanyah-sky-light/70",
    icon: "text-thmanyah-blue",
    iconHighlight: "text-thmanyah-blue",
    highlightBorder: "border-thmanyah-sky/30",
  },
  lavender: {
    header: "bg-thmanyah-lavender/35",
    headerHighlight: "bg-thmanyah-lavender/55",
    icon: "text-thmanyah-charcoal",
    iconHighlight: "text-thmanyah-charcoal",
    highlightBorder: "border-thmanyah-lavender",
  },
  peach: {
    header: "bg-thmanyah-blush/50",
    headerHighlight: "bg-thmanyah-salmon/45",
    icon: "text-thmanyah-red",
    iconHighlight: "text-thmanyah-red",
    highlightBorder: "border-thmanyah-peach/35",
  },
  mint: {
    header: "bg-thmanyah-mint/30",
    headerHighlight: "bg-thmanyah-mint/45",
    icon: "text-emerald-700",
    iconHighlight: "text-emerald-700",
    highlightBorder: "border-thmanyah-mint",
  },
};

interface FormSectionProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  highlight?: boolean;
  tone?: FormSectionTone;
}

export default function FormSection({
  title,
  subtitle,
  icon,
  children,
  highlight = false,
  tone = "green",
}: FormSectionProps) {
  const t = TONES[tone];
  return (
    <div
      className={`
        rounded-2xl overflow-hidden
        ${highlight ? `border-2 ${t.highlightBorder}` : ""}
      `}
    >
      <div
        className={`
          px-6 py-4 flex items-center gap-3
          ${highlight ? t.headerHighlight : t.header}
        `}
      >
        {icon && (
          <span className={`shrink-0 ${highlight ? t.iconHighlight : t.icon}`}>
            {icon}
          </span>
        )}
        <div>
          <h3 className="font-display font-bold text-[18px] text-thmanyah-black">
            {title}
          </h3>
          {subtitle && (
            <p className="font-ui text-[13px] text-thmanyah-muted mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="bg-white p-6 flex flex-col gap-5">{children}</div>
    </div>
  );
}
