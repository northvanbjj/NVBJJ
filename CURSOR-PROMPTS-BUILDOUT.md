# NVBJJ Build-Out — Cursor Prompts (Next.js Edition)

**CRITICAL CONTEXT FOR AI AGENTS (MARC/CURSOR):** 
The project has migrated from a static HTML site to a **Next.js (App Router)** application located in `/Users/forcefield/Documents/NVBJJ/pitch-next/`. Do NOT edit the old `.html` files in the root directory. All new work must happen inside `pitch-next/src/`. 

The site uses Tailwind CSS, Framer Motion, and TypeScript. 

*Note: The Web3Forms trial form, Blog section, and basic UI fixes have already been completed in recent commits.*

---

## Prompt 1 — Copy corrections and dead link removal
Audit all `.tsx` files in `/Users/forcefield/Documents/NVBJJ/pitch-next/src/`. 
1. Replace any text claiming the school is the "only" or "Vancouver's only Gracie Jiu-Jitsu Certified Training Center" with the exact wording: "North Vancouver's Gracie Jiu-Jitsu Certified Training Center". 
2. Remove the Twitter or X link and its list item from the `Footer.tsx` component (and anywhere else it appears). Leave Facebook and Instagram links intact. List every file and change.

## Prompt 2 — New page scaffolds plus nav
Inside `pitch-next/src/app/`, create five new pages using the standard Next.js `page.tsx` pattern. The pages are:
- `/new-to-jiu-jitsu`
- `/beginners-journey`
- `/faq`
- `/programs/gracie-teens`
- `/programs/fight-simulation`
- `/programs/gracie-survival-training`

Each page should reuse existing Navbar and Footer components. Fill each with a placeholder `<h1>` and `<p>` that says "PLACEHOLDER COPY TO BE ADDED". 
On the `/faq` page, build an accordion component using React state (or Framer Motion) for expandable/collapsible sections.
Finally, update `Navbar.tsx` (and its mobile menu) to include a link to "New to Jiu-Jitsu" and add the new program pages to the Programs navigation. 

## Prompt 3 — Next.js SEO & Meta Tags
Implement the following SEO standards in the Next.js app:
1. In `src/app/layout.tsx` or `page.tsx`, inject a `<script type="application/ld+json">` containing `LocalBusiness` schema (North Vancouver BJJ, Unit 206 250 Esplanade E North Vancouver BC V7L 1A3, 604-770-1766, northvanbjj@gmail.com, aggregateRating 5 with 131 reviews).
2. On the new `/faq` page, add `FAQPage` JSON-LD schema dynamically based on the accordion content.
3. Utilize Next.js `generateMetadata` or the `metadata` export to ensure every page has a unique title, description, and Open Graph tags (og:title, og:description, og:image, og:url). 
4. Ensure `sitemap.ts` and `robots.ts` files exist in the `src/app/` directory to automatically generate the sitemap and robots.txt.

## Prompt 4 — Review badge, Instagram feed, Meta pixel
In the `pitch-next` codebase:
1. Create a `ReviewBadge.tsx` component showing 5 stars and 131 reviews, linking to `GOOGLE_LISTING_URL`. Place it near the top of the homepage hero section.
2. In the homepage (`src/app/page.tsx`), add an Instagram feed section. Use a Behold.so embed script/component with the placeholder `BEHOLD_FEED_ID`.
3. Add the Meta pixel base code to `src/app/layout.tsx` (using Next.js `next/script` with `strategy="afterInteractive"`) using the placeholder `META_PIXEL_ID`.

## Prompt 5 — Sheet-driven schedule widget
Replace the static schedule content in `Schedule.tsx` with a dynamic React component.
Use `fetch()` in a Client Component (or Server Component if appropriate) to fetch a published Google Sheet CSV at `SCHEDULE_SHEET_CSV_URL`. Parse the CSV rows (Day, Time, Class, Level) and render a weekly schedule table. 
Include category filter buttons (Advanced, Fundamentals, Kids, No-Gi, Open Mat, Womens) using React state. Add a fallback error UI if the fetch fails. 

---

## Placeholders to replace after building
- `SCHEDULE_SHEET_CSV_URL`  (published Google Sheet CSV)
- `GOOGLE_LISTING_URL`  (their GBP listing)
- `BEHOLD_FEED_ID`  (from Behold.so, connected to their IG)
- `META_PIXEL_ID`  (from Mike / GymDesk)
