import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const AppShowcase = () => {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);

  const cardsData = [
    {
      image: "/images/couple-energy.jpg",
      alt: "Noches de pasión intensa con Vitafer",
      title: "Placer Sin Límites, Noches Eternas",
      description: "Desata una energía que sorprende y redescubre la intensidad en cada caricia.",
      bg: "from-zinc-900 via-red-950/40 to-black",
      glow: "hover:shadow-[0_0_25px_8px_rgba(251,146,60,0.3)]",
      accentColor: "text-orange-400",
    },
    {
      image: "/images/couple-connection.jpg",
      alt: "Confianza y conexión total con Vitafer",
      title: "Confianza Irresistible, Conexión Total",
      description: "Siente la seguridad que enciende la atracción y fortalece la intimidad.",
      bg: "from-black via-purple-950/30 to-zinc-900",
      glow: "hover:shadow-[0_0_25px_8px_rgba(252,211,77,0.3)]",
      accentColor: "text-amber-400",
    },
  ];


  useGSAP(() => {
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" }
    );

    cardRefs.current.forEach((card, index) => {
      gsap.fromTo(
        card,
        { y: 80, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          delay: 0.4 + (0.3 * index),
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            once: true,
          },
          ease: "expo.out",
        }
      );
    });
  }, []);

  return (
    <section
        id="vitalidad"
      ref={sectionRef}
      className="bg-gradient-to-b from-black via-red-950/10 to-black text-white py-15 px-6 md:px-16 lg:px-24"
    >
      <div className="max-w-6xl mx-auto text-center mb-20">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-white drop-shadow-[0_3px_8px_rgba(252,211,77,0.3)]">
          Despierta el Deseo. Redescubre la{' '}
          <span className="text-amber-400 font-extrabold italic drop-shadow-[0_0_15px_rgba(252,211,77,0.5)]">
            Pasión.
          </span>
        </h2>
        <p className="mt-8 text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
          Noches inolvidables, conexión profunda. <strong className="text-amber-300 font-semibold">Vitafer Gold</strong> te da el vigor que transforma tus momentos íntimos. Para ti, para ambos.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-16">
        {cardsData.map((card, index) => (
          <div
            key={index}
            ref={(el) => (cardRefs.current[index] = el)}
            // Añadido overflow-hidden para contener la imagen con object-cover
            className={`rounded-2xl p-8 md:p-10 shadow-xl bg-gradient-to-br ${card.bg}
                        transition-all duration-500 ease-out transform hover:scale-[1.03] ${card.glow}
                        border border-white/10 hover:border-amber-400/50 overflow-hidden`}
          >
            {/* --- INICIO CAMBIOS EN LA IMAGEN --- */}
            <img
              src={card.image}
              alt={card.alt}
              // Clases modificadas: w-full, altura aumentada, object-cover, rounded-lg
              className="w-full h-72 md:h-80 lg:h-96 object-cover rounded-lg mb-8 drop-shadow-[0_5px_15px_rgba(0,0,0,0.4)]"
              // Nota: Ajusta los valores de h- (ej: lg:h-96) según necesites más o menos altura
            />
            {/* --- FIN CAMBIOS EN LA IMAGEN --- */}

            <h3 className={`text-2xl md:text-3xl font-semibold text-center mb-4 ${card.accentColor} drop-shadow-[0_1px_5px_rgba(0,0,0,0.5)]`}>
              {card.title}
            </h3>
            <p className="text-center text-white/70 text-base md:text-lg leading-relaxed">
                {card.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AppShowcase;