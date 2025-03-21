import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Store from "./pages/Store";
import CategoryPage from "./pages/CategoryPage";
import BookDetails from "./pages/BookDetails";
import Cart from "./pages/Cart";
import Favorites from "./pages/Favorites";
import "./App.css"; // Importă stilurile

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/store/*" element={<Store />} />
            <Route path="/store/:categoryId" element={<CategoryPage />} />
            <Route path="/store/books/*" element={<BookDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
