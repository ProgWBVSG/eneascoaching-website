import jsPDF from 'jspdf';
import { ENEATIPOS_DETALLE, calcularAla, EneatipoDetalle } from '../data/eneatipos-detalle';

// ── Constantes de layout ────────────────────────────────────────────
const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 15;
const CONTENT_W = PAGE_W - 2 * MARGIN;
const FOOTER_Y = PAGE_H - 10;

// ── Paleta ──────────────────────────────────────────────────────────
const COLOR_GOLD: RGB = [197, 160, 89];
const COLOR_DARK: RGB = [26, 26, 26];
const COLOR_TEXT: RGB = [55, 55, 55];
const COLOR_MUTED: RGB = [140, 140, 140];
const COLOR_LIGHT: RGB = [200, 200, 200];
const COLOR_BEIGE: RGB = [249, 247, 242];
const COLOR_BORDER: RGB = [230, 226, 218];

type RGB = [number, number, number];

function hexToRgb(hex: string): RGB {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

// ── Contexto del PDF ────────────────────────────────────────────────
interface Ctx {
  pdf: jsPDF;
  y: number;
  pageNum: number;
}

function setFill(pdf: jsPDF, rgb: RGB) { pdf.setFillColor(rgb[0], rgb[1], rgb[2]); }
function setText(pdf: jsPDF, rgb: RGB) { pdf.setTextColor(rgb[0], rgb[1], rgb[2]); }
function setDraw(pdf: jsPDF, rgb: RGB) { pdf.setDrawColor(rgb[0], rgb[1], rgb[2]); }

function addPageWithHeader(ctx: Ctx): void {
  ctx.pdf.addPage();
  ctx.pageNum++;
  drawPageChrome(ctx);
  ctx.y = MARGIN + 10;
}

function ensureSpace(ctx: Ctx, neededHeight: number): void {
  if (ctx.y + neededHeight > FOOTER_Y - 5) {
    addPageWithHeader(ctx);
  }
}

function drawPageChrome(ctx: Ctx): void {
  const { pdf, pageNum } = ctx;
  // Header
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'bold');
  setText(pdf, COLOR_GOLD);
  pdf.text('ENEASCOACHING', MARGIN, MARGIN);
  setText(pdf, COLOR_MUTED);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Eneatest Completo', PAGE_W - MARGIN, MARGIN, { align: 'right' });
  // Línea sutil
  setDraw(pdf, COLOR_BORDER);
  pdf.setLineWidth(0.2);
  pdf.line(MARGIN, MARGIN + 2, PAGE_W - MARGIN, MARGIN + 2);

  // Footer
  pdf.setFontSize(7);
  setText(pdf, COLOR_MUTED);
  pdf.text('@CeciliaBSanchez · Eneascoaching', MARGIN, FOOTER_Y);
  pdf.text(`Página ${pageNum}`, PAGE_W - MARGIN, FOOTER_Y, { align: 'right' });
}

// ── Primitivas reutilizables ────────────────────────────────────────
function drawCard(ctx: Ctx, height: number, fillRgb: RGB = [255, 255, 255], topBarRgb?: RGB): void {
  const { pdf } = ctx;
  setFill(pdf, fillRgb);
  pdf.roundedRect(MARGIN, ctx.y, CONTENT_W, height, 3, 3, 'F');
  if (topBarRgb) {
    setFill(pdf, topBarRgb);
    pdf.rect(MARGIN, ctx.y, CONTENT_W, 1, 'F');
  }
}

function drawSectionHeading(ctx: Ctx, label: string): void {
  const { pdf } = ctx;
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  setText(pdf, COLOR_MUTED);
  pdf.text(label.toUpperCase(), MARGIN, ctx.y);
  ctx.y += 5;
}

function drawWrappedText(ctx: Ctx, text: string, opts: {
  fontSize?: number;
  bold?: boolean;
  color?: RGB;
  maxWidth?: number;
  lineHeight?: number;
  x?: number;
} = {}): number {
  const {
    fontSize = 10, bold = false, color = COLOR_TEXT,
    maxWidth = CONTENT_W, lineHeight, x = MARGIN,
  } = opts;
  const lh = lineHeight ?? fontSize * 0.42;
  ctx.pdf.setFontSize(fontSize);
  ctx.pdf.setFont('helvetica', bold ? 'bold' : 'normal');
  setText(ctx.pdf, color);
  const lines = ctx.pdf.splitTextToSize(text, maxWidth) as string[];
  lines.forEach(line => {
    ctx.pdf.text(line, x, ctx.y);
    ctx.y += lh;
  });
  return lines.length * lh;
}

// ── Secciones del PDF ───────────────────────────────────────────────

function drawSaludo(ctx: Ctx, name: string): void {
  const { pdf } = ctx;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  setText(pdf, COLOR_MUTED);
  pdf.text(`¡Listo, ${name}!`, PAGE_W / 2, ctx.y, { align: 'center' });
  ctx.y += 5;
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  setText(pdf, COLOR_GOLD);
  pdf.text('TU RESULTADO', PAGE_W / 2, ctx.y, { align: 'center' });
  ctx.y += 10;
}

function drawHero(ctx: Ctx, tipo: EneatipoDetalle, ala: { wing: number; label: string }, tipoAla?: EneatipoDetalle): void {
  const { pdf } = ctx;
  const heroH = 78;
  ensureSpace(ctx, heroH + 5);
  const heroY = ctx.y;
  const tipoColor = hexToRgb(tipo.color);

  drawCard(ctx, heroH, [255, 255, 255], tipoColor);

  // Etiqueta "ENEATIPO"
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'bold');
  setText(pdf, COLOR_MUTED);
  pdf.text('ENEATIPO', PAGE_W / 2, heroY + 9, { align: 'center' });

  // Círculo grande con número
  const circleX = PAGE_W / 2;
  const circleY = heroY + 25;
  setFill(pdf, tipoColor);
  pdf.circle(circleX, circleY, 11, 'F');
  pdf.setFontSize(26);
  pdf.setFont('helvetica', 'bold');
  setText(pdf, [255, 255, 255]);
  pdf.text(`${tipo.num}`, circleX, circleY + 4, { align: 'center' });

  // Nombre
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  setText(pdf, COLOR_DARK);
  pdf.text(tipo.nombre, PAGE_W / 2, heroY + 47, { align: 'center' });

  // Subtítulo
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  setText(pdf, tipoColor);
  pdf.text(tipo.subtitulo.toUpperCase(), PAGE_W / 2, heroY + 53, { align: 'center' });

  // Pill del ala
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  const wingText = `Con ala en ${ala.wing}${tipoAla ? ` (${tipoAla.nombre})` : ''}  ·  ${ala.label}`;
  const wingW = pdf.getTextWidth(wingText) + 8;
  setFill(pdf, COLOR_BEIGE);
  pdf.roundedRect(PAGE_W / 2 - wingW / 2, heroY + 58, wingW, 7, 2, 2, 'F');
  setText(pdf, COLOR_DARK);
  pdf.text(wingText, PAGE_W / 2, heroY + 62.7, { align: 'center' });

  // Tríada
  pdf.setFontSize(7);
  setText(pdf, COLOR_MUTED);
  pdf.text(`Tríada ${tipo.triada}`, PAGE_W / 2, heroY + 71, { align: 'center' });

  ctx.y = heroY + heroH + 6;
}

function drawEnneagramDiagram(ctx: Ctx, dominant: number, wing: number): void {
  const { pdf } = ctx;
  const cardH = 88;
  ensureSpace(ctx, cardH + 5);
  drawCard(ctx, cardH);

  const startY = ctx.y;

  // Título
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'bold');
  setText(pdf, COLOR_MUTED);
  pdf.text('TU POSICIÓN EN EL ENEAGRAMA', PAGE_W / 2, startY + 8, { align: 'center' });

  // Geometría del círculo
  const cx = PAGE_W / 2;
  const cy = startY + 44;
  const r = 28;

  // Posiciones de los 9 puntos
  const positions = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => {
    const pos = n === 9 ? 0 : n;
    const angleDeg = -90 + pos * 40;
    const angleRad = (angleDeg * Math.PI) / 180;
    return {
      n,
      x: cx + r * Math.cos(angleRad),
      y: cy + r * Math.sin(angleRad),
    };
  });
  const getPos = (n: number) => positions.find(p => p.n === n)!;

  // Círculo exterior
  setDraw(pdf, COLOR_BORDER);
  pdf.setLineWidth(0.3);
  pdf.circle(cx, cy, r, 'S');

  // Líneas internas: triángulo + hexagrama
  const lines: [number, number][] = [
    [9, 3], [3, 6], [6, 9],
    [1, 4], [4, 2], [2, 8], [8, 5], [5, 7], [7, 1],
  ];
  const dominantColor = hexToRgb(ENEATIPOS_DETALLE[dominant].color);

  lines.forEach(([a, b]) => {
    const pa = getPos(a);
    const pb = getPos(b);
    const isDomLine = a === dominant || b === dominant;
    setDraw(pdf, isDomLine ? dominantColor : COLOR_BORDER);
    pdf.setLineWidth(isDomLine ? 0.4 : 0.2);
    pdf.line(pa.x, pa.y, pb.x, pb.y);
  });

  // Puntos
  positions.forEach(p => {
    const isDom = p.n === dominant;
    const isWing = p.n === wing;
    const color = hexToRgb(ENEATIPOS_DETALLE[p.n].color);

    if (isDom) {
      // Aura
      setFill(pdf, color);
      pdf.setGState(pdf.GState({ opacity: 0.18 }));
      pdf.circle(p.x, p.y, 5, 'F');
      pdf.setGState(pdf.GState({ opacity: 1 }));
      // Punto principal
      setFill(pdf, color);
      pdf.circle(p.x, p.y, 3.5, 'F');
      setText(pdf, [255, 255, 255]);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${p.n}`, p.x, p.y + 1.5, { align: 'center' });
    } else if (isWing) {
      setFill(pdf, [255, 255, 255]);
      setDraw(pdf, color);
      pdf.setLineWidth(0.6);
      pdf.circle(p.x, p.y, 3, 'FD');
      setText(pdf, color);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${p.n}`, p.x, p.y + 1.3, { align: 'center' });
    } else {
      setFill(pdf, [255, 255, 255]);
      setDraw(pdf, COLOR_LIGHT);
      pdf.setLineWidth(0.3);
      pdf.circle(p.x, p.y, 2.5, 'FD');
      setText(pdf, COLOR_MUTED);
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${p.n}`, p.x, p.y + 1.1, { align: 'center' });
    }
  });

  // Leyenda al pie
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'normal');
  setText(pdf, COLOR_MUTED);
  setFill(pdf, dominantColor);
  pdf.circle(MARGIN + 30, startY + cardH - 7, 1.5, 'F');
  pdf.text(`Dominante: tipo ${dominant}`, MARGIN + 33, startY + cardH - 6);
  setFill(pdf, [255, 255, 255]);
  setDraw(pdf, hexToRgb(ENEATIPOS_DETALLE[wing].color));
  pdf.setLineWidth(0.4);
  pdf.circle(MARGIN + 90, startY + cardH - 7, 1.5, 'FD');
  pdf.text(`Ala: tipo ${wing}`, MARGIN + 93, startY + cardH - 6);

  ctx.y = startY + cardH + 6;
}

function drawDistribucion(ctx: Ctx, dominant: number, wing: number, totals: Record<number, number>): void {
  const { pdf } = ctx;
  const ranked = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    .map(t => ({ type: t, total: Number(totals[t]) || 0 }))
    .sort((a, b) => b.total - a.total);
  const maxScore = Math.max(...ranked.map(r => r.total), 1);

  const rowH = 7;
  const headerH = 16;
  const cardH = headerH + ranked.length * rowH + 6;

  ensureSpace(ctx, cardH + 5);
  drawCard(ctx, cardH);
  const startY = ctx.y;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  setText(pdf, COLOR_DARK);
  pdf.text('Tu distribución', MARGIN + 5, startY + 7);
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'normal');
  setText(pdf, COLOR_MUTED);
  pdf.text('Cuánto te identificás con cada eneatipo', MARGIN + 5, startY + 11);

  let rowY = startY + headerH;
  ranked.forEach((r, idx) => {
    const t = ENEATIPOS_DETALLE[r.type];
    const isDom = r.type === dominant;
    const isWing = r.type === wing;
    const color = isDom || isWing ? hexToRgb(t.color) : COLOR_LIGHT;
    const pct = (r.total / maxScore) * 100;

    // Ranking
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    setText(pdf, isDom ? COLOR_GOLD : COLOR_MUTED);
    pdf.text(`${idx + 1}°`, MARGIN + 5, rowY);

    // Círculo con número
    setFill(pdf, color);
    pdf.circle(MARGIN + 14, rowY - 1.2, 2.5, 'F');
    setText(pdf, [255, 255, 255]);
    pdf.setFontSize(7);
    pdf.text(`${r.type}`, MARGIN + 14, rowY - 0.3, { align: 'center' });

    // Nombre
    pdf.setFontSize(9);
    pdf.setFont('helvetica', isDom ? 'bold' : 'normal');
    setText(pdf, isDom ? COLOR_DARK : COLOR_TEXT);
    pdf.text(t.nombre, MARGIN + 20, rowY);

    // Etiqueta "Dominante" o "Ala"
    let labelW = 0;
    if (isDom) {
      const lbl = 'Dominante';
      pdf.setFontSize(6);
      labelW = pdf.getTextWidth(lbl) + 3;
      setFill(pdf, COLOR_GOLD);
      pdf.roundedRect(MARGIN + 20 + pdf.getTextWidth(t.nombre) + 2, rowY - 3, labelW, 3.5, 0.8, 0.8, 'F');
      setText(pdf, [255, 255, 255]);
      pdf.text(lbl, MARGIN + 20 + pdf.getTextWidth(t.nombre) + 2 + labelW / 2, rowY - 0.7, { align: 'center' });
    } else if (isWing) {
      const lbl = 'Ala';
      pdf.setFontSize(6);
      labelW = pdf.getTextWidth(lbl) + 3;
      setFill(pdf, [...COLOR_GOLD]);
      pdf.setGState(pdf.GState({ opacity: 0.2 }));
      pdf.roundedRect(MARGIN + 20 + pdf.getTextWidth(t.nombre) + 2, rowY - 3, labelW, 3.5, 0.8, 0.8, 'F');
      pdf.setGState(pdf.GState({ opacity: 1 }));
      setText(pdf, COLOR_GOLD);
      pdf.text(lbl, MARGIN + 20 + pdf.getTextWidth(t.nombre) + 2 + labelW / 2, rowY - 0.7, { align: 'center' });
    }

    // Valor numérico
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    setText(pdf, isDom ? COLOR_GOLD : COLOR_MUTED);
    pdf.text(`${r.total}`, PAGE_W - MARGIN - 5, rowY, { align: 'right' });

    // Barra
    const barX = MARGIN + 75;
    const barW = (PAGE_W - MARGIN - 12) - barX;
    setFill(pdf, [240, 240, 240]);
    pdf.roundedRect(barX, rowY - 2, barW, 2.5, 0.5, 0.5, 'F');
    setFill(pdf, color);
    pdf.roundedRect(barX, rowY - 2, (barW * pct) / 100, 2.5, 0.5, 0.5, 'F');

    rowY += rowH;
  });

  ctx.y = startY + cardH + 6;
}

function drawTresColumnas(ctx: Ctx, items: { label: string; text: string; color?: RGB }[]): void {
  const { pdf } = ctx;
  const colW = (CONTENT_W - 6) / 3;
  // Calcular altura máxima
  let maxLines = 1;
  items.forEach(item => {
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    const ls = pdf.splitTextToSize(item.text, colW - 8) as string[];
    if (ls.length > maxLines) maxLines = ls.length;
  });
  const cardH = 14 + maxLines * 4 + 4;
  ensureSpace(ctx, cardH + 5);

  const startY = ctx.y;
  items.forEach((item, i) => {
    const cx = MARGIN + i * (colW + 3);
    setFill(pdf, [255, 255, 255]);
    pdf.roundedRect(cx, startY, colW, cardH, 2, 2, 'F');
    pdf.setFontSize(6.5);
    pdf.setFont('helvetica', 'bold');
    setText(pdf, item.color || COLOR_MUTED);
    pdf.text(item.label.toUpperCase(), cx + 4, startY + 6);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    setText(pdf, COLOR_DARK);
    const lines = pdf.splitTextToSize(item.text, colW - 8) as string[];
    let ly = startY + 11;
    lines.forEach(ln => { pdf.text(ln, cx + 4, ly); ly += 4; });
  });
  ctx.y = startY + cardH + 6;
}

function drawDosColumnas(ctx: Ctx, left: { title: string; items: string[]; color: RGB }, right: { title: string; items: string[]; color: RGB }): void {
  const { pdf } = ctx;
  const colW = (CONTENT_W - 6) / 2;
  const maxItems = Math.max(left.items.length, right.items.length);
  const cardH = 12 + maxItems * 5 + 4;
  ensureSpace(ctx, cardH + 5);

  const startY = ctx.y;
  [left, right].forEach((col, i) => {
    const cx = MARGIN + i * (colW + 6);
    setFill(pdf, [255, 255, 255]);
    pdf.roundedRect(cx, startY, colW, cardH, 2, 2, 'F');
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    setText(pdf, COLOR_DARK);
    pdf.text(col.title, cx + 5, startY + 7);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    setText(pdf, COLOR_TEXT);
    let ly = startY + 13;
    col.items.forEach(item => {
      setText(pdf, col.color);
      pdf.text('•', cx + 5, ly);
      setText(pdf, COLOR_TEXT);
      const lines = pdf.splitTextToSize(item, colW - 12) as string[];
      lines.forEach((ln, idx) => {
        pdf.text(ln, cx + 9, ly + idx * 3.5);
      });
      ly += Math.max(5, lines.length * 3.5);
    });
  });
  ctx.y = startY + cardH + 6;
}

function drawCrecimientoEstres(ctx: Ctx, tipo: EneatipoDetalle): void {
  const { pdf } = ctx;
  const itemPad = 7;
  const crecLines = pdf.splitTextToSize(tipo.textoCrecimiento, CONTENT_W - 14) as string[];
  const estLines = pdf.splitTextToSize(tipo.textoEstres, CONTENT_W - 14) as string[];
  const cardH = 12 + itemPad + crecLines.length * 4 + itemPad + estLines.length * 4 + 4;
  ensureSpace(ctx, cardH + 5);

  drawCard(ctx, cardH);
  const startY = ctx.y;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  setText(pdf, COLOR_DARK);
  pdf.text('Tu camino de crecimiento', MARGIN + 5, startY + 8);

  let yi = startY + 13;

  // Crecimiento (verde)
  setFill(pdf, [80, 180, 130]);
  pdf.rect(MARGIN + 5, yi, 1.2, 5 + crecLines.length * 4 - 2, 'F');
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'bold');
  setText(pdf, [60, 150, 110]);
  pdf.text(`LÍNEA DE INTEGRACIÓN → ${tipo.lineaCrecimiento}`, MARGIN + 10, yi + 3);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  setText(pdf, COLOR_TEXT);
  let ly = yi + 7;
  crecLines.forEach(ln => { pdf.text(ln, MARGIN + 10, ly); ly += 4; });
  yi = ly + 3;

  // Estrés (rojo)
  setFill(pdf, [220, 100, 100]);
  pdf.rect(MARGIN + 5, yi, 1.2, 5 + estLines.length * 4 - 2, 'F');
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'bold');
  setText(pdf, [200, 70, 70]);
  pdf.text(`LÍNEA DE ESTRÉS → ${tipo.lineaEstres}`, MARGIN + 10, yi + 3);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  setText(pdf, COLOR_TEXT);
  ly = yi + 7;
  estLines.forEach(ln => { pdf.text(ln, MARGIN + 10, ly); ly += 4; });

  ctx.y = startY + cardH + 6;
}

function drawContinuum(ctx: Ctx, tipo: EneatipoDetalle): void {
  const { pdf } = ctx;
  const items = [
    { tag: 'En tu mejor versión:', body: tipo.sano, color: [80, 180, 130] as RGB, icon: '✓' },
    { tag: 'En tu versión cotidiana:', body: tipo.promedio, color: [140, 140, 140] as RGB, icon: '~' },
    { tag: 'Bajo presión extrema:', body: tipo.desafio, color: [220, 100, 100] as RGB, icon: '!' },
  ];
  let totalH = 12;
  items.forEach(it => {
    const lines = pdf.splitTextToSize(`${it.tag} ${it.body}`, CONTENT_W - 14) as string[];
    totalH += lines.length * 4 + 3;
  });
  totalH += 4;
  ensureSpace(ctx, totalH + 5);

  drawCard(ctx, totalH);
  const startY = ctx.y;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  setText(pdf, COLOR_DARK);
  pdf.text('Cómo te ves según tu nivel de conciencia', MARGIN + 5, startY + 8);

  let yi = startY + 14;
  items.forEach(it => {
    setFill(pdf, it.color);
    pdf.circle(MARGIN + 7, yi - 1.5, 1.7, 'F');
    setText(pdf, [255, 255, 255]);
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'bold');
    pdf.text(it.icon, MARGIN + 7, yi - 0.6, { align: 'center' });

    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    setText(pdf, COLOR_DARK);
    const tagW = pdf.getTextWidth(it.tag);
    pdf.text(it.tag, MARGIN + 12, yi);
    pdf.setFont('helvetica', 'normal');
    setText(pdf, COLOR_TEXT);
    const bodyLines = pdf.splitTextToSize(it.body, CONTENT_W - 14 - tagW - 1) as string[];
    pdf.text(bodyLines[0], MARGIN + 12 + tagW + 1, yi);
    let lineY = yi + 4;
    for (let i = 1; i < bodyLines.length; i++) {
      pdf.text(bodyLines[i], MARGIN + 12, lineY);
      lineY += 4;
    }
    yi = lineY + 2;
  });

  ctx.y = startY + totalH + 6;
}

function drawConsejo(ctx: Ctx, tipo: EneatipoDetalle): void {
  const { pdf } = ctx;
  const tipoColor = hexToRgb(tipo.color);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'italic');
  const lines = pdf.splitTextToSize(`"${tipo.consejo}"`, CONTENT_W - 16) as string[];
  const cardH = 18 + lines.length * 5 + 6;
  ensureSpace(ctx, cardH + 5);

  setFill(pdf, tipoColor);
  pdf.roundedRect(MARGIN, ctx.y, CONTENT_W, cardH, 3, 3, 'F');

  const startY = ctx.y;
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'bold');
  setText(pdf, [255, 255, 255]);
  pdf.text('TU CONSEJO DE ORO', PAGE_W / 2, startY + 9, { align: 'center' });

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'italic');
  let ly = startY + 17;
  lines.forEach(ln => {
    pdf.text(ln, PAGE_W / 2, ly, { align: 'center' });
    ly += 5;
  });

  ctx.y = startY + cardH + 6;
}

function drawCierre(ctx: Ctx): void {
  const { pdf } = ctx;
  const cardH = 32;
  ensureSpace(ctx, cardH + 12);

  setFill(pdf, COLOR_DARK);
  pdf.roundedRect(MARGIN, ctx.y, CONTENT_W, cardH, 3, 3, 'F');
  const startY = ctx.y;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  setText(pdf, [255, 255, 255]);
  pdf.text('Cecilia recibió tu resultado', PAGE_W / 2, startY + 10, { align: 'center' });

  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  setText(pdf, [200, 200, 200]);
  const msg = 'Va a estar revisando tus respuestas con atención. Lo van a ver juntas en tu próxima sesión.';
  const lines = pdf.splitTextToSize(msg, CONTENT_W - 30) as string[];
  let ly = startY + 17;
  lines.forEach(ln => {
    pdf.text(ln, PAGE_W / 2, ly, { align: 'center' });
    ly += 4;
  });

  ctx.y = startY + cardH + 4;

  // Cita
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'italic');
  setText(pdf, COLOR_MUTED);
  const quote = '"Conviértete en el que fuiste, antes que eras con el recuerdo y la sabiduría de aquel en el que te convertiste."';
  const qLines = pdf.splitTextToSize(quote, CONTENT_W - 20) as string[];
  qLines.forEach(ln => { pdf.text(ln, PAGE_W / 2, ctx.y, { align: 'center' }); ctx.y += 3.5; });
  ctx.y += 1;
  pdf.text('— Proverbio Sufí', PAGE_W / 2, ctx.y, { align: 'center' });
}

// ── Función pública ─────────────────────────────────────────────────
export function generateResultadoPDF(
  name: string,
  dominantType: number,
  totals: Record<number, number>
): void {
  const tipo = ENEATIPOS_DETALLE[dominantType];
  const ala = calcularAla(dominantType, totals);
  const tipoAla = ENEATIPOS_DETALLE[ala.wing];
  if (!tipo) return;

  const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
  const ctx: Ctx = { pdf, y: MARGIN + 10, pageNum: 1 };

  drawPageChrome(ctx);

  drawSaludo(ctx, name);
  drawHero(ctx, tipo, ala, tipoAla);
  drawEnneagramDiagram(ctx, dominantType, ala.wing);
  drawDistribucion(ctx, dominantType, ala.wing, totals);

  drawTresColumnas(ctx, [
    { label: 'Motivación',     text: tipo.motivacion, color: COLOR_GOLD },
    { label: 'Miedo nuclear',  text: tipo.miedo,      color: [220, 100, 100] },
    { label: 'Deseo profundo', text: tipo.deseo,      color: [220, 130, 160] },
  ]);

  drawDosColumnas(ctx,
    { title: 'Tus fortalezas', items: tipo.fortalezas, color: [80, 180, 130] },
    { title: 'Tus desafíos',   items: tipo.desafios,   color: [220, 160, 60] },
  );

  drawCrecimientoEstres(ctx, tipo);
  drawContinuum(ctx, tipo);
  drawConsejo(ctx, tipo);
  drawCierre(ctx);

  const safeName = (name || 'eneatipo').replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
  pdf.save(`enea-test-${safeName}.pdf`);
}
