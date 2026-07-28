// Patrones financieros — contenido original para el Test de Dinero
export interface PatronFinanciero {
  key: string;
  nombre: string;
  tagline: string;
  color: string;
  description: string;
  cost: string;
  shift: string;
}

export const PATRONES: Record<string, PatronFinanciero> = {
  escasez: {
    key: 'escasez',
    nombre: 'El patrón de la escasez',
    tagline: 'Sentís que nunca alcanza, aunque alcance.',
    color: '#B85C38',
    description: 'Vivís con la sensación de que el dinero se va a terminar, incluso cuando tenés lo suficiente. Ahorrás por miedo, no por elección, y te cuesta disfrutar lo que ya tenés porque la cabeza está en lo que podría faltar.',
    cost: 'Te perdés el presente por estar defendiéndote de un futuro que quizás nunca llegue. La escasez no es de plata — es de calma.',
    shift: 'El primer paso no es ganar más. Es entender de dónde viene ese miedo y dejar de operar desde él.',
  },
  evitacion: {
    key: 'evitacion',
    nombre: 'El patrón de la evitación',
    tagline: 'Lo que no mirás, no podés cambiar.',
    color: '#6B7A8F',
    description: 'Preferís no saber cuánto tenés, cuánto debés o cuánto gastás. El dinero te genera culpa o ansiedad, así que la salida más fácil es no mirarlo — hasta que el problema se hace más grande solo.',
    cost: 'Cada vez que evitás tus números, le entregás el control a otra persona (o al azar). La evitación no te protege: te deja afuera de tus propias decisiones.',
    shift: 'No se trata de volverte obsesiva con las planillas. Se trata de animarte a mirar sin juzgarte.',
  },
  estatus: {
    key: 'estatus',
    nombre: 'El patrón del estatus',
    tagline: 'Lo que tenés habla de quién sos — o eso creés.',
    color: '#C9A227',
    description: 'Gastás para sostener una imagen, aunque no siempre te alcance. El dinero se convirtió en una forma de demostrar tu valor, y eso te empuja a decisiones que no siempre te hacen bien a largo plazo.',
    cost: 'Cuanto más necesitás mostrar, menos espacio le das a lo que de verdad sos, sin la etiqueta de precio.',
    shift: 'Tu valor no se mide en lo que mostrás. Separar quién sos de lo que tenés es el trabajo real.',
  },
  vigilancia: {
    key: 'vigilancia',
    nombre: 'El patrón de la hipervigilancia',
    tagline: 'Controlás todo... y aun así no descansás.',
    color: '#4A7C6F',
    description: 'Tenés todo anotado, calculado, controlado. Pero ese control no te da paz: te genera tensión constante, porque siempre hay algo más para revisar, ajustar o prever.',
    cost: 'El exceso de control es, muchas veces, otra forma de miedo. Estás tan ocupada evitando el error que no estás disfrutando el acierto.',
    shift: 'No necesitás soltar el control de golpe. Necesitás confiar en que también podés equivocarte y seguir estando bien.',
  },
  dependencia: {
    key: 'dependencia',
    nombre: 'El patrón de la dependencia',
    tagline: 'Esperás que alguien más lo resuelva.',
    color: '#8B6BB8',
    description: 'Frente a las decisiones de dinero, buscás que otra persona decida por vos o te rescate. No porque no puedas, sino porque en algún momento aprendiste que no era "tu lugar" hacerte cargo.',
    cost: 'Cada vez que delegás tu poder financiero, delegás también un pedazo de tu autonomía.',
    shift: 'Hacerte cargo no es hacerlo sola. Es empezar a confiar en tu propio criterio, aunque al principio dé miedo.',
  },
};

export type PatronKey = keyof typeof PATRONES;
