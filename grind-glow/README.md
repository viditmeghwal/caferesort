# Grind & Glow — $15 Instagram audit studio

A 3-page marketing site for a boutique audit service targeting café and boutique resort/hotel owners. Warm-espresso editorial aesthetic with grain, parallax, custom cursor, split-text reveals, and a horizontal marquee.

## Concept & positioning

**Name:** Grind & Glow
**Tagline:** "Audits that make your grid actually grow."
**Offer:** One flat-fee $15 audit covering reels, grid, stories, bio, brand voice. Delivered in 48 hours as a 14-page PDF zine + 20-minute Loom walkthrough.
**Audience:** Café owners and boutique resort/hotel owners in India and South-East Asia.
**Differentiation:** Two humans (not AI), hospitality-only focus, zine-style output, no retainer/upsell.

## Pages

1. **`index.html`** — Home. Hero, marquee, problem list, 3 service cards, stats, 3-step process, testimonial, CTA.
2. **`how-it-works.html`** — Sticky-scroll 4-step process with live counter, 12-chip deliverables grid, pricing card, 6-item FAQ.
3. **`sample-audit.html`** — Fictional audit of "Sundown Coffee, Goa." Verdict scoreboard, 6 metric cards, 2 reel teardowns with scoring bars, 18-cell grid heatmap, before/after caption rewrites, 6-step 90-day roadmap.

## Design system

- **Palette:** Cream `#f2e8d8`, paper `#e8dcc4`, espresso `#1a0f08`, coffee `#2b1810`, mocha `#4a2c1a`, crema `#c89268`, burnt orange `#d2691e`, ember `#b8441f`.
- **Type:** Fraunces (display, variable italic), Instrument Serif (body), DM Mono (labels/eyebrow text). All via Google Fonts.
- **Grain:** SVG fractal-noise overlay at 12% opacity, multiply blend. Applied via `body::before`.
- **Cursor:** Dot + lagging ring using difference blend mode. Auto-disabled on touch devices. Add `data-cursor="label text"` to any element to show a labelled cursor on hover.
- **Reveals:** Add class `reveal` for fade-up, or attribute `data-split` for per-word slide-up text reveal. IntersectionObserver drives both.
- **Parallax:** Add `data-parallax="0.4"` (positive or negative float) to any element for scroll-linked translation.
- **Marquee:** CSS-only infinite horizontal scroll. Duplicate content inside `.marquee__track` so the loop is seamless.

## File tree

```
grind-glow/
├── index.html
├── how-it-works.html
├── sample-audit.html
├── css/
│   └── shared.css
├── js/
│   └── shared.js
└── README.md
```

## Next ideas to drop in

Pick these up in Claude Code when extending:

- **Stripe checkout** on the home and pricing CTAs — $15 single payment.
- **Real audit form** that collects handle, goal, menu upload → emails to studio + triggers Stripe.
- **Blog/Journal page** — "Notes" section, editorial format matching the zine feel.
- **Before/after case study page** — real client results with 90-day-later data.
- **Lottie animations** in place of the inline SVGs for the service cards.
- **GSAP ScrollTrigger** to replace the custom IntersectionObserver logic for more orchestrated scroll scenes (pinned sections, horizontal scroll).
- **Dark mode toggle** — swap to the espresso colour as the base surface.
- **Locomotive Scroll or Lenis** for buttery smooth scroll on desktop.
- **Language toggle** — Hindi/English given the India-first audience.

## Running locally

Open `index.html` by double-clicking — no build step required. Or run a static server:

```bash
cd grind-glow
python3 -m http.server 8000
# or
npx serve .
```

Then open `http://localhost:8000`.

## Browser support

Modern evergreen browsers. Custom cursor auto-disables on touch via `@media (hover: none)`. Grain overlay uses inline SVG data URI so no external assets required.
