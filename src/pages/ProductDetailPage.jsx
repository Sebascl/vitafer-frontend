import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
// Ya no necesitas importar vitaferProducts/Offers aquí si allProductsWithStock los contiene todos
import { FaShippingFast } from 'react-icons/fa';

const ProductDetailPage = () => {
    const { productName } = useParams(); // Este será el ID o nombre del producto en la URL
    const {
        addToCart,
        formatMXN,
        getNumericPrice,
        setNotification,
        allProductsWithStock, // <-- Productos con stock del contexto
        isLoadingProducts     // <-- Estado de carga de productos/stock
    } = useCart();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [currentTotal, setCurrentTotal] = useState(0);
    const [recommendations, setRecommendations] = useState([]);
    // const [currentStock, setCurrentStock] = useState(0); // El stock vendrá de product.stock

    useEffect(() => {
        window.scrollTo(0, 0);

        if (isLoadingProducts || allProductsWithStock.length === 0) {
            return; // Espera a que los productos con stock estén cargados
        }

        const decodedIdentifier = decodeURIComponent(productName);
        // Busca el producto por ID primero, luego por nombre como fallback
        const foundProduct = allProductsWithStock.find(p => p.id === decodedIdentifier || p.name === decodedIdentifier);

        if (foundProduct) {
            setProduct(foundProduct);
            setQuantity(1);
            const otherProducts = allProductsWithStock
                .filter(p => p.id !== foundProduct.id && p.name !== foundProduct.name)
                .sort(() => 0.5 - Math.random())
                .slice(0, 3);
            setRecommendations(otherProducts);
        } else {
            console.error("Producto no encontrado en allProductsWithStock:", decodedIdentifier);
            navigate('/');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productName, isLoadingProducts, allProductsWithStock]); // Depende de que allProductsWithStock esté listo

    useEffect(() => {
        if (product) {
            let unitPrice;
            if (product.pricingTiers && product.pricingTiers.length > 0) {
                const tierForCurrentQuantity = product.pricingTiers.slice().reverse().find(tier => quantity >= tier.quantity) || product.pricingTiers[0];
                unitPrice = tierForCurrentQuantity.pricePerUnit;
            } else if (product.price) {
                unitPrice = getNumericPrice(product.price);
            }
            if (typeof unitPrice === 'number') {
                setCurrentTotal(unitPrice * quantity);
            }
        }
    }, [product, quantity, getNumericPrice]);

    const handleQuantityChange = (amount) => {
        setQuantity(prevQuantity => {
            const newQuantity = Math.max(1, prevQuantity + amount);
            if (product && product.stock > 0 && newQuantity > product.stock) {
                setNotification(`Solo quedan ${product.stock} unidades de ${product.name}.`);
                return product.stock;
            }
            return newQuantity;
        });
    };

    const handleAddToCart = () => {
        if (product) {
            if (product.stock <= 0) {
                setNotification(`${product.name} está agotado.`);
                return;
            }
            if (quantity > product.stock) {
                setNotification(`No puedes añadir ${quantity} de ${product.name}. Solo quedan ${product.stock}.`);
                setQuantity(product.stock);
                return;
            }
            addToCart(product, quantity);
            // setNotification se llama en addToCart del contexto
        }
    };

    const handleGoBackToList = () => {
        navigate('/#skills');
    };

    if (isLoadingProducts && !product) {
        return <div className="min-h-screen flex items-center justify-center bg-black text-white text-xl">Cargando producto...</div>;
    }
    if (!product) {
        return <div className="min-h-screen flex items-center justify-center bg-black text-white text-xl">Producto no encontrado.</div>;
    }

    let displayUnitPrice;
    if (product.pricingTiers && product.pricingTiers.length > 0) {
        const baseTier = product.pricingTiers.find(tier => tier.quantity === 1) || product.pricingTiers[0];
        displayUnitPrice = baseTier.pricePerUnit;
    } else if (product.price) {
        displayUnitPrice = getNumericPrice(product.price);
    }

    const currentStock = product.stock !== undefined ? product.stock : 0;

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
                <button
                    onClick={handleGoBackToList}
                    className="mb-6 sm:mb-8 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-black bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-yellow-500 transition-colors"
                >
                    &larr; Volver a Productos
                </button>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start mb-12 md:mb-16">
                    <div className="bg-gray-800/50 rounded-xl shadow-2xl p-4 sm:p-6 flex justify-center items-center aspect-[4/3] md:aspect-auto min-h-[300px] md:min-h-[450px]">
                        <img
                            src={product.modelPath}
                            alt={product.name}
                            className="max-h-[280px] sm:max-h-[350px] md:max-h-[420px] object-contain"
                        />
                    </div>
                    <div className="flex flex-col space-y-4 md:space-y-5">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-yellow-300 drop-shadow-lg">{product.name}</h1>
                        <p className="text-gray-400 text-base sm:text-lg"><span className="font-semibold text-gray-200">Presentación:</span> {product.presentation}</p>
                        {typeof displayUnitPrice === 'number' && (
                            <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white my-2">
                                {formatMXN(displayUnitPrice)}
                                {product.unitDescription && product.unitDescription !== "Paquete completo" && !(product.pricingTiers && product.pricingTiers.length > 0) ? ` ${product.unitDescription}` : ''}
                                {product.pricingTiers && product.pricingTiers.length > 0 && product.unitDescription ? ` ${product.unitDescription}` : ''}
                            </p>
                        )}
                        {product.pricingTiers && product.pricingTiers.find(tier => tier.quantity > 1) &&
                            <p className="text-sm text-yellow-400 -mt-2 mb-2">Descuentos por volumen disponibles. Añade más para ver el precio actualizado.</p>
                        }
                        <div className="flex items-center space-x-2 text-green-400 my-3 py-2 px-3 bg-green-500/10 rounded-md border border-green-500/30">
                            <FaShippingFast size={20} className="flex-shrink-0" />
                            <span className="font-semibold text-sm sm:text-base">¡Envío Gratis a todo México!</span>
                        </div>

                        {currentStock <= 0 && (
                            <p className="text-red-500 font-bold my-2 text-lg uppercase">Producto Agotado</p>
                        )}
                        {currentStock > 0 && currentStock <= 10 && (
                            <p className="text-orange-400 font-semibold my-2 text-base">¡Últimas {currentStock} unidades!</p>
                        )}

                        <p className="text-gray-300 text-base sm:text-lg leading-relaxed">{product.description}</p>

                        {currentStock > 0 && (
                            <div className="pt-4 space-y-5">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <p className="text-gray-100 font-semibold text-base sm:text-lg">Cantidad:</p>
                                    <div className="flex items-center border border-gray-600 rounded-md">
                                        <button onClick={() => handleQuantityChange(-1)} className="px-4 py-2 text-lg sm:text-xl text-yellow-400 hover:bg-gray-700/50 rounded-l-md transition-colors" disabled={quantity <= 1}>-</button>
                                        <span className="px-5 py-2 text-lg sm:text-xl font-semibold bg-gray-700/30 text-white">{quantity}</span>
                                        <button onClick={() => handleQuantityChange(1)} className="px-4 py-2 text-lg sm:text-xl text-yellow-400 hover:bg-gray-700/50 rounded-r-md transition-colors" disabled={quantity >= currentStock}>+</button>
                                    </div>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    disabled={currentStock <= 0 || quantity > currentStock}
                                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3.5 px-6 rounded-lg text-base sm:text-lg shadow-md hover:shadow-yellow-500/40 transition-all duration-150 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {currentStock > 0 ? `Añadir ${quantity} al Carrito (${formatMXN(currentTotal)})` : 'Producto Agotado'}
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                <section className="bg-gray-800/50 p-6 sm:p-8 rounded-xl shadow-2xl mb-12 md:mb-16">
                    <h2 className="text-2xl sm:text-3xl font-bold text-yellow-300 mb-6 border-b-2 border-yellow-600/50 pb-3">Más Detalles del Producto</h2>
                    <div className="space-y-6 prose prose-sm sm:prose-base prose-invert max-w-none text-gray-300">
                        {product.detailedDescription && (<div> <h3 className="text-xl font-semibold text-yellow-200 !mb-2">Descripción Completa</h3> <p>{product.detailedDescription}</p> </div>)}
                        {product.benefits && product.benefits.length > 0 && (<div> <h3 className="text-xl font-semibold text-yellow-200 !mb-2">Principales Beneficios</h3> <ul className="list-disc list-inside space-y-1"> {product.benefits.map((benefit, i) => <li key={i}>{benefit}</li>)} </ul> </div>)}
                        {product.ingredients && product.ingredients.length > 0 && (<div> <h3 className="text-xl font-semibold text-yellow-200 !mb-2">Ingredientes</h3> <ul className="list-disc list-inside space-y-1"> {product.ingredients.map((ing, i) => <li key={i}>{ing}</li>)} </ul> </div>)}
                        {product.usageInstructions && (<div> <h3 className="text-xl font-semibold text-yellow-200 !mb-2">Modo de Uso</h3> <p className="whitespace-pre-line">{product.usageInstructions}</p> </div>)}
                        {product.warnings && product.warnings.length > 0 && (<div className="mt-6 bg-red-900/30 border border-red-700/50 p-4 rounded-lg"> <h3 className="text-xl font-semibold text-red-300 !mb-2">Advertencias Importantes</h3> <ul className="list-disc list-inside space-y-1 text-red-200/90 text-xs sm:text-sm"> {product.warnings.map((warning, i) => <li key={i}>{warning}</li>)} </ul> </div>)}
                    </div>
                </section>

                {recommendations.length > 0 && (
                    <section className="pt-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-yellow-300 mb-8 text-center">También te podría interesar</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {recommendations.map(recProduct => (
                                <Link
                                    key={recProduct.id || recProduct.name}
                                    to={`/producto/${encodeURIComponent(recProduct.id || recProduct.name)}`}
                                    className="block bg-gray-800/70 p-4 rounded-xl shadow-lg hover:shadow-yellow-500/20 border border-transparent hover:border-yellow-600/50 transition-all duration-300 group transform hover:scale-105"
                                >
                                    <div className="w-full h-48 sm:h-56 flex items-center justify-center bg-black/40 rounded-lg mb-4 overflow-hidden">
                                        <img src={recProduct.modelPath} alt={recProduct.name} className="w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-110" />
                                    </div>
                                    <h3 className="font-semibold text-base sm:text-lg text-yellow-200 group-hover:text-yellow-100 transition-colors truncate mb-1" title={recProduct.name}>{recProduct.name}</h3>
                                    {(recProduct.price || (recProduct.pricingTiers && recProduct.pricingTiers[0])) &&
                                        <p className="text-lg sm:text-xl font-bold text-white">{formatMXN(getNumericPrice(recProduct.pricingTiers || recProduct.price, 1))}</p>
                                    }
                                    {recProduct.stock !== undefined && recProduct.stock <= 0 && <p className="text-xs text-red-500 mt-1 font-semibold">AGOTADO</p>}
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default ProductDetailPage;