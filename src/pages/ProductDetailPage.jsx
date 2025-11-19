import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaShippingFast, FaShieldAlt, FaLock, FaCheckCircle, FaArrowLeft, FaWhatsapp, FaShoppingCart, FaBolt } from 'react-icons/fa';

const ProductDetailPage = () => {
  const { productIdOrName } = useParams();
  const { addToCart, buyNow, formatMXN, getNumericPrice, allProductsWithStock, isLoadingProducts } = useCart();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0); 
    if (isLoadingProducts || !allProductsWithStock) return;

    const decoded = decodeURIComponent(productIdOrName);
    const found = allProductsWithStock.find(p => p.id === decoded || p.name === decoded);
    
    if (found) {
      setProduct(found);
      setActiveImg(found.modelPath);
      setQuantity(1);
    } else {
      navigate('/'); 
    }
  }, [productIdOrName, isLoadingProducts, allProductsWithStock, navigate]);

  if (isLoadingProducts || !product) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div></div>;
  }

  const currentStock = product.stock || 0;
  let unitPrice = getNumericPrice(product.price);
  if(product.pricingTiers?.length > 0) {
      const tier = product.pricingTiers.slice().reverse().find(t => quantity >= t.quantity) || product.pricingTiers[0];
      unitPrice = tier.pricePerUnit;
  }

  const totalPrice = unitPrice * quantity;

  const handleQuantity = (val) => {
      const newQ = Math.max(1, Math.min(val, currentStock > 0 ? currentStock : 1));
      setQuantity(newQ);
  };

  const handleAddToCart = () => {
      if(currentStock <= 0) return;
      addToCart(product, quantity);
  };

  const handleBuyNow = () => {
      if(currentStock <= 0) return;
      buyNow(product, quantity);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-yellow-500 transition-colors mb-8 group font-medium">
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Volver a la tienda
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          <div className="space-y-4">
             <div className="w-full aspect-square bg-gradient-to-br from-gray-900 to-black rounded-3xl border border-white/10 flex items-center justify-center p-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-500/10 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                <img src={activeImg} alt={product.name} className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10 transition-transform duration-500 hover:scale-105" />
                {product.isPromo && <span className="absolute top-6 left-6 bg-red-600 text-white font-bold px-4 py-1 rounded-full text-sm shadow-lg z-20">OFERTA ESPECIAL</span>}
             </div>
          </div>

          <div className="flex flex-col h-full">
            <h2 className="text-yellow-500 font-bold uppercase tracking-widest text-sm mb-2">{product.category || 'Suplemento Natural'}</h2>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">{product.name}</h1>
            
            <div className="flex items-end gap-4 mb-6 border-b border-white/10 pb-6">
                <span className="text-5xl font-bold text-yellow-400">{formatMXN(unitPrice)}</span>
                {quantity > 1 && <span className="text-gray-400 mb-2 text-lg">x unidad</span>}
            </div>

            <div className="prose prose-invert text-gray-300 mb-8 leading-relaxed">
                <p>{product.description}</p>
                {product.benefits && (
                    <ul className="mt-4 space-y-2">
                        {product.benefits.slice(0, 4).map((benefit, i) => (
                            <li key={i} className="flex items-center gap-3">
                                <FaCheckCircle className="text-green-500 flex-shrink-0" /> <span>{benefit}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {currentStock > 0 ? (
                <div className="bg-gray-900/50 p-6 rounded-2xl border border-white/10 mb-8">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex items-center bg-black border border-gray-700 rounded-xl h-14 px-2 w-full sm:w-40 justify-between">
                                <button onClick={() => handleQuantity(quantity - 1)} className="w-10 h-full text-2xl text-gray-400 hover:text-white flex items-center justify-center">-</button>
                                <span className="font-bold text-xl">{quantity}</span>
                                <button onClick={() => handleQuantity(quantity + 1)} className="w-10 h-full text-2xl text-gray-400 hover:text-white flex items-center justify-center">+</button>
                            </div>
                            <button 
                                onClick={handleAddToCart}
                                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold text-lg h-14 rounded-xl border border-gray-600 transition-all flex items-center justify-center gap-3"
                            >
                                <FaShoppingCart /> Añadir al Carrito
                            </button>
                        </div>
                        
                        <button 
                            onClick={handleBuyNow}
                            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black text-xl h-16 rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] transition-all transform active:scale-[0.98] uppercase tracking-wide flex items-center justify-center gap-3"
                        >
                            <FaBolt /> COMPRAR AHORA - {formatMXN(totalPrice)}
                        </button>
                    </div>
                    {currentStock < 10 && (
                        <p className="text-orange-400 text-sm font-bold mt-3 flex items-center gap-2 animate-pulse">
                            🔥 ¡Date prisa! Solo quedan {currentStock} unidades.
                        </p>
                    )}
                </div>
            ) : (
                <div className="bg-red-900/20 border border-red-500/50 p-6 rounded-2xl mb-8 text-center">
                    <h3 className="text-red-500 font-bold text-2xl mb-2">PRODUCTO AGOTADO</h3>
                    <p className="text-red-300/80">Lo sentimos, este producto se encuentra temporalmente sin stock.</p>
                </div>
            )}

            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="flex flex-col items-center text-center p-3 bg-gray-900 rounded-xl border border-gray-800">
                    <FaShippingFast className="text-2xl text-blue-400 mb-2" />
                    <span className="text-xs font-bold text-gray-300">Envío Rápido</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 bg-gray-900 rounded-xl border border-gray-800">
                    <FaShieldAlt className="text-2xl text-green-400 mb-2" />
                    <span className="text-xs font-bold text-gray-300">Discreción</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 bg-gray-900 rounded-xl border border-gray-800">
                    <FaLock className="text-2xl text-yellow-400 mb-2" />
                    <span className="text-xs font-bold text-gray-300">Pago Seguro</span>
                </div>
            </div>

            <a 
                href={`https://wa.me/528123877607?text=${encodeURIComponent(`Hola, me interesa el producto ${product.name}`)}`} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-2 text-green-500 hover:text-green-400 transition-colors font-medium text-sm"
            >
                <FaWhatsapp size={18} /> ¿Tienes dudas? Consulta por WhatsApp
            </a>
          </div>
        </div>

        {/* Detailed Information Section */}
        <div className="mt-20 border-t border-white/10 pt-16">
            <h3 className="text-3xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400">Información Detallada</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-900/40 p-8 rounded-2xl border border-white/5">
                    <h4 className="text-xl font-bold text-yellow-500 mb-4">Modo de Uso</h4>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-line">{product.usageInstructions || 'Consultar el empaque para instrucciones detalladas.'}</p>
                </div>
                <div className="bg-gray-900/40 p-8 rounded-2xl border border-white/5">
                    <h4 className="text-xl font-bold text-yellow-500 mb-4">Ingredientes</h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                        {product.ingredients?.length > 0 
                            ? product.ingredients.map((ing, idx) => <li key={idx}>{ing}</li>)
                            : <li>Ingredientes naturales seleccionados.</li>
                        }
                    </ul>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetailPage;