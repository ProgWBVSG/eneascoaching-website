// Encuestas de investigación de dolores (modelo "deep dive": frustración #1,
// por qué ahora, qué intentaron, contexto, contacto). Una config por cuenta.

export type TipoPregunta = 'choice' | 'text' | 'short' | 'cards';

export interface OpcionCard {
  label: string;      // título grande de la tarjeta (ej: "Diplomatura en Eneagrama")
  sublabel: string;    // texto chico debajo: para quién es / qué incluye
}

export interface PreguntaEncuesta {
  key: string;
  tipo: TipoPregunta;
  pregunta: string;
  placeholder?: string;
  opciones?: string[];     // para 'choice'; la opción "Otro" abre un campo libre
  cards?: OpcionCard[];    // para 'cards': tarjetas grandes con título + descripción
  requerida?: boolean;
}

export interface EncuestaConfig {
  key: string;             // se guarda en la columna `survey`
  marca: string;           // texto del header
  intro: string;           // línea bajo el título en la portada
  titulo: string;
  preguntas: PreguntaEncuesta[];
  preguntaAviso: string;   // "Si armo algo puntual..., ¿querés que te avise?"
  gracias: string;
  whatsapp: string;        // número sin +
}

export const ENCUESTA_REUNIONES: EncuestaConfig = {
  key: 'reuniones',
  marca: 'REUNIONES CON CECI',
  titulo: 'Contame qué te está frenando',
  intro: 'Estoy armando algo nuevo para ejecutivos y líderes que quieren ordenar sus ideas y liderar mejor sus reuniones. Antes de armarlo, quiero escucharte a vos. Son 5 preguntas, 2 minutos.',
  preguntas: [
    {
      key: 'rol', tipo: 'choice', requerida: true,
      pregunta: 'Para ubicarte mejor, ¿qué es lo que más se parece a tu día a día hoy?',
      opciones: ['Lidero un equipo', 'Soy ejecutivo/a o gerente', 'Tengo mi propio negocio', 'Coordino proyectos o reuniones', 'Otro'],
    },
    {
      key: 'frustracion', tipo: 'text', requerida: true,
      pregunta: '¿Qué es lo que más te frena hoy cuando tenés que liderar una reunión o comunicar una idea importante?',
      placeholder: 'Contame qué es lo que más te cuesta...',
    },
    {
      key: 'porque', tipo: 'text', requerida: true,
      pregunta: '¿Por qué justamente eso es lo que más te gustaría resolver ahora?',
      placeholder: 'Qué te está costando, qué cambiaría si lo resolvés...',
    },
    {
      key: 'intentos', tipo: 'text', requerida: true,
      pregunta: '¿Ya intentaste resolverlo antes, con un curso, con un coach o por tu cuenta? Contame qué hiciste y qué pasó.',
      placeholder: 'Contame tu experiencia previa...',
    },
    {
      key: 'tiempo', tipo: 'choice',
      pregunta: '¿Hace cuánto liderás equipos o reuniones?',
      opciones: ['Entre 3 y 6 meses', 'Entre 6 y 12 meses', 'Entre 2 y 4 años', 'Entre 5 y 7 años', 'Más de 10 años'],
    },
  ],
  preguntaAviso: 'Si armo algo puntual para resolver esto, ¿querés que te avise apenas esté listo?',
  gracias: 'Leo cada respuesta personalmente. Lo que me contaste es justo lo que necesito para armar algo que te sirva de verdad.',
  whatsapp: '5493515632496',
};

export const ENCUESTA_ENEAGRAMA: EncuestaConfig = {
  key: 'eneagrama',
  // Estudio de mercado para la academia y la comunidad: sin nombrar el
  // Eneagrama ni ofertas, para no sesgar a quien todavía no lo conoce.
  marca: 'CECILIA B. SÁNCHEZ',
  titulo: 'Contame qué te está costando',
  intro: 'Estoy armando un espacio nuevo para profesionales que acompañan a personas y equipos. Antes de armarlo, quiero escucharte a vos. Son 5 preguntas, 2 minutos.',
  preguntas: [
    {
      key: 'rol', tipo: 'choice', requerida: true,
      pregunta: '¿A qué te dedicás?',
      opciones: ['Psicólogo/a o terapeuta', 'Coach', 'Recursos Humanos', 'Abogado/a', 'Otro'],
    },
    {
      key: 'frustracion', tipo: 'text', requerida: true,
      pregunta: '¿Qué es lo que más te frena hoy en tu trabajo acompañando a personas o equipos?',
      placeholder: 'Contame qué es lo que más te cuesta...',
    },
    {
      key: 'porque', tipo: 'text', requerida: true,
      pregunta: '¿Por qué justamente eso es lo que más te gustaría resolver ahora?',
      placeholder: 'Qué te está costando, qué cambiaría si lo resolvés...',
    },
    {
      key: 'intentos', tipo: 'text', requerida: true,
      pregunta: '¿Ya intentaste resolverlo antes, con cursos, formaciones, supervisión o por tu cuenta? Contame qué hiciste y qué pasó.',
      placeholder: 'Contame tu experiencia previa...',
    },
    {
      key: 'tiempo', tipo: 'choice',
      pregunta: '¿Hace cuánto trabajás acompañando a personas o equipos?',
      opciones: ['Entre 3 y 6 meses', 'Entre 6 y 12 meses', 'Entre 2 y 4 años', 'Entre 5 y 7 años', 'Más de 10 años'],
    },
  ],
  preguntaAviso: 'Si armo algo puntual para resolver esto, ¿querés que te avise apenas esté listo?',
  gracias: 'Leo cada respuesta personalmente. Lo que me contaste es justo lo que necesito para armar algo que te sirva de verdad.',
  whatsapp: '5493515632496',
};

export const ENCUESTAS: Record<string, EncuestaConfig> = {
  reuniones: ENCUESTA_REUNIONES,
  eneagrama: ENCUESTA_ENEAGRAMA,
};
