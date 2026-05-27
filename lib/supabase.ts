import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Supabase renombró la clave pública del cliente: la nueva "publishable key"
// (sb_publishable_…) reemplaza a la antigua "anon key". Aceptamos ambas.
const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Cliente de Supabase para el navegador. Es `null` cuando las credenciales
 * no están configuradas, lo que permite que la app funcione con un almacén
 * local de respaldo (ver `lib/votes.ts`) sin romperse.
 */
export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;

export const isSupabaseConfigured = supabase !== null;
