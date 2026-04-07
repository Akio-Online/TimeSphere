# Product Requirements Document
# The Time Sphere — thetimesphere.com
# Version 1.0 — MVP

---

## 1. WHAT WE'RE BUILDING

**The Time Sphere** is a global time intelligence website. When someone searches
"time in Tokyo" or "current time London" in a search engine, they land on a fast,
beautiful page showing the live local time with helpful context (time zone, UTC
offset, DST status, time conversions). The site monetizes via 3 ad slots per page.

**Positioning:** Not "a time website" — a Global Time + Travel Intelligence Platform.

---

## 2. MVP SCOPE (Version 1.0)

### Pages
- `/index.html` — Homepage: live world clock, city search grid, 3 ad slots
- `/time.html` — Dynamic city time page (URL param: `?city=london`)
- `/about.html` — About The Time Sphere
- `/contact.html` — Contact form (powered by Formspree)

### Features
- Live clock updating every second (JavaScript, IANA time zones)
- 10 major cities pre-loaded: New York, London, Tokyo, Dubai, Sydney, Paris,
  Los Angeles, Chicago, Singapore, Mumbai
- Search/filter bar on homepage
- UTC offset display
- DST active indicator
- 3 ad placeholder slots per page (ready for Google AdSense)
- Mobile responsive
- Privacy Policy link (required for ad networks)

---

## 3. TECH STACK

- **HTML5 + CSS3 + Vanilla JavaScript** (no framework — fast, simple, deployable anywhere)
- **Formspree** — contact form backend (no server needed)
- **GitHub** — version control
- **Railway** — hosting/deployment

---

## 4. DESIGN DIRECTION

- **Theme:** Dark space / cosmic sphere aesthetic
- **Background:** Deep space dark (#0a0a1a)
- **Primary accent:** Electric cyan (#00d4ff)
- **Secondary accent:** Gold (#ffd700)
- **Fonts:** Orbitron (headings) + Exo 2 (body) — Google Fonts
- **Feel:** Premium, futuristic, global authority

---

## 5. AD PLACEMENT STRATEGY

Three slots per page:
1. **Top leaderboard** — 728×90 (desktop) / 320×50 (mobile), below header
2. **Mid-content rectangle** — 300×250, between time display and conversions
3. **Bottom banner** — 728×90, above footer

Placeholder `<div class="ad-slot">` elements are in place. Swap in AdSense
code once approved.

---

## 6. FUTURE VERSIONS (post-MVP)

- **v2:** 300+ city pages, sitemap.xml, SEO meta per city, FAQ sections
- **v3:** User accounts (NextAuth.js), Pro tier ($15/mo) — no ads, meeting planner
- **v4:** Elite tier ($75/mo) — charter flights, venue finder, luxury travel tools
- **v5:** Concierge tier ($299+) — done-for-you travel planning

---

## 7. INSTRUCTIONS FOR CLAUDE CODE (VS Code)

When I open this project in VS Code with Claude Code:

1. Read this PRD carefully
2. Review all existing files in this folder
3. Make sure the live clock works correctly for all 10 cities
4. Make sure all 3 ad slots are present on every page
5. Make sure the contact form connects to Formspree (I will provide my form ID)
6. Test by running a local server (Live Server extension or `python -m http.server`)
7. Push all files to GitHub
8. Help me deploy to Railway

---

*PRD complete. Hand this to Claude Code in VS Code to build.*
