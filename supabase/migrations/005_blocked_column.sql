-- Agregar columna blocked a profiles
alter table public.profiles add column if not exists blocked boolean not null default false;
