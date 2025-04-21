import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import AnimatedCounter from "../components/AnimatedCounter";
import Button from "../components/Button";
import { words } from "../constants";
import HeroExperience from "../components/models/hero_models/HeroExperience";

const Hero = () => {
  useGSAP(() => {
    gsap.fromTo(
      ".hero-text h1",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.2, duration: 1, ease: "power2.inOut" }
    );
    gsap.fromTo(
      ".hero-button",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, delay: 1.5, ease: "power2.inOut" }
    );
  });

  return (
    <section id="hero" className="relative overflow-hidden bg-black">
      <div className="absolute top-0 left-0 z-10">
        <img
          src="/images/bg.png"
          alt="Vitafer background"
          className="filter sepia-100 saturate-300 brightness-150 mix-blend-color-dodge"
        />
      </div>
      <div className="hero-layout flex flex-col md:flex-row items-center justify-between min-h-screen">
        <header className="flex flex-col justify-center md:w-full w-full md:px-20 px-5 py-10">
          <div className="flex flex-col gap-7">
            <div className="hero-text">
              <h1 className="text-yellow-400 md:text-6xl text-4xl font-bold leading-tight">
                Despierta tus sentidos
              </h1>
              <h1 className="text-yellow-400 md:text-6xl text-4xl font-bold leading-tight">
                con el poder de
              </h1>
              <h1 className="text-white md:text-6xl text-4xl font-bold leading-tight">
                Vitafer
                <span className="slide">
                  <span className="wrapper">
                    {words.map((word, index) => (
                      <span
                        key={index}
                        className="flex items-center md:gap-3 gap-1 pb-2 text-yellow-300"
                      >
                        <span>{word.text}</span>
                      </span>
                    ))}
                  </span>
                </span>
              </h1>
            </div>

            <p className="text-gray-200 md:text-2xl text-xl relative z-10 max-w-lg">
              Más energía, más deseo, más confianza. Vitafer es tu aliado
              natural para rendir al máximo cuando más lo necesitas.
            </p>

            <Button
              text="¡Compra Ahora!"
              className="md:w-80 md:h-16 w-60 h-12"
              id="counter"
            />
          </div>
        </header>

        {/* RIGHT: 3D Model or Visual */}
        <figure className="md:w-1/2 w-full h-full">
          <div className="hero-3d-layout">
            <HeroExperience />
          </div>
        </figure>
      </div>

      <AnimatedCounter />
    </section>
  );
};

export default Hero;
