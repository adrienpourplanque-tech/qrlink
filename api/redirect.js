import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.redirect(302, '/');

  const { data } = await supabase
    .from('links')
    .select('url, scans')
    .eq('id', id)
    .single();

  if (!data) return res.status(404).send('Lien introuvable');

  await supabase
    .from('links')
    .update({ scans: (data.scans || 0) + 1 })
    .eq('id', id);

  res.redirect(302, data.url);
}
