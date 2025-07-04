// TechStack.js con Paleta Azul Eléctrico / Cyan
import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TitleHeader from "../components/TitleHeader";
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

gsap.registerPlugin(ScrollTrigger);

const TechStack = () => {
  const { allProductsWithStock, isLoadingProducts } = useCart();

  const vitaferProducts = allProductsWithStock.filter(p => p.id && (p.category === "Suplementos Energéticos" || p.category === "Suplementos en Sachet" || p.category === "Potenciadores en Shot"));
  const vitaferOffers = allProductsWithStock.filter(p => p.id && p.category === "Mayoreo");

  useEffect(() => {
    if (!isLoadingProducts && allProductsWithStock.length > 0) {
      const floatLayers = gsap.utils.toArray(".card-float-layer");
      if (floatLayers.length === 0) return;
      const fadeIn = gsap.fromTo(floatLayers, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 1, ease: "power2.out", stagger: 0.15, scrollTrigger: { trigger: "#skills", start: "top 70%", once: true } });
      floatLayers.forEach((card, i) => { gsap.set(card, { willChange: "transform" }); const floatAnim = gsap.to(card, { y: "+=20", boxShadow: "0 0 40px rgba(255, 255, 0, 0.1)", duration: 1.8 + Math.random() * 0.4, ease: "sine.inOut", repeat: -1, yoyo: true, delay: i * 0.15, paused: true }); ScrollTrigger.create({ trigger: card, start: "top bottom-=100", end: "bottom top+=100", onEnter: () => floatAnim.play(), onLeave: () => floatAnim.pause(), onEnterBack: () => floatAnim.play(), onLeaveBack: () => floatAnim.pause() }); });
      return () => { fadeIn.kill(); ScrollTrigger.getAll().forEach((st) => st.kill()); gsap.killTweensOf(".card-float-layer"); };
    }
    }, [isLoadingProducts, allProductsWithStock]);

  if (isLoadingProducts) {
    return <div className="min-h-screen flex items-center justify-center bg-black text-white text-xl">Cargando nuestros elixires...</div>;
  }

  return (
    <div className="flex-center section-padding bg-black text-white overflow-hidden py-10">
      <div className="w-full h-full md:px-10 px-5 max-w-7xl mx-auto">

        <div id="skills" className="mb-16 md:mb-20">
          <TitleHeader title="🚀 POTENCIA TUS LÍMITES 🚀" sub="Descubre nuestros elixires más vendidos con envío GRATIS a todo el país. ¡Tu energía no puede esperar!" />

          <div className="text-center mt-8 mb-12 p-5 bg-gradient-to-br from-blue-800 via-black to-blue-900 rounded-3xl shadow-2xl shadow-cyan-500/40 border-4 border-blue-600">
            <p className="text-3xl md:text-5xl font-black text-yellow-300 drop-shadow-lg tracking-wider [text-shadow:_0_4px_8px_rgba(6,182,212,0.8)] animate-bounce">🚚 ¡ENVÍO GRATIS! 🚚</p>
            <p className="text-xl md:text-2xl font-extrabold text-white mt-2">EN TODA LA TIENDA</p>
            <p className="text-2xl md:text-4xl font-bold text-yellow-300 mt-1 drop-shadow-md">¡PIDE HOY!</p>
            <p className="mt-4 text-sm font-medium text-white/80">Aprovecha nuestras ofertas y recibe tus productos con la máxima discreción y rapidez. 🔥</p>
          </div>
          
          <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 md:gap-9">
            {vitaferProducts.map(item => <ProductCard key={item.id} item={item} />)}
          </div>
        </div>

        <div className="mt-16 md:mt-20">
          <TitleHeader title="🛍️ OFERTAS MAYORISTAS: AÚN MÁS BARATO" sub="Precios de demolición para compras por volumen. ¡Destroza a tu competencia!" />
          <div className="grid md:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-6 md:gap-9 mt-12">
            {vitaferOffers.map(item => <ProductCard key={item.id} item={item} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechStack;