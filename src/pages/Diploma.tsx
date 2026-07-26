import React from 'react';
import Button from '../components/Button';
import { BookOpen, Award, Layers, Globe } from 'lucide-react';

const Diploma: React.FC = () => {
  return (
    <div className="pt-20">
      {/* Hero */}
      <div className="bg-brand-dark text-white py-16 md:py-20 px-4 md:px-8 relative overflow-hidden">
        {/* Background Enneagram Subtle SVG */}
        <svg 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[900px] md:h-[900px] opacity-[0.03] text-brand-gold pointer-events-none z-0" 
          viewBox="0 0 200 200" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="100" cy="100" r="98" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <polygon points="100,2 186.6,150 13.4,150" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <polygon points="164.3,23.4 134.2,194.0 198.5,82.6 35.7,23.4 65.8,194.0 1.5,82.6" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>

        <div className="w-full mx-auto text-center max-w-[1400px] relative z-10">
          <h1 className="text-[1.5rem] sm:text-[1.8rem] md:text-[2.2rem] lg:text-[2.5rem] xl:text-[2.8rem] font-heading font-bold mb-4 leading-snug md:leading-tight">
            <span className="block w-full">Diplomatura en <span className="text-brand-gold">Eneagrama</span> de la Personalidad,</span>
            <span className="block w-full mt-1 md:mt-2"><span className="text-brand-gold">Liderazgo</span> y <span className="text-brand-gold">Vínculos Conscientes</span></span>
          </h1>
          <p className="text-sm md:text-base text-brand-gold font-medium tracking-widest uppercase mb-8 mt-6">Certificación Privada ENEASCOACHING®</p>
          <div className="w-20 h-1 bg-white mx-auto mb-8"></div>
          <p className="text-xl italic font-light">"Hombre conócete a ti mismo y conocerás el universo" - Oráculo de Delfos</p>
        </div>
      </div>

      {/* Intro */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              La formación para <strong>profesionalizarte como Coach Eneagramista certificada</strong> y llevar esta herramienta a otras personas: acompañar procesos, facilitar talleres y enseñar el Eneagrama con método propio.
              En 3 meses, 100% online, salís con tu certificación y una nueva forma de generar ingresos ayudando a otros a despertar conscientes.
            </p>
            <h3 className="text-xl font-heading font-bold mb-4">¿Es para vos?</h3>
            <ul className="space-y-2 text-gray-600 mb-6">
              <li className="flex items-center gap-2"><div className="w-2 h-2 bg-brand-gold rounded-full"></div> Querés dedicarte al coaching y al desarrollo personal</li>
              <li className="flex items-center gap-2"><div className="w-2 h-2 bg-brand-gold rounded-full"></div> Buscás una certificación y un método para enseñar</li>
              <li className="flex items-center gap-2"><div className="w-2 h-2 bg-brand-gold rounded-full"></div> Querés generar un ingreso transformando vidas</li>
            </ul>
            <p className="text-sm text-gray-600 bg-brand-beige border-l-4 border-brand-gold pl-4 py-3 rounded-r">
              ¿No querés formarte como coach, sino potenciar tu <strong>liderazgo y tus vínculos</strong> en tu empresa o equipo? Entonces lo tuyo es la <a href="#/mentorias/premium" className="text-brand-gold font-semibold underline">Mentoría en Eneagrama</a>.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            {/* Diplomatura Grupal */}
            <div className="bg-brand-beige p-8 rounded-sm border border-brand-gold/20 relative overflow-hidden shadow-sm">
              <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                23% OFF
              </div>
              <h3 className="text-2xl font-heading font-bold mb-1 text-brand-dark">Diplomatura Grupal</h3>
              <p className="text-sm font-semibold text-brand-gold mb-6">Inicia 20 de Mayo</p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2.5 rounded-full shadow-sm"><Award size={20} className="text-brand-gold" /></div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Certificación</p>
                    <p className="text-xs text-gray-500">Privada ENEASCOACHING®</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2.5 rounded-full shadow-sm"><BookOpen size={20} className="text-brand-gold" /></div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Duración</p>
                    <p className="text-xs text-gray-500">3 Meses</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2.5 rounded-full shadow-sm"><Globe size={20} className="text-brand-gold" /></div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Modalidad</p>
                    <p className="text-xs text-gray-500">100% Online (En Vivo)</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-brand-gold/20">
                <a 
                  href="https://wa.me/5493515632496?text=Hola,%20quisiera%20consultar%20el%20precio%20de%20la%20Diplomatura%20Grupal" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block w-full text-center bg-brand-gold hover:bg-[#a68a3c] text-white font-bold py-3 px-4 rounded transition-colors"
                >
                  Consultar precio
                </a>
              </div>
            </div>

            {/* Diplomatura Individual */}
            <div className="bg-white p-8 rounded-sm border border-gray-200 shadow-sm relative overflow-hidden">
              <h3 className="text-2xl font-heading font-bold mb-6 text-brand-dark">Diplomatura Individual</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-brand-beige p-2.5 rounded-full"><Award size={20} className="text-brand-gold" /></div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Certificación</p>
                    <p className="text-xs text-gray-500">Privada ENEASCOACHING®</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-brand-beige p-2.5 rounded-full"><BookOpen size={20} className="text-brand-gold" /></div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Duración</p>
                    <p className="text-xs text-gray-500">3 Meses</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-brand-beige p-2.5 rounded-full"><Globe size={20} className="text-brand-gold" /></div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Modalidad</p>
                    <p className="text-xs text-gray-500">100% Online (1 a 1)</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <a 
                  href="https://wa.me/5493515632496?text=Hola,%20quisiera%20consultar%20el%20precio%20de%20la%20Diplomatura%20Individual" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block w-full text-center border-2 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white font-bold py-2.5 px-4 rounded transition-colors"
                >
                  Consultar precio
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Syllabus */}
      <section className="py-20 px-6 bg-brand-beige">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">Programa de Formación</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Level 1 */}
            <div className="bg-white p-8 rounded-sm shadow-md hover:shadow-xl transition-shadow">
              <div className="text-brand-gold mb-4"><Layers size={32} /></div>
              <h3 className="text-xl font-heading font-bold mb-4">Primer Nivel</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Historia y origen</li>
                <li>• Ley Universal del 3</li>
                <li>• Personalidad vs Esencia</li>
                <li>• Los 9 Eneatipos</li>
                <li>• Miedos y deseos básicos</li>
                <li>• Eneatipos y dinero</li>
              </ul>
            </div>

            {/* Level 2 */}
            <div className="bg-white p-8 rounded-sm shadow-md hover:shadow-xl transition-shadow border-t-4 border-brand-gold">
              <div className="text-brand-gold mb-4"><Layers size={32} /></div>
              <h3 className="text-xl font-heading font-bold mb-4">Segundo Nivel</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Lectura de mapas álmicos</li>
                <li>• Eneagramas de familia</li>
                <li>• Análisis de pensamientos</li>
                <li>• Peldaños de consciencia</li>
                <li>• Formación invertida</li>
                <li>• Enea-Trabajo</li>
              </ul>
            </div>

            {/* Level 3 */}
            <div className="bg-white p-8 rounded-sm shadow-md hover:shadow-xl transition-shadow">
              <div className="text-brand-gold mb-4"><Layers size={32} /></div>
              <h3 className="text-xl font-heading font-bold mb-4">Tercer Nivel</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Lecturas de equipo</li>
                <li>• Trabajo final</li>
                <li>• Exposición teórica</li>
                <li>• Práctica supervisada</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 px-6 bg-white text-center">
        <h2 className="text-3xl font-heading font-bold mb-6">Convertite en Coach Eneagramista certificada</h2>
        <p className="text-xl text-gray-600 mb-10">Formate con quien ya acompañó a <strong className="text-brand-dark">+600 personas</strong>. Enseñá, facilitá y viví de transformar vidas.</p>
        <Button href="https://wa.me/5493515632496?text=Hola%20Cecilia%2C%20quiero%20informaci%C3%B3n%20de%20la%20Diplomatura" variant="primary">Agendar reunión informativa gratuita</Button>
      </section>
    </div>
  );
};

export default Diploma;