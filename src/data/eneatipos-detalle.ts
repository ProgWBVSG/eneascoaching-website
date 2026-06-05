// Descripciones originales de los 9 eneatipos
// Basadas en conceptos clásicos públicos del Eneagrama
// (motivaciones, miedos, alas, líneas de integración/desintegración)

export type Triada = 'Instintiva' | 'Emocional' | 'Mental';

export interface EneatipoDetalle {
  num: number;
  nombre: string;        // Nombre clásico
  subtitulo: string;     // Tagline corto
  triada: Triada;
  triadaDescripcion: string;
  motivacion: string;    // Por qué hace lo que hace
  miedo: string;         // Miedo nuclear
  deseo: string;         // Deseo nuclear
  fortalezas: string[];
  desafios: string[];
  sano: string;          // En su mejor versión
  promedio: string;      // En su versión cotidiana
  desafio: string;       // Cuando está bajo presión
  lineaCrecimiento: number; // Tipo al que va cuando crece
  textoCrecimiento: string;
  lineaEstres: number;       // Tipo al que va bajo estrés
  textoEstres: string;
  consejo: string;       // Una frase de oro
  color: string;         // Para UI (hex)
}

export const ENEATIPOS_DETALLE: Record<number, EneatipoDetalle> = {
  1: {
    num: 1,
    nombre: 'El Reformador',
    subtitulo: 'Íntegro · Principista · Ordenado',
    triada: 'Instintiva',
    triadaDescripcion: 'Centrada en el cuerpo, el control y la acción correcta.',
    motivacion: 'Hacer lo correcto y mejorar el mundo a su alrededor.',
    miedo: 'Ser corrupto, defectuoso o equivocarse moralmente.',
    deseo: 'Ser una persona íntegra, ética y equilibrada.',
    fortalezas: [
      'Principios sólidos y ética inquebrantable',
      'Responsable, honesto y confiable',
      'Organizado, prolijo y detallista',
      'Inspira a otros a ser mejores',
    ],
    desafios: [
      'Demasiado crítico consigo y con los demás',
      'Rígido y poco flexible ante lo inesperado',
      'Reprime su ira y se carga de tensión',
      'Le cuesta disfrutar sin sentir culpa',
    ],
    sano: 'Sabio, discernidor, tolerante y guía moral genuino.',
    promedio: 'Perfeccionista, opinador, controlador, busca corregir.',
    desafio: 'Hipercrítico, dogmático, autoflagelante.',
    lineaCrecimiento: 7,
    textoCrecimiento: 'En crecimiento se relaja como un 7 sano: juega, disfruta el momento y se permite el placer sin culpa.',
    lineaEstres: 4,
    textoEstres: 'Bajo estrés se vuelve melancólico como un 4 promedio: resentido, sentimental, encerrado en sus emociones.',
    consejo: 'La imperfección es parte de lo humano. Soltá el control y permití que algo sea simplemente "suficientemente bueno".',
    color: '#C5A059',
  },
  2: {
    num: 2,
    nombre: 'El Ayudador',
    subtitulo: 'Cariñoso · Empático · Generoso',
    triada: 'Emocional',
    triadaDescripcion: 'Centrada en el corazón, las relaciones y la imagen.',
    motivacion: 'Sentirse amado, necesitado y conectado con los demás.',
    miedo: 'No ser querido, ser rechazado o no merecer amor.',
    deseo: 'Dar y recibir amor verdadero.',
    fortalezas: [
      'Empático y cálido con quienes lo rodean',
      'Generoso, atento, anticipa necesidades',
      'Sabe sintonizar emocionalmente con el otro',
      'Crea vínculos profundos y nutricios',
    ],
    desafios: [
      'Se olvida de sus propias necesidades',
      'Puede dar para obtener algo a cambio (no siempre conciente)',
      'Tiende a ser invasivo o posesivo',
      'Le cuesta pedir ayuda y mostrarse vulnerable',
    ],
    sano: 'Ama incondicionalmente, cuida sin invadir, sabe recibir.',
    promedio: 'Complaciente, dependiente del reconocimiento.',
    desafio: 'Manipulador, victimista, somatiza el resentimiento.',
    lineaCrecimiento: 4,
    textoCrecimiento: 'En crecimiento se vuelve auténtico como un 4 sano: conecta con sus propias emociones y necesidades reales.',
    lineaEstres: 8,
    textoEstres: 'Bajo estrés explota como un 8 promedio: exige reconocimiento, se vuelve dominante o iracundo.',
    consejo: 'Antes de preguntar qué necesita el otro, preguntate qué necesitás vos. Recibir también es un acto de amor.',
    color: '#E07A8A',
  },
  3: {
    num: 3,
    nombre: 'El Triunfador',
    subtitulo: 'Ambicioso · Adaptable · Magnético',
    triada: 'Emocional',
    triadaDescripcion: 'Centrada en el corazón, las relaciones y la imagen.',
    motivacion: 'Ser valorado y admirado a través de los logros.',
    miedo: 'Fracasar, ser indigno o no ser visto.',
    deseo: 'Sentirse valioso por lo que es y por lo que logra.',
    fortalezas: [
      'Ambicioso, eficiente y orientado a metas',
      'Adaptable: cambia de registro según el contexto',
      'Carismático e inspirador',
      'Optimista, energético, hace que las cosas pasen',
    ],
    desafios: [
      'Trabajólico, dificultad para frenar',
      'Pone la imagen por encima de la esencia',
      'Evita sentir emociones que considera "improductivas"',
      'Compite donde podría colaborar',
    ],
    sano: 'Auténtico, inspirador, lidera con propósito genuino.',
    promedio: 'Performático, competitivo, cuida la imagen.',
    desafio: 'Deshonesto consigo, vacío interno, oportunista.',
    lineaCrecimiento: 6,
    textoCrecimiento: 'En crecimiento se compromete como un 6 sano: leal con su grupo, presente más allá del logro.',
    lineaEstres: 9,
    textoEstres: 'Bajo estrés se apaga como un 9 promedio: apático, evasivo, posterga lo importante.',
    consejo: 'Tu valor no depende de lo que lográs. Sos suficiente incluso cuando no estás produciendo nada.',
    color: '#F0A040',
  },
  4: {
    num: 4,
    nombre: 'El Individualista',
    subtitulo: 'Sensible · Auténtico · Profundo',
    triada: 'Emocional',
    triadaDescripcion: 'Centrada en el corazón, las relaciones y la imagen.',
    motivacion: 'Ser auténtico, único, encontrar significado profundo.',
    miedo: 'No tener identidad propia, ser común, ser insignificante.',
    deseo: 'Encontrar significado y belleza en su existencia.',
    fortalezas: [
      'Creativo y profundamente expresivo',
      'Empático con el dolor y la belleza',
      'Introspectivo y autoreflexivo',
      'Capaz de tocar lo más íntimo de los demás',
    ],
    desafios: [
      'Melancolía recurrente y autocompasión',
      'Comparación constante con los demás',
      'Sensación de "siempre falta algo"',
      'Idealiza lo que no tiene y rechaza lo cotidiano',
    ],
    sano: 'Profundo, regenerador, creador de belleza con sentido.',
    promedio: 'Temperamental, romántico melancólico, autoindulgente.',
    desafio: 'Depresivo, alienado, autodestructivo.',
    lineaCrecimiento: 1,
    textoCrecimiento: 'En crecimiento se disciplina como un 1 sano: estructura, acción concreta, manos a la obra.',
    lineaEstres: 2,
    textoEstres: 'Bajo estrés se vuelve dependiente como un 2 promedio: busca aprobación, intrusivo, demanda atención.',
    consejo: 'Lo ordinario también es sagrado. No necesitás ser especial para ser valioso.',
    color: '#8B6BB8',
  },
  5: {
    num: 5,
    nombre: 'El Investigador',
    subtitulo: 'Analítico · Perceptivo · Independiente',
    triada: 'Mental',
    triadaDescripcion: 'Centrada en la mente, la seguridad y la anticipación.',
    motivacion: 'Comprender el mundo y dominar su área de interés.',
    miedo: 'Ser invadido, vacío, incapaz o demandado.',
    deseo: 'Ser competente y autónomo intelectualmente.',
    fortalezas: [
      'Pensamiento original y profundo',
      'Capaz de concentrarse y especializarse',
      'Independiente, no depende de la aprobación ajena',
      'Calmo bajo presión, observador agudo',
    ],
    desafios: [
      'Desconectado de su cuerpo y emociones',
      'Aislamiento social, dificultad para vincularse',
      'Acumula información sin pasar a la acción',
      'Avaro de su tiempo, energía y recursos',
    ],
    sano: 'Visionario, pionero del pensamiento, generoso con su saber.',
    promedio: 'Reservado, intelectualiza emociones, observador distante.',
    desafio: 'Paranoide, excéntrico, fóbico, desconectado del mundo.',
    lineaCrecimiento: 8,
    textoCrecimiento: 'En crecimiento actúa como un 8 sano: pasa de pensar a hacer, encarna su conocimiento con coraje.',
    lineaEstres: 7,
    textoEstres: 'Bajo estrés se dispersa como un 7 promedio: escapa en distracciones, impulsivo, evasivo.',
    consejo: 'Tu cuerpo y tus emociones también son inteligencia. No todo se resuelve pensando.',
    color: '#4A90C2',
  },
  6: {
    num: 6,
    nombre: 'El Leal',
    subtitulo: 'Comprometido · Confiable · Prevenido',
    triada: 'Mental',
    triadaDescripcion: 'Centrada en la mente, la seguridad y la anticipación.',
    motivacion: 'Sentirse seguro, pertenecer, tener apoyo confiable.',
    miedo: 'Estar sin apoyo, ser abandonado, no poder confiar.',
    deseo: 'Encontrar guía y un grupo en el cual confiar plenamente.',
    fortalezas: [
      'Leal y comprometido con sus afectos',
      'Responsable, anticipa riesgos y planifica',
      'Buen miembro de equipo, defiende a los suyos',
      'Valiente cuando hay una causa real',
    ],
    desafios: [
      'Ansiedad anticipatoria y duda constante',
      'Busca certezas externas en vez de confiar en sí',
      'Ambivalencia: ama-dudo de quien me protege',
      'Puede ser tanto sumiso como contra-fóbico (rebelde)',
    ],
    sano: 'Valiente, equilibrado, sostén confiable de los demás.',
    promedio: 'Hipervigilante, escéptico, ambivalente.',
    desafio: 'Paranoide, autosaboteador, agresivo o masoquista.',
    lineaCrecimiento: 9,
    textoCrecimiento: 'En crecimiento se calma como un 9 sano: confía, descansa, encuentra paz interna.',
    lineaEstres: 3,
    textoEstres: 'Bajo estrés se hipercompite como un 3 promedio: busca demostrar valor, ansioso por rendir.',
    consejo: 'La seguridad real está dentro tuyo, no en el plan B. Empezá a confiar en tu propio juicio.',
    color: '#5DA8A0',
  },
  7: {
    num: 7,
    nombre: 'El Entusiasta',
    subtitulo: 'Alegre · Versátil · Generador',
    triada: 'Mental',
    triadaDescripcion: 'Centrada en la mente, la seguridad y la anticipación.',
    motivacion: 'Experimentar todo lo que la vida ofrece, ser feliz.',
    miedo: 'Sentir dolor, aburrimiento o quedar atrapado.',
    deseo: 'Mantenerse abierto a posibilidades infinitas.',
    fortalezas: [
      'Optimista contagioso, levanta cualquier ambiente',
      'Versátil, curioso, multifacético',
      'Hace conexiones rápidas entre ideas',
      'Resiliente, encuentra el lado bueno',
    ],
    desafios: [
      'Evade lo difícil, escapa cuando duele',
      'Disperso, dificultad para terminar lo que empieza',
      'Impulsivo, busca placer inmediato',
      'Le cuesta estar presente con lo incómodo',
    ],
    sano: 'Presente, agradecido, conecta gozo con propósito real.',
    promedio: 'Planificador compulsivo de placeres, hiperactivo.',
    desafio: 'Maníaco, escapista, adicto a estímulos.',
    lineaCrecimiento: 5,
    textoCrecimiento: 'En crecimiento profundiza como un 5 sano: foco, especialización, presencia con lo difícil.',
    lineaEstres: 1,
    textoEstres: 'Bajo estrés se vuelve crítico como un 1 promedio: perfeccionista, frustrado, juzgador.',
    consejo: 'La plenitud está en el presente, no en la próxima experiencia. Quedate con lo que hay.',
    color: '#E8B842',
  },
  8: {
    num: 8,
    nombre: 'El Desafiador',
    subtitulo: 'Fuerte · Justo · Protector',
    triada: 'Instintiva',
    triadaDescripcion: 'Centrada en el cuerpo, el control y la acción correcta.',
    motivacion: 'Controlar su destino, hacer justicia, proteger a los suyos.',
    miedo: 'Ser controlado, traicionado o mostrar vulnerabilidad.',
    deseo: 'Ser autónomo y poderoso, defender lo que es justo.',
    fortalezas: [
      'Líder natural, asertivo, directo',
      'Protege con fiereza a los suyos',
      'Vitalidad, presencia física fuerte',
      'No teme la confrontación cuando es necesaria',
    ],
    desafios: [
      'Dominante e intimidante sin proponérselo',
      'Niega su vulnerabilidad y ternura',
      'Excesivo en todo: trabajo, comida, intensidad',
      'Puede arrasar relaciones por su fuerza',
    ],
    sano: 'Heroico, magnánimo, empodera con su fuerza a los demás.',
    promedio: 'Confrontativo, posesivo, busca tener el control.',
    desafio: 'Vengativo, destructivo, megalómano.',
    lineaCrecimiento: 2,
    textoCrecimiento: 'En crecimiento abre el corazón como un 2 sano: ternura, cuidado genuino, vulnerabilidad asumida.',
    lineaEstres: 5,
    textoEstres: 'Bajo estrés se retira como un 5 promedio: frío, calculador, paranoide.',
    consejo: 'La verdadera fortaleza incluye la ternura. Soltá la armadura: ser visto no te hace débil.',
    color: '#B83A3A',
  },
  9: {
    num: 9,
    nombre: 'El Pacificador',
    subtitulo: 'Sereno · Receptivo · Conciliador',
    triada: 'Instintiva',
    triadaDescripcion: 'Centrada en el cuerpo, el control y la acción correcta.',
    motivacion: 'Mantener paz interior y armonía con los demás.',
    miedo: 'Pérdida, conflicto, fragmentación, separación.',
    deseo: 'Vivir en paz mental y unión con su entorno.',
    fortalezas: [
      'Receptivo, conciliador, integrador de perspectivas',
      'Calmo, estable, presente sin imponerse',
      'Sabe escuchar y validar a todos',
      'Crea ambientes armónicos',
    ],
    desafios: [
      'Posterga lo importante para evitar conflicto',
      'Se "duerme" a sí mismo y a sus propios deseos',
      'Indecisión, dificultad para tomar posición',
      'Terco pasivo cuando se siente presionado',
    ],
    sano: 'Mediador sabio, presente, una voz que sostiene a todos.',
    promedio: 'Complaciente, rutinario, evita el conflicto.',
    desafio: 'Disociado, depresivo, fantasioso.',
    lineaCrecimiento: 3,
    textoCrecimiento: 'En crecimiento despierta como un 3 sano: autoafirmación, acción enfocada, sale del letargo.',
    lineaEstres: 6,
    textoEstres: 'Bajo estrés se ansía como un 6 promedio: dependiente, dubitativo, busca certezas externas.',
    consejo: 'Tu presencia importa más de lo que creés. Despertá a tu propia vida con claridad y tomá posición.',
    color: '#7AAC6E',
  },
};

// ── Cálculo de ala ──────────────────────────────────────────────────
// El ala es el eneatipo adyacente (N-1 o N+1) con mayor score.
// Cíclico: tipo 1 ↔ tipos 9 y 2; tipo 9 ↔ tipos 8 y 1.
export function calcularAla(dominante: number, totals: Record<number, number>): {
  wing: number;
  label: string; // ej "3w4"
  leftScore: number;
  rightScore: number;
} {
  const left = dominante === 1 ? 9 : dominante - 1;
  const right = dominante === 9 ? 1 : dominante + 1;
  const leftScore = Number(totals[left]) || 0;
  const rightScore = Number(totals[right]) || 0;
  const wing = leftScore >= rightScore ? left : right;
  return {
    wing,
    label: `${dominante}w${wing}`,
    leftScore,
    rightScore,
  };
}
