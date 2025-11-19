import React, { useEffect } from 'react';
import Experience from '../sections/Experience';
import Testimonials from '../sections/Testimonials';
import Contact from '../sections/Contact';

const InformationPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 bg-black">
      <Experience />
      <Testimonials />
      <Contact />
    </div>
  );
};

export default InformationPage;