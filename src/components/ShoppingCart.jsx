import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CheckoutForm from './checkoutForm';
import { FaTimes, FaTrash, FaShoppingCart, FaLock } from 'react-icons/fa';

const ShoppingCart = () => {
  const {
    cartItems, removeFromCart, updateQuantity, cartTotal,
    formatMXN, getNumericPrice, setIsCartOpen, allProductsWithStock
  } = useCart();
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);

  const handleClose = () => setIsCartOpen(false);

  const handleProceedToCheckout = () => {
      if (!user) {
          handleClose();
          navigate('/login');
      } else {
          setShowCheckout(true);
      }
  };

  return (
    <div 
        className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm transition-opacity" 
        onClick={handleClose}
    >
      <div 
        // CAMBIO DE COLOR: bg-zinc-950 (Negro profundo pero no absoluto) + Borde dorado sutil
        className="absolute right-0 top-0 h-full w-full sm:w-[480px] bg-zinc-950 shadow-[-10px_0_30px_rgba(234,179,8,0.1)] transform transition-transform duration-300 ease-out flex flex-col border-l border-yellow-500/20"
        onClick={(e) => e.stopPropagation()} 
      >
        
        {/* Header */}
        <div className="p-6 flex justify-between items-center border-b border-white/10 bg-black/40">
            <h2 className="text-2xl font-black text-white flex items-center gap-3 uppercase tracking-wide">
                <FaShoppingCart className="text-yellow-500"/> 
                {showCheckout ? 'Finalizar Compra' : 'Tu Carrito'}
            </h2>
            <button onClick={handleClose} className="text-gray-400 hover:text-yellow-500 transition-colors p-2 hover:bg-white/5 rounded-full">
                <FaTimes size={22}/>
            </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-6 custom-scrollbar bg-zinc-950">
            {showCheckout && user ? (
                <>
                    <button onClick={() => setShowCheckout(false)} className="text-yellow-500 hover:text-yellow-400 mb-6 font-bold flex items-center gap-2 text-sm uppercase tracking-wider">
                        ← Volver a los productos
                    </button>
                    <CheckoutForm cartItems={cartItems} cartTotal={cartTotal} />
                </>
            ) : (
                <>
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-6">
                            <div className="p-6 bg-gray-900/50 rounded-full border-2 border-gray-800">
                                <FaShoppingCart size={50} className="opacity-30"/>
                            </div>
                            <p className="text-xl font-medium">Tu carrito está vacío</p>
                            <button onClick={handleClose} className="text-yellow-500 font-bold hover:text-yellow-400 hover:underline text-lg">
                                Ir a la Tienda
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cartItems.map((item) => {
                                const productData = allProductsWithStock.find(p => p.id === item.id);
                                const currentStock = productData ? productData.stock : 0;
                                const unitPrice = getNumericPrice(item.price, item.quantity);

                                return (
                                    // ITEM CARD: Fondo oscuro con borde sutil
                                    <div key={item.id} className="bg-zinc-900 p-4 rounded-xl border border-white/5 hover:border-yellow-500/30 transition-colors flex gap-4 group shadow-md">
                                        <div className="w-24 h-24 bg-black rounded-lg p-2 flex-shrink-0 border border-gray-800 flex items-center justify-center">
                                            <img src={item.modelPath} alt={item.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform"/>
                                        </div>
                                        <div className="flex-grow flex flex-col justify-between">
                                            <div>
                                                <h4 className="font-bold text-white text-sm line-clamp-2 leading-tight mb-1">{item.name}</h4>
                                                <p className="text-sm font-bold text-yellow-500">{formatMXN(unitPrice)} <span className="text-gray-500 text-xs font-normal">c/u</span></p>
                                            </div>
                                            
                                            <div className="flex justify-between items-end mt-2">
                                                {/* Botones de cantidad estilo premium */}
                                                <div className="flex items-center bg-black rounded-lg border border-gray-700 h-9">
                                                    <button onClick={() => updateQuantity(item.id, -1)} className="px-3 text-gray-400 hover:text-white hover:bg-gray-800 h-full rounded-l-lg transition-colors" disabled={item.quantity <= 1}>-</button>
                                                    <span className="text-white font-bold text-sm w-8 text-center">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, 1)} className="px-3 text-gray-400 hover:text-white hover:bg-gray-800 h-full rounded-r-lg transition-colors" disabled={item.quantity >= currentStock}>+</button>
                                                </div>
                                                <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-red-500 p-2 transition-colors bg-black/50 rounded-lg hover:bg-black">
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
            <div className="p-6 border-t border-white/10 bg-black/40 backdrop-blur-lg">
                <div className="flex justify-between items-end mb-6">
                    <span className="text-gray-400 font-medium text-sm uppercase">Total Estimado</span>
                    <span className="text-3xl font-black text-white">{formatMXN(cartTotal)}</span>
                </div>
                {user ? (
                    <button 
                        onClick={handleProceedToCheckout}
                        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-black py-4 rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.3)] transform transition-all active:scale-[0.98] text-lg uppercase tracking-wide"
                    >
                        PROCEDER AL PAGO
                    </button>
                ) : (
                    <button 
                        onClick={handleProceedToCheckout}
                        className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-xl border border-white/10 shadow-lg flex items-center justify-center gap-3 transition-all group"
                    >
                        <FaLock size={16} className="text-yellow-500 group-hover:animate-pulse" /> INICIAR SESIÓN PARA PAGAR
                    </button>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;