import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import Cookies from 'js-cookie';
import { vitaferProducts as baseVitaferProducts, vitaferOffers as baseVitaferOffers, fatherDayPromos as baseFatherDayPromos } from '../constants'; // Importa tus datos base

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = Cookies.get('cartItems');
    try { return storedCart ? JSON.parse(storedCart) : []; }
    catch (e) { console.error("Error parsing cart from cookies", e); return []; }
  });
  const [notification, setNotification] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [dispatcher, setDispatcher] = useState(() => {
    try { const storedDispatcher = localStorage.getItem('dispatcher'); return storedDispatcher ? JSON.parse(storedDispatcher) : null; }
    catch (e) { console.error("Error parsing dispatcher from localStorage", e); return null; }
  });

  const [allProductsWithStock, setAllProductsWithStock] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const backendApiUrl = import.meta.env.VITE_BACKEND_API_URL;

  const fetchStockAndMergeProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    const localProductData = [...baseVitaferProducts, ...baseVitaferOffers, ...baseFatherDayPromos]; 
    const productIds = localProductData.map(p => p.id).filter(Boolean);

    if (productIds.length === 0) {
        setAllProductsWithStock(localProductData.map(p => ({...p, stock: 0})));
        setIsLoadingProducts(false);
        return;
    }

    if (!backendApiUrl) {
        console.error("VITE_BACKEND_API_URL no está configurada en el frontend. No se puede cargar el stock.");
        setAllProductsWithStock(localProductData.map(p => ({ ...p, stock: 0 }))); // Fallback
        setIsLoadingProducts(false);
        return;
    }

    try {
      const response = await fetch(`${backendApiUrl}/api/products/stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds }),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'No se pudo cargar el stock de los productos');
      }
      
      const stockMap = await response.json();

      const mergedProducts = localProductData.map(p => ({
        ...p,
        stock: stockMap[p.id] !== undefined ? stockMap[p.id] : 0,
      }));
      setAllProductsWithStock(mergedProducts);

    } catch (error) {
      console.error("Error cargando stock de productos:", error);
      setAllProductsWithStock(localProductData.map(p => ({ ...p, stock: 0 })));
    } finally {
      setIsLoadingProducts(false);
    }
  }, [backendApiUrl]);

  useEffect(() => {
    fetchStockAndMergeProducts();
  }, [fetchStockAndMergeProducts]);

  useEffect(() => { if (notification) { const timer = setTimeout(() => setNotification(''), 3000); return () => clearTimeout(timer); } }, [notification]);
  useEffect(() => { try { Cookies.set('cartItems', JSON.stringify(cartItems), { expires: 7 }); } catch (e) { console.error("Error saving cart to cookies", e);}}, [cartItems]);
  useEffect(() => { try { if (dispatcher) { localStorage.setItem('dispatcher', JSON.stringify(dispatcher)); } else { localStorage.removeItem('dispatcher'); } } catch (e) { console.error("Error saving dispatcher to localStorage", e);}}, [dispatcher]);

  const getNumericPrice = useCallback((priceData, quantity = 1) => {
    if (typeof priceData === 'string') {
      try { return parseFloat(priceData.replace(/[^0-9.-]+/g, "").replace('.', '')); } catch (e) { return 0; }
    } else if (Array.isArray(priceData) && priceData.length > 0) {
      let applicableTier = priceData[0];
      for (let i = priceData.length - 1; i >= 0; i--) { if (quantity >= priceData[i].quantity) { applicableTier = priceData[i]; break; } }
      return applicableTier.pricePerUnit;
    }
    return 0;
  }, []);

  const formatMXN = useCallback(value => typeof value === 'number' ? value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 }) : '$0' , []);

  const addToCart = useCallback(
    (productToAdd, quantityToAdd = 1) => {
      const productWithStock = allProductsWithStock.find(p => p.id === productToAdd.id);

      if (!productWithStock) {
        setNotification(`Error: Producto ${productToAdd.name} no encontrado para verificar stock.`);
        return;
      }
      if (productWithStock.stock <= 0) {
          setNotification(`${productToAdd.name} está agotado.`);
          return;
      }

      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === productToAdd.id);
        const currentCartQuantity = existingItem ? existingItem.quantity : 0;

        if (productWithStock.stock < currentCartQuantity + quantityToAdd) {
          setNotification(`Stock insuficiente para ${productToAdd.name}. Disponible: ${productWithStock.stock}. En carrito: ${currentCartQuantity}. Intentas añadir: ${quantityToAdd}.`);
          // Opcional: Añadir solo lo disponible
          // const availableToAdd = productWithStock.stock - currentCartQuantity;
          // if (availableToAdd > 0) { /* lógica para añadir availableToAdd */ }
          return prevItems;
        }

        if (existingItem) {
          return prevItems.map(item =>
            item.id === productToAdd.id
              ? { ...item, quantity: item.quantity + quantityToAdd }
              : item
          );
        } else {
          // Al añadir nuevo, guardamos una copia del producto con su stock actual por si acaso,
          // aunque la verificación principal siempre debe ser contra allProductsWithStock
          return [...prevItems, { ...productToAdd, quantity: quantityToAdd, currentStockSnapshot: productWithStock.stock }];
        }
      });
      setNotification(`${productToAdd.name} (${quantityToAdd}) añadido(s) al carrito!`);
    },
    [allProductsWithStock, setNotification]
  );

  const removeFromCart = useCallback(productId => { // Cambiado a productId
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, amount) => {
    setCartItems(prevItems => {
        const itemInCart = prevItems.find(item => item.id === productId);
        if (!itemInCart) return prevItems;

        const productWithStock = allProductsWithStock.find(p => p.id === productId);
        if (!productWithStock) { // El producto ya no existe en el catálogo con stock
            setNotification(`El producto ${itemInCart.name} ya no está disponible.`);
            return prevItems.filter(item => item.id !== productId); // Eliminar del carrito
        }

        let newQuantity = itemInCart.quantity + amount;

        if (amount > 0 && newQuantity > productWithStock.stock) {
            setNotification(`No puedes añadir más de ${itemInCart.name}. Stock disponible: ${productWithStock.stock}.`);
            newQuantity = productWithStock.stock; // Ajusta a máximo stock
        }
        
        newQuantity = Math.max(0, newQuantity); // Asegura que no sea negativo

        if (newQuantity === 0) {
            return prevItems.filter(item => item.id !== productId);
        } else {
            return prevItems.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item);
        }
    });
  }, [allProductsWithStock, setNotification]);
  
  const clearCart = useCallback(() => { setCartItems([]); }, []);

  const loginDispatcher = useCallback(async (username, password) => {
    if (!backendApiUrl) { console.error("VITE_BACKEND_API_URL no está configurada."); throw new Error("Error de configuración"); }
    try {
      const response = await fetch(`${backendApiUrl}/api/auth/dispatcher/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }), });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error en login');
      setDispatcher(data.user);
      return data;
    } catch (error) { console.error("Error en loginDispatcher:", error); setDispatcher(null); throw error; }
  }, [backendApiUrl]);

  const logoutDispatcher = useCallback(() => { setDispatcher(null); }, []);

  const value = {
    cartItems, addToCart, removeFromCart, updateQuantity,
    itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    cartTotal: cartItems.reduce((total, item) => {
        const productData = allProductsWithStock.find(p => p.id === item.id);
        if (!productData) return total;
        const pricePerUnit = getNumericPrice(productData.pricingTiers || productData.price, item.quantity);
        return total + (pricePerUnit * item.quantity);
    }, 0),
    getNumericPrice, formatMXN, notification, setNotification,
    isCartOpen, setIsCartOpen, clearCart,
    dispatcher, loginDispatcher, logoutDispatcher,
    allProductsWithStock,
    isLoadingProducts,
    refreshProductsStock: fetchStockAndMergeProducts
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};