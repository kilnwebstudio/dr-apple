# Dr Apple — Backend

Node.js + Express + MongoDB (Mongoose) API for the Dr Apple gadget shop.

## Setup

```bash
cd backend
npm install
cp .env.example .env   # then edit values
npm run seed            # creates owner account + sample products
npm run dev             # starts API on http://localhost:4000
```

## Environment

Create `.env` (see `.env.example`):

```
MONGODB_URI=mongodb+srv://...
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=change-me
JWT_EXPIRES_IN=7d
OWNER_USERNAME=owner
OWNER_PASSWORD=drapple2025
```

## API

| Method | Route | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/login` | none | Login, returns JWT |
| GET | `/api/products` | none | List active products |
| GET | `/api/products/:slug` | none | Single product |
| GET | `/api/products/admin/all` | staff | All products (incl. removed) |
| POST | `/api/products` | staff | Create product (multipart: `data` JSON + `image` file) |
| PUT | `/api/products/:id` | staff | Update product |
| DELETE | `/api/products/:id` | staff | Soft delete |
| PUT | `/api/products/:id/restore` | staff | Restore |
| DELETE | `/api/products/:id/hard` | owner | Hard delete |
| GET | `/api/admins` | owner | List admins |
| POST | `/api/admins` | owner | Create admin |
| DELETE | `/api/admins/:id` | owner | Remove admin |
| GET | `/api/activity` | owner | Activity log |

Uploaded images are served from `/uploads` and stored in `backend/uploads/`.

## Default owner

Username: `owner` · Password: `drapple2025` (created by `npm run seed`).
