# Dr Apple — Gadgets & Accessories

A two-part web app for an independent gadget shop in Kano, Nigeria.

```
dr-apple/
├── frontend/   # React + Tailwind (Vite) storefront + admin
└── backend/    # Node + Express + MongoDB API
```

## Quick start

### 1. Backend

```bash
cd backend
npm install
npm run seed     # creates owner account + sample products
npm run dev      # API on http://localhost:4000
```

Create `backend/.env` (copy from `.env.example`) with your MongoDB Atlas URI.
The seed creates an owner login: username `owner`, password `drapple2025`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev      # app on http://localhost:5173
```

The Vite dev server proxies `/api` and `/uploads` to the backend on port 4000,
so run both during development.

## Tech

- **Frontend:** React, Tailwind CSS, React Router, Vite (JavaScript, no TypeScript)
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth, Multer image uploads

## Admin

Visit `/admin` and sign in with the owner account. Admins can manage products
(staff) and admins/activity log (owner only). Uploaded product images are stored
in `backend/uploads/` and served at `/uploads/...`.
