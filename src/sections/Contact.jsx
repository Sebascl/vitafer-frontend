import React, { useRef } from 'react';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaWhatsapp } from 'react-icons/fa';

import TitleHeader from "../components/TitleHeader";

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const contactCardRef = useRef(null);

  const whatsappNumber = "528123877607";
  const defaultMessage = "Hola! 🔥 Quiero saber más sobre Vitafer.";
  const encodedMessage = encodeURIComponent(defaultMessage);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

  useGSAP(() => {
    if (contactCardRef.current) {
      gsap.from(contactCardRef.current, {
        opacity: 0,
        y: 60,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: contactCardRef.current,
          start: "top 90%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });
    }
  }, { scope: contactCardRef });

  return (
    <section
      id="contact"
      className="flex-center md:mt-20 mt-10 section-padding xl:px-0 overflow-hidden bg-gradient-to-b from-black via-gray-950 to-black"
    >
      <div className="w-full h-full md:px-10 lg:px-20 px-5">
        <TitleHeader
          title="¿Sientes la Curiosidad?"
          sub="✨ Tu viaje hacia el placer comienza con un mensaje. Hablemos discretamente."
        />

        <div className="flex justify-center mt-16 md:mt-24">
          {/* Outer div for gradient border and shadow */}
          <div
            ref={contactCardRef}
            className="w-full max-w-lg p-1 rounded-xl bg-gradient-to-br from-amber-400 via-red-500 to-amber-500 shadow-2xl shadow-amber-500/30 hover:shadow-amber-400/40 transition-shadow duration-400 ease-out hover:scale-[1.02] transform"
          >
            {/* Inner div for content background */}
            <div className="h-full w-full p-8 md:p-10 rounded-[10px] bg-gradient-to-br from-zinc-900 via-black to-black">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 text-center font-semibold text-lg md:text-xl lg:text-2xl text-amber-400 hover:text-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-black rounded-lg transition-all duration-300 py-4 px-6 group transform hover:scale-[1.03]"
                aria-label="Iniciar chat en WhatsApp sobre Vitafer"
              >
                <FaWhatsapp className="w-6 h-6 lg:w-7 lg:h-7 group-hover:scale-110 transition-transform duration-300" />
                <span>Chatea Ahora y Enciende la Llama</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;