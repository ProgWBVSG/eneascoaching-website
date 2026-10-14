-- Agenda de reuniones informativas (cecimentorcoach.com/agendar)
create table if not exists agenda_reuniones (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  trabajo text not null,
  telefono text,
  zona_horaria text,
  fecha date not null,          -- día en hora de Argentina
  hora text not null,           -- 'HH:MM' en hora de Argentina
  estado text not null default 'pendiente',  -- pendiente | confirmada | cancelada
  created_at timestamptz not null default now()
);

-- Evita que dos personas reserven el mismo horario (las canceladas liberan el lugar)
create unique index if not exists agenda_slot_unico
  on agenda_reuniones (fecha, hora) where estado <> 'cancelada';

alter table agenda_reuniones enable row level security;
