import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { navLinks } from "../constants";
import { Menu, X, ShoppingCart as CartIcon } from "lucide-react";

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount, isCartOpen, setIsCartOpen, notification } = useCart();
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleToggleCart = () => {
    setIsCartOpen(!isCartOpen);
    setMenuOpen(false);
  };

  const handleLinkClick = (closeMobileMenu = false) => {
    if (closeMobileMenu) {
      setMenuOpen(false);
      document.body.style.overflow = "auto";
    }
  };
  
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const offsetTop = element.offsetTop - 100;
          window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
      }, 150);
    }
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen || isCartOpen ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [menuOpen, isCartOpen]);

  return (
    <header className={`fixed top-0 w-full z-40 transition-all duration-300 ease-in-out ${scrolled ? "bg-black/80 backdrop-blur-md shadow-lg" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center relative">
        <RouterLink to="/">
          <img src="/images/vitafer-logo.png" alt="Vitafer Logo" className="h-12 md:h-16 w-auto"/>
        </RouterLink>
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map(({ name, link }) => (
              <RouterLink key={name} to={link} className="text-yellow-500 hover:text-yellow-400 font-semibold transition-colors">
                {name}
              </RouterLink>
            ))}
          </nav>
          <RouterLink to="/tienda" className="hidden lg:inline-block bg-yellow-500 text-black px-6 py-3 rounded-full hover:bg-yellow-600 font-semibold transition-transform duration-300 hover:scale-105">
            Comprar Ahora
          </RouterLink>
          <div className="relative">
            <button onClick={handleToggleCart} className="relative p-2 rounded-full text-yellow-500 hover:text-yellow-300 focus:outline-none">
              <CartIcon size={24} />
              {itemCount > 0 && ( <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 text-xs font-bold text-red-100 bg-red-600 rounded-full">{itemCount}</span> )}
            </button>
            {notification && ( <div className="absolute top-full right-0 mt-2 w-max max-w-xs sm:max-w-sm bg-green-600 text-white px-3 py-1 rounded text-sm shadow-lg"> {notification} </div> )}
          </div>
          <button className="md:hidden text-amber-400 focus:outline-none" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="fixed top-0 left-0 w-full h-screen z-30 bg-black/95 flex items-center justify-center">
          <button onClick={() => handleLinkClick(true)} className="absolute top-6 right-6 text-yellow-500 focus:outline-none"><X size={36} /></button>
          <nav className="flex flex-col items-center space-y-8">
            {navLinks.map(({ name, link }) => (
              <RouterLink key={name} to={link} className="text-yellow-500 text-2xl font-bold hover:text-yellow-400" onClick={() => handleLinkClick(true)}>
                {name}
              </RouterLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavBar;