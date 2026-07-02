// Convierte un link de YouTube o Vimeo (normal u oculto) a su URL de embed.
// Soporta: youtube.com/watch?v=, youtu.be/, youtube.com/embed/, vimeo.com/, player.vimeo.com/video/

export function toEmbedUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const url = raw.trim();

  // YouTube
  const yt =
    url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0&modestbranding=1`;

  // Vimeo (incluye links privados con hash: vimeo.com/123456789/abcdef)
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/([\w]+))?/);
  if (vm) {
    const base = `https://player.vimeo.com/video/${vm[1]}`;
    return vm[2] ? `${base}?h=${vm[2]}` : base;
  }

  // Si ya es un embed o un mp4 directo, lo devolvemos tal cual
  if (url.includes('/embed/') || url.includes('player.vimeo.com') || /\.mp4($|\?)/.test(url)) return url;

  return null;
}

export function isDirectVideo(raw: string | null | undefined): boolean {
  return !!raw && /\.mp4($|\?)/.test(raw.trim());
}
