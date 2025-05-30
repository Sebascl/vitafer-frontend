import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ item }) => {
  const { addToCart, formatMXN, getNumericPrice, setNotification } = useCart();
  const [quantity, setQuantity] = useState(1);

  const currentStock = item.stock !== undefined ? item.stock : 0;

  // Maneja el cambio directo desde el input numérico
  const handleDirectQuantityInputChange = (e) => {
    let newQuantity = parseInt(e.target.value, 10);

    if (isNaN(newQuantity)) { // Si no es un número (ej. campo vacío momentáneamente)
      setQuantity(''); // Permite que el input esté vacío temporalmente
      return;
    }

    newQuantity = Math.max(1, newQuantity); // Asegura que sea al menos 1

    if (currentStock > 0 && newQuantity > currentStock) {
      setNotification(`Solo quedan ${currentStock} unidades de ${item.name}.`);
      newQuantity = currentStock;
    }
    setQuantity(newQuantity);
  };

  // Valida y corrige la cantidad cuando el input pierde el foco
  const handleQuantityInputBlur = (e) => {
    let finalQuantity = parseInt(quantity, 10); // Usa el estado 'quantity' que pudo ser ''

    if (isNaN(finalQuantity) || finalQuantity < 1) {
      finalQuantity = 1;
    }
    if (currentStock > 0 && finalQuantity > currentStock) {
      finalQuantity = currentStock;
    }
    // Si el stock es 0, la cantidad no importa mucho porque no se podrá añadir
    // pero la mantenemos en 1 por consistencia si se vuelve a habilitar.
    if (currentStock === 0) {
      finalQuantity = 1;
    }
    setQuantity(finalQuantity);
  };

  // Maneja los botones +/-
  const handleQuantityChangeButtons = (amount) => {
    setQuantity(prev => {
      const currentVal = (typeof prev === 'number' && !isNaN(prev)) ? prev : 1; // Si prev es '', asume 1
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

    // Asegura que la cantidad sea un número válido y dentro del stock
    let finalQuantity = (typeof quantity === 'number' && !isNaN(quantity)) ? quantity : 1;
    finalQuantity = Math.max(1, finalQuantity); // Mínimo 1
    finalQuantity = Math.min(finalQuantity, currentStock); // No más que el stock

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

  if (item.pricingTiers && item.pricingTiers.length > 0) {
    const baseTier = item.pricingTiers.find(tier => tier.quantity === 1) || item.pricingTiers[0];
    const currentQuantityForTier = (typeof quantity === 'number' && !isNaN(quantity) && quantity > 0) ? quantity : 1;
    const tierForCurrentQuantity = item.pricingTiers.slice().reverse().find(t => currentQuantityForTier >= t.quantity) || baseTier;
    unitPriceForCalculation = tierForCurrentQuantity.pricePerUnit;

    const discountTier = item.pricingTiers.find(tier => tier.quantity > 1);
    priceDisplay = (
      <div className="mt-1 sm:mt-2">
        <p className="text-xl sm:text-2xl font-extrabold text-white">
          {formatMXN(baseTier.pricePerUnit)}
        </p>
        <p>
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
    priceDisplay = (<p className="text-xl sm:text-2xl font-extrabold text-white mt-1 sm:mt-2">{numericSimplePrice > 0 ? formatMXN(numericSimplePrice) : item.price}</p>);
  } else {
    unitPriceForCalculation = 0;
    priceDisplay = (<p className="text-lg font-semibold text-white/70 mt-1 sm:mt-2">Consultar precio</p>);
  }

  const currentQuantityForTotal = (typeof quantity === 'number' && !isNaN(quantity) && quantity > 0) ? quantity : 1;
  const quickAddTotal = currentQuantityForTotal * unitPriceForCalculation;

  return (
    <div className="tech-card h-full">
      <div className="card-float-layer bg-gradient-to-br from-yellow-400/20 via-pink-500/10 to-red-600/20 backdrop-blur-lg p-4 sm:p-6 rounded-3xl border border-yellow-500/40 shadow-2xl hover:shadow-yellow-400/30 transition-all duration-300 h-full flex flex-col">
        <Link to={`/producto/${encodeURIComponent(item.id || item.name)}`} className="block mb-4 group">
          <div className="flex justify-center items-center w-full h-40 sm:h-48 md:h-56 rounded-xl overflow-hidden bg-black/50 border border-yellow-600/50 shadow-inner cursor-pointer transform transition-transform duration-300 group-hover:scale-105">
            <img src={item.modelPath} alt={item.name} className="object-contain h-full max-h-[90%] w-auto p-2" loading="lazy" />
          </div>
        </Link>
        <div className="text-center space-y-1 sm:space-y-2 flex-grow flex flex-col">
          <div>
            <Link to={`/producto/${encodeURIComponent(item.id || item.name)}`}>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-300 hover:text-yellow-200 transition-colors drop-shadow-md min-h-[3.5rem] sm:min-h-[4rem] flex items-center justify-center px-1">{item.name}</h3>
            </Link>
            <p className="text-xs sm:text-sm text-pink-100/90 italic leading-relaxed my-2 px-1">{item.description}</p>
            <p className="text-sm sm:text-base text-white/80 font-medium mt-1 sm:mt-2">{item.presentation}</p>
            {priceDisplay}
            {currentStock <= 0 && (
              <p className="text-red-500 font-bold my-2 text-base sm:text-lg uppercase">Agotado</p>
            )}
            {currentStock > 0 && currentStock <= 10 && (
              <p className="text-orange-400 font-semibold my-2 text-sm">¡Solo quedan {currentStock}!</p>
            )}
          </div>

          <div className="mt-auto pt-3 sm:pt-4">
            {currentStock > 0 && (
              <div className="flex items-center justify-center gap-1 sm:gap-1.5 my-2 sm:my-3">
                <button
                  onClick={() => handleQuantityChangeButtons(-1)}
                  disabled={quantity <= 1}
                  className="p-1.5 sm:p-2 bg-red-600 hover:bg-red-700 rounded-full text-white font-bold disabled:opacity-50 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center transition-colors"
                >-</button>
                <input
                  type="number"
                  value={quantity}
                  onChange={handleDirectQuantityInputChange}
                  onBlur={handleQuantityInputBlur}
                  min="1"
                  max={currentStock > 0 ? currentStock : undefined}
                  disabled={currentStock <= 0}
                  className="w-12 sm:w-16 px-1 py-1 sm:p-1.5 text-center font-semibold text-lg sm:text-xl text-white bg-gray-700/50 border border-gray-600 rounded-md focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 appearance-none [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <button
                  onClick={() => handleQuantityChangeButtons(1)}
                  disabled={quantity >= currentStock}
                  className="p-1.5 sm:p-2 bg-yellow-500 hover:bg-yellow-600 rounded-full text-black font-bold w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center transition-colors"
                >+</button>
              </div>
            )}
            <button
              onClick={handleQuickAddToCart}
              disabled={currentStock <= 0 || (typeof quantity === 'number' && quantity > currentStock) || quantity === '' || quantity < 1}
              className="w-full mb-2 sm:mb-3 inline-block px-4 py-2 sm:px-5 sm:py-2.5 bg-yellow-500 hover:bg-yellow-600 text-black rounded-full font-semibold tracking-wide text-sm sm:text-base transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {currentStock > 0 ? `Añadir ${quantity || 1} (${formatMXN(quickAddTotal)})` : 'Agotado'}
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