import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const FloatingWhatsAppButton = () => {
    const whatsappNumber = "528123877607";
  const prefilledMessage = encodeURIComponent("Hola! Estoy interesado(a) en los productos Vitafer y me gustaría más información.");

  if (!whatsappNumber) {
    return null; // No renderizar el botón si el número no está configurado
  }

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${prefilledMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-5 right-5 z-30 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg flex items-center justify-center transform transition-transform duration-300 ease-in-out hover:scale-110"
    >
      <FaWhatsapp size={28} />
    </a>
  );
};

export default FloatingWhatsAppButton;