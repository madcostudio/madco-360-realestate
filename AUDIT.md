# System Architecture & Backend Readiness Audit Report
**Project:** Madco Estates (360° Real Estate Marketplace)  
**Date:** August 2026  
**Auditor:** Automated Engineering System Audit  
**Target File:** `AUDIT.md`  

---

## 1. Verdict

**Madco Estates is currently a 100% front-end client prototype powered entirely by hardcoded mock data.**  
There is no active Supabase project connected, no live PostgreSQL database instance, no applied migrations, no real authentication or session persistence, no connected cloud storage bucket for panorama uploads, and zero server-side API write routes (`app/api` does not exist). Every user interaction—including property submission, lead enquiry capture, saving favourites, role switching, admin listing approval, and hotspot authoring in the tour builder—is either simulated via `setTimeout`, stored in ephemeral browser memory/`localStorage`, or swallowed by `console.log` stub handlers. The frontend design, component structure, Photo Sphere Viewer integration, and styling are complete and compile with zero errors, but the application is entirely disconnected from any real backend infrastructure.

---

## 2. What Is Genuinely Working (Verified)

1. **Next.js 15 App Router & Layout Architecture:**
   - Full Next.js 15 App Router structure with Turbopack, React 19, and Tailwind CSS.
   - Responsive layouts, desktop and mobile viewports, sticky navigation with glassmorphism effects, and footers.
   - Clean production build with **0 TypeScript and lint errors** (`npm.cmd run build` passes).

2. **360° Panorama Viewer Engine (`components/tour-viewer.tsx`):**
   - True spherical panorama rendering powered by `@photo-sphere-viewer/core` (v5.13.4).
   - `@photo-sphere-viewer/virtual-tour-plugin` successfully links multi-room scenes with smooth fade transitions.
   - `@photo-sphere-viewer/markers-plugin` renders custom SVG hotspot markers (`/marker-nav.svg`, `/marker-info.svg`) for room-to-room traversal and modal info cards.
   - `@photo-sphere-viewer/gyroscope-plugin` enables mobile motion/gyroscope navigation.
   - Real equirectangular demo images stored locally in `/public/demo-panoramas/` (`living-room.jpg`, `kitchen.jpg`, `bedroom.jpg`).

3. **Client-Side Panorama Processing Pipeline (`lib/panorama-pipeline.ts`):**
   - HTML5 Canvas-based equirectangular image slicing, scaling, and JPEG compression into multiple resolutions (`preview: 512px`, `low: 1024px`, `med: 2048px`, `high: 4096px`).

4. **Location Intelligence & OpenStreetMap Integration (`components/location-sheet.tsx`):**
   - Live search querying the public OpenStreetMap Nominatim API (`https://nominatim.openstreetmap.org/search`) with client-side debouncing.
   - Browser Geolocation API integration for GPS coordinates and reverse geocoding to detect Indian cities.
   - Search radius distance selection (2km, 5km, 10km, 25km, 50km) stored in React Context.

5. **Search, Filtering, and Discovery UI (`app/search/page.tsx`, `components/hero-search-form.tsx`):**
   - Multi-filter property discovery engine supporting keyword search, city selection, and BHK bedroom count filters over available listing data.

6. **Static & Dynamic Routing (`app/homes-in-[city]/page.tsx`, `app/property/[slug]/page.tsx`, `app/property/[slug]/tour/page.tsx`):**
   - Dynamic city landing pages with static param generation (`generateStaticParams`) for Mumbai, Bengaluru, Delhi, Hyderabad.
   - Standalone immersive fullscreen tour viewer and property detail pages with glassmorphic overlay heads-up display.

7. **Production SEO, Sitemap, and Compliance Pages:**
   - Dynamic sitemap generation (`app/sitemap.ts`) indexing home, search, city hubs, and property tours.
   - Search crawler rules (`app/robots.ts`).
   - Legal compliance pages: Terms & RERA Disclaimers (`app/terms/page.tsx`), Privacy Policy & DPDP Act 2023 (`app/privacy/page.tsx`), and Capture Shoot Refund Policy (`app/refund-policy/page.tsx`).
   - Custom 404 (`app/not-found.tsx`) and error boundary (`app/error.tsx`).

---

## 3. What Is Mock / Placeholder / Stubbed (File + Line Audit)

| Component | File & Exact Lines | Mechanism / Current Behavior |
| :--- | :--- | :--- |
| **Supabase Client Proxy** | [`lib/supabase/client.ts:1-177`](file:///c:/Users/Romeo/Documents/Madco%20Estates/lib/supabase/client.ts#L1-L177) | Exported `createClient()` constructs a dummy proxy returning hardcoded mock arrays from `lib/mock-data.ts` for all queries (`select`, `insert`, `update`, `upsert`). Writes log `[SUPABASE_INSERT]` to browser console without persisting. |
| **Server Supabase Router** | [`lib/supabase/server.ts:1-84`](file:///c:/Users/Romeo/Documents/Madco%20Estates/lib/supabase/server.ts#L1-L84) | Server client exports a mock builder returning `DEMO_PROPERTIES_LIST`, `DEMO_PROPERTY`, and `DEMO_TOUR` directly from memory. |
| **Static Database State** | [`lib/mock-data.ts:1-308`](file:///c:/Users/Romeo/Documents/Madco%20Estates/lib/mock-data.ts#L1-L308) | Houses 100% of the platform's mock data (`DEMO_PROPERTIES_LIST`, `DEMO_PROPERTY`, `DEMO_TOUR`, `DEMO_USERS`, `DEMO_ENQUIRIES`, `DEMO_CAPTURE_BOOKINGS`). |
| **Authentication & Sessions** | [`lib/auth.ts:1-72`](file:///c:/Users/Romeo/Documents/Madco%20Estates/lib/auth.ts#L1-L72) & [`components/auth/auth-modal.tsx:30-84`](file:///c:/Users/Romeo/Documents/Madco%20Estates/components/auth/auth-modal.tsx#L30-L84) | Auth is managed strictly in `localStorage` under key `madco_active_role`. Role quick-switcher toggles between hardcoded mock records (`DEMO_USERS.buyer`, `DEMO_USERS.owner`, `DEMO_USERS.admin`). No Supabase Auth tokens, cookies, or password verification. |
| **Blob Storage Uploads** | [`lib/blob.ts:1-46`](file:///c:/Users/Romeo/Documents/Madco%20Estates/lib/blob.ts#L1-L46) | Checks `BLOB_READ_WRITE_TOKEN`. When absent, logs a console warning and defaults to hardcoded `/demo-panoramas/living-room.jpg` fallback paths. |
| **Analytics & Event Telemetry** | [`lib/events.ts:1-28`](file:///c:/Users/Romeo/Documents/Madco%20Estates/lib/events.ts#L1-L28) | `trackEvent` only logs `[ANALYTICS_EVENT]` to the browser console. |
| **Property Submission** | [`app/owner/submit-property/page.tsx:19-26`](file:///c:/Users/Romeo/Documents/Madco%20Estates/app/owner/submit-property/page.tsx#L19-L26) | `handleSubmit` sets `setTimeout(() => setSubmitted(true), 800)`. Form data is discarded upon navigation. |
| **Tour Enquiry Form** | [`components/tour-contact-cta.tsx:19-27`](file:///c:/Users/Romeo/Documents/Madco%20Estates/components/tour-contact-cta.tsx#L19-L27) | Submits via `trackEvent('tour_enquiry_from_tour', ...)`; resets state after 2.5s with no database record created. |
| **Visitor Lead Capture Modal** | [`components/auth/visitor-lead-modal.tsx:30-47`](file:///c:/Users/Romeo/Documents/Madco%20Estates/components/auth/visitor-lead-modal.tsx#L30-L47) | Triggers `trackEvent` and closes modal after 2 seconds; no lead stored in `enquiries` table. |
| **Favourites Feature** | [`components/favourite-button.tsx:12`](file:///c:/Users/Romeo/Documents/Madco%20Estates/components/favourite-button.tsx#L12) | Persists favourites to an in-memory client `new Set<string>()`. Resets on full page reload. |
| **Admin Moderation Actions** | [`app/admin/dashboard/page.tsx:21-36`](file:///c:/Users/Romeo/Documents/Madco%20Estates/app/admin/dashboard/page.tsx#L21-L36) | `handleApproveProperty` and `handleToggleFeatured` mutate local React component state (`setProperties`). Reverts on page refresh. |
| **Tour Builder Persistence** | [`app/admin/tour-builder/[tourId]/page.tsx:76,116`](file:///c:/Users/Romeo/Documents/Madco%20Estates/app/admin/tour-builder/%5BtourId%5D/page.tsx#L76) | Invokes `supabase.from('tour_scenes').insert()` and `supabase.from('tour_hotspots').insert()`. Captured only in React state; discarded on reload. |
| **Environment Configuration** | [`.env.local:1-5`](file:///c:/Users/Romeo/Documents/Madco%20Estates/.env.local#L1-L5) | Contains dummy placeholder strings (`https://placeholder-project.supabase.co`, `placeholder-anon-key-here`, `placeholder-service-role-key-here`). |

---

## 4. What Is Missing Entirely

1. **Live Database Instance:** No Supabase project is active or reachable.
2. **Applied Database Schema:** While SQL schema files exist in `supabase/migrations/`, they have never been applied to a live database engine.
3. **Backend API Route Handlers:** The `app/api/` directory does not exist. No REST or Server Actions endpoints exist to handle server-side writes securely.
4. **Supabase Auth Integration:** No auth session cookies, JWT verification, password reset flows, phone OTP verification via Twilio/MessageBird, or OAuth callbacks.
5. **Vercel Blob Storage Bucket:** No real storage bucket configured for uploading high-resolution 360° panoramas or property cover photos.
6. **Transactional Email Service:** Resend / SendGrid / SMTP integration is completely absent. No emails are dispatched when leads or capture requests are submitted.
7. **Rate Limiting & Security Middleware:** No `middleware.ts`, no Upstash Redis rate limiting on submissions or searches, and no custom security headers configured in `next.config.ts`.
8. **Dynamic OpenGraph Image Generation:** No `opengraph-image.tsx` or edge image generation for social share cards.
9. **CMS / Dynamic Site Content:** No `site_content` table or admin interface for managing homepage marketing copy dynamically.

---

## 5. Phase-by-Phase Status Table (Phases 1–7)

| Phase | Description | Status | Details |
| :--- | :--- | :--- | :--- |
| **Phase 1** | Project Foundation, Tokens & Core Design System | **Fully Done (Frontend)** | Next.js 15, Tailwind, typography, responsive layouts, color tokens, and hero headline visual hierarchy all working. |
| **Phase 2** | Database Schema, Migrations & Supabase Architecture | **Partially Done** | Migration scripts `20260801000000_initial_schema.sql` and `20260802000000_storage_and_events.sql` exist in repository, but **0 migrations are applied to a live database**. |
| **Phase 3** | 360° Virtual Tour Engine & Photo Sphere Viewer | **Fully Done (Local) / Mock Backend** | Viewer, virtual tour plugin, hotspots, markers, and gyroscope fully operational using `/public/demo-panoramas/`. Real cloud Blob storage and DB loading are stubbed. |
| **Phase 4** | Marketplace Discovery, Search, Location & Geocoding | **Fully Done (Frontend) / Mock Data** | OpenStreetMap Nominatim integration, location context, radius filtering, city selector, and search UI are completely functional, executing filters over in-memory demo listings. |
| **Phase 5** | Owner Portal, Submission & 360° Capture Bookings | **Partially Done (UI Only)** | Listing creation forms, capture shoot request forms, and WhatsApp CTAs are built, but write paths are stubbed simulations. |
| **Phase 6** | Admin Dashboard, Moderation & Visual Tour Builder | **Partially Done (UI Only)** | Moderation approval tables, metrics cards, and visual drag-and-drop hotspot placement tool are fully built, but lack DB persistence. |
| **Phase 7** | Polish, SEO, Performance, Legal & Production Readiness | **Partially Done** | Sitemap, robots.txt, metadata, legal pages (Terms, Privacy, Refund), 404, and error boundaries are complete. Missing: dynamic OG cards, rate limiting, security headers, live DB integration. |

---

## 6. Write Paths Verification (B5)

| Write Path | Mechanism | Persists to Real DB? | Real Outcome |
| :--- | :--- | :---: | :--- |
| **Enquiry / Contact Form** | `TourContactCta` | ❌ **NO** | Calls `console.log` via `trackEvent`; disappears after 2.5 seconds. |
| **Visitor Lead Capture** | `VisitorLeadModal` | ❌ **NO** | Displays fake checkmark after 600ms; lead is lost. |
| **Favourites Toggle** | `FavouriteButton` | ❌ **NO** | Stored in client memory `Set`; resets upon refresh. |
| **Saved Searches** | `app/dashboard` | ❌ **NO** | Static counter rendered; no user search history saved. |
| **Owner Property Submission** | `SubmitPropertyPage` | ❌ **NO** | Runs simulated 800ms timer; resets on navigation. |
| **Capture Booking Request** | `OwnerCtaBand` / `SubmitProperty` | ❌ **NO** | WhatsApp link opens chat; form check runs simulated timer. |
| **Admin Approve / Reject** | `AdminDashboardPage` | ❌ **NO** | Updates local React component state; reverts on reload. |
| **Email Notifications (Resend)**| N/A | ❌ **NO** | Not installed, not configured, no API keys present. |

---

## 7. Content & Copy Verification (B7)

1. **Brand & Geographic Targeting:**
   - The platform has already been updated to national multi-city coverage: **"MAD.CO ESTATES — 360° Real Estate Marketplace"**.
   - Browse by City supports **Mumbai, Bengaluru, Delhi NCR, and Hyderabad** (`components/city-grid-section.tsx`).
   - Hardcoded references to "Mangalore Real Estate" or "Curated for Mangalore, Karnataka" **no longer exist** anywhere in the active codebase.
2. **Location-Driven Copy:**
   - City landing pages (`/homes-in-[city]`) dynamically format the city name from route parameters (e.g., `/homes-in-mumbai` renders "360° Luxury Homes in Mumbai").
   - Search page (`/search`) dynamically updates its title and radius display based on the user's active GPS/selected location (`location-context.tsx`).

---

## 8. Exact Setup Steps to Connect Real Backend

To transition Madco Estates from a mock prototype to a fully live, database-backed application, the owner must complete the following steps:

### Step 1: Create Supabase Project
1. Log in to [https://database.new](https://database.new) and create a new project (e.g. `madco-estates-prod`).
2. Select your preferred region (e.g. `ap-south-1` Mumbai).
3. Navigate to **Project Settings → API** and copy:
   - **Project URL**
   - **anon / public key**
   - **service_role key** (secret)

### Step 2: Apply Database Migrations
1. In the Supabase Dashboard, open **SQL Editor**.
2. Open the file [`supabase/migrations/20260801000000_initial_schema.sql`](file:///c:/Users/Romeo/Documents/Madco%20Estates/supabase/migrations/20260801000000_initial_schema.sql) from the repository, paste its contents into the SQL Editor, and click **Run**.
3. Open the file [`supabase/migrations/20260802000000_storage_and_events.sql`](file:///c:/Users/Romeo/Documents/Madco%20Estates/supabase/migrations/20260802000000_storage_and_events.sql), paste its contents, and click **Run**.
4. *(Optional via Supabase CLI)*:
   ```bash
   npx supabase login
   npx supabase link --project-ref <YOUR_PROJECT_REF>
   npx supabase db push
   ```

### Step 3: Create Vercel Blob Store (Storage)
1. In your Vercel project dashboard, navigate to **Storage → Create Database → Blob**.
2. Name the store (e.g. `madco-panoramas`) and click **Create**.
3. Copy the generated `BLOB_READ_WRITE_TOKEN`.

### Step 4: Configure Real Environment Variables
Update `.env.local` in the project root with the real credentials:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Live Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# Live Vercel Blob Storage Token
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...

# Transactional Email (Resend)
RESEND_API_KEY=re_...
ADMIN_NOTIFICATION_EMAIL=admin@madcoestates.com
```

### Step 5: Seed Initial Real Property & Tour Records
Run an SQL seed script in the Supabase SQL editor to populate verified initial listings:
```sql
INSERT INTO public.properties (id, slug, title, price, bhk, sqft, address, city, state, pincode, status, featured)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'luxury-2bhk-penthouse',
  'Luxury 2BHK Penthouse with Ocean Views',
  18500000,
  2,
  1450,
  'Carter Road, Bandra West',
  'Mumbai',
  'Maharashtra',
  '400050',
  'published',
  true
);
```

---

## 9. Recommended Fix Order

When ready to wire the backend, proceed in this exact sequence:

1. **Step 1: Real Database & Server Clients**
   - Replace the mock handlers in [`lib/supabase/client.ts`](file:///c:/Users/Romeo/Documents/Madco%20Estates/lib/supabase/client.ts) and [`lib/supabase/server.ts`](file:///c:/Users/Romeo/Documents/Madco%20Estates/lib/supabase/server.ts) with standard `@supabase/ssr` / `@supabase/supabase-js` client instances.
2. **Step 2: Server Actions & API Handlers**
   - Create Server Actions in `app/actions/` for `submitProperty`, `createEnquiry`, `toggleFavourite`, and `saveTourHotspots`.
3. **Step 3: Supabase Auth & Session Cookies**
   - Wire standard Supabase auth in `components/auth/auth-modal.tsx` (`signInWithPassword`, `signUp`, `signInWithOtp`) and configure session cookie handling in `middleware.ts`.
4. **Step 4: Real Blob Storage Pipeline**
   - Wire `lib/blob.ts` with real `@vercel/blob` uploads so the Visual Tour Builder saves high-resolution multi-tile panoramas directly to cloud CDN storage.
5. **Step 5: Resend Email Notification System**
   - Wire Resend email triggers on new enquiries and owner capture bookings.
6. **Step 6: End-to-End Verification**
   - Test full user signup, property submission, admin approval, and enquiry dispatch across the live database.
