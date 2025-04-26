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

const vitaferProducts = [
  {
    name: "💥 Vitafer-L 500mL",
    modelPath: "/images/vitafer-bottle.png",
    scale: 2.5,
    rotation: [0, 0, 0],
    price: "$ 1.000",
    presentation: "Frasco de 500 mL",
    description:
      "El clásico multivitamínico líquido que enciende tu energía. Ideal para el rendimiento diario y la resistencia sexual. 💪🔥",
  },
  {
    name: "🔥 Vitafer-L Sachet 10mL",
    modelPath: "/images/sachet.png",
    scale: 3,
    rotation: [0, 0, 0],
    price: "$ 800",
    presentation: "Display x 16 unds de 10mL",
    description:
      "Potencia en formato práctico. Llévalo contigo y recárgate cuando quieras. Ideal para encuentros espontáneos. 😉💧",
  },
  {
    name: "🔞 Vitafer-L Shots 20mL",
    modelPath: "/images/bottles-pack.png",
    scale: 3,
    rotation: [0, 0, 0],
    price: "$ 1.500",
    presentation: "Display x 24 unds de 20mL",
    description:
      "La dosis explosiva para noches inolvidables. Siente la vitalidad, el placer y la potencia en cada trago. 🍷🔥",
  },
];

const vitaferOffers = [
  {
    name: "📦 Mayoreo: 25 x Vitafer-L 500mL",
    modelPath: "/images/vitafer-box.png",
    scale: 2.5,
    rotation: [0, 0, 0],
    pricingTiers: [
      { quantity: 1, pricePerUnit: 12000 },
      { quantity: 5, pricePerUnit: 10000 }
    ],
    unitDescription: "por caja", // Añadido
    presentation: "Paquete Mayorista: 25 Frascos de 500 mL",
    description:
      "¡Oferta especial para distribuidores! Llévate 25 botellas de 500mL a un precio increíble.",
  },
  {
    name: "📦 Mayoreo: 12 Cajas x 24 Shots 20mL",
    modelPath: "/images/vitafer-pack.png", // Asegúrate que sea la imagen correcta
    scale: 3,
    rotation: [0, 0, 0],
    // price: "$ 12,000", // Quita el precio simple
    pricingTiers: [ // Usa pricingTiers también aquí
      { quantity: 1, pricePerUnit: 12000 } // Solo un nivel de precio
    ],
    unitDescription: "", // Añadido (describe a qué se refiere el precio)
    presentation: "Paquete Mayorista: 12 Displays (288 Shots de 20mL en total)",
    description:
      "¡Ideal para eventos o reventa! 12 cajas de nuestros potentes shots de 20mL.",
  },
];

const expCards = [
  {
    title: "Energía Que Excita",
    description: "Siente cómo una chispa recorre tu cuerpo, despertando cada terminación nerviosa. La anticipación crece... esto es solo el comienzo de una noche inolvidable.",
    // Reemplaza logoPath por el componente de icono importado
    icon: <FaFire />,
    bgColor: "from-black via-red-950/30 to-zinc-900", // Mantenemos estilos originales
    accentColor: "text-red-400", // Mantenemos estilos originales
  },
  {
    title: "Poder Irresistible",
    description: "Irradia una confianza que atrae miradas y enciende la curiosidad. No necesitas palabras, tu presencia habla. El poder de seducir está en ti.",
    icon: <FaGem />, // Icono de gema/joya puede simbolizar valor y atracción
    bgColor: "from-zinc-900 via-purple-950/40 to-black", // Mantenemos estilos originales
    accentColor: "text-purple-400", // Mantenemos estilos originales
  },
  {
    title: "Explosión de Vitalidad",
    description: "Olvida la fatiga. Libera una energía que te impulsa a explorar, sentir y disfrutar sin reservas. La noche es joven, y tú marcas el ritmo.",
    icon: <IoSparklesOutline />, // Icono de chispas para vitalidad radiante
    bgColor: "from-black via-orange-950/30 to-zinc-900", // Mantenemos estilos originales
    accentColor: "text-orange-400", // Mantenemos estilos originales
  },
];

// --- Beneficios Columna Derecha ---
const expCards2 = [
  {
    title: "Fuerza Que Dura",
    description: "Supera tus límites y prolonga el placer. Sorprende con una fuerza que no cede, manteniendo la intensidad hasta que ambos decidan rendirse al éxtasis.",
    icon: <FaInfinity />, // Icono de infinito para durabilidad
    bgColor: "from-zinc-900 via-amber-950/30 to-black", // Mantenemos estilos originales
    accentColor: "text-amber-400", // Mantenemos estilos originales
  },
  {
    title: "Intimidad Explosiva",
    description: "Profundiza el vínculo más allá de la piel. Cada caricia, cada mirada, se intensifica. Vitafer aviva la llama de la complicidad y la entrega mutua.",
    icon: <FaHeart />, // Icono de corazón para intimidad y conexión
    bgColor: "from-black via-teal-950/30 to-zinc-900", // Mantenemos estilos originales
    accentColor: "text-teal-400", // Mantenemos estilos originales
  },
  {
    title: "Relajación Sensual",
    description: "Disuelve el estrés y sumérgete en el momento presente. Una relajación profunda que agudiza los sentidos y te prepara para disfrutar plenamente cada sensación.",
    icon: <FaFeatherAlt />, // Icono de pluma para suavidad y relajación
    bgColor: "from-zinc-900 via-indigo-950/30 to-black", // Mantenemos estilos originales
    accentColor: "text-indigo-400", // Mantenemos estilos originales
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
