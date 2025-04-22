import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TitleHeader from "../components/TitleHeader";
import { techStackIcons } from "../constants";

gsap.registerPlugin(ScrollTrigger);

const TechStack = () => {
  useEffect(() => {
    const floatLayers = gsap.utils.toArray(".card-float-layer");

    const fadeIn = gsap.fromTo(
      floatLayers,
      { opacity: 0, y: -20 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: "#skills",
          start: "top center",
          once: true,
        },
      }
    );

    floatLayers.forEach((card, i) => {
      gsap.set(card, { willChange: "transform" });

      const floatAnim = gsap.to(card, {
        y: "+=30",
        boxShadow: "0 0 50px rgba(255, 255, 0, 0.15)",
        duration: 1.5 + Math.random() * 0.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: i * 0.2,
        paused: true,
      });

      ScrollTrigger.create({
        trigger: "#skills",
        start: "top center",
        onEnter: () => floatAnim.play(),
        onLeave: () => floatAnim.pause(),
        onEnterBack: () => floatAnim.play(),
        onLeaveBack: () => floatAnim.pause(),
      });
    });

    return () => {
      fadeIn.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div
      id="skills"
      className="flex-center section-padding bg-black text-white"
    >
      <div className="w-full h-full md:px-10 px-5 max-w-7xl mx-auto">
        <TitleHeader
          title="🔥 ¡Potencia tu Deseo!"
          sub="Elige el paquete ideal para llevar tu energía al máximo 🥵💥"
        />
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-9 mt-12">
          {techStackIcons.map((item) => (
            <div key={item.name} className="tech-card">
              <div className="card-float-layer bg-gradient-to-br from-yellow-400/10 to-pink-500/10 backdrop-blur-xl p-6 rounded-3xl border border-yellow-400/30 shadow-2xl hover:scale-105 transition-transform duration-300">
                <div className="mb-5 flex justify-center items-center w-full h-48 md:h-56 lg:h-64 rounded-xl overflow-hidden bg-black/60 border border-yellow-400/30 shadow-inner">
                  <img
                    src={item.modelPath}
                    alt={item.name}
                    className="object-contain h-full"
                  />
                </div>

                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold text-yellow-300 drop-shadow-md">
                    {item.name}
                  </h3>
                  <p className="text-sm text-pink-100 italic leading-relaxed">
                    {item.description}
                  </p>
                  <p className="text-base text-white/80 font-medium">
                    {item.presentation}
                  </p>
                  <p className="text-2xl font-extrabold text-white mt-1">
                    {item.price}
                  </p>
                  <a
                    href={`https://wa.me/528123877607?text=Hola,%20estoy%20interesado%20en%20${encodeURIComponent(item.name)}%20🔥`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-full font-semibold tracking-wide shadow-lg transition-all"
                  >
                    ¡Lo quiero! 💘
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechStack;
