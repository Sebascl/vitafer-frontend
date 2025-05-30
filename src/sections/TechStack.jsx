// src/sections/TechStack.jsx
import React, { useEffect } from "react";
// import { Link } from 'react-router-dom'; // Link ahora está en ProductCard
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TitleHeader from "../components/TitleHeader";
import { vitaferProducts, vitaferOffers } from "../constants"; 
// import { useCart } from '../context/CartContext'; // Las funciones del carrito ahora se usan en ProductCard
import ProductCard from '../components/ProductCard'; // <-- IMPORTA ProductCard

gsap.registerPlugin(ScrollTrigger);

const TechStack = () => {
  // const { formatMXN, getNumericPrice } = useCart(); // Ya no se necesita aquí directamente

  useEffect(() => {
    const floatLayers = gsap.utils.toArray(".card-float-layer"); // Esta clase está en ProductCard ahora
    const fadeIn = gsap.fromTo(
        floatLayers, { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out", stagger: 0.15, scrollTrigger: { trigger: "#skills", start: "top 70%", once: true } }
    );
    floatLayers.forEach((card, i) => {
        gsap.set(card, { willChange: "transform" });
        const floatAnim = gsap.to(card, { y: "+=20", boxShadow: "0 0 40px rgba(255, 255, 0, 0.1)", duration: 1.8 + Math.random() * 0.4, ease: "sine.inOut", repeat: -1, yoyo: true, delay: i * 0.15, paused: true });
        ScrollTrigger.create({ trigger: card, start: "top bottom-=100", end: "bottom top+=100", onEnter: () => floatAnim.play(), onLeave: () => floatAnim.pause(), onEnterBack: () => floatAnim.play(), onLeaveBack: () => floatAnim.pause() });
    });
    return () => {
        fadeIn.kill();
        ScrollTrigger.getAll().forEach((st) => st.kill());
        gsap.killTweensOf(".card-float-layer");
    };
  }, []);

  const today = new Date();
  const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const promoDateString = `${days[today.getDay()]} ${today.getDate()} de ${months[today.getMonth()]}`;


  return (
    <div id="skills" className="flex-center section-padding bg-black text-white overflow-hidden py-10">
      <div className="w-full h-full md:px-10 px-5 max-w-7xl mx-auto">
        <TitleHeader title="🔥 ¡Potencia tu Deseo!" sub="Elige el paquete ideal para llevar tu energía al máximo 🥵💥"/>
         <div className="text-center mt-6 p-3 bg-gradient-to-r from-yellow-800 via-yellow-600 to-orange-600 rounded-2xl shadow-lg border-2 border-yellow-400/40">
           <p className="text-lg md:text-xl font-extrabold text-white drop-shadow-lg mb-1 animate-bounce">🚨 ¡OFERTA FLASH SÓLO HOY!</p>
           <p className="text-sm md:text-base font-semibold text-yellow-400 dark:text-yellow-200 mb-2 drop-shadow-sm">¡Pide este <strong className="underline">{promoDateString}</strong> y aprovecha!</p>
           <ul className="list-none space-y-0.5 text-sm text-white/95"><li className="font-bold">✅ 🚚 ¡ENVÍO TOTALMENTE GRATIS A TODO MEXICO!</li></ul>
           <p className="mt-3 text-xs font-medium text-white/90">¡Date prisa, que la pasión no espera! 🔥</p>
        </div>

        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 md:gap-9 mt-12">
          {vitaferProducts.map(item => <ProductCard key={item.name} item={item} />)}
        </div>

        <div className="mt-16 md:mt-20">
          <TitleHeader title="🛍️ Ofertas al Por Mayor" sub="Precios especiales para compras en volumen. ¡Ideal para revendedores!"/>
          <div className="grid md:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-6 md:gap-9 mt-12">
            {vitaferOffers.map(item => <ProductCard key={item.name} item={item} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechStack;