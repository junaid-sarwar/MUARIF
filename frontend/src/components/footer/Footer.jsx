import React from 'react';
import "./footer.css";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <p>&copy; 2024 Muarif. All rights reserved. <br/> Made with ❤️ <a href="https://github.com/junaid-sarwar">
        Junaid Sarwar</a>
        </p>
        <div className="social-links">
          <a href="">
            <FaFacebook />
          </a>
          <a href="">
            <FaInstagram />
          </a>
          <a href="">
            <FaWhatsapp />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer