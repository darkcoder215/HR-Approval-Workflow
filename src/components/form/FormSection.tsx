"use client";

import React, { createContext, useContext } from "react";
import type { InputTone } from "@/components/ui/inputTones";

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
  // Maps this visual tone to the matching input focus-ring tone so fields
  // inside the section inherit the same accent.
  inputTone: InputTone;
}

const TONES: Record<FormSectionTone, ToneClasses> = {
  green: {
    header: "bg-thmanyah-cream",
    headerHighlight: "bg-thmanyah-green-light/20",
    icon: "text-thmanyah-green",
    iconHighlight: "text-thmanyah-green",
    highlightBorder: "border-thmanyah-green/20",
    inputTone: "green",
  },
  blue: {
    header: "bg-thmanyah-aqua-pale/60",
    headerHighlight: "bg-thmanyah-aqua-pale/80",
    icon: "text-thmanyah-blue",
    iconHighlight: "text-thmanyah-blue",
    highlightBorder: "border-thmanyah-blue/25",
    inputTone: "blue",
  },
  amber: {
    header: "bg-thmanyah-pale-yellow/40",
    headerHighlight: "bg-thmanyah-pale-yellow/70",
    icon: "text-amber-700",
    iconHighlight: "text-amber-700",
    highlightBorder: "border-thmanyah-amber/30",
    inputTone: "amber",
  },
  pink: {
    header: "bg-thmanyah-rose/40",
    headerHighlight: "bg-thmanyah-rose/60",
    icon: "text-thmanyah-burgundy",
    iconHighlight: "text-thmanyah-burgundy",
    highlightBorder: "border-thmanyah-burgundy/20",
    inputTone: "pink",
  },
  sky: {
    header: "bg-thmanyah-sky-light/50",
    headerHighlight: "bg-thmanyah-sky-light/70",
    icon: "text-thmanyah-blue",
    iconHighlight: "text-thmanyah-blue",
    highlightBorder: "border-thmanyah-sky/30",
    inputTone: "sky",
  },
  lavender: {
    header: "bg-thmanyah-lavender/35",
    headerHighlight: "bg-thmanyah-lavender/55",
    icon: "text-thmanyah-charcoal",
    iconHighlight: "text-thmanyah-charcoal",
    highlightBorder: "border-thmanyah-lavender",
    inputTone: "lavender",
  },
  peach: {
    header: "bg-thmanyah-blush/50",
    headerHighlight: "bg-thmanyah-salmon/45",
    icon: "text-thmanyah-red",
    iconHighlight: "text-thmanyah-red",
    highlightBorder: "border-thmanyah-peach/35",
    inputTone: "peach",
  },
  mint: {
    header: "bg-thmanyah-mint/30",
    headerHighlight: "bg-thmanyah-mint/45",
    icon: "text-emerald-700",
    iconHighlight: "text-emerald-700",
    highlightBorder: "border-thmanyah-mint",
    inputTone: "mint",
  },
};

// Context so nested form controls can pick up the section's tone without
// passing the prop individually to every Input / Select / RadioGroup.
const FormSectionToneContext = createContext<InputTone>("green");

export function useFormSectionTone(): InputTone {
  return useContext(FormSectionToneContext);
}

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
    <FormSectionToneContext.Provider value={t.inputTone}>
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
    </FormSectionToneContext.Provider>
  );
}
