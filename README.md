# Muhammad Hassan — Portfolio

A premium, dark-luxury developer portfolio built with Next.js App Router, TypeScript,
Tailwind CSS, Framer Motion, GSAP, and Lenis smooth scroll.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn-style primitives (`components/ui`)
- Framer Motion for scroll reveals, magnetic buttons, and the AI assistant panel
- GSAP + Lenis for smooth scrolling and parallax
- react-icons
- Live GitHub API integration (no key required for public data)

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Before you deploy

1. **Content** — update copy in `lib/data.ts` (skills, projects, journey, AI assistant answers, terminal commands).
2. **GitHub dashboard** — set `GITHUB_USERNAME` in `lib/data.ts` to your real GitHub handle.
3. **Assets** — drop `favicon.ico`, `og-image.png` (1200×630), and `resume.pdf` into `/public`.
4. **Metadata** — update `siteUrl` and social links in `app/layout.tsx`, `app/sitemap.ts`, and `app/robots.ts`.
5. **Contact form** — `components/sections/Contact.tsx` only validates client-side today. Wire it to an API route (e.g. `app/api/contact/route.ts`) or a form service (Resend, Formspree, etc.) to actually send messages.
6. **Social links** — update the placeholder `#` hrefs in `Footer.tsx` and `Contact.tsx`.

## Deploying to Vercel

```bash
npm i -g vercel
vercel
```

Or connect the repo directly in the Vercel dashboard — zero config needed, this is a standard App Router project.

## Accessibility & performance notes

- Respects `prefers-reduced-motion` (disables custom cursor animation loop, Lenis smooth scroll, and particle canvas).
- Skip-to-content link, semantic sections, ARIA labels on icon-only buttons.
- Heavier client sections (`Terminal`, `GithubDashboard`) are loaded via `next/dynamic` for code-splitting.
- `next/image` used for the GitHub avatar for automatic optimization.
