import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { FaBolt, FaFire, FaStar } from 'react-icons/fa';

const StorePage = () => {
  const { allProductsWithStock, isLoadingProducts } = useCart();
  const [activeCategory, setActiveCategory] = useState('Todos');

  const categories = useMemo(() => {
    if (isLoadingProducts) return [];
    const allCategories = allProductsWithStock.map(p => p.category).filter(Boolean);
    return ['Todos', ...new Set(allCategories)];
  }, [allProductsWithStock, isLoadingProducts]);

  const filteredProducts = useMemo(() => {
    let products = activeCategory === 'Todos' 
        ? allProductsWithStock 
        : allProductsWithStock.filter(p => p.category === activeCategory);
    
    return products.sort((a, b) => {
        const aHasStock = a.stock > 0 ? 1 : 0;
        const bHasStock = b.stock > 0 ? 1 : 0;
        return bHasStock - aHasStock;
    });
  }, [allProductsWithStock, activeCategory]);

  if (isLoadingProducts) {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500"></div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20 relative overflow-x-hidden">
      
      {/* --- HERO BANNER LLAMATIVO --- */}
      <div className="relative w-full pt-36 pb-20 px-6 flex flex-col items-center justify-center overflow-hidden">
         <div className="absolute inset-0 bg-black">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[800px] bg-gradient-to-b from-yellow-600/20 via-black to-black rounded-b-[100%] blur-3xl opacity-40 pointer-events-none"></div>
             <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-500/10 blur-[80px] rounded-full animate-pulse pointer-events-none"></div>
             <div className="absolute top-40 right-10 w-64 h-64 bg-red-600/10 blur-[80px] rounded-full animate-pulse delay-1000 pointer-events-none"></div>
         </div>

         <div className="relative z-10 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/30 mb-6 backdrop-blur-sm">
                <FaBolt className="text-yellow-400" />
                <span className="text-yellow-300 font-bold text-xs sm:text-sm uppercase tracking-widest">Potencia 100% Natural</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-none drop-shadow-2xl">
                DESPIERTA TU <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600">POTENCIA</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 font-medium">
                Envíos discretos a todo México. Resultados garantizados desde la primera toma.
            </p>
         </div>
      </div>

      {/* --- CONTENIDO DE LA TIENDA --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        
        <div className="flex justify-center mb-16">
            <div className="inline-flex flex-wrap justify-center gap-2 p-2 bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                    activeCategory === category
                      ? 'bg-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.4)] scale-105'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {category === 'Todos' && <FaFire />}
                  {category === 'Mayoreo' && <FaStar />}
                  {category}
                </button>
              ))}
            </div>
        </div>

        {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map(item => (
                    <div key={item.id} className={`transform transition-transform duration-300 ${item.stock <= 0 ? 'opacity-60 grayscale' : 'hover:-translate-y-2'}`}>
                        <ProductCard item={item} />
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-32 bg-gray-900/30 rounded-3xl border border-white/5">
                <p className="text-gray-500 text-2xl font-bold">No hay productos en esta categoría.</p>
                <button onClick={() => setActiveCategory('Todos')} className="mt-4 text-yellow-500 hover:underline">Ver todos los productos</button>
            </div>
        )}
      </div>
    </div>
  );
};

export default StorePage;