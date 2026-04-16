# Thmanyah Commentator Tool — Design Guide

> Derived from **Thmanyah Brand Identity v2.0** (هوية ثمانية — الدليل الإرشادي — إصدار 2.0)
> This guide governs every UI decision in the Commentator Analysis Tool.

---

## 1. Brand Essence

**Thmanyah (ثمانية)** is a Saudi media company dedicated to enriching Arabic content on the internet. The brand identity is built on three core principles:

| Principle (Arabic) | Principle (English) | Meaning |
|---|---|---|
| وضوح بلا تعقيد | Clarity without complexity | No unnecessary words, no filler. Every element earns its place. |
| الفكرة قبل الأسلوب | Idea before style | Content leads design, not the other way around. No decorative fluff. |
| نبرة تشبهك | A tone that resembles you | Speak to users like a knowledgeable friend — warm, direct, respectful of their intelligence. |

**Application to our tool:** The Commentator Analysis Tool should feel clear, confident, and authoritative — like a trusted colleague reviewing match commentary. No unnecessary ornamentation, no clutter. Data speaks first, design amplifies it.

### 1.1 Visual Tenets (derived from the Web Library PDFs)

The Thmanyah Web Library (Hero, Card, Modal, Footer, Navigation, Dropdown) demonstrates six consistent visual rules that override any general intuition:

1. **Dark is the canvas, not a mode.** Nearly every production surface uses a black / near-black background. Light backgrounds are reserved for interior cards, editorial contexts, and inverted buttons — not the page itself.
2. **Everything is a pill or a soft rectangle.** There is no sharp 90° corner anywhere in the library. Buttons, badges, inputs, modals, cards, dropdowns, and even the hero match-info chips are all fully or generously rounded.
3. **Micro-badges frame every title.** A page/section title is almost always accompanied by 2–4 small pill-shaped meta badges beneath it, each prefixed with the Thmanyah **✦ star-burst** glyph.
4. **Content breathes inside generous containers.** Components are showcased inside a very large rounded container (radius ≈ 24–32px) with substantial internal padding (≥ 48px). The container is what signals "this is a component."
5. **Variants are laid out as a labeled matrix.** Every component documents its states in a two-column layout: a left-hand label (e.g., *Default State*, *On Scroll*, *Breakpoint*) and a right-hand group of boxed examples each with their own sub-label pill.
6. **RTL and breakpoint parity is non-negotiable.** Every component in the library is shown in both Arabic and English, and across Desktop / Tablet / Mobile. Designs that ship without all six cells of that matrix are incomplete.

---

## 2. Logo

### 2.1 Text Logo (الشعار النصي)
- Arabic: **ثمانية** (derived from Naskh calligraphy)
- English: **thmanyah** (custom serif logotype)
- High contrast, sharp terminals, balanced proportions
- Used in headers, footers, and branding areas

### 2.2 Icon Logo (الشعار الأيقوني)
- Geometric symbol derived from the Arabic numeral **٨** (eight)
- A pointed, diamond-like star shape with concave curves
- Used as app icon, favicon, compact branding mark
- File: `Usable/thamanyah.png`

### 2.3 Logo Colors
| Context | Logo Color | Background |
|---|---|---|
| Primary (dark mode) | White `#FFFFFF` | Black `#000000` |
| Primary (light mode) | Black `#000000` | White `#FFFFFF` |
| On photography | White `#FFFFFF` | Image (ensure contrast) |

### 2.4 Safe Space
- Minimum clear space around the logo = **1x** the height of the letter **ث** in the Arabic logotype
- Never crowd the logo with other elements

### 2.5 Sub-brand Composition
- When pairing with sub-brands, use the icon logo + sub-brand name
- Icon sits to the right of the Arabic sub-brand name (RTL layout)
- Maintain consistent spacing between icon and text

---

## 3. Color Palette

All colors extracted directly from the brand guidelines PDF. The palette is inspired by nature — sky, earth, and everyday life.

### 3.1 Primary Colors

| Name | Hex | Pantone | Usage |
|---|---|---|---|
| **Thmanyah Black** | `#000000` | K100 | Primary text, dark backgrounds, logo |
| **Thmanyah Green** | `#00C17A` | — | Brand accent, section headers, CTAs, success states |
| **Thmanyah Green (Light)** | `#B5E8BE` | — | Light green backgrounds, section header labels |
| **Off-White / Warm White** | `#F7F4EE` | — | Page backgrounds, cards, light surfaces |
| **Warm Gray** | `#F2EDEA` | Pantone Cool Gray 1 C | Subtle backgrounds, dividers, sidebar |

### 3.2 Accent Colors (Brand Blue & Red)

| Name | Hex | Pantone | Usage |
|---|---|---|---|
| **Thmanyah Blue** | `#0072F9` | Pantone 300 C | Links, interactive elements, data highlights |
| **Thmanyah Red** | `#F24935` | Pantone 7417 C | Alerts, low scores, critical indicators, icon logo accent |

### 3.3 Extended Palette

| Name | Hex | Pantone | Usage |
|---|---|---|---|
| **Burgundy** | `#82003A` | Pantone 7421 C | Deep accent, critical warnings |
| **Hot Pink** | `#FF00B7` | Pantone 806 C | Highlights, decorative emphasis |
| **Amber / Gold** | `#FFBC0A` | Pantone 7408 C | Warnings, medium scores, highlights |
| **Charcoal** | `#2B2D3F` | — | Dark UI surfaces, secondary dark text |
| **Dark Slate** | `#111421` | Pantone 426 C | Deepest dark backgrounds |
| **Muted Indigo** | `#494C6B` | — | Secondary text on dark, subtle borders |
| **Lavender** | `#D1C4E2` | Pantone 270 C | Light decorative accent |
| **Light Pink** | `#FFA5C6` | Pantone 189 C | Soft accent, badges |
| **Rose** | `#FFC9D8` | — | Soft pink backgrounds |
| **Pale Yellow** | `#F9E59E` | Pantone 127 C | Highlight backgrounds, notes |
| **Bright Yellow** | `#FFDD56` | — | Bold highlights, attention grabbers |
| **Peach** | `#FF9172` | Pantone 1635 C | Warm accent, mid-range indicators |
| **Salmon** | `#FFBAA3` | — | Soft warm accent |
| **Blush** | `#FFD1C4` | Pantone 489 C | Soft warm backgrounds |
| **Mint** | `#B2E2BA` | Pantone 572 C | Positive indicators, success tints |
| **Sky Blue** | `#84DBE5` | Pantone 2975 C | Info states, cool accent |
| **Light Sky** | `#AFE2EA` | — | Cool light backgrounds |
| **Pale Aqua** | `#D1EDEF` | Pantone 5315 C | Very light info backgrounds |

### 3.4 Neutral System

| Name | Hex | Usage |
|---|---|---|
| **Pure Black** | `#000000` | Primary text, headings |
| **Dark Charcoal** | `#111421` | Deep backgrounds |
| **Charcoal** | `#2B2D3F` | Dark cards, nav backgrounds |
| **Muted** | `#494C6B` | Secondary text, placeholders |
| **Light Warm** | `#EFEDE2` | Borders, subtle dividers |
| **Cream** | `#F4F2ED` | Card backgrounds |
| **Off-White** | `#F7F4EE` | Page background |
| **Pure White** | `#FFFFFF` | Clean surfaces, modals |

### 3.5 Semantic Color Mapping (for the Commentator Tool)

| State | Color | Hex |
|---|---|---|
| **Excellent / High Score** | Thmanyah Green | `#00C17A` |
| **Good** | Mint | `#B2E2BA` |
| **Average / Warning** | Amber | `#FFBC0A` |
| **Below Average** | Peach | `#FF9172` |
| **Poor / Critical** | Thmanyah Red | `#F24935` |
| **Info / Neutral** | Sky Blue | `#84DBE5` |
| **Interactive / Link** | Thmanyah Blue | `#0072F9` |

---

## 4. Typography

### 4.1 Font Families

Three custom font families are available, all in the `Usable/` directory:

| Font Family | Files | Purpose | Character |
|---|---|---|---|
| **Thmanyah Serif Display** | `Thmanyahserifdisplay12-*.otf` | Headlines, hero text, section titles | Elegant, high-contrast serif with sharp terminals. Designed for impact. |
| **Thmanyah Serif Text** | `Thmanyahseriftext12-*.otf` | Body text, articles, long-form content | Optimized for readability at text sizes. Smooth and balanced. |
| **Thmanyah Sans** | `Thmanyahsans12-*.otf` | Digital UI, buttons, labels, data | Clean, modern sans-serif. No contrast. Perfect for screens. |

### 4.2 Available Weights

Each family comes in five weights:

| Weight | CSS weight | File suffix |
|---|---|---|
| Light | `300` | `-Light` |
| Regular | `400` | `-Regular` / `-Reg` |
| Medium | `500` | `-Medium` |
| Bold | `700` | `-Bold` |
| Black | `900` | `-Black` |

### 4.3 Font Usage Hierarchy

| Element | Font Family | Weight | Suggested Sizes |
|---|---|---|---|
| **Page Title / Hero** | Serif Display | Bold / Black | 36–48px |
| **Section Heading (H1)** | Serif Display | Bold | 28–32px |
| **Sub-heading (H2)** | Serif Display | Medium | 22–26px |
| **Card Title (H3)** | Sans | Bold | 18–20px |
| **Body Text** | Serif Text | Regular | 16–18px |
| **Small Body / Caption** | Sans | Regular | 14px |
| **Label / Tag** | Sans | Medium | 12–13px |
| **Button Text** | Sans | Bold | 14–16px |
| **Data / Numbers** | Sans | Medium / Bold | 14–24px (contextual) |
| **Score Display (large)** | Serif Display | Black | 48–72px |

### 4.4 CSS @font-face Setup

```css
/* Headlines — Thmanyah Serif Display */
@font-face {
  font-family: 'Thmanyah Serif Display';
  src: url('./Usable/Thmanyahserifdisplay12-Light.otf') format('opentype');
  font-weight: 300;
  font-style: normal;
}
@font-face {
  font-family: 'Thmanyah Serif Display';
  src: url('./Usable/Thmanyahserifdisplay12-Reg.otf') format('opentype');
  font-weight: 400;
  font-style: normal;
}
@font-face {
  font-family: 'Thmanyah Serif Display';
  src: url('./Usable/Thmanyahserifdisplay12-Medium.otf') format('opentype');
  font-weight: 500;
  font-style: normal;
}
@font-face {
  font-family: 'Thmanyah Serif Display';
  src: url('./Usable/Thmanyahserifdisplay12-Bold.otf') format('opentype');
  font-weight: 700;
  font-style: normal;
}
@font-face {
  font-family: 'Thmanyah Serif Display';
  src: url('./Usable/Thmanyahserifdisplay12-Black.otf') format('opentype');
  font-weight: 900;
  font-style: normal;
}

/* Body Text — Thmanyah Serif Text */
@font-face {
  font-family: 'Thmanyah Serif Text';
  src: url('./Usable/Thmanyahseriftext12-Light.otf') format('opentype');
  font-weight: 300;
  font-style: normal;
}
@font-face {
  font-family: 'Thmanyah Serif Text';
  src: url('./Usable/Thmanyahseriftext12-Regular.otf') format('opentype');
  font-weight: 400;
  font-style: normal;
}
@font-face {
  font-family: 'Thmanyah Serif Text';
  src: url('./Usable/Thmanyahseriftext12-Medium.otf') format('opentype');
  font-weight: 500;
  font-style: normal;
}
@font-face {
  font-family: 'Thmanyah Serif Text';
  src: url('./Usable/Thmanyahseriftext12-Bold.otf') format('opentype');
  font-weight: 700;
  font-style: normal;
}
@font-face {
  font-family: 'Thmanyah Serif Text';
  src: url('./Usable/Thmanyahseriftext12-Black.otf') format('opentype');
  font-weight: 900;
  font-style: normal;
}

/* Digital / UI — Thmanyah Sans */
@font-face {
  font-family: 'Thmanyah Sans';
  src: url('./Usable/Thmanyahsans12-Light.otf') format('opentype');
  font-weight: 300;
  font-style: normal;
}
@font-face {
  font-family: 'Thmanyah Sans';
  src: url('./Usable/Thmanyahsans12-Regular.otf') format('opentype');
  font-weight: 400;
  font-style: normal;
}
@font-face {
  font-family: 'Thmanyah Sans';
  src: url('./Usable/Thmanyahsans12-Medium.otf') format('opentype');
  font-weight: 500;
  font-style: normal;
}
@font-face {
  font-family: 'Thmanyah Sans';
  src: url('./Usable/Thmanyahsans12-Bold.otf') format('opentype');
  font-weight: 700;
  font-style: normal;
}
@font-face {
  font-family: 'Thmanyah Sans';
  src: url('./Usable/Thmanyahsans12-Black.otf') format('opentype');
  font-weight: 900;
  font-style: normal;
}
```

---

## 5. CSS Design Tokens

```css
:root {
  /* ── Primary ── */
  --color-black: #000000;
  --color-white: #FFFFFF;
  --color-green: #00C17A;
  --color-green-light: #B5E8BE;
  --color-green-pale: #B2E2BA;

  /* ── Brand Accents ── */
  --color-blue: #0072F9;
  --color-red: #F24935;

  /* ── Extended Palette ── */
  --color-burgundy: #82003A;
  --color-hot-pink: #FF00B7;
  --color-amber: #FFBC0A;
  --color-yellow-bright: #FFDD56;
  --color-yellow-pale: #F9E59E;
  --color-peach: #FF9172;
  --color-salmon: #FFBAA3;
  --color-blush: #FFD1C4;
  --color-pink-light: #FFA5C6;
  --color-rose: #FFC9D8;
  --color-lavender: #D1C4E2;
  --color-sky-blue: #84DBE5;
  --color-sky-light: #AFE2EA;
  --color-aqua-pale: #D1EDEF;
  --color-mint: #B2E2BA;

  /* ── Neutrals ── */
  --color-dark-slate: #111421;
  --color-charcoal: #2B2D3F;
  --color-muted: #494C6B;
  --color-warm-gray: #EFEDE2;
  --color-cream: #F4F2ED;
  --color-off-white: #F7F4EE;
  --color-warm-white: #F2EDEA;

  /* ── Semantic ── */
  --color-success: #00C17A;
  --color-warning: #FFBC0A;
  --color-error: #F24935;
  --color-info: #0072F9;

  /* ── Score Gradation ── */
  --score-excellent: #00C17A;
  --score-good: #B2E2BA;
  --score-average: #FFBC0A;
  --score-below-average: #FF9172;
  --score-poor: #F24935;

  /* ── Typography ── */
  --font-display: 'Thmanyah Serif Display', 'Georgia', serif;
  --font-body: 'Thmanyah Serif Text', 'Georgia', serif;
  --font-ui: 'Thmanyah Sans', 'Segoe UI', 'Helvetica Neue', sans-serif;

  /* ── Spacing (4/8px grid) ──
     The library consistently aligns to a 4px base. Prefer these tokens over
     ad-hoc pixel values. Section gutters (--space-16, --space-20) separate
     top-level blocks; component-internal gaps use --space-3 through --space-6. */
  --space-1: 4px;    /* hairline gaps, icon-to-label pairing */
  --space-2: 8px;    /* pill-badge internal padding, chip spacing */
  --space-3: 12px;   /* tight list items, dropdown rows */
  --space-4: 16px;   /* default card internal gap, button padding-y */
  --space-5: 20px;   /* comfortable form field gap */
  --space-6: 24px;   /* card internal padding, section headline gap */
  --space-8: 32px;   /* inter-component gap inside a showcase */
  --space-10: 40px;  /* showcase container inner padding (mobile) */
  --space-12: 48px;  /* showcase container inner padding (desktop) */
  --space-16: 64px;  /* gap between top-level sections */
  --space-20: 80px;  /* hero vertical padding */
  --space-24: 96px;  /* page-title block bottom margin */

  /* ── Border Radius (soft rounded corners per brand) ──
     Nothing in the Thmanyah library has sharp 90° corners. Choose:
       - sm  → inline highlights, tiny indicators
       - md  → form fields, small tags
       - lg  → cards, modals
       - xl  → hero media, large cards
       - 2xl → component showcase containers (the "Copy me" wrapper)
       - full → pill buttons, status badges, chips, nav-pill-on-scroll */
  --radius-xs: 4px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-2xl: 32px;
  --radius-full: 9999px;

  /* ── Shadows ──
     The brand favors flat dark surfaces. Shadows are subtle and exist mainly
     to lift light cards off the page background, and to float modals over a
     darkened scrim. Never drop-shadow dark-on-dark surfaces. */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
  --shadow-modal: 0 24px 64px rgba(0, 0, 0, 0.45);

  /* ── Showcase container (the "Copy me" wrapper used across the library) ── */
  --showcase-radius: 32px;
  --showcase-padding-y: 80px;
  --showcase-padding-x: 48px;
  --showcase-bg: #1A1A1D;          /* slightly lifted from pure black */
  --showcase-border: 1px solid rgba(255, 255, 255, 0.04);

  /* ── Layout ── */
  --content-max-width: 1280px;
  --sidebar-width: 260px;
  --nav-height: 64px;
  --nav-height-compact: 52px;      /* on-scroll collapsed nav */

  /* ── Z-index scale ── */
  --z-nav: 100;
  --z-dropdown: 200;
  --z-modal-scrim: 900;
  --z-modal: 1000;
  --z-toast: 1100;
}
```

---

## 6. Visual Style Rules

### 6.1 Highlight Style (أسلوب الهاي لايت)
The brand's signature editorial device. A colored background highlight is placed behind key text to draw attention.

**Implementation:**
- Use a soft, semi-transparent or solid pastel color behind important text
- Apply with `background-color`, slight padding, and a small (`4–6px`) radius so the highlight matches the brand's soft-corner grammar
- Colors typically: light green `#B5E8BE`, pale yellow `#F9E59E`, blush `#FFD1C4`, light pink `#FFA5C6`
- Use for: score labels, key metrics, commentator names, important findings
- **Never** run a highlight across a line-break — reflow the copy so the highlight stays on one line.

```css
.highlight {
  background-color: var(--color-green-light);
  padding: 2px 8px;
  border-radius: var(--radius-xs);
  display: inline;
}
```

### 6.2 Soft Rounded Shapes (الإطار)
Soft, rounded geometry is the single most consistent shape signal in the Thmanyah library.

**Rules:**
- No element in the library has a sharp 90° corner — not even dividers or small indicators.
- Buttons, badges, chips, live indicators, duration tags, OTP boxes, and inputs are **fully pill-shaped** (`border-radius: 9999px`) unless they must contain multi-line text.
- Cards and modals use `--radius-lg` to `--radius-xl` (16–24px).
- Component showcase wrappers and hero media use `--radius-2xl` (32px).
- Inline highlights use `--radius-xs` (4px) — the only place tiny radii appear.
- Thumbnails and image containers mirror the radius of the card they live in (never less than the card's radius, never more).

### 6.3 Layout Direction (RTL-first)
The Thmanyah library is designed **Arabic-first**. Every component in the six reference PDFs is shown in Arabic first, then English.

- Set `dir="rtl"` on the root HTML element for Arabic contexts.
- Mirror **all** horizontal layouts: logo position, nav order, button order, list-item indicators, icon placement relative to labels, chevrons/arrows.
- Keep numerals, timestamps (`23:59:59`, `2:00`), match scores, and Latin brand names in LTR even inside RTL blocks — use `<bdi>` or `unicode-bidi: isolate` so they don't get reordered.
- Pair every label with its Arabic counterpart in the component library (e.g., `Live` / `رشابم`, `Watch Now` / `نآلا دهاش`, `Full Time` / `ةارابملا ةياهن`).

### 6.4 Background Philosophy (dark-first)

The library's dominant surface is **black**. Light surfaces are used deliberately, not by default.

| Surface | Color | Notes |
|---|---|---|
| Page background (product) | `#000000` | Nav, hero, footer, modal scrim all sit on true black |
| Component showcase wrapper | `#1A1A1D` | Slightly lifted black; used behind every "Copy me" demo |
| Card (dark context) | `#111421` / `#1A1A1D` | With 1px `rgba(255,255,255,0.04)` border, no shadow |
| Card (light editorial context) | `#FFFFFF` | With `--shadow-sm`, on `#F7F4EE` page |
| Modal scrim | `rgba(0, 0, 0, 0.72)` | Deeper than the typical 0.5 — the brand prefers a committed overlay |
| Modal surface | `#111421` (dark) or `#FFFFFF` (light form modals) | Rounded at `--radius-xl` |
| Section headers (editorial) | `#00C17A` | White text, pill or soft-rectangle label |
| Data tables | Alternating `#FFFFFF` / `#F7F4EE` in light contexts; `#111421` / `#1A1A1D` in dark |

**Decision rule:** if the screen is navigation, hero, player, listing, or any "branded surface," default to **dark**. If the screen is a form, a long-form document, or a data dense tool like the Commentator Analysis Tool, you may use the light `#F7F4EE` canvas — but your top nav and footer should still be dark.

### 6.5 Light Mode (Editorial / Tool Context)
Used for long-form reading and data tools. Even here, the nav and footer remain dark — this is a signature of the brand.

| Surface | Color |
|---|---|
| Page background | `#F7F4EE` |
| Cards | `#FFFFFF` with `--shadow-sm` |
| Top nav / footer | `#000000` (always) |
| Primary text | `#000000` |
| Secondary text | `#494C6B` |

### 6.6 Pill Badges with Star Glyph (meta tags)
A recurring pattern across every library page: a title is followed by a row of small pill badges, each prefixed with the Thmanyah **✦** (eight-point star-burst) icon.

**Shape & sizing:**
- Height: 24–28px
- Horizontal padding: 10–12px
- Radius: `--radius-full`
- Gap between badge and its icon: 6px
- Gap between badges in a row: 8px
- Border: 1px solid `rgba(255, 255, 255, 0.12)` on dark; `rgba(0, 0, 0, 0.08)` on light
- Font: Thmanyah Sans Medium, 12–13px

**Usage:**
- Under page/section titles as a category breadcrumb (e.g., `✦ Hero Section` · `✦ Web` · `✦ Done`)
- Never more than 4 in a row
- Never as primary actions — they are purely informational

### 6.7 Component Showcase Wrapper ("Copy me" container)
Every component in the library is presented inside an oversized rounded container. When documenting or laying out a component in the design system, use this same wrapper.

**Specs:**
- Background: `var(--showcase-bg)` (`#1A1A1D`)
- Radius: `var(--showcase-radius)` (32px)
- Padding: `var(--showcase-padding-y) var(--showcase-padding-x)` (80px 48px)
- Min-height: 420px so the component sits in visual breathing room
- Border: `var(--showcase-border)`
- Centered content by default

**"Copy me" handwritten callout (optional, for design files only):**
- A playful amber arrow + handwritten label used in Figma/PDF documentation
- **Do not ship this into the product** — it is a documentation device, not a UI pattern

### 6.8 Variant Matrix Layout (documentation pattern)
All six reference PDFs document variants using the same two-column grid. Adopt this for internal documentation and Storybook pages.

```
┌─────────────────────────────────────────────────────────────┐
│  Variants & states                                          │  H2, Serif Display Bold
├───────────────┬─────────────────────────────────────────────┤
│               │  ┌─[Default]───────────────────────────┐    │
│  Default      │  │                                      │   │
│  State        │  │    <component example>              │   │
│               │  └──────────────────────────────────────┘   │
│               │  ┌─[Hover]─────────────────────────────┐    │
│               │  │                                      │   │
│               │  │    <component example>              │   │
│               │  └──────────────────────────────────────┘   │
├───────────────┼─────────────────────────────────────────────┤
│  Breakpoint   │  ┌─[Desktop]─[Tablet]─[Mobile]────────┐    │
│               │  │                                     │    │
│               │  └─────────────────────────────────────┘    │
└───────────────┴─────────────────────────────────────────────┘
```

**Rules:**
- Left column: 180–240px wide, label in Serif Display Medium 18–22px
- Right column: flexible, holds grouped example blocks
- Each example block has a small pill sub-label at its top-left (e.g., `Default`, `Hover`, `Desktop`)
- Row gap: `--space-8` (32px); column gap: `--space-12` (48px)
- Every component must document at minimum: **State × Language (AR/EN) × Breakpoint (Desktop/Tablet/Mobile)**

### 6.9 Indentation & Sectioning Rhythm
The library maintains a consistent vertical rhythm between top-level page blocks.

| Boundary | Spacing |
|---|---|
| Page top → Hero title | `--space-20` (80px) |
| Title → meta pill row | `--space-4` (16px) |
| Meta pill row → showcase wrapper | `--space-12` (48px) |
| Showcase → next section heading | `--space-16` (64px) |
| Section heading → first content row | `--space-8` (32px) |
| Row → next row (in variant matrix) | `--space-8` (32px) |
| Bottom of last section → page end | `--space-24` (96px) |

For in-component rhythm (inside a card, modal, dropdown):
- Edge padding: 24px desktop, 20px tablet, 16px mobile
- Title → body: 8–12px
- Body → actions: 24px
- Actions gap: 8–12px between buttons

### 6.10 Separators & Dividers
- The brand uses the **middle-dot** (`·`, U+00B7) as an inline meta separator: `Saudi League · Round 30 · Wednesday, June 4`. Wrap it in 8px horizontal margin.
- Horizontal rules are rare. Prefer background-color alternation or generous whitespace.
- When a rule is necessary: 1px, `rgba(255, 255, 255, 0.08)` on dark, `rgba(0, 0, 0, 0.06)` on light.

---

## 7. Iconography

### 7.1 Style
- **Line icons** with consistent 2px stroke weight
- Simple, clean, minimal detail
- Rounded terminals matching the brand's soft geometry
- Consistent sizing: 24x24px default, 20x20px small, 32x32px large
- On dark surfaces, icons use pure white (`#FFFFFF`) — no gray secondary tint

### 7.2 Brand Glyphs (used in the Web Library)
These small glyphs appear throughout the reference PDFs and should be treated as first-class brand marks.

| Glyph | Visual | Usage |
|---|---|---|
| **Star-burst (٨-derived)** | `✦` 4-point star with pinched waist | Prefix for meta-pill badges (`✦ Section`, `✦ Web`, `✦ Done`). Also appears in the nav rail. |
| **Heart** | outline heart | Favorites / wishlist affordance in the top-right of nav |
| **Ring / circle** | hollow circle | User avatar placeholder / account entry |
| **App-grid** | 2×2 dots | Apps launcher / category grid |
| **Wave** | short sine glyph | Audio / now-playing indicator |

**Placement in the top utility rail (seen on every library page):** heart → circle → app-grid → wave → star-burst, right-aligned, 20px each, 16px gap.

### 7.3 Recommended Icon Categories for Commentator Tool
- **Microphone** — represents commentary/audio
- **Play/Pause** — audio playback controls
- **Chart/Graph** — analytics and scores
- **Clock** — timing, match duration
- **Star/Trophy** — ratings and excellence
- **Warning triangle** — issues identified
- **Checkmark** — passed criteria
- **X mark** — failed criteria
- **Search** — finding specific moments
- **Download/Export** — report generation
- **Settings/Gear** — configuration

---

## 8. Component Design Patterns

This section documents the six components defined in the Thmanyah Web Library PDFs (Navigation, Hero, Card, Dropdown, Modal, Footer) plus the tool-specific components that extend them.

### 8.1 Navigation Bar (from `Thmanyah navagation.pdf`)

A horizontal top bar that is the first dark surface on every page.

**Anatomy (RTL, from right to left in Arabic):**
- `thmanyah` wordmark (Serif Display)
- Primary nav links: `الرئيسية` / `رياضة` / `برامج`  (Home / Sports / Shows)
- Search affordance (icon, expands to full input in "Center State")
- Account: `الدخول` pill button (Login) for guests, or avatar circle for registered users

**Geometry:**
- Height: `--nav-height` (64px) default; `--nav-height-compact` (52px) on scroll
- Background: `#000000` default, morphs to a **floating rounded pill** on scroll — max-width 960px, centered, `--radius-full`, slight translucency (`rgba(0,0,0,0.88)` + backdrop-blur)
- Horizontal padding: 24px desktop, 20px tablet, 16px mobile
- Logo ↔ links gap: 32px
- Link ↔ link gap: 24px
- Link style: Sans Medium 14px, white, no underline; hover bumps to Sans Bold

**States (all documented in the PDF):**
| State | Visual |
|---|---|
| **Default — Guest** | full-width bar, `Login` pill button on the end |
| **Default — Registered** | full-width bar, avatar circle on the end |
| **On Scroll — Guest/Registered** | bar collapses into a floating rounded pill, shadow softens |
| **Center State** | search input expands, nav links hide; `Cancel` (`عجارت`) appears |

**Mobile layout:**
- Logo left, hamburger + user avatar right
- Opens a full-height drawer from the top with primary links stacked
- "Download the app — GET" banner appears at the top of the drawer (pill CTA)
- Search becomes a full-width input with a `Cancel` action to the left

### 8.2 Hero Section (from `Thmanyah hero.pdf`)

The hero is the most visually loaded component in the library. Six content variants:

1. **Homepage Hero** — show/episode promo
2. **Showpage Hero** — program detail
3. **Match — Live** — live football match
4. **Match — Finished** — final score with Summary / Full Match CTAs
5. **Match — Upcoming** — countdown / kickoff time
6. **Club / League page** — identity header with the club/league logo

**Common geometry:**
- Full-bleed media background with a **bottom-left gradient layer** (`linear-gradient(to top right, rgba(0,0,0,0.85), transparent 60%)`) so the text always has contrast
- Content sits in the bottom-left quadrant (bottom-right in RTL) with ~80px edge padding desktop, 40px tablet, 24px mobile
- Content stack order (top → bottom):
  1. Category row: `✦ Program · Category` (micro pills)
  2. Title (Serif Display Bold, 48–72px desktop)
  3. 2-line description (Serif Text Regular, 16–18px, `max-width: 52ch`)
  4. Primary CTA: `Watch Now` / `نآلا دهاش` — white pill button, black label
- Radius on the hero container: `--radius-2xl` (32px) when embedded inside a page, `0` when full-bleed on the viewport

**Live Match hero specifics:**
- Red `Live` / `رشابم` pill badge at the top of the content stack
- Two team columns with their logos, names (Sans Bold 22px) and scores
- Score shown as big number + optional penalty score in parentheses `(3)`
- Meta row: `Saudi League · Round 30 · Wednesday, June 4` (bullet-separated)
- `HDR 10` badge pinned to the top opposite corner

**Finished Match:**
- `Full Time` / `ةارابملا ةياهن` pill
- Two CTAs: `Summary` (inverse pill) + `Full Match` (primary pill)

**Upcoming Match:**
- Big countdown timer `3:00` in Serif Display Black
- Stadium location pill (e.g., `AlShabab Stadium` / `بعلم بابشلا`)

**Club / League page:**
- Logo centered
- Club/League name in Serif Display Bold
- Subtitle (e.g., `Saudi Roshn League`) in Serif Text Regular

### 8.3 Card (from `Thmanyah card.pdf`)

The video/episode card is the core content unit.

**Layouts (all appear in the PDF):**
| Layout | Description |
|---|---|
| **Vertical** | thumbnail on top, metadata stacked below — default grid card |
| **Horizontal** | thumbnail left (or right in RTL), metadata on the opposite side |
| **Compact** | small thumbnail, short title, no description |

**Thumbnail:**
- Aspect ratio: 16:9
- Radius: `--radius-lg` (16px)
- Background: `#1A1A1D` placeholder when media is loading
- **Duration pill** at the bottom-trailing corner: 8px inset from edges, dark background `rgba(0,0,0,0.72)`, Sans Medium 11px, radius `--radius-full`, padding `4px 8px`
- **Live pill** at the bottom-leading corner: red `#F24935`, with a broadcast-wave glyph, same padding as duration pill
- **Play-progress indicator** (optional) — a thin 2px bar at the bottom of the thumbnail showing watched progress
- **Resume icon** (↻) in the bottom-trailing corner for partially-watched items

**Metadata block (below / beside the thumbnail):**
- Title: Sans Bold 14–16px, 2-line clamp
- Description (optional, horizontal layout only): Serif Text Regular 13px, muted, 2-line clamp
- Meta row: `Duration · Date` with bullet separator, Sans Regular 12px, muted

**Spacing:**
- Thumbnail → title: 12px
- Title → description: 6px
- Description → meta: 8px
- Card outer padding: 0 (the card IS the content; spacing lives in the grid gap, 16–24px)

### 8.4 Dropdown (from `Thmanyah Dropdown.pdf`)

**Container:**
- Background: `#1A1A1D` on dark context, `#FFFFFF` on light
- Radius: `--radius-lg` (16px) — rounded, not sharp
- Padding: 8px (gives internal items breathing room)
- Border: 1px solid `rgba(255,255,255,0.06)` on dark; `rgba(0,0,0,0.06)` on light
- Min-width: 220px
- Max-height: 320px with internal scroll
- Shadow (when open): `--shadow-lg`

**Item (list row):**
- Height: 36px
- Horizontal padding: 12px
- Internal layout: label on the trailing side, radio/check indicator on the leading side (mirrored in RTL)
- Radio indicator: 14px hollow circle, fills with brand green on selection
- Default text: Sans Regular 14px, muted on dark
- **Hover state:** background lifts to `rgba(255,255,255,0.06)`, text goes to full white
- **Selected state:** same as hover + filled radio
- Item-to-item gap: 0 (contiguous list), but each item has internal padding

**Dropdown Modes (from the PDF):**
- **Default** — static list
- **Hover** — the single hovered item has the lifted background

### 8.5 Modal (from `Thmanyah modal.pdf`)

The PDF documents three modal families: **Modal Message** (status), **Verification Modal** (form with input), and generic **Modal** (content + actions).

**Scrim:**
- `rgba(0, 0, 0, 0.72)` full-viewport overlay
- Click-through outside the modal closes it (unless blocking)

**Modal container:**
- Background: `#111421` (dark) or `#FFFFFF` (light form context)
- Radius: `--radius-xl` (24px)
- Width: 440px default, 520px for forms; full-width minus 24px margin on mobile
- Padding: 32px desktop/tablet, 24px mobile
- Shadow: `--shadow-modal`
- Centered both axes on desktop/tablet; bottom-sheet on mobile (radius on top two corners only: 24px 24px 0 0)

**Structure (top → bottom):**
1. **Icon / illustration** (optional) — 40–64px, centered, 16px bottom margin. Can be emoji-style `✅` / `❌` or a custom SVG.
2. **Title** — Serif Display Medium 20–24px, center or start-aligned (both variants documented)
3. **Description** — Serif Text Regular 14–16px, muted, max 2–3 lines
4. **Input field** (for Verification Modal) — Email / Phone / OTP / Text variants, pill-shaped
5. **Action row** — stacked on mobile, inline on desktop; primary button leads, inverse trails

**Alignment variants (PDF):**
- **Start** — all text left-aligned (right in RTL)
- **Center** — all text center-aligned, icon centered

**Verification Modal input types:**
| Type | Spec |
|---|---|
| **Email** | single pill input, placeholder `ana@thmanyah.com` |
| **Phone** | flag + country-code prefix (`🇸🇦 +966`), then number |
| **OTP** | 4 or 6 square boxes with radius `--radius-md`, 12px gap, plus a countdown `-2:00` and `Resend code in:` label |
| **Text** | single pill input, free text |

**Action buttons:**
- Primary ("Action" / `بسانملا ءارجإلا`): white bg on dark / black bg on light, pill
- Inverse ("Inverse Action" / `رشابمو حضاو لعف`): transparent with 1px border, pill
- On mobile: stack vertically, primary on top, inverse below, both full-width

### 8.6 Footer (from `Thmanyah footer.pdf`)

Always a dark bar regardless of page context.

**Anatomy (RTL):**
- Logo (`ثمانية` wordmark) on the trailing edge (right in Arabic)
- Link row: `مركز المساعدة · شروط الاستخدام · سياسة الخصوصية · تفعيل القسائم · التواصل · عن ثمانية`
- Social icons row (WhatsApp, Facebook, X, Instagram, YouTube)
- Copyright line: `© جميع الحقوق محفوظة لشركة ثمانية للنشر والتوزيع`
- Language toggle at the far end: `EN` / `يبرع`

**Geometry:**
- Background: `#000000` (always, even in light mode)
- Vertical padding: 40px desktop, 32px tablet, 24px mobile
- Horizontal padding: matches page gutters (72px desktop, 32px tablet, 16px mobile)
- Logo height: 24px
- Link row gap: 24px desktop, 20px tablet
- Social icons: 20px, 12px gap
- Link style: Sans Regular 13px, white at 72% opacity; hover = 100%

**Breakpoints (documented):**
- **Desktop** — logo trailing, links inline beside logo, copyright + language on a second row
- **Tablet** — same structure, tighter gaps
- **Mobile** — everything stacks: logo top, links stacked vertically, social icons + copyright row at the bottom

### 8.7 Score Cards (tool-specific, built on the card pattern)
Large numerical score displayed prominently using **Serif Display Black** at 48–72px, with a colored background indicator:

```
┌─────────────────────────────┐  radius: var(--radius-lg) (16px)
│                             │  bg: #FFFFFF (light) / #1A1A1D (dark)
│      ╭─────────╮            │
│      │  85/100  │           │  Score: Serif Display Black, 48px
│      ╰─────────╯            │  Highlight: #B5E8BE (green-light)
│                             │
│  Overall Performance        │  Label: Sans Medium, 14px, #494C6B
│  Commentator: أحمد الطيب    │  Name: Sans Bold, 16px, #000000
└─────────────────────────────┘
```

### 8.8 Metric Bars
Horizontal progress bars with rounded ends:

```
Label ████████████████░░░░░░ 78%
      ╰── filled: #00C17A ──╯╰─ empty: #EFEDE2 ─╯
      border-radius: var(--radius-full)
      height: 8px
```

### 8.9 Data Tables
- Header row: `#000000` background, white text, Sans Bold
- Body rows: alternating `#FFFFFF` and `#F7F4EE` (light) or `#111421` and `#1A1A1D` (dark)
- Cell padding: 12–16px
- Outer container radius: `--radius-md` (12px), clipped with `overflow: hidden`
- No visible cell borders — use row background alternation for separation

### 8.10 Buttons (unified system)
| Type | Background | Text | Border |
|---|---|---|---|
| Primary (on dark) | `#FFFFFF` | `#000000` | none |
| Primary (on light) | `#000000` | `#FFFFFF` | none |
| Inverse (on dark) | transparent | `#FFFFFF` | 1px solid `rgba(255,255,255,0.24)` |
| Inverse (on light) | `#FFFFFF` | `#000000` | 1px solid `#EFEDE2` |
| Accent | `#00C17A` | `#FFFFFF` | none |
| Danger | `#F24935` | `#FFFFFF` | none |
| Ghost | transparent | inherit | none |

All buttons: `border-radius: var(--radius-full)` (pill), `padding: 10px 24px` (14px font) or `12px 28px` (16px font), Sans Bold. Minimum height 40px (`36px` for compact).

### 8.11 Audio Player Component
- Dark bar at bottom or embedded in analysis view
- Waveform visualization using brand green `#00C17A`
- Play/pause button: circular, `#00C17A` background, 48px diameter
- Progress bar: `#00C17A` fill on `#2B2D3F` track, `--radius-full`, height 4px
- Timestamps: Sans Regular, 12px

---

## 9. Page Layout Guidelines

### 9.1 Grid System
- 12-column grid for desktop
- Gutter: 16px content-level, 24px card-level
- Max content width: `--content-max-width` (1280px)
- Sidebar: `--sidebar-width` (260px) fixed width
- Page horizontal margin: 72px desktop, 32px tablet, 16px mobile (matches the footer)

### 9.2 Spacing
Follow a **4/8px base grid**. Use the tokens in `--space-1` through `--space-24`. Avoid ad-hoc values.

- **Tight** (intra-component): 4px, 8px, 12px
- **Default** (card-internal): 16px, 24px
- **Loose** (between cards): 24px, 32px
- **Section gaps** (between top-level blocks): 48px, 64px
- **Hero padding**: 80px vertical
- **Page-title bottom margin**: 96px

### 9.3 Card Layout
- Cards sit on the appropriate page background (`#000000` dark, `#F7F4EE` light)
- Dark cards: `#111421` or `#1A1A1D` with 1px `rgba(255,255,255,0.04)` border, no shadow
- Light cards: `#FFFFFF` with `var(--shadow-sm)`
- Border-radius: `--radius-lg` (16px) default, `--radius-xl` (24px) for hero cards
- Internal padding: 24px desktop, 20px tablet, 16px mobile
- Gap between cards in a grid: 16px (tight) / 24px (default)

### 9.4 Content Container Hierarchy
There are three nesting levels of rounded containers:

```
┌──────────────────────────────────────────────────┐   Page (radius: 0)
│  ╔════════════════════════════════════════════╗  │
│  ║ Showcase / Hero (radius: --radius-2xl 32px)║  │
│  ║   ┌──────────────────────────────────────┐ ║  │
│  ║   │ Card (radius: --radius-lg 16px)      │ ║  │
│  ║   │   ┌────────────────────────────────┐ │ ║  │
│  ║   │   │ Thumbnail / media (16px)       │ │ ║  │
│  ║   │   └────────────────────────────────┘ │ ║  │
│  ║   │   ┌─[Pill chip / badge (full)]─┐    │ ║  │
│  ║   │   └─────────────────────────────┘    │ ║  │
│  ║   └──────────────────────────────────────┘ ║  │
│  ╚════════════════════════════════════════════╝  │
└──────────────────────────────────────────────────┘
```

**Rule:** an inner container's radius is always ≤ its parent's radius. Never place a 32px-radius element inside a 16px-radius card — the corners will look wrong.

---

## 10. Brand Application: Commentator Tool Specific

### 10.1 Analysis Report Layout
```
┌──────────────────────────────────────────────────────┐
│ ◆ Thmanyah Logo    Commentator Analysis Tool   [⚙]  │  Top bar: black bg
├───────┬──────────────────────────────────────────────┤
│       │                                              │
│ NAV   │  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│       │  │ Overall   │  │ Voice    │  │ Language  │   │  Score cards row
│ ■ Home│  │ Score: 82 │  │ Score: 78│  │ Score: 90│   │
│ ■ Ana │  └──────────┘  └──────────┘  └──────────┘   │
│ ■ Rep │                                              │
│ ■ Set │  ┌────────────────────────────────────────┐  │
│       │  │ Detailed Breakdown                     │  │  Analysis section
│       │  │ ═══════════════════════════════════════ │  │
│       │  │ Criteria 1   ████████████░░░░  75%     │  │
│       │  │ Criteria 2   █████████████████  92%    │  │
│       │  │ Criteria 3   ██████░░░░░░░░░░  38%     │  │
│       │  └────────────────────────────────────────┘  │
│       │                                              │
│       │  ┌────────────────────────────────────────┐  │
│       │  │ 🎙 Audio Timeline                      │  │  Audio player
│       │  │ ▶ ═══●══════════════════════  12:34    │  │
│       │  └────────────────────────────────────────┘  │
└───────┴──────────────────────────────────────────────┘
```

### 10.2 Voice & Tone in UI Copy
Following Thmanyah's brand voice:
- **Be direct:** "Score: 82/100" not "The commentator achieved a score of approximately 82 out of 100 points"
- **Be warm:** "Great performance in vocabulary diversity" not "Vocabulary diversity metric: PASS"
- **Be respectful:** Frame feedback constructively — "Room for improvement in pacing" not "Failed: pacing"
- **Use Arabic naturally:** Primary language is Arabic. All labels, instructions, and feedback in Arabic first.

### 10.3 Score Presentation
- Scores displayed as large numbers with the highlight style behind them
- Color-coded based on the semantic mapping (Section 3.5)
- Circular or radial progress indicators use `#00C17A` as the fill color
- Background track: `#EFEDE2`

---

## 11. Responsive Breakpoints

The Thmanyah library standardizes on **three breakpoints** (Desktop / Tablet / Mobile), shown side-by-side for every component in the reference PDFs. Designs must be validated in all three.

| Breakpoint | Width | Layout | Page gutter | Nav |
|---|---|---|---|---|
| **Desktop (Large)** | ≥1280px | Sidebar + 3-column content, centered container capped at 1280px | 72px | Full horizontal bar, morphs to floating pill on scroll |
| **Desktop** | ≥1024px | Sidebar + 2-column content | 48–72px | Same as large |
| **Tablet** | ≥768px | Collapsible sidebar, single content column | 32px | Nav stays horizontal; dense spacing |
| **Mobile** | <768px | Stacked, bottom nav | 16px | Top bar: logo + hamburger + avatar; drawer menu; `Download the app — GET` promo at top of drawer |

**Universal rule from the PDFs:** at mobile, every component with paired actions (modal buttons, hero CTAs, footer links) **stacks vertically** — horizontal action rows are a desktop/tablet affordance only.

---

## 12. Asset Reference

| Asset | Path | Notes |
|---|---|---|
| Logo (PNG) | `Usable/thamanyah.png` | White icon on black, for dark backgrounds |
| Serif Display fonts | `Usable/Thmanyahserifdisplay12-*.otf` | 5 weights |
| Serif Text fonts | `Usable/Thmanyahseriftext12-*.otf` | 5 weights |
| Sans fonts | `Usable/Thmanyahsans12-*.otf` | 5 weights |
| Brand Guidelines PDF | `Usable/هوية ثمانية  (1).pdf` | 52-page source document |

---

## 13. Do's and Don'ts

### Do:
- Default to a dark page surface (`#000000`) for branded experiences — nav, hero, player, listings
- Use generous whitespace — let content breathe (80px hero padding, 48px showcase padding, 64px between sections)
- Pill-shape every button, badge, chip, status indicator, and input (`--radius-full`)
- Use soft radii on everything else — 16px cards, 24px modals, 32px showcase wrappers
- Apply the highlight style to draw attention to key metrics
- Prefix meta/category pills with the `✦` star-burst glyph
- Keep the color palette restrained — mostly neutrals with green/blue/red accents
- Prioritize RTL layout with proper Arabic typography, and ship every component in both AR and EN
- Validate every component at Desktop, Tablet, **and** Mobile before calling it done
- Use the middle-dot `·` as the meta separator (`Saudi League · Round 30 · June 4`)
- Stack paired action buttons vertically on mobile
- Use the Thmanyah Sans font for all UI elements and data
- Use Thmanyah Serif Display for impactful headlines and scores
- Keep the footer and top nav dark even when the rest of the page is light
- Maintain the nesting rule: inner radius ≤ parent radius

### Don't:
- Don't use sharp 90° corners anywhere — not on cards, buttons, inputs, dividers, thumbnails, nothing
- Don't default to a light page background for branded/marketing surfaces
- Don't stack horizontal actions on mobile — always stack them vertically
- Don't drop shadows on dark-on-dark surfaces (use a subtle `rgba(255,255,255,0.04)` border instead)
- Don't ship a component without its Arabic counterpart
- Don't use colors outside the defined palette
- Don't crowd the interface — every element needs space
- Don't use decorative elements that don't serve a purpose (the handwritten "Copy me" callout is documentation-only, never ship it)
- Don't modify the logo proportions, colors, or add effects to it
- Don't use more than 2–3 accent colors on a single screen
- Don't mix font families within a single text block
- Don't place more than 4 meta pills in a single row under a title
- Don't use the logo smaller than the minimum safe size

---

*This guide should be consulted for every UI component, page layout, and design decision in the Thmanyah Commentator Analysis Tool. When in doubt, refer back to the three core principles: clarity, substance over style, and warmth.*

---

## 14. Source PDF Cross-Reference

The component specs in Section 8 and the shape/section/spacing rules in Section 6 are derived directly from the six Web Library PDFs in this repository. Use this table to jump back to the primary source when specifying a new variant.

| Source PDF | Covers | Section in this guide |
|---|---|---|
| `🧩 🖥️ Web Library - Thmanyah navagation .pdf` | Navigation bar — Default, On Scroll, Center, Search, Guest vs Registered, Desktop/Tablet/Mobile | §8.1 |
| `🧩 🖥️ Web Library - Thmanyah hero.pdf` | Hero Section — Homepage, Showpage, Match (Live/Finished/Upcoming), Club/League, Gradient Layer | §8.2 |
| `🧩 🖥️ Web Library - Thmanyah card.pdf` | Cards — Vertical, Horizontal, Compact; Live, Duration, Resume indicators | §8.3 |
| `🧩 🖥️ Web Library - Thmanyah Dropdown.pdf` | Dropdown — Default & Hover items | §8.4 |
| `🧩 🖥️ Web Library - Thmanyah modal.pdf` | Modals — Message, Verification (Email/Phone/OTP/Text), generic Modal; Alignment, Language, Breakpoint variants | §8.5 |
| `🧩 🖥️ Web Library - Thmanyah footer.pdf` | Footer — Language (AR/EN), Desktop/Tablet/Mobile | §8.6 |

### 14.1 Universal patterns that appear in every PDF

These six patterns appear on every single library page and are therefore **brand-level conventions**, not per-component choices:

1. **Top utility rail** — `thmanyah` wordmark leading; heart / circle / app-grid / wave / star-burst icons trailing
2. **Page title** — Serif Display Bold, very large (≈80px), centered
3. **Meta pill row** — 2–4 `✦`-prefixed pills directly under the title
4. **"Copy me" showcase wrapper** — `#1A1A1D`, 32px radius, 80px padding, amber handwritten arrow callout (documentation-only)
5. **"Variants & states" section** — left-label / right-examples matrix
6. **Nested sub-label pills** — every example in the matrix carries a small pill sub-label (`Default`, `Hover`, `Desktop`, `Tablet`, `Mobile`, `EN`, `AR`, `Guest User`, `Registered User`, etc.)

When adding a new component to the library, replicate this template exactly.
