-- El Gran Secreto — Mandolese López
-- Ejecutar en el SQL Editor de Supabase.

create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  gender text not null check (gender in ('girl', 'boy')),
  message text,
  created_at timestamptz not null default now()
);

-- Habilitar Realtime para la tabla.
alter publication supabase_realtime add table public.votes;

-- Row Level Security: cualquiera puede leer y crear votos (app pública),
-- nadie puede editar ni borrar.
alter table public.votes enable row level security;

create policy "lectura pública de votos"
  on public.votes for select
  using (true);

create policy "creación pública de votos"
  on public.votes for insert
  with check (
    char_length(name) between 1 and 40
    and gender in ('girl', 'boy')
    and (message is null or char_length(message) <= 280)
  );
