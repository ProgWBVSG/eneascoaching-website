// Cohortes de la Diplomatura. Para abrir una nueva, se agrega acá: las que ya empezaron se ocultan solas.
export interface Cohorte {
  id: string;          // va en el link: /inscripcion?cohorte=2027-03
  inicio: string;      // AAAA-MM-DD (hora de Argentina)
  dia: string;         // "Martes 27 de octubre de 2026"
  corto: string;       // "27 de octubre"
  graduacion: string;  // mes de cierre, sin día exacto
  sena: boolean;       // true = el lugar se reserva con seña no reembolsable
}

export const COHORTES: Cohorte[] = [
  { id: '2026-10', inicio: '2026-10-27', dia: 'Martes 27 de octubre de 2026', corto: '27 de octubre', graduacion: 'Abril 2027', sena: false },
  { id: '2027-03', inicio: '2027-03-16', dia: 'Martes 16 de marzo de 2027', corto: '16 de marzo', graduacion: 'Septiembre 2027', sena: true },
  { id: '2027-09', inicio: '2027-09-14', dia: 'Martes 14 de septiembre de 2027', corto: '14 de septiembre', graduacion: 'Marzo 2028', sena: true },
];

const hoyAR = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date());

// Se puede postular hasta el mismo día de inicio
export const cohortesAbiertas = () => COHORTES.filter(c => c.inicio >= hoyAR());
export const proximaCohorte = () => cohortesAbiertas()[0] || null;

// Precio (en dólares; en Argentina se cobra en pesos al valor que se informa en la llamada)
export const PRECIO = { contado: 1500, cuotas: 1800, cuotasMin: 6, cuotasMax: 8 };

// ── Preguntas de la postulación ─────────────────────────────────────
// Se pueden agregar, sacar o reordenar: se guardan todas en la columna "respuestas" y el panel las muestra solas.
export interface Opcion { valor: string; label: string }
export interface Pregunta {
  id: string;
  label: string;
  ayuda?: string;
  tipo: 'opciones' | 'texto';
  opciones?: Opcion[];
  requerida: boolean;
  max?: number;
}

const op = (...labels: string[]): Opcion[] => labels.map(l => ({ valor: l, label: l }));

export const PREGUNTAS_POSTULACION: Pregunta[] = [
  {
    id: 'profesion', label: '¿A qué te dedicás?', tipo: 'opciones', requerida: true,
    opciones: op('Psicólogo/a o terapeuta', 'Coach', 'Recursos Humanos', 'Ejecutivo/a o líder de equipo', 'Abogado/a', 'Docente', 'Otro'),
  },
  {
    id: 'objetivo', label: '¿Para qué querés hacer la Diplomatura?', tipo: 'opciones', requerida: true,
    opciones: op('Sumarla a mis sesiones o a mi trabajo actual', 'Tener una nueva salida profesional', 'Liderar y acompañar mejor a mi equipo', 'Mi crecimiento personal'),
  },
  {
    id: 'motivo', label: '¿Qué está pasando hoy en tu vida que te impulsa a buscar esta formación?',
    ayuda: 'En pocas palabras.', tipo: 'texto', requerida: true, max: 300,
  },
  {
    id: 'experiencia', label: '¿Cuánto conocés el eneagrama?', tipo: 'opciones', requerida: true,
    opciones: op('Nada todavía', 'Hice un test o leí sobre el tema', 'Ya hice alguna formación'),
  },
  {
    id: 'inversion', label: 'La Diplomatura es una inversión en tu desarrollo personal y profesional. ¿Qué opción se ajusta mejor a vos?',
    ayuda: 'No es un compromiso, es para orientar la conversación.', tipo: 'opciones', requerida: true,
    opciones: [
      { valor: 'contado', label: `USD ${PRECIO.contado.toLocaleString('es-AR')} en un solo pago` },
      { valor: 'cuotas', label: `USD ${PRECIO.cuotas.toLocaleString('es-AR')} en ${PRECIO.cuotasMin} a ${PRECIO.cuotasMax} cuotas (desde USD ${Math.round(PRECIO.cuotas / PRECIO.cuotasMax)} por mes)` },
      { valor: 'conversar', label: 'Prefiero conversarlo en la llamada' },
      { valor: 'accesible', label: 'Hoy necesitaría una opción más accesible' },
    ],
  },
  {
    id: 'moneda', label: '¿En qué moneda pagarías?', tipo: 'opciones', requerida: true,
    opciones: op('Pesos argentinos', 'Dólares (pago internacional)'),
  },
];

export const PRIORIDADES = {
  alta: { label: 'Prioridad alta', color: 'bg-green-100 text-green-700' },
  media: { label: 'Prioridad media', color: 'bg-amber-100 text-amber-700' },
  baja: { label: 'Prioridad baja', color: 'bg-gray-100 text-gray-500' },
} as const;
export type Prioridad = keyof typeof PRIORIDADES;

export const ESTADOS_INSCRIPCION = [
  { id: 'nueva', label: 'Nueva', color: 'bg-amber-100 text-amber-700' },
  { id: 'pago_pendiente', label: 'Datos de pago enviados', color: 'bg-blue-100 text-blue-700' },
  { id: 'pagada', label: 'Pagada', color: 'bg-green-100 text-green-700' },
  { id: 'cancelada', label: 'Cancelada', color: 'bg-gray-100 text-gray-500' },
] as const;
export type EstadoInscripcion = typeof ESTADOS_INSCRIPCION[number]['id'];
