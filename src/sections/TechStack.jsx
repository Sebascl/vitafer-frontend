import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TitleHeader from "../components/TitleHeader";
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

gsap.registerPlugin(ScrollTrigger);

const TechStack = () => {
  const { allProductsWithStock, isLoadingProducts } = useCart();

  const promoProducts = allProductsWithStock.filter(p => p.isPromo);
  const regularProducts = allProductsWithStock.filter(p => !p.isPromo && p.id && (p.category === "Suplementos Energéticos" || p.category === "Suplementos en Sachet" || p.category === "Potenciadores en Shot"));
  const vitaferOffers = allProductsWithStock.filter(p => p.id && p.category === "Mayoreo");

  useEffect(() => {
    if (!isLoadingProducts && allProductsWithStock.length > 0) {
      const floatLayers = gsap.utils.toArray(".card-float-layer");
      if (floatLayers.length === 0) return;
      const fadeIn = gsap.fromTo(floatLayers, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 1, ease: "power2.out", stagger: 0.1, scrollTrigger: { trigger: "#promociones", start: "top 70%", once: true } });
      floatLayers.forEach((card, i) => { gsap.set(card, { willChange: "transform" }); const floatAnim = gsap.to(card, { y: "+=20", boxShadow: "0 0 40px rgba(255, 255, 0, 0.1)", duration: 1.8 + Math.random() * 0.4, ease: "sine.inOut", repeat: -1, yoyo: true, delay: i * 0.1, paused: true }); ScrollTrigger.create({ trigger: card, start: "top bottom-=100", end: "bottom top+=100", onEnter: () => floatAnim.play(), onLeave: () => floatAnim.pause(), onEnterBack: () => floatAnim.play(), onLeaveBack: () => floatAnim.pause() }); });
      return () => { fadeIn.kill(); ScrollTrigger.getAll().forEach((st) => st.kill()); gsap.killTweensOf(".card-float-layer"); };
    }
  }, [isLoadingProducts, allProductsWithStock]);

  if (isLoadingProducts) {
    return <div className="min-h-screen flex items-center justify-center bg-black text-white text-xl">Cargando nuestros elixires...</div>;
  }

  return (
    <div className="flex-center section-padding bg-black text-white overflow-hidden py-10">
      <div className="w-full h-full md:px-10 px-5 max-w-7xl mx-auto">

        <TitleHeader title="🚀 POTENCIA TUS LÍMITES 🚀" sub="Descubre nuestros elixires más vendidos con envío GRATIS a todo el país. ¡Tu energía no puede esperar!" />

        <div id="skills" className="mt-16 md:mt-20">
          {promoProducts.length > 0 && (
            <div id="promociones" className="my-12 md:my-16 p-6 md:p-8 bg-gradient-to-b from-gray-900 to-black border-2 border-yellow-400 rounded-3xl shadow-2xl shadow-yellow-500/20">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-500 mb-2">
                  ⚡ ¡NUESTRAS PROMOS ESTRELLA! ⚡
                </h2>
                <p className="text-white/80 text-lg">
                  Precios especiales <strong>válidos solo por Agosto</strong>. ¡No te los pierdas!
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {promoProducts.map(item => <ProductCard key={item.id} item={item} />)}
              </div>
            </div>
          )}
          <TitleHeader title="CATÁLOGO COMPLETO" sub="Encuentra el elixir perfecto para cada ocasión." />
          <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 md:gap-9 mt-12">
            {regularProducts.map(item => <ProductCard key={item.id} item={item} />)}
          </div>
        </div>

        <div className="mt-16 md:mt-20">
          <TitleHeader title="🛍️ OFERTAS MAYORISTAS" sub="Precios de demolición para compras por volumen." />
          <div className="grid md:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-6 md:gap-9 mt-12">
            {vitaferOffers.map(item => <ProductCard key={item.id} item={item} />)}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TechStack;