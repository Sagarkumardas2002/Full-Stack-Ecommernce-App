

// import React, { useState, useEffect, useRef } from 'react';
// import { NavLink, Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/auth';
// import toast from 'react-hot-toast';
// import SearchInput from '../Form/SearchInput';
// import useCategory from '../../hooks/useCategory';
// import { useCart } from '../../context/cart';
// import './../../StylePages/Header.css';

// const ChevronDown = ({ open }) => (
//   <svg
//     width="11" height="11" viewBox="0 0 24 24"
//     fill="none" stroke="currentColor" strokeWidth="3"
//     style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0 }}
//   >
//     <polyline points="6 9 12 15 18 9" />
//   </svg>
// );

// const useDropdown = () => {
//   const [open, setOpen] = useState(false);
//   const ref = useRef(null);

//   useEffect(() => {
//     if (!open) return;
//     const handler = (e) => {
//       if (ref.current && !ref.current.contains(e.target)) setOpen(false);
//     };
//     document.addEventListener('mousedown', handler);
//     return () => document.removeEventListener('mousedown', handler);
//   }, [open]);

//   return { open, setOpen, ref };
// };

// const Header = () => {
//   const [auth, setAuth] = useAuth();
//   const [cart] = useCart();
//   const categories = useCategory();
//   const [scrolled, setScrolled] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const navigate = useNavigate();

//   const cat = useDropdown();
//   const user = useDropdown();

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 20);
//     window.addEventListener('scroll', onScroll);
//     return () => window.removeEventListener('scroll', onScroll);
//   }, []);

//   const handleLogout = () => {
//     setAuth({ ...auth, user: null, token: '' });
//     localStorage.removeItem('auth');
//     toast.success('Logged out successfully');
//     navigate('/login');
//     user.setOpen(false);
//   };

//   return (
//     <header className={`tv-header${scrolled ? ' tv-header--scrolled' : ''}`}>
//       <div className="tv-header__inner">

//         {/* Brand — far left */}
//         <Link to="/" className="tv-brand">
//           <span className="tv-brand__icon">
//             <svg width="19" height="19" viewBox="0 0 24 24" fill="none"
//               stroke="currentColor" strokeWidth="1.8">
//               <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
//               <line x1="3" y1="6" x2="21" y2="6" />
//               <path d="M16 10a4 4 0 0 1-8 0" />
//             </svg>
//           </span>
//           Tech<span className="tv-brand__accent">Vault</span>
//         </Link>

//         {/* Search — desktop: margin-left auto pushes it right */}
//         <SearchInput />

//         {/* Desktop Nav */}
//         <nav className="tv-nav">

//           <NavLink
//             to="/"
//             className={({ isActive }) =>
//               `tv-nav__link${isActive ? ' tv-nav__link--active' : ''}`
//             }
//           >
//             Home
//           </NavLink>

//           {/* Categories dropdown */}
//           <div className="tv-dropdown" ref={cat.ref}>
//             <button
//               className="tv-nav__link"
//               onClick={() => { cat.setOpen(o => !o); user.setOpen(false); }}
//               aria-expanded={cat.open}
//             >
//               Categories
//               <ChevronDown open={cat.open} />
//             </button>

//             {cat.open && (
//               <div className="tv-dropdown__menu">
//                 <Link
//                   to="/categories"
//                   className="tv-dropdown__item tv-dropdown__item--all"
//                   onClick={() => cat.setOpen(false)}
//                 >
//                   All Categories
//                 </Link>
//                 <div className="tv-dropdown__divider" />
//                 {categories?.map((c) => (
//                   <Link
//                     key={c._id}
//                     to={`/category/${c.slug}`}
//                     className="tv-dropdown__item"
//                     onClick={() => cat.setOpen(false)}
//                   >
//                     {c.name}
//                   </Link>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Auth */}
//           {!auth.user ? (
//             <>
//               <NavLink
//                 to="/register"
//                 className={({ isActive }) =>
//                   `tv-nav__link${isActive ? ' tv-nav__link--active' : ''}`
//                 }
//               >
//                 Register
//               </NavLink>
//               <NavLink to="/login" className="tv-nav__link tv-btn--outline">
//                 Login
//               </NavLink>
//             </>
//           ) : (
//             <div className="tv-dropdown" ref={user.ref}>
//               <button
//                 className="tv-nav__link tv-nav__user"
//                 onClick={() => { user.setOpen(o => !o); cat.setOpen(false); }}
//                 aria-expanded={user.open}
//               >
//                 <span className="tv-avatar">
//                   {auth?.user?.name?.charAt(0).toUpperCase()}
//                 </span>
//                 {auth?.user?.name}
//                 <ChevronDown open={user.open} />
//               </button>

//               {user.open && (
//                 <div className="tv-dropdown__menu">
//                   <Link
//                     to={`/dashboard/${auth?.user?.role === 1 ? 'admin' : 'user'}`}
//                     className="tv-dropdown__item"
//                     onClick={() => user.setOpen(false)}
//                   >
//                     Dashboard
//                   </Link>
//                   <div className="tv-dropdown__divider" />
//                   <button
//                     onClick={handleLogout}
//                     className="tv-dropdown__item tv-dropdown__item--danger"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Cart — desktop only (inside nav) */}
//           <Link to="/cart" className="tv-cart-btn">
//             <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
//               stroke="currentColor" strokeWidth="1.8">
//               <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
//               <line x1="3" y1="6" x2="21" y2="6" />
//               <path d="M16 10a4 4 0 0 1-8 0" />
//             </svg>
//             {cart?.length > 0 && (
//               <span className="tv-cart-badge">{cart.length}</span>
//             )}
//           </Link>

//         </nav>

//         {/* ── CART — visible on mobile, sits between brand and hamburger ── */}
//         <Link to="/cart" className="tv-cart-btn tv-cart-btn--mobile">
//           <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
//             stroke="currentColor" strokeWidth="1.8">
//             <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
//             <line x1="3" y1="6" x2="21" y2="6" />
//             <path d="M16 10a4 4 0 0 1-8 0" />
//           </svg>
//           {cart?.length > 0 && (
//             <span className="tv-cart-badge">{cart.length}</span>
//           )}
//         </Link>

//         {/* Mobile hamburger toggle */}
//         <button
//           className="tv-mobile-toggle"
//           onClick={() => setMenuOpen(o => !o)}
//           aria-label="Toggle menu"
//         >
//           <span className={`tv-hamburger${menuOpen ? ' tv-hamburger--open' : ''}`}>
//             <span /><span /><span />
//           </span>
//         </button>

//       </div>

//       {/* Mobile Menu */}
//       {menuOpen && (
//         <div className="tv-mobile-menu">

//           <NavLink to="/" className="tv-mobile-menu__link"
//             onClick={() => setMenuOpen(false)}>
//             Home
//           </NavLink>

//           <NavLink to="/categories" className="tv-mobile-menu__link"
//             onClick={() => setMenuOpen(false)}>
//             Categories
//           </NavLink>

//           {categories?.map((c) => (
//             <Link key={c._id} to={`/category/${c.slug}`}
//               className="tv-mobile-menu__link tv-mobile-menu__link--sub"
//               onClick={() => setMenuOpen(false)}>
//               {c.name}
//             </Link>
//           ))}

//           <div className="tv-mobile-menu__divider" />

//           {!auth.user ? (
//             <>
//               <NavLink to="/register" className="tv-mobile-menu__link"
//                 onClick={() => setMenuOpen(false)}>Register</NavLink>
//               <NavLink to="/login" className="tv-mobile-menu__link"
//                 onClick={() => setMenuOpen(false)}>Login</NavLink>
//             </>
//           ) : (
//             <>
//               <Link
//                 to={`/dashboard/${auth?.user?.role === 1 ? 'admin' : 'user'}`}
//                 className="tv-mobile-menu__link"
//                 onClick={() => setMenuOpen(false)}
//               >
//                 Dashboard
//               </Link>
//               <button
//                 className="tv-mobile-menu__link tv-mobile-menu__link--danger"
//                 onClick={handleLogout}
//               >
//                 Logout
//               </button>
//             </>
//           )}

//           <div className="tv-mobile-menu__divider" />

//           <NavLink to="/cart" className="tv-mobile-menu__link"
//             onClick={() => setMenuOpen(false)}>
//             Cart{' '}
//             {cart?.length > 0 && (
//               <span className="tv-cart-badge" style={{ position: 'static', border: 'none' }}>
//                 {cart.length}
//               </span>
//             )}
//           </NavLink>

//         </div>
//       )}
//     </header>
//   );
// };

// export default Header;



import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import toast from 'react-hot-toast';
import SearchInput from '../Form/SearchInput';
import useCategory from '../../hooks/useCategory';
import { useCart } from '../../context/cart';
import './../../StylePages/Header.css';

// aria-hidden="true" — decorative chevron, screen readers skip it
const ChevronDown = ({ open }) => (
  <svg
    width="11" height="11" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="3"
    aria-hidden="true"
    style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0 }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

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

  // Build cart aria-label once so both buttons reuse it
  const cartAriaLabel = cart?.length > 0
    ? `Cart, ${cart.length} item${cart.length !== 1 ? 's' : ''}`
    : 'Cart';

  return (
    <header className={`tv-header${scrolled ? ' tv-header--scrolled' : ''}`}>
      <div className="tv-header__inner">

        {/* Brand — far left */}
        <Link to="/" className="tv-brand" aria-label="TechVault — home">
          {/* aria-hidden: decorative icon, link text already describes destination */}
          <span className="tv-brand__icon" aria-hidden="true">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.8">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </span>
          Tech<span className="tv-brand__accent">Vault</span>
        </Link>

        {/* Search — desktop */}
        <SearchInput />

        {/* Desktop Nav */}
        <nav className="tv-nav" aria-label="Main navigation">

          <NavLink
            to="/"
            className={({ isActive }) =>
              `tv-nav__link${isActive ? ' tv-nav__link--active' : ''}`
            }
          >
            Home
          </NavLink>

          {/* Categories dropdown */}
          <div className="tv-dropdown" ref={cat.ref}>
            <button
              className="tv-nav__link"
              onClick={() => { cat.setOpen(o => !o); user.setOpen(false); }}
              aria-expanded={cat.open}
              aria-haspopup="true"
            >
              Categories
              <ChevronDown open={cat.open} />
            </button>

            {cat.open && (
              <div className="tv-dropdown__menu" role="menu">
                <Link
                  to="/categories"
                  className="tv-dropdown__item tv-dropdown__item--all"
                  role="menuitem"
                  onClick={() => cat.setOpen(false)}
                >
                  All Categories
                </Link>
                <div className="tv-dropdown__divider" role="separator" />
                {categories?.map((c) => (
                  <Link
                    key={c._id}
                    to={`/category/${c.slug}`}
                    className="tv-dropdown__item"
                    role="menuitem"
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
            <div className="tv-dropdown" ref={user.ref}>
              <button
                className="tv-nav__link tv-nav__user"
                onClick={() => { user.setOpen(o => !o); cat.setOpen(false); }}
                aria-expanded={user.open}
                  aria-haspopup="true"
                  aria-label={`User menu for ${auth?.user?.name}`}
              >
                  {/* aria-hidden: avatar initial is decorative — name is in aria-label above */}
                  <span className="tv-avatar" aria-hidden="true">
                  {auth?.user?.name?.charAt(0).toUpperCase()}
                </span>
                {auth?.user?.name}
                <ChevronDown open={user.open} />
              </button>

              {user.open && (
                  <div className="tv-dropdown__menu" role="menu">
                  <Link
                    to={`/dashboard/${auth?.user?.role === 1 ? 'admin' : 'user'}`}
                    className="tv-dropdown__item"
                      role="menuitem"
                    onClick={() => user.setOpen(false)}
                  >
                    Dashboard
                  </Link>
                    <div className="tv-dropdown__divider" role="separator" />
                  <button
                    onClick={handleLogout}
                    className="tv-dropdown__item tv-dropdown__item--danger"
                      role="menuitem"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Cart — desktop only (inside nav) */}
          <Link
            to="/cart"
            className="tv-cart-btn"
            aria-label={cartAriaLabel}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cart?.length > 0 && (
              <span className="tv-cart-badge" aria-hidden="true">{cart.length}</span>
            )}
          </Link>

        </nav>

        {/* Cart — mobile (between brand and hamburger) */}
        <Link
          to="/cart"
          className="tv-cart-btn tv-cart-btn--mobile"
          aria-label={cartAriaLabel}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          {cart?.length > 0 && (
            <span className="tv-cart-badge" aria-hidden="true">{cart.length}</span>
          )}
        </Link>

        {/* Mobile hamburger toggle */}
        <button
          className="tv-mobile-toggle"
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className={`tv-hamburger${menuOpen ? ' tv-hamburger--open' : ''}`} aria-hidden="true">
            <span /><span /><span />
          </span>
        </button>

      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="tv-mobile-menu" aria-label="Mobile navigation">

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

          <div className="tv-mobile-menu__divider" role="separator" />

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

          <div className="tv-mobile-menu__divider" role="separator" />

          <NavLink to="/cart" className="tv-mobile-menu__link"
            onClick={() => setMenuOpen(false)}>
            Cart
            {cart?.length > 0 && (
              <span className="tv-cart-badge" aria-hidden="true"
                style={{ position: 'static', border: 'none' }}>
                {cart.length}
              </span>
            )}
          </NavLink>

        </nav>
      )}
    </header>
  );
};

export default Header;