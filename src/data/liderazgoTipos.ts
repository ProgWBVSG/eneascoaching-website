// ENEA-TEST LIDERAZGOS — contenido original de Cecilia B. Sánchez (Eneascoaching)
// Las palabras de cada eneatipo son su material propio, perfeccionado durante años de práctica.
export interface LiderazgoTipo {
  num: number;
  archetype: string;   // nombre de marca (Ordenador, Servidor, etc.)
  category: string;    // etiqueta corta (PREDICA / ORDENA, etc.)
  color: string;       // mismo color que el eneatipo en el resto del sitio
  words: string[];
  fortaleza: string;
  puntoCiego: string;
  mejora: string[];
}

export const LIDERAZGO_TIPOS: LiderazgoTipo[] = [
  {
    num: 1,
    archetype: 'El Ordenador',
    category: 'Predica y ordena',
    color: '#C5A059',
    words: ['Leal', 'Dedicado', 'Atento', 'Equilibrado', 'Ordenado', 'Crítico', 'Juzgador', 'Impaciente', 'Intransigente', 'Malhumorado', 'Controlador'],
    fortaleza: 'Sostenés el estándar y el orden que el equipo necesita para funcionar bien.',
    puntoCiego: 'La crítica y la exigencia constante hacen que el equipo deje de proponer por miedo al error.',
    mejora: ['Antes de corregir, preguntá primero: "¿cómo lo harías vos?"', 'Reconocé en voz alta lo que sale bien, no solo lo que falla', 'Elegí una tarea por semana donde aceptes un resultado "suficientemente bueno"'],
  },
  {
    num: 2,
    archetype: 'El Servidor',
    category: 'Complace y es empático',
    color: '#E07A8A',
    words: ['Servicial', 'Agradecido', 'Generoso', 'Divertido', 'Cariñoso', 'Posesivo', 'Demandante', 'Invasivo', 'Empático', 'Manipulador'],
    fortaleza: 'Generás vínculos genuinos: el equipo siente que le importás de verdad.',
    puntoCiego: 'Das tanto que después esperás, sin decirlo, que te lo devuelvan. Eso genera resentimiento silencioso.',
    mejora: ['Pedí ayuda antes de sentirte sobrepasada', 'Distinguí ayudar de hacerte cargo del problema del otro', 'Animate a decir que no sin justificarte de más'],
  },
  {
    num: 3,
    archetype: 'El Triunfador',
    category: 'Persuasivo y dinámico',
    color: '#F0A040',
    words: ['Valora sus relaciones', 'Divertido', 'Alentador', 'Generoso', 'Interesado', 'Oportunista', 'Impaciente', 'Falso', 'Demandante'],
    fortaleza: 'Movilizás al equipo con energía y sabés vender la idea, el proyecto, el objetivo.',
    puntoCiego: 'La necesidad de resultados visibles puede hacer que la imagen pese más que el proceso real del equipo.',
    mejora: ['Preguntá cómo está tu equipo, no solo cómo va el objetivo', 'Compartí el crédito del logro, no solo el propio', 'Bajá el ritmo con quien necesita procesar distinto'],
  },
  {
    num: 4,
    archetype: 'El Creativo',
    category: 'Sensible y dramático',
    color: '#8B6BB8',
    words: ['Empático', 'Amable', 'Apasionado', 'Divertido', 'Ingenioso', 'Necesitado emocionalmente', 'Malhumorado', 'Narcisista', 'Celoso', 'Egocéntrico'],
    fortaleza: 'Le das profundidad y sentido emocional a lo que el equipo hace, no solo tareas.',
    puntoCiego: 'Tus cambios de ánimo impactan directo en el clima del equipo, que queda pendiente de cómo estás vos.',
    mejora: ['Separá tu estado de ánimo de la decisión que tenés que tomar', 'Buscá una mirada externa antes de asumir que "nadie te entiende"', 'Sostené la rutina aunque ese día no te inspire'],
  },
  {
    num: 5,
    archetype: 'El Observador',
    category: 'Analítico y reservado',
    color: '#4A90C2',
    words: ['Amable', 'Perceptivo', 'Autosuficiente', 'Fiable', 'Comparte lo que sabe', 'Tímido', 'Negativo', 'Cerrado', 'Distante', 'Impaciente', 'Descalificante'],
    fortaleza: 'Tomás decisiones con información real, no con impulso, y eso da seguridad al equipo.',
    puntoCiego: 'La distancia que ponés para pensar se lee como desinterés, y el equipo deja de acercarse con lo urgente.',
    mejora: ['Compartí tu razonamiento en voz alta, no solo la conclusión', 'Practicá estar presente sin resolver, solo escuchando', 'Avisá cuando necesitás tiempo, en vez de desaparecer'],
  },
  {
    num: 6,
    archetype: 'El Colaborador',
    category: 'Dudoso y cauteloso',
    color: '#5DA8A0',
    words: ['Cálido', 'Leal', 'Sustentador', 'Justo', 'Sincero', 'Fiable', 'Miedoso', 'Indeciso', 'Ansioso', 'Desconfiado', 'Dubitativo'],
    fortaleza: 'Anticipás riesgos que otros no ven y construís lealtad real con tu equipo.',
    puntoCiego: 'La duda constante antes de decidir transmite inseguridad, y el equipo empieza a dudar también.',
    mejora: ['Fijá un límite de tiempo para decidir y sostenelo', 'Diferenciá el riesgo real del que estás imaginando', 'Compartí una decisión sin pedir demasiada validación externa'],
  },
  {
    num: 7,
    archetype: 'El Alegre',
    category: 'Simpático y entusiasta',
    color: '#E8B842',
    words: ['Alegre', 'Generoso', 'Intenso', 'Divertido', 'Extrovertido', 'Disperso', 'Inquieto', 'Distraído', 'Superficial', 'Inconstante'],
    fortaleza: 'Contagiás energía positiva y hacés que el equipo disfrute lo que hace.',
    puntoCiego: 'El entusiasmo por lo nuevo deja proyectos a mitad de camino. El equipo siente que nada se termina.',
    mejora: ['Terminá un proyecto antes de entusiasmarte con el próximo', 'Anotá los compromisos, no confíes solo en la memoria', 'Sostené una conversación difícil sin cambiar de tema'],
  },
  {
    num: 8,
    archetype: 'El Poderoso',
    category: 'Categórico e imperativo',
    color: '#B83A3A',
    words: ['Justo', 'Protector', 'Fiable', 'Generoso', 'Comprometido', 'Combativo', 'Arrogante', 'Exigente', 'Posesivo', 'Agresivo', 'Prepotente'],
    fortaleza: 'Protegés a tu equipo y tomás las decisiones difíciles que otros evitan.',
    puntoCiego: 'La intensidad con la que te expresás puede intimidar, y el equipo deja de mostrarse vulnerable frente a vos.',
    mejora: ['Bajá un cambio la intensidad antes de hablar cuando estás enojada', 'Preguntá en vez de imponer, al menos una vez por día', 'Mostrale al equipo cuando algo también te cuesta a vos'],
  },
  {
    num: 9,
    archetype: 'El Mediador',
    category: 'Conciliador y calmo',
    color: '#7AAC6E',
    words: ['Amable', 'Cálido', 'Ecuánime', 'Leal', 'Sustentador', 'Sereno', 'Pasivo', 'Terco', 'Indiferente', 'Acomodaticio', 'Se muestra a la defensiva'],
    fortaleza: 'Sostenés la calma del equipo y lográs que posiciones distintas convivan.',
    puntoCiego: 'Evitar el conflicto para mantener la paz hace que las decisiones importantes se posterguen demasiado.',
    mejora: ['Tomá una decisión incómoda esta semana, sin consultar de más', 'Decí tu opinión primero, antes de escuchar la de todos', 'Notá cuándo tu "está bien" es real y cuándo es solo para evitar el choque'],
  },
];
