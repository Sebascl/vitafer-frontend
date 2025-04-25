import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { testimonials } from "../constants";
import GlowCardSensual from "../components/GlowCard";

gsap.registerPlugin(ScrollTrigger);

const TestimonialsSensual = () => {
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
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
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
        { opacity: 0, y: 50, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: 0.2 + index * 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            once: true,
          },
        }
      );
    });
  }, { scope: sectionRef, dependencies: [testimonials] });


  return (
    <section
      id="experiencias"
      ref={sectionRef}
      className="bg-gradient-to-b from-black via-amber-950/20 to-black text-white py-10 px-6 md:px-10 lg:px-16 mt-15"
    >
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4 drop-shadow-[0_2px_5px_rgba(251,146,60,0.3)]">
            Escucha lo que <span className="text-amber-400 italic">Despierta</span> en Otros
          </h2>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Historias reales de pasión redescubierta y confianza renovada.
            <br className="hidden sm:block" />
            Descubre cómo <strong className="text-amber-300 font-semibold">Vitafer Gold</strong> ha transformado momentos íntimos.
          </p>
        </div>

        <div className="lg:columns-3 md:columns-2 columns-1 lg:gap-8 md:gap-6 gap-5">
          {testimonials.map((testimonial, index) => (
            <GlowCardSensual
              key={testimonial.id || index}
              card={testimonial}
              index={index}
              ref={addToRefs}
            >
              <div className="flex items-center gap-4 mt-6 pt-6 border-t border-white/10">
                {testimonial.imgPath ? (
                   <img
                     src={testimonial.imgPath}
                     alt={`Testimonio de ${testimonial.name}`}
                     className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/50 flex-shrink-0"
                     loading="lazy"
                   />
                 ) : (
                   <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500/30 to-amber-600/30 flex-shrink-0 border-2 border-amber-500/50"></div>
                 )}
                <div>
                  <p className="font-semibold text-amber-300 text-base leading-tight">{testimonial.name}</p>
                  <p className="text-sm text-white/60 mt-1">{testimonial.mentions}</p>
                </div>
              </div>
            </GlowCardSensual>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSensual;