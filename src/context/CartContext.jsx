// src/context/CartContext.js
import React, { createContext, useState, useContext } from "react";

// Creăm contextul
const CartContext = createContext();

// Hook personalizat pentru acces rapid la context
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Funcție pentru a adăuga o carte în coș
  const addToCart = (book) => {
    setCart((prevCart) => {
      console.log("Coșul înainte de adăugare:", prevCart);  // Logăm coșul înainte de adăugare
      const updatedCart = [...prevCart, book];
      console.log("Coșul după adăugare:", updatedCart);  // Logăm coșul după adăugare
      return updatedCart;
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};
