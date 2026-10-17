// Configuración de la agenda de reuniones informativas (horario de Argentina, UTC-3).
// Si hay que cambiar días u horarios, se edita acá y en api/cursos.js (AG_*).
export const AGENDA_VENTANAS: [string, string][] = [['09:00', '12:00'], ['16:30', '22:00']];
export const AGENDA_DIAS = [0, 1, 2, 3, 4, 5, 6]; // 0 = domingo … 6 = sábado
export const AGENDA_MINUTOS = 20; // duración de la reunión
export const AGENDA_PASO = 30; // cada cuántos minutos arranca un horario (deja margen entre reuniones)
export const AGENDA_DIAS_ADELANTE = 45;
export const AGENDA_HORAS_ANTICIPACION = 12;
export const ZONA_ARGENTINA = 'America/Argentina/Buenos_Aires';

const aMin = (h: string) => { const [a, b] = h.split(':').map(Number); return a * 60 + b; };
const aHora = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

export const HORARIOS_DEL_DIA: string[] = AGENDA_VENTANAS.flatMap(([ini, fin]) => {
  const out: string[] = [];
  for (let m = aMin(ini); m + AGENDA_MINUTOS <= aMin(fin); m += AGENDA_PASO) out.push(aHora(m));
  return out;
});

export const ZONAS: { tz: string; label: string }[] = [
  { tz: ZONA_ARGENTINA, label: 'Argentina' },
  { tz: 'America/Montevideo', label: 'Uruguay' },
  { tz: 'America/Santiago', label: 'Chile' },
  { tz: 'America/Asuncion', label: 'Paraguay' },
  { tz: 'America/La_Paz', label: 'Bolivia' },
  { tz: 'America/Sao_Paulo', label: 'Brasil (San Pablo)' },
  { tz: 'America/Lima', label: 'Perú' },
  { tz: 'America/Bogota', label: 'Colombia' },
  { tz: 'America/Guayaquil', label: 'Ecuador' },
  { tz: 'America/Caracas', label: 'Venezuela' },
  { tz: 'America/Panama', label: 'Panamá' },
  { tz: 'America/Costa_Rica', label: 'Costa Rica' },
  { tz: 'America/Mexico_City', label: 'México' },
  { tz: 'America/New_York', label: 'EE.UU. (Nueva York / Miami)' },
  { tz: 'America/Los_Angeles', label: 'EE.UU. (Los Ángeles)' },
  { tz: 'Europe/Madrid', label: 'España' },
];

export const instante = (fecha: string, hora: string) => new Date(`${fecha}T${hora}:00-03:00`);
export const fmtHora = (d: Date, tz: string) =>
  new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz }).format(d);
export const fmtDia = (d: Date, tz: string) =>
  new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: tz }).format(d);
export const hoyArgentina = () =>
  new Intl.DateTimeFormat('en-CA', { timeZone: ZONA_ARGENTINA }).format(new Date());
