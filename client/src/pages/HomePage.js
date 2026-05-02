// import React, { useState, useEffect } from 'react'
// import Layout from '../components/Layout/Layout'
// import axios from 'axios';
// import { Checkbox, Radio } from 'antd';
// import { Prices } from '../components/Prices';
// import { useNavigate } from 'react-router-dom';
// import { useCart } from '../context/cart';
// import toast from 'react-hot-toast';


// const HomePage = () => {
//     const navigate = useNavigate();
//     const [cart, setCart] = useCart();
//     const [products, setProducts] = useState([]);
//     const [categories, setCategories] = useState([]);
//     const [checked, setChecked] = useState([]);
//     const [radio, setRadio] = useState([]);
//     const [total, setTotal] = useState(0);
//     const [page, setPage] = useState(1);
//     const [loading, setLoading] = useState(false);

//     //get all categories
//     const getAllCategory = async () => {
//         try {
//             const { data } = await axios.get("/api/v1/category/get-category");
//             if (data?.success) {
//                 setCategories(data?.category);
//             }
//         }
//         catch (error) {
//             console.log(error)
//         }
//     }


//     useEffect(() => {
//         getAllCategory();
//         getTotal();
//     }, [])



//     //get all products
//     const getAllProducts = async () => {
//         try {
//             setLoading(true)
//             const { data } = await axios.get(`/api/v1/product/product-list/${page}`)
//             setLoading(false)
//             setProducts(data.products)
//         }
//         catch (error) {
//             setLoading(false)
//             console.log(error)
//         }
//     };



//     //getTotal Count
//     const getTotal = async () => {
//         try {
//             const { data } = await axios.get('/api/v1/product/product-count')
//             setTotal(data?.total)
//         }
//         catch (error) {
//             console.log(error)
//         }
//     }



//     useEffect(() => {
//         if (page === 1) return;
//         LoadMore();
//     }, [page]);

//     //load more
//     const LoadMore = async () => {
//         try {
//             setLoading(true)
//             const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
//             setLoading(false)
//             setProducts([...products, ...data?.products]);

//         }
//         catch (error) {
//             console.log(error)
//             setLoading(false)
//         }
//     }


//     //filter by category
//     const handleFilter = (value, id) => {
//         let all = [...checked];
//         if (value) {
//             all.push(id);
//         }
//         else {
//             all = all.filter((c) => c !== id);
//         }
//         setChecked(all);
//     }

//     useEffect(() => {
//         if (!checked.length || !radio.length) getAllProducts();
//     }, [checked.length, radio.length])

//     useEffect(() => {
//         if (checked.length || radio.length) filterProduct();
//     }, [checked, radio]);

//     //get filtered products
//     const filterProduct = async () => {
//         try {
//             const { data } = await axios.post('/api/v1/product/product-filters', { checked, radio })
//             setProducts(data?.products)
//         }
//         catch (error) {
//             console.log(error)
//         }
//     }

//     return (
//         <Layout title={"Sagar's Ecom App-Shop Now....."}>
//             <div className="container-fluid row  mx-auto" >
//                 <div className="col-md-2 col-sm-12">
//                     <h4 className="text-center mt-4" style={{ color: "maroon" }}>Filter By Category</h4>
//                     <hr />
//                     <div className="d-flex flex-column ">
//                         {categories?.map((c) => (
//                             <Checkbox key={c._id} onChange={(e) => handleFilter(e.target.checked, c._id)} style={{ fontWeight: 'bold' }}>{c.name}</Checkbox>
//                         ))}
//                     </div>


//                     {/* Filter by price  */}
//                     <h4 className="text-center mt-4" style={{ color: "maroon", marginLeft: "-43px" }}>Filter By Price</h4>
//                     <hr />
//                     <div className="d-flex flex-column">
//                         <Radio.Group onChange={e => setRadio(e.target.value)}>
//                             {Prices?.map(p => (
//                                 <div key={p._id}><Radio value={p.array} style={{ fontWeight: 'bold' }}>
//                                     {p.name}</Radio></div>
//                             ))}
//                         </Radio.Group>
//                     </div>
//                     <div className="d-flex mt-3 col-sm-12">
//                         <div className="btn btn-danger" onClick={() => window.location.reload()}>RESET FILTERS</div>
//                     </div>
//                 </div>
//                 <div className="col-md-9 col-sm-12 " >
//                     <h1 className="text-center mt-4" >All Products</h1>
//                     <div className="d-flex flex-wrap justify-content-center "  >
//                         {products?.map((p) => (
//                             <div key={p._id} className="card m-3 " style={{ width: "20rem" }}
//                             >
//                                 <img
//                                     src={`/api/v1/product/product-photo/${p._id}`}
//                                     className="card-img-top"
//                                     alt={p.name}
//                                     style={{ width: '100%', height: '300px', objectFit: 'cover', padding: '1px', borderRadius: "4px" }}
//                                     onMouseOver={(e) => e.target.style.transform = 'scale(0.985)'}
//                                     onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
//                                 />
//                                 <hr style={{ margin: '0px', color: "gray" }} />
//                                 <div className="card-body " style={{ backgroundColor: 'orange', borderRadius: "0 0 3px 3px" }}>
//                                     <h5 className="card-title">{p.name}</h5>
//                                     <p className="card-text">
//                                         {p.description.substring(0, 50)}...
//                                     </p>
//                                     <h5 className="card-text" style={{ fontWeight: 'bold', color: 'black' }}>₹{p.price}</h5>

//                                     <div className='d-flex justify-content-between'>
//                                         <button className="  btn btn-primary ms-1 mb-2" onClick={() => navigate(`/product/${p.slug}`)}>MORE DETAILS</button>

//                                         <button className="btn btn-success ms-3 mb-2" onClick={() => {
//                                             setCart([...cart, p]);
//                                             localStorage.setItem("cart", JSON.stringify([...cart, p]))
//                                             toast.success('Item Added to Cart')
//                                         }}>ADD TO CART</button>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                     <div >
//                         {products && products.length < total && (
//                             <div className="card m-2" style={{ width: "14rem", backgroundColor: 'transparent', border: 'none' }}>
//                                 <button className='deshome  btn btn-dark  mb-5 mt-3 mx-auto' style={{}} onClick={(e) => {
//                                     e.preventDefault();
//                                     setPage(page + 1);
//                                 }}>
//                                     {loading ? "Loading..." : "Load More"}
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </Layout >
//     )
// }

// export default HomePage


// import React, { useState, useEffect, useCallback } from 'react'
// import Layout from '../components/Layout/Layout'
// import axios from 'axios';
// import { Checkbox, Radio } from 'antd';
// import { Prices } from '../components/Prices';
// import { useNavigate } from 'react-router-dom';
// import { useCart } from '../context/cart';
// import toast from 'react-hot-toast';


// const HomePage = () => {
//     const navigate = useNavigate();
//     const [cart, setCart] = useCart();
//     const [products, setProducts] = useState([]);
//     const [categories, setCategories] = useState([]);
//     const [checked, setChecked] = useState([]);
//     const [radio, setRadio] = useState(null);
//     const [total, setTotal] = useState(0);
//     const [page, setPage] = useState(1);
//     const [loading, setLoading] = useState(false);

//     // Filter pagination state
//     const [filterPage, setFilterPage] = useState(1);
//     const [filterTotal, setFilterTotal] = useState(0);


//     // ─── Get All Categories ───────────────────────────────────────────────────
//     const getAllCategory = async () => {
//         try {
//             const { data } = await axios.get("/api/v1/category/get-category");
//             if (data?.success) {
//                 setCategories(data?.category);
//             }
//         } catch (error) {
//             console.log(error);
//             toast.error("Failed to load categories");
//         }
//     };


//     // ─── Get Total Product Count ──────────────────────────────────────────────
//     const getTotal = async () => {
//         try {
//             const { data } = await axios.get('/api/v1/product/product-count');
//             setTotal(data?.total);
//         } catch (error) {
//             console.log(error);
//             toast.error("Failed to get product count");
//         }
//     };


//     // ─── Get All Products (No Filters) ───────────────────────────────────────
//     const getAllProducts = useCallback(async () => {
//         try {
//             setLoading(true);
//             const { data } = await axios.get(`/api/v1/product/product-list/1`);
//             setProducts(data?.products);
//         } catch (error) {
//             console.log(error);
//             toast.error("Failed to load products");
//         } finally {
//             setLoading(false);
//         }
//     }, []);


//     // ─── Load More (No Filters) ───────────────────────────────────────────────
//     const loadMore = useCallback(async () => {
//         try {
//             setLoading(true);
//             const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
//             setProducts(prev => [...prev, ...data?.products]);
//         } catch (error) {
//             console.log(error);
//             toast.error("Failed to load more products");
//         } finally {
//             setLoading(false);
//         }
//     }, [page]);


//     // ─── Filter Products (With Pagination Support) ────────────────────────────
//     // resetPage = true  → new filter applied, reset to page 1, replace products
//     // resetPage = false → Load More clicked, append next page of filtered results
//     const filterProduct = useCallback(async (resetPage = true) => {
//         try {
//             setLoading(true);
//             const currentPage = resetPage ? 1 : filterPage;

//             const { data } = await axios.post('/api/v1/product/product-filters', {
//                 checked,
//                 radio: radio ?? [],
//                 page: currentPage,
//             });

//             if (resetPage) {
//                 // New filter — replace products list
//                 setProducts(data?.products);
//                 setFilterPage(1);
//             } else {
//                 // Load More — append to existing list
//                 setProducts(prev => [...prev, ...data?.products]);
//             }

//             // Store total filtered count for Load More visibility
//             setFilterTotal(data?.total);

//         } catch (error) {
//             console.log(error);
//             toast.error("Failed to filter products");
//         } finally {
//             setLoading(false);
//         }
//     }, [checked, radio, filterPage]);


//     // ─── Handle Category Filter ───────────────────────────────────────────────
//     const handleFilter = (value, id) => {
//         let all = [...checked];
//         if (value) {
//             all.push(id);
//         } else {
//             all = all.filter((c) => c !== id);
//         }
//         setChecked(all);
//     };


//     // ─── Handle Reset ─────────────────────────────────────────────────────────
//     const handleReset = () => {
//         setChecked([]);
//         setRadio(null);
//         setPage(1);
//         setFilterPage(1);
//         setFilterTotal(0);
//     };


//     // ─── Handle Add to Cart ───────────────────────────────────────────────────
//     const handleAddToCart = (p) => {
//         const updatedCart = [...cart, p];
//         setCart(updatedCart);
//         localStorage.setItem("cart", JSON.stringify(updatedCart));
//         toast.success('Item added to cart');
//     };


//     // ─── On Mount ─────────────────────────────────────────────────────────────
//     useEffect(() => {
//         getAllCategory();
//         getTotal();
//         getAllProducts();
//     }, []);


//     // ─── Load More — No Filters ───────────────────────────────────────────────
//     useEffect(() => {
//         if (page === 1) return;
//         loadMore();
//     }, [page]);


//     // ─── Load More — With Filters (filterPage increments) ────────────────────
//     useEffect(() => {
//         if (filterPage === 1) return;
//         if (checked.length || radio) {
//             filterProduct(false); // append mode
//         }
//     }, [filterPage]);


//     // ─── Reset & Fetch All When Filters Cleared ───────────────────────────────
//     useEffect(() => {
//         if (!checked.length && !radio) {
//             setPage(1);
//             getAllProducts();
//         }
//     }, [checked.length, radio]);


//     // ─── Fetch Filtered When Filters Applied ──────────────────────────────────
//     useEffect(() => {
//         if (checked.length || radio) {
//             filterProduct(true); // reset mode
//         }
//     }, [checked, radio]);


//     // ─── Is Filter Active ─────────────────────────────────────────────────────
//     const isFilterActive = checked.length > 0 || radio !== null;


//     return (
//         <Layout title={"Sagar's Ecom App-Shop Now....."}>
//             <div className="container-fluid row mx-auto">

//                 {/* ── Sidebar Filters ── */}
//                 <div className="col-md-2 col-sm-12">

//                     <h4 className="text-center mt-4" style={{ color: "maroon" }}>
//                         Filter By Category
//                     </h4>
//                     <hr />

//                     <div className="d-flex flex-column">
//                         {categories?.map((c) => (
//                             <Checkbox
//                                 key={c._id}
//                                 checked={checked.includes(c._id)}
//                                 onChange={(e) => handleFilter(e.target.checked, c._id)}
//                                 style={{ fontWeight: 'bold' }}
//                             >
//                                 {c.name}
//                             </Checkbox>
//                         ))}
//                     </div>

//                     <h4 className="text-center mt-4" style={{ color: "maroon" }}>
//                         Filter By Price
//                     </h4>
//                     <hr />

//                     <div className="d-flex flex-column">
//                         <Radio.Group
//                             onChange={(e) => setRadio(e.target.value)}
//                             value={radio}
//                         >
//                             {Prices?.map((p) => (
//                                 <div key={p._id}>
//                                     <Radio value={p.array} style={{ fontWeight: 'bold' }}>
//                                         {p.name}
//                                     </Radio>
//                                 </div>
//                             ))}
//                         </Radio.Group>
//                     </div>

//                     <div className="d-flex mt-3">
//                         <button
//                             className="btn btn-danger w-100"
//                             onClick={handleReset}
//                         >
//                             Reset Filters
//                         </button>
//                     </div>
//                 </div>

//                 {/* ── Products Grid ── */}
//                 <div className="col-md-9 col-sm-12">
//                     <h1 className="text-center mt-4">All Products</h1>

//                     {/* No results message when filter returns nothing */}
//                     {!loading && products.length === 0 && (
//                         <div className="text-center mt-5">
//                             <h5 className="text-muted">No products found for selected filters.</h5>
//                             <button
//                                 className="btn btn-outline-danger mt-3"
//                                 onClick={handleReset}
//                             >
//                                 Clear Filters
//                             </button>
//                         </div>
//                     )}

//                     <div className="d-flex flex-wrap justify-content-center">
//                         {products?.map((p) => (
//                             <div
//                                 key={p._id}
//                                 className="card m-3"
//                                 style={{ width: "20rem" }}
//                             >
//                                 <img
//                                     src={`/api/v1/product/product-photo/${p._id}`}
//                                     className="card-img-top"
//                                     alt={p.name}
//                                     style={{
//                                         width: '100%',
//                                         height: '300px',
//                                         objectFit: 'cover',
//                                         padding: '1px',
//                                         borderRadius: "4px",
//                                         transition: 'transform 0.2s ease',
//                                     }}
//                                     onMouseOver={(e) => e.target.style.transform = 'scale(0.985)'}
//                                     onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
//                                 />
//                                 <hr style={{ margin: '0px', color: "gray" }} />

//                                 <div
//                                     className="card-body"
//                                     style={{ backgroundColor: 'orange', borderRadius: "0 0 3px 3px" }}
//                                 >
//                                     <h5 className="card-title">{p.name}</h5>
//                                     <p className="card-text">
//                                         {p.description?.substring(0, 50)}...
//                                     </p>
//                                     <h5 className="card-text" style={{ fontWeight: 'bold', color: 'black' }}>
//                                         ₹{p.price}
//                                     </h5>
//                                     <div className="d-flex justify-content-between">
//                                         <button
//                                             className="btn btn-primary ms-1 mb-2"
//                                             onClick={() => navigate(`/product/${p.slug}`)}
//                                         >
//                                             More Details
//                                         </button>
//                                         <button
//                                             className="btn btn-success ms-3 mb-2"
//                                             onClick={() => handleAddToCart(p)}
//                                         >
//                                             Add to Cart
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>

//                     {/* ── Load More Button ── */}
//                     {products.length > 0 &&
//                         products.length < (isFilterActive ? filterTotal : total) && (
//                             <div className="d-flex justify-content-center mb-5 mt-3">
//                                 <button
//                                     className="btn btn-dark"
//                                     disabled={loading}
//                                     onClick={(e) => {
//                                         e.preventDefault();
//                                         if (isFilterActive) {
//                                             // Increment filter page — triggers filterProduct(false)
//                                             setFilterPage(prev => prev + 1);
//                                         } else {
//                                             // Increment normal page — triggers loadMore()
//                                             setPage(prev => prev + 1);
//                                         }
//                                     }}
//                                 >
//                                     {loading ? "Loading..." : "Load More"}
//                                 </button>
//                             </div>
//                         )}

//                 </div>
//             </div>
//         </Layout>
//     );
// };

// export default HomePage;


// import React, { useState, useEffect, useCallback } from 'react'
// import Layout from '../components/Layout/Layout'
// import axios from 'axios';
// import { Checkbox, Radio } from 'antd';
// import { Prices } from '../components/Prices';
// import { useNavigate } from 'react-router-dom';
// import { useCart } from '../context/cart';
// import toast from 'react-hot-toast';
// import './../StylePages/HomePage.css'

// const HomePage = () => {
//     const navigate = useNavigate();
//     const [cart, setCart] = useCart();
//     const [products, setProducts] = useState([]);
//     const [categories, setCategories] = useState([]);
//     const [checked, setChecked] = useState([]);
//     const [radio, setRadio] = useState(null);
//     const [total, setTotal] = useState(0);
//     const [page, setPage] = useState(1);
//     const [loading, setLoading] = useState(false);
//     const [filterPage, setFilterPage] = useState(1);
//     const [filterTotal, setFilterTotal] = useState(0);

//     const isFilterActive = checked.length > 0 || radio !== null;

//     const getAllCategory = async () => {
//         try {
//             const { data } = await axios.get("/api/v1/category/get-category");
//             if (data?.success) setCategories(data?.category);
//         } catch (error) {
//             console.log(error);
//             toast.error("Failed to load categories");
//         }
//     };

//     const getTotal = async () => {
//         try {
//             const { data } = await axios.get('/api/v1/product/product-count');
//             setTotal(data?.total);
//         } catch (error) {
//             console.log(error);
//             toast.error("Failed to get product count");
//         }
//     };

//     const getAllProducts = useCallback(async () => {
//         try {
//             setLoading(true);
//             const { data } = await axios.get(`/api/v1/product/product-list/1`);
//             setProducts(data?.products);
//         } catch (error) {
//             console.log(error);
//             toast.error("Failed to load products");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const loadMore = useCallback(async () => {
//         try {
//             setLoading(true);
//             const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
//             setProducts(prev => [...prev, ...data?.products]);
//         } catch (error) {
//             console.log(error);
//             toast.error("Failed to load more products");
//         } finally {
//             setLoading(false);
//         }
//     }, [page]);

//     const filterProduct = useCallback(async (resetPage = true) => {
//         try {
//             setLoading(true);
//             const currentPage = resetPage ? 1 : filterPage;
//             const { data } = await axios.post('/api/v1/product/product-filters', {
//                 checked,
//                 radio: radio ?? [],
//                 page: currentPage,
//             });
//             if (resetPage) {
//                 setProducts(data?.products);
//                 setFilterPage(1);
//             } else {
//                 setProducts(prev => [...prev, ...data?.products]);
//             }
//             setFilterTotal(data?.total);
//         } catch (error) {
//             console.log(error);
//             toast.error("Failed to filter products");
//         } finally {
//             setLoading(false);
//         }
//     }, [checked, radio, filterPage]);

//     const handleFilter = (value, id) => {
//         let all = [...checked];
//         if (value) { all.push(id); } else { all = all.filter((c) => c !== id); }
//         setChecked(all);
//     };

//     const handleReset = () => {
//         setChecked([]);
//         setRadio(null);
//         setPage(1);
//         setFilterPage(1);
//         setFilterTotal(0);
//     };

//     const handleAddToCart = (p) => {
//         const updatedCart = [...cart, p];
//         setCart(updatedCart);
//         localStorage.setItem("cart", JSON.stringify(updatedCart));
//         toast.success('Added to cart');
//     };

//     useEffect(() => { getAllCategory(); getTotal(); getAllProducts(); }, []);
//     useEffect(() => { if (page === 1) return; loadMore(); }, [page]);
//     useEffect(() => { if (filterPage === 1) return; if (isFilterActive) filterProduct(false); }, [filterPage]);
//     useEffect(() => { if (!checked.length && !radio) { setPage(1); getAllProducts(); } }, [checked.length, radio]);
//     useEffect(() => { if (checked.length || radio) filterProduct(true); }, [checked, radio]);

//     return (
//         <Layout title={"TechVault — Shop Premium Tech"}>

//             {/* ── Hero Banner ── */}
//             <section className="hp-hero">
//                 <div className="hp-hero__content">
//                     <span className="hp-hero__tag">New Arrivals 2025</span>
//                     <h1 className="hp-hero__title">
//                         Premium Tech,<br />
//                         <em>Unbeatable</em> Prices.
//                     </h1>
//                     <p className="hp-hero__sub">
//                         Curated laptops, gadgets & accessories — handpicked for performance.
//                     </p>
//                     <div className="hp-hero__actions">
//                         <button className="hp-btn hp-btn--gold" onClick={() => document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' })}>
//                             Shop Now
//                         </button>
//                         <button className="hp-btn hp-btn--ghost" onClick={() => navigate('/categories')}>
//                             Browse Categories
//                         </button>
//                     </div>
//                 </div>
//                 <div className="hp-hero__stats">
//                     <div className="hp-stat">
//                         <span className="hp-stat__num">500+</span>
//                         <span className="hp-stat__lbl">Products</span>
//                     </div>
//                     <div className="hp-stat__divider" />
//                     <div className="hp-stat">
//                         <span className="hp-stat__num">4.8★</span>
//                         <span className="hp-stat__lbl">Avg Rating</span>
//                     </div>
//                     <div className="hp-stat__divider" />
//                     <div className="hp-stat">
//                         <span className="hp-stat__num">24hr</span>
//                         <span className="hp-stat__lbl">Delivery</span>
//                     </div>
//                 </div>
//             </section>

//             {/* ── Main Shop Area ── */}
//             <section className="hp-shop" id="products-section">

//                 {/* ── Sidebar ── */}
//                 <aside className="hp-sidebar">
//                     <div className="hp-sidebar__section">
//                         <h6 className="hp-sidebar__title">Filter by Category</h6>
//                         <div className="hp-sidebar__items">
//                             {categories?.map((c) => (
//                                 <label key={c._id} className={`hp-check-item${checked.includes(c._id) ? ' hp-check-item--active' : ''}`}>
//                                     <Checkbox
//                                         checked={checked.includes(c._id)}
//                                         onChange={(e) => handleFilter(e.target.checked, c._id)}
//                                     />
//                                     <span>{c.name}</span>
//                                 </label>
//                             ))}
//                         </div>
//                     </div>

//                     <div className="hp-sidebar__section">
//                         <h6 className="hp-sidebar__title">Filter by Price</h6>
//                         <div className="hp-sidebar__items">
//                             <Radio.Group onChange={(e) => setRadio(e.target.value)} value={radio}>
//                                 {Prices?.map((p) => (
//                                     <label key={p._id} className={`hp-check-item${radio === p.array ? ' hp-check-item--active' : ''}`}>
//                                         <Radio value={p.array} />
//                                         <span>{p.name}</span>
//                                     </label>
//                                 ))}
//                             </Radio.Group>
//                         </div>
//                     </div>

//                     {isFilterActive && (
//                         <button className="hp-reset-btn" onClick={handleReset}>
//                             ✕ Reset Filters
//                         </button>
//                     )}
//                 </aside>

//                 {/* ── Products Area ── */}
//                 <div className="hp-products">

//                     {/* Header row */}
//                     <div className="hp-products__header">
//                         <div>
//                             <h2 className="hp-products__title">
//                                 {isFilterActive ? 'Filtered Results' : 'All Products'}
//                             </h2>
//                             <p className="hp-products__count">
//                                 Showing {products.length} of {isFilterActive ? filterTotal : total}
//                             </p>
//                         </div>
//                         {isFilterActive && (
//                             <button className="hp-clear-btn" onClick={handleReset}>
//                                 Clear Filters
//                             </button>
//                         )}
//                     </div>

//                     {/* Empty state */}
//                     {!loading && products.length === 0 && (
//                         <div className="hp-empty">
//                             <div className="hp-empty__icon">🔍</div>
//                             <h4>No products found</h4>
//                             <p>Try adjusting or clearing your filters</p>
//                             <button className="hp-btn hp-btn--gold" onClick={handleReset}>
//                                 Clear Filters
//                             </button>
//                         </div>
//                     )}

//                     {/* Grid */}
//                     <div className="hp-grid">
//                         {products?.map((p) => (
//                             <div key={p._id} className="hp-card">
//                                 <div className="hp-card__img-wrap">
//                                     <img
//                                         src={`/api/v1/product/product-photo/${p._id}`}
//                                         alt={p.name}
//                                         className="hp-card__img"
//                                     />
//                                     <button
//                                         className="hp-card__quick"
//                                         onClick={() => navigate(`/product/${p.slug}`)}
//                                     >
//                                         Quick View
//                                     </button>
//                                 </div>
//                                 <div className="hp-card__body">
//                                     <p className="hp-card__category">{p.category?.name || 'Product'}</p>
//                                     <h5 className="hp-card__name">{p.name}</h5>
//                                     <p className="hp-card__desc">{p.description?.substring(0, 55)}...</p>
//                                     <div className="hp-card__footer">
//                                         <span className="hp-card__price">₹{p.price?.toLocaleString('en-IN')}</span>
//                                         <div className="hp-card__actions">
//                                             <button
//                                                 className="hp-card__btn hp-card__btn--detail"
//                                                 onClick={() => navigate(`/product/${p.slug}`)}
//                                             >
//                                                 Details
//                                             </button>
//                                             <button
//                                                 className="hp-card__btn hp-card__btn--cart"
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

//                     {/* Load More */}
//                     {products.length > 0 && products.length < (isFilterActive ? filterTotal : total) && (
//                         <div className="hp-loadmore">
//                             <button
//                                 className="hp-btn hp-btn--outline-gold"
//                                 disabled={loading}
//                                 onClick={() => {
//                                     if (isFilterActive) setFilterPage(prev => prev + 1);
//                                     else setPage(prev => prev + 1);
//                                 }}
//                             >
//                                 {loading
//                                     ? <span className="hp-spinner" />
//                                     : `Load More  (${products.length} / ${isFilterActive ? filterTotal : total})`
//                                 }
//                             </button>
//                         </div>
//                     )}
//                 </div>
//             </section>
//         </Layout>
//     );
// };

// export default HomePage;



import React, { useState, useEffect, useCallback } from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios';
import { Checkbox, Radio } from 'antd';
import { Prices } from '../components/Prices';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';
import toast from 'react-hot-toast';
import './../StylePages/HomePage.css'

const PER_PAGE = 8;

// ── Skeleton Card ──────────────────────────────────────────────────
const SkeletonCard = () => (
    <div className="hp-card hp-card--skeleton">
        <div className="hp-card__img-wrap">
            <div className="skel skel--img" />
        </div>
        <div className="hp-card__body">
            <div className="skel skel--category" />
            <div className="skel skel--title" />
            <div className="skel skel--desc" />
            <div className="skel skel--desc skel--desc-short" />
            <div className="hp-card__footer">
                <div className="skel skel--price" />
                <div className="hp-card__actions">
                    <div className="skel skel--btn" />
                    <div className="skel skel--btn" />
                </div>
            </div>
        </div>
    </div>
);

const SkeletonGrid = () => (
    <div className="hp-grid">
        {Array.from({ length: PER_PAGE }).map((_, i) => (
            <SkeletonCard key={i} />
        ))}
    </div>
);

// ── Skeleton Sidebar ───────────────────────────────────────────────
const SkeletonSidebar = () => (
    <>
        <div className="hp-sidebar__section">
            <div className="skel skel--sidebar-title" />
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skel skel--sidebar-item" />
            ))}
        </div>
        <div className="hp-sidebar__section">
            <div className="skel skel--sidebar-title" />
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skel skel--sidebar-item" />
            ))}
        </div>
    </>
);


const HomePage = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useCart();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [checked, setChecked] = useState([]);
    const [radio, setRadio] = useState(null);
    const [total, setTotal] = useState(0);
    const [filterTotal, setFilterTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const isFilterActive = checked.length > 0 || radio !== null;
    const activeTotal = isFilterActive ? filterTotal : total;
    const totalPages = Math.ceil(activeTotal / PER_PAGE);

    const getAllCategory = async () => {
        try {
            const { data } = await axios.get("/api/v1/category/get-category");
            if (data?.success) setCategories(data?.category);
        } catch (error) {
            console.log(error);
            toast.error("Failed to load categories");
        }
    };

    const getTotal = async () => {
        try {
            const { data } = await axios.get('/api/v1/product/product-count');
            setTotal(data?.total);
        } catch (error) {
            console.log(error);
            toast.error("Failed to get product count");
        }
    };

    const getAllProducts = useCallback(async (pg = 1) => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/v1/product/product-list/${pg}`);
            setProducts(data?.products);
        } catch (error) {
            console.log(error);
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
            setInitialLoading(false);
        }
    }, []);

    const filterProduct = useCallback(async (pg = 1) => {
        try {
            setLoading(true);
            const { data } = await axios.post('/api/v1/product/product-filters', {
                checked,
                radio: radio ?? [],
                page: pg,
            });
            setProducts(data?.products);
            setFilterTotal(data?.total);
        } catch (error) {
            console.log(error);
            toast.error("Failed to filter products");
        } finally {
            setLoading(false);
        }
    }, [checked, radio]);

    const handleFilter = (value, id) => {
        let all = [...checked];
        if (value) { all.push(id); } else { all = all.filter((c) => c !== id); }
        setChecked(all);
    };

    const handleReset = () => {
        setChecked([]);
        setRadio(null);
        setFilterTotal(0);
        setPage(1);
    };

    const handleAddToCart = (p) => {
        const updatedCart = [...cart, p];
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        toast.success('Added to cart');
    };

    const handlePageChange = (pg) => {
        setPage(pg);
        document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        getAllCategory();
        getTotal();
        getAllProducts(1);
    }, []);

    useEffect(() => {
        if (!checked.length && !radio) { setPage(1); getAllProducts(1); }
    }, [checked.length, radio]);

    useEffect(() => {
        if (checked.length || radio) { setPage(1); filterProduct(1); }
    }, [checked, radio]);

    useEffect(() => {
        if (isFilterActive) { filterProduct(page); }
        else { getAllProducts(page); }
    }, [page]);

    // ── Pagination ─────────────────────────────────────────────────
    const renderPagination = () => {
        if (totalPages <= 1) return null;
        const pages = [];

        if (page > 3) {
            pages.push(<button key={1} className={`hp-page-btn${page === 1 ? ' hp-page-btn--active' : ''}`} onClick={() => handlePageChange(1)}>1</button>);
            if (page > 4) pages.push(<span key="start-ellipsis" className="hp-page-ellipsis">…</span>);
        }

        const start = Math.max(1, page - 2);
        const end = Math.min(totalPages, page + 2);
        for (let i = start; i <= end; i++) {
            pages.push(
                <button key={i} className={`hp-page-btn${page === i ? ' hp-page-btn--active' : ''}`} onClick={() => handlePageChange(i)}>
                    {i}
                </button>
            );
        }

        if (page < totalPages - 2) {
            if (page < totalPages - 3) pages.push(<span key="end-ellipsis" className="hp-page-ellipsis">…</span>);
            pages.push(<button key={totalPages} className={`hp-page-btn${page === totalPages ? ' hp-page-btn--active' : ''}`} onClick={() => handlePageChange(totalPages)}>{totalPages}</button>);
        }

        return (
            <div className="hp-pagination">
                <button className="hp-page-btn hp-page-btn--nav" disabled={page === 1} onClick={() => handlePageChange(page - 1)}>‹ Prev</button>
                <div className="hp-page-numbers">{pages}</div>
                <button className="hp-page-btn hp-page-btn--nav" disabled={page === totalPages} onClick={() => handlePageChange(page + 1)}>Next ›</button>
            </div>
        );
    };

    return (
        <Layout title={"TechVault — Shop Premium Tech"}>

            {/* ── Hero Banner ── */}
            <section className="hp-hero">
                <div className="hp-hero__content">
                    <span className="hp-hero__tag">New Arrivals 2025</span>
                    <h1 className="hp-hero__title">
                        Premium Tech,<br />
                        <em>Unbeatable</em> Prices.
                    </h1>
                    <p className="hp-hero__sub">
                        Curated laptops, gadgets & accessories — handpicked for performance.
                    </p>
                    <div className="hp-hero__actions">
                        <button className="hp-btn hp-btn--gold" onClick={() => document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' })}>
                            Shop Now
                        </button>
                        <button className="hp-btn hp-btn--ghost" onClick={() => navigate('/categories')}>
                            Browse Categories
                        </button>
                    </div>
                </div>
                <div className="hp-hero__stats">
                    <div className="hp-stat"><span className="hp-stat__num">500+</span><span className="hp-stat__lbl">Products</span></div>
                    <div className="hp-stat__divider" />
                    <div className="hp-stat"><span className="hp-stat__num">4.8★</span><span className="hp-stat__lbl">Avg Rating</span></div>
                    <div className="hp-stat__divider" />
                    <div className="hp-stat"><span className="hp-stat__num">24hr</span><span className="hp-stat__lbl">Delivery</span></div>
                </div>
            </section>

            {/* ── Main Shop Area ── */}
            <section className="hp-shop" id="products-section">

                {/* ── Sidebar ── */}
                <aside className="hp-sidebar">
                    {initialLoading ? <SkeletonSidebar /> : (
                        <>
                            <div className="hp-sidebar__section">
                                <h6 className="hp-sidebar__title">Filter by Category</h6>
                                <div className="hp-sidebar__items">
                                    {categories?.map((c) => (
                                        <label key={c._id} className={`hp-check-item${checked.includes(c._id) ? ' hp-check-item--active' : ''}`}>
                                            <Checkbox checked={checked.includes(c._id)} onChange={(e) => handleFilter(e.target.checked, c._id)} />
                                            <span>{c.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="hp-sidebar__section">
                                <h6 className="hp-sidebar__title">Filter by Price</h6>
                                <div className="hp-sidebar__items">
                                    <Radio.Group onChange={(e) => setRadio(e.target.value)} value={radio}>
                                        {Prices?.map((p) => (
                                            <label key={p._id} className={`hp-check-item${radio === p.array ? ' hp-check-item--active' : ''}`}>
                                                <Radio value={p.array} />
                                                <span>{p.name}</span>
                                            </label>
                                        ))}
                                    </Radio.Group>
                                </div>
                            </div>

                            {isFilterActive && (
                                <button className="hp-reset-btn" onClick={handleReset}>✕ Reset Filters</button>
                            )}
                        </>
                    )}
                </aside>

                {/* ── Products Area ── */}
                <div className="hp-products">

                    {/* Header row */}
                    <div className="hp-products__header">
                        <div>
                            <h2 className="hp-products__title">
                                {isFilterActive ? 'Filtered Results' : 'All Products'}
                            </h2>
                            {!loading && (
                                <p className="hp-products__count">
                                    Page {page} of {totalPages || 1} · {activeTotal} products
                                </p>
                            )}
                            {loading && <div className="skel skel--count" />}
                        </div>
                        {isFilterActive && !loading && (
                            <button className="hp-clear-btn" onClick={handleReset}>Clear Filters</button>
                        )}
                    </div>

                    {/* Skeleton or Grid */}
                    {loading ? (
                        <SkeletonGrid />
                    ) : products.length === 0 ? (
                        <div className="hp-empty">
                            <div className="hp-empty__icon">🔍</div>
                            <h4>No products found</h4>
                            <p>Try adjusting or clearing your filters</p>
                            <button className="hp-btn hp-btn--gold" onClick={handleReset}>Clear Filters</button>
                        </div>
                    ) : (
                        <div className="hp-grid">
                            {products?.map((p) => (
                                <div key={p._id} className="hp-card">
                                    <div className="hp-card__img-wrap">
                                        <img src={`/api/v1/product/product-photo/${p._id}`} alt={p.name} className="hp-card__img" />
                                        <button className="hp-card__quick" onClick={() => navigate(`/product/${p.slug}`)}>Quick View</button>
                                    </div>
                                    <div className="hp-card__body">
                                        <p className="hp-card__category">{p.category?.name || 'Product'}</p>
                                        <h5 className="hp-card__name">{p.name}</h5>
                                        <p className="hp-card__desc">{p.description?.substring(0, 55)}...</p>
                                        <div className="hp-card__footer">
                                            <span className="hp-card__price">₹{p.price?.toLocaleString('en-IN')}</span>
                                            <div className="hp-card__actions">
                                                <button className="hp-card__btn hp-card__btn--detail" onClick={() => navigate(`/product/${p.slug}`)}>Details</button>
                                                <button className="hp-card__btn hp-card__btn--cart" onClick={() => handleAddToCart(p)}>+ Cart</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination — hide while loading */}
                    {!loading && renderPagination()}
                </div>
            </section>
        </Layout>
    );
};

export default HomePage;