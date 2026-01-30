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

        <div className="border-t border-gray-800 mt-16 pt-8 text-center">
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