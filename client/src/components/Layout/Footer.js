// import React from 'react'
// import { Link } from 'react-router-dom'
// const Footer = () => {
//   return (
//     <div className='footer'>
//       <h3 className='text-center'>All Right Reserved &copy; SAGAR KUMAR DAS </h3>
//       <p className='text-center mt-3 '>
//         <Link className='down' to="/about"> About</Link>|
//         <Link className='down' to="/contact"> Contact</Link>|
//         <Link className='down' to="/policy"> Policy</Link>
//       </p>
//       <p className='text-center mt-3 up'>NOTE: This website is only for Practice...</p>

//     </div>
//   )
// }

// export default Footer


import React from 'react'
import { Link } from 'react-router-dom'
import './../../StylePages/Footer.css'

const Footer = () => {
  return (
    <footer className="tv-footer">
      <div className="tv-footer__inner">

        {/* Brand Column */}
        <div className="tv-footer__brand">
          <div className="tv-footer__logo">
            Tech<span>Vault</span>
          </div>
          <p className="tv-footer__tagline">
            Premium tech, curated for you. Quality products at unbeatable prices.
          </p>
          <p className="tv-footer__note">
            ⚠ This website is for practice purposes only.
          </p>
        </div>

        {/* Links Column */}
        <div className="tv-footer__col">
          <h6 className="tv-footer__heading">Quick Links</h6>
          <Link to="/" className="tv-footer__link">Home</Link>
          <Link to="/categories" className="tv-footer__link">Categories</Link>
          <Link to="/cart" className="tv-footer__link">Cart</Link>
        </div>

        {/* Info Column */}
        <div className="tv-footer__col">
          <h6 className="tv-footer__heading">Company</h6>
          <Link to="/about" className="tv-footer__link">About Us</Link>
          <Link to="/contact" className="tv-footer__link">Contact</Link>
          <Link to="/policy" className="tv-footer__link">Privacy Policy</Link>
        </div>

        {/* Author Column */}
        <div className="tv-footer__col">
          <h6 className="tv-footer__heading">Developer</h6>
          <p className="tv-footer__text">Built by</p>
          <p className="tv-footer__author">Sagar Kumar Das</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="tv-footer__bottom">
        <p>© {new Date().getFullYear()} TechVault. All rights reserved.</p>
        <div className="tv-footer__bottom-links">
          <Link to="/about">About</Link>
          <span>·</span>
          <Link to="/contact">Contact</Link>
          <span>·</span>
          <Link to="/policy">Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;