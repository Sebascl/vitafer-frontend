import { useRef, forwardRef } from "react";

// Usamos forwardRef para poder pasar la ref desde el componente padre (TestimonialsSensual)
const GlowCardSensual = forwardRef(({ card, children }, ref) => {
  const glowCardRef = useRef(null); // Ref interna para el manejo del mouse

  const handleMouseMove = (e) => {
    const cardElement = glowCardRef.current;
    if (!cardElement) return;

    const rect = cardElement.getBoundingClientRect();
    // Coordenadas relativas al centro de la tarjeta
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;

    // Calcular ángulo
    let angle = Math.atan2(mouseY, mouseX) * (180 / Math.PI);
    angle = (angle + 360) % 360; // Normalizar ángulo 0-360

    // Aplicar el ángulo al estilo CSS (variable --start)
    // Puedes definir .card-sensual::before en tu CSS global para el efecto glow
    cardElement.style.setProperty("--start", `${angle}deg`);
    cardElement.style.setProperty("--opacity", "1"); // Mostrar el brillo
  };

  const handleMouseLeave = () => {
    const cardElement = glowCardRef.current;
    if (cardElement) {
      cardElement.style.setProperty("--opacity", "0"); // Ocultar el brillo
    }
  };

  // Función para renderizar estrellas (puedes personalizar el icono/color)
  const renderStars = () => {
    const totalStars = 5;
    // Asegúrate que 'rating' es un número válido, si no, usa un default (ej. 5)
    const filledStars = typeof card.rating === 'number' && card.rating > 0 && card.rating <= 5 ? Math.round(card.rating) : 5;

    return Array.from({ length: totalStars }, (_, i) => (
      <svg
        key={i}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        // Llenar estrella si 'i' es menor que el rating, color ámbar
        // Puedes cambiar 'fill-amber-400' a otro color o 'fill-current text-amber-400'
        className={`w-5 h-5 ${i < filledStars ? 'fill-amber-400' : 'fill-white/20'}`}
      >
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
      </svg>
    ));
  };


  return (
    // Aplicamos la ref externa (de GSAP) y la ref interna (para el mouse)
    // Combinamos clases: diseño base, gradiente, borde, sombra hover, transición
    <div
      ref={(el) => {
        glowCardRef.current = el; // Asigna a la ref interna
        if (typeof ref === 'function') {
          ref(el); // Llama a la función ref de GSAP (addToRefs)
        } else if (ref) {
          ref.current = el; // Asigna a la ref externa si es un objeto ref
        }
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      // Clases clave para el estilo sensual y el efecto glow
      className="card-sensual relative rounded-xl p-6 md:p-8 mb-5 break-inside-avoid-column overflow-hidden
                 bg-gradient-to-br from-zinc-900 via-red-950/20 to-black
                 border border-white/10
                 transition-all duration-300 ease-out
                 hover:border-amber-400/60 hover:shadow-[0_0_25px_5px_rgba(251,146,60,0.25)]"
    >
       {/* Pseudo-elemento para el brillo (requiere CSS) */}
       <div className="glow-overlay"></div>

      {/* Contenido de la tarjeta */}
      <div className="relative z-10"> {/* Asegura que el contenido esté sobre el glow */}
        {/* Estrellas (puedes obtener el rating de card.rating si existe) */}
        <div className="flex items-center gap-1 mb-4">
          {renderStars(card.rating)}
        </div>

        {/* Texto del Testimonio/Review */}
        <div className="mb-5">
          {/* Cita más grande y evocadora */}
          <p className="text-white/80 text-lg md:text-xl italic leading-relaxed">
            "{card.review}" {/* Asumiendo que 'review' contiene el texto */}
          </p>
        </div>

        {/* Renderiza la parte de abajo (imagen, nombre, etc.) pasada como children */}
        {children}
      </div>
    </div>
  );
});

GlowCardSensual.displayName = 'GlowCardSensual'; // Para DevTools

export default GlowCardSensual;