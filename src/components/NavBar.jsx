import { useState, useEffect } from "react";
import { navLinks } from "../constants";

// Función para manejar el clic en los enlaces
const handleLinkClick = (e, link) => {
  e.preventDefault(); // Previene el comportamiento por defecto

  const targetElement = document.querySelector(link);
  const offsetTop = targetElement.offsetTop - 120; // Ajusta 80px según la altura de tu navbar

  window.scrollTo({
    top: offsetTop,
    behavior: "smooth",
  });
};

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-black shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <a href="#hero" className="flex items-center">
          <img
            src="/images/vitafer-logo.png"
            alt="Vitafer Logo"
            className="h-20 w-auto"
          />
        </a>

        {/* Links */}
        <nav className="hidden md:flex space-x-8">
          {navLinks.map(({ name, link }) => (
            <a
              key={name}
              href={link}
              className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors"
              onClick={(e) => handleLinkClick(e, link)} // Llamar a handleLinkClick con el enlace correspondiente
            >
              {name}
            </a>
          ))}
        </nav>

        {/* CTA Button */}
        <a
          href="#contact"
          className="hidden md:inline-block bg-yellow-400 text-black px-6 py-3 rounded-full hover:bg-yellow-300 transition-all duration-300 shadow-lg hover:shadow-yellow-500/50 transform hover:scale-105"
        >
          Siente el poder de Vitafer
        </a>
      </div>
    </header>
  );
};

export default NavBar;
