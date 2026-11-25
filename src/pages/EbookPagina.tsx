import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Download } from 'lucide-react';
import { EBOOKS, FormularioEbook, bajar, registrado } from '../components/EbookGratis';
import { tallerPorId, inscripcionAbierta } from '../data/talleres';

// Página propia de cada e-book, para mandar el link por privado: /ebook/<id> (y /mapa).
const PUNTOS: Record<string, string[]> = {
  mapa: ['Nueve formas de hablarte', 'Treinta frases para decir en voz alta', 'Tu mapa 2027, por delante y por detrás'],
};
// Qué taller se ofrece después de descargar
const TALLER: Record<string, string> = { mapa: 'hilos-del-destino' };

const EbookPagina: React.FC<{ id?: string }> = ({ id: idProp }) => {
  const params = useParams<{ id: string }>();
  const e = EBOOKS.find(x => x.id === (idProp || params.id));
  const [listo, setListo] = useState(false);

  useEffect(() => {
    if (!e) return;
    const antes = document.title;
    document.title = `${e.titulo} · E-book gratuito de Cecilia B. Sánchez`;
    return () => { document.title = antes; };
  }, [e]);

  if (!e) {
    return (
      <div className="pt-32 pb-24 px-6 text-center">
        <h1 className="text-2xl font-heading font-bold text-brand-dark mb-4">No encontramos este e-book</h1>
        <Link to="/#ebook" className="text-brand-gold font-semibold underline">Ver los e-books gratuitos</Link>
      </div>
    );
  }

  const yaLoTiene = registrado(e.id) && !listo;
  const taller = tallerPorId(TALLER[e.id]);

  return (
    <div className="pt-20">
      <div className="bg-brand-dark text-white min-h-[calc(100vh-5rem)] flex items-center">
      <div className="w-full max-w-5xl mx-auto px-6 py-10 md:py-16 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <img src={e.portada} alt={`Portada del e-book ${e.titulo}`} className="h-64 sm:h-80 md:h-[480px] w-auto mx-auto object-contain drop-shadow-[0_24px_30px_rgba(0,0,0,0.55)]" />
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-heading font-bold leading-tight mb-4 [text-wrap:balance]">{e.titulo}</h1>
          <p className="text-gray-300 text-lg mb-5 [text-wrap:balance]">{e.detalle}</p>
          {PUNTOS[e.id] && (
            <div className="flex flex-wrap justify-center gap-2 mb-7">
              {PUNTOS[e.id].map(p => <span key={p} className="border border-brand-gold/50 text-sm px-4 py-2 rounded-full">{p}</span>)}
            </div>
          )}
          <div className="bg-white text-brand-dark rounded-lg px-6 pt-1 pb-6">
            {yaLoTiene ? (
              <div className="pt-6 flex flex-col items-center gap-4">
                <p className="font-semibold">Ya tenés este e-book. Podés descargarlo otra vez.</p>
                <button onClick={() => bajar(e.pdf)} className="inline-flex items-center justify-center gap-2 bg-brand-gold hover:bg-[#a68a3c] text-white font-bold tracking-wide py-3.5 px-8 rounded transition-colors">
                  <Download size={18} /> DESCARGAR
                </button>
              </div>
            ) : <FormularioEbook e={e} alListo={() => setListo(true)} />}
          </div>
          {(yaLoTiene || listo) && taller && inscripcionAbierta(taller) && (
            <Link to={`/${taller.id}`} className="mt-6 block border border-brand-gold/60 hover:border-brand-gold rounded-lg px-6 py-5 transition-colors">
              <span className="block font-heading font-bold text-xl">{taller.titulo}</span>
              <span className="block text-gray-300 mt-1">El taller online para armar tu mapa completo. {taller.encuentros[0].dia}.</span>
              <span className="block text-brand-gold font-semibold mt-2">Ver el taller</span>
            </Link>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default EbookPagina;
