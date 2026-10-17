// Datos de la inscripción a la Diplomatura. Cambiar la cohorte acá cuando abra una nueva.
export const COHORTE_DIPLOMATURA = '27 de octubre';

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
