import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const NavBar = () => {
  const { setIsCartOpen, itemCount } = useCart();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { id: 1, name: "Inicio", href: "/" },
    { id: 2, name: "Tienda", href: "/tienda" },
    { id: 3, name: "Información", href: "/informacion" },
  ];

  const isActive = (path) => {
    return location.pathname === path ? "text-yellow-400" : "text-gray-300 hover:text-white";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-black/95 backdrop-blur-md border-b border-white/10 h-20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
        
        <Link to="/" className="flex items-center gap-3 group" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 overflow-hidden rounded-full border border-yellow-500/30 group-hover:border-yellow-500/80 transition-colors p-1 bg-black">
             <img 
                src="/images/vitafer-logo.png" 
                alt="Vitafer Logo" 
                className="w-full h-full object-contain" 
             />
          </div>
          <span className="font-black text-xl sm:text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 drop-shadow-sm">
            VITAFER
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <Link 
              key={item.id} 
              to={item.href} 
              className={`text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:scale-105 ${isActive(item.href)}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 sm:gap-6">
          {user ? (
             <div className="hidden md:flex items-center gap-4 bg-gray-900/50 py-1.5 px-4 rounded-full border border-white/10">
                <Link to="/mi-perfil" className="text-yellow-400 font-bold text-sm hover:text-yellow-200 transition-colors">
                  Hola, {user.name.split(' ')[0]}
                </Link>
                <div className="w-px h-4 bg-gray-700"></div>
                <button onClick={logout} className="text-gray-400 text-xs font-semibold hover:text-red-400 transition-colors">
                  SALIR
                </button>
             </div>
          ) : (
             <Link to="/login" className="hidden md:block text-sm font-bold text-white border border-white/20 px-5 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-300">
               INGRESAR
             </Link>
          )}

          <button 
            onClick={() => setIsCartOpen(true)} 
            className="relative group p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <span className="text-2xl sm:text-3xl filter drop-shadow-lg group-hover:scale-110 transition-transform block">🛒</span>
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-600 text-white text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md border border-black animate-pulse">
                {itemCount}
              </span>
            )}
          </button>

          <button 
            className="md:hidden text-yellow-400 text-3xl hover:text-yellow-200 transition-colors focus:outline-none" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      <div 
        className={`md:hidden absolute top-20 left-0 w-full bg-black border-b border-white/10 shadow-2xl transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col p-6 gap-6">
          {navLinks.map((item) => (
            <Link 
              key={item.id} 
              to={item.href} 
              onClick={() => setIsMobileMenuOpen(false)} 
              className={`text-lg font-bold tracking-wide ${isActive(item.href)}`}
            >
              {item.name}
            </Link>
          ))}
          
          <div className="h-px w-full bg-gray-800 my-2"></div>

          {user ? (
            <div className="flex flex-col gap-4">
                <Link 
                  to="/mi-perfil" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="flex items-center gap-2 text-yellow-400 font-bold text-lg"
                >
                  <span>👤</span> Mi Perfil ({user.name})
                </Link>
                <button 
                  onClick={() => {logout(); setIsMobileMenuOpen(false);}} 
                  className="text-left text-red-400 font-semibold hover:text-red-300"
                >
                  Cerrar Sesión
                </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="text-center bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              INICIAR SESIÓN
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;