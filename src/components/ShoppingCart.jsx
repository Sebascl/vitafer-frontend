import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import CheckoutForm from './checkoutForm';

const ShoppingCart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    cartTotal,
    formatMXN,
    getNumericPrice,
    setIsCartOpen,
    allProductsWithStock,
    setNotification
  } = useCart();

  const [showCheckout, setShowCheckout] = useState(false);
  const [itemInputQuantities, setItemInputQuantities] = useState({});

  useEffect(() => {
    const newInputs = {};
    cartItems.forEach(item => {
      newInputs[item.id] = item.quantity.toString();
    });
    setItemInputQuantities(newInputs);
  }, [cartItems]);

  const handleCancelCheckout = () => {
    setShowCheckout(false);
  };

  const handleCartItemInputChange = (itemId, value) => {
    setItemInputQuantities(prev => ({
      ...prev,
      [itemId]: value
    }));
  };

  const handleCartItemInputBlur = (itemId) => {
    const itemInCart = cartItems.find(ci => ci.id === itemId);
    if (!itemInCart) return;

    const currentInputValue = itemInputQuantities[itemId];
    let newQuantity = parseInt(currentInputValue, 10);
    
    const productData = allProductsWithStock.find(p => p.id === itemId);
    const currentItemStock = productData ? productData.stock : 0;

    if (isNaN(newQuantity) || newQuantity < 1) {
      newQuantity = 1;
    }
    if (currentItemStock > 0 && newQuantity > currentItemStock) {
      setNotification(`Solo quedan ${currentItemStock} unidades. Se ajustó la cantidad.`);
      newQuantity = currentItemStock;
    } else if (currentItemStock === 0 && newQuantity > 0) {
      setNotification(`${itemInCart.name} está agotado.`);
      newQuantity = 0;
    }
    
    const amountToChange = newQuantity - itemInCart.quantity;
    if (amountToChange !== 0) {
      updateQuantity(itemId, amountToChange);
    } else {
      setItemInputQuantities(prev => ({ ...prev, [itemId]: itemInCart.quantity.toString() }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-start pt-10 md:pt-20 pb-10 px-2 overflow-y-auto">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl mx-4 my-8 p-4 sm:p-6 relative text-white">
        <button
          onClick={() => setIsCartOpen(false)}
          className="absolute top-3 sm:top-4 right-3 sm:right-4 p-1 text-gray-400 hover:text-white text-3xl leading-none z-10"
          aria-label="Cerrar carrito"
        >
           &times;
        </button>

        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-white">
          {showCheckout ? 'Checkout' : '🛒 Tu Carrito'}
        </h2>

        {showCheckout ? (
          <>
            <button onClick={handleCancelCheckout} className="text-yellow-400 hover:text-yellow-300 mb-4 text-sm">&larr; Volver al carrito</button>
            <CheckoutForm
                cartItems={cartItems}
                cartTotal={cartTotal}
                formatPrice={formatMXN}
                onCancel={handleCancelCheckout}
            />
          </>
        ) : (
          <>
            <p className="text-center text-gray-400 mb-6 sm:mb-8">Revisa tus productos</p>
            {cartItems.length === 0 ? (
              <p className="text-center text-gray-400 my-12 text-lg">Tu carrito está vacío.</p>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => {
                  const productData = allProductsWithStock.find(p => p.id === item.id);
                  const currentItemStock = productData ? productData.stock : 0;
                  
                  let itemUnitPriceToShow = getNumericPrice(item.price);
                  if (item.pricingTiers && item.pricingTiers.length > 0) {
                      const tier = item.pricingTiers.slice().reverse().find(t => item.quantity >= t.quantity) || item.pricingTiers[0];
                      itemUnitPriceToShow = tier.pricePerUnit;
                  }
                  const totalItemPrice = itemUnitPriceToShow * item.quantity;
                  
                  return (
                   <div key={item.id} className="flex items-start justify-between p-3 bg-gray-900/80 rounded-lg border border-gray-700 gap-2">
                      <div className="flex items-start gap-2 sm:gap-3 flex-grow min-w-0">
                        <img src={item.modelPath} alt={item.name} className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded bg-black/30 p-0.5 flex-shrink-0"/>
                        <div className="flex-grow min-w-0 pt-0.5">
                          <h4 className="font-semibold text-xs sm:text-sm md:text-base text-yellow-300 truncate" title={item.name}>{item.name}</h4>
                          <p className="text-[10px] sm:text-xs md:text-sm text-gray-300">{formatMXN(itemUnitPriceToShow)} c/u</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end sm:flex-row sm:items-center gap-1.5 sm:gap-2 md:gap-3 flex-shrink-0 pt-0.5">
                        <div className="flex items-center gap-1 sm:gap-1.5 order-1">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)} 
                            disabled={item.quantity <= 1}
                            className="p-1 px-1.5 sm:px-2 bg-red-600 hover:bg-red-700 rounded text-white font-bold text-[10px] sm:text-xs disabled:opacity-50"
                          >-</button>
                          <input
                            type="number"
                            value={itemInputQuantities[item.id] || ''}
                            onChange={(e) => handleCartItemInputChange(item.id, e.target.value)}
                            onBlur={() => handleCartItemInputBlur(item.id)}
                            min="1"
                            max={currentItemStock > 0 ? currentItemStock : undefined}
                            disabled={currentItemStock === 0 && item.quantity === 0}
                            className="w-10 sm:w-12 px-1 py-0.5 text-center font-semibold text-xs sm:text-sm text-white bg-gray-700/50 border border-gray-600 rounded-md focus:ring-yellow-500 focus:border-yellow-500 appearance-none [-moz-appearance:textfield]"
                          />
                          <button 
                            onClick={() => updateQuantity(item.id, 1)} 
                            disabled={item.quantity >= currentItemStock}
                            className="p-1 px-1.5 sm:px-2 bg-green-600 hover:bg-green-700 rounded text-white font-bold text-[10px] sm:text-xs disabled:opacity-50"
                          >+</button>
                        </div>

                        <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-0 order-2">
                          <div className="font-semibold text-xs sm:text-sm md:text-base text-right min-w-[50px] sm:min-w-[70px] md:min-w-[80px]">
                             {formatMXN(totalItemPrice)}
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="p-0.5 sm:p-1 text-red-500 hover:text-red-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </div>
                   </div>
                  );
                })}
                <div className="text-right mt-6 pt-6 border-t border-gray-700">
                  <h3 className="text-xl sm:text-2xl font-bold mb-4">Total: {formatMXN(cartTotal)}</h3>
                  <button
                       onClick={() => setShowCheckout(true)}
                       disabled={cartItems.length === 0}
                       className="w-full sm:w-auto inline-block px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black rounded-full font-semibold tracking-wide shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Proceder al Checkout
                  </button>
                </div>
              </div>
            )}
          </>
        )}
       </div>
    </div>
  );
};

export default ShoppingCart;