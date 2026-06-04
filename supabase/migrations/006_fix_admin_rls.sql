-- ═══════════════════════════════════════════
--  Fix: infinite recursion en policies admin
--  Ejecutar en Supabase SQL Editor
-- ═══════════════════════════════════════════

-- 1. Eliminar las políticas que causan recursión
drop policy if exists "admin_all_profiles" on public.profiles;
drop policy if exists "admin_all_bookings" on public.bookings;
drop policy if exists "admin_all_reviews" on public.reviews;
drop policy if exists "admin_all_professionals" on public.professionals;

-- 2. Crear función que verifica admin SIN pasar por RLS
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin = true
  );
$$;

-- 3. Recrear políticas usando la función (sin recursión)
create policy "admin_all_profiles" on public.profiles
  for all using (public.is_admin());

create policy "admin_all_bookings" on public.bookings
  for all using (public.is_admin());

create policy "admin_all_reviews" on public.reviews
  for all using (public.is_admin());

create policy "admin_all_professionals" on public.professionals
  for all using (public.is_admin());
