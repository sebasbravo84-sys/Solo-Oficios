-- ═══════════════════════════════════════════
--  Rol admin
--  Ejecutar en Supabase SQL Editor
-- ═══════════════════════════════════════════

-- Agregar columna is_admin a profiles
alter table public.profiles add column if not exists is_admin boolean not null default false;

-- Marcar tu usuario como admin (reemplazar con tu email real)
update public.profiles set is_admin = true
where email = 'sebastianbravo84@gmail.com';

-- Policy: solo admins pueden ver todos los perfiles
create policy "admin_all_profiles" on public.profiles
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- Policy: admins pueden ver todos los bookings
create policy "admin_all_bookings" on public.bookings
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- Policy: admins pueden gestionar todas las reseñas
create policy "admin_all_reviews" on public.reviews
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- Policy: admins pueden gestionar todos los profesionales
create policy "admin_all_professionals" on public.professionals
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );
