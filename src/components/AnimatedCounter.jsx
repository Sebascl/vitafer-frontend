import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger"; // Importar desde aquí es común

import { counterItems } from "../constants"; // Asegúrate que la ruta sea correcta y los datos sean evocadores

gsap.registerPlugin(ScrollTrigger);

const AnimatedCounterSensual = () => {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);
  cardRefs.current = [];

  const addToRefs = (el) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  };

  useGSAP(() => {
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          once: true,
        },
      }
    );

    cardRefs.current.forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: 0.1 + index * 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            once: true, 
          },
        }
      );

      const numberElement = card.querySelector(".counter-number");
      const item = counterItems[index];

      gsap.set(numberElement, { innerText: 0 });

      gsap.to(numberElement, {
        innerText: item.value,
        duration: 2.5,
        ease: "power3.out",
        snap: { innerText: 1 },
        scrollTrigger: {
          trigger: card,
          start: "top 75%",
          once: true, 
        },
        onUpdate: function() {
        },
        onComplete: () => {
          numberElement.textContent = `${item.value}${item.suffix}`;
        },
      });
    });
  }, { scope: sectionRef, dependencies: [counterItems] });
  return (
    <section
      ref={sectionRef}
      id="resultados-pasion" 
      className="bg-gradient-to-b from-black via-zinc-950/60 to-black py-20 md:py-28 px-4 md:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-white mb-4 drop-shadow-[0_2px_5px_rgba(251,191,36,0.3)]">
            Resultados que <span className="text-amber-400 italic font-bold">Sientes</span>
          </h2>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            La confianza y la satisfacción hablan por sí solas. Únete a miles que han redescubierto la intensidad.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {counterItems.map((item, index) => (
            <div
              key={item.label || index}
              ref={addToRefs}
              className="bg-gradient-to-br from-zinc-900 via-black/40 to-zinc-950 rounded-2xl p-6 md:p-8
                         border border-amber-500/20 hover:border-amber-400/60
                         shadow-lg hover:shadow-[0_0_25px_5px_rgba(251,191,36,0.20)]
                         flex flex-col items-center justify-center text-center
                         transition-all duration-300 ease-out transform hover:scale-[1.03]"
            >
              <div className="counter-number text-5xl md:text-6xl font-bold text-amber-300 mb-3 tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                0{item.suffix}
              </div>
              <div className="text-white/70 text-base md:text-lg font-medium leading-tight">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnimatedCounterSensual;