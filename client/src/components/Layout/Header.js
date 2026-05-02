// import React from 'react'
// import { NavLink, Link } from 'react-router-dom'
// import { FaShoppingCart } from 'react-icons/fa'
// import { useAuth } from '../../context/auth';
// import toast from 'react-hot-toast';
// import SearchInput from '../Form/SearchInput';
// import useCategory from '../../hooks/useCategory';
// import { useCart } from "../../context/cart"
// import { Badge } from 'antd';


// const Header = () => {
//   const [auth, setAuth] = useAuth();
//   const [cart] = useCart();
//   const categories = useCategory();
//   const handleLogout = () => {
//     setAuth({
//       ...auth, user: null, token: '',
//     });
//     localStorage.removeItem('auth');
//     toast.success("Logout Successfully..")
//   }


//   return (
//     <>
//       <nav className="navbar navbar-expand-lg  navbar-dark lg-body-tertiary" >
//         <div className="container-fluid">
//           <Link to="/" className="navbar-brandd"><FaShoppingCart /> Ecommerce App</Link>
//           <button className="navbar-toggler mb-3" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
//             <span className="navbar-toggler-icon mt-1" />
//           </button>
//           <div className="collapse navbar-collapse " id="navbarTogglerDemo01">

//             <ul className=" navbar-nav ms-auto mb-2 mt-2 mx-4  mb-lg-1">

//               <li className='nav-item mx-3 mx-lg-0'>  <SearchInput className='desheader' /></li>
//               <li className='ms-4'></li>
//               <li className="nav-item mx-4 mx-lg-0">
//                 <NavLink to="/" className="nav-link text-white" >Home</NavLink>
//               </li>


//               <li className="nav-item dropdown mx-4 mx-lg-0">
//                 <Link className="nav-link dropdown-toggle text-white"
//                   to={"/categories"}
//                   data-bs-toggle="dropdown">
//                   Categories
//                 </Link>

//                 <ul className="dropdown-menu " >
//                   <li>
//                     <Link className="dropdown-item" to={"/categories"}>All Categories</Link>
//                   </li>

//                   {categories?.map((c, index) => (
//                     <li key={index}>
//                       <Link className="dropdown-item" to={`/category/${c.slug}`} >
//                         {c.name}
//                       </Link>
//                     </li>
//                   ))}
//                 </ul>
//               </li>




//               {!auth.user ? (<>
//                 <li className="nav-item mx-4 mx-lg-0">
//                   <NavLink to="/register" className="nav-link text-white">Register</NavLink>
//                 </li>

//                 <li className="nav-item mx-4 mx-lg-0">
//                   <NavLink to="/login" className="nav-link text-white" >Login</NavLink>
//                 </li>
//               </>) : (

//                 <>
//                   <li className="nav-item dropdown mx-4 mx-lg-0">
//                     <NavLink
//                       className="nav-link dropdown-toggle text-white"
//                       href="#"
//                       role="button"
//                       data-bs-toggle="dropdown"
//                       style={{ border: "none" }}
//                     >
//                       {auth?.user?.name}
//                     </NavLink>
//                     <ul className="dropdown-menu">
//                       <li>
//                         <NavLink to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`} className="dropdown-item">
//                           Dashboard
//                         </NavLink>
//                       </li>
//                       <li>
//                         <NavLink
//                           onClick={handleLogout}
//                           to="/login"
//                           className="dropdown-item"
//                         >
//                           Logout
//                         </NavLink>
//                       </li>
//                     </ul>
//                   </li>
//                 </>

//               )
//               }

//               <li className="nav-item mx-4 mx-lg-0">
//                 <Badge count={cart?.length} showZero className='mt-1  '>
//                   <NavLink to="/cart" className="nav-link text-white great">CART
//                   </NavLink>
//                 </Badge>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </nav>

//     </>


//   )
// }
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import toast from 'react-hot-toast';
import SearchInput from '../Form/SearchInput';
import useCategory from '../../hooks/useCategory';
import { useCart } from '../../context/cart';
import './../../StylePages/Header.css';

/* ── tiny shared icons ── */
const ChevronDown = ({ open }) => (
  <svg
    width="11" height="11" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="3"
    style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0 }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/** Click-based dropdown that closes on outside click */
const useDropdown = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return { open, setOpen, ref };
};

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const categories = useCategory();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const cat = useDropdown();
  const user = useDropdown();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    setAuth({ ...auth, user: null, token: '' });
    localStorage.removeItem('auth');
    toast.success('Logged out successfully');
    navigate('/login');
    user.setOpen(false);
  };

  return (
    <header className={`tv-header${scrolled ? ' tv-header--scrolled' : ''}`}>
      <div className="tv-header__inner">

        {/* ── Brand — far left ── */}
        <Link to="/" className="tv-brand">
          <span className="tv-brand__icon">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.8">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </span>
          Tech<span className="tv-brand__accent">Vault</span>
        </Link>

        {/* ── Search — margin-left:auto pushes it right ── */}
        <SearchInput />

        {/* ── Desktop Nav ── */}
        <nav className="tv-nav">

          {/* Home */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `tv-nav__link${isActive ? ' tv-nav__link--active' : ''}`
            }
          >
            Home
          </NavLink>

          {/* Categories — click dropdown */}
          <div className="tv-dropdown" ref={cat.ref}>
            <button
              className="tv-nav__link"
              onClick={() => { cat.setOpen(o => !o); user.setOpen(false); }}
              aria-expanded={cat.open}
            >
              Categories
              <ChevronDown open={cat.open} />
            </button>

            {cat.open && (
              <div className="tv-dropdown__menu">
                <Link
                  to="/categories"
                  className="tv-dropdown__item tv-dropdown__item--all"
                  onClick={() => cat.setOpen(false)}
                >
                  All Categories
                </Link>
                <div className="tv-dropdown__divider" />
                {categories?.map((c) => (
                  <Link
                    key={c._id}
                    to={`/category/${c.slug}`}
                    className="tv-dropdown__item"
                    onClick={() => cat.setOpen(false)}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Auth */}
          {!auth.user ? (
            <>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `tv-nav__link${isActive ? ' tv-nav__link--active' : ''}`
                }
              >
                Register
              </NavLink>
              <NavLink to="/login" className="tv-nav__link tv-btn--outline">
                Login
              </NavLink>
            </>
          ) : (
            /* User / Admin — click dropdown */
            <div className="tv-dropdown" ref={user.ref}>
              <button
                className="tv-nav__link tv-nav__user"
                onClick={() => { user.setOpen(o => !o); cat.setOpen(false); }}
                aria-expanded={user.open}
              >
                <span className="tv-avatar">
                  {auth?.user?.name?.charAt(0).toUpperCase()}
                </span>
                {auth?.user?.name}
                <ChevronDown open={user.open} />
              </button>

              {user.open && (
                <div className="tv-dropdown__menu">
                  <Link
                    to={`/dashboard/${auth?.user?.role === 1 ? 'admin' : 'user'}`}
                    className="tv-dropdown__item"
                    onClick={() => user.setOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <div className="tv-dropdown__divider" />
                  <button
                    onClick={handleLogout}
                    className="tv-dropdown__item tv-dropdown__item--danger"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Cart — rightmost */}
          <Link to="/cart" className="tv-cart-btn">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.8">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cart?.length > 0 && (
              <span className="tv-cart-badge">{cart.length}</span>
            )}
          </Link>

        </nav>

        {/* Mobile toggle */}
        <button
          className="tv-mobile-toggle"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span className={`tv-hamburger${menuOpen ? ' tv-hamburger--open' : ''}`}>
            <span /><span /><span />
          </span>
        </button>

      </div>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div className="tv-mobile-menu">
          <SearchInput />

          <NavLink to="/" className="tv-mobile-menu__link"
            onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/categories" className="tv-mobile-menu__link"
            onClick={() => setMenuOpen(false)}>
            Categories
          </NavLink>
          {categories?.map((c) => (
            <Link key={c._id} to={`/category/${c.slug}`}
              className="tv-mobile-menu__link tv-mobile-menu__link--sub"
              onClick={() => setMenuOpen(false)}>
              {c.name}
            </Link>
          ))}

          <div className="tv-mobile-menu__divider" />

          {!auth.user ? (
            <>
              <NavLink to="/register" className="tv-mobile-menu__link"
                onClick={() => setMenuOpen(false)}>Register</NavLink>
              <NavLink to="/login" className="tv-mobile-menu__link"
                onClick={() => setMenuOpen(false)}>Login</NavLink>
            </>
          ) : (
            <>
              <Link
                to={`/dashboard/${auth?.user?.role === 1 ? 'admin' : 'user'}`}
                className="tv-mobile-menu__link"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button
                className="tv-mobile-menu__link tv-mobile-menu__link--danger"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}

          <div className="tv-mobile-menu__divider" />

          <NavLink to="/cart" className="tv-mobile-menu__link"
            onClick={() => setMenuOpen(false)}>
            Cart{' '}
            {cart?.length > 0 && (
              <span className="tv-cart-badge">{cart.length}</span>
            )}
          </NavLink>
        </div>
      )}
    </header>
  );
};

export default Header;