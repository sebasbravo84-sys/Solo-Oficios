-- ═══════════════════════════════════════════
--  Trigger: email de bienvenida al registrarse
--  Ejecutar en Supabase SQL Editor
-- ═══════════════════════════════════════════

-- Actualizar el trigger de nuevo usuario para enviar notificación de bienvenida
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  -- Crear perfil
  insert into public.profiles (id, nombre, email, rol)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nombre', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'rol', 'cliente')
  );

  -- Notificación de bienvenida en la plataforma
  insert into public.notifications (user_id, message, type)
  values (
    new.id,
    '¡Bienvenido a SoloOficios! Completá tu perfil para recibir más solicitudes.',
    'sistema'
  );

  return new;
end;
$$;
