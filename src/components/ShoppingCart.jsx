import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import CheckoutForm from './checkoutForm';
import { FaTimes, FaTrash, FaShoppingCart } from 'react-icons/fa';

const ShoppingCart = () => {
  const {
    cartItems, removeFromCart, updateQuantity, cartTotal,
    formatMXN, getNumericPrice, setIsCartOpen, allProductsWithStock, setNotification
  } = useCart();

  const [showCheckout, setShowCheckout] = useState(false);

  const handleClose = () => setIsCartOpen(false);

  return (
    <div 
        className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={handleClose}
    >
      <div 
        className="absolute right-0 top-0 h-full w-full sm:w-[480px] bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-out flex flex-col border-l border-white/10"
        onClick={(e) => e.stopPropagation()} // Evita que el clic dentro cierre el carrito
      >
        
        {/* Header */}
        <div className="p-6 flex justify-between items-center border-b border-white/10 bg-black/20">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <FaShoppingCart className="text-yellow-500"/> 
                {showCheckout ? 'Finalizar Compra' : 'Tu Carrito'}
            </h2>
            <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                <FaTimes size={20}/>
            </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-6 custom-scrollbar">
            {showCheckout ? (
                <>
                    <button onClick={() => setShowCheckout(false)} className="text-yellow-400 hover:text-yellow-300 mb-6 font-bold flex items-center gap-2 text-sm">
                        ← Volver a los productos
                    </button>
                    <CheckoutForm cartItems={cartItems} cartTotal={cartTotal} />
                </>
            ) : (
                <>
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                            <FaShoppingCart size={60} className="opacity-20"/>
                            <p className="text-lg">Tu carrito está vacío</p>
                            <button onClick={handleClose} className="text-yellow-500 font-bold hover:underline">Seguir comprando</button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cartItems.map((item) => {
                                const productData = allProductsWithStock.find(p => p.id === item.id);
                                const currentStock = productData ? productData.stock : 0;
                                const unitPrice = getNumericPrice(item.price, item.quantity);

                                return (
                                    <div key={item.id} className="bg-black/40 p-4 rounded-xl border border-white/5 flex gap-4">
                                        <div className="w-20 h-20 bg-white/5 rounded-lg p-2 flex-shrink-0">
                                            <img src={item.modelPath} alt={item.name} className="w-full h-full object-contain"/>
                                        </div>
                                        <div className="flex-grow">
                                            <h4 className="font-bold text-white text-sm line-clamp-1">{item.name}</h4>
                                            <p className="text-xs text-gray-400 mb-2">{formatMXN(unitPrice)} c/u</p>
                                            
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center bg-gray-800 rounded-lg border border-gray-700 h-8">
                                                    <button onClick={() => updateQuantity(item.id, -1)} className="px-3 text-gray-400 hover:text-white transition-colors" disabled={item.quantity <= 1}>-</button>
                                                    <span className="text-white font-bold text-sm w-6 text-center">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, 1)} className="px-3 text-gray-400 hover:text-white transition-colors" disabled={item.quantity >= currentStock}>+</button>
                                                </div>
                                                <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-300 p-2 transition-colors">
                                                    <FaTrash size={14}/>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}
        </div>

        {/* Footer */}
        {!showCheckout && cartItems.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-black/20">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-400">Total Estimado</span>
                    <span className="text-2xl font-black text-yellow-500">{formatMXN(cartTotal)}</span>
                </div>
                <button 
                    onClick={() => setShowCheckout(true)}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-black py-4 rounded-xl shadow-lg shadow-yellow-500/20 transform transition-all active:scale-95"
                >
                    PROCEDER AL PAGO
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;