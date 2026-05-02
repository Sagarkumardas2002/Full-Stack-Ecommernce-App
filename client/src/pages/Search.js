// // import React from 'react'
// // import Layout from '../components/Layout/Layout'
// // import { useSearch } from '../context/ssearch'
// // import { useNavigate } from 'react-router-dom';
// // import { useCart } from '../context/cart';
// // import toast from 'react-hot-toast';

// // const Search = () => {
// //     const [values, setValues] = useSearch();
// //     const navigate = useNavigate();
// //     const [cart, setCart] = useCart();
// //     return (
// //         <Layout title={"Search results"}>
// //             <div className="container mb-4">
// //                 <div>
// //                     <h1 className='text-center mt-3'>Search Results</h1>
// //                     <h6 className='text-center text-danger' style={{ fontSize: "20px" }}>
// //                         {values?.results.length < 1
// //                             ? "No Products Found"
// //                             : `Found ${values?.results.length}`}
// //                     </h6>
// //                     <div className="d-flex flex-wrap justify-content-center mt-4">
// //                         {values?.results.map((p) => (
// //                             <div key={p._id} className="card m-2" style={{ width: "21rem", maxWidth: "100%", backgroundColor: "orange" }}>
// //                                 <img
// //                                     src={`/api/v1/product/product-photo/${p._id}`}
// //                                     className="card-img-top"
// //                                     alt={p.name}
// //                                     style={{ width: '100%', height: "300px", objectFit: 'cover', borderTopRightRadius: "5px", borderTopLeftRadius: "5px" }}
// //                                     onMouseOver={(e) => e.target.style.transform = 'scale(0.985)'}
// //                                     onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
// //                                 />
// //                                 <hr style={{ margin: '0px', color: "2px solid gray" }} />
// //                                 <div className="card-body">
// //                                     <h5 className="card-title">{p.name}</h5>
// //                                     <p className="card-text">
// //                                         {p.description.substring(0, 30)}...
// //                                     </p>

// //                                     <h5 className="card-text" style={{ fontWeight: 'bold', color: 'black' }}>₹{p.price}</h5>


// //                                     <button className="btn btn-primary mb-2 mt-1" onClick={() => navigate(`/product/${p.slug}`)}>MORE DETAILS</button>

// //                                     <button className="btn btn-success ms-2 mb-2 mt-1" onClick={() => {
// //                                         setCart([...cart, p]);
// //                                         localStorage.setItem("cart", JSON.stringify([...cart, p]))
// //                                         toast.success('Item Added to Cart')
// //                                     }}>ADD TO CART</button>
// //                                 </div>
// //                             </div>
// //                         ))}
// //                     </div>
// //                 </div>
// //             </div>
// //         </Layout>

// //     );
// // };

// // export default Search;
// import React from 'react'
// import Layout from '../components/Layout/Layout'
// import { useSearch } from '../context/ssearch'
// import { useNavigate } from 'react-router-dom';
// import { useCart } from '../context/cart';
// import toast from 'react-hot-toast';
// import './../StylePages/Search.css';
// import { API } from '../config/api';

// const Search = () => {
//     const [values] = useSearch();     // ← removed unused setValues
//     const navigate = useNavigate();
//     const [cart, setCart] = useCart();

//     const resultCount = values?.results?.length ?? 0;

//     const handleAddToCart = (p) => {
//         const updatedCart = [...cart, { ...p, cartQty: 1 }];   // ← added cartQty
//         setCart(updatedCart);
//         localStorage.setItem('cart', JSON.stringify(updatedCart));
//         toast.success('Added to cart');
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
//                             ? `Showing all matches for your search query`
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
//                             <button
//                                 className="sr-btn sr-btn--dark"
//                                 onClick={() => navigate('/')}
//                             >
//                                 Browse All Products
//                             </button>
//                             <button
//                                 className="sr-btn sr-btn--outline"
//                                 onClick={() => navigate('/categories')}
//                             >
//                                 View Categories
//                             </button>
//                         </div>
//                     </div>
//                 )}

//                 {/* ── Product Grid ── */}
//                 {resultCount > 0 && (
//                     <div className="sr-grid">
//                         {(values?.results || []).map((p, i) => (
//                             <div
//                                 key={p._id}
//                                 className="sr-card"
//                                 style={{ animationDelay: `${i * 50}ms` }}
//                             >
//                                 {/* Image */}
//                                 <div className="sr-card__img-wrap">
//                                     <img
//                                         src={`${API}/api/v1/product/product-photo/${p._id}`}
//                                         alt={p.name}
//                                         className="sr-card__img"
//                                     />
//                                     <button
//                                         className="sr-card__quick"
//                                         onClick={() => navigate(`/product/${p.slug}`)}
//                                     >
//                                         Quick View
//                                     </button>
//                                 </div>

//                                 {/* Body */}
//                                 <div className="sr-card__body">
//                                     <p className="sr-card__category">
//                                         {p.category?.name || 'Product'}
//                                     </p>
//                                     <h5 className="sr-card__name">{p.name}</h5>
//                                     <p className="sr-card__desc">
//                                         {p.description?.substring(0, 55)}...
//                                     </p>
//                                     <div className="sr-card__footer">
//                                         <span className="sr-card__price">
//                                             ₹{p.price?.toLocaleString('en-IN')}
//                                         </span>
//                                         <div className="sr-card__actions">
//                                             <button
//                                                 className="sr-card__btn sr-card__btn--detail"
//                                                 onClick={() => navigate(`/product/${p.slug}`)}
//                                             >
//                                                 Details
//                                             </button>
//                                             <button
//                                                 className="sr-card__btn sr-card__btn--cart"
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

// export default Search;



import React from 'react'
import Layout from '../components/Layout/Layout'
import { useSearch } from '../context/ssearch'
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';
import toast from 'react-hot-toast';
import './../StylePages/Search.css';

const Search = () => {
    const [values, setValues] = useSearch();
    const navigate = useNavigate();
    const [cart, setCart] = useCart();

    const resultCount = values?.results?.length ?? 0;

    const handleAddToCart = (p) => {
        const updatedCart = [...cart, p];
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        toast.success('Added to cart');
    };

    return (
        <Layout title={"Search Results — TechVault"}>

            {/* ── Search Hero ── */}
            <section className="sr-hero">
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
                            ? `Showing all matches for your search query`
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
                        <h2 className="sr-header__title">
                            {resultCount > 0 ? 'Matching Products' : 'Try Something Else'}
                        </h2>
                        <p className="sr-header__count">
                            {resultCount} product{resultCount !== 1 ? 's' : ''} found
                        </p>
                    </div>
                    <button className="sr-back-btn" onClick={() => navigate('/')}>
                        ← Back to Shop
                    </button>
                </div>

                {/* ── Empty State ── */}
                {resultCount === 0 && (
                    <div className="sr-empty">
                        <div className="sr-empty__icon">🔍</div>
                        <h4>No products found</h4>
                        <p>
                            Try searching with different keywords,<br />
                            or browse all our products below.
                        </p>
                        <div className="sr-empty__actions">
                            <button
                                className="sr-btn sr-btn--dark"
                                onClick={() => navigate('/')}
                            >
                                Browse All Products
                            </button>
                            <button
                                className="sr-btn sr-btn--outline"
                                onClick={() => navigate('/categories')}
                            >
                                View Categories
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Product Grid ── */}
                {resultCount > 0 && (
                    <div className="sr-grid">
                        {values.results.map((p, i) => (
                            <div
                                key={p._id}
                                className="sr-card"
                                style={{ animationDelay: `${i * 50}ms` }}
                            >
                                {/* Image */}
                                <div className="sr-card__img-wrap">
                                    <img
                                        src={`/api/v1/product/product-photo/${p._id}`}
                                        alt={p.name}
                                        className="sr-card__img"
                                    />
                                    <button
                                        className="sr-card__quick"
                                        onClick={() => navigate(`/product/${p.slug}`)}
                                    >
                                        Quick View
                                    </button>
                                </div>

                                {/* Body */}
                                <div className="sr-card__body">
                                    <p className="sr-card__category">
                                        {p.category?.name || 'Product'}
                                    </p>
                                    <h5 className="sr-card__name">{p.name}</h5>
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
                                            >
                                                Details
                                            </button>
                                            <button
                                                className="sr-card__btn sr-card__btn--cart"
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
                )}
            </section>
        </Layout>
    );
};

export default Search;