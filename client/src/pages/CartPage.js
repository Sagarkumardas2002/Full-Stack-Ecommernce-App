

// import Layout from '../components/Layout/Layout'
// import React, { useEffect, useState } from 'react'
// import { useCart } from '../context/cart'
// import { useAuth } from '../context/auth';
// import { useNavigate } from 'react-router-dom';
// import DropIn from "braintree-web-drop-in-react"
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import './../StylePages/Cartpage.css';

// /* ─────────────────────────────────────────────
//    Skeleton card
// ───────────────────────────────────────────── */
// const SkeletonCard = () => (
//     <div className="tv-skel-item">
//         <div className="tv-skel tv-skel-img" />
//         <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
//             <div className="tv-skel tv-skel-block" style={{ width: '40%', height: 10, marginBottom: 6 }} />
//             <div className="tv-skel tv-skel-block" style={{ width: '70%' }} />
//             <div className="tv-skel tv-skel-block" style={{ width: '90%' }} />
//             <div className="tv-skel tv-skel-block" style={{ width: '40%', marginTop: 8 }} />
//             <div className="tv-skel tv-skel-block" style={{ width: '30%' }} />
//         </div>
//     </div>
// );

// /* ─────────────────────────────────────────────
//    Main component
// ───────────────────────────────────────────── */
// const CartPage = () => {
//     const [auth] = useAuth();
//     const [cart, setCart] = useCart();
//     const [clientToken, setClientToken] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [pageLoading, setPageLoading] = useState(true);
//     const [instance, setInstance] = useState('');
//     const navigate = useNavigate();

//     /* ── simulate initial page-load skeleton ── */
//     useEffect(() => {
//         const t = setTimeout(() => setPageLoading(false), 900);
//         return () => clearTimeout(t);
//     }, []);

//     /* ── ensure every cart item has cartQty starting at 1 ── */
//     useEffect(() => {
//         if (!cart?.length) return;
//         const fixed = cart.map(item => ({
//             ...item,
//             cartQty: item.cartQty ?? 1,
//         }));
//         const needsFix = fixed.some((f, i) => f.cartQty !== cart[i]?.cartQty);
//         if (needsFix) {
//             setCart(fixed);
//             localStorage.setItem('cart', JSON.stringify(fixed));
//         }
//     }, []); // run once on mount

//     /* ── quantity helpers ── */
//     const updateQty = (productId, delta) => {
//         const myCart = cart.map(item => {
//             if (item._id !== productId) return item;
//             const maxStock = item.quantity;
//             const newQty = (item.cartQty ?? 1) + delta;
//             if (newQty < 1) return item;
//             if (newQty > maxStock) {
//                 toast.error(`Only ${maxStock} unit${maxStock > 1 ? 's' : ''} available in stock!`, { icon: '📦' });
//                 return item;
//             }
//             return { ...item, cartQty: newQty };
//         });
//         setCart(myCart);
//         localStorage.setItem('cart', JSON.stringify(myCart));
//     };

//     /* ── total price ── */
//     const totalPrice = () => {
//         try {
//             const total = (cart ?? []).reduce((sum, item) => sum + item.price * (item.cartQty ?? 1), 0);
//             return total.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
//         } catch { return '₹0'; }
//     };

//     const totalItems = () =>
//         (cart ?? []).reduce((sum, item) => sum + (item.cartQty ?? 1), 0);

//     /* ── remove item ── */
//     const removeCartItem = (pid) => {
//         const myCart = cart.filter(item => item._id !== pid);
//         setCart(myCart);
//         localStorage.setItem('cart', JSON.stringify(myCart));
//         toast.success('Item removed from cart');
//     };

//     /* ── payment token ── */
//     const getToken = async () => {
//         try {
//             const { data } = await axios.get('/api/v1/product/braintree/token');
//             setClientToken(data?.clientToken);
//         } catch (e) { console.log(e); }
//     };
//     useEffect(() => { getToken(); }, [auth?.token]);


//     /* ── handle payment ── */
//     const handlePayment = async () => {
//         try {
//             setLoading(true);
//             const { nonce } = await instance.requestPaymentMethod();

//             // Send cart as-is — backend will handle it
//             await axios.post('/api/v1/product/braintree/payment', {
//                 nonce,
//                 cart,  // cartQty included — backend now multiplies correctly
//             });

//             setLoading(false);
//             localStorage.removeItem('cart');
//             setCart([]);
//             navigate('/dashboard/user/orders');
//             toast.success('Payment Completed Successfully 🎉');
//         } catch (e) {
//             console.log(e);
//             setLoading(false);
//             toast.error('Payment failed. Please try again.');
//         }
//     };


//     /* ─────────── RENDER ─────────── */
//     return (
//         <Layout>
//             <div className="tv-cart">

//                 {/* ── Hero banner ── */}
//                 <div className="tv-cart__hero">
//                     <div className="tv-cart__hero-greeting">
//                         <span>Hello, </span>
//                         {auth?.token && auth?.user?.name ? auth.user.name : 'Guest'}
//                     </div>
//                     {cart?.length ? (
//                         <div className="tv-cart__hero-pill">
//                             🛒 {cart.length} product{cart.length !== 1 ? 's' : ''} · {totalItems()} item{totalItems() !== 1 ? 's' : ''}
//                         </div>
//                     ) : (
//                         <div className="tv-cart__hero-pill empty">
//                             Your cart is empty
//                         </div>
//                     )}
//                 </div>

//                 {/* ── Body grid ── */}
//                 <div className="tv-cart__body">

//                     {/* LEFT — cart items */}
//                     <div className="tv-cart__left">
//                         {pageLoading ? (
//                             <>
//                                 <div className="tv-cart__section-head">Loading your cart…</div>
//                                 {[1, 2, 3].map(n => <SkeletonCard key={n} />)}
//                             </>
//                         ) : !cart?.length ? (
//                             <div className="tv-cart__empty">
//                                 <div className="tv-cart__empty-icon">🛒</div>
//                                 <div className="tv-cart__empty-title">Your cart is empty</div>
//                                 <div className="tv-cart__empty-sub">
//                                     Looks like you haven't added anything yet. Explore our premium tech collection.
//                                 </div>
//                                 <button className="tv-cart__empty-cta" onClick={() => navigate('/')}>
//                                     Browse Products →
//                                 </button>
//                             </div>
//                         ) : (
//                             <>
//                                 {cart.map((p, i) => {
//                                     const cartQty = p.cartQty ?? 1;
//                                     const maxStock = p.quantity;
//                                     const atMax = cartQty >= maxStock;
//                                     const atMin = cartQty <= 1;

//                                     return (
//                                         <div
//                                             className="tv-cart__item"
//                                             key={p._id}
//                                             style={{ animationDelay: `${i * 55}ms` }}
//                                         >
//                                             {/* image */}
//                                             <div className="tv-cart__img-wrap">
//                                                 <img
//                                                     className="tv-cart__img"
//                                                     src={`/api/v1/product/product-photo/${p._id}`}
//                                                     alt={p.name}
//                                                 />
//                                             </div>

//                                             {/* details */}
//                                             <div className="tv-cart__info">
//                                                 <div className="tv-cart__product-badge">Product</div>
//                                                 <div className="tv-cart__name">{p.name}</div>
//                                                 <div className="tv-cart__desc">
//                                                     {p.description?.substring(0, 70)}…
//                                                 </div>
//                                                 <div className="tv-cart__price">
//                                                     ₹{(p.price * cartQty).toLocaleString('en-IN')}
//                                                     {cartQty > 1 && (
//                                                         <span className="tv-cart__price-unit">
//                                                             (₹{p.price.toLocaleString('en-IN')} × {cartQty})
//                                                         </span>
//                                                     )}
//                                                 </div>

//                                                 {/* qty row */}
//                                                 <div className="tv-cart__qty-row">
//                                                     <span className="tv-cart__qty-label">Qty:</span>
//                                                     <div className="tv-cart__qty-controls">
//                                                         <button
//                                                             className="tv-cart__qty-btn"
//                                                             disabled={atMin}
//                                                             onClick={() => updateQty(p._id, -1)}
//                                                             title="Decrease quantity"
//                                                         >−</button>
//                                                         <span className="tv-cart__qty-num">{cartQty}</span>
//                                                         <button
//                                                             className="tv-cart__qty-btn"
//                                                             disabled={atMax}
//                                                             onClick={() => updateQty(p._id, +1)}
//                                                             title="Increase quantity"
//                                                         >+</button>
//                                                     </div>
//                                                     {atMax && (
//                                                         <span className="tv-cart__stock-warn">
//                                                             Max {maxStock} in stock
//                                                         </span>
//                                                     )}
//                                                     {maxStock <= 3 && !atMax && (
//                                                         <span className="tv-cart__stock-low">
//                                                             Only {maxStock - cartQty} left!
//                                                         </span>
//                                                     )}
//                                                 </div>

//                                                 {/* actions — matching "Details" + "+ Cart" button style from image */}
//                                                 <div className="tv-cart__actions">
//                                                     <button
//                                                         className="tv-cart__details-btn"
//                                                         onClick={() => navigate(`/product/${p.slug}`)}
//                                                     >
//                                                         Details
//                                                     </button>
//                                                     <button
//                                                         className="tv-cart__remove"
//                                                         onClick={() => removeCartItem(p._id)}
//                                                     >
//                                                         🗑 Remove
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     );
//                                 })}
//                             </>
//                         )}
//                     </div>

//                     {/* RIGHT — summary */}
//                     <div className="tv-cart__right">
//                         <div className="tv-cart__summary">

//                             {/* ── Dark header strip ── */}
//                             <div className="tv-cart__summary-header">
//                                 <div className="tv-cart__summary-title">Order Summary</div>
//                                 <div className="tv-cart__summary-sub">Review · Pay · Done</div>
//                             </div>

//                             <div className="tv-cart__summary-body">

//                                 {/* ── Line items ── */}
//                                 <div className="tv-cart__line">
//                                     <span className="tv-cart__line-label">Products</span>
//                                     <span className="tv-cart__line-value">{cart?.length ?? 0}</span>
//                                 </div>
//                                 <div className="tv-cart__line">
//                                     <span className="tv-cart__line-label">Total Items</span>
//                                     <span className="tv-cart__line-value">{totalItems()}</span>
//                                 </div>
//                                 <div className="tv-cart__line">
//                                     <span className="tv-cart__line-label">Shipping</span>
//                                     <span className="tv-cart__line-value tv-cart__line-value--green">Free</span>
//                                 </div>
//                                 <div className="tv-cart__line">
//                                     <span className="tv-cart__line-label">Tax</span>
//                                     <span className="tv-cart__line-value tv-cart__line-value--gold">Included</span>
//                                 </div>

//                                 {/* ── Grand total ── */}
//                                 <div className="tv-cart__total-block">
//                                     <span className="tv-cart__total-label">Grand Total</span>
//                                     <span className="tv-cart__total-value">{totalPrice()}</span>
//                                 </div>
//                                 <div className="tv-cart__items-count">
//                                     {totalItems()} item{totalItems() !== 1 ? 's' : ''} · {cart?.length ?? 0} product{(cart?.length ?? 0) !== 1 ? 's' : ''}
//                                 </div>

//                                 <hr className="tv-cart__divider" />

//                                 {/* ── Address ── */}
//                                 {auth?.user?.address ? (
//                                     <div className="tv-cart__addr-box">
//                                         <div className="tv-cart__addr-lbl">📍 Delivering to</div>
//                                         <div className="tv-cart__addr-val">{auth.user.address}</div>
//                                         <button className="tv-cart__addr-btn" onClick={() => navigate('/dashboard/user/profile')}>
//                                             ✏ Update Address
//                                         </button>
//                                     </div>
//                                 ) : (
//                                     <div className="tv-cart__addr-box" style={{ textAlign: 'center' }}>
//                                         <div className="tv-cart__addr-lbl">No delivery address</div>
//                                         {auth?.token ? (
//                                             <button className="tv-cart__addr-btn" onClick={() => navigate('/dashboard/user/profile')}>
//                                                 + Add Address
//                                             </button>
//                                         ) : (
//                                             <button className="tv-cart__login-btn" onClick={() => navigate('/login', { state: '/cart' })}>
//                                                 Login to Checkout
//                                             </button>
//                                         )}
//                                     </div>
//                                 )}

//                                 {/* ── Payment section ── */}
//                                 {clientToken && cart?.length > 0 && (
//                                     <div className="tv-cart__dropin-wrap">
//                                         <hr className="tv-cart__divider" />

//                                         {/* Payment header */}
//                                         <div className="tv-cart__payment-header">
//                                             <div className="tv-cart__payment-icon">
//                                                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                                                     <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
//                                                     <line x1="1" y1="10" x2="23" y2="10" />
//                                                 </svg>
//                                             </div>
//                                             <span className="tv-cart__payment-title">Payment Method</span>
//                                         </div>

//                                         {/* Accepted cards */}
//                                         <div className="tv-cart__accepted-cards">
//                                             {['VISA', 'Mastercard', 'PayPal', 'Amex'].map(c => (
//                                                 <span key={c} className="tv-cart__card-badge">{c}</span>
//                                             ))}
//                                         </div>

//                                         {/* Braintree DropIn */}
//                                         <DropIn
//                                             options={{ authorization: clientToken, paypal: { flow: 'vault' } }}
//                                             onInstance={inst => setInstance(inst)}
//                                         />

//                                         {/* Pay button */}
//                                         <button
//                                             className="tv-cart__pay-btn"
//                                             onClick={handlePayment}
//                                             disabled={loading || !instance}
//                                         >
//                                             {loading ? (
//                                                 <><span className="tv-spinner" /> Processing…</>
//                                             ) : (
//                                                 <>
//                                                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//                                                         <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
//                                                     </svg>
//                                                     Pay {totalPrice()} Securely
//                                                 </>
//                                             )}
//                                         </button>

//                                         {/* Trust badges */}
//                                         <div className="tv-cart__trust-row">
//                                             <div className="tv-cart__trust-item">
//                                                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//                                                     <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
//                                                 </svg>
//                                                 SSL Secure
//                                             </div>
//                                             <div className="tv-cart__trust-item">
//                                                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//                                                     <polyline points="20 6 9 17 4 12" />
//                                                 </svg>
//                                                 Sandbox Safe
//                                             </div>
//                                             <div className="tv-cart__trust-item">
//                                                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//                                                     <circle cx="12" cy="12" r="10" />
//                                                     <polyline points="12 6 12 12 16 14" />
//                                                 </svg>
//                                                 Instant
//                                             </div>
//                                         </div>

//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>

//                 </div>
//             </div>
//         </Layout>
//     );
// };

// export default CartPage;

import Layout from '../components/Layout/Layout'
import React, { useEffect, useState } from 'react'
import { useCart } from '../context/cart'
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';
import DropIn from "braintree-web-drop-in-react"
import axios from '../config/axios';    // ← fixed: shared axios with backend baseURL
import toast from 'react-hot-toast';
import './../StylePages/Cartpage.css';
import { API } from '../config/api';

/* ─────────────────────────────────────────────
   Skeleton card
───────────────────────────────────────────── */
const SkeletonCard = () => (
    <div className="tv-skel-item">
        <div className="tv-skel-img" />
        <div className="tv-skel-body">
            <div className="tv-skel-block" style={{ width: '38%', height: 10 }} />
            <div className="tv-skel-block" style={{ width: '72%' }} />
            <div className="tv-skel-block" style={{ width: '92%' }} />
            <div className="tv-skel-block" style={{ width: '42%', marginTop: 6 }} />
            <div className="tv-skel-block" style={{ width: '30%' }} />
        </div>
    </div>
);

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
const CartPage = () => {
    const [auth] = useAuth();
    const [cart, setCart] = useCart();
    const [clientToken, setClientToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [instance, setInstance] = useState('');
    const navigate = useNavigate();

    /* ── simulate initial page-load skeleton ── */
    useEffect(() => {
        const t = setTimeout(() => setPageLoading(false), 900);
        return () => clearTimeout(t);
    }, []);

    /* ── ensure every cart item has cartQty starting at 1 ── */
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (!cart?.length) return;
        const fixed = cart.map(item => ({
            ...item,
            cartQty: item.cartQty ?? 1,
        }));
        const needsFix = fixed.some((f, i) => f.cartQty !== cart[i]?.cartQty);
        if (needsFix) {
            setCart(fixed);
            localStorage.setItem('cart', JSON.stringify(fixed));
        }
    }, []); // run once on mount

    /* ── quantity helpers ── */
    const updateQty = (productId, delta) => {
        const myCart = (cart || []).map(item => {
            if (item._id !== productId) return item;
            const maxStock = item.quantity;
            const newQty = (item.cartQty ?? 1) + delta;
            if (newQty < 1) return item;
            if (newQty > maxStock) {
                toast.error(`Only ${maxStock} unit${maxStock > 1 ? 's' : ''} available in stock!`, { icon: '📦' });
                return item;
            }
            return { ...item, cartQty: newQty };
        });
        setCart(myCart);
        localStorage.setItem('cart', JSON.stringify(myCart));
    };

    /* ── total price ── */
    const totalPrice = () => {
        try {
            const total = (cart ?? []).reduce((sum, item) => sum + item.price * (item.cartQty ?? 1), 0);
            return total.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
        } catch { return '₹0'; }
    };

    const totalItems = () =>
        (cart ?? []).reduce((sum, item) => sum + (item.cartQty ?? 1), 0);

    /* ── remove item ── */
    const removeCartItem = (pid) => {
        const myCart = (cart || []).filter(item => item._id !== pid);
        setCart(myCart);
        localStorage.setItem('cart', JSON.stringify(myCart));
        toast.success('Item removed from cart');
    };

    /* ── payment token ── */
    const getToken = async () => {
        try {
            const { data } = await axios.get('/api/v1/product/braintree/token');
            setClientToken(data?.clientToken || '');
        } catch (e) {
            // silently fail — payment section just won't show
        }
    };
    useEffect(() => { getToken(); }, [auth?.token]);

    /* ── handle payment ── */
    const handlePayment = async () => {
        try {
            setLoading(true);
            const { nonce } = await instance.requestPaymentMethod();
            await axios.post('/api/v1/product/braintree/payment', {
                nonce,
                cart,
            });
            setLoading(false);
            localStorage.removeItem('cart');
            setCart([]);
            navigate('/dashboard/user/orders');
            toast.success('Payment Completed Successfully 🎉');
        } catch (e) {
            setLoading(false);
            toast.error('Payment failed. Please try again.');
        }
    };

    /* ─────────── RENDER ─────────── */
    return (
        <Layout>
            <div className="tv-cart">

                {/* ── Hero banner ── */}
                <div className="tv-cart__hero">
                    <div className="tv-cart__hero-greeting">
                        <span>Hello, </span>
                        {auth?.token && auth?.user?.name ? auth.user.name : 'Guest'}
                    </div>
                    {cart?.length ? (
                        <div className="tv-cart__hero-pill">
                            🛒 {cart.length} product{cart.length !== 1 ? 's' : ''} · {totalItems()} item{totalItems() !== 1 ? 's' : ''}
                        </div>
                    ) : (
                        <div className="tv-cart__hero-pill empty">
                            Your cart is empty
                        </div>
                    )}
                </div>

                {/* ── Body grid ── */}
                <div className="tv-cart__body">

                    {/* LEFT — cart items */}
                    <div className="tv-cart__left">
                        {pageLoading ? (
                            <>
                                <div className="tv-cart__section-head">Loading your cart…</div>
                                {[1, 2, 3].map(n => <SkeletonCard key={n} />)}
                            </>
                        ) : !(cart?.length) ? (
                            <div className="tv-cart__empty">
                                <div className="tv-cart__empty-icon">🛒</div>
                                <div className="tv-cart__empty-title">Your cart is empty</div>
                                <div className="tv-cart__empty-sub">
                                    Looks like you haven't added anything yet. Explore our premium tech collection.
                                </div>
                                <button className="tv-cart__empty-cta" onClick={() => navigate('/')}>
                                    Browse Products →
                                </button>
                            </div>
                        ) : (
                            <>
                                {(cart || []).map((p, i) => {
                                    const cartQty = p.cartQty ?? 1;
                                    const maxStock = p.quantity;
                                    const atMax = cartQty >= maxStock;
                                    const atMin = cartQty <= 1;

                                    return (
                                        <div
                                            className="tv-cart__item"
                                            key={p._id}
                                            style={{ animationDelay: `${i * 55}ms` }}
                                        >
                                            {/* image */}
                                            <div className="tv-cart__img-wrap">
                                                <img
                                                    className="tv-cart__img"
                                                    src={`${API}/api/v1/product/product-photo/${p._id}`}
                                                    alt={p.name}
                                                />
                                            </div>

                                            {/* details */}
                                            <div className="tv-cart__info">
                                                <div className="tv-cart__product-badge">Product</div>
                                                <div className="tv-cart__name">{p.name}</div>
                                                <div className="tv-cart__desc">
                                                    {p.description?.substring(0, 70)}…
                                                </div>
                                                <div className="tv-cart__price">
                                                    ₹{(p.price * cartQty).toLocaleString('en-IN')}
                                                    {cartQty > 1 && (
                                                        <span className="tv-cart__price-unit">
                                                            (₹{p.price.toLocaleString('en-IN')} × {cartQty})
                                                        </span>
                                                    )}
                                                </div>

                                                {/* qty row */}
                                                <div className="tv-cart__qty-row">
                                                    <span className="tv-cart__qty-label">Qty:</span>
                                                    <div className="tv-cart__qty-controls">
                                                        <button
                                                            className="tv-cart__qty-btn"
                                                            disabled={atMin}
                                                            onClick={() => updateQty(p._id, -1)}
                                                            title="Decrease quantity"
                                                        >−</button>
                                                        <span className="tv-cart__qty-num">{cartQty}</span>
                                                        <button
                                                            className="tv-cart__qty-btn"
                                                            disabled={atMax}
                                                            onClick={() => updateQty(p._id, +1)}
                                                            title="Increase quantity"
                                                        >+</button>
                                                    </div>
                                                    {atMax && (
                                                        <span className="tv-cart__stock-warn">
                                                            Max {maxStock} in stock
                                                        </span>
                                                    )}
                                                    {maxStock <= 3 && !atMax && (
                                                        <span className="tv-cart__stock-low">
                                                            Only {maxStock - cartQty} left!
                                                        </span>
                                                    )}
                                                </div>

                                                {/* actions */}
                                                <div className="tv-cart__actions">
                                                    <button
                                                        className="tv-cart__details-btn"
                                                        onClick={() => navigate(`/product/${p.slug}`)}
                                                    >
                                                        Details
                                                    </button>
                                                    <button
                                                        className="tv-cart__remove"
                                                        onClick={() => removeCartItem(p._id)}
                                                    >
                                                        🗑 Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                        )}
                    </div>

                    {/* RIGHT — summary */}
                    <div className="tv-cart__right">
                        <div className="tv-cart__summary">

                            {/* ── Dark header strip ── */}
                            <div className="tv-cart__summary-header">
                                <div className="tv-cart__summary-title">Order Summary</div>
                                <div className="tv-cart__summary-sub">Review · Pay · Done</div>
                            </div>

                            <div className="tv-cart__summary-body">

                                {/* ── Line items ── */}
                                <div className="tv-cart__line">
                                    <span className="tv-cart__line-label">Products</span>
                                    <span className="tv-cart__line-value">{cart?.length ?? 0}</span>
                                </div>
                                <div className="tv-cart__line">
                                    <span className="tv-cart__line-label">Total Items</span>
                                    <span className="tv-cart__line-value">{totalItems()}</span>
                                </div>
                                <div className="tv-cart__line">
                                    <span className="tv-cart__line-label">Shipping</span>
                                    <span className="tv-cart__line-value tv-cart__line-value--green">Free</span>
                                </div>
                                <div className="tv-cart__line">
                                    <span className="tv-cart__line-label">Tax</span>
                                    <span className="tv-cart__line-value tv-cart__line-value--gold">Included</span>
                                </div>

                                {/* ── Grand total ── */}
                                <div className="tv-cart__total-block">
                                    <span className="tv-cart__total-label">Grand Total</span>
                                    <span className="tv-cart__total-value">{totalPrice()}</span>
                                </div>
                                <div className="tv-cart__items-count">
                                    {totalItems()} item{totalItems() !== 1 ? 's' : ''} · {cart?.length ?? 0} product{(cart?.length ?? 0) !== 1 ? 's' : ''}
                                </div>

                                <hr className="tv-cart__divider" />

                                {/* ── Address ── */}
                                {auth?.user?.address ? (
                                    <div className="tv-cart__addr-box">
                                        <div className="tv-cart__addr-lbl">📍 Delivering to</div>
                                        <div className="tv-cart__addr-val">{auth.user.address}</div>
                                        <button className="tv-cart__addr-btn" onClick={() => navigate('/dashboard/user/profile')}>
                                            ✏ Update Address
                                        </button>
                                    </div>
                                ) : (
                                    <div className="tv-cart__addr-box" style={{ textAlign: 'center' }}>
                                        <div className="tv-cart__addr-lbl">No delivery address</div>
                                        {auth?.token ? (
                                            <button className="tv-cart__addr-btn" onClick={() => navigate('/dashboard/user/profile')}>
                                                + Add Address
                                            </button>
                                        ) : (
                                            <button className="tv-cart__login-btn" onClick={() => navigate('/login', { state: '/cart' })}>
                                                Login to Checkout
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* ── Payment section ── */}
                                {clientToken && cart?.length > 0 && (
                                    <div className="tv-cart__dropin-wrap">
                                        <hr className="tv-cart__divider" />

                                        {/* Payment header */}
                                        <div className="tv-cart__payment-header">
                                            <div className="tv-cart__payment-icon">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                                                    <line x1="1" y1="10" x2="23" y2="10" />
                                                </svg>
                                            </div>
                                            <span className="tv-cart__payment-title">Payment Method</span>
                                        </div>

                                        {/* Accepted cards */}
                                        <div className="tv-cart__accepted-cards">
                                            {['VISA', 'Mastercard', 'PayPal', 'Amex'].map(c => (
                                                <span key={c} className="tv-cart__card-badge">{c}</span>
                                            ))}
                                        </div>

                                        {/* Braintree DropIn */}
                                        <DropIn
                                            options={{ authorization: clientToken, paypal: { flow: 'vault' } }}
                                            onInstance={inst => setInstance(inst)}
                                        />

                                        {/* Pay button */}
                                        <button
                                            className="tv-cart__pay-btn"
                                            onClick={handlePayment}
                                            disabled={loading || !instance}
                                        >
                                            {loading ? (
                                                <><span className="tv-spinner" /> Processing…</>
                                            ) : (
                                                <>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                                    </svg>
                                                    Pay {totalPrice()} Securely
                                                </>
                                            )}
                                        </button>

                                        {/* Trust badges */}
                                        <div className="tv-cart__trust-row">
                                            <div className="tv-cart__trust-item">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                                </svg>
                                                SSL Secure
                                            </div>
                                            <div className="tv-cart__trust-item">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                                Sandbox Safe
                                            </div>
                                            <div className="tv-cart__trust-item">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <polyline points="12 6 12 12 16 14" />
                                                </svg>
                                                Instant
                                            </div>
                                        </div>

                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </Layout>
    );
};

export default CartPage;