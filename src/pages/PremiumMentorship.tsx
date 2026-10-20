import React from 'react';
import Button from '../components/Button';
import { Target, MessagesSquare, Users, TrendingUp, Compass, Mic, Map, Flag } from 'lucide-react';

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
            Entendé cómo piensa, siente y reacciona cada persona de tu equipo, comunicá con seguridad y liderá con más claridad, menos desgaste y mejores resultados.
          </p>
          <Button to="/agendar" variant="primary" className="text-lg px-10 py-4">Agendar reunión gratuita</Button>
          <p className="text-sm text-gray-400 mt-4">Proceso 1 a 1 · 2 meses · online o presencial</p>
        </div>
      </div>

      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl font-heading font-bold text-brand-dark mb-6">Para quienes tienen personas a cargo</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Liderar no es solo organizar tareas: es lograr que personas muy distintas trabajen juntas. El Eneagrama te da un mapa para entender tu forma de liderar y la de cada integrante de tu equipo, y así <strong>dar feedback, delegar y resolver conflictos según cada perfil</strong>. También trabajamos tu <strong>comunicación y tu oratoria</strong>, para que lo que decís llegue como querés. Un proceso 1 a 1, diseñado a tu medida.
            </p>
            <p className="text-brand-dark font-medium text-xl italic border-l-4 border-brand-gold pl-4 mb-6">
              "Durante 2 meses trabajamos desde el SER para lograr un HACER sostenido, disruptivo y rentable."
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
                <Mic className="text-brand-gold shrink-0" /> <span>Comunicación y oratoria con seguridad</span>
              </div>
              <div className="flex items-center gap-3">
                <Target className="text-brand-gold shrink-0" /> <span>Claridad para decidir y delegar</span>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 h-[500px] overflow-hidden">
            <img src="/fotosCecilia/foto_cecilia_mentoria_premium.jpg" alt="Cecilia B. Sánchez, mentora de líderes de equipo" className="rounded-sm shadow-2xl grayscale hover:grayscale-0 transition-all duration-700 w-full h-full object-cover object-center scale-110" />
          </div>
        </div>
      </section>

      {/* Cómo es el proceso */}
      <section className="py-20 px-6 bg-brand-dark text-white">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Cómo es el proceso</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-12">Dos meses de trabajo 1 a 1 con Cecilia, en cuatro etapas. Cada encuentro parte de situaciones reales de tu equipo y termina con algo concreto para aplicar esa misma semana.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Compass, t: 'Tu forma de liderar', d: 'Descubrís tu eneatipo y tu estilo de liderazgo: tus fortalezas, tus puntos ciegos y cómo reaccionás bajo presión.' },
              { icon: Map, t: 'El mapa de tu equipo', d: 'Identificás el perfil de cada persona: qué la motiva, cómo darle feedback, cómo delegarle y dónde aparecen los roces.' },
              { icon: Mic, t: 'Comunicación y oratoria', d: 'Trabajás cómo hablás en reuniones, presentaciones y conversaciones difíciles, para expresarte con claridad y seguridad.' },
              { icon: Flag, t: 'Plan de acción', d: 'Cerrás con hábitos y acuerdos concretos para sostener los cambios con tu equipo después de la mentoría.' },
            ].map(({ icon: Icon, t, d }, n) => (
              <div key={t} className="bg-white/5 border border-white/10 rounded-sm p-6 flex flex-col items-center">
                <span className="w-8 h-8 rounded-full bg-brand-gold text-brand-dark font-bold flex items-center justify-center mb-4">{n + 1}</span>
                <Icon className="text-brand-gold mb-3" size={28} />
                <h3 className="font-heading font-bold text-lg mb-2">{t}</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lo que mejora en tu liderazgo */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-heading font-bold text-brand-dark mb-10">Lo que mejora en tu liderazgo</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            {[
              'Tu equipo te sigue por confianza, no solo por el cargo.',
              'Das feedback que se escucha y se aplica, sin generar defensas.',
              'Delegás sabiendo qué darle a cada persona y cómo pedírselo.',
              'Liderás reuniones y presentaciones con autoridad y seguridad.',
              'Resolvés los conflictos del equipo antes de que escalen.',
              'Tomás decisiones con claridad, incluso bajo presión.',
            ].map(t => (
              <li key={t} className="flex items-start gap-3 bg-brand-beige rounded-sm p-4 text-left">
                <TrendingUp className="text-brand-gold shrink-0 mt-0.5" size={20} /> <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Details Bar */}
      <section className="bg-brand-beige py-16 px-6">
        <div className="container mx-auto">
          <div className="bg-white p-8 rounded-sm shadow-lg border-t-4 border-brand-gold grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h4 className="text-gray-500 text-sm uppercase tracking-wider mb-2">Duración</h4>
              <p className="text-2xl font-heading font-bold text-brand-dark">2 meses</p>
              <p className="text-sm text-gray-400">Encuentros 1 a 1 personalizados</p>
            </div>
            <div>
              <h4 className="text-gray-500 text-sm uppercase tracking-wider mb-2">Modalidad</h4>
              <p className="text-2xl font-heading font-bold text-brand-dark">Online o Presencial</p>
              <p className="text-sm text-gray-400">Agenda Abierta 2026</p>
            </div>
            <div>
              <h4 className="text-gray-500 text-sm uppercase tracking-wider mb-2">Inversión</h4>
              <p className="text-2xl font-heading font-bold text-brand-gold">USD 1.000</p>
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
