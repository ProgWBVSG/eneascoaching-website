import React from 'react';
import Button from '../components/Button';
import { Diamond, Users, Star, Award } from 'lucide-react';

import { useLocation } from 'react-router-dom';

const Home: React.FC = () => {
  const location = useLocation();

  React.useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else if (location.search) {
      const params = new URLSearchParams(location.search);
      const section = params.get('section');
      if (section) {
        const element = document.getElementById(section);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    }
  }, [location]);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-brand-beige overflow-hidden pt-20 pb-16">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#f0ede6] -skew-x-12 transform translate-x-20 z-0"></div>
        <div className="absolute bottom-20 left-10 text-9xl text-brand-gold opacity-5 font-heading font-bold select-none">ENEAS</div>

        <div className="container mx-auto px-6 relative z-10 flex flex-col-reverse lg:flex-row items-center gap-12">
          {/* Text Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h2 className="text-brand-gold font-bold tracking-widest text-sm md:text-base mb-3 uppercase">
              Método #Eneascoaching
            </h2>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-brand-dark leading-tight mb-4">
              Conviértete en viajero <span className="text-brand-gold italic font-light">sin prisa</span> de tu propia vida
            </h1>
            <h3 className="text-lg md:text-xl font-medium text-gray-700 mb-4 border-l-4 border-brand-gold pl-4">
              "El Coaching nos da interioridad. El Eneagrama profundidad."
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Método #Eneascoaching: una integración poderosa de Coaching Ontológico y Eneagrama, aplicado con éxito a más de 2000 personas. Descubre tu esencia, transforma tus patrones y vive la vida que deseas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button to="/mentorias/grupal">Comenzar el Viaje</Button>
              <Button to="/sobre-mi" variant="outline">Conocer a Cecilia</Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 border-2 border-brand-gold rounded-full transform translate-x-4 translate-y-4"></div>
              <img
                src="fotosCecilia/foto_cecilia_home.jpg"
                alt="Cecilia B. Sánchez"
                className="rounded-full w-80 h-80 md:w-[500px] md:h-[500px] object-cover shadow-2xl relative z-10 transition-all duration-700"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-4 shadow-lg rounded-sm z-20 hidden md:block">
                <p className="font-heading font-bold text-brand-dark text-lg">+2000</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Vidas Transformadas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Separator */}
      <section className="py-20 bg-brand-dark text-center px-6">
        <div className="max-w-4xl mx-auto">
          <Diamond className="w-8 h-8 text-brand-gold mx-auto mb-6" />
          <p className="text-2xl md:text-4xl font-heading text-white font-light italic leading-relaxed">
            "No todo lo que sostenes es fortaleza. No todo lo que aguantas es amor."
          </p>
        </div>
      </section>

      {/* Mentorías Section */}
      <section className="py-24 bg-white" id="mentorias">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-brand-dark mb-4">Nuestras Mentorías</h2>
            <div className="w-24 h-1 bg-brand-gold mx-auto"></div>
            <p className="mt-4 text-gray-600">Elige el camino que resuene con tu momento actual.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Card 1 */}
            <div className="group bg-brand-beige rounded-sm overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="h-64 overflow-hidden relative">
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors z-10"></div>
                <img src="fotosCecilia/foto_cecilia_clase.jpg" alt="Mentoría Grupal" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute bottom-4 left-4 z-20">
                  <span className="bg-brand-gold text-white text-xs px-3 py-1 uppercase tracking-wider font-bold">Grupal</span>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-heading font-bold mb-3 text-brand-dark">Liberación Personal</h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                  Patrones que sostienen, patrones que liberan. Aprende a elegir en presencia.
                </p>
                <Button to="/mentorias/grupal" variant="secondary" className="w-full">Súmate ahora</Button>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group bg-brand-dark rounded-sm overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-gold"></div>
              <div className="h-64 overflow-hidden relative">
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10"></div>
                <img src="fotosCecilia/foto_cecilia_mentoria_premium.jpg" alt="Mentoría Premium" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute bottom-4 left-4 z-20">
                  <span className="bg-white text-brand-dark text-xs px-3 py-1 uppercase tracking-wider font-bold">Premium</span>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-heading font-bold mb-3 text-white">Mentoría Individual</h3>
                <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                  No necesitas más información. Necesitas dirección. Un espacio profundo y personalizado.
                </p>
                <Button to="/mentorias/premium" variant="primary" className="w-full">Agenda reunión gratuita</Button>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group bg-brand-beige rounded-sm overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="h-64 overflow-hidden relative">
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors z-10"></div>
                <img src="fotosCecilia/foto_cecilia_diplomatura.jpg" alt="Diplomatura" className="w-full h-full object-cover object-top transform group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute bottom-4 left-4 z-20">
                  <span className="bg-brand-dark text-white text-xs px-3 py-1 uppercase tracking-wider font-bold">Formación</span>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-heading font-bold mb-3 text-brand-dark">Diplomatura Eneagrama</h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                  Formación certificada de 6 meses para transformar vidas y generar un impacto real.
                </p>
                <Button to="/diplomatura" variant="outline" className="w-full border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white">Conoce el programa</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-brand-beige">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-brand-dark mb-4">Lo que dicen nuestros alumnos</h2>
            <div className="w-24 h-1 bg-brand-gold mx-auto"></div>
            <p className="mt-4 text-gray-600">Historias reales de transformación.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Testimonial 1 */}
            <div className="bg-white p-8 rounded-sm shadow-md hover:shadow-lg transition-shadow relative border-b-4 border-transparent hover:border-brand-gold">
              <div className="absolute top-4 left-4 text-6xl text-brand-gold opacity-10 font-heading">"</div>
              <p className="text-gray-600 italic mb-6 relative z-10 leading-relaxed pt-4">
                Cecilia tiene una calidez única. Su método me ayudó a entender por qué repetía los mismos patrones y cómo liberarme de ellos con amor y consciencia.
              </p>
              <div className="mt-auto">
                <h4 className="font-bold text-brand-dark font-heading">María G.</h4>
                <p className="text-xs text-brand-gold font-bold uppercase tracking-wider">Mentoría Premium</p>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-8 rounded-sm shadow-md hover:shadow-lg transition-shadow relative border-b-4 border-transparent hover:border-brand-gold">
              <div className="absolute top-4 left-4 text-6xl text-brand-gold opacity-10 font-heading">"</div>
              <p className="text-gray-600 italic mb-6 relative z-10 leading-relaxed pt-4">
                La diplomatura cambió mi forma de ver el mundo. No solo aprendí teoría, sino que viví una transformación personal profunda que ahora aplico en mi profesión.
              </p>
              <div className="mt-auto">
                <h4 className="font-bold text-brand-dark font-heading">Gemma J. Fares.</h4>
                <p className="text-xs text-brand-gold font-bold uppercase tracking-wider">Diplomatura</p>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-8 rounded-sm shadow-md hover:shadow-lg transition-shadow relative border-b-4 border-transparent hover:border-brand-gold">
              <div className="absolute top-4 left-4 text-6xl text-brand-gold opacity-10 font-heading">"</div>
              <p className="text-gray-600 italic mb-6 relative z-10 leading-relaxed pt-4">
                Agradecida a la vida por haberte encontrado este año. Gracias por enseñarme tantas cosas. Que este 2026 llegue pleno de felicidad y puedas cumplir todos tus proyectos. Un abrazo grande.
              </p>
              <div className="mt-auto">
                <h4 className="font-bold text-brand-dark font-heading">Majo E.</h4>
                <p className="text-xs text-brand-gold font-bold uppercase tracking-wider">Mentoría Premium</p>
              </div>
            </div>
          </div>

          {/* Real WhatsApp Testimonials Images & Video */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* First column: First image */}
            <img src="/testimonios/testimonio1.jpg" alt="Testimonio WhatsApp 1" className="w-full h-auto rounded-sm shadow-md hover:shadow-lg transition-shadow" />

            {/* Second column: Second image */}
            <img src="/testimonios/testimonio2.jpg" alt="Testimonio WhatsApp 2" className="w-full h-auto rounded-sm shadow-md hover:shadow-lg transition-shadow" />

            {/* Third & Fourth columns: Video spanning 2 columns */}
            <div className="lg:col-span-2 col-span-1 md:col-span-2 lg:row-span-2">
              <div className="bg-white p-6 rounded-sm shadow-lg h-full">
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full rounded-sm"
                    src="https://www.youtube.com/embed/cEVR1ubq6dg"
                    title="Video sobre Eneagrama"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>

            {/* Second row, first two columns: Images 3 and 4 */}
            <img src="/testimonios/testimonio3.jpg" alt="Testimonio WhatsApp 3" className="w-full h-auto rounded-sm shadow-md hover:shadow-lg transition-shadow" />
            <img src="/testimonios/testimonio4.jpg" alt="Testimonio WhatsApp 4" className="w-full h-auto rounded-sm shadow-md hover:shadow-lg transition-shadow" />

            {/* Third row: Image 5 */}
            <img src="/testimonios/testimonio5.jpg" alt="Testimonio WhatsApp 5" className="w-full h-auto rounded-sm shadow-md hover:shadow-lg transition-shadow" />
          </div>
        </div>
      </section>

      {/* Stats / Credentials Bar */}
      <section className="bg-brand-gold py-12 text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
            <div className="p-4">
              <Star className="w-10 h-10 mx-auto mb-3 text-white/90" />
              <h4 className="text-xl font-heading font-bold">Mentora</h4>
              <p className="text-sm text-white/80 mt-1">Guía experta en procesos</p>
            </div>
            <div className="p-4">
              <Users className="w-10 h-10 mx-auto mb-3 text-white/90" />
              <h4 className="text-xl font-heading font-bold">Coach Eneagramista</h4>
              <p className="text-sm text-white/80 mt-1">Especialista en personalidad</p>
            </div>
            <div className="p-4">
              <Award className="w-10 h-10 mx-auto mb-3 text-white/90" />
              <h4 className="text-xl font-heading font-bold">Abogada Eneatípica</h4>
              <p className="text-sm text-white/80 mt-1">Estructura y claridad</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;