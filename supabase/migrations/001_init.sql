-- ═══════════════════════════════════════════
--  SoloOficios — Schema inicial
--  Ejecutar en Supabase SQL Editor
-- ═══════════════════════════════════════════

-- ─── PROFILES (extiende auth.users) ───
create table if not exists public.profiles (
  id           uuid references auth.users(id) on delete cascade primary key,
  nombre       text not null,
  email        text not null,
  rol          text not null check (rol in ('cliente', 'profesional')),
  avatar_url   text,
  whatsapp     text,
  created_at   timestamptz default now()
);

-- ─── PROFESSIONALS ───
create table if not exists public.professionals (
  id             uuid references public.profiles(id) on delete cascade primary key,
  trade          text not null,
  category       text not null default 'Hogar',
  bio            text,
  price          integer not null default 5000,
  location       text not null default 'Catamarca Capital',
  radio          text not null default 'Solo capital',
  stars          numeric(3,1) not null default 0,
  reviews_count  integer not null default 0,
  verified       boolean not null default false,
  is_pro         boolean not null default false,
  is_matriculado boolean not null default false,
  matricula_num  text,
  response_time  text default '1 hr',
  reliability    integer default 90,
  experience     text,
  created_at     timestamptz default now()
);

-- ─── BOOKINGS (solicitudes) ───
create table if not exists public.bookings (
  id             uuid default gen_random_uuid() primary key,
  professional_id uuid references public.professionals(id) on delete cascade not null,
  client_id      uuid references public.profiles(id) on delete cascade not null,
  status         text not null default 'pending' check (status in ('pending','confirmed','completed','cancelled')),
  description    text not null,
  urgency        text not null default 'Esta semana',
  price          integer,
  created_at     timestamptz default now()
);

-- ─── CONVERSATIONS ───
create table if not exists public.conversations (
  id             uuid default gen_random_uuid() primary key,
  booking_id     uuid references public.bookings(id) on delete set null,
  client_id      uuid references public.profiles(id) on delete cascade not null,
  professional_id uuid references public.professionals(id) on delete cascade not null,
  last_message   text,
  last_message_at timestamptz default now(),
  created_at     timestamptz default now()
);

-- ─── MESSAGES ───
create table if not exists public.messages (
  id              uuid default gen_random_uuid() primary key,
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  sender_id       uuid references public.profiles(id) on delete cascade not null,
  text            text not null,
  type            text not null default 'text' check (type in ('text','presupuesto','sistema')),
  metadata        jsonb,
  created_at      timestamptz default now()
);

-- ─── REVIEWS ───
create table if not exists public.reviews (
  id              uuid default gen_random_uuid() primary key,
  professional_id uuid references public.professionals(id) on delete cascade not null,
  client_id       uuid references public.profiles(id) on delete cascade not null,
  booking_id      uuid references public.bookings(id) on delete set null,
  rating          integer not null check (rating between 1 and 5),
  comment         text,
  created_at      timestamptz default now(),
  unique(booking_id, client_id)
);

-- ═══════════════════════════════════════════
--  ROW LEVEL SECURITY
-- ═══════════════════════════════════════════

alter table public.profiles       enable row level security;
alter table public.professionals  enable row level security;
alter table public.bookings       enable row level security;
alter table public.conversations  enable row level security;
alter table public.messages       enable row level security;
alter table public.reviews        enable row level security;

-- profiles: lectura pública, escritura solo el dueño
create policy "profiles_select" on public.profiles for select using (true);
create policy "profiles_insert" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update" on public.profiles for update using (auth.uid() = id);

-- professionals: lectura pública, escritura solo el dueño
create policy "professionals_select" on public.professionals for select using (true);
create policy "professionals_insert" on public.professionals for insert with check (auth.uid() = id);
create policy "professionals_update" on public.professionals for update using (auth.uid() = id);

-- bookings: cliente o profesional involucrado
create policy "bookings_select" on public.bookings for select using (
  auth.uid() = client_id or auth.uid() = professional_id
);
create policy "bookings_insert" on public.bookings for insert with check (auth.uid() = client_id);
create policy "bookings_update" on public.bookings for update using (
  auth.uid() = client_id or auth.uid() = professional_id
);

-- conversations: participantes
create policy "conversations_select" on public.conversations for select using (
  auth.uid() = client_id or auth.uid() = professional_id
);
create policy "conversations_insert" on public.conversations for insert with check (
  auth.uid() = client_id or auth.uid() = professional_id
);

-- messages: participantes de la conversación
create policy "messages_select" on public.messages for select using (
  exists (
    select 1 from public.conversations c
    where c.id = conversation_id
    and (c.client_id = auth.uid() or c.professional_id = auth.uid())
  )
);
create policy "messages_insert" on public.messages for insert with check (auth.uid() = sender_id);

-- reviews: lectura pública, solo el cliente involucrado puede escribir
create policy "reviews_select" on public.reviews for select using (true);
create policy "reviews_insert" on public.reviews for insert with check (auth.uid() = client_id);

-- ═══════════════════════════════════════════
--  TRIGGER: crear profile al registrarse
-- ═══════════════════════════════════════════

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, nombre, email, rol)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nombre', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'rol', 'cliente')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ═══════════════════════════════════════════
--  FUNCIÓN: actualizar stars al agregar reseña
-- ═══════════════════════════════════════════

create or replace function public.update_professional_stars()
returns trigger language plpgsql security definer as $$
begin
  update public.professionals
  set
    stars = (select round(avg(rating)::numeric, 1) from public.reviews where professional_id = new.professional_id),
    reviews_count = (select count(*) from public.reviews where professional_id = new.professional_id)
  where id = new.professional_id;
  return new;
end;
$$;

drop trigger if exists on_review_created on public.reviews;
create trigger on_review_created
  after insert on public.reviews
  for each row execute procedure public.update_professional_stars();

-- ═══════════════════════════════════════════
--  SEED: profesionales de ejemplo
--  (Reemplazar los UUIDs con IDs reales de auth.users si los creás)
-- ═══════════════════════════════════════════

-- Los datos de prueba se pueden insertar desde el dashboard de Supabase
-- o ejecutando inserts después de crear usuarios reales con auth.
