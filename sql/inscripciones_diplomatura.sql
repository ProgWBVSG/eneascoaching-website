-- Inscripciones a la Diplomatura (cecimentorcoach.com/inscripcion)
create table if not exists inscripciones_diplomatura (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  email text not null,
  telefono text not null,
  pais text,
  profesion text,
  origen text,                  -- cómo nos conoció
  forma_pago text,              -- pago único | cuotas | quiero opciones
  medio_pago text,              -- transferencia | mercado pago | tarjeta internacional | otro
  comentario text,
  cohorte text,                 -- ej. "27 de octubre"
  estado text not null default 'nueva',  -- nueva | pago_pendiente | pagada | cancelada
  notas text,                   -- notas internas de Cecilia
  created_at timestamptz not null default now()
);

alter table inscripciones_diplomatura enable row level security;
