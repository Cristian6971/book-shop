// src/pages/Store.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getBooksBySubject, getCoverUrl } from "../api/endpoints";
import "./pages-css/Store.css";

// Lista de categorii
const categories = [
  { id: "drama", label: "Drama" },
  { id: "comedy", label: "Comedie" },
  { id: "fiction", label: "Ficțiune" },
  { id: "mystery", label: "Mister" },
];

// Variabilă globală pentru cache – se va păstra atâta timp cât aplicația nu este reîncărcată
let cachedCategoryCovers = null;

const Store = () => {
  // Dacă avem deja date în cache, le folosim pentru inițializare
  const [categoryCovers, setCategoryCovers] = useState(
    cachedCategoryCovers || {}
  );
  const [loading, setLoading] = useState(!cachedCategoryCovers);
  const [error, setError] = useState(null);

  // Ref pentru a ține evidența cover_id-urilor deja alese
  const usedCoversRef = useRef(new Set());

  useEffect(() => {
    // Dacă datele sunt deja în cache, nu mai facem fetch
    if (cachedCategoryCovers) {
      return;
    }
    // Utilizăm Promise.allSettled pentru a prelua datele pentru toate categoriile
    Promise.allSettled(
      categories.map((category) => getBooksBySubject(category.id))
    )
      .then((results) => {
        const newCovers = {};
        categories.forEach((category, index) => {
          const result = results[index];
          if (
            result.status === "fulfilled" &&
            result.value &&
            result.value.works &&
            result.value.works.length > 0
          ) {
            // Selectăm prima carte care are un cover_id neutilizat
            const chosenBook =
              result.value.works.find(
                (book) =>
                  book.cover_id && !usedCoversRef.current.has(book.cover_id)
              ) || result.value.works[0];
            if (chosenBook && chosenBook.cover_id) {
              usedCoversRef.current.add(chosenBook.cover_id);
            }
            newCovers[category.id] = chosenBook;
          } else {
            newCovers[category.id] = null;
          }
        });
        cachedCategoryCovers = newCovers;
        setCategoryCovers(newCovers);
      })
      .catch((err) => {
        // Această secțiune este mai puțin probabil să fie declanșată, deoarece allSettled nu respinge
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="store-container">
      <h1 className="store-title">Alege o categorie de carte</h1>
      {loading && <p>Se încarcă...</p>}
      {error && <p>Eroare: {error.message}</p>}
      <div className="categories-grid">
        {categories.map((category) => {
          const book = categoryCovers[category.id];
          return (
            <Link
              key={category.id}
              to={`/store/${category.id}`}
              className="category-card"
            >
              {book ? (
                <>
                  <img
                    src={
                      book.cover_id
                        ? getCoverUrl(book.cover_id, "M")
                        : "default-image.png"
                    }
                    alt={book.title}
                    className="category-cover"
                  />
                  <h3 className="category-label">{category.label}</h3>
                </>
              ) : (
                <p>Se încarcă...</p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Store;
