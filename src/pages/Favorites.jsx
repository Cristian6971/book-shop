import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./pages-css/Favorites.css";

const getCoverUrl = (coverId) => {
  if (typeof coverId === "string" && coverId.startsWith("http")) {
    return coverId; // Dacă este deja un URL complet
  }
  if (coverId) {
    return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`; // Construcție URL pentru Open Library
  }
  return "/path/to/default-image.jpg"; // Imagine implicită dacă nu există copertă
};

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);

  // La montare, încărcăm favoritele din localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Adaugă cartea în coș
  const handleAddToCart = (favorite) => {
    const cartBook = {
      id: favorite.id,
      title: favorite.title,
      cover: getCoverUrl(favorite.cover), // Salvăm URL-ul corect al imaginii
      author: favorite.author,
      price: favorite.price,
    };

    const storedCart = localStorage.getItem("cartItems");
    const cart = storedCart ? JSON.parse(storedCart) : [];

    cart.push(cartBook);
    localStorage.setItem("cartItems", JSON.stringify(cart));

    navigate("/cart");
  };

  // Șterge cartea din favorite
  const handleRemoveFromFavorites = (favoriteId) => {
    const storedFavorites = localStorage.getItem("favorites");
    if (!storedFavorites) return;

    const updatedFavorites = JSON.parse(storedFavorites).filter((fav) => fav.id !== favoriteId);

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
  };

  return (
    <div className="favorites-container">
      <h1>Favorite</h1>
      <div className="favorites-items">
        {favorites.length === 0 ? (
          <p>Nu ai adăugat nici o carte la favorite.</p>
        ) : (
          favorites.map((favorite) => (
            <div className="favorites-item" key={favorite.id}>
              <img
                src={getCoverUrl(favorite.cover)}
                alt={favorite.title}
                className="favorites-item-cover"
              />
              <div className="favorites-item-details">
                <h3>{favorite.title}</h3>
                <p>{favorite.author}</p>
                <p>{favorite.price} RON</p>
              </div>
              <button onClick={() => handleAddToCart(favorite)}>Adaugă în coș</button>
              <button onClick={() => handleRemoveFromFavorites(favorite.id)}>Șterge din favorite</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Favorites;
