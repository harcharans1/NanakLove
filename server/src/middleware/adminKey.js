import { env } from '../config/env.js';

export function requireAdminKey(req, res, next) {
  if (!env.adminApiKey || env.adminApiKey.length < 32) {
    return res.status(503).json({
      error: 'Admin write routes are disabled. Configure a strong ADMIN_API_KEY in server/.env.',
    });
  }
  const provided = req.get('x-admin-key');
  if (!provided || provided !== env.adminApiKey) {
    return res.status(401).json({ error: 'Unauthorized admin request.' });
  }
  return next();
}
