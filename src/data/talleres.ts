// Talleres cortos (ofertas temporales, low ticket). Para lanzar uno nuevo se agrega acá
// y queda en /taller/<id>; también aparece en /talleres. Los que ya pasaron muestran "inscripción cerrada".
//
// Proceso de un taller:
// 1. La persona completa el formulario de la landing → queda en Admin (encuestas → botón del taller)
//    y entra al grupo de MailerLite "Taller <título> · Inscriptos".
// 2. Transfiere al alias y manda el comprobante por WhatsApp.
// 3. En Admin, "Activar acceso": se crea su código del aula, se suma al grupo "Taller <título> · Activados"
//    (con su link en el campo acceso_taller) y se abre WhatsApp con el link listo para mandar.
// 4. Entra a su aula (/curso/<código>): calendario de encuentros + clases grabadas + e-book.
//    El material se carga en el Aula (Admin del aula) en el curso "Taller <título>".
export interface Encuentro {
  fecha: string;   // AAAA-MM-DD (hora Argentina)
  dia: string;     // "Sábado 31 de octubre"
  hora: string;    // "10:00" (24 h, Argentina). Vacío = se avisa por WhatsApp
  duracion: number; // minutos
}

// "09:30" + 120 min → "9:30 a 11:30"
export function rangoHora(e: Encuentro): string {
  const [h, m] = e.hora.split(':').map(Number);
  const fin = h * 60 + m + e.duracion;
  const f = (min: number) => `${Math.floor(min / 60) % 24}:${String(min % 60).padStart(2, '0')}`;
  return `${f(h * 60 + m)} a ${f(fin)}`;
}

export interface Taller {
  id: string;                 // va en el link: /taller/hacerte-entender
  titulo: string;
  subtitulo: string;
  frase: string;              // línea fuerte del hero
  cita: string;               // frase destacada (reencuadre)
  formato: string;            // "Taller práctico de comunicación y oratoria · 2 sábados"
  resumen: string;            // una línea para la tarjeta en /talleres
  videoUrl: string;           // video de venta (YouTube). Vacío = no se muestra
  imagen: string;             // foto de la tarjeta en /talleres
  dolores: string[];          // "¿Te pasa esto?" en segunda persona
  encuentros: Encuentro[];
  modalidad: string;          // "Online en vivo por Zoom" o la dirección. Vacío = no se muestra
  linkEncuentro: string;      // link de Zoom/Meet que se ve SOLO dentro del aula. Vacío = llega por WhatsApp
  aprenderas: string[];
  incluye: string[];
  precio: number;             // en pesos argentinos (transferencia)
  precioUSD: number;          // para quien paga desde afuera
  precioAntes: number | null; // precio tachado (solo si es real)
  cupos: number | null;       // null = no se muestra
  alias: string;              // alias para transferir en pesos
  cuenta: { cbu: string; numero: string; tipo: string; titular: string }; // datos completos, se muestran chicos
  survey: string;             // se guarda en encuesta_respuestas.survey (Admin)
}

export const TALLERES: Taller[] = [
  {
    id: 'hacerte-entender',
    titulo: 'Hacerte entender',
    subtitulo: 'El arte de comunicar con claridad, seguridad e impacto.',
    frase: 'No alcanza con tener algo para decir. Hay que aprender a transmitirlo.',
    cita: 'Porque comunicar no es solamente decir lo que pensás. Es lograr que el otro pueda comprender lo que querés transmitir.',
    formato: 'Taller práctico de comunicación y oratoria · 2 sábados',
    resumen: 'Taller práctico de comunicación y oratoria para expresar tus ideas con claridad y seguridad.',
    videoUrl: '',
    imagen: '/fotosCecilia/IMG_20250809_171402_158.jpg',
    dolores: [
      'Sabés lo que querés decir, pero cuando te toca hablar te quedás en blanco.',
      'Dijiste tu idea y nadie reaccionó. Cinco minutos después otro dijo lo mismo y lo aplaudieron.',
      'Te tiembla la voz justo cuando tenés que decir lo importante.',
      'Te callás para no generar conflicto, y después te quedás pensando lo que deberías haber dicho.',
    ],
    encuentros: [
      { fecha: '2026-11-07', dia: 'Sábado 7 de noviembre', hora: '09:30', duracion: 120 },
      { fecha: '2026-11-14', dia: 'Sábado 14 de noviembre', hora: '16:00', duracion: 120 },
    ],
    modalidad: '',
    linkEncuentro: '',
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
      'Tu propia aula online con el calendario y todo el material',
    ],
    precio: 45000,
    precioUSD: 30, // $45.000 al dólar del 20/10/2026 (~$1.545) ≈ USD 29, redondeado
    precioAntes: 85000,
    cupos: null,
    alias: 'ABOGAR204',
    cuenta: { cbu: '4530000800016927273511', numero: '1692727351', tipo: 'Caja de ahorro en pesos', titular: 'Guillermo Franco Vidal Sanchez' },
    survey: 'taller-hacerte-entender',
  },
];

const hoyAR = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date());

export const tallerPorId = (id?: string) => TALLERES.find(t => t.id === id) || null;
// El curso del Aula que corresponde a cada taller se llama "Taller <título>"
export const cursoTitulo = (t: Taller) => `Taller ${t.titulo}`;
export const tallerPorCurso = (tituloCurso?: string) => TALLERES.find(t => cursoTitulo(t) === tituloCurso) || null;
// Se puede inscribir hasta el día del primer encuentro inclusive
export const inscripcionAbierta = (t: Taller) => t.encuentros[0].fecha >= hoyAR();
export const tallerTerminado = (t: Taller) => t.encuentros[t.encuentros.length - 1].fecha < hoyAR();
export const fechasTexto = (t: Taller) => t.encuentros.map(e => e.dia).join(' y ');
export const pesos = (n: number) => `$${n.toLocaleString('es-AR')}`;

// Link para agendar un encuentro en Google Calendar
export const linkGoogleCalendar = (t: Taller, e: Encuentro) => {
  if (!e.hora) return '';
  const ini = new Date(`${e.fecha}T${e.hora}:00-03:00`);
  const fin = new Date(ini.getTime() + e.duracion * 60000);
  const f = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${cursoTitulo(t)} · Cecilia B. Sánchez`,
    dates: `${f(ini)}/${f(fin)}`,
    details: t.linkEncuentro ? `Link del encuentro: ${t.linkEncuentro}` : 'El link del encuentro te llega por WhatsApp.',
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
};
