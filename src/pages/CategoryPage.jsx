import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getBooksBySubject, getCoverUrl } from "../api/endpoints";
import "./pages-css/CategoryPage.css";

// Funcție pentru calcularea unui preț fix bazat pe hash-ul cheii cărții
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

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10;

  useEffect(() => {
    fetchBooks(currentPage);
  }, [categoryId, currentPage]);

  const fetchBooks = async (page) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBooksBySubject(categoryId, page, booksPerPage);
      setBooks(data.works || []);
    } catch (err) {
      setError("Eroare la încărcarea cărților.");
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => setCurrentPage((prev) => prev + 1);
  const handlePreviousPage = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : 1));

  // Funcția de adăugare în coș
  const handleAddToCart = (book, e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!book) return;

    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const existingItem = cartItems.find((item) => item.id === book.key);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.push({
        id: book.key,
        title: book.title,
        author: book.authors?.[0]?.name || "Autor necunoscut",
        price: calculateFixedPrice(book),
        cover: book.cover_id ? getCoverUrl(book.cover_id, "M") : "default-image.png",
        quantity: 1,
      });
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  };

  if (loading) return <p>Se încarcă cărțile...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="category-page">
      <div className="category-page__container">
        <h1 className="category-page__title">Cărți din categoria: {categoryId}</h1>
        <div className="category-page__book-grid">
          {books.map((book) => (
            <div key={book.key} className="category-page__book-card">
              <div className="category-page__book-card-image">
                <Link to={`/store/books${book.key}`}>
                  {book.cover_id ? (
                    <img
                      src={getCoverUrl(book.cover_id, "M")}
                      alt={book.title}
                      className="category-page__book-cover"
                    />
                  ) : (
                    <div className="category-page__no-cover">Fără copertă</div>
                  )}
                </Link>
              </div>

              <div className="category-page__book-card-details">
                <Link to={`/store/books${book.key}`}>
                  <h4 className="category-page__book-card-title">{book.title}</h4>
                  {book.authors && (
                    <p className="category-page__book-card-authors">
                      {book.authors.slice(0, 3).map((author) => author.name).join(", ")}
                      {book.authors.length > 3 && " ..."}
                    </p>
                  )}
                </Link>

                <p className="category-page__book-card-price">{calculateFixedPrice(book)}</p>

                <button className="category-page__add-to-cart-button" onClick={(e) => handleAddToCart(book, e)}>
                  Adaugă în coș
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="category-page__pagination">
          <button
            className="category-page__pagination-button"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Pagina Anterioară
          </button>
          <span className="category-page__pagination-info">Pagina {currentPage}</span>
          <button className="category-page__pagination-button" onClick={handleNextPage}>
            Pagina Următoare
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
