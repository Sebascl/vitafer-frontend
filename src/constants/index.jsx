import React from 'react';
import { FaFire, FaGem, FaInfinity, FaHeart, FaFeatherAlt } from 'react-icons/fa';
import { IoSparklesOutline } from 'react-icons/io5';

const navLinks = [
  { name: "Inicio", link: "/" },
  { name: "Tienda", link: "/tienda" },
  { name: "Información", link: "/informacion" },
];

const words = [
  { text: "placer 🔥" },
  { text: "pasión 💋" },
  { text: "resistencia 💪" },
  { text: "deseo 🍑" },
  { text: "intensidad 💦" },
  { text: "conexión ❤️" },
];

const counterItems = [
  { value: 4, suffix: "+", label: "Años de Experiencia" },
  { value: 200000, suffix: "+", label: "Clientes Satisfechos" },
  { value: 10000, suffix: "+", label: "Testimonios Positivos" },
  { value: 100, suffix: "%", label: "Ingredientes Naturales" },
];

const commonIngredients = [
  "Sulfato Ferroso (equivale a Hierro elemental)",
  "Sorbitol al 70%",
  "Propilenglicol",
  "Extracto de Raíz de Ginseng Panax",
  "Vitamina C (Ácido Ascórbico)",
  "Vitamina B1 (Tiamina Clorhidrato)",
  "Vitamina B2 (Riboflavina 5 Fosfato Sódica)",
  "Vitamina B3 (Nicotinamida)",
  "Vitamina B6 (Piridoxina Clorhidrato)",
  "Ácido Fólico (Vitamina B9)",
  "Sabor Caramelo Líquido",
  "Color Caramelo",
  "Estevia (Edulcorante natural)",
  "Metilparabeno Sódico (Conservante)",
  "Propilparabeno Sódico (Conservante)",
  "Agua Purificada c.s.p."
];

const commonBenefits = [
  "Aumenta los niveles de energía y vitalidad general.",
  "Ayuda a combatir eficazmente el cansancio, la fatiga física y mental, y el estrés.",
  "Contribuye a mejorar el rendimiento en actividades diarias y deportivas.",
  "Tradicionalmente usado para apoyar la función sexual, el deseo y la resistencia.",
  "Formulado con vitaminas y minerales esenciales para el organismo.",
  "Puede ayudar a fortalecer el sistema inmunológico.",
  "Contribuye a un mejor estado de ánimo y bienestar."
];

const commonWarnings = [
  "Este producto es un suplemento dietario. No es un medicamento y no suple una alimentación equilibrada.",
  "No consumir en estado de embarazo o lactancia sin consultar previamente a su médico.",
  "No apto para menores de 18 años.",
  "Manténgase fuera del alcance de los niños.",
  "Si padece alguna condición médica preexistente (especialmente cardíaca, hipertensión, diabetes, problemas hepáticos o renales) o si está tomando medicamentos, consulte a su médico antes de consumir este producto.",
  "Consérvese en su envase original, en un lugar fresco y seco, a una temperatura inferior a 30°C y protegido de la luz directa del sol.",
  "Descontinúe su uso y consulte a un médico si experimenta alguna reacción adversa o efectos secundarios inesperados.",
  "MUY IMPORTANTE: Algunas autoridades sanitarias han emitido alertas sobre ciertas versiones de productos con nombres similares o que contienen 'Vitafer', por la posible presencia de ingredientes farmacéuticos no declarados. Adquiera el producto de fuentes confiables, verifique la regulación local en México y consuma con responsabilidad."
];

const vitaferProducts = [
  {
    id: "vitafer-l-500ml-x1",
    name: "💥 Vitafer-L 500mL (1 Frasco)",
    modelPath: "/images/vitafer-bottle.png",
    price: "$ 1000",
    originalPrice: "$ 1050",
    isPromo: true,
    presentation: "Frasco de 500 mL",
    description: "El clásico multivitamínico que enciende tu energía. Ideal para el rendimiento diario y la resistencia.",
    detailedDescription: "Vitafer-L en su presentación de 500mL es la fórmula tradicional y robusta diseñada para quienes buscan un tratamiento continuo. Al tomarlo diariamente, potencias tu vitalidad, mejoras tu desempeño físico y sexual, y combates la fatiga acumulada de manera efectiva y natural.",
    ingredients: commonIngredients,
    usageInstructions: "Adultos: Tomar una (1) copa dosificadora (10ml) al día, preferiblemente con una de las comidas principales. Para un efecto más inmediato antes de la actividad física o sexual, se puede tomar 30-45 minutos antes.",
    benefits: commonBenefits,
    warnings: commonWarnings,
    category: "Productos Individuales",
    sku: "VTFL500ML-X1"
  },
  {
    id: "vitafer-l-500ml-x2",
    name: "💥 Pack x2 Vitafer-L 500mL",
    modelPath: "/images/2-botellas.png",
    price: "$ 1470",
    presentation: "Pack de 2 Frascos de 500 mL c/u",
    description: "¡Duplica la potencia y ahorra! Lleva dos frascos de Vitafer-L para un suministro prolongado.",
    detailedDescription: "Aprovecha nuestro pack de dos frascos para asegurar tu bienestar por más tiempo. Es la opción ideal para compartir con tu pareja o para garantizar que no te falte tu dosis diaria de energía y potencia sexual durante varios meses.",
    ingredients: commonIngredients,
    usageInstructions: "Adultos: Tomar una (1) copa dosificadora (10ml) al día. Este pack asegura continuidad en el tratamiento para mejores resultados a largo plazo.",
    benefits: commonBenefits,
    warnings: commonWarnings,
    category: "Productos Individuales",
    sku: "VTFL500ML-X2"
  },
  {
    id: "vitafer-l-500ml-x3",
    name: "💥 Pack x3 Vitafer-L 500mL",
    modelPath: "/images/3-botellas.png",
    price: "$ 2200",
    presentation: "Pack de 3 Frascos de 500 mL c/u",
    description: "¡El mejor valor! Equípate con nuestro pack de tres frascos y asegura tu energía al máximo.",
    detailedDescription: "Maximiza tu ahorro y tus resultados con el tri-pack. Diseñado para usuarios frecuentes que han hecho de Vitafer su aliado indispensable para mantener un estilo de vida activo, vigoroso y lleno de pasión sin interrupciones.",
    ingredients: commonIngredients,
    usageInstructions: "Adultos: Tomar una (1) copa dosificadora (10ml) diariamente. Ideal para un tratamiento completo de revitalización.",
    benefits: commonBenefits,
    warnings: commonWarnings,
    category: "Productos Individuales",
    sku: "VTFL500ML-X3"
  },
  {
    id: "vitafer-l-sachet-10ml",
    name: "🔥 Vitafer-L Sachet 10mL",
    modelPath: "/images/sachet.png",
    price: "$ 900",
    originalPrice: "$ 950",
    isPromo: true,
    presentation: "Display x 15 sobres de 10mL c/u",
    description: "Potencia en formato práctico. Llévalo contigo a donde vayas de forma discreta.",
    detailedDescription: "La presentación en sachet de Vitafer-L es perfecta para la portabilidad y la discreción. Cada sobre contiene la dosis exacta para un efecto potente inmediato. Ideal para viajes, salidas de fin de semana o para tener siempre a mano en el momento justo.",
    ingredients: commonIngredients,
    usageInstructions: "Adultos: Consumir el contenido completo de un sachet (10ml) directamente, 30 a 60 minutos antes de la actividad física o sexual para potenciar el rendimiento.",
    benefits: commonBenefits,
    warnings: commonWarnings,
    category: "Productos Individuales",
    sku: "VTFLSACH10ML-D15"
  },
  {
    id: "vitafer-l-shots-20ml",
    name: "🔞 Vitafer-L Shots 20mL",
    modelPath: "/images/bottles-pack.png",
    price: "$ 2000",
    originalPrice: "$ 2500",
    presentation: "Display x 24 shots de 20mL c/u",
    description: "La dosis explosiva para noches inolvidables. Energía concentrada para momentos exigentes.",
    detailedDescription: "Los Vitafer-L Shots son la opción concentrada con el doble de contenido que un sachet normal. Formulados para quienes buscan un impacto rápido y contundente, asegurando resistencia y vigor cuando la situación demanda el máximo desempeño.",
    ingredients: commonIngredients,
    usageInstructions: "Adultos: Tomar el contenido de un (1) shot (20ml) cuando se requiera un impulso extra de energía y potencia. No exceder la dosis recomendada.",
    benefits: commonBenefits,
    warnings: commonWarnings,
    category: "Productos Individuales",
    sku: "VTFLSHOT20ML-D24"
  },
];

const vitaferOffers = [
  {
    id: "mayoreo-vitafer-l-500ml-25",
    name: "📦 Mayoreo: 25 x Vitafer-L 500mL",
    modelPath: "/images/vitafer-box.png",
    price: "$12515",
    pricingTiers: [
      { quantity: 1, pricePerUnit: 12515 },
      { quantity: 5, pricePerUnit: 10000 }
    ],
    unitDescription: "por caja de 25 frascos",
    presentation: "Paquete Mayorista: 1 Caja con 25 Frascos de 500mL",
    description: "¡Oferta especial para distribuidores! Abastece tu negocio con el producto líder.",
    detailedDescription: "Este paquete mayorista de Vitafer-L 500mL está pensado para farmacias, tiendas naturistas y distribuidores que buscan un margen de ganancia alto. Ofrece a tus clientes la presentación más vendida con la garantía de producto 100% original.",
    ingredients: commonIngredients,
    usageInstructions: "Ver modo de uso del frasco individual.",
    benefits: commonBenefits,
    warnings: commonWarnings,
    category: "Mayoreo",
    sku: "VTFL500ML-MAYOR25"
  },
  {
    id: "mayoreo-vitafer-shots-12cajas",
    name: "📦 Mayoreo: 12 Cajas x 24 Shots 20mL",
    modelPath: "/images/vitafer-pack.png",
    price: "$12515",
    pricingTiers: [
      { quantity: 1, pricePerUnit: 12515 }
    ],
    unitDescription: "por paquete de 12 cajas",
    presentation: "Paquete Mayorista: 12 Displays (288 shots en total)",
    description: "¡Ideal para eventos o reventa! Formato de impulso altamente rentable.",
    detailedDescription: "Maximiza tu inventario con este paquete mayorista de Shots. Su formato de venta individual es perfecto para mostradores, gimnasios y puntos de venta rápida, garantizando una alta rotación y satisfacción del cliente final.",
    ingredients: commonIngredients,
    usageInstructions: "Ver modo de uso del Vitafer-L Shot 20mL individual.",
    benefits: commonBenefits,
    warnings: commonWarnings,
    category: "Mayoreo",
    sku: "VTFLSHOT20ML-MAYOR12D"
  },
  {
    id: "mayoreo-vitafer-sachet-12cajas",
    name: "📦 Mayoreo: 12 Cajas x 15 Sachets 10mL",
    modelPath: "/images/12-satches.png",
    price: "$6300",
    pricingTiers: [
      { quantity: 1, pricePerUnit: 6300 }
    ],
    unitDescription: "por paquete de 12 cajas",
    presentation: "Paquete Mayorista: 12 Displays (180 sachets en total)",
    description: "¡Ideal para negocios o reventa! La forma más fácil de introducir el producto.",
    detailedDescription: "Maximiza tu inventario con este paquete mayorista de Sachets. Es la presentación ideal para clientes nuevos que desean probar la efectividad de Vitafer-L con una inversión baja, fomentando la recompra de presentaciones más grandes.",
    ingredients: commonIngredients,
    usageInstructions: "Ver modo de uso del Vitafer-L Sachet 10mL individual.",
    benefits: commonBenefits,
    warnings: commonWarnings,
    category: "Mayoreo",
    sku: "VTFLSACH10ML-MAYOR12D"
  },
];

const fatherDayPromos = [
  {
    id: "promo-papa-2x500ml",
    name: "🎁 Pack Dúo Papá: 2 Vitafer-L 500mL",
    modelPath: "/images/musculoso-2.png",
    price: "$ 1.690",
    presentation: "Oferta: 2 Frascos de Vitafer-L 500mL",
    description: "¡El regalo perfecto para papá! Doble energía y vitalidad para su día a día.",
    detailedDescription: "Este Día del Padre, regala potencia y bienestar con el Pack Dúo. Es el detalle perfecto para demostrarle cuánto te importa su salud, ayudándole a mantenerse activo, fuerte y lleno de energía.",
    ingredients: commonIngredients,
    usageInstructions: "Ver modo de uso del frasco individual.",
    benefits: [...commonBenefits, "Ahorro especial por el Día del Padre."],
    warnings: commonWarnings,
    category: "Promociones Papá",
    sku: "VTF-PAPA-PACK2"
  },
  {
    id: "promo-papa-3x500ml",
    name: "💪 Super Pack Papá: 3 Vitafer-L 500mL",
    modelPath: "/images/musculoso-3.png",
    price: "$ 2.100",
    presentation: "Oferta: 3 Frascos de Vitafer-L 500mL",
    description: "¡Más potencia para el rey de la casa! Un regalo que dura meses.",
    detailedDescription: "Sorprende a papá con el Super Pack de 3 frascos. Asegura su vitalidad por mucho más tiempo con este paquete especial diseñado para hombres que buscan mantener su rendimiento al máximo nivel.",
    ingredients: commonIngredients,
    usageInstructions: "Ver modo de uso del frasco individual.",
    benefits: [...commonBenefits, "Excelente relación cantidad-precio."],
    warnings: commonWarnings,
    category: "Promociones Papá",
    sku: "VTF-PAPA-PACK3"
  },
  {
    id: "promo-papa-10x500ml",
    name: "🏆 Mega Pack Papá: 10 Vitafer-L 500mL",
    modelPath: "/images/musculoso-10.png",
    price: "$ 5.500",
    presentation: "Oferta: 10 Frascos de Vitafer-L 500mL",
    description: "¡Para el papá campeón! El Mega Pack para una reserva de energía inagotable.",
    detailedDescription: "El regalo definitivo para el Día del Padre. Con 10 frascos, le regalas un año entero de bienestar, potencia y salud, o la posibilidad de compartir el secreto de su vitalidad con sus amigos.",
    ingredients: commonIngredients,
    usageInstructions: "Ver modo de uso del frasco individual.",
    benefits: [...commonBenefits, "Máximo ahorro por volumen."],
    warnings: commonWarnings,
    category: "Promociones Papá",
    sku: "VTF-PAPA-PACK10"
  }
];

const expCards = [
  {
    title: "Energía Que Excita",
    description: "Siente cómo una chispa recorre tu cuerpo, activando tus sentidos y preparándote para momentos de placer intenso.",
    icon: <FaFire />,
    bgColor: "from-black via-red-950/30 to-zinc-900",
    accentColor: "text-red-400",
  },
  {
    title: "Poder Irresistible",
    description: "Irradia una confianza que atrae miradas, mejorando tu autoestima y seguridad en cada encuentro íntimo.",
    icon: <FaGem />,
    bgColor: "from-zinc-900 via-purple-950/40 to-black",
    accentColor: "text-purple-400",
  },
  {
    title: "Explosión de Vitalidad",
    description: "Olvida la fatiga. Libera una energía renovada que te permite rendir al máximo en tus actividades diarias y nocturnas.",
    icon: <IoSparklesOutline />,
    bgColor: "from-black via-orange-950/30 to-zinc-900",
    accentColor: "text-orange-400",
  },
];

const expCards2 = [
  {
    title: "Fuerza Que Dura",
    description: "Supera tus límites y prolonga el placer, manteniendo la resistencia física necesaria para satisfacer plenamente a tu pareja.",
    icon: <FaInfinity />,
    bgColor: "from-zinc-900 via-amber-950/30 to-black",
    accentColor: "text-amber-400",
  },
  {
    title: "Intimidad Explosiva",
    description: "Profundiza el vínculo más allá de la piel, experimentando una conexión emocional y física mucho más intensa y gratificante.",
    icon: <FaHeart />,
    bgColor: "from-black via-teal-950/30 to-zinc-900",
    accentColor: "text-teal-400",
  },
  {
    title: "Relajación Sensual",
    description: "Disuelve el estrés y sumérgete en el momento, permitiendo que tu cuerpo y mente se enfoquen únicamente en el disfrute.",
    icon: <FaFeatherAlt />,
    bgColor: "from-zinc-900 via-indigo-950/30 to-black",
    accentColor: "text-indigo-400",
  },
];

const testimonials = [
  {
    name: "Carlos Gómez",
    mentions: "@carlosgomez",
    review: "Desde que empecé a tomar Vitafer, mi energía ha vuelto a ser la de antes. Me siento más activo en el trabajo y mi vida en pareja ha mejorado increíblemente.",
    imgPath: "/images/perfiles/perfil1.jpg",
  },
  {
    name: "Lucía Martínez",
    mentions: "@luciamtz",
    review: "Lo compré para mi pareja y el cambio fue impresionante. Ahora tiene mucha más resistencia y ambos disfrutamos más de nuestro tiempo juntos.",
    imgPath: "/images/perfiles/perfil5.jpg",
  },
  {
    name: "Jorge Ramírez",
    mentions: "@jramirez",
    review: "Vitafer me ayudó a quitarme el cansancio acumulado. Es el empujón que necesitaba para rendir bien en el gimnasio y llegar con energía a casa.",
    imgPath: "/images/perfiles/perfil3.jpg",
  },
  {
    name: "Valentina Ríos",
    mentions: "@valentinar",
    review: "Quedé sorprendida con los resultados. Es un producto natural que realmente funciona, mi esposo se siente más seguro y nuestra conexión es mejor.",
    imgPath: "/images/perfiles/perfil4.jpg",
  },
  {
    name: "Pedro Torres",
    mentions: "@pedritot",
    review: "Probé varios productos, pero ninguno me dio la confianza y los resultados rápidos de Vitafer. Lo recomiendo totalmente por su efectividad.",
    imgPath: "/images/perfiles/perfil2.jpg",
  },
  {
    name: "Camila Fernández",
    mentions: "@camilafdz",
    review: "Mi pareja notó el cambio de inmediato. Se siente con más vitalidad y eso ha traído una chispa nueva a nuestra relación que nos encanta.",
    imgPath: "/images/perfiles/perfil6.jpg",
  },
];

const socialImgs = [
  { name: "insta", imgPath: "/images/insta.png", url: "https://instagram.com" },
  { name: "fb", imgPath: "/images/fb.png", url: "https://facebook.com" },
  { name: "whatsapp", imgPath: "/images/whatsapp.png", url: "https://wa.me/528123877607" },
];

export {
  words,
  counterItems,
  navLinks,
  commonIngredients,
  vitaferProducts,
  vitaferOffers,
  fatherDayPromos,
  expCards,
  expCards2,
  testimonials,
  socialImgs,
};