// Talleres cortos (ofertas temporales, low ticket). Para lanzar uno nuevo se agrega acá
// y queda en /taller/<id>. Los que ya pasaron muestran "inscripción cerrada" solos.
export interface Taller {
  id: string;                 // va en el link: /taller/hacerte-entender
  titulo: string;
  subtitulo: string;
  frase: string;              // línea fuerte del hero
  cita: string;               // frase destacada en la sección del problema
  formato: string;            // "Taller práctico de comunicación y oratoria · 2 sábados"
  fechas: { fecha: string; dia: string }[];  // fecha AAAA-MM-DD (hora Argentina)
  horario: string;            // vacío = no se muestra
  modalidad: string;          // vacío = no se muestra
  aprenderas: string[];
  incluye: string[];
  precio: number;             // en pesos argentinos
  precioAntes: number | null; // precio tachado (solo si es real)
  cupos: number | null;       // null = no se muestra
  cursoId: string;            // id del curso en el Aula para cobrar con MercadoPago; vacío = se cobra por WhatsApp
  survey: string;             // se guarda en encuesta_respuestas.survey (se ve en el panel de Admin)
}

export const TALLERES: Taller[] = [
  {
    id: 'hacerte-entender',
    titulo: 'Hacerte entender',
    subtitulo: 'El arte de comunicar con claridad, seguridad e impacto.',
    frase: 'No alcanza con tener algo para decir. Hay que aprender a transmitirlo.',
    cita: 'Porque comunicar no es solamente decir lo que pensás. Es lograr que el otro pueda comprender lo que querés transmitir.',
    formato: 'Taller práctico de comunicación y oratoria · 2 sábados',
    fechas: [
      { fecha: '2026-10-31', dia: 'Sábado 31 de octubre' },
      { fecha: '2026-11-07', dia: 'Sábado 7 de noviembre' },
    ],
    horario: '',   // completar, por ejemplo "10 a 12 h (hora de Argentina)"
    modalidad: '', // completar: "Online en vivo por Zoom" o la dirección si es presencial
    aprenderas: [
      'A expresar tus ideas sin enredarte ni quedarte en blanco.',
      'A hablar con seguridad, incluso cuando sientes nervios.',
      'A decir lo que piensas sin agredir y a poner límites sin culpa.',
      'A escuchar para comprender, no solamente para responder.',
      'A comunicar con intención, conectar con otros y dejar huella.',
      'A hablar frente a otras personas y desenvolverse mejor en situaciones cotidianas y profesionales.',
    ],
    incluye: [
      '2 encuentros prácticos con Cecilia, los dos sábados',
      "4 clases grabadas de 20' para reforzar lo aprendido",
      'E-book con ejercicios prácticos',
      'Test de check-in para evaluar tu comunicación',
    ],
    precio: 45000,
    precioAntes: 85000,
    cupos: null,
    cursoId: '',
    survey: 'taller-hacerte-entender',
  },
];

const hoyAR = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date());

export const tallerPorId = (id?: string) => TALLERES.find(t => t.id === id) || null;
// Se puede inscribir hasta el día del primer encuentro inclusive
export const inscripcionAbierta = (t: Taller) => t.fechas[0].fecha >= hoyAR();
export const pesos = (n: number) => `$${n.toLocaleString('es-AR')}`;
