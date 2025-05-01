import React from 'react';
import { CartProvider, useCart } from './context/CartContext'; // Asegúrate que la ruta sea correcta

import Testimonials from "./sections/Testimonials";
import Footer from "./sections/Footer";
import Contact from "./sections/Contact";
import TechStack from "./sections/TechStack";
import Experience from "./sections/Experience";
import Hero from "./sections/Hero";
import ShowcaseSection from "./sections/ShowcaseSection";
import LogoShowcase from "./sections/LogoShowcase";
import FeatureCards from "./sections/FeatureCards";
import NavBar from "./components/NavBar"; // Corregido el nombre si era Navbar
import AnimatedCounter from "./components/AnimatedCounter";
import ShoppingCart from './components/ShoppingCart'; // Importa el carrito

function AppContent() {
  const { isCartOpen } = useCart(); // Obtiene el estado de visibilidad del carrito

  return (
    <>
      <NavBar />
      <main> {/* Envuelve el contenido principal si quieres */}
        <Hero />
        <ShowcaseSection />
        <Experience />
        <TechStack />
        <Testimonials />
        <AnimatedCounter />
        <Contact />
      </main>
      <Footer />

      {isCartOpen && <ShoppingCart />}
    </>
  );
}

const App = () => (
  <CartProvider>
    <AppContent />
  </CartProvider>
);

export default App;