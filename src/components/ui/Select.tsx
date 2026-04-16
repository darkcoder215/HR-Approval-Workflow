"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { INPUT_TONES, InputTone } from "./inputTones";
import { useFormSectionTone } from "@/components/form/FormSection";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hint?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  tone?: InputTone;
}

export default function Select({
  label,
  hint,
  error,
  options,
  placeholder = "اختر...",
  id,
  required,
  className = "",
  tone,
  ...props
}: SelectProps) {
  const sectionTone = useFormSectionTone();
  const selectId = id || label.replace(/\s+/g, "-");
  const t = INPUT_TONES[tone ?? sectionTone];
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={selectId}
        className="font-ui font-medium text-[14px] text-thmanyah-black"
      >
        {label}
        {required && <span className="text-thmanyah-red mr-1">*</span>}
      </label>
      {hint && (
        <p className="text-[13px] text-thmanyah-muted font-ui leading-relaxed">
          {hint}
        </p>
      )}
      <div className="relative">
        <select
          id={selectId}
          required={required}
          className={`
            w-full px-4 py-3 rounded-xl appearance-none
            bg-white border border-thmanyah-warm-border
            font-ui text-[14px] text-thmanyah-black
            transition-all duration-200
            hover:border-thmanyah-muted/40
            ${t.focus}
            focus:outline-none cursor-pointer
            ${error ? "border-thmanyah-red ring-2 ring-thmanyah-red/20" : ""}
            ${className}
          `}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-thmanyah-muted pointer-events-none" />
      </div>
      {error && (
        <p className="text-[12px] text-thmanyah-red font-ui">{error}</p>
      )}
    </div>
  );
}
