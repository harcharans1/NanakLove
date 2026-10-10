import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { asyncHandler } from '../utils/asyncHandler.js';
const router = Router();
router.post('/', asyncHandler(async (req, res) => {
  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
  if (name.length < 2 || name.length > 100) return res.status(400).json({ error: 'Name must be 2–100 characters.' });
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Enter a valid email address.' });
  if (message.length < 5 || message.length > 5000) return res.status(400).json({ error: 'Message must be 5–5000 characters.' });
  if (!supabase) return res.status(503).json({ error: 'Contact messages are not enabled yet. Configure Supabase and run the latest schema.' });
  const { error } = await supabase.from('contact_messages').insert({ name, email, message });
  if (error) throw error;
  res.status(201).json({ message: 'Your message has been received.' });
}));
export default router;
