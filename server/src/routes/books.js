import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { supabase } from '../lib/supabase.js';
import { fallbackBooks } from '../data/fallback.js';
import { requireAdminKey } from '../middleware/adminKey.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
const allowedCategories = new Set(['gurbani', 'history', 'gurmat', 'biography', 'other']);

function validateBook(body, partial = false) {
  const errors = [];
  if (!partial || body.title !== undefined) {
    if (typeof body.title !== 'string' || body.title.trim().length < 2 || body.title.trim().length > 180) errors.push('title must be 2–180 characters');
  }
  for (const key of ['author', 'language', 'description', 'cover_url']) {
    if (body[key] !== undefined && body[key] !== null && typeof body[key] !== 'string') errors.push(`${key} must be text`);
  }
  if (body.category !== undefined && !allowedCategories.has(body.category)) errors.push('category is not supported');
  if (body.pages !== undefined && body.pages !== null && (!Number.isInteger(Number(body.pages)) || Number(body.pages) < 1)) errors.push('pages must be a positive integer');
  if (body.featured !== undefined && typeof body.featured !== 'boolean') errors.push('featured must be true or false');
  return errors;
}

router.get('/', asyncHandler(async (req, res) => {
  const q = String(req.query.q || '').trim().slice(0, 100).toLowerCase();
  const category = String(req.query.category || '').trim().toLowerCase();
  if (category && category !== 'all' && !allowedCategories.has(category)) return res.status(400).json({ error: 'Invalid category.' });
  let books;
  if (supabase) {
    let query = supabase.from('books').select('*').order('created_at', { ascending: false });
    if (category && category !== 'all') query = query.eq('category', category);
    if (q) query = query.or(`title.ilike.%${q}%,author.ilike.%${q}%,description.ilike.%${q}%`);
    const { data, error } = await query;
    if (error) throw error;
    books = data || [];
  } else {
    books = fallbackBooks.filter((b) => (!category || category === 'all' || b.category === category) && (!q || `${b.title} ${b.author} ${b.description}`.toLowerCase().includes(q)));
  }
  res.json({ data: books, meta: { count: books.length, persistent: Boolean(supabase) } });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  if (supabase) {
    const { data, error } = await supabase.from('books').select('*').eq('id', req.params.id).maybeSingle();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Book not found.' });
    return res.json({ data });
  }
  const book = fallbackBooks.find((b) => b.id === req.params.id);
  if (!book) return res.status(404).json({ error: 'Book not found. Demo fallback entries are read-only.' });
  return res.json({ data: book });
}));

router.post('/', requireAdminKey, asyncHandler(async (req, res) => {
  const errors = validateBook(req.body);
  if (errors.length) return res.status(400).json({ error: 'Invalid book data.', details: errors });
  if (!supabase) return res.status(503).json({ error: 'Configure Supabase to persist book records. Fallback data is read-only.' });
  const payload = {
    title: req.body.title.trim(), author: req.body.author?.trim() || null,
    category: req.body.category || 'other', language: req.body.language?.trim() || null,
    pages: req.body.pages ? Number(req.body.pages) : null,
    description: req.body.description?.trim() || null, cover_url: req.body.cover_url?.trim() || null,
    featured: req.body.featured === true,
  };
  const { data, error } = await supabase.from('books').insert(payload).select('*').single();
  if (error) throw error;
  res.status(201).json({ data });
}));

router.put('/:id', requireAdminKey, asyncHandler(async (req, res) => {
  const errors = validateBook(req.body, true);
  if (errors.length) return res.status(400).json({ error: 'Invalid book data.', details: errors });
  if (!supabase) return res.status(503).json({ error: 'Configure Supabase to persist book records.' });
  const allowed = ['title', 'author', 'category', 'language', 'pages', 'description', 'cover_url', 'featured'];
  const payload = Object.fromEntries(allowed.filter((key) => req.body[key] !== undefined).map((key) => [key, req.body[key]]));
  if (payload.title) payload.title = payload.title.trim();
  if (payload.pages) payload.pages = Number(payload.pages);
  const { data, error } = await supabase.from('books').update(payload).eq('id', req.params.id).select('*').maybeSingle();
  if (error) throw error;
  if (!data) return res.status(404).json({ error: 'Book not found.' });
  res.json({ data });
}));

router.delete('/:id', requireAdminKey, asyncHandler(async (req, res) => {
  if (!supabase) return res.status(503).json({ error: 'Configure Supabase to delete persistent records.' });
  const { data, error } = await supabase.from('books').delete().eq('id', req.params.id).select('id').maybeSingle();
  if (error) throw error;
  if (!data) return res.status(404).json({ error: 'Book not found.' });
  res.json({ message: 'Book deleted.' });
}));

export default router;
