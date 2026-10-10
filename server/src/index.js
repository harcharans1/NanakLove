import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env, hasSupabase } from './config/env.js';
import booksRouter from './routes/books.js';
import radioRouter from './routes/radio.js';
import contactRouter from './routes/contact.js';

const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: env.clientOrigin.split(',').map((s) => s.trim()), methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type', 'x-admin-key'] }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'nanaklove-api', database: hasSupabase ? 'configured' : 'fallback-mode' }));
app.use('/api/books', booksRouter);
app.use('/api/radio', radioRouter);
app.use('/api/contact', contactRouter);
app.use((_req, res) => res.status(404).json({ error: 'API route not found.' }));
app.use((err, _req, res, _next) => {
  console.error(err);
  const status = Number(err.status) >= 400 && Number(err.status) < 600 ? Number(err.status) : 500;
  res.status(status).json({ error: status === 500 ? 'Unexpected server error.' : err.message || 'Request failed.' });
});

app.listen(env.port, () => {
  console.log(`NanakLove API listening on http://localhost:${env.port}`);
  console.log(`Database mode: ${hasSupabase ? 'Supabase' : 'fallback (read-only demo)'}`);
});
