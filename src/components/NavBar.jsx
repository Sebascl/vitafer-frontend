import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { FaShoppingCart } from 'react-icons/fa';

const NavBar = () => {
  const { setIsCartOpen, itemCount } = useCart();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { id: 1, name: "Inicio", href: "/inicio" },
    { id: 2, name: "Tienda", href: "/" },
    { id: 3, name: "Información", href: "/informacion" },
  ];

  const isActive = (path) => {
    return location.pathname === path ? "text-yellow-400" : "text-gray-300 hover:text-white";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-black/95 backdrop-blur-md border-b border-white/10 h-24 transition-all duration-300 flex items-center">
      <div className="max-w-7xl w-full mx-auto px-6 flex justify-between items-center">
        
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setIsMobileMenuOpen(false)}>
          <img 
            src="/images/vitafer-logo.png" 
            alt="Vitafer Logo" 
            className="h-16 w-16 sm:h-20 sm:w-20 object-contain filter drop-shadow-[0_0_10px_rgba(234,179,8,0.6)] group-hover:scale-110 transition-transform duration-300" 
          />
          <span className="font-black text-2xl sm:text-3xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 drop-shadow-sm hidden sm:block">
            VITAFER
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <Link 
              key={item.id} 
              to={item.href} 
              className={`text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:scale-105 hover:text-yellow-400 ${isActive(item.href)}`}
            >
              {item.name}
            </Link>
          ))}
          
          <Link 
            to={user ? "/mi-perfil?tab=roulette" : "/login"}
            className="text-xs font-black uppercase tracking-widest text-yellow-400 animate-pulse hover:scale-110 transition-transform border border-yellow-500/50 px-3 py-1.5 rounded-lg hover:bg-yellow-500/10 shadow-[0_0_10px_rgba(234,179,8,0.3)]"
          >
            RULETA 🎰
          </Link>
        </nav>

        <div className="flex items-center gap-5">
          {user ? (
             <div className="hidden md:flex items-center gap-4 bg-gray-900/80 py-2 px-5 rounded-lg border border-yellow-500/20">
                <Link to="/mi-perfil" className="text-yellow-400 font-bold text-sm hover:text-yellow-200 transition-colors">
                  Hola, {user.name.split(' ')[0]}
                </Link>
                <div className="w-px h-4 bg-gray-600"></div>
                <button onClick={logout} className="text-gray-400 text-xs font-semibold hover:text-red-400 transition-colors uppercase tracking-wider">
                  Salir
                </button>
             </div>
          ) : (
             <Link to="/login" className="hidden md:block text-sm font-bold text-black bg-yellow-500 px-6 py-2.5 rounded-lg hover:bg-yellow-400 transition-all duration-300 shadow-[0_0_15px_rgba(234,179,8,0.3)] transform hover:scale-105">
               INGRESAR
             </Link>
          )}

          <button 
            onClick={() => setIsCartOpen(true)} 
            className="relative group p-3 hover:bg-gray-800/80 rounded-xl transition-all duration-300"
          >
            <FaShoppingCart className="text-2xl text-white group-hover:text-yellow-400 transition-colors filter drop-shadow-md" />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md border border-black animate-bounce">
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
        className={`md:hidden absolute top-24 left-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/10 shadow-2xl transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col p-8 gap-8">
          {navLinks.map((item) => (
            <Link 
              key={item.id} 
              to={item.href} 
              onClick={() => setIsMobileMenuOpen(false)} 
              className={`text-xl font-bold tracking-wide ${isActive(item.href)}`}
            >
              {item.name}
            </Link>
          ))}
          
          <Link 
            to={user ? "/mi-perfil?tab=roulette" : "/login"}
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-xl font-black text-yellow-400 tracking-wide"
          >
            RULETA DE PREMIOS 🎰
          </Link>
          
          <div className="h-px w-full bg-gray-800 my-2"></div>

          {user ? (
            <div className="flex flex-col gap-6">
                <Link 
                  to="/mi-perfil" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="flex items-center gap-3 text-white font-bold text-xl"
                >
                  <span>👤</span> Mi Perfil ({user.name})
                </Link>
                <button 
                  onClick={() => {logout(); setIsMobileMenuOpen(false);}} 
                  className="text-left text-red-400 font-semibold hover:text-red-300 text-lg"
                >
                  Cerrar Sesión
                </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="text-center bg-yellow-500 text-black font-bold py-4 rounded-xl hover:bg-yellow-400 transition-colors text-lg shadow-lg"
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