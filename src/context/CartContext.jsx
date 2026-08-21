import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('philos_cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('philos_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (newItem) => {
    setCart((prevCart) => {
      const uniqueItem = { 
        ...newItem, 
        cartId: 'item_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9), 
        quantity: 1 
      };
      return [...prevCart, uniqueItem];
    });
  };

  const removeFromCart = (identifier) => {
    setCart((prevCart) => {
      // If identifier is a number, filter out by row index
      if (typeof identifier === 'number') {
        return prevCart.filter((_, idx) => idx !== identifier);
      }
      // Otherwise filter by cartId string
      const filtered = prevCart.filter(item => item.cartId !== identifier);
      // Fallback if ID match fails: remove the first item or clear if single
      if (filtered.length === prevCart.length && prevCart.length > 0) {
        return prevCart.slice(1);
      }
      return filtered;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('philos_cart');
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, isCartOpen, setIsCartOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
