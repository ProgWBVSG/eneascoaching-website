// 10 preguntas de opción única. Cada opción mapea a un estilo de liderazgo.
export interface OpcionLiderazgo { label: string; estilo: string; }
export interface PreguntaLiderazgo { pregunta: string; opciones: OpcionLiderazgo[]; }

export const PREGUNTAS_LIDERAZGO: PreguntaLiderazgo[] = [
  {
    pregunta: 'Alguien de tu equipo entrega algo con errores. ¿Qué hacés?',
    opciones: [
      { label: 'Lo corrijo y le muestro exactamente qué estuvo mal', estilo: 'exigente' },
      { label: 'Lo arreglo yo para que no se sienta mal', estilo: 'protector' },
      { label: 'Le recuerdo hacia dónde vamos para que entienda por qué importa', estilo: 'visionario' },
      { label: 'Lo resuelvo rápido y sigo, no hay tiempo para vueltas', estilo: 'ejecutor' },
      { label: 'Se lo comento con cuidado para no desmotivarlo', estilo: 'mediador' },
    ],
  },
  {
    pregunta: 'Hay que tomar una decisión difícil y el equipo está dividido. ¿Cómo la manejás?',
    opciones: [
      { label: 'Analizo cuál es objetivamente la opción correcta', estilo: 'exigente' },
      { label: 'Me fijo cuál afecta menos a la gente', estilo: 'protector' },
      { label: 'Elijo la que nos deja mejor parados a futuro', estilo: 'visionario' },
      { label: 'Decido yo y avanzamos, después se ve', estilo: 'ejecutor' },
      { label: 'Busco una salida que deje a todos conformes', estilo: 'mediador' },
    ],
  },
  {
    pregunta: 'Cuando delegás algo importante, lo que más te cuesta es...',
    opciones: [
      { label: 'Que no lo hagan con el nivel que yo esperaba', estilo: 'exigente' },
      { label: 'Cargar a alguien que ya está con mucho encima', estilo: 'protector' },
      { label: 'Explicar toda la idea antes de que puedan arrancar', estilo: 'visionario' },
      { label: 'Esperar. Muchas veces termino haciéndolo yo', estilo: 'ejecutor' },
      { label: 'Elegir a quién sin que el resto se sienta desplazado', estilo: 'mediador' },
    ],
  },
  {
    pregunta: 'Tu equipo está desmotivado. ¿Cuál es tu primer instinto?',
    opciones: [
      { label: 'Revisar qué se está haciendo mal y ordenarlo', estilo: 'exigente' },
      { label: 'Hablar uno por uno para ver cómo están', estilo: 'protector' },
      { label: 'Recordarles el propósito, el para qué de todo esto', estilo: 'visionario' },
      { label: 'Poner un objetivo claro y salir a buscarlo', estilo: 'ejecutor' },
      { label: 'Bajar la tensión y mejorar el clima del grupo', estilo: 'mediador' },
    ],
  },
  {
    pregunta: 'Si tu equipo tuviera que describirte en una frase, diría...',
    opciones: [
      { label: '"Con ella no se pasa nada por alto"', estilo: 'exigente' },
      { label: '"Siempre está cuando la necesitás"', estilo: 'protector' },
      { label: '"Siempre tiene una idea nueva"', estilo: 'visionario' },
      { label: '"Con ella las cosas pasan"', estilo: 'ejecutor' },
      { label: '"Sabe escuchar a todos"', estilo: 'mediador' },
    ],
  },
  {
    pregunta: 'Tenés que dar una devolución negativa. ¿Cómo llegás a esa conversación?',
    opciones: [
      { label: 'Con los puntos anotados, bien concreta', estilo: 'exigente' },
      { label: 'Pensando cómo decirlo sin lastimar', estilo: 'protector' },
      { label: 'Enfocándome en el potencial que veo en esa persona', estilo: 'visionario' },
      { label: 'Directo al punto, sin rodeos', estilo: 'ejecutor' },
      { label: 'Buscando el momento adecuado, a veces lo postergo', estilo: 'mediador' },
    ],
  },
  {
    pregunta: 'Un proyecto se está atrasando. ¿Qué es lo primero que hacés?',
    opciones: [
      { label: 'Reviso dónde se rompió el proceso', estilo: 'exigente' },
      { label: 'Me sumo a ayudar para que salgan adelante', estilo: 'protector' },
      { label: 'Replanteo si vale la pena seguir por ese camino', estilo: 'visionario' },
      { label: 'Tomo el control y acelero', estilo: 'ejecutor' },
      { label: 'Hablo con todos para entender qué está pasando', estilo: 'mediador' },
    ],
  },
  {
    pregunta: 'Lo que más te agota de liderar es...',
    opciones: [
      { label: 'Tener que estar encima de todo para que salga bien', estilo: 'exigente' },
      { label: 'Cargar con los problemas de todo el mundo', estilo: 'protector' },
      { label: 'Que no avancen al ritmo que necesito', estilo: 'visionario' },
      { label: 'Que todas las decisiones terminen en mí', estilo: 'ejecutor' },
      { label: 'Sostener el clima cuando hay tensión', estilo: 'mediador' },
    ],
  },
  {
    pregunta: 'Alguien cuestiona una decisión tuya delante del equipo. ¿Qué sentís?',
    opciones: [
      { label: 'Ganas de explicar con datos por qué tengo razón', estilo: 'exigente' },
      { label: 'Preocupación por cómo queda el vínculo después', estilo: 'protector' },
      { label: 'Curiosidad, capaz ve algo que yo no vi', estilo: 'visionario' },
      { label: 'Que hay que zanjarlo ahí mismo', estilo: 'ejecutor' },
      { label: 'Incomodidad, prefiero hablarlo en privado', estilo: 'mediador' },
    ],
  },
  {
    pregunta: 'Elegí la frase con la que más te identificás:',
    opciones: [
      { label: '"Si no lo reviso yo, no sale bien"', estilo: 'exigente' },
      { label: '"Primero está la gente"', estilo: 'protector' },
      { label: '"Siempre hay una forma mejor de hacer esto"', estilo: 'visionario' },
      { label: '"Prefiero equivocarme rápido que dudar lento"', estilo: 'ejecutor' },
      { label: '"Si el equipo está bien, todo fluye"', estilo: 'mediador' },
    ],
  },
];
