import React from 'react';
import Button from '../components/Button';

const About: React.FC = () => {
  return (
    <div className="pt-20">
      <section className="py-20 px-6 bg-brand-beige min-h-screen flex items-center">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* Image */}
            <div className="w-full lg:w-1/2 flex flex-col items-center">
              <div className="relative w-80 h-80 md:w-96 md:h-96">
                <div className="absolute inset-0 bg-brand-gold rounded-full blur-2xl opacity-20 transform translate-x-4 translate-y-4"></div>
                <img
                  src="fotosCecilia/foto_cecilia_cara.jpg"
                  alt="Cecilia B. Sánchez"
                  className="rounded-full w-full h-full object-cover shadow-2xl relative z-10 border-4 border-white"
                />
              </div>
              <div className="mt-8 text-center">
                <h2 className="text-3xl font-heading font-bold text-brand-dark">Cecilia B. Sánchez</h2>
                <div className="h-1 w-20 bg-brand-gold mx-auto my-3"></div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">
                  Mentora | Coach Eneagramista | Abogada Eneatípica
                </p>
              </div>
            </div>

            {/* Text */}
            <div className="w-full lg:w-1/2">
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-brand-dark mb-8">
                Mi Historia
              </h1>
              <div className="space-y-6 text-lg text-gray-700 font-light leading-relaxed">
                <p>
                  Desde hace más de 6 años acompaño a personas a superar sus límites, expandir sus dones y conectar con su verdad más profunda.
                </p>
                <p>
                  Mi herramienta es el <span className="font-bold text-brand-gold">Eneagrama</span>: una sabiduría ancestral que permite conectar con tu esencia, entender tu historia, transformar aquellos patrones que te limitan para vivir la vida que realmente deseas y comenzar a tomar decisiones en paz.
                </p>
                <p>
                  Muchas personas ya dieron ese giro en sus vidas. Descubrieron que <span className="italic">no todo lo que "sostienen" es fortaleza, y no todo lo que "soportan" es amor.</span> <span className="text-sm text-gray-600">(gran tema)</span>
                </p>
                <p>
                  El cambio comienza cuando te das la oportunidad de ser posibilidad, no solo para ti, sino también para quienes te rodean. Y a partir de ahí tu evolución y transformación auténtica.
                </p>
                <div className="border-l-4 border-brand-gold pl-6 py-2 my-8">
                  <p className="font-medium text-brand-dark italic text-xl">
                    "Te invito a construir tu realidad desde tu verdad. A elegir en presencia. A vivir con claridad y dirección."
                  </p>
                </div>
              </div>
              <div className="mt-10">
                <div className="mt-10">
                  <Button to="/?section=mentorias">Conoce las Mentorías</Button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default About;