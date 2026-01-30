import React from 'react';
import Button from '../components/Button';
import { BookOpen, Award, Layers, Globe } from 'lucide-react';

const Diploma: React.FC = () => {
  return (
    <div className="pt-20">
      {/* Hero */}
      <div className="bg-brand-dark text-white py-20 px-6">
        <div className="container mx-auto text-center max-w-5xl">
          <h1 className="text-3xl md:text-5xl font-heading font-bold mb-4 leading-tight">
            Diplomatura en Eneagrama de la Personalidad, <br className="hidden md:block" />Liderazgo y Vincularidad Sana
          </h1>
          <p className="text-brand-gold font-medium tracking-widest uppercase mb-8">Certificación Privada ENEASCOACHING®</p>
          <div className="w-20 h-1 bg-white mx-auto mb-8"></div>
          <p className="text-xl italic font-light">"Hombre conócete a ti mismo y conocerás el universo" - Oráculo de Delfos</p>
        </div>
      </div>

      {/* Intro */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Formación profesional de 6 meses en modalidad online, diseñada para personas que desean enseñar, facilitar y transformar vidas.
              Aprende a ser mentor, profundiza en coaching ontológico y Eneagrama, y genera un ingreso extra mientras ayudas a otros a despertar conscientes.
            </p>
            <h3 className="text-xl font-heading font-bold mb-4">¿Para quién es?</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2"><div className="w-2 h-2 bg-brand-gold rounded-full"></div> Personas que quieren enseñar y facilitar</li>
              <li className="flex items-center gap-2"><div className="w-2 h-2 bg-brand-gold rounded-full"></div> Quienes buscan generar ingresos extra</li>
              <li className="flex items-center gap-2"><div className="w-2 h-2 bg-brand-gold rounded-full"></div> Profesionales del desarrollo personal</li>
            </ul>
          </div>
          <div className="bg-brand-beige p-8 rounded-sm border border-brand-gold/20">
            <h3 className="text-2xl font-heading font-bold mb-6 text-brand-dark">Detalles Clave</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-full shadow-sm"><Award className="text-brand-gold" /></div>
                <div>
                  <p className="font-bold text-gray-900">Certificación</p>
                  <p className="text-sm text-gray-500">Privada ENEASCOACHING®</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-full shadow-sm"><BookOpen className="text-brand-gold" /></div>
                <div>
                  <p className="font-bold text-gray-900">Duración</p>
                  <p className="text-sm text-gray-500">6 Meses</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-full shadow-sm"><Globe className="text-brand-gold" /></div>
                <div>
                  <p className="font-bold text-gray-900">Modalidad</p>
                  <p className="text-sm text-gray-500">100% Online</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-3xl font-bold text-brand-gold mb-1">USD 1,500</p>
              <p className="text-sm text-gray-500 mb-2">Argentina: $980,000 ARS Contado</p>
              <p className="text-xs text-gray-400">O 6 cuotas de $220,000 ARS</p>
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
        <h2 className="text-3xl font-heading font-bold mb-6">Formación certificada para transformar vidas</h2>
        <p className="text-xl text-gray-600 mb-10">Conviértete en facilitador del despertar consciente.</p>
        <Button href="https://wa.me/5493515632496" variant="primary">Agendar reunión informativa gratuita</Button>
      </section>
    </div>
  );
};

export default Diploma;