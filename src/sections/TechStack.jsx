import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TitleHeader from "../components/TitleHeader";
import { vitaferProducts, vitaferOffers } from "../constants";

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
            stagger: 0.15,
            scrollTrigger: {
                trigger: "#skills",
                start: "top 70%",
                once: true,
            },
        }
    );

    floatLayers.forEach((card, i) => {
        gsap.set(card, { willChange: "transform" });
        const floatAnim = gsap.to(card, {
            y: "+=20",
            boxShadow: "0 0 40px rgba(255, 255, 0, 0.1)",
            duration: 1.8 + Math.random() * 0.4,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: i * 0.15,
            paused: true,
        });

        ScrollTrigger.create({
            trigger: card,
            start: "top bottom-=100",
            end: "bottom top+=100",
            onEnter: () => floatAnim.play(),
            onLeave: () => floatAnim.pause(),
            onEnterBack: () => floatAnim.play(),
            onLeaveBack: () => floatAnim.pause(),
        });
    });

    return () => {
        fadeIn.kill();
        ScrollTrigger.getAll().forEach((st) => st.kill());
        gsap.killTweensOf(".card-float-layer");
    };
  }, [vitaferProducts, vitaferOffers]);

  const today = new Date();
  const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const promoDateString = `${days[today.getDay()]} ${today.getDate()} de ${months[today.getMonth()]}`;

  const renderProductCard = (item) => {
    let priceDisplay;
    let whatsappPriceInfo = "Consultar precio";

    if (item.pricingTiers && item.pricingTiers.length > 0) {
      const baseTier = item.pricingTiers.find(tier => tier.quantity === 1) || item.pricingTiers[0];
      const discountTier = item.pricingTiers.find(tier => tier.quantity > 1);
      const unitDesc = item.unitDescription || ""; // Usa la descripción de unidad o nada

      const formatMXN = (value) => value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 });

      priceDisplay = (
        <div className="mt-2">
          <p className="text-2xl font-extrabold text-white">
             {formatMXN(baseTier.pricePerUnit)} <span className="text-lg font-medium text-white/80">{unitDesc}</span>
          </p>
          {discountTier && (
            <p className="text-sm font-semibold text-yellow-300 mt-1">
              ¡{formatMXN(discountTier.pricePerUnit)} c/u llevando {discountTier.quantity} o más!
            </p>
          )}
        </div>
      );
      whatsappPriceInfo = `${formatMXN(baseTier.pricePerUnit)} (${unitDesc.trim()})`; // Info más clara para WhatsApp

    } else {
         priceDisplay = (
           <p className="text-lg font-semibold text-white/70 mt-2">
                Consultar precio
           </p>
         );
    }

    return (
      <div key={item.name} className="tech-card">
        <div className="card-float-layer bg-gradient-to-br from-yellow-400/10 to-pink-500/10 backdrop-blur-xl p-6 rounded-3xl border border-yellow-400/30 shadow-2xl hover:scale-105 transition-transform duration-300 h-full flex flex-col">
          <div className="mb-5 flex justify-center items-center w-full h-48 md:h-56 lg:h-64 rounded-xl overflow-hidden bg-black/60 border border-yellow-400/30 shadow-inner">
            <img
              src={item.modelPath}
              alt={item.name}
              className="object-contain object-center h-full max-h-[90%] w-auto"
              loading="lazy"
            />
          </div>
          <div className="text-center space-y-2 flex-grow flex flex-col justify-between">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-yellow-300 drop-shadow-md">
                {item.name}
              </h3>
              <p className="text-sm text-pink-100 italic leading-relaxed mt-1 mb-2">
                {item.description}
              </p>
              <p className="text-base text-white/80 font-medium">
                {item.presentation}
              </p>
              {priceDisplay}
            </div>
            <a
               href={`https://wa.me/528123877607?text=Hola,%20estoy%20interesado%20en%20${encodeURIComponent(item.name)}%20(${encodeURIComponent(whatsappPriceInfo)})%20(¡con la promo de hoy!)%20🔥`}
               target="_blank"
               rel="noopener noreferrer"
               className="mt-4 inline-block px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-full font-semibold tracking-wide shadow-lg transition-all"
            >
              ¡Lo quiero AHORA! 💘
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      id="skills"
      className="flex-center section-padding bg-black text-white overflow-hidden mb-16" // Asegúrate que el mb-16 sea suficiente, puedes aumentarlo si es necesario (ej. mb-20, mb-24)
    >
      <div className="w-full h-full md:px-10 px-5 max-w-7xl mx-auto">
        <TitleHeader
          title="🔥 ¡Potencia tu Deseo!"
          sub="Elige el paquete ideal para llevar tu energía al máximo 🥵💥"
        />
        <div className="text-center mt-6 p-3 bg-gradient-to-r from-yellow-800 via-yellow-600 to-orange-600 rounded-2xl shadow-lg border-2 border-yellow-400/40">
          <p className="text-lg md:text-xl font-extrabold text-white drop-shadow-lg mb-1 animate-bounce">
            🚨 ¡OFERTA FLASH SÓLO HOY!
          </p>
          <p className="text-sm md:text-base font-semibold text-yellow-400 dark:text-yellow-200 mb-2 drop-shadow-sm">
             ¡Pide este <strong className="underline">{promoDateString}</strong> y aprovecha!
          </p>
          <ul className="list-none space-y-0.5 text-sm text-white/95">
            <li className="font-bold">✅ 🚚 ¡ENVÍO TOTALMENTE GRATIS A TODO MEXICO!</li>
          </ul>
          <p className="mt-3 text-xs font-medium text-white/90">
            ¡Date prisa, que la pasión no espera! 🔥
          </p>
        </div>

        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-9 mt-12">
          {vitaferProducts.map(renderProductCard)}
        </div>

        <div className="mt-20">
          <TitleHeader
            title="🛍️ Ofertas al Por Mayor"
            sub="Precios especiales para compras en volumen. ¡Ideal para revendedores!"
          />
          <div className="grid md:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-9 mt-12">
            {vitaferOffers.map(renderProductCard)}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TechStack;