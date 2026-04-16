// Shared focus/selection palette for form controls (Input, Textarea, Select,
// RadioGroup). Keeping this in one place means we can tie a FormSection's
// `tone` to its inputs' focus ring color without copy-pasting class strings.

export type InputTone =
  | "green"
  | "blue"
  | "amber"
  | "pink"
  | "sky"
  | "lavender"
  | "peach"
  | "mint";

export interface InputToneClasses {
  // Focus ring + border for text inputs, textareas, selects.
  focus: string;
  // Selected-option border for RadioGroup tiles.
  selectedBorder: string;
  // Selected-option background tint for RadioGroup tiles.
  selectedBg: string;
  // Selected-option ring for RadioGroup tiles.
  selectedRing: string;
  // Inner dot fill for selected radios.
  radioBorder: string;
  radioDot: string;
}

export const INPUT_TONES: Record<InputTone, InputToneClasses> = {
  green: {
    focus:
      "focus:border-thmanyah-green focus:ring-2 focus:ring-thmanyah-green/20",
    selectedBorder: "border-thmanyah-green",
    selectedBg: "bg-thmanyah-green-light/20",
    selectedRing: "ring-2 ring-thmanyah-green/20",
    radioBorder: "border-thmanyah-green",
    radioDot: "bg-thmanyah-green",
  },
  blue: {
    focus:
      "focus:border-thmanyah-blue focus:ring-2 focus:ring-thmanyah-blue/20",
    selectedBorder: "border-thmanyah-blue",
    selectedBg: "bg-thmanyah-aqua-pale/60",
    selectedRing: "ring-2 ring-thmanyah-blue/20",
    radioBorder: "border-thmanyah-blue",
    radioDot: "bg-thmanyah-blue",
  },
  amber: {
    focus:
      "focus:border-thmanyah-amber focus:ring-2 focus:ring-thmanyah-amber/25",
    selectedBorder: "border-thmanyah-amber",
    selectedBg: "bg-thmanyah-pale-yellow/40",
    selectedRing: "ring-2 ring-thmanyah-amber/25",
    radioBorder: "border-thmanyah-amber",
    radioDot: "bg-thmanyah-amber",
  },
  pink: {
    focus:
      "focus:border-thmanyah-hot-pink focus:ring-2 focus:ring-thmanyah-hot-pink/20",
    selectedBorder: "border-thmanyah-hot-pink",
    selectedBg: "bg-thmanyah-rose/40",
    selectedRing: "ring-2 ring-thmanyah-hot-pink/20",
    radioBorder: "border-thmanyah-hot-pink",
    radioDot: "bg-thmanyah-hot-pink",
  },
  sky: {
    focus:
      "focus:border-thmanyah-sky focus:ring-2 focus:ring-thmanyah-sky/30",
    selectedBorder: "border-thmanyah-sky",
    selectedBg: "bg-thmanyah-sky-light/50",
    selectedRing: "ring-2 ring-thmanyah-sky/30",
    radioBorder: "border-thmanyah-sky",
    radioDot: "bg-thmanyah-sky",
  },
  lavender: {
    focus:
      "focus:border-thmanyah-lavender focus:ring-2 focus:ring-thmanyah-lavender/50",
    selectedBorder: "border-thmanyah-lavender",
    selectedBg: "bg-thmanyah-lavender/30",
    selectedRing: "ring-2 ring-thmanyah-lavender/50",
    radioBorder: "border-thmanyah-lavender",
    radioDot: "bg-thmanyah-lavender",
  },
  peach: {
    focus:
      "focus:border-thmanyah-peach focus:ring-2 focus:ring-thmanyah-peach/25",
    selectedBorder: "border-thmanyah-peach",
    selectedBg: "bg-thmanyah-blush/40",
    selectedRing: "ring-2 ring-thmanyah-peach/25",
    radioBorder: "border-thmanyah-peach",
    radioDot: "bg-thmanyah-peach",
  },
  mint: {
    focus:
      "focus:border-thmanyah-mint focus:ring-2 focus:ring-thmanyah-mint/40",
    selectedBorder: "border-thmanyah-mint",
    selectedBg: "bg-thmanyah-mint/25",
    selectedRing: "ring-2 ring-thmanyah-mint/40",
    radioBorder: "border-thmanyah-mint",
    radioDot: "bg-thmanyah-mint",
  },
};
