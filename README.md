# NanakLove

A responsive React + Vite frontend with a Node.js/Express API and Supabase database for a physical Gurbani book catalogue and live radio stations.

## Requirements

- Node.js 20 LTS or newer
- npm
- A Supabase project (optional for running the demo fallback)

## Run locally

Open the extracted project root (the folder containing the root `package.json`) in VS Code.

```bash
npm install
npm --prefix server install
npm --prefix client install
npm run dev
```

Open the frontend at http://localhost:5173 and API health check at http://localhost:4000/api/health.

## Supabase setup

1. Open Supabase SQL Editor.
2. Copy all of `supabase/schema.sql` into a new query and run it.
3. Copy `server/.env.example` to `server/.env`.
4. Add your Supabase Project URL and **server-only** secret/service role key to `server/.env`.
5. Set a strong unique `ADMIN_API_KEY` of at least 32 characters.
6. Restart the dev servers.

Example `server/.env`:

```dotenv
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVER_ONLY_SECRET_KEY
ADMIN_API_KEY=YOUR_UNIQUE_RANDOM_SECRET_OF_32_CHARS_OR_MORE
```

Never put the Supabase secret/service-role key in `client/.env`, source code, screenshots, or GitHub. Do not commit `.env` files. The `.gitignore` excludes them.

The frontend's optional API base is `client/.env`:

```dotenv
VITE_API_URL=http://localhost:4000/api
```

Only public frontend-safe values belong in `client/.env`.

## Pages

- `/` — Home
- `/books` — book catalogue
- `/radio` — live radio player
- `/about` — about NanakLove
- `/contact` — contact form (requires Supabase and the schema)
- `/admin` — basic admin-key protected management screen

## Important limitations before public launch

- The fallback books are placeholders, not your actual physical collection. Replace them with verified book data.
- Radio streams depend on the broadcaster and may change or be unavailable.
- The admin interface uses a shared API key as a starter gate, not a full user-account system. For production, replace it with Supabase Auth and proper role-based authorization, add rate limiting, and review hosting secrets/CORS.
- Do not expose the service-role key to the browser.
- The contact form stores messages in Supabase; it does not email them automatically.
- The backend must be deployed separately from Netlify. Set `VITE_API_URL` to the deployed API URL when deploying the frontend.

## Build the frontend

```bash
npm --prefix client run build
```
