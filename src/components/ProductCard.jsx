import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ item }) => {
  // setNotification se obtiene de useCart, addToCart también lo llama.
  const { addToCart, formatMXN, getNumericPrice, setNotification } = useCart();
  const [quantity, setQuantity] = useState(1);

  // El 'item' que se pasa como prop ya debería tener la propiedad 'stock'
  // gracias a que CartContext ha unido los datos base con el stock del backend.
  const currentStock = item.stock !== undefined ? item.stock : 0;

  const handleQuantityChange = (amount) => {
    setQuantity(prev => {
        const newQuantity = Math.max(1, prev + amount);
        if (currentStock > 0 && newQuantity > currentStock) {
            setNotification(`Solo quedan ${currentStock} unidades de ${item.name}.`);
            return currentStock; // No permitir exceder el stock
        }
        return newQuantity;
    });
  };

  const handleQuickAddToCart = () => {
    if (currentStock <= 0) {
        setNotification(`${item.name} está agotado.`);
        return;
    }
    if (quantity > currentStock) {
        setNotification(`No puedes añadir ${quantity} de ${item.name}. Solo quedan ${currentStock}.`);
        setQuantity(currentStock); // Ajusta la cantidad al stock disponible
        return;
    }
    addToCart(item, quantity); // Asumo que addToCart ya llama a setNotification
    setQuantity(1); // Resetea la cantidad después de añadir
  };

  let priceDisplay;
  let unitPriceForCalculation;

  if (item.pricingTiers && item.pricingTiers.length > 0) {
    const baseTier = item.pricingTiers.find(tier => tier.quantity === 1) || item.pricingTiers[0];
    // Para el cálculo del precio unitario, consideramos el tier aplicable a la cantidad seleccionada
    const tierForCurrentQuantity = item.pricingTiers.slice().reverse().find(t => quantity >= t.quantity) || baseTier;
    unitPriceForCalculation = tierForCurrentQuantity.pricePerUnit;
    
    const discountTier = item.pricingTiers.find(tier => tier.quantity > 1);
    priceDisplay = (
      <div className="mt-1 sm:mt-2">
        <p className="text-xl sm:text-2xl font-extrabold text-white">
           {formatMXN(baseTier.pricePerUnit)}
           {item.unitDescription && <span className="text-base font-medium text-white/80"> {item.unitDescription}</span>}
        </p>
        {discountTier && (
          <p className="text-xs sm:text-sm font-semibold text-yellow-300 mt-1">
            ¡{formatMXN(discountTier.pricePerUnit)} c/u llevando {discountTier.quantity} o más!
          </p>
        )}
      </div>
    );
  } else if (item.price) {
    const numericSimplePrice = getNumericPrice(item.price);
    unitPriceForCalculation = numericSimplePrice;
    priceDisplay = ( <p className="text-xl sm:text-2xl font-extrabold text-white mt-1 sm:mt-2">{numericSimplePrice > 0 ? formatMXN(numericSimplePrice) : item.price}</p> );
  } else {
    unitPriceForCalculation = 0;
    priceDisplay = ( <p className="text-lg font-semibold text-white/70 mt-1 sm:mt-2">Consultar precio</p> );
  }

  const quickAddTotal = quantity * unitPriceForCalculation;

  return (
    <div className="tech-card h-full">
      <div className="card-float-layer bg-gradient-to-br from-yellow-400/20 via-pink-500/10 to-red-600/20 backdrop-blur-lg p-4 sm:p-6 rounded-3xl border border-yellow-500/40 shadow-2xl hover:shadow-yellow-400/30 transition-all duration-300 h-full flex flex-col">
        {/* Usa item.id para el enlace si lo tienes, sino item.name */}
        <Link to={`/producto/${encodeURIComponent(item.id || item.name)}`} className="block mb-4 group">
          <div className="flex justify-center items-center w-full h-40 sm:h-48 md:h-56 rounded-xl overflow-hidden bg-black/50 border border-yellow-600/50 shadow-inner cursor-pointer transform transition-transform duration-300 group-hover:scale-105">
            <img src={item.modelPath} alt={item.name} className="object-contain h-full max-h-[90%] w-auto p-2" loading="lazy"/>
          </div>
        </Link>
        <div className="text-center space-y-1 sm:space-y-2 flex-grow flex flex-col">
          <div>
            <Link to={`/producto/${encodeURIComponent(item.id || item.name)}`}> {/* Usa item.id si lo tienes */}
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-300 hover:text-yellow-200 transition-colors drop-shadow-md min-h-[3.5rem] sm:min-h-[4rem] flex items-center justify-center px-1">{item.name}</h3>
            </Link>
            <p className="text-xs sm:text-sm text-pink-100/90 italic leading-relaxed my-2 px-1">{item.description}</p>
            <p className="text-sm sm:text-base text-white/80 font-medium mt-1 sm:mt-2">{item.presentation}</p>
            {priceDisplay}
            {currentStock <= 0 && (
                <p className="text-red-500 font-bold my-2 text-base sm:text-lg">AGOTADO</p>
            )}
            {currentStock > 0 && currentStock <= 10 && (
                <p className="text-orange-400 font-semibold my-2 text-sm">¡Solo quedan {currentStock}!</p>
            )}
          </div>

          <div className="mt-auto pt-3 sm:pt-4">
            {currentStock > 0 && ( // Solo muestra controles de cantidad si hay stock
              <div className="flex items-center justify-center gap-2 sm:gap-3 my-2 sm:my-3">
                <button 
                  onClick={() => handleQuantityChange(-1)} 
                  disabled={quantity <= 1} 
                  className="p-1.5 sm:p-2 bg-red-600 hover:bg-red-700 rounded-full text-white font-bold disabled:opacity-50 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center transition-colors"
                >-</button>
                <span className="min-w-[25px] sm:min-w-[30px] text-center font-semibold text-lg sm:text-xl text-white">{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(1)} 
                  disabled={quantity >= currentStock} // Deshabilita si la cantidad alcanza o supera el stock
                  className="p-1.5 sm:p-2 bg-yellow-500 hover:bg-yellow-600 rounded-full text-black font-bold w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center transition-colors"
                >+</button>
              </div>
            )}
            <button
             onClick={handleQuickAddToCart}
             disabled={currentStock <= 0 || quantity > currentStock}
             className="w-full mb-2 sm:mb-3 inline-block px-4 py-2 sm:px-5 sm:py-2.5 bg-yellow-500 hover:bg-yellow-600 text-black rounded-full font-semibold tracking-wide text-sm sm:text-base transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {currentStock > 0 ? `Añadir ${quantity} (${formatMXN(quickAddTotal)})` : 'Agotado'}
            </button>
            <Link
               to={`/producto/${encodeURIComponent(item.id || item.name)}`}
               className="w-full inline-block px-4 py-2 sm:px-5 sm:py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-full font-semibold tracking-wide text-sm sm:text-base transition-colors"
            >
              Ver Detalles ✨
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;