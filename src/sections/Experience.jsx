import React from 'react'; // <--- AÑADE ESTA LÍNEA
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
// Asegúrate que la ruta de importación sea correcta
import { expCards, expCards2 } from "../constants"; 
import TitleHeader from "../components/TitleHeader";

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  const container = useRef(null);

  useGSAP(
    () => {
      // --- Tu código GSAP existente (SIN CAMBIOS) ---
      const contentEl = container.current;

      gsap.utils.toArray(".timeline-card").forEach((card) => {
        const isLeftCard = card.classList.contains("card-left");
        gsap.from(card, {
          xPercent: isLeftCard ? -100 : 100,
          opacity: 0,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
      });

      if (contentEl) {
        gsap.fromTo(
          ".timeline",
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: "top top",
            ease: "none",
            scrollTrigger: {
              trigger: contentEl,
              start: "top center",
              end: () => `bottom bottom-=${contentEl.offsetHeight * 0.1}`,
              scrub: true,
            },
          }
        );
      }

      gsap.utils.toArray(".expText-content").forEach((textContainer) => {
        gsap.from(textContainer, {
          opacity: 0,
          y: 40,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: textContainer.closest(".exp-card-wrapper"),
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });

       // Animación para el contenedor del icono (antes .timeline-logo img)
       // Cambiamos el selector para que apunte al contenedor del icono
       gsap.utils.toArray(".timeline-logo").forEach((logoContainer) => {
         gsap.from(logoContainer.children[0], { // Apuntamos al icono dentro del div
           opacity: 0,
           scale: 0.2,
           rotate: -45,
           duration: 0.8,
           ease: "expo.out",
           scrollTrigger: {
             trigger: logoContainer, // El trigger sigue siendo el contenedor
             start: "top center+=30",
             end: "bottom center-=30",
             toggleActions: "play none none reverse",
           },
         });
       });
      // --- Fin de tu código GSAP ---
    },
    { scope: container }
  );

  return (
    <section
      id="experience"
      className="flex-center md:mt-20 mt-10 section-padding xl:px-0 overflow-hidden bg-gradient-to-b from-black via-gray-950 to-black"
    >
      <div className="w-full h-full md:px-10 lg:px-20 px-5">
        <TitleHeader
          title="El Viaje Hacia el Éxtasis"
          sub="✨ Despierta Tus Sentidos Más Profundos" // Subtítulo ajustado
        />

        <div
          ref={container}
          id="experience-content"
          className="mt-14 relative flex flex-col xl:flex-row xl:justify-between xl:gap-20"
        >
          {/* --- Columna Izquierda --- */}
          <div className="xl:w-5/12 relative z-10 space-y-16 xl:space-y-24 xl:order-1 order-2 pt-10 xl:pt-0">
            {expCards.map((card) => (
              <div
                key={card.title}
                className={`exp-card-wrapper timeline-card card-left flex justify-end`}
              >
                <div className={`expText flex flex-row-reverse text-right xl:gap-10 md:gap-8 gap-5 relative z-20 w-full max-w-md
                                 p-6 rounded-lg bg-gradient-to-br ${card.bgColor || 'from-zinc-900 to-black'}
                                 border border-transparent hover:border-white/20 transition-colors duration-300`}
                >
                  {/* Contenedor del icono */}
                  <div className="timeline-logo flex-shrink-0 w-12 h-12 md:w-14 md:h-14 xl:-mr-[6rem] self-center flex items-center justify-center">
                    {/* ** CAMBIO AQUÍ: Renderizar el icono en lugar de la imagen ** */}
                    {React.cloneElement(card.icon, {
                      // Clonamos el icono para añadirle clases
                      className: `w-8 h-8 md:w-10 md:h-10 ${card.accentColor || 'text-amber-400'} filter drop-shadow-[0_0_8px_rgba(252,211,77,0.6)]`, // Ajusta tamaño y aplica color y sombra
                      // Puedes ajustar el tamaño (w- y h-) como necesites
                    })}
                  </div>
                  <div className="flex-grow expText-content">
                    <h3 className={`font-semibold text-xl md:text-2xl mb-3 ${card.accentColor || 'text-amber-400'}`}>
                      {card.title}
                    </h3>
                    <p className="text-sm md:text-base text-white/70 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* --- Línea de Tiempo Central (SIN CAMBIOS) --- */}
          <div className="relative flex-shrink-0 xl:w-auto w-full flex justify-center xl:order-2 order-1 px-5">
            <div className="timeline-wrapper flex flex-col items-center w-full h-full">
              <div className="timeline w-1 bg-gradient-to-b from-amber-300 via-amber-500 to-red-600 origin-top h-full rounded-full shadow-lg shadow-amber-500/30" />
            </div>
          </div>

          {/* --- Columna Derecha --- */}
          <div className="xl:w-5/12 relative z-10 space-y-16 xl:space-y-24 xl:order-3 order-3 pt-10 xl:pt-0">
            {expCards2.map((card) => (
               <div
                key={card.title}
                className={`exp-card-wrapper timeline-card card-right flex justify-start`}
               >
                <div className={`expText flex flex-row text-left xl:gap-10 md:gap-8 gap-5 relative z-20 w-full max-w-md
                                 p-6 rounded-lg bg-gradient-to-bl ${card.bgColor || 'from-zinc-900 to-black'}
                                 border border-transparent hover:border-white/20 transition-colors duration-300`}
                 >
                  {/* Contenedor del icono */}
                  <div className="timeline-logo flex-shrink-0 w-12 h-12 md:w-14 md:h-14 xl:-ml-[6rem] order-first self-center flex items-center justify-center">
                    {/* ** CAMBIO AQUÍ: Renderizar el icono en lugar de la imagen ** */}
                     {React.cloneElement(card.icon, {
                        // Clonamos el icono para añadirle clases
                       className: `w-8 h-8 md:w-10 md:h-10 ${card.accentColor || 'text-amber-400'} filter drop-shadow-[0_0_8px_rgba(252,211,77,0.6)]`, // Ajusta tamaño y aplica color y sombra
                      // Puedes ajustar el tamaño (w- y h-) como necesites
                    })}
                  </div>
                  <div className="flex-grow expText-content">
                    <h3 className={`font-semibold text-xl md:text-2xl mb-3 ${card.accentColor || 'text-amber-400'}`}>
                      {card.title}
                    </h3>
                    <p className="text-sm md:text-base text-white/70 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;