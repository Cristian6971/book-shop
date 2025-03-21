import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBookDetails, getCoverUrl } from "../api/endpoints";
import "./pages-css/BookDetails.css";

const calculateFixedPrice = (book) => {
  const minPrice = 10;
  const maxPrice = 50;
  let hash = 0;
  for (let i = 0; i < book.key.length; i++) {
    hash += book.key.charCodeAt(i);
  }
  const price = (hash % (maxPrice - minPrice + 1)) + minPrice;
  return `${price} RON`;
};

const BookDetails = () => {
  const { "*": bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // Elimină eventualele slash-uri de la începutul parametrului
        const cleanedBookId = bookId.replace(/^\/+/, "");
        // Verifică dacă parametrul include deja "works/".
        // Dacă nu, se adaugă pentru a construi URL-ul corect.
        const finalBookId = cleanedBookId.includes("works/")
          ? `/${cleanedBookId}`
          : `/works/${cleanedBookId}`;

        const data = await getBookDetails(finalBookId);
        setBook(data);

        if (data.authors) {
          const authorNames = await Promise.all(
            data.authors.map(async (authorObj) => {
              const authorId = authorObj.author?.key;
              if (!authorId) return "Autor necunoscut";

              try {
                const response = await fetch(`https://openlibrary.org${authorId}.json`);
                const authorData = await response.json();
                return authorData.name || "Autor necunoscut";
              } catch {
                return "Autor necunoscut";
              }
            })
          );
          setAuthors(authorNames);
        }
      } catch (err) {
        setError("Eroare la încărcarea detaliilor cărții.");
        console.error("Eroare în getBookDetails:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [bookId]);

  // Funcția de adăugare în coș și redirecționare către Cart.jsx
  const handleAddToCart = () => {
    if (!book) return;

    const cartBook = {
      id: book.key,
      title: book.title,
      cover:
        book.covers && book.covers.length > 0
          ? getCoverUrl(book.covers[0], "L")
          : "",
      author: authors.join(", "),
      price: calculateFixedPrice(book),
    };

    const storedCart = localStorage.getItem("cartItems");
    const cart = storedCart ? JSON.parse(storedCart) : [];

    cart.push(cartBook);
    localStorage.setItem("cartItems", JSON.stringify(cart));

    navigate("/cart");
  };

  // Funcția de adăugare la favorite fără pop-up
  const handleAddToFavorites = () => {
    if (!book) return;

    const favoriteBook = {
      id: book.key,
      title: book.title,
      cover:
        book.covers && book.covers.length > 0
          ? getCoverUrl(book.covers[0], "L")
          : "",
      author: authors.join(", "),
      price: calculateFixedPrice(book),
    };

    const storedFavorites = localStorage.getItem("favorites");
    const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

    favorites.push(favoriteBook);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  };

  if (loading) return <p>Se încarcă detaliile cărții...</p>;
  if (error) return <p>{error}</p>;
  if (!book) return <p>Cartea nu a fost găsită.</p>;

  return (
    <div className="book-details__container">
      <button
        className="book-details__back-button"
        onClick={() => navigate(-1)}
      >
        <span className="material-symbols-outlined">keyboard_backspace</span>
      </button>
      <div className="book-details__image">
        {book.covers?.length > 0 && (
          <img
            src={getCoverUrl(book.covers[0], "L")}
            alt={book.title}
            className="book-details__cover"
          />
        )}
      </div>
      <div className="book-details__info">
        <h1 className="book-details__title">{book.title}</h1>
        {authors.length > 0 && (
          <p className="book-details__authors">{authors.join(", ")}</p>
        )}
        <p className="book-details__description">
          {book.description?.value || book.description || "Descriere indisponibilă."}
        </p>
        {book.key && (
          <p className="book-details__price">
            Preț: {calculateFixedPrice(book)}
          </p>
        )}

        <div className="book-details__buttons">
          <button className="book-details__buy-button" onClick={handleAddToCart}>
            Cumpără acum
          </button>
          <button
            className="book-details__favorite-button"
            onClick={handleAddToFavorites}
          >
            Adaugă la favorite
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
