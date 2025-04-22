import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const AppShowcase = () => {
  const sectionRef = useRef(null);
  const rydeRef = useRef(null);
  const libraryRef = useRef(null);
  const ycDirectoryRef = useRef(null);

  useGSAP(() => {
    // Animation for the main section
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.5 }
    );

    // Animations for each app showcase
    const cards = [rydeRef.current, libraryRef.current, ycDirectoryRef.current];

    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.3 * (index + 1),
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
          },
        }
      );
    });
  }, []);

  return (
    <div
      id="work"
      ref={sectionRef}
      className="app-showcase bg-black text-white py-16"
    >
      <div className="w-full">
        <div className="showcaselayout">
          {/* Primera Sección: Vitafer */}
          <div
            ref={rydeRef}
            className="first-project-wrapper flex flex-col md:flex-row items-center gap-8"
          >
            <div className="image-wrapper max-w-md">
              <img
                src="/images/vitafer-showcase.png"
                alt="Vitafer Performance"
                className="rounded-xl shadow-lg border-4 border-red-600"
              />
            </div>
            <div className="text-content max-w-xl">
              <h2 className="text-3xl md:text-4xl font-bold text-red-500">
                Potencia Masculina al Máximo con{" "}
                <span className="text-yellow-400">Vitafer Gold</span>
              </h2>
              <p className="text-white/80 text-lg mt-4">
                Descubre el secreto de las noches más intensas. Vitafer estimula
                tu deseo, tu resistencia y tu confianza como nunca antes.
              </p>
            </div>
          </div>

          {/* Otras Secciones - puedes convertirlas en beneficios */}
          <div className="project-list-wrapper overflow-hidden grid md:grid-cols-2 gap-8 mt-20">
            {/* Beneficio 1 */}
            <div className="project" ref={libraryRef}>
              <div className="image-wrapper bg-[#FFEEF0] p-4 rounded-xl shadow-md">
                <img
                  src="/images/benefit1.png"
                  alt="Energía sin límites"
                  className="rounded-lg"
                />
              </div>
              <h2 className="text-2xl font-semibold text-center mt-4 text-white">
                Energía que Dura Toda la Noche
              </h2>
            </div>

            {/* Beneficio 2 */}
            <div className="project" ref={ycDirectoryRef}>
              <div className="image-wrapper bg-[#FFF3E6] p-4 rounded-xl shadow-md">
                <img
                  src="/images/benefit2.png"
                  alt="Confianza total"
                  className="rounded-lg"
                />
              </div>
              <h2 className="text-2xl font-semibold text-center mt-4 text-white">
                Confianza y Potencia en Cada Encuentro
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppShowcase;
