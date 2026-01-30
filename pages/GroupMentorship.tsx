import React from 'react';
import Button from '../components/Button';
import { CheckCircle2, CircleDot, Calendar, Users, DollarSign, MessageCircleHeart } from 'lucide-react';

const GroupMentorship: React.FC = () => {
  return (
    <div className="pt-20">
      {/* Hero */}
      <div className="relative bg-brand-dark text-white py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-black"></div>
        <div className="container mx-auto relative z-10 text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">Mentorías Grupales <br /><span className="text-brand-gold">de Liberación Personal</span></h1>
          <p className="text-xl md:text-2xl font-light italic text-gray-300">"Patrones que sostienen, patrones que liberan"</p>

          {/* Sales Video - High Conversion Design */}
          <div className="mt-12 relative w-full max-w-3xl mx-auto rounded-sm shadow-[0_0_40px_rgba(197,160,89,0.3)] border-2 border-brand-gold/30 overflow-hidden group bg-black aspect-video">
            <iframe
              src="https://www.youtube.com/embed/l24L7jELboo"
              title="Presentación Mentoría Grupal"
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

      {/* Method Description */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
            "El coaching es un camino para superar limitaciones, hacer conscientes acciones, hábitos, valores, creencias, juicios y llevarlos a nuestra mejor versión.
            A través del Eneagrama vamos recorriendo ese camino descubriendo nuestra huella energética.
            <br /><span className="font-bold text-brand-gold">La integración de ambos nos lleva a un despertar consciente.</span>"
          </p>
        </div>
      </section>

      {/* Target Audience & Questions */}
      <section className="py-20 px-6 bg-brand-beige overflow-hidden">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="text-3xl font-heading font-bold text-brand-dark mb-8">¿Para quién es esta mentoría?</h3>
            <ul className="space-y-4">
              {[
                "Mujeres que quieren conocerse más profundamente",
                "Personas buscando claridad interna para tomar decisiones en paz",
                "Quienes deseen soltar cargas emocionales que drenan su energía",
                "Personas listas para vivir la vida que quieren, no la que temen"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-brand-gold flex-shrink-0 mt-1" />
                  <span className="text-gray-700 text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative flex justify-center py-12 md:py-0">
            {/* Circular Design for Questions - Redesigned */}
            <div className="w-64 h-64 md:w-96 md:h-96 rounded-full border border-brand-gold/40 flex items-center justify-center relative bg-white shadow-[0_0_40px_rgba(197,160,89,0.15)]">

              {/* Center Core */}
              <div className="absolute inset-4 md:inset-8 rounded-full bg-brand-beige flex items-center justify-center border border-brand-gold/10">
                <div className="flex flex-col items-center justify-center">
                  <CircleDot className="w-10 h-10 md:w-14 md:h-14 text-brand-gold mb-2" />
                  <span className="text-[10px] md:text-xs font-heading font-bold text-gray-500 tracking-[0.2em] uppercase">Tu Esencia</span>
                </div>
              </div>

              {/* Decorative Rings */}
              <div className="absolute inset-0 rounded-full border border-brand-gold/20 scale-[0.6]"></div>
              <div className="absolute inset-0 rounded-full border border-brand-gold/20 scale-[0.8]"></div>

              {/* North Node */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-brand-dark text-white px-4 py-2 rounded-full text-xs md:text-sm font-medium shadow-lg border border-brand-gold hover:scale-105 transition-transform cursor-default whitespace-nowrap z-10">
                ¿Quién soy?
              </div>

              {/* South Node */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-brand-dark text-white px-4 py-2 rounded-full text-xs md:text-sm font-medium shadow-lg border border-brand-gold hover:scale-105 transition-transform cursor-default whitespace-nowrap z-10">
                ¿Cuál es mi propósito?
              </div>

              {/* West Node */}
              <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand-dark text-white px-4 py-2 rounded-full text-xs md:text-sm font-medium shadow-lg border border-brand-gold hover:scale-105 transition-transform cursor-default whitespace-nowrap z-10">
                ¿Quién estoy siendo?
              </div>

              {/* East Node */}
              <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 bg-brand-dark text-white px-4 py-2 rounded-full text-xs md:text-sm font-medium shadow-lg border border-brand-gold hover:scale-105 transition-transform cursor-default whitespace-nowrap z-10">
                ¿Quién elijo ser?
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-5xl">
          <h3 className="text-3xl font-heading font-bold text-center text-brand-dark mb-12">¿Qué lograrás en estas Mentorías?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              "Distinguir lo que hoy sostienes por amor o elección vs. lo que sigues 'aguantando' por miedo.",
              "Soltar cargas emocionales que drenan tu energía.",
              "Recuperar claridad interna para tomar decisiones en paz.",
              "Fortalecer tu libertad interior, incluso en contextos difíciles.",
              "Vivir la vida que quieres, no la que temes.",
              "Acceso exclusivo a una Comunidad de WhatsApp: un espacio de pertenencia, sostén y crecimiento compartido."
            ].map((benefit, idx) => {
              const isCommunity = idx === 5;
              const isImpactPhrase = idx === 4;

              return (
                <div
                  key={idx}
                  className={`
                    p-6 rounded-sm transition-all duration-300 flex items-start gap-4 relative
                    ${isCommunity
                      ? "bg-white border-2 border-brand-gold shadow-[0_0_20px_rgba(197,160,89,0.25)] hover:shadow-[0_0_30px_rgba(197,160,89,0.4)] transform hover:-translate-y-1 md:col-span-2 md:w-3/4 md:mx-auto"
                      : isImpactPhrase
                        ? "bg-brand-beige border-l-4 border-brand-gold hover:shadow-lg md:col-span-2 md:w-3/4 md:mx-auto"
                        : "bg-brand-beige border-l-4 border-brand-gold hover:shadow-lg"
                    }
                  `}
                >
                  {isCommunity && (
                    <div className="absolute inset-0 rounded-sm bg-brand-gold/5 blur-xl -z-10"></div>
                  )}

                  {isCommunity ? (
                    <div className="bg-brand-gold/10 p-3 rounded-full flex-shrink-0 animate-pulse">
                      <MessageCircleHeart className="w-8 h-8 text-brand-gold" />
                    </div>
                  ) : (
                    <div className="w-2 h-2 bg-brand-gold rounded-full mt-2 flex-shrink-0"></div>
                  )}

                  <div>
                    {isCommunity && <p className="text-xs font-bold text-brand-gold uppercase tracking-widest mb-1">Bonus Especial</p>}
                    <p className={`font-medium ${isCommunity ? "text-brand-dark text-lg" : isImpactPhrase ? "text-gray-900 font-semibold italic text-lg" : "text-gray-800"}`}>{benefit}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Details & Pricing */}
      <section className="py-20 px-6 bg-brand-dark text-white">
        <div className="container mx-auto max-w-4xl bg-white/5 p-8 md:p-12 rounded-lg border border-white/10 backdrop-blur-sm">
          <h3 className="text-3xl font-heading font-bold text-center mb-10">Detalles del Programa</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-12">
            <div>
              <Calendar className="w-10 h-10 text-brand-gold mx-auto mb-3" />
              <h4 className="font-bold text-lg">Inicio</h4>
              <p className="text-gray-300">Martes 10 de febrero de 2026</p>
            </div>
            <div>
              <Users className="w-10 h-10 text-brand-gold mx-auto mb-3" />
              <h4 className="font-bold text-lg">Duración</h4>
              <p className="text-gray-300">8 encuentros</p>
              <p className="text-brand-gold font-bold mt-1 uppercase text-sm tracking-wider">100% Online</p>
            </div>
            <div>
              <DollarSign className="w-10 h-10 text-brand-gold mx-auto mb-3" />
              <h4 className="font-bold text-lg">Inversión</h4>
              <p className="text-gray-300">$49,800 ARS (Total)</p>
              <p className="text-gray-400 text-sm">o 2 cuotas de $24,900</p>
              <p className="text-brand-gold font-bold mt-2">USD 55</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xl italic mb-8 font-light text-gray-300">
              "No todo lo que sostenes es fortaleza. No todo lo que aguantas es amor. En estas Mentorías de Liberación Personal vas a aprender a elegir en Presencia."
            </p>
            <Button
              href="https://wa.me/5493515632496?text=Hola%20Cecilia,%20quiero%20sumarme%20a%20la%20Mentoría%20Grupal"
              variant="primary"
              className="text-lg px-10 py-4 shadow-[0_0_20px_rgba(197,160,89,0.5)]"
            >
              Quiero sumarme - Contactar por WhatsApp
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GroupMentorship;