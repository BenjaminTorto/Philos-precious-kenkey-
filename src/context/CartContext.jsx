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
      // If this exact item (same id + size) is already in the cart, just bump its quantity
      const existingIndex = prevCart.findIndex(
        (item) => item.id === newItem.id && item.size === newItem.size
      );

      if (existingIndex !== -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }

      const uniqueItem = {
        ...newItem,
        cartId: 'item_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9),
        quantity: 1,
      };
      return [...prevCart, uniqueItem];
    });
  };

  const removeFromCart = (cartId) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartId !== cartId));
  };

  const updateQuantity = (cartId, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.cartId === cartId ? { ...item, quantity: item.quantity + delta } : item
        )
        // If quantity drops to 0 or below, remove the item entirely
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('philos_cart');
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, isCartOpen, setIsCartOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
