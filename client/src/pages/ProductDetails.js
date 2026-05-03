


// import React, { useState, useEffect, useRef } from 'react';

// import Layout from '../components/Layout/Layout';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { useCart } from '../context/cart';
// import './../StylePages/Productdetails.css';

// /* ─────────────────────────────────────────────────────
//    Skeleton Card — shown while similar products load
// ───────────────────────────────────────────────────── */
// const SkeletonCard = () => (
//     <div className="pd-skel-card">
//         <div className="pd-skel-card__img" />
//         <div className="pd-skel-card__body">
//             <div className="pd-skel-line" style={{ height: 10, width: '35%' }} />
//             <div className="pd-skel-line" style={{ height: 14, width: '75%' }} />
//             <div className="pd-skel-line" style={{ height: 12, width: '90%' }} />
//             <div className="pd-skel-line" style={{ height: 12, width: '60%' }} />
//             <div className="pd-skel-card__footer">
//                 <div className="pd-skel-line" style={{ height: 18, width: '38%' }} />
//                 <div style={{ display: 'flex', gap: 8, flex: 1, justifyContent: 'flex-end' }}>
//                     <div className="pd-skel-btn" style={{ flex: '0 0 64px' }} />
//                     <div className="pd-skel-btn" style={{ flex: '0 0 64px' }} />
//                 </div>
//             </div>
//         </div>
//     </div>
// );

// /* ─────────────────────────────────────────────────────
//    Similar product card — matches homepage card UI
// ───────────────────────────────────────────────────── */
// const ProductCard = ({ p, onAddToCart, onDetails, delay = 0 }) => (
//     <div className="pd-card" style={{ animationDelay: `${delay}ms` }}>
//         <div className="pd-card__img-wrap">
//             <img
//                 className="pd-card__img"
//                 src={`https://full-stack-ecommernce-app-backend.onrender.com/api/v1/product/product-photo/${p._id}`}
//                 alt={p.name}
//             />
//             <div className="pd-card__overlay">Quick View</div>
//         </div>
//         <div className="pd-card__body">
//             <div className="pd-card__badge">Product</div>
//             <div className="pd-card__name">{p.name}</div>
//             <div className="pd-card__desc">{p.description?.substring(0, 55)}…</div>
//             <div className="pd-card__footer">
//                 <div className="pd-card__price">₹{p.price?.toLocaleString('en-IN')}</div>
//                 <div className="pd-card__btns">
//                     <button className="pd-card__btn-details" onClick={() => onDetails(p.slug)}>
//                         Details
//                     </button>
//                     <button className="pd-card__btn-cart" onClick={() => onAddToCart(p)}>
//                         + Cart
//                     </button>
//                 </div>
//             </div>
//         </div>
//     </div>
// );

// /* ─────────────────────────────────────────────────────
//    3-D Tilt Viewer
// ───────────────────────────────────────────────────── */
// const Viewer3D = ({ productId, productName }) => {
//     const stageRef = useRef(null);
//     const imgRef = useRef(null);
//     const shineRef = useRef(null);
//     const rafRef = useRef(null);

//     const handleMouseMove = (e) => {
//         const el = stageRef.current;
//         if (!el) return;
//         const rect = el.getBoundingClientRect();

//         const cx = rect.left + rect.width / 2;
//         const cy = rect.top + rect.height / 2;
//         const dx = e.clientX - cx;
//         const dy = e.clientY - cy;

//         const maxTilt = 14; // degrees
//         const rx = (-dy / (rect.height / 2)) * maxTilt;
//         const ry = (dx / (rect.width / 2)) * maxTilt;

//         // shine position (percentage)
//         const px = ((e.clientX - rect.left) / rect.width) * 100;
//         const py = ((e.clientY - rect.top) / rect.height) * 100;

//         if (rafRef.current) cancelAnimationFrame(rafRef.current);
//         rafRef.current = requestAnimationFrame(() => {
//             if (el) {
//                 el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
//             }
//             if (shineRef.current) {
//                 shineRef.current.style.setProperty('--mx', `${px}%`);
//                 shineRef.current.style.setProperty('--my', `${py}%`);
//             }
//             // subtle image counter-shift for depth
//             if (imgRef.current) {
//                 imgRef.current.style.transform = `translateX(${ry * -0.7}px) translateY(${rx * 0.7}px)`;
//             }
//         });
//     };

//     const handleMouseLeave = () => {
//         if (rafRef.current) cancelAnimationFrame(rafRef.current);
//         rafRef.current = requestAnimationFrame(() => {
//             if (stageRef.current) stageRef.current.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
//             if (imgRef.current) imgRef.current.style.transform = 'none';
//         });
//     };

//     useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

//     return (
//         <div className="pd-viewer">
//             <div
//                 className="pd-viewer__stage"
//                 ref={stageRef}
//                 onMouseMove={handleMouseMove}
//                 onMouseLeave={handleMouseLeave}
//             >
//                 {productId && (
//                     <img
//                         ref={imgRef}
//                         className="pd-viewer__img"
//                         src={`https://full-stack-ecommernce-app-backend.onrender.com/api/v1/product/product-photo/${productId}`}
//                         alt={productName}
//                         style={{ transition: 'transform 0.08s ease-out' }}
//                     />
//                 )}
//                 <div className="pd-viewer__shine" ref={shineRef} />
//                 <div className="pd-viewer__edge" />
//             </div>
//             <div className="pd-viewer__hint">
//                 <div className="pd-viewer__hint-dot" />
//                 Move your cursor over the image for 3D view
//                 <div className="pd-viewer__hint-dot" />
//             </div>
//         </div>
//     );
// };

// /* ─────────────────────────────────────────────────────
//    Main ProductDetails Component
// ───────────────────────────────────────────────────── */
// const ProductDetails = () => {
//     const params = useParams();
//     const navigate = useNavigate();
//     const [cart, setCart] = useCart();

//     const [product, setProduct] = useState({});
//     const [relatedProducts, setRelatedProducts] = useState([]);
//     const [loadingProduct, setLoadingProduct] = useState(true);
//     const [loadingSimilar, setLoadingSimilar] = useState(true);

//     /* ── fetch on slug change ── */
//     useEffect(() => {
//         if (params?.slug) {
//             setLoadingProduct(true);
//             setLoadingSimilar(true);
//             setProduct({});
//             setRelatedProducts([]);
//             getProduct();
//         }
//         // scroll to top on product change
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//     }, [params?.slug]);

//     const getProduct = async () => {
//         try {
//             const { data } = await axios.get(`https://full-stack-ecommernce-app-backend.onrender.com/api/v1/product/get-product/${params.slug}`);
//             setProduct(data?.product);
//             setLoadingProduct(false);
//             getSimilarProduct(data?.product._id, data?.product.category._id);
//         } catch (error) {
//             console.log(error);
//             setLoadingProduct(false);
//         }
//     };

//     const getSimilarProduct = async (pid, cid) => {
//         try {
//             const { data } = await axios.get(`https://full-stack-ecommernce-app-backend.onrender.com/api/v1/product/related-product/${pid}/${cid}`);
//             setRelatedProducts(data?.products);
//         } catch (error) {
//             console.log(error);
//         } finally {
//             setLoadingSimilar(false);
//         }
//     };

//     /* ── cart helper ── */
//     const addToCart = (item) => {
//         const updated = [...cart, { ...item, cartQty: 1 }];
//         setCart(updated);
//         localStorage.setItem('cart', JSON.stringify(updated));
//         toast.success('Item added to cart 🛒');
//     };

//     /* ─── RENDER ─── */
//     return (
//         <Layout>
//             <div className="pd-page">

//                 {/* ── Breadcrumb ── */}
//                 <div className="pd-hero">
//                     <span className="pd-hero__crumb" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Home</span>
//                     <span className="pd-hero__sep">›</span>
//                     <span className="pd-hero__current">{product.name || 'Product Details'}</span>
//                 </div>

//                 {/* ── Main section: 3D viewer + info ── */}
//                 <div className="pd-main">

//                     {/* LEFT — 3D Image Viewer */}
//                     <Viewer3D productId={product._id} productName={product.name} />

//                     {/* RIGHT — Product Info */}
//                     <div className="pd-info">
//                         <div className="pd-info__badge">Product</div>

//                         <div className="pd-info__name">
//                             {loadingProduct ? '—' : product.name}
//                         </div>

//                         <div className="pd-info__price">
//                             ₹{product.price?.toLocaleString('en-IN') || '—'}
//                         </div>

//                         <hr className="pd-info__divider" />

//                         <div className="pd-info__rows">
//                             <div className="pd-info__row">
//                                 <span className="pd-info__row-label">Category</span>
//                                 <span className="pd-info__row-value">
//                                     <span className="pd-info__category-chip">
//                                         {product.category?.name || '—'}
//                                     </span>
//                                 </span>
//                             </div>
//                             <div className="pd-info__row">
//                                 <span className="pd-info__row-label">Description</span>
//                                 <span className="pd-info__row-value">
//                                     {product.description || '—'}
//                                 </span>
//                             </div>
//                             {product.quantity !== undefined && (
//                                 <div className="pd-info__row">
//                                     <span className="pd-info__row-label">In Stock</span>
//                                     <span className="pd-info__row-value">
//                                         {product.quantity > 0
//                                             ? `${product.quantity} unit${product.quantity !== 1 ? 's' : ''} available`
//                                             : 'Out of stock'}
//                                     </span>
//                                 </div>
//                             )}
//                         </div>

//                         {/* CTA */}
//                         <div className="pd-info__cta">
//                             <button
//                                 className="pd-btn-primary"
//                                 onClick={() => addToCart(product)}
//                                 disabled={!product._id}
//                             >
//                                 + Add to Cart
//                             </button>
//                             <button
//                                 className="pd-btn-secondary"
//                                 onClick={() => navigate('/cart')}
//                             >
//                                 View Cart
//                             </button>
//                         </div>

//                         {/* Trust badges */}
//                         <div className="pd-trust">
//                             <div className="pd-trust__item">
//                                 <div className="pd-trust__icon">🚚</div>
//                                 Free Delivery
//                             </div>
//                             <div className="pd-trust__item">
//                                 <div className="pd-trust__icon">↩</div>
//                                 Easy Returns
//                             </div>
//                             <div className="pd-trust__item">
//                                 <div className="pd-trust__icon">🔒</div>
//                                 Secure Payment
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* ── Divider ── */}
//                 <hr className="pd-divider" />

//                 {/* ── Similar Products ── */}
//                 <div className="pd-similar">
//                     <div className="pd-similar__header">
//                         <div className="pd-similar__label">You May Also Like</div>
//                         <div className="pd-similar__title">Similar Products</div>
//                     </div>

//                     {loadingSimilar ? (
//                         /* skeleton grid */
//                         <div className="pd-grid">
//                             {[1, 2, 3, 4].map(n => <SkeletonCard key={n} />)}
//                         </div>
//                     ) : relatedProducts.length < 1 ? (
//                         <div className="pd-similar__empty">No similar products found.</div>
//                     ) : (
//                         <div className="pd-grid">
//                                     {relatedProducts.map((p, i) => (
//                                 <ProductCard
//                                     key={p._id}
//                                     p={p}
//                                     delay={i * 60}
//                                     onAddToCart={addToCart}
//                                     onDetails={(slug) => navigate(`/product/${slug}`)}
//                                 />
//                             ))}
//                         </div>
//                     )}
//                 </div>

//             </div>
//         </Layout>
//     );
// };

// export default ProductDetails;


import React, { useState, useEffect, useRef, useCallback } from 'react';
import Layout from '../components/Layout/Layout';
import axios from '../config/axios';           // ← your configured instance
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../context/cart';
import './../StylePages/Productdetails.css';

const PHOTO = (id) => `${axios.defaults.baseURL}/api/v1/product/product-photo/${id}`;
const PER_PAGE = 8;

/* ─────────────────────────────────────────────────────
   Skeleton Card
───────────────────────────────────────────────────── */
const SkeletonCard = () => (
    <div className="pd-skel-card">
        <div className="pd-skel-card__img" />
        <div className="pd-skel-card__body">
            <div className="pd-skel-line" style={{ height: 10, width: '35%' }} />
            <div className="pd-skel-line" style={{ height: 14, width: '75%' }} />
            <div className="pd-skel-line" style={{ height: 12, width: '90%' }} />
            <div className="pd-skel-line" style={{ height: 12, width: '60%' }} />
            <div className="pd-skel-card__footer">
                <div className="pd-skel-line" style={{ height: 18, width: '38%' }} />
                <div style={{ display: 'flex', gap: 8, flex: 1, justifyContent: 'flex-end' }}>
                    <div className="pd-skel-btn" style={{ flex: '0 0 64px' }} />
                    <div className="pd-skel-btn" style={{ flex: '0 0 64px' }} />
                </div>
            </div>
        </div>
    </div>
);

/* ─────────────────────────────────────────────────────
   QuickView Modal
───────────────────────────────────────────────────── */
const QuickViewModal = ({ product, onClose, onAddToCart, onDetails }) => {
    const overlayRef = useRef(null);

    // close on overlay click (not inner panel)
    const handleOverlayClick = (e) => {
        if (e.target === overlayRef.current) onClose();
    };

    // close on Escape
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    if (!product) return null;

    return (
        <div className="qv-overlay" ref={overlayRef} onClick={handleOverlayClick}>
            <div className="qv-panel" role="dialog" aria-modal="true" aria-label={product.name}>

                {/* close btn */}
                <button className="qv-close" onClick={onClose} aria-label="Close">✕</button>

                {/* image */}
                <div className="qv-img-wrap">
                    <img
                        className="qv-img"
                        src={PHOTO(product._id)}
                        alt={product.name}
                    />
                </div>

                {/* info */}
                <div className="qv-info">
                    <div className="qv-badge">
                        {product.category?.name || 'Product'}
                    </div>
                    <h2 className="qv-name">{product.name}</h2>
                    <div className="qv-price">₹{product.price?.toLocaleString('en-IN')}</div>

                    {product.description && (
                        <p className="qv-desc">{product.description}</p>
                    )}

                    {product.quantity !== undefined && (
                        <div className="qv-stock">
                            {product.quantity > 0
                                ? <span className="qv-stock--in">✓ {product.quantity} in stock</span>
                                : <span className="qv-stock--out">✗ Out of stock</span>}
                        </div>
                    )}

                    <div className="qv-actions">
                        <button
                            className="pd-btn-primary"
                            style={{ flex: 1 }}
                            onClick={() => { onAddToCart(product); onClose(); }}
                            disabled={!product._id || product.quantity === 0}
                        >
                            + Add to Cart
                        </button>
                        <button
                            className="pd-btn-secondary"
                            onClick={() => { onClose(); onDetails(product.slug); }}
                        >
                            Full Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────────────
   Similar product card
───────────────────────────────────────────────────── */
const ProductCard = ({ p, onAddToCart, onDetails, onQuickView, delay = 0 }) => (
    <div className="pd-card" style={{ animationDelay: `${delay}ms` }}>
        <div className="pd-card__img-wrap">
            <img
                className="pd-card__img"
                src={PHOTO(p._id)}
                alt={p.name}
            />
            {/* Quick View — now a real clickable button */}
            <button
                className="pd-card__overlay"
                onClick={() => onQuickView(p)}
                aria-label={`Quick view ${p.name}`}
            >
                Quick View
            </button>
        </div>
        <div className="pd-card__body">
            <div className="pd-card__badge">
                <span className="pd-info__category-chip">{p.category?.name || 'Product'}</span>
            </div>
            <div className="pd-card__name">{p.name}</div>
            <div className="pd-card__desc">{p.description?.substring(0, 55)}…</div>
            <div className="pd-card__footer">
                <div className="pd-card__price">₹{p.price?.toLocaleString('en-IN')}</div>
                <div className="pd-card__btns">
                    <button className="pd-card__btn-details" onClick={() => onDetails(p.slug)}>
                        Details
                    </button>
                    <button className="pd-card__btn-cart" onClick={() => onAddToCart(p)}>
                        + Cart
                    </button>
                </div>
            </div>
        </div>
    </div>
);

/* ─────────────────────────────────────────────────────
   Pagination Controls
───────────────────────────────────────────────────── */
const Pagination = ({ page, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    // Build page number array with ellipsis
    const getPages = () => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
        const pages = [];
        pages.push(1);
        if (page > 3) pages.push('…');
        for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
            pages.push(i);
        }
        if (page < totalPages - 2) pages.push('…');
        pages.push(totalPages);
        return pages;
    };

    return (
        <div className="pd-pagination">
            <button
                className="pd-pag__btn pd-pag__btn--arrow"
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                aria-label="Previous page"
            >
                ‹
            </button>

            {getPages().map((pg, i) =>
                pg === '…'
                    ? <span key={`ellipsis-${i}`} className="pd-pag__ellipsis">…</span>
                    : <button
                        key={pg}
                        className={`pd-pag__btn${pg === page ? ' pd-pag__btn--active' : ''}`}
                        onClick={() => onPageChange(pg)}
                        aria-current={pg === page ? 'page' : undefined}
                    >
                        {pg}
                    </button>
            )}

            <button
                className="pd-pag__btn pd-pag__btn--arrow"
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                aria-label="Next page"
            >
                ›
            </button>
        </div>
    );
};

/* ─────────────────────────────────────────────────────
   3-D Tilt Viewer
───────────────────────────────────────────────────── */
const Viewer3D = ({ productId, productName }) => {
    const stageRef = useRef(null);
    const imgRef = useRef(null);
    const shineRef = useRef(null);
    const rafRef = useRef(null);

    const handleMouseMove = (e) => {
        const el = stageRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const maxTilt = 14;
        const rx = (-dy / (rect.height / 2)) * maxTilt;
        const ry = (dx / (rect.width / 2)) * maxTilt;
        const px = ((e.clientX - rect.left) / rect.width) * 100;
        const py = ((e.clientY - rect.top) / rect.height) * 100;

        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
            if (el) el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
            if (shineRef.current) {
                shineRef.current.style.setProperty('--mx', `${px}%`);
                shineRef.current.style.setProperty('--my', `${py}%`);
            }
            if (imgRef.current) {
                imgRef.current.style.transform = `translateX(${ry * -0.7}px) translateY(${rx * 0.7}px)`;
            }
        });
    };

    const handleMouseLeave = () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
            if (stageRef.current) stageRef.current.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
            if (imgRef.current) imgRef.current.style.transform = 'none';
        });
    };

    useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

    return (
        <div className="pd-viewer">
            <div
                className="pd-viewer__stage"
                ref={stageRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                {productId && (
                    <img
                        ref={imgRef}
                        className="pd-viewer__img"
                        src={PHOTO(productId)}
                        alt={productName}
                        style={{ transition: 'transform 0.08s ease-out' }}
                    />
                )}
                <div className="pd-viewer__shine" ref={shineRef} />
                <div className="pd-viewer__edge" />
            </div>
            <div className="pd-viewer__hint">
                <div className="pd-viewer__hint-dot" />
                Move your cursor over the image for 3D view
                <div className="pd-viewer__hint-dot" />
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────────────
   Main ProductDetails Component
───────────────────────────────────────────────────── */
const ProductDetails = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [cart, setCart] = useCart();

    const [product, setProduct] = useState({});
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loadingProduct, setLoadingProduct] = useState(true);
    const [loadingSimilar, setLoadingSimilar] = useState(true);

    // pagination
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const totalPages = Math.ceil(totalCount / PER_PAGE);

    // quick view
    const [quickViewProduct, setQuickViewProduct] = useState(null);

    // save pid+cid for pagination re-fetches
    const similarRef = useRef({ pid: null, cid: null });

    /* ── fetch similar with page ── */
    const getSimilarProduct = useCallback(async (pid, cid, pg = 1) => {
        setLoadingSimilar(true);
        try {
            const { data } = await axios.get(
                `/api/v1/product/related-product/${pid}/${cid}`,
                { params: { page: pg, limit: PER_PAGE } }
            );
            setRelatedProducts(data?.products || []);
            setTotalCount(data?.total ?? (data?.products?.length ?? 0));
        } catch (error) {
            console.log(error);
            setRelatedProducts([]);
        } finally {
            setLoadingSimilar(false);
        }
    }, []);

    /* ── fetch main product ── */
    const getProduct = useCallback(async () => {
        try {
            const { data } = await axios.get(`/api/v1/product/get-product/${params.slug}`);
            const p = data?.product;
            setProduct(p);
            setLoadingProduct(false);
            similarRef.current = { pid: p._id, cid: p.category._id };
            setPage(1);
            getSimilarProduct(p._id, p.category._id, 1);
        } catch (error) {
            console.log(error);
            setLoadingProduct(false);
        }
    }, [params.slug, getSimilarProduct]);

    useEffect(() => {
        if (params?.slug) {
            setLoadingProduct(true);
            setLoadingSimilar(true);
            setProduct({});
            setRelatedProducts([]);
            setTotalCount(0);
            setPage(1);
            getProduct();
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [params?.slug]);

    /* ── page change ── */
    const handlePageChange = (pg) => {
        const { pid, cid } = similarRef.current;
        if (!pid || !cid) return;
        setPage(pg);
        getSimilarProduct(pid, cid, pg);
        // scroll to similar section
        document.querySelector('.pd-similar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    /* ── cart helper ── */
    const addToCart = (item) => {
        const updated = [...cart, { ...item, cartQty: 1 }];
        setCart(updated);
        localStorage.setItem('cart', JSON.stringify(updated));
        toast.success('Item added to cart 🛒');
    };

    /* ─── RENDER ─── */
    return (
        <Layout>
            <div className="pd-page">

                {/* QuickView modal */}
                {quickViewProduct && (
                    <QuickViewModal
                        product={quickViewProduct}
                        onClose={() => setQuickViewProduct(null)}
                        onAddToCart={addToCart}
                        onDetails={(slug) => navigate(`/product/${slug}`)}
                    />
                )}

                {/* ── Breadcrumb ── */}
                <div className="pd-hero">
                    <span className="pd-hero__crumb" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Home</span>
                    <span className="pd-hero__sep">›</span>
                    <span className="pd-hero__current">{product.name || 'Product Details'}</span>
                </div>

                {/* ── Main section ── */}
                <div className="pd-main">
                    <Viewer3D productId={product._id} productName={product.name} />

                    <div className="pd-info">
                        <div className="pd-info__badge">Product</div>
                        <div className="pd-info__name">{loadingProduct ? '—' : product.name}</div>
                        <div className="pd-info__price">₹{product.price?.toLocaleString('en-IN') || '—'}</div>

                        <hr className="pd-info__divider" />

                        <div className="pd-info__rows">
                            <div className="pd-info__row">
                                <span className="pd-info__row-label">Category</span>
                                <span className="pd-info__row-value">
                                    <span className="pd-info__category-chip">{product.category?.name || '—'}</span>
                                </span>
                            </div>
                            <div className="pd-info__row">
                                <span className="pd-info__row-label">Description</span>
                                <span className="pd-info__row-value">{product.description || '—'}</span>
                            </div>
                            {product.quantity !== undefined && (
                                <div className="pd-info__row">
                                    <span className="pd-info__row-label">In Stock</span>
                                    <span className="pd-info__row-value">
                                        {product.quantity > 0
                                            ? `${product.quantity} unit${product.quantity !== 1 ? 's' : ''} available`
                                            : 'Out of stock'}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="pd-info__cta">
                            <button className="pd-btn-primary" onClick={() => addToCart(product)} disabled={!product._id}>
                                + Add to Cart
                            </button>
                            <button className="pd-btn-secondary" onClick={() => navigate('/cart')}>
                                View Cart
                            </button>
                        </div>

                        <div className="pd-trust">
                            <div className="pd-trust__item"><div className="pd-trust__icon">🚚</div>Free Delivery</div>
                            <div className="pd-trust__item"><div className="pd-trust__icon">↩</div>Easy Returns</div>
                            <div className="pd-trust__item"><div className="pd-trust__icon">🔒</div>Secure Payment</div>
                        </div>
                    </div>
                </div>

                <hr className="pd-divider" />

                {/* ── Similar Products ── */}
                <div className="pd-similar">
                    <div className="pd-similar__header">
                        <div className="pd-similar__label">You May Also Like</div>
                        <div className="pd-similar__title">
                            Similar Products
                            {totalCount > 0 && (
                                <span className="pd-similar__count"> ({totalCount})</span>
                            )}
                        </div>
                    </div>

                    {loadingSimilar ? (
                        <div className="pd-grid">
                            {[1, 2, 3, 4].map(n => <SkeletonCard key={n} />)}
                        </div>
                    ) : relatedProducts.length < 1 ? (
                        <div className="pd-similar__empty">No similar products found.</div>
                    ) : (
                                <>
                                    <div className="pd-grid">
                                        {relatedProducts.map((p, i) => (
                                            <ProductCard
                                                key={p._id}
                                                p={p}
                                                delay={i * 60}
                                                onAddToCart={addToCart}
                                                onDetails={(slug) => navigate(`/product/${slug}`)}
                                        onQuickView={setQuickViewProduct}
                                    />
                                ))}
                                    </div>

                                    {/* Pagination — only when total > PER_PAGE */}
                                    {totalCount > PER_PAGE && (
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

export default ProductDetails;