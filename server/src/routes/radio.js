import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { fallbackStations } from '../data/fallback.js';
import { requireAdminKey } from '../middleware/adminKey.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
function validStation(body, partial = false) {
  const errors = [];
  for (const key of ['name', 'stream_url']) {
    if ((!partial || body[key] !== undefined) && (typeof body[key] !== 'string' || body[key].trim().length < 4 || body[key].trim().length > 500)) errors.push(`${key} is required`);
  }
  if (body.stream_url !== undefined) {
    try { const url = new URL(body.stream_url); if (!['http:', 'https:'].includes(url.protocol)) errors.push('stream_url must use http or https'); }
    catch { errors.push('stream_url must be a valid URL'); }
  }
  for (const key of ['subtitle', 'location']) if (body[key] !== undefined && body[key] !== null && typeof body[key] !== 'string') errors.push(`${key} must be text`);
  if (body.enabled !== undefined && typeof body.enabled !== 'boolean') errors.push('enabled must be true or false');
  if (body.sort_order !== undefined && !Number.isInteger(Number(body.sort_order))) errors.push('sort_order must be an integer');
  return errors;
}

router.get('/', asyncHandler(async (_req, res) => {
  if (supabase) {
    const { data, error } = await supabase.from('radio_stations').select('*').eq('enabled', true).order('sort_order', { ascending: true });
    if (error) throw error;
    return res.json({ data: data || [], meta: { persistent: true } });
  }
  res.json({ data: fallbackStations.filter((s) => s.enabled).sort((a,b) => a.sort_order-b.sort_order), meta: { persistent: false } });
}));

router.get('/admin/all', requireAdminKey, asyncHandler(async (_req, res) => {
  if (supabase) {
    const { data, error } = await supabase.from('radio_stations').select('*').order('sort_order', { ascending: true });
    if (error) throw error;
    return res.json({ data: data || [] });
  }
  res.json({ data: fallbackStations, meta: { persistent: false } });
}));

router.post('/', requireAdminKey, asyncHandler(async (req, res) => {
  const errors = validStation(req.body);
  if (errors.length) return res.status(400).json({ error: 'Invalid station data.', details: errors });
  if (!supabase) return res.status(503).json({ error: 'Configure Supabase to persist radio stations.' });
  const payload = { name: req.body.name.trim(), subtitle: req.body.subtitle?.trim() || null, location: req.body.location?.trim() || null, stream_url: req.body.stream_url.trim(), enabled: req.body.enabled !== false, sort_order: Number(req.body.sort_order || 0) };
  const { data, error } = await supabase.from('radio_stations').insert(payload).select('*').single();
  if (error) throw error;
  res.status(201).json({ data });
}));

router.put('/:id', requireAdminKey, asyncHandler(async (req, res) => {
  const errors = validStation(req.body, true);
  if (errors.length) return res.status(400).json({ error: 'Invalid station data.', details: errors });
  if (!supabase) return res.status(503).json({ error: 'Configure Supabase to persist radio stations.' });
  const allowed = ['name', 'subtitle', 'location', 'stream_url', 'enabled', 'sort_order'];
  const payload = Object.fromEntries(allowed.filter((key) => req.body[key] !== undefined).map((key) => [key, req.body[key]]));
  const { data, error } = await supabase.from('radio_stations').update(payload).eq('id', req.params.id).select('*').maybeSingle();
  if (error) throw error;
  if (!data) return res.status(404).json({ error: 'Radio station not found.' });
  res.json({ data });
}));

router.delete('/:id', requireAdminKey, asyncHandler(async (req, res) => {
  if (!supabase) return res.status(503).json({ error: 'Configure Supabase to delete radio stations.' });
  const { data, error } = await supabase.from('radio_stations').delete().eq('id', req.params.id).select('id').maybeSingle();
  if (error) throw error;
  if (!data) return res.status(404).json({ error: 'Radio station not found.' });
  res.json({ message: 'Radio station deleted.' });
}));

export default router;
