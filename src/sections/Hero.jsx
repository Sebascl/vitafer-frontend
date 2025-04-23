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
      {/* Background image */}
      <div className="absolute top-0 left-0 z-10">
        <img
          src="/images/bg.png"
          alt="Vitafer background"
          className="w-full h-full object-cover filter sepia-100 saturate-300 brightness-150 mix-blend-color-dodge"
        />
      </div>

      {/* Content layout */}
      <div className="hero-layout flex flex-col md:flex-row items-center justify-between relative z-10 w-full px-4">
        {/* Left: Header */}
        <header className="hero-header">
          <div className="flex flex-col gap-7">
            <div className="hero-text">
              <h1 className="text-yellow-400 md:text-6xl text-4xl font-bold leading-tight">
                Despierta tus sentidos
              </h1>
              <h1 className="text-yellow-400 md:text-6xl text-4xl font-bold leading-tight">
                con el poder de
              </h1>
              <h1 className="text-white md:text-6xl text-4xl font-bold leading-tight">
                Vitafer{" "}
                <span className="slide">
                  <span className="wrapper">
                    {words.map((word, index) => (
                      <span
                        key={index}
                        className="inline-block md:mx-2 mx-1 pb-1 text-yellow-300"
                      >
                        {word.text}
                      </span>
                    ))}
                  </span>
                </span>
              </h1>
            </div>

            <p className="text-gray-200 md:text-2xl text-xl max-w-3xl">
              Más energía, más deseo, más confianza. Vitafer es tu aliado
              natural para rendir al máximo cuando más lo necesitas.
            </p>

            <Button
              text="¡Compra Ahora!"
              className="md:w-80 md:h-16 w-80 h-12 hero-button"
              id="counter"
            />
          </div>
        </header>

        {/* Right: 3D model */}
        <figure className="hero-figure">
          <div className="hero-3d-layout">
            <HeroExperience />
          </div>
        </figure>
      </div>

    </section>
  );
};

export default Hero;
