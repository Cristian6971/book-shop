import React, { useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useSearch from "../costum-hooks/useSearch";
import "./components-css/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const { searchTerm, setSearchTerm, searchResults, isLoading, error } = useSearch();

  // Închide sugestiile când se face click în afara căutării
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setSearchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleBookClick = (book) => {
    navigate(`/store/books/${book.key}`);
    setSearchTerm("");
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          Book Haven
        </Link>
      </div>

      {/* Search Bar */}
      <div className="navbar-center" ref={searchRef}>
        <div className="search-container">
          <input
            type="text"
            className="navbar-search"
            placeholder="Caută cărți..."
            value={searchTerm}
            onChange={handleSearch}
          />
          {(searchResults.length > 0 || isLoading) && (
            <div className="search-dropdown">
              {isLoading ? (
                <div className="search-loading">
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Căutare...</span>
                </div>
              ) : error ? (
                <div className="search-error">
                  <i className="fas fa-exclamation-circle"></i>
                  <span>{error}</span>
                </div>
              ) : (
                <ul>
                  {searchResults.map((book) => (
                    <li key={book.key} onClick={() => handleBookClick(book)}>
                      <div className="search-result-item">
                        {book.cover_id && (
                          <img
                            src={`https://covers.openlibrary.org/b/id/${book.cover_id}-S.jpg`}
                            alt={book.title}
                            className="search-result-cover"
                          />
                        )}
                        <div className="search-result-info">
                          <h4>{book.title}</h4>
                          {book.authors && (
                            <p>
                              {book.authors.map((author) => author.name).join(", ")}
                            </p>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Link-uri către pagini */}
      <div className="navbar-right">
        <Link to="/store" className="navbar-link">
          Store
        </Link>
        <Link to="/favorites" className="navbar-link">
          Favorites
        </Link>
        <Link to="/cart" className="navbar-link">
          Cart
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
