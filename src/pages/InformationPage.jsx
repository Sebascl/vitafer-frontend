import React, { useEffect } from 'react';
import Experience from '../sections/Experience';
import Testimonials from '../sections/Testimonials';
import Contact from '../sections/Contact';

const InformationPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Asegura que la página inicie arriba
  }, []);

  return (
    <div className="pt-24 md:pt-28 bg-black">
      <Experience />
      <Testimonials />
      <Contact />
    </div>
  );
};

export default InformationPage;