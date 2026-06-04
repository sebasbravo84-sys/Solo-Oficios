-- ═══════════════════════════════════════════
--  Tabla: notifications
--  Ejecutar en Supabase SQL Editor
-- ═══════════════════════════════════════════

create table if not exists public.notifications (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid references public.profiles(id) on delete cascade not null,
  from_user_id  uuid references public.profiles(id) on delete set null,
  message       text not null,
  type          text not null default 'solicitud' check (type in ('solicitud','mensaje','resena','sistema')),
  read          boolean not null default false,
  created_at    timestamptz default now()
);

alter table public.notifications enable row level security;

-- Solo el destinatario ve sus notificaciones
create policy "notifications_select" on public.notifications
  for select using (auth.uid() = user_id);

create policy "notifications_insert" on public.notifications
  for insert with check (true);

create policy "notifications_update" on public.notifications
  for update using (auth.uid() = user_id);

-- Activar Realtime en notifications
alter publication supabase_realtime add table public.notifications;
