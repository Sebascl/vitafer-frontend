import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ item }) => {
  const { addToCart, formatMXN, getNumericPrice, setNotification } = useCart();
  const [quantity, setQuantity] = useState(1);
  const currentStock = item.stock !== undefined ? item.stock : 0;

  const handleDirectQuantityInputChange = (e) => {
    let newQuantity = parseInt(e.target.value, 10);
    if (isNaN(newQuantity)) {
      setQuantity('');
      return;
    }
    newQuantity = Math.max(1, newQuantity);
    if (currentStock > 0 && newQuantity > currentStock) {
      setNotification(`Solo quedan ${currentStock} unidades de ${item.name}.`);
      newQuantity = currentStock;
    }
    setQuantity(newQuantity);
  };

  const handleQuantityInputBlur = (e) => {
    let finalQuantity = parseInt(quantity, 10);
    if (isNaN(finalQuantity) || finalQuantity < 1) {
      finalQuantity = 1;
    }
    if (currentStock > 0 && finalQuantity > currentStock) {
      finalQuantity = currentStock;
    }
    if (currentStock === 0) {
      finalQuantity = 1;
    }
    setQuantity(finalQuantity);
  };

  const handleQuantityChangeButtons = (amount) => {
    setQuantity(prev => {
      const currentVal = (typeof prev === 'number' && !isNaN(prev)) ? prev : 1;
      let newQuantity = Math.max(1, currentVal + amount);
      if (currentStock > 0 && newQuantity > currentStock) {
        setNotification(`Solo quedan ${currentStock} unidades de ${item.name}.`);
        return currentStock;
      }
      return newQuantity;
    });
  };

  const handleQuickAddToCart = () => {
    if (currentStock <= 0) {
      setNotification(`${item.name} está agotado.`);
      return;
    }
    let finalQuantity = (typeof quantity === 'number' && !isNaN(quantity)) ? quantity : 1;
    finalQuantity = Math.max(1, finalQuantity);
    finalQuantity = Math.min(finalQuantity, currentStock);
    if (finalQuantity <= 0) {
      setNotification(`Por favor, selecciona una cantidad válida para ${item.name}.`);
      if (currentStock > 0) setQuantity(1);
      return;
    }
    addToCart(item, finalQuantity);
    setQuantity(1);
  };

  let priceDisplay;
  let unitPriceForCalculation;

  const renderPrice = (price, originalPriceStr) => {
    const numericPrice = getNumericPrice(price);
    const numericOriginalPrice = originalPriceStr ? getNumericPrice(originalPriceStr) : 0;
    unitPriceForCalculation = numericPrice;

    return (
      <div className="mt-1 sm:mt-2 flex flex-col items-center justify-center">
        {numericOriginalPrice > 0 && (
          <span className="text-base sm:text-lg font-medium text-gray-400/90 line-through decoration-2">
            {formatMXN(numericOriginalPrice)}
          </span>
        )}
        <p className="text-2xl sm:text-3xl font-extrabold text-yellow-300 animate-pulse">
          {numericPrice > 0 ? formatMXN(numericPrice) : price}
        </p>
      </div>
    );
  };
  
  if (item.pricingTiers && item.pricingTiers.length > 0) {
    const baseTier = item.pricingTiers.find(tier => tier.quantity === 1) || item.pricingTiers[0];
    const currentQuantityForTier = (typeof quantity === 'number' && !isNaN(quantity) && quantity > 0) ? quantity : 1;
    const tierForCurrentQuantity = item.pricingTiers.slice().reverse().find(t => currentQuantityForTier >= t.quantity) || baseTier;
    unitPriceForCalculation = tierForCurrentQuantity.pricePerUnit;
    const numericOriginalPrice = item.originalPrice ? getNumericPrice(item.originalPrice) : 0;

    const discountTier = item.pricingTiers.find(tier => tier.quantity > 1);
    priceDisplay = (
      <div className="mt-1 sm:mt-2">
        {numericOriginalPrice > 0 && (
          <span className="text-base sm:text-lg font-medium text-red-400/90 line-through decoration-2">
            {formatMXN(numericOriginalPrice)}
          </span>
        )}
        <p className="text-2xl sm:text-3xl font-extrabold text-yellow-300 animate-pulse">
          {formatMXN(baseTier.pricePerUnit)}
        </p>
        <p>
          {item.unitDescription && <span className="text-base font-medium text-white/80"> {item.unitDescription}</span>}
        </p>
        {discountTier && (
          <p className="text-xs sm:text-sm font-semibold text-cyan-300 mt-1">
            ¡{formatMXN(discountTier.pricePerUnit)} c/u llevando {discountTier.quantity} o más!
          </p>
        )}
      </div>
    );  
  } else if (item.price) {
    priceDisplay = renderPrice(item.price, item.originalPrice);
  } else {
    unitPriceForCalculation = 0;
    priceDisplay = (<p className="text-lg font-semibold text-white/70 mt-1 sm:mt-2">Consultar precio</p>);
  }
  
  const currentQuantityForTotal = (typeof quantity === 'number' && !isNaN(quantity) && quantity > 0) ? quantity : 1;
  const quickAddTotal = currentQuantityForTotal * unitPriceForCalculation;

  return (
    <div className="tech-card h-full">
      <div className="card-float-layer bg-gradient-to-br from-blue-600/30 via-black/50 to-blue-800/30 backdrop-blur-xl p-4 sm:p-6 rounded-3xl border-2 border-blue-500/60 shadow-2xl hover:shadow-cyan-400/30 transition-all duration-300 h-full flex flex-col">
        <Link to={`/producto/${encodeURIComponent(item.id || item.name)}`} className="block mb-4 group">
          <div className="flex justify-center items-center w-full h-40 sm:h-48 md:h-56 rounded-xl overflow-hidden bg-black/60 border border-blue-600/50 shadow-inner cursor-pointer transform transition-transform duration-300 group-hover:scale-105">
            <img src={item.modelPath} alt={item.name} className="object-contain h-full max-h-[90%] w-auto p-2" loading="lazy" />
          </div>
        </Link>
        <div className="text-center space-y-1 sm:space-y-2 flex-grow flex flex-col">
          <div>
            <Link to={`/producto/${encodeURIComponent(item.id || item.name)}`}>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-300 hover:text-yellow-200 transition-colors drop-shadow-md min-h-[3.5rem] sm:min-h-[4rem] flex items-center justify-center px-1">{item.name}</h3>
            </Link>
            <p className="text-xs sm:text-sm text-cyan-100/90 italic leading-relaxed my-2 px-1">{item.description}</p>
            <p className="text-sm sm:text-base text-white/80 font-medium mt-1 sm:mt-2">{item.presentation}</p>
            {priceDisplay}
            {currentStock <= 0 && (
              <p className="text-red-400 font-bold my-2 text-base sm:text-lg uppercase">AGOTADO</p> // Mantenemos rojo para "AGOTADO" por ser una alerta universal
            )}
            {currentStock > 0 && currentStock <= 10 && (
              <p className="text-orange-400 font-semibold my-2 text-sm">¡SOLO QUEDAN {currentStock}!</p> // Naranja para urgencia es efectivo
            )}
          </div>

          <div className="mt-auto pt-3 sm:pt-4">
            {currentStock > 0 && (
              <div className="flex items-center justify-center gap-1 sm:gap-1.5 my-2 sm:my-3">
                <button onClick={() => handleQuantityChangeButtons(-1)} disabled={quantity <= 1} className="p-1.5 sm:p-2 bg-gray-700 hover:bg-gray-800 rounded-full text-white font-bold disabled:opacity-50 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center transition-colors">-</button>
                <input type="number" value={quantity} onChange={handleDirectQuantityInputChange} onBlur={handleQuantityInputBlur} min="1" max={currentStock > 0 ? currentStock : undefined} disabled={currentStock <= 0} className="w-12 sm:w-16 px-1 py-1 sm:p-1.5 text-center font-semibold text-lg sm:text-xl text-white bg-gray-800/60 border border-gray-600 rounded-md focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 appearance-none [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
                <button onClick={() => handleQuantityChangeButtons(1)} disabled={quantity >= currentStock} className="p-1.5 sm:p-2 bg-yellow-500 hover:bg-yellow-600 rounded-full text-black font-bold w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center transition-colors">+</button>
              </div>
            )}
            <button onClick={handleQuickAddToCart} disabled={currentStock <= 0 || (typeof quantity === 'number' && quantity > currentStock) || quantity === '' || quantity < 1} className="w-full mb-2 sm:mb-3 inline-block px-4 py-2 sm:px-5 sm:py-2.5 bg-yellow-500 hover:bg-yellow-600 text-black rounded-full font-semibold tracking-wide text-sm sm:text-base transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-105">
              {currentStock > 0 ? `AÑADIR ${quantity || 1} (${formatMXN(quickAddTotal)})` : 'AGOTADO'}
            </button>
            <Link to={`/producto/${encodeURIComponent(item.id || item.name)}`} className="w-full inline-block px-4 py-2 sm:px-5 sm:py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-full font-semibold tracking-wide text-sm sm:text-base transition-colors">
              Ver Detalles ✨
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;