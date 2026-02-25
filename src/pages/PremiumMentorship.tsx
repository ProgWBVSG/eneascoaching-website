import React from 'react';
import Button from '../components/Button';
import { Target, Zap, ShieldCheck, TrendingUp } from 'lucide-react';

const PremiumMentorship: React.FC = () => {
  return (
    <div className="pt-20">
      {/* Premium Hero */}
      <div className="bg-black text-white py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-gold/20 to-black z-0"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-block border border-brand-gold text-brand-gold px-4 py-1 rounded-full text-xs tracking-widest uppercase mb-6">Exclusivo 1 a 1</span>
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6">Mentoría Premium</h1>
          <p className="text-2xl font-light text-gray-300 mb-8">No necesitas más información. <br />Necesitas <span className="text-brand-gold font-bold">dirección</span>.</p>

          {/* Sales Video - High Conversion Design */}
          <div className="mt-12 relative w-full max-w-3xl mx-auto rounded-sm shadow-[0_0_40px_rgba(197,160,89,0.3)] border-2 border-brand-gold/30 overflow-hidden group bg-black aspect-video">
            <iframe
              src="https://www.youtube.com/embed/jkx2dcDoj2o"
              title="Presentación Mentoría Premium"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
            {/* Decorative glint effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </div>
        </div>
      </div>

      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl font-heading font-bold text-brand-dark mb-6">Espacio profundo y personalizado</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Un espacio cuidado, donde tu proceso se convierte en prioridad.
              MENTORÍA PREMIUM es claridad, dirección y transformación en menos tiempo.
            </p>
            <p className="text-brand-dark font-medium text-xl italic border-l-4 border-brand-gold pl-4 mb-8">
              "Durante 12 encuentros trabajaremos desde el SER para lograr un HACER sostenido, disruptivo y rentable."
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Target className="text-brand-gold" /> <span>Claridad y Dirección</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-brand-gold" /> <span>Decisiones seguras</span>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="text-brand-gold" /> <span>Aceleración de procesos</span>
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp className="text-brand-gold" /> <span>Resultados escalables</span>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 h-[500px] overflow-hidden">
            <img src="/fotosCecilia/foto_cecilia_mentoria_premium.jpg" alt="Premium Mentorship" className="rounded-sm shadow-2xl grayscale hover:grayscale-0 transition-all duration-700 w-full h-full object-cover object-center scale-110" />
          </div>
        </div>
      </section>

      {/* Details Bar */}
      <section className="bg-brand-beige py-16 px-6">
        <div className="container mx-auto">
          <div className="bg-white p-8 rounded-sm shadow-lg border-t-4 border-brand-gold grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h4 className="text-gray-500 text-sm uppercase tracking-wider mb-2">Duración</h4>
              <p className="text-2xl font-heading font-bold text-brand-dark">12 Sesiones</p>
              <p className="text-sm text-gray-400">Personalizadas</p>
            </div>
            <div>
              <h4 className="text-gray-500 text-sm uppercase tracking-wider mb-2">Modalidad</h4>
              <p className="text-2xl font-heading font-bold text-brand-dark">Online o Presencial</p>
              <p className="text-sm text-gray-400">Agenda Abierta 2026</p>
            </div>
            <div>
              <h4 className="text-gray-500 text-sm uppercase tracking-wider mb-2">Inversión</h4>
              <p className="text-2xl font-heading font-bold text-brand-gold">USD 850</p>
              <p className="text-sm text-gray-400">Argentina: Consultar</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 text-center bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">Metodología probada y garantizada</h2>
          <p className="text-xl text-gray-600 mb-10">Este es el espacio donde tu transformación se acelera.</p>
          <Button
            href="https://wa.me/5493515632496?text=Hola%20Cecilia%2C%20quiero%20agendar%20una%20reuni%C3%B3n%20gratuita%20sobre%20la%20Mentor%C3%ADa%20Premium"
            variant="primary"
            className="text-lg px-12 py-4"
          >
            Agendar reunión gratuita de 15 minutos
          </Button>
        </div>
      </section>
    </div>
  );
};

export default PremiumMentorship;