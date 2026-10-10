# NanakLove Full-Stack Starter

React + Vite frontend and Node.js + Express backend, designed for a Supabase database.

## What's included
- Express REST API with health endpoint
- Books list, create, update and delete API
- Radio stations list, create, update and delete API
- Supabase integration when environment variables are configured
- Development fallback data when Supabase is not configured (not persistent)
- Basic admin API-key middleware for write routes
- CORS configuration
- React frontend with Books and Live Radio pages from the prior frontend bundle
- Admin API routes are not a complete production authentication system

## Setup
Requirements: Node.js 20+ recommended.

1. Extract the ZIP.
2. In VS Code, open the extracted folder.
3. Copy `server/.env.example` to `server/.env`.
4. Fill in Supabase Project URL, Supabase service role key, and a long random `ADMIN_API_KEY`.
5. In `client/.env`, set `VITE_API_URL=http://localhost:4000/api`.
6. In terminal run:
   ```bash
   npm install
   npm --prefix server install
   npm --prefix client install
   npm run dev
   ```
7. Open Vite's local URL, usually http://localhost:5173. API health: http://localhost:4000/api/health

## Supabase setup
Run `supabase/schema.sql` in Supabase SQL Editor.

Tables:
- `books`: physical book metadata, no digital book file storage by default
- `radio_stations`: station metadata and stream URL

Use the Supabase **service_role** key only in `server/.env`. Never put it in `client/.env` or frontend code. Do not commit `.env` files.

## API
- `GET /api/health`
- `GET /api/books?q=&category=`
- `GET /api/books/:id`
- `POST /api/books` (requires `x-admin-key`)
- `PUT /api/books/:id` (requires `x-admin-key`)
- `DELETE /api/books/:id` (requires `x-admin-key`)
- `GET /api/radio`
- `POST /api/radio` (requires `x-admin-key`)
- `PUT /api/radio/:id` (requires `x-admin-key`)
- `DELETE /api/radio/:id` (requires `x-admin-key`)

## Important security note
The API key middleware is a development scaffold, not a user-management system. For public production deployment, replace it with Supabase Auth/JWT role checks, rate limiting, validation, audit logs and secure secret rotation. The API must not be exposed publicly with a weak key. Keep streams and book data accurate and verify rights before publishing.
