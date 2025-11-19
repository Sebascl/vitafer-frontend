import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import Cookies from 'js-cookie';
import { vitaferProducts as baseVitaferProducts, vitaferOffers as baseVitaferOffers } from '../constants';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = Cookies.get('cartItems');
    try { return storedCart ? JSON.parse(storedCart) : []; }
    catch (e) { return []; }
  });
  const [notification, setNotification] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [dispatcher, setDispatcher] = useState(() => {
    try { const storedDispatcher = localStorage.getItem('dispatcher'); return storedDispatcher ? JSON.parse(storedDispatcher) : null; }
    catch (e) { return null; }
  });

  const [allProductsWithStock, setAllProductsWithStock] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const backendApiUrl = import.meta.env.VITE_BACKEND_API_URL;

  const fetchStockAndMergeProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    const localProductData = [...baseVitaferProducts, ...baseVitaferOffers];
    const productIds = localProductData.map(p => p.id).filter(Boolean);

    if (productIds.length === 0 || !backendApiUrl) {
      setAllProductsWithStock(localProductData.map(p => ({ ...p, stock: 0 })));
      setIsLoadingProducts(false);
      return;
    }

    try {
      const response = await fetch(`${backendApiUrl}/api/products/data`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productIds }),
      });
      const dataMap = await response.json();
      const mergedProducts = localProductData.map(p => {
         const dbData = dataMap[p.id];
         return {
             ...p,
             stock: dbData?.stock !== undefined ? dbData.stock : 0,
             price: dbData?.price !== undefined ? dbData.price.toString() : p.price, 
         };
      });
      setAllProductsWithStock(mergedProducts);
    } catch (error) {
      setAllProductsWithStock(localProductData.map(p => ({ ...p, stock: 0 })));
    } finally { setIsLoadingProducts(false); }
  }, [backendApiUrl]);

  useEffect(() => { fetchStockAndMergeProducts(); }, [fetchStockAndMergeProducts]);
  useEffect(() => { if (notification) { const timer = setTimeout(() => setNotification(''), 3000); return () => clearTimeout(timer); } }, [notification]);
  useEffect(() => { try { Cookies.set('cartItems', JSON.stringify(cartItems), { expires: 7 }); } catch (e) {} }, [cartItems]);
  useEffect(() => { try { if (dispatcher) { localStorage.setItem('dispatcher', JSON.stringify(dispatcher)); } else { localStorage.removeItem('dispatcher'); } } catch (e) {} }, [dispatcher]);

  const getNumericPrice = useCallback((priceData, quantity = 1) => {
    if (typeof priceData === 'number') return priceData; 
    if (typeof priceData === 'string') {
      try { return parseFloat(priceData.replace(/[^0-9.-]+/g, "").replace('.', '')); } catch (e) { return 0; }
    } else if (Array.isArray(priceData) && priceData.length > 0) {
      let applicableTier = priceData[0];
      for (let i = priceData.length - 1; i >= 0; i--) { if (quantity >= priceData[i].quantity) { applicableTier = priceData[i]; break; } }
      return applicableTier.pricePerUnit;
    }
    return 0;
  }, []);

  const formatMXN = useCallback(value => typeof value === 'number' ? value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 }) : '$0', []);

  const addToCart = useCallback((productToAdd, quantityToAdd = 1) => {
      const productWithStock = allProductsWithStock.find(p => p.id === productToAdd.id);
      if (!productWithStock || productWithStock.stock <= 0) { setNotification(`${productToAdd.name} agotado.`); return; }

      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === productToAdd.id);
        const currentCartQuantity = existingItem ? existingItem.quantity : 0;
        if (productWithStock.stock < currentCartQuantity + quantityToAdd) { setNotification(`Stock insuficiente.`); return prevItems; }

        if (existingItem) {
          return prevItems.map(item => item.id === productToAdd.id ? { ...item, quantity: item.quantity + quantityToAdd } : item);
        } else {
          return [...prevItems, { ...productToAdd, quantity: quantityToAdd, currentStockSnapshot: productWithStock.stock, price: productWithStock.price }];
        }
      });
      setNotification(`${productToAdd.name} añadido!`);
  }, [allProductsWithStock, setNotification]);

  const buyNow = useCallback((product, quantity) => {
      addToCart(product, quantity);
      setIsCartOpen(true);
  }, [addToCart]);

  const removeFromCart = useCallback(productId => { setCartItems(prevItems => prevItems.filter(item => item.id !== productId)); }, []);
  
  const updateQuantity = useCallback((productId, amount) => {
    setCartItems(prevItems => {
      const itemInCart = prevItems.find(item => item.id === productId);
      if (!itemInCart) return prevItems;
      const productWithStock = allProductsWithStock.find(p => p.id === productId);
      if (!productWithStock) return prevItems.filter(item => item.id !== productId);
      let newQuantity = Math.max(0, itemInCart.quantity + amount);
      if (amount > 0 && newQuantity > productWithStock.stock) newQuantity = productWithStock.stock;
      if (newQuantity === 0) return prevItems.filter(item => item.id !== productId);
      return prevItems.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item);
    });
  }, [allProductsWithStock]);

  const clearCart = useCallback(() => { setCartItems([]); }, []);

  const loginDispatcher = useCallback(async (username, password) => {
    if (!backendApiUrl) throw new Error("Configuración errónea");
    const res = await fetch(`${backendApiUrl}/api/auth/dispatcher/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }), });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    setDispatcher(data.user);
    return data;
  }, [backendApiUrl]);

  const logoutDispatcher = useCallback(() => { setDispatcher(null); }, []);

  const value = {
    cartItems, addToCart, removeFromCart, updateQuantity, buyNow,
    itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    cartTotal: cartItems.reduce((total, item) => {
      const productData = allProductsWithStock.find(p => p.id === item.id);
      if (!productData) return total;
      return total + (getNumericPrice(productData.price, item.quantity) * item.quantity);
    }, 0),
    getNumericPrice, formatMXN, notification, setNotification,
    isCartOpen, setIsCartOpen, clearCart, dispatcher, loginDispatcher, logoutDispatcher,
    allProductsWithStock, isLoadingProducts, refreshProductsStock: fetchStockAndMergeProducts
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};