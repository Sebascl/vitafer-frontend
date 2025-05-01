import React, { useState, useEffect } from "react";
import { useCart } from '../context/CartContext';
import { navLinks } from "../constants";
import { Menu, X, ShoppingCart as CartIcon } from "lucide-react"; // Importa icono de carrito

const handleLinkClick = (e, link, setMenuOpen) => {
  e.preventDefault();
  const targetElement = document.querySelector(link);
  if (targetElement) {
    const offsetTop = targetElement.offsetTop - 100;
    window.scrollTo({ top: offsetTop, behavior: "smooth" });
  }
  if (setMenuOpen) { // Asegúrate que setMenuOpen exista (para clics fuera del menú móvil)
      setMenuOpen(false);
      document.body.style.overflow = "auto";
  }
};

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount, isCartOpen, setIsCartOpen, notification } = useCart(); // Usa el contexto

  const handleToggleCart = () => {
    setIsCartOpen(!isCartOpen); // Abre/cierra el carrito
    setMenuOpen(false); // Cierra el menú móvil si está abierto
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen || isCartOpen ? "hidden" : "auto"; // Bloquea scroll si menú o carrito están abiertos
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen, isCartOpen]);

  return (
    <header
      className={`fixed top-0 w-full z-40 transition-all duration-300 ease-in-out ${ // Reducido z-index a 40 para que el carrito (z-50) esté por encima
        scrolled
          ? "bg-black/80 backdrop-blur-md shadow-lg border-b border-amber-500/30"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center relative"> {/* Añadido relative */}
        <a href="#hero" className="flex items-center flex-shrink-0 group" onClick={(e) => handleLinkClick(e, '#hero')}>
          <img
            src="/images/vitafer-logo.png"
            alt="Vitafer Logo"
            className="h-12 md:h-16 lg:h-20 w-auto transition-opacity duration-300 group-hover:opacity-90" // Ajustado tamaño y transición
          />
        </a>

        {/* Contenedor para Nav, Botón CTA, Carrito y Menú hamburguesa */}
        <div className="flex items-center space-x-4">
           <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
             {navLinks.map(({ name, link }) => (
               <a
                 key={name}
                 href={link}
                 className="text-yellow-500 hover:text-yellow-400 font-semibold transition-colors"
                 onClick={(e) => handleLinkClick(e, link)}
               >
                 {name}
               </a>
             ))}
           </nav>

           <a
             href="#contact"
             onClick={(e) => handleLinkClick(e, '#contact')}
             className="hidden lg:inline-block bg-yellow-500 text-black px-6 py-3 rounded-full hover:bg-yellow-600 transition-all duration-300 shadow-lg hover:shadow-yellow-500/50 transform hover:scale-105 font-semibold"
           >
             Siente el poder de Vitafer
           </a>

           {/* Botón del Carrito */}
           <div className="relative">
               <button
                 onClick={handleToggleCart}
                 className="relative p-2 rounded-full text-yellow-500 hover:text-yellow-300 hover:bg-gray-700/50 focus:outline-none transition-colors"
                 aria-label="Abrir carrito"
               >
                 <CartIcon size={24} />
                 {itemCount > 0 && (
                   <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                     {itemCount}
                   </span>
                 )}
               </button>

                {/* Notificación */}
                {notification && (
                  <div className="absolute top-full right-0 mt-2 w-max max-w-xs sm:max-w-sm bg-green-600 text-white px-3 py-1 rounded text-sm shadow-lg animate-fade-in-out z-50">
                     {notification}
                  </div>
                )}
           </div>


           {/* Botón Menú Móvil */}
           <button
             className="md:hidden text-amber-400 focus:outline-none hover:text-amber-300 transition-colors"
             onClick={() => {
                 setMenuOpen(!menuOpen);
                 setIsCartOpen(false); // Cierra carrito si abre menú
             }}
             aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
           >
             {menuOpen ? <X size={28} /> : <Menu size={28} />}
           </button>
        </div>

      </div>

        {/* CSS para la animación de notificación */}
        <style>{`
         @keyframes fade-in-out {
           0% { opacity: 0; transform: translateY(-10px); }
           15% { opacity: 1; transform: translateY(0); }
           85% { opacity: 1; transform: translateY(0); }
           100% { opacity: 0; transform: translateY(-10px); }
         }
         .animate-fade-in-out {
           animation: fade-in-out 3s ease-in-out forwards;
         }
        `}</style>


      {/* Menú Móvil */}
      {menuOpen && (
        <div className="fixed top-0 left-0 w-full h-screen z-40 bg-black/90 backdrop-blur-sm flex items-center justify-center transition-all duration-300 animate-fade-in">
          <button
            onClick={() => {
              setMenuOpen(false);
              document.body.style.overflow = "auto";
            }}
            className="absolute top-6 right-6 text-yellow-500 focus:outline-none"
            aria-label="Cerrar menú"
          >
            <X size={36} />
          </button>

          <nav className="flex flex-col items-center space-y-8 text-center animate-scale-in">
            {navLinks.map(({ name, link }) => (
              <a
                key={name}
                href={link}
                className="text-yellow-500 text-2xl font-bold hover:text-yellow-400 transition-colors"
                onClick={(e) => handleLinkClick(e, link, setMenuOpen)}
              >
                {name}
              </a>
            ))}
            <a
              href="#contact"
              className="mt-6 bg-yellow-500 text-black px-8 py-4 rounded-full text-xl font-semibold hover:bg-yellow-600 transition-all duration-300 shadow-lg hover:shadow-yellow-500/50 transform hover:scale-105"
              onClick={(e) => handleLinkClick(e, '#contact', setMenuOpen)}
            >
              Siente el poder de Vitafer
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavBar;