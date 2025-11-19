import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaShoppingCart, FaEye, FaBolt } from 'react-icons/fa';

const ProductCard = ({ item }) => {
  const { addToCart, buyNow, formatMXN, getNumericPrice } = useCart();
  const [quantity, setQuantity] = useState(1);
  const currentStock = item.stock !== undefined ? item.stock : 0;

  const handleQuantityChange = (amount) => {
    setQuantity(prev => {
      const newQ = Math.max(1, prev + amount);
      if (currentStock > 0 && newQ > currentStock) return currentStock;
      return newQ;
    });
  };

  let unitPrice = getNumericPrice(item.price);
  if (item.pricingTiers?.length > 0) unitPrice = item.pricingTiers[0].pricePerUnit;

  return (
    <div className="group relative w-full bg-gray-900/60 backdrop-blur-md rounded-2xl border border-white/5 hover:border-yellow-500/50 transition-all duration-300 shadow-lg flex flex-col h-full">
      {item.isPromo && <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-bl-xl z-20 shadow-md">OFERTA</div>}

      <div className="relative w-full aspect-[4/3] bg-black/40 p-6 overflow-hidden group">
        <Link to={`/producto/${encodeURIComponent(item.id || item.name)}`}>
            <img src={item.modelPath} alt={item.name} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-xl" loading="lazy" />
        </Link>
        {currentStock <= 0 && <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10"><span className="text-red-500 font-black text-2xl border-4 border-red-500 px-4 py-2 -rotate-12 opacity-80">AGOTADO</span></div>}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <p className="text-xs text-yellow-500 font-medium uppercase tracking-wider mb-1">{item.category || 'Vitafer'}</p>
        <Link to={`/producto/${encodeURIComponent(item.id || item.name)}`} className="block mb-2">
           <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors line-clamp-2">{item.name}</h3>
        </Link>
        
        <div className="mt-auto pt-4 border-t border-white/5">
          <div className="flex justify-between items-end mb-4">
             <span className="text-2xl font-bold text-white">{formatMXN(unitPrice)}</span>
             {currentStock > 0 && currentStock < 10 && <span className="text-[10px] text-orange-400 animate-pulse font-bold">¡Pocos!</span>}
          </div>

          {currentStock > 0 ? (
            <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <div className="flex items-center bg-black rounded-lg border border-gray-700 px-1">
                        <button onClick={() => handleQuantityChange(-1)} className="text-gray-400 px-2 disabled:opacity-30" disabled={quantity <= 1}>-</button>
                        <span className="text-white font-semibold text-sm">{quantity}</span>
                        <button onClick={() => handleQuantityChange(1)} className="text-gray-400 px-2 disabled:opacity-30" disabled={quantity >= currentStock}>+</button>
                    </div>
                    <button onClick={() => addToCart(item, quantity)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg text-sm py-2 transition-colors flex justify-center items-center gap-2">
                        <FaShoppingCart /> Añadir
                    </button>
                </div>
                <button onClick={() => buyNow(item, quantity)} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg text-sm py-2.5 transition-colors flex justify-center items-center gap-2 shadow-lg shadow-yellow-500/20">
                    <FaBolt /> COMPRAR AHORA
                </button>
            </div>
          ) : (
            <button disabled className="w-full bg-gray-800 text-gray-500 font-bold py-2.5 rounded-lg cursor-not-allowed">SIN STOCK</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;