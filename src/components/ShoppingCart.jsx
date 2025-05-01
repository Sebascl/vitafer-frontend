import React, { useState } from 'react';
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
    setIsCartOpen
  } = useCart();

  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-start pt-10 md:pt-20 overflow-y-auto">
       <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl mx-4 my-8 p-6 relative text-white">
          <button
            onClick={() => setIsCartOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl z-10"
            aria-label="Cerrar carrito"
          >
             &times;
          </button>

          {/* Título cambia según la vista */}
          <h2 className="text-3xl font-bold text-center mb-2 text-white">
            {showCheckout ? 'Checkout' : '🛒 Tu Carrito'}
          </h2>

          {showCheckout ? (
            <>
              <button onClick={() => setShowCheckout(false)} className="text-yellow-400 hover:text-yellow-300 mb-4 text-sm">&larr; Volver al carrito</button>
              <CheckoutForm
                  cartItems={cartItems}
                  cartTotal={cartTotal}
                  formatPrice={formatMXN}
              />
            </>
          ) : (
            <>
              <p className="text-center text-gray-400 mb-8">Revisa tus productos</p>
              {cartItems.length === 0 ? (
                <p className="text-center text-gray-400 mt-8 text-lg">Tu carrito está vacío.</p>
              ) : (
                <div className="space-y-6">
                  {/* Mapeo de items (sin cambios) */}
                  {cartItems.map((item) => {
                    const itemPrice = getNumericPrice(item.pricingTiers || item.price, item.quantity);
                    const totalItemPrice = itemPrice * item.quantity;
                    return (
                     <div key={item.name} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-900/80 rounded-lg border border-gray-700 gap-4">
                       <div className="flex items-center gap-4 flex-1 min-w-0">
                         <img src={item.modelPath} alt={item.name} className="w-16 h-16 object-contain rounded bg-black/30 p-1 flex-shrink-0"/>
                         <div className="overflow-hidden">
                           <h4 className="font-semibold text-base md:text-lg text-yellow-300 truncate">{item.name}</h4>
                           <p className="text-sm text-gray-300">{formatMXN(itemPrice)} c/u</p>
                         </div>
                       </div>
                       <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                          <button onClick={() => updateQuantity(item.name, -1)} className="px-2 sm:px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white font-bold">-</button>
                          <span className="min-w-[25px] sm:min-w-[30px] text-center font-semibold text-lg">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.name, 1)} className="px-2 sm:px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-white font-bold">+</button>
                       </div>
                       <div className="font-semibold text-base md:text-lg min-w-[80px] sm:min-w-[100px] text-right flex-shrink-0">
                          {formatMXN(totalItemPrice)}
                       </div>
                       <button onClick={() => removeFromCart(item.name)} className="p-2 text-red-500 hover:text-red-400 flex-shrink-0">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                       </button>
                     </div>
                    );
                  })}
                  {/* Total y Botón para ir al checkout */}
                  <div className="text-right mt-6 pt-6 border-t border-gray-700">
                    <h3 className="text-2xl font-bold mb-4">Total: {formatMXN(cartTotal)}</h3>
                    <button
                       onClick={() => setShowCheckout(true)}
                       disabled={cartItems.length === 0}
                       className="inline-block px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black rounded-full font-semibold tracking-wide shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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