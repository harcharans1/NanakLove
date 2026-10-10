# NanakLove frontend

A responsive React + Vite frontend for NanakLove: physical Gurbani book catalogue and live Gurbani radio.

## Included
- Responsive premium charcoal / black and gold design
- Home, Books, Live Radio, About, Contact routes
- Searchable/filterable sample catalogue with book-detail modal
- Three user-provided radio stream URLs with play/pause and volume
- Responsive mobile navigation and shared footer
- Contact form UI (preview only until backend exists)
- No backend or Supabase connection required yet

## Run in VS Code
1. Extract this ZIP.
2. Open the extracted `nanaklove-frontend-complete` folder in VS Code.
3. Open Terminal > New Terminal.
4. Run:
   ```bash
   npm install
   npm run dev
   ```
5. Open the Local URL shown by Vite, usually `http://localhost:5173`.

## Production build check
```bash
npm run build
npm run preview
```

## Important before launch
- The book catalogue uses clearly marked placeholder sample entries. Replace `sampleBooks` in `src/data.js` with real metadata for the user's physical books.
- Radio stream URLs were supplied by the site owner. Actual playback must be tested in the target browser/network; availability and format are broadcaster-dependent.
- Contact form only demonstrates the UI and does not send messages.
- Login, admin data persistence, image uploads, Supabase, API integration, analytics and premium billing are not included in this frontend-only phase.
- Confirm rights/permission for any images, branding and stream links used publicly.
