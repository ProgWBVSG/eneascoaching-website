import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  children: React.ReactNode;
  to?: string;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, to, href, variant = 'primary', className = '', onClick }) => {
  const baseStyles = "inline-flex items-center justify-center px-8 py-3 text-sm font-semibold tracking-wide transition-all duration-300 transform hover:-translate-y-1 rounded-sm uppercase font-heading";

  const variants = {
    primary: "bg-brand-gold text-white hover:bg-yellow-700 shadow-lg hover:shadow-xl",
    secondary: "bg-brand-dark text-white hover:bg-black shadow-md",
    outline: "border-2 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white"
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${className}`;

  if (to) {
    return (
      <Link
        to={to}
        className={combinedClasses}
        onClick={(e) => {
          if (onClick) {
            onClick();
          }
        }}
      >
        {children}
      </Link>
    );
  }

  if (href) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className={combinedClasses}>{children}</a>;
  }

  return (
    <button onClick={onClick} className={combinedClasses}>
      {children}
    </button>
  );
};

export default Button;