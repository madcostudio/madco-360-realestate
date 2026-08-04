# Madco Estates — Phase 3: 360° Tour Engine Build

Welcome to **Madco Estates**, a Next.js 15 + Supabase real estate platform featuring an immersive 360° virtual walkthrough engine.

## 🚀 Tour Engine Features

- **Media Pipeline**: Client/server 2:1 equirectangular panorama image validation, EXIF/GPS metadata privacy scrubbing, and 4-tier progressive WebP image generation (`preview` [512px], `low` [2048px], `med` [4096px], `high` [8192px]) stored on **Vercel Blob**.
- **Photo Sphere Viewer v5 Integration**: Built with `@photo-sphere-viewer/core`, `virtual-tour-plugin`, `gyroscope-plugin`, and `markers-plugin`.
- **Fullscreen Tour Route (`/property/[slug]/tour`)**: Dedicated 360° virtual tour page featuring sticky glassmorphic header, listing details, exit button, and mobile contact overlay.
- **Admin Tour Builder (`/admin/tour-builder`)**: Interactive admin dashboard for uploading panoramas, placing hotspot markers directly by clicking coordinates inside the 360° sphere, linking rooms/scenes, and publishing tours.
- **Inline Tour Embed**: Embedded 360° walkthrough widget on property detail pages (`/property/[slug]`) with card-to-tour transition animations.
- **Analytics & Event Tracking**: Automatic event logging to the `events` table for `tour_open`, `scene_change`, and inside-tour enquiries.

---

## 🛠️ Tech Stack & Dependencies

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Database**: Supabase Postgres (`tours`, `tour_scenes`, `tour_hotspots`, `events`, `blob_files`)
- **Panorama Storage**: Vercel Blob (`@vercel/blob`)
- **Image Processing**: `sharp`
- **360° Viewer**: Photo Sphere Viewer v5
- **Styling**: Tailwind CSS + Glassmorphism + Madco Design Tokens (`estate-ink`, `brass`, `fern`, `haze`)

---

## 📍 Key Routes

- `/`: Home Page & Feature Showcase
- `/property/luxury-2bhk-penthouse`: Property Detail Page with Inline 360° Embed
- `/property/luxury-2bhk-penthouse/tour`: Fullscreen 360° Virtual Walkthrough
- `/admin/tour-builder`: Admin Tour Builder Dashboard & Hotspot Editor

---

## ⚙️ Environment Configuration

Add your Vercel Blob and Supabase credentials to `.env.local`:

```env
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## 🗄️ Database Setup & Migrations

Run the SQL migration script located in:
- [20260803_phase3_tour_engine.sql](file:///c:/Users/Romeo/Documents/Madco%20Estates/supabase/migrations/20260803_phase3_tour_engine.sql)
- [seed.sql](file:///c:/Users/Romeo/Documents/Madco%20Estates/supabase/seed.sql)

---

## 🧪 Testing

Run the media pipeline unit tests:
```bash
node scripts/test-panorama-pipeline.js
```
