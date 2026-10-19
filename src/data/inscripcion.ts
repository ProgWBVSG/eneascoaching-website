// Cohortes de la Diplomatura. Para abrir una nueva, se agrega acá: las que ya empezaron se ocultan solas.
export interface Cohorte {
  id: string;          // va en el link: /inscripcion?cohorte=2027-03
  inicio: string;      // AAAA-MM-DD (hora de Argentina)
  dia: string;         // "Martes 27 de octubre de 2026"
  corto: string;       // "27 de octubre"
  graduacion: string;  // mes de cierre, sin día exacto
}

export const COHORTES: Cohorte[] = [
  { id: '2026-10', inicio: '2026-10-27', dia: 'Martes 27 de octubre de 2026', corto: '27 de octubre', graduacion: 'Abril 2027' },
  { id: '2027-03', inicio: '2027-03-16', dia: 'Martes 16 de marzo de 2027', corto: '16 de marzo', graduacion: 'Septiembre 2027' },
  { id: '2027-09', inicio: '2027-09-14', dia: 'Martes 14 de septiembre de 2027', corto: '14 de septiembre', graduacion: 'Marzo 2028' },
];

const hoyAR = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date());

// Se puede inscribir hasta el mismo día de inicio
export const cohortesAbiertas = () => COHORTES.filter(c => c.inicio >= hoyAR());
export const proximaCohorte = () => cohortesAbiertas()[0] || null;

export const FORMAS_PAGO = ['Pago único', 'En cuotas', 'Quiero que me cuenten las opciones'];
export const MEDIOS_PAGO = ['Transferencia bancaria (Argentina)', 'Mercado Pago', 'Tarjeta internacional / PayPal', 'Otro'];
export const ORIGENES = ['Instagram', 'YouTube', 'Recomendación de alguien', 'Reunión informativa con Cecilia', 'Google', 'Otro'];

export const ESTADOS_INSCRIPCION = [
  { id: 'nueva', label: 'Nueva', color: 'bg-amber-100 text-amber-700' },
  { id: 'pago_pendiente', label: 'Datos de pago enviados', color: 'bg-blue-100 text-blue-700' },
  { id: 'pagada', label: 'Pagada', color: 'bg-green-100 text-green-700' },
  { id: 'cancelada', label: 'Cancelada', color: 'bg-gray-100 text-gray-500' },
] as const;
export type EstadoInscripcion = typeof ESTADOS_INSCRIPCION[number]['id'];
