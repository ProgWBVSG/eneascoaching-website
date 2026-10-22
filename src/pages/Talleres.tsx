import React from 'react';
import { CalendarDays, ArrowRight, Users, GraduationCap } from 'lucide-react';
import { TALLERES, inscripcionAbierta, tallerTerminado, pesos, fechasTexto } from '../data/talleres';

const Talleres: React.FC = () => {
  const proximos = TALLERES.filter(t => !tallerTerminado(t));

  return (
    <div className="pt-20 pb-20 md:pb-0">
      <section className="bg-brand-dark text-white py-16 md:py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-heading font-bold mb-5">Talleres</h1>
          <p className="text-lg text-gray-300">Encuentros cortos y prácticos con Cecilia para trabajar una habilidad concreta.</p>
        </div>
      </section>

      <section className="py-16 px-6 bg-brand-beige">
        <div className="max-w-4xl mx-auto">
          {proximos.length ? (
            <div className="grid grid-cols-1 gap-6">
              {proximos.map(t => {
                const abierta = inscripcionAbierta(t);
                return (
                  <a key={t.id} href={`/taller/${t.id}`} className="flex flex-col md:flex-row bg-white rounded-sm overflow-hidden border border-brand-gold/20 hover:border-brand-gold shadow-sm transition-colors">
                    <div className="relative h-56 md:h-auto md:w-2/5 shrink-0">
                      <img src={t.imagen} alt={`Cecilia B. Sánchez · ${t.titulo}`} className="absolute inset-0 w-full h-full object-cover object-[50%_25%]" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-transparent via-transparent to-white" />
                    </div>
                    <div className="flex-1 p-8 text-center">
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-brand-dark mb-2">{t.titulo}</h2>
                    <p className="text-brand-gold mb-4">{t.subtitulo}</p>
                    <p className="text-gray-600 mb-6">{t.resumen}</p>
                    <p className="inline-flex items-center gap-2 text-sm text-brand-dark mb-6"><CalendarDays size={16} className="text-brand-gold" /> {fechasTexto(t)}</p>
                    <div className="flex items-center justify-center gap-4">
                      <span className="text-2xl font-heading font-bold text-brand-dark">{pesos(t.precio)}</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-brand-gold">
                        {abierta ? 'Ver el taller' : 'Inscripción cerrada'} <ArrowRight size={16} />
                      </span>
                    </div>
                    </div>
                  </a>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-600">Por ahora no hay talleres abiertos. Seguí a Cecilia en Instagram para enterarte del próximo.</p>
          )}
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-heading font-bold text-brand-dark mb-3">¿Buscás un proceso más profundo?</h2>
          <p className="text-gray-600 mb-10">Los talleres son un primer paso. Estos son los programas principales de Cecilia.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a href="/mentorias/lideres" className="block bg-brand-beige rounded-sm p-8 border border-brand-gold/20 hover:border-brand-gold transition-colors">
              <Users className="w-8 h-8 text-brand-gold mx-auto mb-3" />
              <p className="font-heading font-bold text-xl text-brand-dark mb-2">Mentoría para Líderes de Equipo</p>
              <p className="text-gray-600 text-sm">Acompañamiento 1 a 1 para liderar reuniones que terminan en decisiones.</p>
            </a>
            <a href="/diplomatura" className="block bg-brand-beige rounded-sm p-8 border border-brand-gold/20 hover:border-brand-gold transition-colors">
              <GraduationCap className="w-8 h-8 text-brand-gold mx-auto mb-3" />
              <p className="font-heading font-bold text-xl text-brand-dark mb-2">Diplomatura en Eneagrama</p>
              <p className="text-gray-600 text-sm">Formate como coach eneagramista certificada en 6 meses.</p>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Talleres;
