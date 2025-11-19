import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TitleHeader from "../components/TitleHeader";
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

gsap.registerPlugin(ScrollTrigger);

const TechStack = () => {
  const { allProductsWithStock, isLoadingProducts } = useCart();

  const availableProducts = allProductsWithStock.filter(p => p.stock > 0);

  const fatherDayPromosView = availableProducts.filter(p => p.id && p.category === "Promociones Papá");
  const regularProductsView = availableProducts.filter(p => p.id && p.category === "Productos Individuales");
  const offersView = availableProducts.filter(p => p.id && p.category === "Mayoreo");

  useEffect(() => {
    if (!isLoadingProducts && availableProducts.length > 0) {
      const cardsToAnimate = gsap.utils.toArray(".tech-card");
      if (cardsToAnimate.length > 0) {
        gsap.fromTo(cardsToAnimate, { opacity: 0, y: -20 }, { 
            opacity: 1, y: 0, duration: 0.8, ease: "power2.out", stagger: 0.1, 
            scrollTrigger: { trigger: ".product-sections-wrapper", start: "top 80%", once: true }
        });
      }
      return () => {
        ScrollTrigger.getAll().forEach((st) => st.kill());
        gsap.killTweensOf(".tech-card");
      };
    }
  }, [isLoadingProducts, availableProducts]);

  if (isLoadingProducts) {
    return <div className="min-h-screen flex items-center justify-center bg-black text-white text-xl">Cargando productos...</div>;
  }

  return (
    <div className="product-sections-wrapper section-padding bg-black text-white overflow-x-hidden py-10">
      <div className="w-full md:px-10 px-5 max-w-7xl mx-auto">
        
        {promos.length > 0 && (
          <section id="promociones" className="mb-16 md:mb-20 pt-10">
            <TitleHeader title="🎁 Packs y Promociones" sub="Aprovecha nuestros packs y ahorra en tu compra." />
            <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 md:gap-9 mt-12">
              {promos.map(item => <ProductCard key={item.id} item={item} />)}
            </div>
          </section>
        )}

        {regularProductsView.length > 0 && (
            <section id="skills" className="mb-16 md:mb-20 pt-10">
                <TitleHeader title="🔥 ¡Potencia tu Deseo!" sub="Elige el paquete ideal para llevar tu energía al máximo."/>
                <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 md:gap-9 mt-12">
                {regularProductsView.map(item => <ProductCard key={item.id} item={item} />)}
                </div>
            </section>
        )}

        {wholesaleOffers.length > 0 && (
            <section id="ofertas-mayoreo" className="mt-16 md:mt-20 pt-10">
              <TitleHeader title="🛍️ Ofertas al Por Mayor" sub="Precios especiales para compras en volumen."/>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-9 mt-12">
                {wholesaleOffers.map(item => <ProductCard key={item.id} item={item} />)}
              </div>
            </section>
        )}

        {availableProducts.length === 0 && (
            <div className="text-center py-20">
                <p className="text-gray-500 text-lg">Por el momento no tenemos stock disponible. ¡Vuelve pronto!</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default TechStack;