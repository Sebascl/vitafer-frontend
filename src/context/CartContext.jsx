import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import Cookies from 'js-cookie'; 

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = Cookies.get('cartItems');
    return storedCart ? JSON.parse(storedCart) : [];
  });
  const [notification, setNotification] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [dispatcher, setDispatcher] = useState(() => {
    try {
      const storedDispatcher = localStorage.getItem('dispatcher');
      return storedDispatcher ? JSON.parse(storedDispatcher) : null;
    } catch (error) {
      console.error("Error al leer dispatcher de localStorage:", error);
      return null;
    }
  });

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    try {
        Cookies.set('cartItems', JSON.stringify(cartItems), { expires: 7 });
    } catch (error) {
        console.error("Error al guardar carrito en cookies:", error);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
        if (dispatcher) {
            localStorage.setItem('dispatcher', JSON.stringify(dispatcher));
        } else {
            localStorage.removeItem('dispatcher');
        }
    } catch (error) {
        console.error("Error al guardar dispatcher en localStorage:", error);
    }
  }, [dispatcher]);


  const getNumericPrice = useCallback((priceData, quantity = 1) => {
    if (typeof priceData === 'string') {
      try {
        return parseFloat(priceData.replace(/[^0-9.-]+/g, "").replace('.', ''));
      } catch (e) {
        return 0;
      }
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
    value.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }),
    []
  );

  const addToCart = useCallback(
    productToAdd => {
      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.name === productToAdd.name);
        if (existingItem) {
          return prevItems.map(item =>
            item.name === productToAdd.name
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prevItems, { ...productToAdd, quantity: 1 }];
        }
      });
      setNotification(`${productToAdd.name} añadido al carrito!`);
    },
    []
  );

  const removeFromCart = useCallback(productName => {
    setCartItems(prevItems => prevItems.filter(item => item.name !== productName));
  }, []);

  const updateQuantity = useCallback((productName, amount) => {
    setCartItems(prevItems =>
      prevItems
        .map(item =>
          item.name === productName
            ? { ...item, quantity: Math.max(0, item.quantity + amount) }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  }, []);

  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => {
    const pricePerUnit = getNumericPrice(item.pricingTiers || item.price, item.quantity);
    return total + pricePerUnit * item.quantity;
  }, 0);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // --- NUEVAS FUNCIONES PARA AUTENTICACIÓN DEL DESPACHADOR ---
  const loginDispatcher = useCallback(async (username, password) => {
    const backendApiUrl = import.meta.env.VITE_BACKEND_API_URL; // Asegúrate de tener esta variable en tu .env del frontend
    if (!backendApiUrl) {
        console.error("VITE_BACKEND_API_URL no está configurada en el frontend.");
        throw new Error("Error de configuración: URL del backend no encontrada.");
    }
    try {
      const response = await fetch(`${backendApiUrl}/api/auth/dispatcher/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error en el login del despachador');
      }
      setDispatcher(data.user); // Guarda el usuario (ej. { username: '...', role: '...' })
      // localStorage ya se actualiza por el useEffect que escucha a 'dispatcher'
      return data; // Devuelve la respuesta completa por si necesitas el token o algo más después
    } catch (error) {
      console.error("Error en loginDispatcher:", error);
      setDispatcher(null); // Asegura limpiar en caso de error
      localStorage.removeItem('dispatcher');
      throw error; // Relanza el error para que el componente de login lo maneje
    }
  }, []);

  const logoutDispatcher = useCallback(() => {
    setDispatcher(null);
    // localStorage ya se actualiza por el useEffect que escucha a 'dispatcher'
    // Aquí podrías añadir lógica para limpiar tokens si usaras JWT almacenados en el contexto
  }, []);


  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    itemCount,
    cartTotal,
    getNumericPrice,
    formatMXN,
    notification,
    isCartOpen,
    setIsCartOpen,
    clearCart,
    dispatcher,
    loginDispatcher,
    logoutDispatcher,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};