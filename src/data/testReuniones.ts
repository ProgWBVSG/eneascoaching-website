// Test "¿Cómo liderás tus reuniones?" — oferta Reuniones con Ceci
// Autoevaluación orientativa sobre estilo de comunicación y liderazgo en reuniones.
// No es un diagnóstico psicológico ni clínico.

export type Area = 'claridad' | 'foco' | 'seguridad' | 'cierre' | 'implementacion';

export interface Opcion {
  label: string;
  area?: Area;      // sin area = respuesta de fortaleza, no suma limitación
  frio?: boolean;   // marca lead frío (todavía no lidera / sin impacto percibido)
  caliente?: boolean; // marca dolor concreto de negocio
}

export interface Pregunta {
  pregunta: string;
  opciones: Opcion[];
  peso?: number;    // multiplicador del puntaje de área
}

export const PREGUNTAS_REUNIONES: Pregunta[] = [
  {
    pregunta: 'Para ubicar mejor tu situación, ¿cuál de estas opciones te representa más?',
    opciones: [
      { label: 'Soy ejecutiva y lidero equipos.' },
      { label: 'Soy dueña de un negocio y lidero personas.' },
      { label: 'Soy profesional y coordino proyectos o reuniones.' },
      { label: 'Estoy empezando a asumir responsabilidades de liderazgo.', frio: true },
      { label: 'Todavía no lidero equipos, pero participo en reuniones importantes.', frio: true },
    ],
  },
  {
    pregunta: '¿Con qué frecuencia liderás reuniones o conversaciones importantes?',
    opciones: [
      { label: 'Varias veces por semana.' },
      { label: 'Una vez por semana.' },
      { label: 'Algunas veces al mes.' },
      { label: 'Ocasionalmente.' },
      { label: 'Todavía no las lidero, pero estoy empezando a hacerlo.', frio: true },
    ],
  },
  {
    pregunta: 'Antes de una reunión importante, ¿qué suele pasarte?',
    opciones: [
      { label: 'Sé exactamente qué quiero lograr y cómo voy a comunicarlo.' },
      { label: 'Tengo claro el tema, pero me cuesta ordenar mis ideas.', area: 'claridad' },
      { label: 'Preparo demasiada información y después no sé qué dejar afuera.', area: 'claridad' },
      { label: 'Llego preparada, pero me cuesta adaptarme a lo que ocurre durante la reunión.', area: 'foco' },
      { label: 'No siempre tengo claro qué resultado quiero obtener.', area: 'cierre' },
    ],
  },
  {
    pregunta: 'Cuando la conversación se desvía, ¿qué suele ocurrir?',
    opciones: [
      { label: 'Puedo recuperar el foco con claridad.' },
      { label: 'Espero demasiado y después cuesta volver al tema.', area: 'foco' },
      { label: 'Dejo que la conversación siga para no parecer autoritaria.', area: 'seguridad' },
      { label: 'Interrumpo, pero después siento que puedo sonar brusca.', area: 'seguridad' },
      { label: 'La reunión termina tratando varios temas y sin una dirección clara.', area: 'foco' },
    ],
  },
  {
    pregunta: 'Cuando tenés una idea o una opinión diferente, ¿cómo suele ser para vos expresarla?',
    opciones: [
      { label: 'Puedo plantearla y sostenerla con claridad.' },
      { label: 'La expreso, pero termino explicando demasiado.', area: 'claridad' },
      { label: 'Espero mucho para intervenir.', area: 'seguridad' },
      { label: 'Me cuesta sostenerla si alguien con más autoridad piensa diferente.', area: 'seguridad' },
      { label: 'A veces prefiero no decirla para evitar tensión.', area: 'seguridad' },
    ],
  },
  {
    pregunta: '¿Qué sucede cuando alguien te interrumpe o te hace una pregunta inesperada?',
    opciones: [
      { label: 'Puedo responder y retomar el hilo.' },
      { label: 'Me voy por las ramas intentando responder todo.', area: 'claridad' },
      { label: 'Pierdo el hilo de lo que estaba diciendo.', area: 'claridad' },
      { label: 'Me pongo a la defensiva o me cuesta responder con calma.', area: 'seguridad' },
      { label: 'Dejo de desarrollar mi idea.', area: 'seguridad' },
    ],
  },
  {
    pregunta: '¿Cómo suelen terminar tus reuniones?',
    opciones: [
      { label: 'Queda claro qué se decidió, quién se encarga y cuál es el próximo paso.' },
      { label: 'Se llega a una conclusión, pero las responsabilidades quedan poco claras.', area: 'implementacion' },
      { label: 'Se conversa mucho, pero cuesta tomar una decisión.', area: 'cierre' },
      { label: 'La decisión se posterga para otra reunión.', area: 'cierre' },
      { label: 'Cada persona se va con una interpretación distinta.', area: 'cierre' },
    ],
  },
  {
    pregunta: 'Después de la reunión, ¿qué suele pasar con lo acordado?',
    opciones: [
      { label: 'El equipo implementa lo definido sin demasiada intervención.' },
      { label: 'Algunas tareas avanzan y otras necesitan seguimiento constante.', area: 'implementacion' },
      { label: 'Tengo que repetir varias veces lo que se había acordado.', area: 'implementacion' },
      { label: 'Termino haciendo yo tareas que había delegado.', area: 'implementacion' },
      { label: 'El equipo entiende la conversación, pero le cuesta llevarla a la práctica.', area: 'implementacion' },
    ],
  },
  {
    pregunta: '¿Qué impacto sentís que tiene esta situación en tu negocio?',
    opciones: [
      { label: 'No genera un impacto importante.', frio: true },
      { label: 'Hace que algunas decisiones tarden más.', area: 'cierre' },
      { label: 'Me lleva a involucrarme en tareas que debería delegar.', area: 'implementacion', caliente: true },
      { label: 'Hace que mi equipo dependa demasiado de mí.', area: 'implementacion', caliente: true },
      { label: 'Siento que mis ideas y mi capacidad no se reflejan completamente.', area: 'seguridad', caliente: true },
      { label: 'Está afectando el crecimiento o el funcionamiento del negocio.', caliente: true },
    ],
  },
  {
    pregunta: 'Si pudieras destrabar una sola cosa en tu comunicación durante los próximos meses, ¿cuál elegirías?',
    peso: 2,
    opciones: [
      { label: 'Ordenar mis ideas.', area: 'claridad' },
      { label: 'Liderar reuniones con más claridad.', area: 'foco' },
      { label: 'Expresar mi opinión y sostenerla.', area: 'seguridad' },
      { label: 'Lograr que las reuniones terminen en decisiones.', area: 'cierre' },
      { label: 'Conseguir que el equipo implemente lo acordado.', area: 'implementacion' },
      { label: 'Descubrir mi estilo de comunicación.', area: 'seguridad' },
    ],
  },
];

export interface PerfilReunion {
  area: Area;
  titulo: string;
  estilo: string;         // descripción del estilo actual
  limitacion: string;     // "hoy tu principal limitación parece estar en ___"
  limitacionYo: string;   // misma idea en primera persona, para el mensaje de WhatsApp
  consecuencia: string;   // "esto puede estar generando ___"
  areaMejora: string;     // "lo primero que te convendría trabajar es ___"
  preguntaPractica: string;
  color: string;
}

export const PERFILES_REUNIONES: Record<Area, PerfilReunion> = {
  claridad: {
    area: 'claridad',
    titulo: 'Liderazgo con ideas dispersas',
    estilo: 'Tenés conocimiento y criterio de sobra. El tema es que intentás comunicar muchas cosas al mismo tiempo, y cuando todo pesa lo mismo, el mensaje pierde fuerza.',
    limitacion: 'ordenar tus ideas antes y durante las reuniones',
    limitacionYo: 'ordenar mis ideas antes y durante las reuniones',
    consecuencia: 'que tu equipo se quede con la información pero no con la conclusión, y que después tengas que volver a explicar lo que ya dijiste',
    areaMejora: 'la claridad: definir qué querés comunicar, por qué es importante y qué necesitás que ocurra después',
    preguntaPractica: 'Si solo pudiera decir una cosa en esta reunión, ¿cuál sería?',
    color: '#C5A059',
  },
  foco: {
    area: 'foco',
    titulo: 'Liderazgo que pierde el foco',
    estilo: 'Escuchás, abrís espacio y dejás participar, y eso es una fortaleza real. Lo que cuesta es recuperar la dirección cuando la conversación se aleja del objetivo.',
    limitacion: 'sostener la dirección de las reuniones',
    limitacionYo: 'sostener la dirección de mis reuniones',
    consecuencia: 'reuniones que se estiran, que tocan varios temas y que terminan sin que quede claro para qué se hicieron',
    areaMejora: 'la capacidad de guiar la conversación sin perder apertura ni claridad',
    preguntaPractica: '¿Cuál es el único punto que esta reunión no puede terminar sin resolver?',
    color: '#5DA8A0',
  },
  seguridad: {
    area: 'seguridad',
    titulo: 'Liderazgo que duda al expresarse',
    estilo: 'Las ideas están. Lo que todavía no encontró su forma es cómo comunicarlas con seguridad en los momentos de presión o desacuerdo.',
    limitacion: 'expresar y sostener tu posición',
    limitacionYo: 'expresar y sostener mi posición',
    consecuencia: 'que aportes menos de lo que sabés, que otras voces ocupen el espacio de decisión y que después quede esa sensación de "lo tendría que haber dicho"',
    areaMejora: 'descubrir tu estilo de comunicación y aprender a usarlo para expresar tus ideas con claridad e intención',
    preguntaPractica: '¿Qué es lo que hoy no estoy diciendo y el equipo necesita escuchar de mí?',
    color: '#8B6BB8',
  },
  cierre: {
    area: 'cierre',
    titulo: 'Liderazgo sin cierre',
    estilo: 'Tus reuniones tienen intercambio y contenido valioso. Lo que falta es el momento en el que la conversación se convierte en una decisión con nombre y fecha.',
    limitacion: 'convertir las conversaciones en decisiones concretas',
    limitacionYo: 'convertir las conversaciones en decisiones concretas',
    consecuencia: 'temas que vuelven a aparecer reunión tras reunión y decisiones que se postergan sin que nadie lo diga en voz alta',
    areaMejora: 'la estructura de cierre y la forma de llevar la reunión hacia un resultado concreto',
    preguntaPractica: 'Antes de cerrar: ¿qué decidimos, quién se encarga y para cuándo?',
    color: '#E07A8A',
  },
  implementacion: {
    area: 'implementacion',
    titulo: 'Liderazgo con dificultad para implementar',
    estilo: 'Tus reuniones se entienden. El problema aparece después, cuando lo acordado necesita moverse solo y termina volviendo a vos.',
    limitacion: 'lograr que lo conversado se transforme en acciones concretas',
    limitacionYo: 'lograr que lo conversado se transforme en acciones concretas',
    consecuencia: 'un equipo que depende de tu seguimiento para avanzar, y una agenda tuya llena de tareas que ya habías delegado',
    areaMejora: 'la comunicación de expectativas, responsabilidades, fechas y próximos pasos',
    preguntaPractica: '¿Qué parte de este acuerdo puede quedar sujeta a interpretación?',
    color: '#4A90C2',
  },
};

const ORDEN_DESEMPATE: Area[] = ['seguridad', 'cierre', 'implementacion', 'claridad', 'foco'];

export interface ResultadoReuniones {
  principal: PerfilReunion;
  secundaria: PerfilReunion | null;
  frio: boolean;
  caliente: boolean;
  scores: Record<Area, number>;
}

export const calcularResultado = (respuestas: number[]): ResultadoReuniones => {
  const scores: Record<Area, number> = { claridad: 0, foco: 0, seguridad: 0, cierre: 0, implementacion: 0 };
  let frio = false;
  let caliente = false;

  respuestas.forEach((optIdx, i) => {
    const preg = PREGUNTAS_REUNIONES[i];
    const op = preg?.opciones[optIdx];
    if (!op) return;
    if (op.area) scores[op.area] += preg.peso || 1;
    if (op.frio) frio = true;
    if (op.caliente) caliente = true;
  });

  const ranked = (Object.keys(scores) as Area[]).sort((a, b) => {
    if (scores[b] !== scores[a]) return scores[b] - scores[a];
    return ORDEN_DESEMPATE.indexOf(a) - ORDEN_DESEMPATE.indexOf(b);
  });

  const principalArea = ranked[0];
  const segundaArea = ranked[1];

  return {
    principal: PERFILES_REUNIONES[principalArea],
    secundaria: scores[segundaArea] > 0 && scores[segundaArea] >= scores[principalArea] - 1
      ? PERFILES_REUNIONES[segundaArea]
      : null,
    frio: frio && !caliente,
    caliente,
    scores,
  };
};
