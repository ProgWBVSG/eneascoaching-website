// Test de Estilos de Comunicación — material propio de Cecilia B. Sánchez
// Los 9 estilos comunicativos y sus riesgos son de ella.
// Decisión de producto: al lead le hablamos de ESTILOS DE COMUNICACIÓN, no de
// eneatipos, porque la mayoría no conoce el eneagrama y el término lo aleja.
// El número de eneatipo viaja igual en los datos para que Cecilia lo vea en su panel.

export type Estilo =
  | 'correctivo' | 'cercano' | 'directo' | 'emocional' | 'racional'
  | 'cauteloso' | 'inspirador' | 'contundente' | 'armonizador';

export interface OpcionComunicacion {
  label: string;
  estilo: Estilo;
}

export interface PreguntaComunicacion {
  pregunta: string;
  opciones: OpcionComunicacion[];
}

// Diseño balanceado: 9 preguntas x 4 opciones = 36 opciones.
// Cada uno de los 9 estilos aparece exactamente 4 veces, así ninguno
// tiene ventaja por salir más seguido.
export const PREGUNTAS_COMUNICACION: PreguntaComunicacion[] = [
  {
    pregunta: 'Arranca la reunión. ¿Qué hacés primero?',
    opciones: [
      { label: 'Reviso que esté todo en orden y marco lo que falta ajustar.', estilo: 'correctivo' },
      { label: 'Digo qué tenemos que resolver hoy y cuánto tiempo tenemos.', estilo: 'directo' },
      { label: 'Repaso la información para que estemos todos igual de informados.', estilo: 'racional' },
      { label: 'Cuento hacia dónde vamos y abro ideas.', estilo: 'inspirador' },
    ],
  },
  {
    pregunta: 'Tenés que dar una noticia incómoda.',
    opciones: [
      { label: 'Cuido mucho a la persona: pregunto cómo está antes y después.', estilo: 'cercano' },
      { label: 'La digo con lo que a mí me genera, sin filtrarlo demasiado.', estilo: 'emocional' },
      { label: 'Aviso todo lo que puede salir mal si no lo tomamos a tiempo.', estilo: 'cauteloso' },
      { label: 'La digo de frente, sin adornos.', estilo: 'contundente' },
    ],
  },
  {
    pregunta: 'Alguien propone algo que no te cierra.',
    opciones: [
      { label: 'Escucho y busco un punto medio que conforme a todos.', estilo: 'armonizador' },
      { label: 'Señalo con precisión qué está mal planteado.', estilo: 'correctivo' },
      { label: 'Lo acompaño igual para no dejarlo mal parado.', estilo: 'cercano' },
      { label: 'Digo que no y propongo otra cosa.', estilo: 'directo' },
    ],
  },
  {
    pregunta: 'Se arma tensión en plena reunión.',
    opciones: [
      { label: 'Pongo en palabras lo que se está sintiendo en la sala.', estilo: 'emocional' },
      { label: 'Pido que volvamos a los hechos.', estilo: 'racional' },
      { label: 'Freno y planteo los riesgos de seguir por ese camino.', estilo: 'cauteloso' },
      { label: 'Bajo la tensión y redirijo la energía hacia otro lado.', estilo: 'inspirador' },
    ],
  },
  {
    pregunta: '¿Qué te dicen más seguido después de una reunión?',
    opciones: [
      { label: '"Fuiste muy frontal."', estilo: 'contundente' },
      { label: '"Gracias por escuchar a todos."', estilo: 'armonizador' },
      { label: '"No se te escapa una."', estilo: 'correctivo' },
      { label: '"Se nota que te importa de verdad."', estilo: 'emocional' },
    ],
  },
  {
    pregunta: 'Cuando delegás una tarea...',
    opciones: [
      { label: 'Me aseguro de que la persona esté cómoda con lo que le toca.', estilo: 'cercano' },
      { label: 'Explico el porqué y todo el contexto.', estilo: 'racional' },
      { label: 'Digo lo que espero y no lo repito dos veces.', estilo: 'contundente' },
      { label: 'Digo qué necesito y para cuándo.', estilo: 'directo' },
    ],
  },
  {
    pregunta: 'La reunión se está yendo de tema.',
    opciones: [
      { label: 'Aviso que así no vamos a llegar y propongo ordenarnos.', estilo: 'cauteloso' },
      { label: 'La dejo fluir, algo bueno va a salir de ahí.', estilo: 'armonizador' },
      { label: 'Me engancho con lo nuevo, capaz aparece algo mejor.', estilo: 'inspirador' },
      { label: 'Corrijo el rumbo y vuelvo al punto de la agenda.', estilo: 'correctivo' },
    ],
  },
  {
    pregunta: '¿Qué es lo que más te agota de una reunión?',
    opciones: [
      { label: 'Que se dé vueltas sin llegar a nada.', estilo: 'directo' },
      { label: 'Que sea toda superficial y nadie diga lo que realmente piensa.', estilo: 'emocional' },
      { label: 'Que nadie se anime a poner el tema difícil sobre la mesa.', estilo: 'contundente' },
      { label: 'Que alguien quede incómodo o dolido.', estilo: 'cercano' },
    ],
  },
  {
    pregunta: 'Antes de una reunión importante, ¿qué te pasa?',
    opciones: [
      { label: 'Junto toda la información que pueda.', estilo: 'racional' },
      { label: 'Repaso mentalmente todo lo que podría salir mal.', estilo: 'cauteloso' },
      { label: 'Confío en que se va a dar y no la preparo demasiado.', estilo: 'armonizador' },
      { label: 'Pienso cómo contarlo para que enganche.', estilo: 'inspirador' },
    ],
  },
];

export interface PerfilComunicacion {
  estilo: Estilo;
  eneatipo: number;      // interno, para el panel de Cecilia. No se muestra al lead.
  nombre: string;        // "Estilo Directo"
  tagline: string;
  color: string;
  descripcion: string;
  fortalezas: string[];
  riesgo: string;        // el riesgo que marcó Cecilia, desarrollado
  comoTeLeen: string;
  chocaCon: Estilo;
  ajusteChoque: string;
  ajustes: string[];
}

export const PERFILES_COMUNICACION: Record<Estilo, PerfilComunicacion> = {
  correctivo: {
    estilo: 'correctivo', eneatipo: 1,
    nombre: 'Estilo Correctivo',
    tagline: 'Preciso, ordenado, ves lo que hay que mejorar.',
    color: '#C5A059',
    descripcion: 'Hablás con precisión y no dejás pasar lo que está mal hecho. En una reunión sos la que detecta el error que a todos se les escapó y la que sostiene el estándar cuando el resto se conforma.',
    fortalezas: [
      'Tu palabra tiene peso porque no decís nada al azar',
      'El equipo sabe exactamente qué nivel esperás',
      'Ves el detalle que después evita un problema caro',
    ],
    riesgo: 'Cuando la exigencia sube, tu precisión se lee como crítica. Señalás lo que falta antes de reconocer lo que ya está bien, y el equipo empieza a mostrarte solo lo que está seguro de que va a pasar tu filtro.',
    comoTeLeen: 'Vos sentís que estás cuidando la calidad. Del otro lado sienten que están siendo evaluados, y esa diferencia hace que dejen de traerte ideas a medio armar, que suelen ser las mejores.',
    chocaCon: 'inspirador',
    ajusteChoque: 'Con perfiles Inspiradores vas a sentir que improvisan y no aterrizan nada, y ellos van a sentir que les cortás el envión. Con esas personas, escuchá la idea completa antes de marcar el primer error. Vas a conseguir lo mismo sin apagarlas.',
    ajustes: [
      'Nombrá en voz alta lo que sí está bien antes de decir lo que falta',
      'Antes de corregir, preguntá "¿cómo lo pensaste?". Muchas veces ya tenían la respuesta',
      'Elegí una cosa por reunión donde aceptes un resultado suficientemente bueno',
    ],
  },
  cercano: {
    estilo: 'cercano', eneatipo: 2,
    nombre: 'Estilo Cercano',
    tagline: 'Cálido, atento, siempre mirando a la persona.',
    color: '#E07A8A',
    descripcion: 'Preguntás, escuchás y te das cuenta de cómo está cada uno aunque no lo digan. En una reunión sos la que nota quién quedó afuera de la conversación y la que consigue que la gente se anime a hablar.',
    fortalezas: [
      'La gente te cuenta lo que no le cuenta a nadie más',
      'Generás un clima donde se puede decir lo que no funciona',
      'Sostenés equipos con personas muy distintas entre sí',
    ],
    riesgo: 'Cuando la relación está en juego, empezás a comunicar desde la necesidad de agradar. Suavizás tanto el mensaje para que no incomode que la otra persona se va sin haber entendido qué le estabas pidiendo.',
    comoTeLeen: 'Vos sentís que estás cuidando el vínculo. El equipo muchas veces no sabe qué pensás vos realmente, y esa ambigüedad genera más incomodidad que una definición clara.',
    chocaCon: 'contundente',
    ajusteChoque: 'Con perfiles Contundentes vas a sentir que pasan por arriba, y ellos van a sentir que no terminás de decir lo que querés. Con esas personas, arrancá por el pedido concreto y después contá el contexto. Te van a escuchar distinto.',
    ajustes: [
      'Decí el pedido en una frase, sin justificarlo de más',
      'Antes de ceder, preguntate si estás de acuerdo o si solo querés que se termine la tensión',
      'Practicá una conversación incómoda por semana. La claridad también es una forma de cuidar',
    ],
  },
  directo: {
    estilo: 'directo', eneatipo: 3,
    nombre: 'Estilo Directo',
    tagline: 'Rápido, concreto, orientado a resultados.',
    color: '#F0A040',
    descripcion: 'Vas al punto sin rodeos y la conversación avanza cuando estás vos. En una reunión sos la que corta la vuelta, define y deja claro qué sigue.',
    fortalezas: [
      'Las decisiones no se te quedan trabadas',
      'El equipo sabe qué esperás y para cuándo',
      'Convertís conversación en acción muy rápido',
    ],
    riesgo: 'Cuando el tiempo aprieta, la velocidad te gana a la escucha. Cerrás el tema antes de que el otro haya terminado de plantearlo, y te perdés información que después aparece como problema.',
    comoTeLeen: 'Vos sentís que estás siendo eficiente. Más de uno siente que la decisión ya estaba tomada antes de entrar a la reunión, y deja de traerte los problemas hasta que se hacen grandes.',
    chocaCon: 'armonizador',
    ajusteChoque: 'Con perfiles Armonizadores vas a sentir que dan mil vueltas para no definir, y ellos van a sentir que los atropellás. Con esas personas, preguntá y bancate el silencio. Necesitan unos segundos más, no menos presión.',
    ajustes: [
      'Antes de cerrar un tema, preguntá "¿qué se me está escapando?" y esperá la respuesta',
      'La decisión puede ser firme y el tono amable al mismo tiempo. No son lo mismo',
      'Si nadie te discute nunca, no es que tengas razón siempre. Es que dejaron de intentarlo',
    ],
  },
  emocional: {
    estilo: 'emocional', eneatipo: 4,
    nombre: 'Estilo Emocional',
    tagline: 'Profundo, auténtico, decís lo que realmente sentís.',
    color: '#8B6BB8',
    descripcion: 'No te conformás con la conversación de superficie. En una reunión sos la que nombra lo que todos están sintiendo y nadie se anima a decir, y la que le devuelve sentido a lo que el equipo hace.',
    fortalezas: [
      'Ponés en palabras lo que el resto no sabe cómo nombrar',
      'Tu autenticidad hace que los demás bajen la guardia',
      'Le das profundidad a conversaciones que serían puro trámite',
    ],
    riesgo: 'Cuando algo te toca, la intensidad sube y el tema se vuelve personal. Lo que empezó siendo una diferencia de criterio pasa a sentirse como un conflicto entre personas, y el equipo se enfoca en tu estado de ánimo en vez del asunto.',
    comoTeLeen: 'Vos sentís que estás siendo honesta y estás aportando verdad. Parte del equipo lee esa intensidad como que el clima de la reunión depende de cómo estés vos ese día.',
    chocaCon: 'racional',
    ajusteChoque: 'Con perfiles Racionales vas a sentir que son fríos y no se juegan, y ellos van a sentir que traés emoción a un tema técnico. Con esas personas, separá el dato de lo que te generó. Primero uno, después lo otro.',
    ajustes: [
      'Antes de hablar, distinguí si lo que vas a decir es sobre el tema o sobre cómo te sentís con el tema',
      'Buscá una mirada externa antes de dar por hecho que nadie te entiende',
      'Sostené los acuerdos aunque ese día no te sientas conectada con el proyecto',
    ],
  },
  racional: {
    estilo: 'racional', eneatipo: 5,
    nombre: 'Estilo Racional',
    tagline: 'Observás, analizás y aportás información.',
    color: '#4A90C2',
    descripcion: 'No hablás por hablar. Cuando decís algo está chequeado y el equipo lo sabe. En una reunión sos la que trae el dato que cambia la decisión y la que ve el agujero en el plan antes de que cueste caro.',
    fortalezas: [
      'Tus decisiones se sostienen porque están fundadas',
      'Ves los riesgos que el entusiasmo del resto tapa',
      'Cuando afirmás algo, nadie lo pone en duda',
    ],
    riesgo: 'Cuando el tema te parece importante, das todo el contexto antes de llegar a la conclusión. Para cuando llegás al punto, buena parte de la sala ya se perdió. Y cuando necesitás pensar, te corrés de la conversación.',
    comoTeLeen: 'Vos sentís que estás siendo rigurosa. Del otro lado, tu silencio mientras analizás se lee como desinterés o desacuerdo, y el equipo empieza a decidir sin vos.',
    chocaCon: 'emocional',
    ajusteChoque: 'Con perfiles Emocionales vas a sentir que dramatizan lo que es un tema técnico, y ellos van a sentir que no te importa. Con esas personas, reconocé primero lo que están sintiendo y después traé el dato. Con una sola frase alcanza.',
    ajustes: [
      'Empezá por la conclusión y dejá el contexto para quien lo pida',
      'Pensá en voz alta. Que te escuchen razonar vale más que la respuesta perfecta diez minutos después',
      'Si necesitás tiempo, decilo. El silencio sin aviso siempre se interpreta mal',
    ],
  },
  cauteloso: {
    estilo: 'cauteloso', eneatipo: 6,
    nombre: 'Estilo Cauteloso',
    tagline: 'Preguntás, anticipás riesgos y buscás certezas.',
    color: '#5DA8A0',
    descripcion: 'Ves venir el problema antes que nadie. En una reunión sos la que hace la pregunta incómoda que evita que el equipo se meta en un pozo, y la que se asegura de que lo acordado sea realmente posible.',
    fortalezas: [
      'Anticipás riesgos que al resto se le pasan por alto',
      'Tus preguntas hacen que los planes salgan más sólidos',
      'Generás lealtad real, el equipo sabe que no lo vas a dejar solo',
    ],
    riesgo: 'Cuando la incertidumbre crece, empezás a comunicar desde la duda. Planteás el riesgo tantas veces y buscás tanta confirmación que el equipo deja de escuchar una advertencia útil y empieza a escuchar inseguridad.',
    comoTeLeen: 'Vos sentís que estás siendo responsable y previniendo. El equipo, cuando la duda se repite, empieza a dudar también, y las decisiones se frenan sin que nadie diga por qué.',
    chocaCon: 'directo',
    ajusteChoque: 'Con perfiles Directos vas a sentir que deciden sin medir consecuencias, y ellos van a sentir que frenás todo. Con esas personas, planteá el riesgo una vez, con una alternativa concreta al lado. Te van a escuchar mucho mejor que si repetís la advertencia.',
    ajustes: [
      'Planteá cada riesgo una sola vez, y acompañalo con una propuesta',
      'Separá el riesgo real del que estás imaginando. Escribilos en dos columnas',
      'Ponete un límite de tiempo para decidir y sostenelo aunque queden dudas',
    ],
  },
  inspirador: {
    estilo: 'inspirador', eneatipo: 7,
    nombre: 'Estilo Inspirador',
    tagline: 'Dinámico, creativo, generás posibilidades.',
    color: '#E8B842',
    descripcion: 'Contagiás energía y abrís caminos que nadie había visto. En una reunión sos la que levanta la temperatura cuando todo está plano y la que conecta la tarea con algo más grande.',
    fortalezas: [
      'Conseguís compromiso, no solo obediencia',
      'Cuando el clima se pone denso, lo podés cambiar',
      'Ves opciones donde el resto ve un solo camino',
    ],
    riesgo: 'Cuando aparece algo nuevo, la atención se te va para ahí. Y cuando la conversación se pone incómoda, la esquivás cambiando de tema. El equipo termina con muchas ideas abiertas y pocas conversaciones difíciles resueltas.',
    comoTeLeen: 'Vos sentís que estás abriendo posibilidades y sosteniendo el ánimo. Parte del equipo se va sin saber qué se decidió ni qué le toca a cada uno, y con la sensación de que los temas complicados nunca se terminan de hablar.',
    chocaCon: 'correctivo',
    ajusteChoque: 'Con perfiles Correctivos vas a sentir que te frenan y buscan el error en todo, y ellos van a sentir que improvisás. Con esas personas, llevá una sola idea trabajada en vez de cinco por explorar. Te van a acompañar mucho más rápido.',
    ajustes: [
      'Cerrá cada reunión con la parte menos entretenida: quién hace qué y para cuándo',
      'Sostené la conversación incómoda hasta el final, sin cambiar de tema',
      'Terminá lo que abriste antes de entusiasmarte con lo próximo',
    ],
  },
  contundente: {
    estilo: 'contundente', eneatipo: 8,
    nombre: 'Estilo Contundente',
    tagline: 'Firme, frontal, decís lo que pensás.',
    color: '#B83A3A',
    descripcion: 'No te guardás nada y no le escapás al conflicto. En una reunión sos la que pone sobre la mesa el tema que todos estaban esquivando, y la que banca al equipo cuando hay que dar la cara.',
    fortalezas: [
      'Ponés el tema difícil que nadie se anima a nombrar',
      'Tu equipo sabe que lo vas a defender',
      'Tomás las decisiones que otros postergan',
    ],
    riesgo: 'La firmeza que a vos te resulta normal, del otro lado se recibe con bastante más volumen. Sin proponértelo intimidás, y la gente deja de contradecirte no porque estés en lo cierto sino porque no quiere el choque.',
    comoTeLeen: 'Vos sentís que estás siendo honesta y directa. El equipo muchas veces siente que discutir con vos tiene un costo, y esa cuenta la hacen en silencio antes de hablar.',
    chocaCon: 'cercano',
    ajusteChoque: 'Con perfiles Cercanos vas a sentir que no van al grano y se toman todo a lo personal, y ellos van a sentir que los pasás por arriba. Con esas personas, bajá un cambio la intensidad y hacé una pregunta antes de afirmar. El contenido puede ser el mismo.',
    ajustes: [
      'Cuando estés enojada, esperá una vuelta antes de hablar',
      'Preguntá en vez de afirmar, al menos una vez por reunión',
      'Mostrá cuando algo también te cuesta a vos. Baja la guardia del resto más que cualquier discurso',
    ],
  },
  armonizador: {
    estilo: 'armonizador', eneatipo: 9,
    nombre: 'Estilo Armonizador',
    tagline: 'Escuchás, suavizás y buscás acuerdos.',
    color: '#7AAC6E',
    descripcion: 'Sostenés la calma cuando todo se tensa y lográs que posiciones opuestas convivan. En una reunión sos la que encuentra el punto en común que nadie estaba viendo.',
    fortalezas: [
      'Bajás el conflicto sin dejar temas debajo de la alfombra',
      'Ves el punto en común entre posturas que parecían incompatibles',
      'Tu calma estabiliza al equipo en los momentos difíciles',
    ],
    riesgo: 'Cuando aparece la tensión, callás para evitar el conflicto. No decís lo que pensás, dejás que la conversación siga sola, y el tema importante queda sin resolver mientras todos creen que hubo acuerdo.',
    comoTeLeen: 'Vos sentís que estás dando espacio y evitando un choque innecesario. El equipo interpreta tu silencio como aprobación, avanza en una dirección que vos no elegiste, y después no entiende por qué no funcionó.',
    chocaCon: 'contundente',
    ajusteChoque: 'Con perfiles Contundentes vas a sentir que arrasan y no dejan lugar, y ellos van a sentir que no te jugás. Con esas personas, decí tu posición en la primera mitad de la reunión. Si esperás al final, ya se decidió sin vos.',
    ajustes: [
      'Decí tu opinión primero, antes de escuchar la de todos los demás',
      'Notá cuándo tu "está bien" es real y cuándo es solo para cortar la tensión',
      'Tomá una decisión incómoda por semana sin consultarla de más',
    ],
  },
};

export interface ResultadoComunicacion {
  dominante: PerfilComunicacion;
  secundario: PerfilComunicacion | null;
  scores: Record<Estilo, number>;
  top: { estilo: Estilo; pct: number }[];
}

const ORDEN_DESEMPATE: Estilo[] = [
  'armonizador', 'cauteloso', 'racional', 'cercano', 'emocional',
  'correctivo', 'inspirador', 'directo', 'contundente',
];

export const calcularComunicacion = (respuestas: number[]): ResultadoComunicacion => {
  const scores = {
    correctivo: 0, cercano: 0, directo: 0, emocional: 0, racional: 0,
    cauteloso: 0, inspirador: 0, contundente: 0, armonizador: 0,
  } as Record<Estilo, number>;

  respuestas.forEach((optIdx, i) => {
    const op = PREGUNTAS_COMUNICACION[i]?.opciones[optIdx];
    if (op) scores[op.estilo] += 1;
  });

  const ranked = (Object.keys(scores) as Estilo[]).sort((a, b) => {
    if (scores[b] !== scores[a]) return scores[b] - scores[a];
    return ORDEN_DESEMPATE.indexOf(a) - ORDEN_DESEMPATE.indexOf(b);
  });

  const total = respuestas.length || 1;

  return {
    dominante: PERFILES_COMUNICACION[ranked[0]],
    secundario: scores[ranked[1]] >= 2 ? PERFILES_COMUNICACION[ranked[1]] : null,
    scores,
    top: ranked.slice(0, 3).map(e => ({ estilo: e, pct: Math.round((scores[e] / total) * 100) })),
  };
};
