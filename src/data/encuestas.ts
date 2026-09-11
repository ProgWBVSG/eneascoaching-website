// Encuestas de investigación de dolores (modelo "deep dive": frustración #1,
// por qué ahora, qué intentaron, contexto, contacto). Una config por cuenta.

export type TipoPregunta = 'choice' | 'text' | 'short';

export interface PreguntaEncuesta {
  key: string;
  tipo: TipoPregunta;
  pregunta: string;
  placeholder?: string;
  opciones?: string[];     // solo para 'choice'; la opción "Otro" abre un campo libre
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
      pregunta: '¿Cuál de estas opciones te describe mejor?',
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
      key: 'tiempo', tipo: 'short',
      pregunta: '¿Hace cuánto liderás equipos o reuniones?',
      placeholder: 'Ej: 3 años, 6 meses...',
    },
  ],
  preguntaAviso: 'Si armo algo puntual para resolver esto, ¿querés que te avise apenas esté listo?',
  gracias: 'Leo cada respuesta personalmente. Lo que me contaste es justo lo que necesito para armar algo que te sirva de verdad.',
  whatsapp: '5493515632496',
};

export const ENCUESTA_ENEAGRAMA: EncuestaConfig = {
  key: 'eneagrama',
  marca: 'ENEASCOACHING',
  titulo: 'Contame qué te está costando',
  intro: 'Estoy preparando algo nuevo sobre Eneagrama y antes de armarlo quiero escucharte a vos. Son 5 preguntas, 2 minutos.',
  preguntas: [
    {
      key: 'rol', tipo: 'choice', requerida: true,
      pregunta: '¿A qué te dedicás?',
      opciones: ['Coach eneagramista', 'Coach ontológico/a', 'Abogado/a', 'Psicólogo/a o terapeuta', 'Otro'],
    },
    {
      key: 'frustracion', tipo: 'text', requerida: true,
      pregunta: '¿Cuál es tu frustración número uno hoy con el Eneagrama, ya sea para aplicarlo en tu vida o en tu trabajo?',
      placeholder: 'Contame qué es lo que más te frustra...',
    },
    {
      key: 'porque', tipo: 'text', requerida: true,
      pregunta: '¿Por qué justamente eso es lo que más te gustaría resolver ahora?',
      placeholder: 'Qué te está costando, qué cambiaría si lo resolvés...',
    },
    {
      key: 'intentos', tipo: 'text', requerida: true,
      pregunta: '¿Ya intentaste resolverlo antes, con libros, cursos, tests o con alguien? Contame qué hiciste y qué pasó.',
      placeholder: 'Contame tu experiencia previa...',
    },
    {
      key: 'tiempo', tipo: 'short',
      pregunta: '¿Hace cuánto conocés el Eneagrama?',
      placeholder: 'Ej: 2 años, unos meses, recién empiezo...',
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
