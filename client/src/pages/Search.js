


// // import React from 'react'
// // import Layout from '../components/Layout/Layout'
// // import { useSearch } from '../context/ssearch'
// // import { useNavigate } from 'react-router-dom';
// // import { useCart } from '../context/cart';
// // import toast from 'react-hot-toast';
// // import './../StylePages/Search.css';

// // const Search = () => {
// //     const [values, setValues] = useSearch();
// //     const navigate = useNavigate();
// //     const [cart, setCart] = useCart();

// //     const resultCount = values?.results?.length ?? 0;

// //     const handleAddToCart = (p) => {
// //         const updatedCart = [...cart, p];
// //         setCart(updatedCart);
// //         localStorage.setItem('cart', JSON.stringify(updatedCart));
// //         toast.success('Added to cart');
// //     };

// //     return (
// //         <Layout title={"Search Results — TechVault"}>

// //             {/* ── Search Hero ── */}
// //             <section className="sr-hero">
// //                 <div className="sr-hero__content">
// //                     <span className="sr-hero__tag">Search Results</span>
// //                     <h1 className="sr-hero__title">
// //                         {resultCount > 0
// //                             ? <>Found <em>{resultCount}</em> result{resultCount !== 1 ? 's' : ''}</>
// //                             : 'No Results Found'
// //                         }
// //                     </h1>
// //                     <p className="sr-hero__sub">
// //                         {resultCount > 0
// //                             ? `Showing all matches for your search query`
// //                             : `We couldn't find any products matching your search`
// //                         }
// //                     </p>
// //                 </div>
// //             </section>

// //             {/* ── Results Section ── */}
// //             <section className="sr-section">

// //                 {/* Header */}
// //                 <div className="sr-header">
// //                     <div>
// //                         <h2 className="sr-header__title">
// //                             {resultCount > 0 ? 'Matching Products' : 'Try Something Else'}
// //                         </h2>
// //                         <p className="sr-header__count">
// //                             {resultCount} product{resultCount !== 1 ? 's' : ''} found
// //                         </p>
// //                     </div>
// //                     <button className="sr-back-btn" onClick={() => navigate('/')}>
// //                         ← Back to Shop
// //                     </button>
// //                 </div>

// //                 {/* ── Empty State ── */}
// //                 {resultCount === 0 && (
// //                     <div className="sr-empty">
// //                         <div className="sr-empty__icon">🔍</div>
// //                         <h4>No products found</h4>
// //                         <p>
// //                             Try searching with different keywords,<br />
// //                             or browse all our products below.
// //                         </p>
// //                         <div className="sr-empty__actions">
// //                             <button
// //                                 className="sr-btn sr-btn--dark"
// //                                 onClick={() => navigate('/')}
// //                             >
// //                                 Browse All Products
// //                             </button>
// //                             <button
// //                                 className="sr-btn sr-btn--outline"
// //                                 onClick={() => navigate('/categories')}
// //                             >
// //                                 View Categories
// //                             </button>
// //                         </div>
// //                     </div>
// //                 )}

// //                 {/* ── Product Grid ── */}
// //                 {resultCount > 0 && (
// //                     <div className="sr-grid">
// //                         {values.results.map((p, i) => (
// //                             <div
// //                                 key={p._id}
// //                                 className="sr-card"
// //                                 style={{ animationDelay: `${i * 50}ms` }}
// //                             >
// //                                 {/* Image */}
// //                                 <div className="sr-card__img-wrap">
// //                                     <img
// //                                         src={`https://full-stack-ecommernce-app-backend.onrender.com/api/v1/product/product-photo/${p._id}`}
// //                                         alt={p.name}
// //                                         className="sr-card__img"
// //                                     />
// //                                     <button
// //                                         className="sr-card__quick"
// //                                         onClick={() => navigate(`/product/${p.slug}`)}
// //                                     >
// //                                         Quick View
// //                                     </button>
// //                                 </div>

// //                                 {/* Body */}
// //                                 <div className="sr-card__body">
// //                                     <p className="sr-card__category">
// //                                         {p.category?.name || 'Product'}
// //                                     </p>
// //                                     <h5 className="sr-card__name">{p.name}</h5>
// //                                     <p className="sr-card__desc">
// //                                         {p.description?.substring(0, 55)}...
// //                                     </p>
// //                                     <div className="sr-card__footer">
// //                                         <span className="sr-card__price">
// //                                             ₹{p.price?.toLocaleString('en-IN')}
// //                                         </span>
// //                                         <div className="sr-card__actions">
// //                                             <button
// //                                                 className="sr-card__btn sr-card__btn--detail"
// //                                                 onClick={() => navigate(`/product/${p.slug}`)}
// //                                             >
// //                                                 Details
// //                                             </button>
// //                                             <button
// //                                                 className="sr-card__btn sr-card__btn--cart"
// //                                                 onClick={() => handleAddToCart(p)}
// //                                             >
// //                                                 + Cart
// //                                             </button>
// //                                         </div>
// //                                     </div>
// //                                 </div>
// //                             </div>
// //                         ))}
// //                     </div>
// //                 )}
// //             </section>
// //         </Layout>
// //     );
// // };

// // export default Search;

// import React, { useState } from 'react'
// import Layout from '../components/Layout/Layout'
// import { useSearch } from '../context/ssearch'
// import { useNavigate } from 'react-router-dom';
// import { useCart } from '../context/cart';
// import toast from 'react-hot-toast';
// import axios from '../config/axios';
// import './../StylePages/Search.css';

// const PER_PAGE = 10;

// const Search = () => {
//     const [values] = useSearch();
//     const navigate = useNavigate();
//     const [cart, setCart] = useCart();
//     const [page, setPage] = useState(1);

//     const resultCount = values?.results?.length ?? 0;
//     const totalPages = Math.ceil(resultCount / PER_PAGE);

//     // slice results for current page
//     const paginatedResults = (values?.results || []).slice(
//         (page - 1) * PER_PAGE,
//         page * PER_PAGE
//     );

//     const handleAddToCart = (p) => {
//         const updatedCart = [...cart, { ...p, cartQty: 1 }];
//         setCart(updatedCart);
//         localStorage.setItem('cart', JSON.stringify(updatedCart));
//         toast.success('Added to cart');
//     };

//     const handlePageChange = (pg) => {
//         setPage(pg);
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//     };

//     // ── Pagination renderer ────────────────────────────────────────
//     const renderPagination = () => {
//         if (totalPages <= 1) return null;
//         const pages = [];

//         if (page > 3) {
//             pages.push(
//                 <button key={1} className={`sr-page-btn${page === 1 ? ' sr-page-btn--active' : ''}`} onClick={() => handlePageChange(1)}>1</button>
//             );
//             if (page > 4) pages.push(<span key="s-ell" className="sr-page-ellipsis">…</span>);
//         }

//         const start = Math.max(1, page - 2);
//         const end = Math.min(totalPages, page + 2);
//         for (let i = start; i <= end; i++) {
//             pages.push(
//                 <button
//                     key={i}
//                     className={`sr-page-btn${page === i ? ' sr-page-btn--active' : ''}`}
//                     onClick={() => handlePageChange(i)}
//                 >{i}</button>
//             );
//         }

//         if (page < totalPages - 2) {
//             if (page < totalPages - 3) pages.push(<span key="e-ell" className="sr-page-ellipsis">…</span>);
//             pages.push(
//                 <button key={totalPages} className={`sr-page-btn${page === totalPages ? ' sr-page-btn--active' : ''}`} onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
//             );
//         }

//         return (
//             <div className="sr-pagination">
//                 <button className="sr-page-btn sr-page-btn--nav" disabled={page === 1} onClick={() => handlePageChange(page - 1)}>‹ Prev</button>
//                 <div className="sr-page-numbers">{pages}</div>
//                 <button className="sr-page-btn sr-page-btn--nav" disabled={page === totalPages} onClick={() => handlePageChange(page + 1)}>Next ›</button>
//             </div>
//         );
//     };

//     return (
//         <Layout title={"Search Results — TechVault"}>

//             {/* ── Search Hero ── */}
//             <section className="sr-hero">
//                 <div className="sr-hero__content">
//                     <span className="sr-hero__tag">Search Results</span>
//                     <h1 className="sr-hero__title">
//                         {resultCount > 0
//                             ? <>Found <em>{resultCount}</em> result{resultCount !== 1 ? 's' : ''}</>
//                             : 'No Results Found'
//                         }
//                     </h1>
//                     <p className="sr-hero__sub">
//                         {resultCount > 0
//                             ? `Showing page ${page} of ${totalPages}`
//                             : `We couldn't find any products matching your search`
//                         }
//                     </p>
//                 </div>
//             </section>

//             {/* ── Results Section ── */}
//             <section className="sr-section">

//                 {/* Header */}
//                 <div className="sr-header">
//                     <div>
//                         <h2 className="sr-header__title">
//                             {resultCount > 0 ? 'Matching Products' : 'Try Something Else'}
//                         </h2>
//                         <p className="sr-header__count">
//                             {resultCount} product{resultCount !== 1 ? 's' : ''} found
//                             {totalPages > 1 && ` · Page ${page} of ${totalPages}`}
//                         </p>
//                     </div>
//                     <button className="sr-back-btn" onClick={() => navigate('/')}>
//                         ← Back to Shop
//                     </button>
//                 </div>

//                 {/* ── Empty State ── */}
//                 {resultCount === 0 && (
//                     <div className="sr-empty">
//                         <div className="sr-empty__icon">🔍</div>
//                         <h4>No products found</h4>
//                         <p>
//                             Try searching with different keywords,<br />
//                             or browse all our products below.
//                         </p>
//                         <div className="sr-empty__actions">
//                             <button className="sr-btn sr-btn--dark" onClick={() => navigate('/')}>
//                                 Browse All Products
//                             </button>
//                             <button className="sr-btn sr-btn--outline" onClick={() => navigate('/categories')}>
//                                 View Categories
//                             </button>
//                         </div>
//                     </div>
//                 )}

//                 {/* ── Product Grid ── */}
//                 {resultCount > 0 && (
//                     <>
//                         <div className="sr-grid">
//                             {paginatedResults.map((p, i) => (
//                                 <div
//                                     key={p._id}
//                                     className="sr-card"
//                                     style={{ animationDelay: `${i * 50}ms` }}
//                                 >
//                                     <div className="sr-card__img-wrap">
//                                         <img
//                                             src={`${axios.defaults.baseURL}/api/v1/product/product-photo/${p._id}`}
//                                             alt={p.name}
//                                             className="sr-card__img"
//                                         />
//                                         <button
//                                             className="sr-card__quick"
//                                             onClick={() => navigate(`/product/${p.slug}`)}
//                                         >
//                                             Quick View
//                                         </button>
//                                     </div>
//                                     <div className="sr-card__body">
//                                         <p className="sr-card__category">
//                                             {p.category?.name || 'Product'}
//                                         </p>
//                                         <h5 className="sr-card__name">{p.name}</h5>
//                                         <p className="sr-card__desc">
//                                             {p.description?.substring(0, 55)}...
//                                         </p>
//                                         <div className="sr-card__footer">
//                                             <span className="sr-card__price">
//                                                 ₹{p.price?.toLocaleString('en-IN')}
//                                             </span>
//                                             <div className="sr-card__actions">
//                                                 <button
//                                                     className="sr-card__btn sr-card__btn--detail"
//                                                     onClick={() => navigate(`/product/${p.slug}`)}
//                                                 >
//                                                     Details
//                                                 </button>
//                                                 <button
//                                                     className="sr-card__btn sr-card__btn--cart"
//                                                     onClick={() => handleAddToCart(p)}
//                                                 >
//                                                     + Cart
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>

//                         {/* ── Pagination ── */}
//                         {renderPagination()}
//                     </>
//                 )}
//             </section>
//         </Layout>
//     );
// };

// export default Search;

import React, { useState } from 'react'
import Layout from '../components/Layout/Layout'
import { useSearch } from '../context/ssearch'
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';
import toast from 'react-hot-toast';
import axios from '../config/axios';
import './../StylePages/Search.css';

const PER_PAGE = 10;

const Search = () => {
    const [values] = useSearch();
    const navigate = useNavigate();
    const [cart, setCart] = useCart();
    const [page, setPage] = useState(1);

    const resultCount = values?.results?.length ?? 0;
    const totalPages = Math.ceil(resultCount / PER_PAGE);

    const paginatedResults = (values?.results || []).slice(
        (page - 1) * PER_PAGE,
        page * PER_PAGE
    );

    const handleAddToCart = (p) => {
        const updatedCart = [...cart, { ...p, cartQty: 1 }];
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        toast.success('Added to cart');
    };

    const handlePageChange = (pg) => {
        setPage(pg);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ── Pagination renderer ────────────────────────────────────────
    const renderPagination = () => {
        if (totalPages <= 1) return null;
        const pages = [];

        if (page > 3) {
            pages.push(
                <button
                    key={1}
                    className={`sr-page-btn${page === 1 ? ' sr-page-btn--active' : ''}`}
                    onClick={() => handlePageChange(1)}
                    aria-label={`Page 1${page === 1 ? ', current page' : ''}`}
                    aria-current={page === 1 ? 'page' : undefined}
                >1</button>
            );
            if (page > 4) pages.push(<span key="s-ell" className="sr-page-ellipsis" aria-hidden="true">…</span>);
        }

        const start = Math.max(1, page - 2);
        const end = Math.min(totalPages, page + 2);
        for (let i = start; i <= end; i++) {
            pages.push(
                <button
                    key={i}
                    className={`sr-page-btn${page === i ? ' sr-page-btn--active' : ''}`}
                    onClick={() => handlePageChange(i)}
                    aria-label={`Page ${i}${page === i ? ', current page' : ''}`}
                    aria-current={page === i ? 'page' : undefined}
                >{i}</button>
            );
        }

        if (page < totalPages - 2) {
            if (page < totalPages - 3) pages.push(<span key="e-ell" className="sr-page-ellipsis" aria-hidden="true">…</span>);
            pages.push(
                <button
                    key={totalPages}
                    className={`sr-page-btn${page === totalPages ? ' sr-page-btn--active' : ''}`}
                    onClick={() => handlePageChange(totalPages)}
                    aria-label={`Page ${totalPages}${page === totalPages ? ', current page' : ''}`}
                    aria-current={page === totalPages ? 'page' : undefined}
                >{totalPages}</button>
            );
        }

        return (
            // FIX: wrap in <nav> with aria-label for screen reader landmark
            <nav aria-label="Search results pagination" className="sr-pagination">
                <button
                    className="sr-page-btn sr-page-btn--nav"
                    disabled={page === 1}
                    onClick={() => handlePageChange(page - 1)}
                    aria-label="Previous page"
                >‹ Prev</button>
                <div className="sr-page-numbers" role="list">
                    {pages}
                </div>
                <button
                    className="sr-page-btn sr-page-btn--nav"
                    disabled={page === totalPages}
                    onClick={() => handlePageChange(page + 1)}
                    aria-label="Next page"
                >Next ›</button>
            </nav>
        );
    };

    return (
        <Layout title={"Search Results — TechVault"}>

            {/* ── Search Hero ── */}
            <section className="sr-hero" aria-label="Search results summary">
                <div className="sr-hero__content">
                    <span className="sr-hero__tag">Search Results</span>
                    <h1 className="sr-hero__title">
                        {resultCount > 0
                            ? <>Found <em>{resultCount}</em> result{resultCount !== 1 ? 's' : ''}</>
                            : 'No Results Found'
                        }
                    </h1>
                    <p className="sr-hero__sub">
                        {resultCount > 0
                            ? `Showing page ${page} of ${totalPages}`
                            : `We couldn't find any products matching your search`
                        }
                    </p>
                </div>
            </section>

            {/* ── Results Section ── */}
            <section className="sr-section">

                {/* Header */}
                <div className="sr-header">
                    <div>
                        {/* h1 → h2: correct sequential hierarchy */}
                        <h2 className="sr-header__title">
                            {resultCount > 0 ? 'Matching Products' : 'Try Something Else'}
                        </h2>
                        <p className="sr-header__count">
                            {resultCount} product{resultCount !== 1 ? 's' : ''} found
                            {totalPages > 1 && ` · Page ${page} of ${totalPages}`}
                        </p>
                    </div>
                    <button className="sr-back-btn" onClick={() => navigate('/')}>
                        ← Back to Shop
                    </button>
                </div>

                {/* ── Empty State ── */}
                {resultCount === 0 && (
                    <div className="sr-empty" role="status" aria-live="polite">
                        <div className="sr-empty__icon" aria-hidden="true">🔍</div>
                        {/* FIX: was h4 — skipped h3; now h3 keeps h1→h2→h3 sequence */}
                        <h3 className="sr-empty__heading">No products found</h3>
                        <p>
                            Try searching with different keywords,<br />
                            or browse all our products below.
                        </p>
                        <div className="sr-empty__actions">
                            <button className="sr-btn sr-btn--dark" onClick={() => navigate('/')}>
                                Browse All Products
                            </button>
                            <button className="sr-btn sr-btn--outline" onClick={() => navigate('/categories')}>
                                View Categories
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Product Grid ── */}
                {resultCount > 0 && (
                    <>
                        <div className="sr-grid" role="list" aria-label="Search results">
                            {paginatedResults.map((p, i) => (
                                <article
                                    key={p._id}
                                    className="sr-card"
                                    role="listitem"
                                    style={{ animationDelay: `${i * 50}ms` }}
                                >
                                    <div className="sr-card__img-wrap">
                                        <img
                                            src={`${axios.defaults.baseURL}/api/v1/product/product-photo/${p._id}`}
                                            alt={p.name}
                                            className="sr-card__img"
                                            loading="lazy"
                                        />
                                        <button
                                            className="sr-card__quick"
                                            onClick={() => navigate(`/product/${p.slug}`)}
                                            aria-label={`Quick view ${p.name}`}
                                        >
                                            Quick View
                                        </button>
                                    </div>
                                    <div className="sr-card__body">
                                        <p className="sr-card__category">
                                            {p.category?.name || 'Product'}
                                        </p>
                                        {/* FIX: was h5 — skipped h3 & h4; now h3 keeps correct hierarchy */}
                                        <h3 className="sr-card__name">{p.name}</h3>
                                        <p className="sr-card__desc">
                                            {p.description?.substring(0, 55)}...
                                        </p>
                                        <div className="sr-card__footer">
                                            <span className="sr-card__price">
                                                ₹{p.price?.toLocaleString('en-IN')}
                                            </span>
                                            <div className="sr-card__actions">
                                                <button
                                                    className="sr-card__btn sr-card__btn--detail"
                                                    onClick={() => navigate(`/product/${p.slug}`)}
                                                    aria-label={`View details of ${p.name}`}
                                                >
                                                    Details
                                                </button>
                                                <button
                                                    className="sr-card__btn sr-card__btn--cart"
                                                    onClick={() => handleAddToCart(p)}
                                                    aria-label={`Add ${p.name} to cart`}
                                                >
                                                    + Cart
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* ── Pagination ── */}
                        {renderPagination()}
                    </>
                )}
            </section>
        </Layout>
    );
};

export default Search;