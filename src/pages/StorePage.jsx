import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const StorePage = () => {
  const { allProductsWithStock, isLoadingProducts } = useCart();
  const [activeCategory, setActiveCategory] = useState('Todos');

  const categories = useMemo(() => {
    if (isLoadingProducts) return [];
    const allCategories = allProductsWithStock.map(p => p.category).filter(Boolean);
    return ['Todos', ...new Set(allCategories)];
  }, [allProductsWithStock, isLoadingProducts]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'Todos') return allProductsWithStock;
    return allProductsWithStock.filter(p => p.category === activeCategory);
  }, [allProductsWithStock, activeCategory]);

  if (isLoadingProducts) {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500"></div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="relative w-full h-[40vh] bg-gradient-to-b from-gray-900 via-black to-black flex items-center justify-center overflow-hidden pt-16">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-900/20 via-black/0 to-black/0 opacity-50"></div>
         <div className="relative z-10 text-center px-4">
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 mb-4 tracking-tighter">
                TIENDA OFICIAL
            </h1>
            <p className="text-lg text-yellow-500/80 font-medium uppercase tracking-widest">
                Potencia Natural & Energía Ilimitada
            </p>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="flex flex-wrap justify-center gap-2 mb-12 bg-gray-900/80 backdrop-blur-md p-2 rounded-full border border-white/10 inline-flex items-center shadow-2xl mx-auto w-fit max-w-full overflow-x-auto">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 text-sm font-bold rounded-full transition-all duration-300 whitespace-nowrap ${
                activeCategory === category
                  ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {filteredProducts.map(item => (
                    <ProductCard key={item.id} item={item} />
                ))}
            </div>
        ) : (
            <div className="text-center py-20 bg-gray-900/30 rounded-xl border border-white/5">
                <p className="text-gray-500 text-xl">No hay productos disponibles en esta categoría por el momento.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default StorePage;