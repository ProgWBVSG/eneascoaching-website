import React from 'react';
import Button from '../components/Button';
import { Target, MessagesSquare, Users, TrendingUp } from 'lucide-react';

// Mentoría 1 a 1 para líderes de equipo (antes "Mentoría Premium" / "Mentoría en Eneagrama")
const PremiumMentorship: React.FC = () => {
  return (
    <div className="pt-20">
      {/* Hero */}
      <div className="bg-black text-white py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-gold/20 to-black z-0"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-heading font-bold mb-6">Mentoría para <span className="text-brand-gold">Líderes de Equipo</span></h1>
          <p className="text-xl sm:text-2xl font-light text-gray-300 mb-4">Liderá desde el SER.</p>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10">
            Entendé cómo piensa, siente y reacciona cada persona de tu equipo, y liderá con más claridad, menos desgaste y mejores resultados.
          </p>
          <Button to="/agendar" variant="primary" className="text-lg px-10 py-4">Agendar reunión gratuita</Button>
          <p className="text-sm text-gray-400 mt-4">Proceso 1 a 1 · 12 encuentros · online o presencial</p>
        </div>
      </div>

      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl font-heading font-bold text-brand-dark mb-6">Para quienes tienen personas a cargo</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Liderar no es solo organizar tareas: es lograr que personas muy distintas trabajen juntas. El Eneagrama te da un mapa para entender tu forma de liderar y la de cada integrante de tu equipo, y así <strong>dar feedback, delegar y resolver conflictos según cada perfil</strong>. Un proceso 1 a 1, diseñado a tu medida.
            </p>
            <p className="text-brand-dark font-medium text-xl italic border-l-4 border-brand-gold pl-4 mb-6">
              "Durante 12 encuentros trabajamos desde el SER para lograr un HACER sostenido, disruptivo y rentable."
            </p>
            <h3 className="text-lg font-heading font-bold text-brand-dark mb-2">¿Para quién es?</h3>
            <p className="text-gray-600 mb-4">Gerentes y mandos medios · Dueños de negocio con equipo · Líderes de Recursos Humanos · Coordinadores de proyectos y áreas.</p>
            <p className="text-sm text-gray-600 bg-brand-beige border-l-4 border-brand-gold pl-4 py-3 rounded-r mb-8">
              ¿Querés formarte como coach y <strong>enseñar</strong> el Eneagrama? Entonces mirá la <a href="/diplomatura" className="text-brand-gold font-semibold underline">Diplomatura</a>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Users className="text-brand-gold shrink-0" /> <span>Entender a cada persona del equipo</span>
              </div>
              <div className="flex items-center gap-3">
                <MessagesSquare className="text-brand-gold shrink-0" /> <span>Feedback y conversaciones difíciles</span>
              </div>
              <div className="flex items-center gap-3">
                <Target className="text-brand-gold shrink-0" /> <span>Claridad para decidir y delegar</span>
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp className="text-brand-gold shrink-0" /> <span>Resultados sostenibles</span>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 h-[500px] overflow-hidden">
            <img src="/fotosCecilia/foto_cecilia_mentoria_premium.jpg" alt="Cecilia B. Sánchez, mentora de líderes de equipo" className="rounded-sm shadow-2xl grayscale hover:grayscale-0 transition-all duration-700 w-full h-full object-cover object-center scale-110" />
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
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">Liderá desde la consciencia</h2>
          <p className="text-xl text-gray-600 mb-10">Un proceso a tu medida para transformar cómo liderás a tu equipo, guiado por quien ya acompañó a <strong className="text-brand-dark">+600 personas</strong>.</p>
          <Button to="/agendar" variant="primary" className="text-lg px-12 py-4">
            Agendar reunión gratuita de 20 minutos
          </Button>
        </div>
      </section>
    </div>
  );
};

export default PremiumMentorship;
