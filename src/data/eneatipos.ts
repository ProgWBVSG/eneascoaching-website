export interface Eneatipo {
  num: number;
  title: string;
  subtitle: string;
  words: string[];
  archetypes: string[];
}

export const ENEATIPOS: Eneatipo[] = [
  {
    num: 1,
    title: 'ENEÁTIPO 1',
    subtitle: 'PREDICA / ORDENA',
    words: [
      'Leal', 'Atento', 'Crítico', 'Juzgador', 'Dedicado',
      'Impaciente', 'Equilibrado', 'Controlador', 'Intransigente',
      'Malhumorado', 'Ordenado',
    ],
    archetypes: ['Ordenador', 'Abogado justo / moralista'],
  },
  {
    num: 2,
    title: 'ENEÁTIPO 2',
    subtitle: 'COMPLACE / EMPÁTICO',
    words: [
      'Servicial', 'Invasivo', 'Posesivo', 'Cariñoso', 'Divertido',
      'Generoso', 'Agradecido', 'Empático', 'Demandante', 'Manipulador',
    ],
    archetypes: ['Servidor', 'Abogado empático / Conciliador'],
  },
  {
    num: 3,
    title: 'ENEÁTIPO 3',
    subtitle: 'PERSUASIVO / DINÁMICO',
    words: [
      'Falso', 'Divertido', 'Generoso', 'Alentador', 'Oportunista',
      'Interesado', 'Impaciente', 'Demandante', 'Valora sus relaciones',
    ],
    archetypes: ['Triunfador', 'Abogado estratega'],
  },
  {
    num: 4,
    title: 'ENEÁTIPO 4',
    subtitle: 'SENSIBLE / DRAMÁTICO',
    words: [
      'Celoso', 'Amable', 'Divertido', 'Empático', 'Ingenioso',
      'Narcisista', 'Egocéntrico', 'Apasionado', 'Malhumorado',
      'Necesitado emocionalmente',
    ],
    archetypes: ['Creativo', 'Abogado humanista'],
  },
  {
    num: 5,
    title: 'ENEÁTIPO 5',
    subtitle: 'ANALÍTICO / RESERVADO',
    words: [
      'Fiable', 'Tímido', 'Amable', 'Cerrado', 'Distante',
      'Negativo', 'Perceptivo', 'Impaciente', 'Descalificante',
      'Autosuficiente', 'Comparte lo que sabe',
    ],
    archetypes: ['Observador', 'Abogado analista'],
  },
  {
    num: 6,
    title: 'ENEÁTIPO 6',
    subtitle: 'DUDOSO / CAUTELOSO',
    words: [
      'Leal', 'Justo', 'Fiable', 'Cálido', 'Sincero',
      'Ansioso', 'Indeciso', 'Miedoso', 'Dubitativo',
      'Desconfiado', 'Sustentador',
    ],
    archetypes: ['Colaborador', 'Abogado preventivo'],
  },
  {
    num: 7,
    title: 'ENEÁTIPO 7',
    subtitle: 'SIMPÁTICO / ENTUSIASTA',
    words: [
      'Alegre', 'Intenso', 'Inquieto', 'Disperso', 'Distraído',
      'Divertido', 'Generoso', 'Superficial', 'Inconstante', 'Extrovertido',
    ],
    archetypes: ['Alegre', 'Abogado entusiasta'],
  },
  {
    num: 8,
    title: 'ENEÁTIPO 8',
    subtitle: 'CATEGÓRICO / IMPERATIVO',
    words: [
      'Justo', 'Fiable', 'Posesivo', 'Agresivo', 'Exigente',
      'Protector', 'Generoso', 'Arrogante', 'Prepotente',
      'Combativo', 'Comprometido',
    ],
    archetypes: ['Líder de Mando', 'Abogado protector'],
  },
  {
    num: 9,
    title: 'ENEÁTIPO 9',
    subtitle: 'CONCILIADOR / CALMO',
    words: [
      'Leal', 'Terco', 'Pasivo', 'Cálido', 'Sereno',
      'Amable', 'Ecuánime', 'Indiferente', 'Sustentador',
      'Acomodaticio', 'Se muestra a la defensiva',
    ],
    archetypes: ['Mediador', 'Abogado pacificador'],
  },
];
