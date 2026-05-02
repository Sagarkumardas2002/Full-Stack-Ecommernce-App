// import Layout from '../components/Layout/Layout'
// import React, { useEffect, useState } from 'react'
// import { useCart } from '../context/cart'
// import { useAuth } from '../context/auth';
// import { useNavigate } from 'react-router-dom';
// import DropIn from "braintree-web-drop-in-react"
// import axios from 'axios';
// import toast from 'react-hot-toast';


// const CartPage = () => {
//     const [auth, setAuth] = useAuth();
//     const [cart, setCart] = useCart();
//     const [clientToken, setClientToken] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [instance, setInstance] = useState("");

//     const navigate = useNavigate();

//     //for updating the cart element quantity thorugh + and - button
//     const updateCartItemQuantity = (productId, newQuantity) => {
//         try {
//             let myCart = [...cart];
//             const index = myCart.findIndex(item => item._id === productId);
//             if (index !== -1) {
//                 myCart[index].quantity = Math.max(1, newQuantity); // Ensure quantity is at least 1
//                 setCart(myCart);
//                 localStorage.setItem("cart", JSON.stringify(myCart));
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     };


//     //total price
//     const totalPrice = () => {
//         try {
//             let total = 0;
//             cart?.map((item) => {
//                 total = total + item.price;
//                 return null; // Add a return statement here
//             });
//             return total.toLocaleString("en-IN", {
//                 style: "currency",
//                 currency: "INR",
//             });
//         } catch (error) {
//             console.log(error);
//         }
//     };
//     //detele item
//     const removeCartItem = (pid) => {
//         try {
//             let myCart = [...cart];
//             let index = myCart.findIndex((item) => item._id === pid);
//             myCart.splice(index, 1);
//             setCart(myCart);
//             localStorage.setItem("cart", JSON.stringify(myCart));
//         } catch (error) {
//             console.log(error);
//         }
//     };


//     //get payment gateway token
//     const getToken = async () => {
//         try {
//             const { data } = await axios.get("/api/v1/product/braintree/token");
//             setClientToken(data?.clientToken);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     useEffect(() => {
//         getToken();
//     }, [auth?.token])


//     //handle payments
//     const handlePayment = async () => {
//         try {
//             setLoading(true);
//             const { nonce } = await instance.requestPaymentMethod();
//             const { data } = await axios.post("/api/v1/product/braintree/payment", {
//                 nonce,
//                 cart,
//             });
//             setLoading(false);
//             localStorage.removeItem("cart");
//             setCart([]);
//             navigate("/dashboard/user/orders");
//             toast.success("Payment Completed Successfully ");
//         } catch (error) {
//             console.log(error);
//             setLoading(false);
//         }
//     };

//     return (
//         <Layout>
//             <div className="container" >
//                 <div className="row mt-2">
//                     <div className="col-md-12" >
//                         <div className="text-center p-2 " >
//                             <span style={{ fontWeight: 'bold', color: "red", borderRadius: '5px', fontSize: "28px" }}>{`Welcome ${auth?.token && auth?.user?.name}`}</span>
//                         </div>
//                         <div className="text-center p-2 " style={{ color: "black", borderRadius: '5px', fontSize: "16px" }}>
//                             {cart?.length ? (
//                                 <p style={{ border: "2px solid lightblue", fontSize: "20px", padding: "6px", backgroundColor: "lightblue", borderRadius: "4px" }}>
//                                     You Have {cart.length} items in your cart{auth?.token ? "" : " Please login to checkout"}
//                                 </p>
//                             ) : (
//                                 <span style={{ fontSize: "20px", border: "2px solid lightblue", padding: "8px", backgroundColor: "lightblue", borderRadius: "4px" }}>
//                                     Your Cart Is Empty
//                                 </span>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 <div className="row mt-3" >

//                     <div className="col-md-7 p-4 mb-5" >
//                         {cart?.map((p) => (
//                             <div className="row mb-4 m-1 p-3 card flex-md-row flex-column align-items-center" key={p._id} style={{ backgroundColor: "#F2F2F2" }}>
//                                 <div className="col-md-4 mb-4 mb-md-0">
//                                     <img
//                                         src={`/api/v1/product/product-photo/${p._id}`}
//                                         className="card-img-top mt-3 mb-3"
//                                         alt={p.name}
//                                         style={{ maxWidth: "100%", borderRadius: "4px", height: "auto", transition: "transform 0.2s ease-in-out" }}
//                                         onMouseOver={(e) => { e.target.style.transform = "scale(1.1)"; }}
//                                         onMouseOut={(e) => { e.target.style.transform = "scale(1)"; }}
//                                     />
//                                 </div>
//                                 <div className="col-md-8 mt-3 mt-md-0 ">
//                                     <p style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>{p.name}</p>
//                                     <p style={{ marginBottom: "0.5rem" }}>{p.description.substring(0, 50)}</p>
//                                     <p style={{ color: "red", fontWeight: "bold", marginBottom: "1rem" }}>Price: ₹{p.price}</p>

//                                     <div className="d-flex align-items-center mb-2">
//                                         Quantity: &nbsp;  <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => updateCartItemQuantity(p._id, p.quantity - 1)}>-</button>
//                                         <span className="me-2">{p.quantity}</span>
//                                         <button className="btn btn-sm btn-outline-secondary" onClick={() => updateCartItemQuantity(p._id, p.quantity + 1)}>+</button>
//                                     </div>
//                                     <button className="btn btn-danger mb-2 mt-3 mx-3" onClick={() => removeCartItem(p._id)}>Remove</button>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>

//                     <div className="col-md-1"></div>
//                     <div className="col-md-4 text-center">
//                         <h2>Cart Summary </h2>
//                         <p>Total |  Checkout | Payment</p>
//                         <hr />
//                         <h4>Total : <span className='text-danger'>{totalPrice()} </span></h4>
//                         {auth?.user?.address ? (
//                             <>
//                                 <div className="mb-3">
//                                     <h5>Current Address :{auth?.user?.address} </h5>
//                                     <button className='btn btn-warning'
//                                         onClick={() => navigate('/dashboard/user/profile')}>Update Address</button>
//                                 </div></>
//                         ) : (
//                             <div className="mb-3">
//                                 {auth?.token ? (
//                                     <button class='btn btn-outline-warning' onClick={() => navigate('/dashboard/user/profile')}></button>
//                                 ) : (
//                                     <button className='btn btn-warning' onClick={() => navigate('/login', { state: "/cart" })}>Please Login to checkout</button>
//                                 )}
//                             </div>
//                         )}
//                         <div className="mt-4">
//                             {!clientToken || !cart?.length ? ("") : (
//                                 <>
//                                     <DropIn
//                                         options={{
//                                             authorization: clientToken,
//                                             paypal: {
//                                                 flow: "vault",
//                                             },
//                                         }}
//                                         onInstance={(instance) => setInstance(instance)}
//                                     />

//                                     <button
//                                         className="btn btn-primary mb-4"
//                                         onClick={handlePayment} disabled={loading || !instance || !auth?.user?.address}
//                                     >
//                                         {loading ? "Processing... " : 'Make payment'}
//                                     </button>
//                                 </>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </Layout >
//     );
// };

// export default CartPage


import Layout from '../components/Layout/Layout'
import React, { useEffect, useState } from 'react'
import { useCart } from '../context/cart'
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';
import DropIn from "braintree-web-drop-in-react"
import axios from 'axios';
import toast from 'react-hot-toast';
import './../StylePages/Cartpage.css';

/* ─────────────────────────────────────────────
   Skeleton card
───────────────────────────────────────────── */
const SkeletonCard = () => (
    <div className="tv-skel-item">
        <div className="tv-skel tv-skel-img" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <div className="tv-skel tv-skel-block" style={{ width: '40%', height: 10, marginBottom: 6 }} />
            <div className="tv-skel tv-skel-block" style={{ width: '70%' }} />
            <div className="tv-skel tv-skel-block" style={{ width: '90%' }} />
            <div className="tv-skel tv-skel-block" style={{ width: '40%', marginTop: 8 }} />
            <div className="tv-skel tv-skel-block" style={{ width: '30%' }} />
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
        const myCart = cart.map(item => {
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
        const myCart = cart.filter(item => item._id !== pid);
        setCart(myCart);
        localStorage.setItem('cart', JSON.stringify(myCart));
        toast.success('Item removed from cart');
    };

    /* ── payment token ── */
    const getToken = async () => {
        try {
            const { data } = await axios.get('/api/v1/product/braintree/token');
            setClientToken(data?.clientToken);
        } catch (e) { console.log(e); }
    };
    useEffect(() => { getToken(); }, [auth?.token]);


    /* ── handle payment ── */
    const handlePayment = async () => {
        try {
            setLoading(true);
            const { nonce } = await instance.requestPaymentMethod();

            // Send cart as-is — backend will handle it
            await axios.post('/api/v1/product/braintree/payment', {
                nonce,
                cart,  // cartQty included — backend now multiplies correctly
            });

            setLoading(false);
            localStorage.removeItem('cart');
            setCart([]);
            navigate('/dashboard/user/orders');
            toast.success('Payment Completed Successfully 🎉');
        } catch (e) {
            console.log(e);
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
                        ) : !cart?.length ? (
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
                                {cart.map((p, i) => {
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
                                                    src={`/api/v1/product/product-photo/${p._id}`}
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

                                                {/* actions — matching "Details" + "+ Cart" button style from image */}
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