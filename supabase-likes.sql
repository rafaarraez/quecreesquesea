-- El Gran Secreto — Mandolese López
-- Migración ADITIVA: likes anónimos en los mensajes (no toca la tabla votes).
-- Ejecutar en el SQL Editor de Supabase. Seguro de correr con la app en vivo.

create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  vote_id uuid not null references public.votes(id) on delete cascade,
  device_id text not null,
  created_at timestamptz not null default now(),
  -- Un solo like por dispositivo en cada mensaje.
  unique (vote_id, device_id)
);

create index if not exists likes_vote_id_idx on public.likes (vote_id);

-- Realtime para que los contadores suban en vivo.
alter publication supabase_realtime add table public.likes;

-- RLS: cualquiera puede leer y crear likes; nadie edita ni borra.
alter table public.likes enable row level security;

create policy "lectura pública de likes"
  on public.likes for select
  using (true);

create policy "creación pública de likes"
  on public.likes for insert
  with check (char_length(device_id) between 1 and 64);
