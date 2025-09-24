import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import TitleHeader from '../components/TitleHeader';

const StorePage = () => {
  const { allProductsWithStock, isLoadingProducts } = useCart();
  const [activeCategory, setActiveCategory] = useState('Todos');

  const categories = useMemo(() => {
    if (isLoadingProducts) return [];
    const allCategories = allProductsWithStock.map(p => p.category).filter(Boolean);
    return ['Todos', ...new Set(allCategories)];
  }, [allProductsWithStock, isLoadingProducts]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'Todos') {
      return allProductsWithStock;
    }
    return allProductsWithStock.filter(p => p.category === activeCategory);
  }, [allProductsWithStock, activeCategory]);

  if (isLoadingProducts) {
    return <div className="min-h-screen flex items-center justify-center bg-black text-white text-xl">Cargando Tienda...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white pt-28 md:pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TitleHeader title="Nuestra Tienda" sub="Encuentra la dosis de energía perfecta para ti."/>

        <div className="flex flex-wrap justify-center gap-2 md:gap-4 my-8 md:my-12 sticky top-[80px] md:top-[100px] bg-black/80 backdrop-blur-md py-4 z-20">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 border-2 ${
                activeCategory === category
                  ? 'bg-yellow-500 text-black border-yellow-500'
                  : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 hover:border-yellow-500'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {filteredProducts.map(item => (
                    <ProductCard key={item.id} item={item} />
                ))}
            </div>
        ) : (
            <p className="text-center text-gray-500 mt-10">No se encontraron productos en esta categoría.</p>
        )}
      </div>
    </div>
  );
};

export default StorePage;