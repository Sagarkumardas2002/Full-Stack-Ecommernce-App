

// import Layout from '../components/Layout/Layout'
// import React, { useEffect, useState } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import axios from 'axios'
// import toast from 'react-hot-toast'
// import { useCart } from '../context/cart';
// import './../StylePages/CategoryProduct.css';

// const CategoryProduct = () => {
//     const params = useParams();
//     const navigate = useNavigate();
//     const [products, setProducts] = useState([]);
//     const [category, setCategory] = useState({});
//     const [cart, setCart] = useCart();
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         if (params?.slug) getProductsByCat();
//     }, [params?.slug]);

//     const getProductsByCat = async () => {
//         try {
//             setLoading(true);
//             const { data } = await axios.get(`https://full-stack-ecommernce-app-backend.onrender.com/api/v1/product/product-category/${params.slug}`);
//             setProducts(data?.products);
//             setCategory(data?.category);
//         } catch (error) {
//             console.log(error);
//             toast.error('Failed to load products');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleAddToCart = (p) => {
//         const updatedCart = [...cart, p];
//         setCart(updatedCart);
//         localStorage.setItem('cart', JSON.stringify(updatedCart));
//         toast.success('Added to cart');
//     };

//     return (
//         <Layout title={`${category?.name || 'Category'} — TechVault`}>

//             {/* ── Category Hero ── */}
//             <section className="cp-hero">
//                 <div className="cp-hero__content">
//                     <span className="cp-hero__tag">Browse Category</span>
//                     <h1 className="cp-hero__title">{category?.name || 'Products'}</h1>
//                     <p className="cp-hero__sub">
//                         {products?.length > 0
//                             ? `${products.length} product${products.length !== 1 ? 's' : ''} available`
//                             : 'No products found in this category'}
//                     </p>
//                 </div>
//             </section>

//             {/* ── Products Section ── */}
//             <section className="cp-section">

//                 {/* Header row */}
//                 <div className="cp-header">
//                     <div>
//                         <h2 className="cp-header__title">All in {category?.name}</h2>
//                         <p className="cp-header__count">
//                             Showing {products?.length} result{products?.length !== 1 ? 's' : ''}
//                         </p>
//                     </div>
//                     <button className="cp-back-btn" onClick={() => navigate('/')}>
//                         ← Back to Shop
//                     </button>
//                 </div>

//                 {/* Skeleton loading */}
//                 {loading && (
//                     <div className="cp-grid">
//                         {[1, 2, 3, 4, 5, 6].map(n => (
//                             <div key={n} className="cp-card cp-card--skeleton">
//                                 <div className="cp-skel cp-skel--img" />
//                                 <div className="cp-card__body">
//                                     <div className="cp-skel cp-skel--category" />
//                                     <div className="cp-skel cp-skel--title" />
//                                     <div className="cp-skel cp-skel--desc" />
//                                     <div className="cp-skel cp-skel--desc cp-skel--desc-short" />
//                                     <div className="cp-card__footer">
//                                         <div className="cp-skel cp-skel--price" />
//                                         <div style={{ display: 'flex', gap: 6 }}>
//                                             <div className="cp-skel cp-skel--btn" />
//                                             <div className="cp-skel cp-skel--btn" />
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}

//                 {/* Empty state */}
//                 {!loading && products?.length === 0 && (
//                     <div className="cp-empty">
//                         <div className="cp-empty__icon">🔍</div>
//                         <h4>No products found</h4>
//                         <p>There are no products in the <strong>{category?.name}</strong> category yet.</p>
//                         <button className="cp-btn cp-btn--dark" onClick={() => navigate('/')}>
//                             Browse All Products
//                         </button>
//                     </div>
//                 )}

//                 {/* Product grid */}
//                 {!loading && products?.length > 0 && (
//                     <div className="cp-grid">
//                         {products.map((p, i) => (
//                             <div
//                                 key={p._id}
//                                 className="cp-card"
//                                 style={{ animationDelay: `${i * 50}ms` }}
//                             >
//                                 {/* Image */}
//                                 <div className="cp-card__img-wrap">
//                                     <img
//                                         src={`https://ecom-final-fixed-backup.onrender.com/api/v1/product/product-photo/${p._id}`}
//                                         alt={p.name}
//                                         className="cp-card__img"
//                                     />
//                                     <button
//                                         className="cp-card__quick"
//                                         onClick={() => navigate(`/product/${p.slug}`)}
//                                     >
//                                         Quick View
//                                     </button>
//                                 </div>

//                                 {/* Body */}
//                                 <div className="cp-card__body">
//                                     <p className="cp-card__category">{category?.name}</p>
//                                     <h5 className="cp-card__name">{p.name}</h5>
//                                     <p className="cp-card__desc">
//                                         {p.description?.substring(0, 55)}...
//                                     </p>
//                                     <div className="cp-card__footer">
//                                         <span className="cp-card__price">
//                                             ₹{p.price?.toLocaleString('en-IN')}
//                                         </span>
//                                         <div className="cp-card__actions">
//                                             <button
//                                                 className="cp-card__btn cp-card__btn--detail"
//                                                 onClick={() => navigate(`/product/${p.slug}`)}
//                                             >
//                                                 Details
//                                             </button>
//                                             <button
//                                                 className="cp-card__btn cp-card__btn--cart"
//                                                 onClick={() => handleAddToCart(p)}
//                                             >
//                                                 + Cart
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </section>

//         </Layout>
//     );
// };

// export default CategoryProduct;


import Layout from '../components/Layout/Layout';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import toast from 'react-hot-toast';
import { useCart } from '../context/cart';
import './../StylePages/CategoryProduct.css';

const PER_PAGE = 10;

/* ─── Pagination ─────────────────────────────────── */
const Pagination = ({ page, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const getPages = () => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
        const pages = [1];
        if (page > 3) pages.push('…');
        for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
            pages.push(i);
        }
        if (page < totalPages - 2) pages.push('…');
        pages.push(totalPages);
        return pages;
    };

    return (
        <div className="cp-pagination">
            <button
                className="cp-pag__btn cp-pag__btn--arrow"
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                aria-label="Previous page"
            >‹</button>

            {getPages().map((pg, i) =>
                pg === '…'
                    ? <span key={`e-${i}`} className="cp-pag__ellipsis">…</span>
                    : <button
                        key={pg}
                        className={`cp-pag__btn${pg === page ? ' cp-pag__btn--active' : ''}`}
                        onClick={() => onPageChange(pg)}
                        aria-current={pg === page ? 'page' : undefined}
                    >{pg}</button>
            )}

            <button
                className="cp-pag__btn cp-pag__btn--arrow"
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                aria-label="Next page"
            >›</button>
        </div>
    );
};

/* ─── Main Component ─────────────────────────────── */
const CategoryProduct = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [allProducts, setAllProducts] = useState([]);   // full list
    const [category, setCategory] = useState({});
    const [cart, setCart] = useCart();
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    // derived
    const totalPages = Math.ceil(allProducts.length / PER_PAGE);
    const products = allProducts.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    useEffect(() => {
        if (params?.slug) {
            setPage(1);
            getProductsByCat();
        }
    }, [params?.slug]);

    const getProductsByCat = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/v1/product/product-category/${params.slug}`);
            setAllProducts(data?.products || []);
            setCategory(data?.category || {});
        } catch (error) {
            console.log(error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (p) => {
        const updatedCart = [...cart, p];
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        toast.success('Added to cart');
    };

    const handlePageChange = (pg) => {
        setPage(pg);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <Layout title={`${category?.name || 'Category'} — TechVault`}>
            <div className="cp-page">

                {/* ── Category Hero ── */}
                <div className="cp-hero">
                    <div className="cp-hero__content">
                        <span className="cp-hero__tag">Browse Category</span>
                        <h1 className="cp-hero__title">{category?.name || 'Products'}</h1>
                        <p className="cp-hero__sub">
                            {loading
                                ? 'Loading products…'
                                : allProducts.length > 0
                                    ? `${allProducts.length} product${allProducts.length !== 1 ? 's' : ''} available`
                                    : 'No products found in this category'}
                        </p>
                    </div>
                </div>

                {/* ── Products Section ── */}
                <div className="cp-section">

                    {/* Header row */}
                    <div className="cp-header">
                        <div>
                            <h2 className="cp-header__title">All in {category?.name}</h2>
                            <p className="cp-header__count">
                                {loading
                                    ? 'Loading…'
                                    : allProducts.length > 0
                                        ? `Showing ${(page - 1) * PER_PAGE + 1}–${Math.min(page * PER_PAGE, allProducts.length)} of ${allProducts.length} result${allProducts.length !== 1 ? 's' : ''}`
                                        : 'Showing 0 results'}
                            </p>
                        </div>
                        <button className="cp-back-btn" onClick={() => navigate('/')}>
                            ← Back to Shop
                        </button>
                    </div>

                    {/* Skeleton */}
                    {loading && (
                        <div className="cp-grid">
                            {[1, 2, 3, 4, 5, 6].map(n => (
                                <div key={n} className="cp-card cp-card--skeleton">
                                    <div className="cp-skel cp-skel--img" />
                                    <div className="cp-card__body">
                                        <div className="cp-skel cp-skel--category" />
                                        <div className="cp-skel cp-skel--title" />
                                        <div className="cp-skel cp-skel--desc" />
                                        <div className="cp-skel cp-skel--desc cp-skel--desc-short" />
                                        <div className="cp-card__footer">
                                            <div className="cp-skel cp-skel--price" />
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <div className="cp-skel cp-skel--btn" />
                                                <div className="cp-skel cp-skel--btn" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Empty state */}
                    {!loading && allProducts.length === 0 && (
                        <div className="cp-empty">
                            <div className="cp-empty__ring">
                                <div className="cp-empty__icon">🔍</div>
                            </div>
                            <h4>No products found</h4>
                            <p>
                                There are no products in the <strong>{category?.name}</strong> category yet.
                                <br />Check back later or explore other categories.
                            </p>
                            <div className="cp-empty__actions">
                                <button className="cp-btn cp-btn--dark" onClick={() => navigate('/')}>
                                    Browse All Products
                                </button>
                                <button className="cp-btn cp-btn--ghost" onClick={() => navigate(-1)}>
                                    Go Back
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Product grid */}
                    {!loading && products.length > 0 && (
                        <>
                            <div className="cp-grid">
                                {products.map((p, i) => (
                                    <div
                                        key={p._id}
                                        className="cp-card"
                                        style={{ animationDelay: `${i * 50}ms` }}
                                    >
                                        <div className="cp-card__img-wrap">
                                            <img
                                                src={`${axios.defaults.baseURL}/api/v1/product/product-photo/${p._id}`}
                                                alt={p.name}
                                                className="cp-card__img"
                                            />
                                            <button
                                                className="cp-card__quick"
                                                onClick={() => navigate(`/product/${p.slug}`)}
                                            >
                                                Quick View
                                            </button>
                                        </div>
                                        <div className="cp-card__body">
                                            <p className="cp-card__category">{category?.name}</p>
                                            <h5 className="cp-card__name">{p.name}</h5>
                                            <p className="cp-card__desc">
                                                {p.description?.substring(0, 55)}...
                                            </p>
                                            <div className="cp-card__footer">
                                                <span className="cp-card__price">
                                                    ₹{p.price?.toLocaleString('en-IN')}
                                                </span>
                                                <div className="cp-card__actions">
                                                    <button
                                                        className="cp-card__btn cp-card__btn--detail"
                                                        onClick={() => navigate(`/product/${p.slug}`)}
                                                    >
                                                        Details
                                                    </button>
                                                    <button
                                                        className="cp-card__btn cp-card__btn--cart"
                                                        onClick={() => handleAddToCart(p)}
                                                    >
                                                        + Cart
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination — only when > 10 products */}
                            {allProducts.length > PER_PAGE && (
                                <Pagination
                                    page={page}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default CategoryProduct;