# Bluebonnet Driving School — Website Redesign Handoff

A complete, responsive redesign of the Bluebonnet Driving School marketing site. **14 pages**, desktop-first but fully mobile-friendly, built as self-contained Design Components (`.dc.html`).

---

## 1. Design direction

- **Style:** Editorial & calm — oversized headlines, generous whitespace, hairline rules instead of boxes. Magazine-like, civic/trustworthy.
- **Color:** Near-monochrome ink on white, with **one signature blue** used in only a few deliberate moments per page (key headline word, primary buttons, the dark stats band, the blue CTA band).
- **Type:** **Hanken Grotesk** only (Google Fonts), one typeface throughout. Hierarchy and emphasis come from **weight changes (400→800), never italics**.
- **Trust indicators** surfaced prominently: 4.9★ Google rating + review count, 20+ years / "since 20XX", TDLR-licensed, DPS-approved road test provider.

### Color tokens
| Role | Hex |
|---|---|
| Ink (text / dark sections) | `#14171C` |
| Body text | `#4A515C` |
| Muted text | `#7A828F` / `#9AA1AB` |
| Signature blue | `#0B5BD3` |
| Blue (on dark) | `#5B9BF0` |
| Blue tint (chips/avatars) | `#EAF1FC` |
| Surface (alt sections) | `#FAFAFB` |
| Hairlines / borders | `#ECEDEF` / `#E2E3E6` |
| Success green (adult tag) | `#1E9D5B` / tint `#E4F5EC` |
| Marigold accent (refresher/ES) | `#C9821A` / tint `#FBF0DA` / `#FBF6EC` |

### Type scale (desktop)
- Hero H1: 56–90px, weight 500–600, letter-spacing ~ -0.03em
- Section H2: 38–46px, weight 600
- Card/sub H3: 20–27px, weight 700
- Body: 16–20px, line-height ~1.6
- Eyebrow labels: 12px, weight 700, uppercase, letter-spacing 0.18em
- Minimum body size on mobile stays ≥ 14px.

---

## 2. Pages (14)

| File | Purpose |
|---|---|
| `Bluebonnet Home.dc.html` | Hero, choose-your-path, why-us, packages, how-it-works, stats, reviews, service areas, CTA |
| `Bluebonnet Courses.dc.html` | Audience entry + all 5 packages overview |
| `Bluebonnet Pricing.dc.html` | Full comparison table + always-included + policies |
| `Bluebonnet Teen.dc.html` | Teen driver ed: TX licensing steps, what's included, 3 teen packages |
| `Bluebonnet Adult.dc.html` | Adult lessons: who it's for, curriculum, packages, bilingual callout |
| `Bluebonnet Instructors.dc.html` | Team bios (placeholder portraits) |
| `Bluebonnet Reviews.dc.html` | Review grid |
| `Bluebonnet Book.dc.html` | Booking request form + "what happens next" |
| `Bluebonnet Contact.dc.html` | Contact details, hours, map slot, message form |
| `Bluebonnet About.dc.html` | Story, stats, values |
| `Bluebonnet Service Areas.dc.html` | Coverage map slot + city list + pickup explainer |
| `Bluebonnet FAQ.dc.html` | Accordion FAQ (interactive) |
| `Bluebonnet Resources.dc.html` | Official TX DPS/TDLR links + guides |
| `Bluebonnet Legal.dc.html` | Privacy Policy + Terms (placeholder copy) |

All pages cross-link via the shared header nav and footer. **Home is the entry point.**

---

## 3. Responsive behavior

Each page paints from **inline styles (desktop base)**, with a small `@media` block in the page's `<head>`/`helmet` `<style>` plus lightweight class hooks. Breakpoints:

- **≤ 980px (tablet):** 3- and 4-column grids drop to 2 columns.
- **≤ 760px (mobile):** all multi-column grids collapse to 1 column; section side padding shrinks 56px→22px; headlines scale down; the center nav menu and the header phone number hide (logo + "Book a lesson" remain); the hero trust strip stacks vertically; footer goes to 2 columns.
- **≤ 480px (small phone):** footer and stats go single column; headlines scale down further.
- **Pricing table:** becomes horizontally scrollable (with a swipe hint) below 760px so columns stay readable.
- **Book / Contact forms:** two-column layouts collapse to single column ≤ 880px; field grids stack ≤ 760px.

### Class hooks used (consistent across pages)
`pad` (side padding), `navmenu` / `navphone` (hide on mobile), `g2`/`g3`/`g4` (collapsing grids), `split` (2-col → 1-col), `statgrid` (stats band), `footgrid` (footer), `truststrip` + `vdiv` (hero trust band), `colstack` (footer bottom bar / inline rows), `h1`/`h2` (headline scaling), `secpad` (vertical rhythm), `ptable`/`ptable-inner` (scroll table), `formgrid`/`formpad`/`booksplit`/`contactsplit`/`legalsplit`.

### ⚠️ Mobile nav note
On mobile the center menu currently **hides** (only logo + Book button show). Before launch, add a **hamburger menu** that reveals the full nav (Courses, Pricing, Service Areas, About, Reviews, FAQ, Contact) — this is the one piece of interactive UI a production build should add.

---

## 4. Tech / file format

- Files are **Design Components** (`.dc.html`) — they open directly in a browser and render top-to-bottom. They rely on `support.js` (already in the project root); keep it alongside them.
- Styling is **inline-first**; the only CSS in `<style>` is hover states, `@font-face`/Google-font link, and the responsive `@media` blocks.
- **FAQ** uses a small logic class for the accordion; all other pages are template-only (static).
- For a conventional production stack, the markup translates 1:1 to React/Vue/plain HTML — copy the inline styles or lift the repeated nav/footer into a shared component.

---

## 5. Placeholders to replace before launch

These are intentionally generic — **verify and swap before publishing:**

1. **Stats / figures** — `4.9★`, `100+ reviews`, `20+ years`, `since 20XX`, `98% first-try pass rate`, `7 cities`. Confirm against real records.
2. **TDLR license #** — `#C-XXXXXX` in every footer.
3. **Phone** — `(214) 545-7529` and **email** `hello@bluebonnetdriving.com` (verify both).
4. **Address** — `820 W. Spring Creek Pkwy, Suite #400 N, Plano, TX 75023` (verify suite/floor).
5. **Pricing** — package prices, included hours, and which packages include the road test are drafts.
6. **Photos** — diagonal-hatch boxes labeled "Photo —…" are placeholders. Supply real images of instructors, cars, students.
7. **Instructors** — names, portraits, years, specialties are illustrative.
8. **Reviews** — use real Google reviews; only use names/initials with permission.
9. **Maps** — Contact & Service Areas have map-embed slots; drop in a Google Maps iframe.
10. **Resources links** — all `#` placeholders; replace with current official TX DPS / TDLR / ITTD URLs.
11. **Legal** — Privacy & Terms are placeholder language; have an attorney review.
12. **Texas requirements** — verify teen hour/permit/ITTD specifics against current TDLR/DPS guidance (rules change).
13. **Booking form** — wire to a real scheduler (Calendly, SimplyBook.me, Amelia, BookingPress) and the contact/booking forms to a backend or email handler.

---

## 6. Suggested next steps

- Add the **mobile hamburger nav** (see note above).
- Wire forms + booking to a real backend/scheduler.
- Drop in real photography and maps.
- Replace all placeholder figures, license #, and legal copy.
- Optional: a dark mode pass (currently light-mode only, per scope), and a blog/advice section if desired.
