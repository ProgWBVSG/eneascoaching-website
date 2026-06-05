// Cálculo del signo del zodíaco según fecha de nacimiento

export interface Signo {
  nombre: string;
  simbolo: string;
}

const SIGNOS: { nombre: string; simbolo: string; mesDesde: number; diaDesde: number; mesHasta: number; diaHasta: number }[] = [
  { nombre: 'Aries',       simbolo: '♈', mesDesde: 3,  diaDesde: 21, mesHasta: 4,  diaHasta: 20 },
  { nombre: 'Tauro',       simbolo: '♉', mesDesde: 4,  diaDesde: 21, mesHasta: 5,  diaHasta: 20 },
  { nombre: 'Géminis',     simbolo: '♊', mesDesde: 5,  diaDesde: 21, mesHasta: 6,  diaHasta: 21 },
  { nombre: 'Cáncer',      simbolo: '♋', mesDesde: 6,  diaDesde: 22, mesHasta: 7,  diaHasta: 23 },
  { nombre: 'Leo',         simbolo: '♌', mesDesde: 7,  diaDesde: 24, mesHasta: 8,  diaHasta: 23 },
  { nombre: 'Virgo',       simbolo: '♍', mesDesde: 8,  diaDesde: 24, mesHasta: 9,  diaHasta: 23 },
  { nombre: 'Libra',       simbolo: '♎', mesDesde: 9,  diaDesde: 24, mesHasta: 10, diaHasta: 22 },
  { nombre: 'Escorpio',    simbolo: '♏', mesDesde: 10, diaDesde: 23, mesHasta: 11, diaHasta: 22 },
  { nombre: 'Sagitario',   simbolo: '♐', mesDesde: 11, diaDesde: 23, mesHasta: 12, diaHasta: 21 },
  { nombre: 'Capricornio', simbolo: '♑', mesDesde: 12, diaDesde: 22, mesHasta: 1,  diaHasta: 20 },
  { nombre: 'Acuario',     simbolo: '♒', mesDesde: 1,  diaDesde: 21, mesHasta: 2,  diaHasta: 19 },
  { nombre: 'Piscis',      simbolo: '♓', mesDesde: 2,  diaDesde: 20, mesHasta: 3,  diaHasta: 20 },
];

export function getSigno(dia: number, mes: number): Signo | null {
  if (!dia || !mes || dia < 1 || dia > 31 || mes < 1 || mes > 12) return null;
  for (const s of SIGNOS) {
    if (s.mesDesde === s.mesHasta) {
      if (mes === s.mesDesde && dia >= s.diaDesde && dia <= s.diaHasta) return { nombre: s.nombre, simbolo: s.simbolo };
    } else if (s.mesDesde < s.mesHasta) {
      if ((mes === s.mesDesde && dia >= s.diaDesde) || (mes === s.mesHasta && dia <= s.diaHasta)) {
        return { nombre: s.nombre, simbolo: s.simbolo };
      }
    } else {
      // cruza año (Capricornio)
      if ((mes === s.mesDesde && dia >= s.diaDesde) || (mes === s.mesHasta && dia <= s.diaHasta)) {
        return { nombre: s.nombre, simbolo: s.simbolo };
      }
    }
  }
  return null;
}

export function calcularEdad(dia: number, mes: number, anio: number): number | null {
  if (!dia || !mes || !anio || anio < 1900 || anio > new Date().getFullYear()) return null;
  const hoy = new Date();
  let edad = hoy.getFullYear() - anio;
  const mesHoy = hoy.getMonth() + 1;
  const diaHoy = hoy.getDate();
  if (mesHoy < mes || (mesHoy === mes && diaHoy < dia)) edad--;
  return edad >= 0 ? edad : null;
}
