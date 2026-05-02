


// import React, { useState, useEffect } from 'react';
// import Layout from '../components/Layout/Layout';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { useCart } from '../context/cart';

// const ProductDetails = () => {
//     const params = useParams();
//     const [cart, setCart] = useCart();
//     const [product, setProduct] = useState({});
//     const [relatedProducts, setRelatedproducts] = useState([]);

//     // Initial details
//     useEffect(() => {
//         if (params?.slug)
//             getProduct();
//     }, [params?.slug]);

//     // Get product details
//     const getProduct = async () => {
//         try {
//             const { data } = await axios.get(`/api/v1/product/get-product/${params.slug}`);
//             setProduct(data?.product);
//             getSimilarProduct(data?.product._id, data?.product.category._id);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     // Get similar products
//     const getSimilarProduct = async (pid, cid) => {
//         try {
//             const { data } = await axios.get(`/api/v1/product/related-product/${pid}/${cid}`);
//             setRelatedproducts(data?.products);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     return (
//         <Layout>
//             <div className="container mt-2">
//                 <div className="row">
//                     <div className="col-lg-4 col-md-6 col-sm-8 mx-auto">
//                         <div className="mt-5 mb-3 mb-sm-3 p-1" style={{ border: "2px solid #ddd", borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
//                             <img
//                                 src={`/api/v1/product/product-photo/${product._id}`}
//                                 className='card-img-top img-fluid'
//                                 alt={product.name}
//                                 width="100%"
//                                 style={{ transition: "transform 0.3s", objectFit: "cover" }}
//                                 onMouseOver={(e) => e.target.style.transform = "scale(1.07)"}
//                                 onMouseOut={(e) => e.target.style.transform = "scale(1)"}
//                             />
//                         </div>
//                     </div>
//                     <div className="col-lg-6 col-md-8 col-sm-10 mx-auto  mt-3 " >

//                         <div className="mt-3 " >
//                             <h5 className="text-center mb-2 fs-1">About Product</h5>
//                             <hr style={{ height: '1px', backgroundColor: '#000' }} />
//                             <div className="mt-4 mx-3" >
//                                 <h6>Name: {product.name}</h6>
//                                 <h6>Description: {product.description}</h6>
//                                 <h6>Category: {product.category?.name}</h6>
//                                 <h6>Price: ₹{product.price}</h6>
//                             </div>

//                             <button
//                                 className="btn btn-dark mt-3 text-center mx-4"
//                                 onClick={() => {
//                                     setCart([...cart, product]);
//                                     localStorage.setItem("cart", JSON.stringify([...cart, product]));
//                                     toast.success('Item Added to Cart');
//                                 }}
//                             >
//                                 Add to Cart
//                             </button>
//                         </div>
//                     </div>
//                 </div>

//             </div >
//             <hr className='mt-5 mx-3' style={{ height: '2px', backgroundColor: 'black' }} />

//             <div className="row container justify-content-center mx-auto">
//                 <h6 className='mt-4 mx-auto text-center mb-4 fs-3' style={{ color: 'black', fontWeight: 'bold' }}>
//                     <span style={{ backgroundColor: 'lightblue', padding: "8px", borderRadius: '6px' }}>SIMILAR PRODUCTS</span>
//                 </h6>
//                 {relatedProducts.length < 1 && (<p className='text-center mt-3 mb-0'>No Similar Products Found </p>)}
//                 <div className="mb-4 d-flex flex-wrap  justify-content-center mx-auto">
//                     {relatedProducts?.map((p) => (
//                             <div key={p._id} className="card m-3" style={{ width: "22rem" }}>
//                                 <img
//                                     src={`/api/v1/product/product-photo/${p._id}`}
//                                     className="card-img-top"
//                                     alt={p.name}
//                                     style={{ width: '100%', height: "350px", objectFit: 'cover', borderRadius: "4px" }}
//                                     onMouseOver={(e) => e.target.style.transform = 'scale(0.985)'}
//                                     onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
//                                 />
//                                 <div className="card-body" style={{ backgroundColor: "orange", borderRadius: "0 0 3px 3px" }}>
//                                     <h5 className="card-title">{p.name}</h5>
//                                     <p className="card-text">{p.description.substring(0, 30)}...</p>
//                                     <p className="card-text fw-bold fs-5">₹{p.price}</p>
//                                     <button className="btn btn-dark" onClick={() => {
//                                         setCart([...cart, p]);
//                                         localStorage.setItem("cart", JSON.stringify([...cart, p]));
//                                         toast.success('Item Added to Cart');
//                                     }}>ADD TO CART</button>
//                                 </div>
//                             </div>

//                     ))}
//                 </div>
//             </div>


//         </Layout >
//     );
// };

// export default ProductDetails;



import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../context/cart';
import './../StylePages/Productdetails.css';

/* ─────────────────────────────────────────────────────
   Skeleton Card — shown while similar products load
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
   Similar product card — matches homepage card UI
───────────────────────────────────────────────────── */
const ProductCard = ({ p, onAddToCart, onDetails, delay = 0 }) => (
    <div className="pd-card" style={{ animationDelay: `${delay}ms` }}>
        <div className="pd-card__img-wrap">
            <img
                className="pd-card__img"
                src={`/api/v1/product/product-photo/${p._id}`}
                alt={p.name}
            />
            <div className="pd-card__overlay">Quick View</div>
        </div>
        <div className="pd-card__body">
            <div className="pd-card__badge">Product</div>
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

        const maxTilt = 14; // degrees
        const rx = (-dy / (rect.height / 2)) * maxTilt;
        const ry = (dx / (rect.width / 2)) * maxTilt;

        // shine position (percentage)
        const px = ((e.clientX - rect.left) / rect.width) * 100;
        const py = ((e.clientY - rect.top) / rect.height) * 100;

        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
            if (el) {
                el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
            }
            if (shineRef.current) {
                shineRef.current.style.setProperty('--mx', `${px}%`);
                shineRef.current.style.setProperty('--my', `${py}%`);
            }
            // subtle image counter-shift for depth
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
                        src={`/api/v1/product/product-photo/${productId}`}
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

    /* ── fetch on slug change ── */
    useEffect(() => {
        if (params?.slug) {
            setLoadingProduct(true);
            setLoadingSimilar(true);
            setProduct({});
            setRelatedProducts([]);
            getProduct();
        }
        // scroll to top on product change
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [params?.slug]);

    const getProduct = async () => {
        try {
            const { data } = await axios.get(`/api/v1/product/get-product/${params.slug}`);
            setProduct(data?.product);
            setLoadingProduct(false);
            getSimilarProduct(data?.product._id, data?.product.category._id);
        } catch (error) {
            console.log(error);
            setLoadingProduct(false);
        }
    };

    const getSimilarProduct = async (pid, cid) => {
        try {
            const { data } = await axios.get(`/api/v1/product/related-product/${pid}/${cid}`);
            setRelatedProducts(data?.products);
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingSimilar(false);
        }
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

                {/* ── Breadcrumb ── */}
                <div className="pd-hero">
                    <span className="pd-hero__crumb" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Home</span>
                    <span className="pd-hero__sep">›</span>
                    <span className="pd-hero__current">{product.name || 'Product Details'}</span>
                </div>

                {/* ── Main section: 3D viewer + info ── */}
                <div className="pd-main">

                    {/* LEFT — 3D Image Viewer */}
                    <Viewer3D productId={product._id} productName={product.name} />

                    {/* RIGHT — Product Info */}
                    <div className="pd-info">
                        <div className="pd-info__badge">Product</div>

                        <div className="pd-info__name">
                            {loadingProduct ? '—' : product.name}
                        </div>

                        <div className="pd-info__price">
                            ₹{product.price?.toLocaleString('en-IN') || '—'}
                        </div>

                        <hr className="pd-info__divider" />

                        <div className="pd-info__rows">
                            <div className="pd-info__row">
                                <span className="pd-info__row-label">Category</span>
                                <span className="pd-info__row-value">
                                    <span className="pd-info__category-chip">
                                        {product.category?.name || '—'}
                                    </span>
                                </span>
                            </div>
                            <div className="pd-info__row">
                                <span className="pd-info__row-label">Description</span>
                                <span className="pd-info__row-value">
                                    {product.description || '—'}
                                </span>
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

                        {/* CTA */}
                        <div className="pd-info__cta">
                            <button
                                className="pd-btn-primary"
                                onClick={() => addToCart(product)}
                                disabled={!product._id}
                            >
                                + Add to Cart
                            </button>
                            <button
                                className="pd-btn-secondary"
                                onClick={() => navigate('/cart')}
                            >
                                View Cart
                            </button>
                        </div>

                        {/* Trust badges */}
                        <div className="pd-trust">
                            <div className="pd-trust__item">
                                <div className="pd-trust__icon">🚚</div>
                                Free Delivery
                            </div>
                            <div className="pd-trust__item">
                                <div className="pd-trust__icon">↩</div>
                                Easy Returns
                            </div>
                            <div className="pd-trust__item">
                                <div className="pd-trust__icon">🔒</div>
                                Secure Payment
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Divider ── */}
                <hr className="pd-divider" />

                {/* ── Similar Products ── */}
                <div className="pd-similar">
                    <div className="pd-similar__header">
                        <div className="pd-similar__label">You May Also Like</div>
                        <div className="pd-similar__title">Similar Products</div>
                    </div>

                    {loadingSimilar ? (
                        /* skeleton grid */
                        <div className="pd-grid">
                            {[1, 2, 3, 4].map(n => <SkeletonCard key={n} />)}
                        </div>
                    ) : relatedProducts.length < 1 ? (
                        <div className="pd-similar__empty">No similar products found.</div>
                    ) : (
                        <div className="pd-grid">
                            {relatedProducts.map((p, i) => (
                                <ProductCard
                                    key={p._id}
                                    p={p}
                                    delay={i * 60}
                                    onAddToCart={addToCart}
                                    onDetails={(slug) => navigate(`/product/${slug}`)}
                                />
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </Layout>
    );
};

export default ProductDetails;