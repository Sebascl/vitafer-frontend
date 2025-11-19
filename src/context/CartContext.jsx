import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import Cookies from 'js-cookie';
import { vitaferProducts as baseVitaferProducts, vitaferOffers as baseVitaferOffers } from '../constants';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Inicializar carrito desde Cookies
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = Cookies.get('cartItems');
    try { 
      return storedCart ? JSON.parse(storedCart) : []; 
    } catch (e) { 
      console.error("Error parsing cart from cookies", e); 
      return []; 
    }
  });

  const [notification, setNotification] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Estado del despachador (Admin)
  const [dispatcher, setDispatcher] = useState(() => {
    try { 
      const storedDispatcher = localStorage.getItem('dispatcher'); 
      return storedDispatcher ? JSON.parse(storedDispatcher) : null; 
    } catch (e) { 
      console.error("Error parsing dispatcher from localStorage", e); 
      return null; 
    }
  });

  const [allProductsWithStock, setAllProductsWithStock] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  
  // URL del Backend
  const backendApiUrl = import.meta.env.VITE_BACKEND_API_URL;

  // --- Lógica de Stock y Precios ---
  const fetchStockAndMergeProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    // Unimos los productos base y las ofertas del archivo constants
    const localProductData = [...baseVitaferProducts, ...baseVitaferOffers];
    const productIds = localProductData.map(p => p.id).filter(Boolean);

    if (productIds.length === 0) {
      setAllProductsWithStock(localProductData.map(p => ({ ...p, stock: 0 })));
      setIsLoadingProducts(false);
      return;
    }

    if (!backendApiUrl) {
      console.warn("VITE_BACKEND_API_URL no configurada. Usando stock 0.");
      setAllProductsWithStock(localProductData.map(p => ({ ...p, stock: 0 })));
      setIsLoadingProducts(false);
      return;
    }

    try {
      // Pedimos stock y precios actualizados al backend
      const response = await fetch(`${backendApiUrl}/api/products/data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds }),
      });

      if (!response.ok) {
        throw new Error('Error fetching product data');
      }

      const dataMap = await response.json();

      // Fusionamos la info estática con la info del servidor
      const mergedProducts = localProductData.map(p => {
         const dbData = dataMap[p.id];
         return {
             ...p,
             stock: dbData?.stock !== undefined ? dbData.stock : 0,
             // Si el backend tiene precio, lo usamos (convirtiéndolo a string para consistencia), si no, usamos el local
             price: dbData?.price !== undefined ? dbData.price.toString() : p.price, 
         };
      });
      setAllProductsWithStock(mergedProducts);

    } catch (error) {
      console.error("Error cargando datos de productos:", error);
      // Fallback seguro
      setAllProductsWithStock(localProductData.map(p => ({ ...p, stock: 0 })));
    } finally {
      setIsLoadingProducts(false);
    }
  }, [backendApiUrl]);

  useEffect(() => {
    fetchStockAndMergeProducts();
  }, [fetchStockAndMergeProducts]);

  // --- Efectos Secundarios ---
  useEffect(() => { 
    if (notification) { 
      const timer = setTimeout(() => setNotification(''), 3000); 
      return () => clearTimeout(timer); 
    } 
  }, [notification]);

  useEffect(() => { 
    try { 
      Cookies.set('cartItems', JSON.stringify(cartItems), { expires: 7 }); 
    } catch (e) { 
      console.error("Error saving cart to cookies", e); 
    } 
  }, [cartItems]);

  useEffect(() => { 
    try { 
      if (dispatcher) { 
        localStorage.setItem('dispatcher', JSON.stringify(dispatcher)); 
      } else { 
        localStorage.removeItem('dispatcher'); 
      } 
    } catch (e) { 
      console.error("Error saving dispatcher to localStorage", e); 
    } 
  }, [dispatcher]);

  // --- Helpers de Precio ---
  const getNumericPrice = useCallback((priceData, quantity = 1) => {
    if (typeof priceData === 'number') return priceData; 
    if (typeof priceData === 'string') {
      try { 
        return parseFloat(priceData.replace(/[^0-9.-]+/g, "").replace('.', '')); 
      } catch (e) { return 0; }
    } else if (Array.isArray(priceData) && priceData.length > 0) {
      let applicableTier = priceData[0];
      for (let i = priceData.length - 1; i >= 0; i--) { 
        if (quantity >= priceData[i].quantity) { 
          applicableTier = priceData[i]; 
          break; 
        } 
      }
      return applicableTier.pricePerUnit;
    }
    return 0;
  }, []);

  const formatMXN = useCallback(value => 
    typeof value === 'number' ? value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 }) : '$0', 
  []);

  // --- Acciones del Carrito ---
  const addToCart = useCallback((productToAdd, quantityToAdd = 1) => {
      const productWithStock = allProductsWithStock.find(p => p.id === productToAdd.id);

      if (!productWithStock || productWithStock.stock <= 0) {
        setNotification(`${productToAdd.name} está agotado.`);
        return;
      }

      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === productToAdd.id);
        const currentCartQuantity = existingItem ? existingItem.quantity : 0;

        if (productWithStock.stock < currentCartQuantity + quantityToAdd) {
          setNotification(`Stock insuficiente. Disponible: ${productWithStock.stock}.`);
          return prevItems;
        }

        if (existingItem) {
          return prevItems.map(item =>
            item.id === productToAdd.id
              ? { ...item, quantity: item.quantity + quantityToAdd }
              : item
          );
        } else {
          return [...prevItems, { 
            ...productToAdd, 
            quantity: quantityToAdd, 
            currentStockSnapshot: productWithStock.stock, 
            price: productWithStock.price // Guardamos el precio actualizado
          }];
        }
      });
      setNotification(`${productToAdd.name} añadido!`);
  }, [allProductsWithStock, setNotification]);

  // Función Compra Inmediata
  const buyNow = useCallback((product, quantity) => {
      addToCart(product, quantity);
      setIsCartOpen(true);
  }, [addToCart]);

  const removeFromCart = useCallback(productId => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, amount) => {
    setCartItems(prevItems => {
      const itemInCart = prevItems.find(item => item.id === productId);
      if (!itemInCart) return prevItems;

      const productWithStock = allProductsWithStock.find(p => p.id === productId);
      if (!productWithStock) return prevItems.filter(item => item.id !== productId);

      let newQuantity = itemInCart.quantity + amount;

      if (amount > 0 && newQuantity > productWithStock.stock) {
        setNotification(`Stock máximo alcanzado.`);
        newQuantity = productWithStock.stock;
      }

      newQuantity = Math.max(0, newQuantity);

      if (newQuantity === 0) {
        return prevItems.filter(item => item.id !== productId);
      } else {
        return prevItems.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item);
      }
    });
  }, [allProductsWithStock, setNotification]);

  const clearCart = useCallback(() => { setCartItems([]); }, []);

  // --- Autenticación Dispatcher ---
  const loginDispatcher = useCallback(async (username, password) => {
    if (!backendApiUrl) { 
      console.error("VITE_BACKEND_API_URL no configurada."); 
      throw new Error("Error de configuración"); 
    }
    try {
      const response = await fetch(`${backendApiUrl}/api/auth/dispatcher/login`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ username, password }), 
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error en login');
      setDispatcher(data.user);
      return data;
    } catch (error) { 
      console.error("Error en loginDispatcher:", error); 
      setDispatcher(null); 
      throw error; 
    }
  }, [backendApiUrl]);

  const logoutDispatcher = useCallback(() => { setDispatcher(null); }, []);

  const value = {
    cartItems, 
    addToCart, 
    buyNow,
    removeFromCart, 
    updateQuantity,
    itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    cartTotal: cartItems.reduce((total, item) => {
      const productData = allProductsWithStock.find(p => p.id === item.id);
      if (!productData) return total;
      // Usamos el precio actualizado del backend si existe
      const priceToUse = productData.price || item.price;
      const pricePerUnit = getNumericPrice(priceToUse, item.quantity);
      return total + (pricePerUnit * item.quantity);
    }, 0),
    getNumericPrice, 
    formatMXN, 
    notification, 
    setNotification,
    isCartOpen, 
    setIsCartOpen, 
    clearCart,
    dispatcher, 
    loginDispatcher, 
    logoutDispatcher,
    allProductsWithStock,
    isLoadingProducts,
    refreshProductsStock: fetchStockAndMergeProducts
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};