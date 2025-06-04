import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TitleHeader from "../components/TitleHeader";
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
// No necesitas importar fatherDayPromos aquí, vendrán de allProductsWithStock

gsap.registerPlugin(ScrollTrigger);

const TechStack = () => {
  const { allProductsWithStock, isLoadingProducts } = useCart();

  const vitaferProducts = allProductsWithStock.filter(p => p.id && p.category === "Suplementos Energéticos" || p.category === "Suplementos en Sachet" || p.category === "Potenciadores en Shot");
  const vitaferOffers = allProductsWithStock.filter(p => p.id && p.category === "Mayoreo");
  const fatherDayPromosFromContext = allProductsWithStock.filter(p => p.id && p.category === "Promociones Papá");


  useEffect(() => {
    if (!isLoadingProducts && allProductsWithStock.length > 0) {
      const floatLayers = gsap.utils.toArray(".card-float-layer");
      if (floatLayers.length === 0) return;
      const fadeIn = gsap.fromTo(floatLayers, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 1, ease: "power2.out", stagger: 0.15, scrollTrigger: { trigger: "#skills", start: "top 70%", once: true } });
      floatLayers.forEach((card, i) => { gsap.set(card, { willChange: "transform" }); const floatAnim = gsap.to(card, { y: "+=20", boxShadow: "0 0 40px rgba(255, 255, 0, 0.1)", duration: 1.8 + Math.random() * 0.4, ease: "sine.inOut", repeat: -1, yoyo: true, delay: i * 0.15, paused: true }); ScrollTrigger.create({ trigger: card, start: "top bottom-=100", end: "bottom top+=100", onEnter: () => floatAnim.play(), onLeave: () => floatAnim.pause(), onEnterBack: () => floatAnim.play(), onLeaveBack: () => floatAnim.pause() }); });
      return () => { fadeIn.kill(); ScrollTrigger.getAll().forEach((st) => st.kill()); gsap.killTweensOf(".card-float-layer"); };
    }
  }, [isLoadingProducts, allProductsWithStock]);

  const today = new Date();
  const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const promoDateString = `${days[today.getDay()]} ${today.getDate()} de ${months[today.getMonth()]}`;

  if (isLoadingProducts) {
    return <div className="min-h-screen flex items-center justify-center bg-black text-white text-xl">Cargando nuestros elixires...</div>;
  }

  return (
    <div className="flex-center section-padding bg-black text-white overflow-hidden py-10">
      <div className="w-full h-full md:px-10 px-5 max-w-7xl mx-auto">

        {/* SECCIÓN DE PRODUCTOS REGULARES */}
        <div id="skills" className="mb-16 md:mb-20"> {/* ID para el anclaje del Navbar */}
          {/*           <TitleHeader title="🔥 ¡Potencia tu Deseo!" sub="Elige el paquete ideal para llevar tu energía al máximo 🥵💥" />
          <div className="text-center mt-6 p-3 bg-gradient-to-r from-yellow-800 via-yellow-600 to-orange-600 rounded-2xl shadow-lg border-2 border-yellow-400/40">
            <p className="text-lg md:text-xl font-extrabold text-white drop-shadow-lg mb-1 animate-bounce">🚨 ¡OFERTA FLASH SÓLO HOY!</p>
            <p className="text-sm md:text-base font-semibold text-yellow-400 dark:text-yellow-200 mb-2 drop-shadow-sm">¡Pide este <strong className="underline">{promoDateString}</strong> y aprovecha!</p>
            <ul className="list-none space-y-0.5 text-sm text-white/95"><li className="font-bold">✅ 🚚 ¡ENVÍO TOTALMENTE GRATIS A TODO MEXICO!</li></ul>
            <p className="mt-3 text-xs font-medium text-white/90">¡Date prisa, que la pasión no espera! 🔥</p>
          </div> */}

          {/* SECCIÓN DE PROMOCIONES DEL DÍA DEL PADRE (NUEVA) */}
          <div id="promo-papa" className="mb-16 md:mb-20"> {/* ID para el anclaje del Navbar */}
            <TitleHeader
              title="👨‍👧‍👦 ¡Regalos Únicos para Papá!"
              sub="Este Mes del Padre, sorpréndelo con energía y vitalidad. ¡Packs exclusivos!"
            />
            <div className="text-center mt-6 mb-10 p-4 bg-gradient-to-r from-blue-800 via-indigo-700 to-purple-800 rounded-2xl shadow-xl border-2 border-sky-400/50">
              <p className="text-xl md:text-2xl font-extrabold text-white drop-shadow-lg animate-pulse">👔 ¡ESPECIAL DÍA DEL PADRE!</p>
              <p className="text-md md:text-lg font-semibold text-sky-200 mt-1">Descuentos en nuestros packs más potentes para celebrar al rey.</p>
              <ul className="list-none space-y-0.5 text-sm text-white/95"><li className="font-bold">✅ 🚚 ¡ENVÍO TOTALMENTE GRATIS A TODO MEXICO!</li></ul>
            </div>
            <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 md:gap-9">
              {fatherDayPromosFromContext.map(item => <ProductCard key={item.id} item={item} />)}
            </div>
          </div>

          <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 md:gap-9 mt-12">
            {vitaferProducts.map(item => <ProductCard key={item.id} item={item} />)}
          </div>
        </div>

        {/* SECCIÓN DE OFERTAS AL POR MAYOR */}
        <div className="mt-16 md:mt-20">
          <TitleHeader title="🛍️ Ofertas al Por Mayor" sub="Precios especiales para compras en volumen. ¡Ideal para revendedores!" />
          <div className="grid md:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-6 md:gap-9 mt-12">
            {vitaferOffers.map(item => <ProductCard key={item.id} item={item} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechStack;