import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./pages-css/Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  // La montare, încărcăm articolele din localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      // Asigurăm că fiecare articol are o cantitate (default 1)
      const items = JSON.parse(storedCart).map(item => ({
        ...item,
        quantity: item.quantity || 1,
      }));
      setCartItems(items);
    }
  }, []);

  // Funcție pentru a actualiza localStorage
  const updateLocalStorage = (items) => {
    localStorage.setItem("cartItems", JSON.stringify(items));
  };

  // Modificarea cantității unui articol
  const handleQuantityChange = (id, newQuantity) => {
    const updatedItems = cartItems.map(item => {
      if (item.id === id) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(updatedItems);
    updateLocalStorage(updatedItems);
  };

  // Șterge un articol din coș
  const handleDelete = (id) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);
    updateLocalStorage(updatedItems);
  };

  // Calculează totalul de bani
  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => {
      // Prețul este considerat a fi un număr; dacă este string, se poate face parseFloat
      const price = typeof item.price === "number" ? item.price : parseFloat(item.price);
      return acc + price * item.quantity;
    }, 0);
  };

  return (
    <div className="cart-container">
      <h1>Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="cart-container__empty">
          <p>Momentan nu ai cărți în coș.</p>
          <Link to="/store">
            <button className="cart-container__store-button">Vezi cărți în magazin</button>
          </Link>
        </div>
      ) : (
        <div className="cart-container__items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-container__item">
              <img
                src={item.cover}
                alt={`Coperta cărții ${item.title}`}
                className="cart-container__item-cover"
              />
              <div className="cart-container__item-details">
                <h3 className="cart-container__item-title">{item.title}</h3>
                <p className="cart-container__item-author">Autor: {item.author}</p>
                <p className="cart-container__item-price">
                  Preț: {item.price} RON
                </p>
                <div className="cart-container__item-quantity">
                  <label htmlFor={`quantity-${item.id}`}>Cantitate:</label>
                  <input
                    id={`quantity-${item.id}`}
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.id, parseInt(e.target.value))
                    }
                  />
                </div>
                <button
                  className="cart-container__item-delete"
                  onClick={() => handleDelete(item.id)}
                >
                  Șterge
                </button>
              </div>
            </div>
          ))}
          <div className="cart-container__total">
            <h2>Total: {calculateTotal().toFixed(2)} RON</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
