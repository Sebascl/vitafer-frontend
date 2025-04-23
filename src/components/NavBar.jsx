import { useState, useEffect } from "react";
import { navLinks } from "../constants";
import { Menu, X } from "lucide-react";

const handleLinkClick = (e, link, setMenuOpen) => {
  e.preventDefault();
  const targetElement = document.querySelector(link);
  if (targetElement) {
    const offsetTop = targetElement.offsetTop - 100; // Adjusted offset
    window.scrollTo({ top: offsetTop, behavior: "smooth" });
  }
  setMenuOpen(false);
  document.body.style.overflow = "auto";
};

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ease-in-out ${
        scrolled
          ? "bg-black/80 backdrop-blur-md shadow-lg border-b border-amber-500/30"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <a href="#hero" className="flex items-center flex-shrink-0 group">
          <img
            src="/images/vitafer-logo.png"
            alt="Vitafer Logo"
            className="h-20 w-50 transition-opacity duration-300 group-hover:opacity-90"
          />
        </a>

        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
        {navLinks.map(({ name, link }) => (
            <a
              key={name}
              href={link}
              className="text-yellow-500 hover:text-yellow-400 font-semibold transition-colors"
              onClick={(e) => handleLinkClick(e, link, setMenuOpen)}
            >
              {name}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="hidden md:inline-block bg-yellow-500 text-black px-6 py-3 rounded-full hover:bg-yellow-600 transition-all duration-300 shadow-lg hover:shadow-yellow-500/50 transform hover:scale-105 font-semibold"
        >
          Siente el poder de Vitafer
        </a>

        <button
          className="md:hidden text-amber-400 focus:outline-none hover:text-amber-300 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

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
              onClick={() => {
                setMenuOpen(false);
                document.body.style.overflow = "auto";
              }}
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