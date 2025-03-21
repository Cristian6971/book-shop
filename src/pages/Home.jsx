import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import useFetch from "../costum-hooks/useFetch";
import { getBooksBySubject, getCoverUrl } from "../api/endpoints";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "./pages-css/Home.css";

// Stil pentru containerul săgeților
const arrowContainerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(31, 41, 55, 0.8)",
  borderRadius: "50%",
  width: "35px",
  height: "35px",
  backdropFilter: "blur(4px)",
  zIndex: 2,
  cursor: "pointer"
};

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div 
      className={className}
      style={{ ...style, ...arrowContainerStyle, right: "10px" }}
      onClick={onClick}
    >
      <span className="material-symbols-outlined arrow-icon">
        arrow_forward_ios
      </span>
    </div>
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div 
      className={className}
      style={{ ...style, ...arrowContainerStyle, left: "10px" }}
      onClick={onClick}
    >
      <span className="material-symbols-outlined arrow-icon">
        arrow_back_ios
      </span>
    </div>
  );
};

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

const BookCarousel = ({ books, loading, error, reverse }) => {
  if (loading) return <p>Se încarcă...</p>;
  if (error) return <p>Eroare: {error.message}</p>;
  if (!books || !books.works) return <p>Nu există cărți disponibile.</p>;

  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2500,
    speed: 500,
    adaptiveHeight: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    rtl: reverse, // activează mișcarea în sens opus dacă reverse e true
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: true,
          dots: true,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };

  return (
    <Slider {...settings} className="book-carousel">
      {books.works.map((book) => {
        // Eliminăm slash-ul inițial dacă există în book.key
        const bookId = book.key.startsWith("/") ? book.key.substring(1) : book.key;
        return (
          <div key={book.key} className="book-card">
            <Link to={`/store/books/${bookId}`} className="book-link">
              {book.cover_id ? (
                <img
                  src={getCoverUrl(book.cover_id, "M")}
                  alt={book.title}
                  className="book-cover"
                />
              ) : (
                <div className="no-cover">Fără copertă</div>
              )}
              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                {book.authors && (
                  <p className="book-author">
                    {book.authors.map((author) => author.name).join(", ")}
                  </p>
                )}
                <p className="book-price">Preț: {calculateFixedPrice(book)}</p>
              </div>
            </Link>
          </div>
        );
      })}
    </Slider>
  );
};

const Home = () => {
  // Preluăm datele pentru fiecare categorie de cărți
  const { data: fictionBooks, loading: loadingFiction, error: errorFiction } = useFetch(
    () => getBooksBySubject("fiction"),
    []
  );
  const { data: fantasyBooks, loading: loadingFantasy, error: errorFantasy } = useFetch(
    () => getBooksBySubject("fantasy"),
    []
  );
  const { data: mysteryBooks, loading: loadingMystery, error: errorMystery } = useFetch(
    () => getBooksBySubject("mystery"),
    []
  );
  const { data: recommendedBooks, loading: loadingRecommended, error: errorRecommended } = useFetch(
    () => getBooksBySubject("historical"),
    []
  );

  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="home-title">Book Haven</h1>
        <p className="home-subtitle">
          Explorează colecția noastră de cărți, ca și cum ai răsfoi paginile unei povești atemporale.
        </p>
        <Link to="/store" className="store-button">
          Cumpără Acum
        </Link>
      </header>

      <section className="carousel-section">
        <h2 className="section-title">Noutăți</h2>
        <BookCarousel 
          books={fictionBooks} 
          loading={loadingFiction} 
          error={errorFiction} 
          reverse={false} 
        />
      </section>

      <section className="carousel-section">
        <h2 className="section-title">Best Sellers</h2>
        <BookCarousel 
          books={fantasyBooks} 
          loading={loadingFantasy} 
          error={errorFantasy} 
          reverse={true} 
        />
      </section>

      <section className="carousel-section">
        <h2 className="section-title">Recomandări</h2>
        <BookCarousel 
          books={mysteryBooks} 
          loading={loadingMystery} 
          error={errorMystery} 
          reverse={false} 
        />
      </section>

      <section className="carousel-section">
        <h2 className="section-title">Recomandate de noi</h2>
        <BookCarousel 
          books={recommendedBooks} 
          loading={loadingRecommended} 
          error={errorRecommended} 
          reverse={true} 
        />
      </section>
    </div>
  );
};

export default Home;
