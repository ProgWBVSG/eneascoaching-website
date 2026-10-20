-- Postulación a la Diplomatura: guarda todas las respuestas del formulario y una prioridad calculada.
alter table inscripciones_diplomatura add column if not exists respuestas jsonb;
alter table inscripciones_diplomatura add column if not exists prioridad text;   -- alta | media | baja
alter table inscripciones_diplomatura add column if not exists moneda text;      -- Pesos argentinos | Dólares
notify pgrst, 'reload schema';
