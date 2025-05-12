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

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    Cookies.set('cartItems', JSON.stringify(cartItems), { expires: 7 });
  }, [cartItems]);

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
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};