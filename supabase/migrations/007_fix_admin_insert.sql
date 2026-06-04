-- Fix: permitir que admin inserte profesionales sin restricción de ID

-- 1. Eliminar política de insert restrictiva
drop policy if exists "professionals_insert" on public.professionals;

-- 2. Nueva política: el propio usuario O un admin puede insertar
create policy "professionals_insert" on public.professionals
  for insert with check (
    auth.uid() = id OR public.is_admin()
  );

-- Lo mismo para profiles
drop policy if exists "profiles_insert" on public.profiles;

create policy "profiles_insert" on public.profiles
  for insert with check (
    auth.uid() = id OR public.is_admin()
  );
