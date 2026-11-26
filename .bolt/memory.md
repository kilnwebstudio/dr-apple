# Project memory

## Product intent & audience

- E-commerce storefront with an admin management panel.
- Storefront displays ~20 seeded products; admin manages products, owners, and views an activity log.
- Admin/owner audience authenticates via JWT to manage inventory and admin accounts.

## Brand personality & voice

- "Beautiful, not cookie cutter" aesthetic; production-worthy UI (per `.bolt/prompt`).
- Otherwise not yet specified — keep designs polished and distinctive.

## Visual design & UX direction

- Frontend: React + Tailwind CSS, plain JavaScript (JSX, no TypeScript).
- Icons via `lucide-react`; path alias `@/` → `src/` (per `.bolt/prompt`).
- Storefront and admin pages converted from prior `.tsx` to `.jsx`.
- Vite dev server proxies `/api` and `/uploads` to backend (port 4000); frontend runs on port 5173.

## Decisions, constraints & rationale

- **Monorepo split into `frontend/` and `backend/` folders** — fully separated; old root-level TypeScript/Supabase files removed.
- **No TypeScript anywhere** — user explicitly requested plain React + Tailwind only.
- **No Supabase** — replaced entirely with Node/Express + MongoDB (Mongoose).
- **Backend stack:** Express, Mongoose, JWT auth, Multer (image uploads to `backend/uploads/`, served at `/uploads/...`), activity log.
- **Backend features:** product CRUD with soft-delete/restore, owner-only admin management, JWT-based admin login, auto-recorded activity log.
- **Frontend auth:** JWT stored in localStorage (replaced Supabase sessions).
- **Frontend API client:** `api.js` handles all calls to Express API.
- **MongoDB Atlas** connection via env vars (`MONGODB_USERNAME`, `MONGODB_PASSWORD`, `MONGODB_URI`); credentials stored in `backend/.env`.
- **Seeded data:** owner account (`owner` / `drapple2025`) and 20 products in MongoDB.
- **Ports:** backend 4000, frontend 5173.
- **Run order:** backend `npm run seed` then `npm run dev`; frontend `npm run dev`; both must run simultaneously during dev.
- **Security note:** MongoDB password should be rotated before sharing/pushing repo.
- Do not install UI theme/icon packages beyond what `.bolt/prompt` allows.

## Open questions & assumptions

- Product catalog details (categories, pricing model, branding) not fully specified — inferred from seeded data.
- Storefront design language beyond "beautiful" is open; no specific color/typography direction given yet.
- Deployment strategy (where/how to host frontend + backend) not yet discussed.
- Whether additional admin roles beyond "owner" are needed is unconfirmed.
- Image upload constraints (max size, accepted formats) not yet specified.