import React from 'react';
import Hero from "../sections/Hero";
import TechStack from '../sections/TechStack'; // Importa la sección de productos

const HomePage = () => {
  return (
    <>
      <Hero />
      <TechStack /> {/* Muestra todos los productos directamente en la Home */}
    </>
  );
};

export default HomePage;