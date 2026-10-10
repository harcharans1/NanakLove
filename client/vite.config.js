import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Explicit automatic JSX runtime avoids requiring a React import in every component.
// Source components also import React where needed for compatibility.
export default defineConfig({
  plugins: [react({ jsxRuntime: 'automatic' })],
  esbuild: {
    jsx: 'automatic',
  },
});
