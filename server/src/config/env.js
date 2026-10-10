import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT || 4000),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  adminApiKey: process.env.ADMIN_API_KEY || '',
};

export const hasSupabase = Boolean(env.supabaseUrl && env.supabaseServiceRoleKey);
