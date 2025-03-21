// src/components/Footer.jsx
import React from "react";
import "./components-css/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} Book Haven. Toate drepturile rezervate.</p>
      </div>
    </footer>
  );
};

export default Footer;
