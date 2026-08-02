// Estilos de liderazgo: contenido original para el Test de Liderazgo
export interface EstiloLiderazgo {
  key: string;
  nombre: string;
  tagline: string;
  color: string;
  description: string;      // cómo se ve este liderazgo en el día a día
  fortalezas: string[];     // 3 fortalezas concretas
  mejoras: string[];        // 3 puntos de mejora accionables
  costoOculto: string;      // lo que este estilo le cuesta al equipo (y a la persona)
  siguiente: string;        // el próximo paso de crecimiento
  eneatipos: number[];      // los 2 eneatipos que más suelen mostrar este estilo
  eneagramInsight: string;  // conecta el estilo con esos eneatipos
}

export const ESTILOS_LIDERAZGO: Record<string, EstiloLiderazgo> = {
  exigente: {
    key: 'exigente',
    nombre: 'El líder exigente',
    tagline: 'Tu estándar es alto. A veces demasiado.',
    color: '#B85C38',
    description: 'Tenés una vara muy clara de cómo deberían hacerse las cosas y te cuesta bajarla. Sos la persona que detecta el error que nadie vio, y eso hizo que el equipo confíe en tu criterio. Pero también hizo que muchos prefieran no arriesgarse a proponer nada.',
    fortalezas: [
      'Detectás problemas antes de que se vuelvan graves',
      'Tu equipo sabe exactamente qué se espera de cada uno',
      'Sostenés la calidad incluso cuando nadie está mirando',
    ],
    mejoras: [
      'Empezá a corregir menos y preguntar más: "¿cómo lo harías vos?"',
      'Elegí conscientemente dos cosas por semana donde aceptes un resultado bueno en vez de perfecto',
      'Cuando algo sale bien, decilo en voz alta. Tu equipo necesita escucharlo más de lo que creés',
    ],
    costoOculto: 'La gente deja de traerte ideas nuevas porque anticipa la corrección. Terminás con un equipo que ejecuta bien pero no piensa, y con vos cargando todas las decisiones.',
    siguiente: 'Tu crecimiento no está en bajar el estándar. Está en aprender a construirlo con el equipo en vez de imponerlo.',
    eneatipos: [1, 3],
    eneagramInsight: 'En el Eneagrama, este estilo suele darse en los tipos 1 (el Reformador) y 3 (el Triunfador): uno busca que las cosas estén bien hechas, el otro que los resultados hablen por él. Detrás de la exigencia suele haber una pregunta más honda: ¿mi valor depende de lo que logro?',
  },

  protector: {
    key: 'protector',
    nombre: 'El líder protector',
    tagline: 'Cuidás tanto al equipo que a veces lo frenás.',
    color: '#5DA8A0',
    description: 'Tu gente sabe que podés bancarla. Absorbés la presión de arriba, resolvés los problemas antes de que lleguen al equipo y te involucrás cuando alguien está pasando un mal momento. Sos el líder que muchos quisieran tener. El problema es que ese cuidado, llevado al extremo, no deja crecer.',
    fortalezas: [
      'Generás un nivel de confianza y lealtad que pocos líderes logran',
      'Tu equipo se anima a decirte la verdad, incluso las malas noticias',
      'Sostenés el clima del equipo en los momentos difíciles',
    ],
    mejoras: [
      'Antes de resolver algo por alguien, preguntate: "¿lo estoy ayudando o lo estoy reemplazando?"',
      'Delegá una tarea incómoda esta semana y no la retomes, aunque la hagan distinto a vos',
      'Practicá dar una devolución dura sin envolverla en tanto amortiguador: se entiende mejor y respeta más',
    ],
    costoOculto: 'Terminás sobrecargado, resolviendo cosas que no te corresponden, mientras tu equipo no desarrolla autonomía. Y cuando no estás, todo se frena.',
    siguiente: 'Cuidar de verdad a alguien a veces es dejarlo enfrentar algo difícil. Ahí empieza tu próximo nivel como líder.',
    eneatipos: [2, 6],
    eneagramInsight: 'En el Eneagrama, este estilo aparece en los tipos 2 (el Ayudador) y 6 (el Leal): uno lidera desde el cuidado, el otro desde la lealtad y la anticipación del riesgo. La pregunta de fondo suele ser: ¿me necesitan, o me eligen?',
  },

  visionario: {
    key: 'visionario',
    nombre: 'El líder visionario',
    tagline: 'Ves lejos. El equipo a veces no te sigue el ritmo.',
    color: '#C9A227',
    description: 'Tenés una capacidad natural para ver hacia dónde va todo y entusiasmar a otros con esa imagen. Arrancás proyectos, abrís puertas, conectás ideas que nadie había conectado. Pero mientras vos ya estás tres pasos adelante, tu equipo todavía está tratando de entender el primero.',
    fortalezas: [
      'Inspirás y movilizás: la gente quiere trabajar en lo que vos proponés',
      'Ves oportunidades donde otros ven riesgo',
      'Le das sentido al trabajo del equipo, no solo tareas',
    ],
    mejoras: [
      'Antes de lanzar la próxima idea, terminá de aterrizar la anterior. Elegí una',
      'Traducí la visión en los próximos 3 pasos concretos: la gente ejecuta pasos, no conceptos',
      'Preguntá "¿esto se entiende?" y esperá la respuesta real, no la de compromiso',
    ],
    costoOculto: 'El equipo vive con la sensación de que nada se termina. Se genera cansancio y escepticismo: "otra idea nueva". Y tu credibilidad se desgasta con cada proyecto que queda a mitad de camino.',
    siguiente: 'La visión sin ejecución es solo una charla linda. Tu salto está en aprender a sostener el aburrimiento de terminar lo que empezaste.',
    eneatipos: [7, 4],
    eneagramInsight: 'En el Eneagrama, este estilo conecta con los tipos 7 (el Entusiasta) y 4 (el Individualista): uno se enciende con lo nuevo, el otro con lo distinto y significativo. La pregunta honesta suele ser: ¿estoy creando o estoy escapando de la rutina?',
  },

  ejecutor: {
    key: 'ejecutor',
    nombre: 'El líder ejecutor',
    tagline: 'Resolvés rápido. A veces demasiado solo.',
    color: '#8B3A3A',
    description: 'Cuando hay que decidir, decidís. No te paraliza la presión ni la falta de información completa. Tu equipo sabe que con vos las cosas avanzan. Pero esa misma velocidad hace que muchas veces resuelvas vos lo que podría haber sido una oportunidad de que otro aprenda.',
    fortalezas: [
      'Tomás decisiones difíciles cuando otros dudan',
      'Le das dirección clara al equipo en momentos de incertidumbre',
      'No le escapás al conflicto necesario',
    ],
    mejoras: [
      'Antes de decidir, tomate 24 horas en las decisiones que no son urgentes de verdad',
      'Preguntá al equipo antes de dar tu opinión: si hablás primero, ya nadie va a disentir',
      'Identificá una decisión por semana que puedas delegar completa, incluyendo el derecho a equivocarse',
    ],
    costoOculto: 'Tu equipo se vuelve dependiente de tus decisiones y pierde criterio propio. Además, la velocidad tapa conversaciones que hacían falta, y esos temas vuelven más tarde y más caros.',
    siguiente: 'Tu fuerza ya está probada. Lo que falta es la pausa: escuchar antes de resolver, aunque tengas la respuesta.',
    eneatipos: [8, 3],
    eneagramInsight: 'En el Eneagrama, este estilo es propio de los tipos 8 (el Desafiador) y 3 (el Triunfador): uno lidera desde la fuerza y la protección, el otro desde el logro. La pregunta de fondo suele ser: ¿qué pasaría si me muestro sin tener el control?',
  },

  mediador: {
    key: 'mediador',
    nombre: 'El líder mediador',
    tagline: 'Cuidás la armonía. A veces a costa de la claridad.',
    color: '#6B7A8F',
    description: 'Sabés leer el clima de un equipo como pocos. Escuchás todas las posiciones, buscás el punto medio y lográs que gente muy distinta trabaje junta. Pero cuando hay que tomar una posición incómoda o dar una devolución dura, tendés a suavizarla tanto que el mensaje se pierde.',
    fortalezas: [
      'Construís consenso donde otros generan grietas',
      'La gente se siente escuchada y respetada trabajando con vos',
      'Bajás la tensión en situaciones que podrían escalar',
    ],
    mejoras: [
      'Esta semana decí una verdad incómoda que venís postergando. Sin rodeos, con respeto',
      'Cuando pidan tu opinión, dala primero y después escuchá, aunque incomode',
      'Diferenciá el conflicto destructivo del conflicto necesario: el segundo hace crecer al equipo',
    ],
    costoOculto: 'Los problemas no desaparecen, se acumulan bajo la superficie. El equipo percibe que hay temas de los que no se habla, y eso genera más tensión que la conversación que estás evitando.',
    siguiente: 'La verdadera armonía no es ausencia de conflicto. Es la capacidad de atravesarlo juntos. Ahí está tu próximo nivel.',
    eneatipos: [9, 2],
    eneagramInsight: 'En el Eneagrama, este estilo se ve en los tipos 9 (el Pacificador) y 2 (el Ayudador): uno evita el conflicto para sostener la paz, el otro para sostener el vínculo. La pregunta honesta suele ser: ¿estoy cuidando al otro o estoy cuidándome de su reacción?',
  },
};

export type EstiloKey = keyof typeof ESTILOS_LIDERAZGO;
