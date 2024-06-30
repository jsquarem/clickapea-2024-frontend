import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item._id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [
          ...prevItems,
          {
            ...item,
            id: item._id,
            quantity: 1,
          },
        ];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateItemQuantity = (id, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateItemQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};
