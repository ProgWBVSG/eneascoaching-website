// 8 preguntas rápidas de opción única — cada opción mapea a un patrón financiero
export interface OpcionPregunta { label: string; patron: string; }
export interface PreguntaDinero { pregunta: string; opciones: OpcionPregunta[]; }

export const PREGUNTAS_DINERO: PreguntaDinero[] = [
  {
    pregunta: 'Cuando pensás en dinero, lo primero que sentís es...',
    opciones: [
      { label: 'Que nunca va a alcanzar', patron: 'escasez' },
      { label: 'Prefiero no pensarlo, me genera ansiedad', patron: 'evitacion' },
      { label: 'Que necesito más para que me tomen en serio', patron: 'estatus' },
      { label: 'Que tengo que controlar cada peso', patron: 'vigilancia' },
      { label: 'Que alguien más debería resolverlo', patron: 'dependencia' },
    ],
  },
  {
    pregunta: 'Te llega un ingreso extra. ¿Qué hacés primero?',
    opciones: [
      { label: 'Lo guardo todo, por las dudas', patron: 'escasez' },
      { label: 'Se me va sin darme cuenta', patron: 'evitacion' },
      { label: 'Me compro algo que se note', patron: 'estatus' },
      { label: 'Anoto exactamente en qué lo voy a usar', patron: 'vigilancia' },
      { label: 'Espero que alguien me diga qué hacer con él', patron: 'dependencia' },
    ],
  },
  {
    pregunta: 'Alguien te pregunta cuánto ganás. ¿Cómo reaccionás?',
    opciones: [
      { label: 'Me da vergüenza si es poco', patron: 'escasez' },
      { label: 'Cambio de tema como puedo', patron: 'evitacion' },
      { label: 'Me gusta que sepan que me va bien', patron: 'estatus' },
      { label: 'No doy detalles, es mi tema y punto', patron: 'vigilancia' },
      { label: 'Prefiero que otra persona responda por mí', patron: 'dependencia' },
    ],
  },
  {
    pregunta: 'Tenés que hacer un gasto grande. ¿Qué te pasa?',
    opciones: [
      { label: 'Pánico, pienso que me voy a quedar sin nada', patron: 'escasez' },
      { label: 'Lo pospongo hasta último momento', patron: 'evitacion' },
      { label: 'Lo hago igual, aunque no me sobre', patron: 'estatus' },
      { label: 'Reviso mil veces antes de decidir', patron: 'vigilancia' },
      { label: 'Espero que alguien me ayude a pagarlo', patron: 'dependencia' },
    ],
  },
  {
    pregunta: 'Un familiar o amigo cercano empieza a ganar más que vos. ¿Qué pensás?',
    opciones: [
      { label: 'Que a mí nunca me va a alcanzar', patron: 'escasez' },
      { label: 'Ni me fijo, no me interesa comparar', patron: 'evitacion' },
      { label: 'Que tengo que estar a la altura', patron: 'estatus' },
      { label: 'Que yo administro mejor de todos modos', patron: 'vigilancia' },
      { label: 'Que ojalá me ayude en algún momento', patron: 'dependencia' },
    ],
  },
  {
    pregunta: 'Tu forma de ahorrar es...',
    opciones: [
      { label: 'Ahorro obsesivamente, nunca es suficiente', patron: 'escasez' },
      { label: 'No tengo ni idea de cuánto ahorro', patron: 'evitacion' },
      { label: 'Prefiero gastar que ahorrar, se vive una vez', patron: 'estatus' },
      { label: 'Tengo un plan estricto y lo sigo al pie de la letra', patron: 'vigilancia' },
      { label: 'Cuento con que otro me respalde', patron: 'dependencia' },
    ],
  },
  {
    pregunta: 'Si mañana perdieras tu ingreso principal, tu primer pensamiento sería...',
    opciones: [
      { label: 'Sabía que esto iba a pasar', patron: 'escasez' },
      { label: 'Ya voy a ver cómo resolverlo, no pienso en eso ahora', patron: 'evitacion' },
      { label: 'Cómo sostengo mi nivel de vida', patron: 'estatus' },
      { label: 'Ya tengo un plan B armado', patron: 'vigilancia' },
      { label: 'A quién le puedo pedir ayuda', patron: 'dependencia' },
    ],
  },
  {
    pregunta: 'Elegí la frase con la que más te identificás:',
    opciones: [
      { label: '"El dinero nunca alcanza"', patron: 'escasez' },
      { label: '"Prefiero no mirar mis números"', patron: 'evitacion' },
      { label: '"Lo que tengo habla de quién soy"', patron: 'estatus' },
      { label: '"Si no controlo todo, se me escapa"', patron: 'vigilancia' },
      { label: '"Necesito que alguien me guíe con esto"', patron: 'dependencia' },
    ],
  },
];
