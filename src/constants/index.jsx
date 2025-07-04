import React from 'react';
import { FaFire, FaGem, FaInfinity, FaHeart, FaFeatherAlt } from 'react-icons/fa'; // FontAwesome
import { IoSparklesOutline, IoPulseOutline } from 'react-icons/io5'; // Ionicons 5

const navLinks = [
  { name: "Inicio", link: "#vitalidad" },
  { name: "Beneficios", link: "#experience" },
  { name: "Precios", link: "#skills" },
  { name: "Testimonios", link: "#testimonials" },
  { name: "Contacto", link: "#contact" },
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

const logoIconsList = [
  {
    imgPath: "/images/logos/company-logo-1.png",
  },
  {
    imgPath: "/images/logos/company-logo-2.png",
  },
  {
    imgPath: "/images/logos/company-logo-3.png",
  },
  {
    imgPath: "/images/logos/company-logo-4.png",
  },
  {
    imgPath: "/images/logos/company-logo-5.png",
  },
  {
    imgPath: "/images/logos/company-logo-6.png",
  },
  {
    imgPath: "/images/logos/company-logo-7.png",
  },
  {
    imgPath: "/images/logos/company-logo-8.png",
  },
  {
    imgPath: "/images/logos/company-logo-9.png",
  },
  {
    imgPath: "/images/logos/company-logo-10.png",
  },
  {
    imgPath: "/images/logos/company-logo-11.png",
  },
];

const abilities = [
  {
    imgPath: "/images/seo.png",
    title: "Quality Focus",
    desc: "Delivering high-quality results while maintaining attention to every detail.",
  },
  {
    imgPath: "/images/chat.png",
    title: "Reliable Communication",
    desc: "Keeping you updated at every step to ensure transparency and clarity.",
  },
  {
    imgPath: "/images/time.png",
    title: "On-Time Delivery",
    desc: "Making sure projects are completed on schedule, with quality & attention to detail.",
  },
];

const techStackImgs = [
  {
    name: "React Developer",
    imgPath: "/images/logos/react.png",
  },
  {
    name: "Python Developer",
    imgPath: "/images/logos/python.svg",
  },
  {
    name: "Backend Developer",
    imgPath: "/images/logos/node.png",
  },
  {
    name: "Interactive Developer",
    imgPath: "/images/logos/three.png",
  },
  {
    name: "Project Manager",
    imgPath: "/images/logos/git.svg",
  },
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
  "MUY IMPORTANTE: Algunas autoridades sanitarias internacionales han emitido alertas sobre ciertas versiones de productos con nombres similares o que contienen 'Vitafer', por la posible presencia de ingredientes farmacéuticos no declarados (como Tadalafilo, usado para la disfunción eréctil). Adquiera el producto de fuentes confiables, verifique la regulación local en México y consuma con responsabilidad. La presencia de dichos ingredientes no declarados puede suponer un riesgo para la salud."
];


const vitaferProducts = [
  {
    id: "vitafer-l-500ml",
    name: "💥 Vitafer-L 500mL",
    modelPath: "/images/vitafer-bottle.png",
    scale: 2.5,
    rotation: [0, 0, 0],
    price: "$ 1050",
    presentation: "Frasco de 500 mL",
    description: "El clásico multivitamínico líquido que enciende tu energía. Ideal para el rendimiento diario y la resistencia sexual. 💪🔥",
    detailedDescription: "Vitafer-L en su presentación de 500mL es la fórmula tradicional y robusta para quienes buscan un impulso significativo en su día a día. Este suplemento líquido combina vitaminas, minerales y extractos naturales para combatir la fatiga, mejorar la concentración y potenciar la vitalidad. Es un aliado reconocido para mejorar el rendimiento físico y mental, y tradicionalmente buscado por sus efectos positivos en la energía y resistencia sexual.",
    ingredients: commonIngredients,
    usageInstructions: "Adultos: Tomar una (1) copa dosificadora (aproximadamente 10mL a 20mL según la copa incluida) pura o diluida en su bebida favorita, preferiblemente una (1) vez al día. Algunas personas prefieren tomarlo 30-60 minutos antes de la actividad física o sexual para un efecto potenciador. Agítese bien antes de usar. No exceder la dosis diaria recomendada.",
    benefits: commonBenefits,
    warnings: commonWarnings,
    category: "Suplementos Energéticos",
    sku: "VTFL500ML-STD"
  },
  {
    id: "vitafer-l-sachet-10ml",
    name: "🔥 Vitafer-L Sachet 10mL",
    modelPath: "/images/sachet.png",
    scale: 3,
    rotation: [0, 0, 0],
    price: "$ 950",
    presentation: "Display x 15 sobres de 10mL c/u",
    description: "Potencia en formato práctico. Llévalo contigo y recárgate cuando quieras. Ideal para encuentros espontáneos. 😉💧",
    detailedDescription: "La presentación en sachet de Vitafer-L ofrece la misma fórmula potente en un formato individual, práctico y discreto. Perfecto para llevar contigo y consumir cuando necesites ese extra de energía y vitalidad, ya sea para una jornada larga o para un momento especial. Cada sachet contiene la dosis ideal para un impulso rápido y efectivo.",
    ingredients: commonIngredients,
    usageInstructions: "Adultos: Consumir el contenido completo de un (1) sachet (10mL) directamente o diluido en su bebida favorita, una (1) vez al día o según necesidad. Para un efecto potenciador, algunas fuentes sugieren tomar un sachet 30-60 minutos antes de la actividad. No exceder la dosis recomendada de sachets al día según las indicaciones del producto o su profesional de salud.",
    benefits: commonBenefits,
    warnings: commonWarnings,
    category: "Suplementos en Sachet",
    sku: "VTFLSACH10ML-D16"
  },
  {
    id: "vitafer-l-shots-20ml",
    name: "🔞 Vitafer-L Shots 20mL",
    modelPath: "/images/bottles-pack.png",
    scale: 3,
    rotation: [0, 0, 0],
    price: "$ 2000",
    originalPrice: "$ 1570",
    presentation: "Display x 24 shots de 20mL c/u",
    description: "La dosis explosiva para noches inolvidables. Siente la vitalidad, el placer y la potencia en cada trago. 🍷🔥",
    detailedDescription: "Los Vitafer-L Shots son la opción concentrada para quienes buscan la máxima potencia en una dosis lista para tomar. Cada shot de 20mL está formulado para ofrecer una explosión de energía y vitalidad, ideal para momentos que requieren tu máximo rendimiento. Su conveniente presentación lo hace perfecto para tenerlo a mano y asegurar noches de intensidad y placer inolvidables.",
    ingredients: commonIngredients,
    usageInstructions: "Adultos: Tomar el contenido de un (1) shot (20mL) directamente, una (1) vez al día o según necesidad. Para un efecto potenciador, se sugiere consumir un shot 30-60 minutos antes de la actividad deseada. No exceder la dosis recomendada de shots al día. Agítese antes de consumir.",
    benefits: commonBenefits,
    warnings: commonWarnings,
    category: "Potenciadores en Shot",
    sku: "VTFLSHOT20ML-D24"
  },
];

const vitaferOffers = [
  {
    id: "mayoreo-vitafer-l-500ml-25",
    name: "📦 Mayoreo: 25 x Vitafer-L 500mL",
    modelPath: "/images/vitafer-box.png",
    scale: 2.5,
    rotation: [0, 0, 0],
    price: "$12515",
    pricingTiers: [
      { quantity: 1, pricePerUnit: 12515 },
      { quantity: 5, pricePerUnit: 10000 }
    ],
    unitDescription: "por caja de 25 frascos",
    presentation: "Paquete Mayorista: 1 Caja con 25 Frascos de 500mL",
    description: "¡Oferta especial para distribuidores y mayoristas! Llévate 25 botellas del potente Vitafer-L 500mL a un precio increíble y maximiza tus ganancias.",
    detailedDescription: "Este paquete mayorista de Vitafer-L 500mL está pensado para distribuidores y negocios que desean ofrecer a sus clientes un producto de alta demanda y reconocidos beneficios. Cada caja contiene 25 frascos de la fórmula clásica de Vitafer-L, ideal para mejorar la energía, vitalidad y el rendimiento general. Aprovecha los precios por volumen y asegura un stock constante de este popular suplemento.",
    ingredients: commonIngredients,
    usageInstructions: "Ver modo de uso del frasco individual Vitafer-L 500mL. Este paquete es para distribución.",
    benefits: commonBenefits,
    warnings: commonWarnings,
    category: "Mayoreo",
    sku: "VTFL500ML-MAYOR25"
  },
  {
    id: "mayoreo-vitafer-shots-12cajas",
    name: "📦 Mayoreo: 12 Cajas x 24 Shots 20mL",
    modelPath: "/images/vitafer-pack.png",
    scale: 3,
    rotation: [0, 0, 0],
    price: "$12515",
    pricingTiers: [
      { quantity: 1, pricePerUnit: 12515 }
    ],
    unitDescription: "por paquete de 12 cajas",
    presentation: "Paquete Mayorista: 12 Displays (cada display con 24 shots de 20mL). Total 288 shots.",
    description: "¡Ideal para eventos, negocios o reventa! Adquiere 12 cajas de nuestros potentes Vitafer-L Shots 20mL y asegura la energía donde la necesites.",
    detailedDescription: "Maximiza tu inventario con este paquete mayorista de Vitafer-L Shots. Recibirás 12 displays, cada uno conteniendo 24 shots individuales de 20mL (un total de 288 shots). Perfectos para reventa individual, para ofrecer en eventos, o para asegurar un suministro prolongado de este potente energizante. Su formato es ideal para un impulso rápido de vitalidad y rendimiento.",
    ingredients: commonIngredients,
    usageInstructions: "Ver modo de uso del Vitafer-L Shot 20mL individual. Este paquete es para distribución.",
    benefits: commonBenefits,
    warnings: commonWarnings,
    category: "Mayoreo",
    sku: "VTFLSHOT20ML-MAYOR12D"
  },
];

const expCards = [
  {
    title: "Energía Que Excita",
    description: "Siente cómo una chispa recorre tu cuerpo, despertando cada terminación nerviosa. La anticipación crece... esto es solo el comienzo de una noche inolvidable.",
    icon: <FaFire />,
    bgColor: "from-black via-red-950/30 to-zinc-900",
    accentColor: "text-red-400",
  },
  {
    title: "Poder Irresistible",
    description: "Irradia una confianza que atrae miradas y enciende la curiosidad. No necesitas palabras, tu presencia habla. El poder de seducir está en ti.",
    icon: <FaGem />,
    bgColor: "from-zinc-900 via-purple-950/40 to-black",
    accentColor: "text-purple-400",
  },
  {
    title: "Explosión de Vitalidad",
    description: "Olvida la fatiga. Libera una energía que te impulsa a explorar, sentir y disfrutar sin reservas. La noche es joven, y tú marcas el ritmo.",
    icon: <IoSparklesOutline />,
    bgColor: "from-black via-orange-950/30 to-zinc-900",
    accentColor: "text-orange-400",
  },
];

const expCards2 = [
  {
    title: "Fuerza Que Dura",
    description: "Supera tus límites y prolonga el placer. Sorprende con una fuerza que no cede, manteniendo la intensidad hasta que ambos decidan rendirse al éxtasis.",
    icon: <FaInfinity />,
    bgColor: "from-zinc-900 via-amber-950/30 to-black",
    accentColor: "text-amber-400",
  },
  {
    title: "Intimidad Explosiva",
    description: "Profundiza el vínculo más allá de la piel. Cada caricia, cada mirada, se intensifica. Vitafer aviva la llama de la complicidad y la entrega mutua.",
    icon: <FaHeart />,
    bgColor: "from-black via-teal-950/30 to-zinc-900",
    accentColor: "text-teal-400",
  },
  {
    title: "Relajación Sensual",
    description: "Disuelve el estrés y sumérgete en el momento presente. Una relajación profunda que agudiza los sentidos y te prepara para disfrutar plenamente cada sensación.",
    icon: <FaFeatherAlt />, // Icono de pluma para suavidad y relajación
    bgColor: "from-zinc-900 via-indigo-950/30 to-black",
    accentColor: "text-indigo-400",
  },
];

const expLogos = [
  {
    name: "logo1",
    imgPath: "/images/logo1.png",
  },
  {
    name: "logo2",
    imgPath: "/images/logo2.png",
  },
  {
    name: "logo3",
    imgPath: "/images/logo3.png",
  },
];

const testimonials = [
  {
    name: "Carlos Gómez",
    mentions: "@carlosgomez",
    review:
      "Desde que empecé a tomar Vitafer, mi energía subió de golpe. No solo en el gimnasio, también en mis momentos más íntimos. Me siento mucho más fuerte, con más ganas y más activo. Se nota mucho la diferencia.",
    imgPath: "/images/perfiles/perfil1.jpg",
  },
  {
    name: "Lucía Martínez",
    mentions: "@luciamtz",
    review:
      "Lo compré para mi pareja y el cambio fue impresionante. Está mucho más activo, no solo en lo físico, sino también en lo íntimo. Es un cambio real, lo notamos los dos.",
    imgPath: "/images/perfiles/perfil5.jpg",
  },
  {
    name: "Jorge Ramírez",
    mentions: "@jramirez",
    review:
      "Vitafer me ayudó a quitarme el cansancio que tenía. Ahora tengo más energía, especialmente para disfrutar los momentos más íntimos. Se nota en todos los aspectos de mi vida, me siento mucho mejor.",
    imgPath: "/images/perfiles/perfil3.jpg",
  },
  {
    name: "Valentina Ríos",
    mentions: "@valentinar",
    review:
      "Quedé sorprendida con los resultados. Mi pareja está mucho más activo, especialmente cuando se trata de nuestra intimidad. Vitafer realmente hace lo que promete, es algo que sin duda volvería a comprar.",
    imgPath: "/images/perfiles/perfil4.jpg",
  },
  {
    name: "Pedro Torres",
    mentions: "@pedritot",
    review:
      "Probé varios productos, pero ninguno me dio los resultados que Vitafer. No solo me siento con más energía, sino que también ha mejorado mi rendimiento en los momentos más íntimos. Ya pedí más.",
    imgPath: "/images/perfiles/perfil2.jpg",
  },
  {
    name: "Camila Fernández",
    mentions: "@camilafdz",
    review:
      "Mi pareja notó el cambio de inmediato. Ahora está mucho más relajado, con más energía y un ánimo increíble. Vitafer ha mejorado nuestra conexión, es un producto que de verdad funciona.",
    imgPath: "/images/perfiles/perfil6.jpg",
  },
];


const socialImgs = [
  {
    name: "insta",
    imgPath: "/images/insta.png",
  },
  {
    name: "fb",
    imgPath: "/images/fb.png",
  },
  {
    name: "x",
    imgPath: "/images/x.png",
  },
  {
    name: "linkedin",
    imgPath: "/images/linkedin.png",
  },
];

export {
  words,
  abilities,
  logoIconsList,
  counterItems,
  expCards,
  expCards2,
  expLogos,
  testimonials,
  socialImgs,
  vitaferProducts,
  vitaferOffers,
  techStackImgs,
  navLinks,
};
