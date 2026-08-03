// Test "¿Cómo liderás?" — instrumento original de Cecilia B. Sánchez (Eneascoaching)
// Escala Likert 1-5 por afirmación. Puntaje total 20-100.
export const AFIRMACIONES_LIDERAZGO: string[] = [
  'Me siento responsable de que las cosas se hagan correctamente.',
  'Suelo priorizar las necesidades de los demás antes que las mías.',
  'Me motiva alcanzar resultados y ser reconocido por ellos.',
  'Antes de actuar, necesito comprender mis emociones y las de los demás.',
  'Busco que cada persona pueda expresar su individualidad.',
  'Analizo todas las alternativas antes de tomar una decisión importante.',
  'Valoro profundamente la armonía y evito los conflictos innecesarios.',
  'Cuando surge un problema, tomo el control rápidamente.',
  'Me entusiasman los desafíos y las nuevas oportunidades.',
  'Delego tareas con confianza en mi equipo.',
  'Escucho opiniones diferentes antes de decidir.',
  'Me resulta fácil dar retroalimentación constructiva.',
  'Inspiro a otros con el ejemplo.',
  'Reconozco mis errores y aprendo de ellos.',
  'Mantengo la calma bajo presión.',
  'Adapto mi estilo de liderazgo según la persona y la situación.',
  'Promuevo un clima de confianza y colaboración.',
  'Me animo a conversar temas difíciles cuando es necesario.',
  'Ayudo a que otros desarrollen su potencial.',
  'Mi liderazgo genera compromiso más que obediencia.',
];

export const PREGUNTA_REFLEXION =
  '¿Cuál de estas afirmaciones te resultó más difícil responder con un 5, y qué creés que eso dice sobre tu forma de liderar?';

export const ESCALA_LIKERT = [
  { valor: 1, label: 'Nunca' },
  { valor: 2, label: 'Rara vez' },
  { valor: 3, label: 'A veces' },
  { valor: 4, label: 'Frecuentemente' },
  { valor: 5, label: 'Siempre' },
];

export interface BandaResultado {
  min: number;
  max: number;
  titulo: string;
  descripcion: string;
  color: string;
}

export const BANDAS_LIDERAZGO: BandaResultado[] = [
  {
    min: 80, max: 100,
    titulo: 'Liderazgo consciente',
    descripcion: 'Tu liderazgo refleja un alto nivel de conciencia y adaptabilidad. Sabés leer a tu equipo y ajustar tu forma de liderar según lo que cada situación necesita, sin perder el eje.',
    color: '#5DA8A0',
  },
  {
    min: 60, max: 79,
    titulo: 'Buena base, con margen real',
    descripcion: 'Contás con una buena base de liderazgo y hay aspectos específicos para fortalecer. No es una cuestión de "aprender de cero", sino de afinar hábitos concretos que ya tenés instalados.',
    color: '#C5A059',
  },
  {
    min: 40, max: 59,
    titulo: 'Momento de revisar el patrón',
    descripcion: 'Es una oportunidad para revisar creencias, hábitos y formas de vincularte al liderar. Algo de lo que hacés hoy probablemente te esté costando más energía de la que debería.',
    color: '#E8B842',
  },
  {
    min: 0, max: 39,
    titulo: 'Ahí hay mucho para descubrir',
    descripcion: 'Explorar tu estilo de liderazgo desde el Eneagrama puede ayudarte a descubrir fortalezas ocultas y puntos ciegos que hoy no estás viendo. El primer paso ya lo diste, haciendo este test.',
    color: '#B83A3A',
  },
];

export const getBanda = (score: number): BandaResultado =>
  BANDAS_LIDERAZGO.find(b => score >= b.min && score <= b.max) || BANDAS_LIDERAZGO[BANDAS_LIDERAZGO.length - 1];
