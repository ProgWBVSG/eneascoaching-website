import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-dark text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">

          {/* Column 1: Navigation */}
          <div>
            <h4 className="text-brand-gold font-heading font-bold text-lg mb-6 tracking-wide">NAVEGACIÓN</h4>
            <ul className="space-y-3 font-light text-gray-300">
              <li><Link to="/" className="hover:text-brand-gold transition-colors">Inicio</Link></li>
              <li><Link to="/sobre-mi" className="hover:text-brand-gold transition-colors">Sobre Mí</Link></li>
              <li><Link to="/contenido-gratuito" className="hover:text-brand-gold transition-colors">Contenido Gratuito</Link></li>
              <li><Link to="/mentorias/grupal" className="hover:text-brand-gold transition-colors">Mentorías</Link></li>
            </ul>
          </div>

          {/* Column 2: Programs */}
          <div>
            <h4 className="text-brand-gold font-heading font-bold text-lg mb-6 tracking-wide">PROGRAMAS</h4>
            <ul className="space-y-3 font-light text-gray-300">
              <li><Link to="/mentorias/grupal" className="hover:text-brand-gold transition-colors">Mentoría Grupal</Link></li>
              <li><Link to="/mentorias/premium" className="hover:text-brand-gold transition-colors">Mentoría Premium</Link></li>
              <li><Link to="/diplomatura" className="hover:text-brand-gold transition-colors">Diplomatura en Eneagrama</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="text-brand-gold font-heading font-bold text-lg mb-6 tracking-wide">CONTACTO</h4>
            <ul className="space-y-4 font-light text-gray-300">
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-brand-gold" />
                <a href="https://wa.me/5493515632496" className="hover:text-brand-gold transition-colors">+54 9 351 563 2496</a>
              </li>
              <li className="flex items-center space-x-3">
                <Instagram className="w-5 h-5 text-brand-gold" />
                <a href="https://instagram.com/ceciliabsanchez" target="_blank" rel="noreferrer" className="hover:text-brand-gold transition-colors">@ceciliabsanchez</a>
              </li>
              <li className="flex items-center space-x-3">
                <Youtube className="w-5 h-5 text-brand-gold" />
                <a href="https://www.youtube.com/@CeciliaEneasCoaching" target="_blank" rel="noreferrer" className="hover:text-brand-gold transition-colors">Canal de YouTube</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Lead Capture Form */}
        <div id="newsletter" className="mt-16 border-t border-gray-700 pt-12 pb-4">
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="text-brand-gold font-heading font-bold text-lg tracking-wide mb-2">
              ÚNETE A NUESTRA COMUNIDAD
            </h4>
            <p className="text-gray-400 text-sm mb-6">
              Recibí contenido exclusivo sobre Eneagrama, Coaching y transformación personal directamente en tu correo.
            </p>
            {/* Responsive iframe container */}
            <style>{`
              @media (max-width: 600px) {
                .brevo-iframe-wrap { overflow: hidden; height: 320px; }
                .brevo-iframe-wrap iframe {
                  transform-origin: top left;
                  transform: scale(0.8);
                  width: 125% !important;
                  height: 125% !important;
                }
              }
            `}</style>
            <div
              className="brevo-iframe-wrap"
              style={{ overflow: 'hidden', width: '100%', maxWidth: '540px', margin: '0 auto' }}
            >
              <iframe
                src="https://7cb1d778.sibforms.com/serve/MUIFAN-D0V0FlzFB42PEGHtOkz1khRHnkPI1ZOohgyZFsVATBRgSX0GUxqV-59fCC0CrXIeJEQ4ReAvyEsLpg2mwTXm6PdLIO6klFhJNDudLWzAgKwjM3euIOgYldPbDI1FnQqwvkc3AjRaFaTaYFTCZ-s7FKEAx0gmhFjzAyvWEPm0dyxmmEgXqAIPqb_mbSEO8HZc-rLYbn4iebQ=="
                frameBorder="0"
                scrolling="no"
                allowFullScreen
                title="Formulario de suscripción"
                style={{
                  display: 'block',
                  width: '540px',
                  maxWidth: '100%',
                  height: '305px',
                  border: 'none',
                  margin: '0 auto',
                  overflow: 'hidden',
                }}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <Link to="/" className="inline-block mb-4">
            <span className="text-2xl font-heading font-bold tracking-widest text-white">
              ENEASCOACHING
            </span>
          </Link>
          <p className="text-brand-gold text-sm tracking-widest uppercase mb-4">
            Mentora | Coach Eneagramista | Abogada Eneatípica
          </p>
          <p className="text-gray-500 text-xs">
            &copy; 2025 ENEASCOACHING - Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;