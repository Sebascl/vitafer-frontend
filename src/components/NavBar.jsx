import { useState, useEffect } from "react";

import { navLinks } from "../constants";

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
