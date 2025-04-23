import React from 'react';
import { socialImgs } from "../constants"; // Asegúrate que tenga { name, imgPath, url }

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-black via-gray-950/95 to-gray-950/90 py-10 md:py-14 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">

          <div className="flex-shrink-0">
            <a href="#hero" className="inline-block group">
               <img
                 src="/images/vitafer-logo.png"
                 alt="Vitafer Logo"
                 className="h-10 w-auto group-hover:opacity-80 transition-opacity"
               />
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {/* <a href="/terms" className="text-sm text-gray-400 hover:text-amber-400 transition-colors">
              Términos y Condiciones
            </a>
            <a href="/privacy" className="text-sm text-gray-400 hover:text-amber-400 transition-colors">
              Política de Privacidad
            </a> */}
             {/* Descomenta y ajusta los links si tienes esas páginas */}
          </div>

          <div className="flex items-center space-x-5">
            {socialImgs.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="text-gray-400 hover:text-amber-300 transition-colors duration-300"
              >
                <img
                  src={social.imgPath}
                  alt={social.name}
                  className="w-6 h-6 filter grayscale hover:grayscale-0 hover:scale-110 transition-all duration-300 ease-in-out"
                />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Vitafer Mexico. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;