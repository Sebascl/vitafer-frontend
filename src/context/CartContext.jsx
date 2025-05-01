import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

// --- Helper para obtener el precio numérico ---
const getNumericPrice = (priceData, quantity = 1) => {
  if (typeof priceData === 'string') {
    try {
      return parseFloat(priceData.replace(/[^0-9.-]+/g,"").replace('.', ''));
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
};

// --- Helper para formatear moneda ---
const formatMXN = (value) => value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 });

// --- Crear Contexto ---
const CartContext = createContext();

// --- Hook personalizado para usar el contexto ---
export const useCart = () => {
  return useContext(CartContext);
};

// --- Proveedor del Contexto ---
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [notification, setNotification] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false); // Estado para visibilidad del carrito

  // --- Limpiar notificación después de un tiempo ---
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification('');
      }, 3000); // Oculta después de 3 segundos
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // --- Funciones del Carrito ---
  const addToCart = useCallback((productToAdd) => {
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
    setNotification(`${productToAdd.name} añadido al carrito!`); // Muestra notificación
  }, []);

  const removeFromCart = useCallback((productName) => {
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

  // --- Cálculos derivados ---
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => {
    const pricePerUnit = getNumericPrice(item.pricingTiers || item.price, item.quantity);
    return total + (pricePerUnit * item.quantity);
  }, 0);

  // --- Valor proporcionado por el contexto ---
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    itemCount,
    cartTotal,
    getNumericPrice, // Exporta helpers si son necesarios fuera
    formatMXN,
    notification, // Exporta notificación
    isCartOpen,   // Exporta estado de visibilidad
    setIsCartOpen // Exporta función para cambiar visibilidad
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};