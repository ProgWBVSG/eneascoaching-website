import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setDropdownOpen(false);
  }, [location]);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex flex-col items-center group">
            <span className="text-xl md:text-2xl font-heading font-bold tracking-widest text-brand-dark group-hover:text-brand-gold transition-colors">
              ENEASCOACHING
            </span>
            <span className="text-[0.6rem] md:text-xs tracking-[0.2em] text-brand-gold uppercase">
              Cecilia B. Sánchez
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium hover:text-brand-gold transition-colors">INICIO</Link>
            <Link to="/sobre-mi" className="text-sm font-medium hover:text-brand-gold transition-colors">SOBRE MÍ</Link>
            
            {/* Dropdown */}
            <div className="relative group">
              <button className="flex items-center text-sm font-medium hover:text-brand-gold transition-colors focus:outline-none">
                MENTORÍAS <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-white shadow-xl rounded-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <div className="py-2">
                  <Link to="/mentorias/grupal" className="block px-4 py-2 text-sm hover:bg-brand-beige hover:text-brand-gold">Mentoría Grupal</Link>
                  <Link to="/mentorias/premium" className="block px-4 py-2 text-sm hover:bg-brand-beige hover:text-brand-gold">Mentoría Premium</Link>
                  <Link to="/diplomatura" className="block px-4 py-2 text-sm hover:bg-brand-beige hover:text-brand-gold">Diplomatura</Link>
                </div>
              </div>
            </div>

            <Link to="/contenido-gratuito" className="text-sm font-medium hover:text-brand-gold transition-colors">CONTENIDO GRATUITO</Link>

            <a
              href="https://wa.me/5493515632496?text=Hola!%20Quiero%20info%20de%20la%20comunidad%20Descubr%C3%AD%20tu%20Norte"
              target="_blank"
              rel="noreferrer"
              className="gold-gradient text-white px-4 py-2 text-sm font-bold tracking-wide transition-all rounded-sm shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              COMUNIDAD
            </a>

            <a
              href="https://wa.me/5493515632496"
              target="_blank"
              rel="noreferrer"
              className="border border-brand-dark px-4 py-2 text-sm font-medium hover:bg-brand-dark hover:text-white transition-all rounded-sm"
            >
              CONTACTO
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-brand-dark hover:text-brand-gold focus:outline-none">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed inset-0 z-40 bg-brand-beige transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} pt-24 px-6`}>
        <div className="flex flex-col space-y-6">
          <Link to="/" className="text-lg font-heading font-medium text-brand-dark border-b border-brand-gold/20 pb-2">Inicio</Link>
          <Link to="/sobre-mi" className="text-lg font-heading font-medium text-brand-dark border-b border-brand-gold/20 pb-2">Sobre Mí</Link>
          
          <div>
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex justify-between w-full text-lg font-heading font-medium text-brand-dark border-b border-brand-gold/20 pb-2">
              Mentorías <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`pl-4 flex flex-col space-y-3 mt-3 overflow-hidden transition-all duration-300 ${dropdownOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
              <Link to="/mentorias/grupal" className="text-base text-gray-600">Grupal - Liberación</Link>
              <Link to="/mentorias/premium" className="text-base text-gray-600">Premium - Individual</Link>
              <Link to="/diplomatura" className="text-base text-gray-600">Diplomatura</Link>
            </div>
          </div>

          <Link to="/contenido-gratuito" className="text-lg font-heading font-medium text-brand-dark border-b border-brand-gold/20 pb-2">Contenido Gratuito</Link>
          <a
            href="https://wa.me/5493515632496?text=Hola!%20Quiero%20info%20de%20la%20comunidad%20Descubr%C3%AD%20tu%20Norte"
            className="gold-gradient text-white text-center text-lg font-heading font-bold py-3 rounded-lg shadow-md"
          >
            ✨ Comunidad
          </a>
          <a href="https://wa.me/5493515632496" className="text-lg font-heading font-medium text-brand-gold">WhatsApp</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;