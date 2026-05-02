// import Layout from '../components/Layout/Layout'
// import React, { useEffect, useState } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import axios from 'axios'
// import toast from 'react-hot-toast'
// import { useCart } from '../context/cart';

// const CategoryProduct = () => {
//     const params = useParams();
//     const navigate = useNavigate();
//     const [products, setProducts] = useState([]);
//     const [category, setCategory] = useState([]);
//     const [cart, setCart] = useCart();


//     useEffect(() => {
//         if (params?.slug) getProductsByCat();
//     }, [params?.slug])
//     const getProductsByCat = async () => {
//         try {
//             const { data } = await axios.get(`/api/v1/product/product-category/${params.slug}`);
//             setProducts(data?.products);
//             setCategory(data?.category);
//         }
//         catch (error) {
//             console.log(error)
//         }

//     }
//     return (
//         <Layout title={'Ecom App Product-category: {category}'}>
//             <div className="container  mt-3">
//                 <h4 className="text-center">Category-{category?.name}</h4>
//                 <h6 className="text-center">{products?.length} results</h6>
//                 <div className="row ">
//                     <div className="d-flex flex-wrap justify-content-center" >

//                         {products?.map((p) => (
//                             <div className="card m-3"
//                                 style={{ width: "21rem", backgroundColor: "orange" }}
//                             >

//                                 <img
//                                     src={`/api/v1/product/product-photo/${p._id}`}
//                                     className="card-img-top"
//                                     alt={p.name}
//                                     style={{ width: "100%", height: '310px', transition: "transform 0.3s", objectFit: 'cover', padding: "1px" }}
//                                     onMouseOver={(e) => e.target.style.transform = "scale(0.983)"}
//                                     onMouseOut={(e) => e.target.style.transform = "scale(1)"}
//                                 />
//                                 <hr className='mt-0' style={{ color: " black" }} />
//                                 <div className="card-body">
//                                     <h5 className="card-title">{p.name}</h5>
//                                     <p className="card-text">
//                                         {p.description.substring(0, 30)}...
//                                     </p>
//                                     <h5 className="card-text" style={{ fontWeight: 'bold', color: 'black' }}>₹{p.price}
//                                     </h5>
//                                     <button className="btn btn-primary ms-2 mt-2" onClick={() => navigate(`/product/${p.slug}`)}>MORE DETAILS</button>

//                                     <button className="btn btn-success ms-3 mt-2" onClick={() => {
//                                         setCart([...cart, p]);
//                                         localStorage.setItem("cart", JSON.stringify([...cart, p]))
//                                         toast.success('Item Added to Cart')
//                                     }}>ADD TO CART</button>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>

//                 </div>
//                 {/* </div> */}
//             </div>
//         </Layout >
//     )
// }

// export default CategoryProduct


import Layout from '../components/Layout/Layout'
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useCart } from '../context/cart';
import './../StylePages/CategoryProduct.css';

const CategoryProduct = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState({});
    const [cart, setCart] = useCart();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params?.slug) getProductsByCat();
    }, [params?.slug]);

    const getProductsByCat = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/v1/product/product-category/${params.slug}`);
            setProducts(data?.products);
            setCategory(data?.category);
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

    return (
        <Layout title={`${category?.name || 'Category'} — TechVault`}>

            {/* ── Category Hero ── */}
            <section className="cp-hero">
                <div className="cp-hero__content">
                    <span className="cp-hero__tag">Browse Category</span>
                    <h1 className="cp-hero__title">{category?.name || 'Products'}</h1>
                    <p className="cp-hero__sub">
                        {products?.length > 0
                            ? `${products.length} product${products.length !== 1 ? 's' : ''} available`
                            : 'No products found in this category'}
                    </p>
                </div>
            </section>

            {/* ── Products Section ── */}
            <section className="cp-section">

                {/* Header row */}
                <div className="cp-header">
                    <div>
                        <h2 className="cp-header__title">All in {category?.name}</h2>
                        <p className="cp-header__count">
                            Showing {products?.length} result{products?.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <button className="cp-back-btn" onClick={() => navigate('/')}>
                        ← Back to Shop
                    </button>
                </div>

                {/* Skeleton loading */}
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
                {!loading && products?.length === 0 && (
                    <div className="cp-empty">
                        <div className="cp-empty__icon">🔍</div>
                        <h4>No products found</h4>
                        <p>There are no products in the <strong>{category?.name}</strong> category yet.</p>
                        <button className="cp-btn cp-btn--dark" onClick={() => navigate('/')}>
                            Browse All Products
                        </button>
                    </div>
                )}

                {/* Product grid */}
                {!loading && products?.length > 0 && (
                    <div className="cp-grid">
                        {products.map((p, i) => (
                            <div
                                key={p._id}
                                className="cp-card"
                                style={{ animationDelay: `${i * 50}ms` }}
                            >
                                {/* Image */}
                                <div className="cp-card__img-wrap">
                                    <img
                                        src={`/api/v1/product/product-photo/${p._id}`}
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

                                {/* Body */}
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
                )}
            </section>

        </Layout>
    );
};

export default CategoryProduct;