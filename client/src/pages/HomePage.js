import React, { useState, useEffect, useCallback } from 'react'
import Layout from '../components/Layout/Layout'
import axios from '../config/axios';          // ← use shared axios instance
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
    const [products, setProducts] = useState([]);       // ← safe empty array default
    const [categories, setCategories] = useState([]);   // ← safe empty array default
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
            const { data } = await axios.get("https://full-stack-ecommernce-app-backend.onrender.com/api/v1/category/get-category");
            if (data?.success) setCategories(data?.category || []);  // ← safe fallback
        } catch (error) {
            toast.error("Failed to load categories");
        }
    };

    const getTotal = async () => {
        try {
            const { data } = await axios.get('https://full-stack-ecommernce-app-backend.onrender.com/api/v1/product/product-count');
            setTotal(data?.total || 0);   // ← safe fallback
        } catch (error) {
            toast.error("Failed to get product count");
        }
    };

    const getAllProducts = useCallback(async (pg = 1) => {
        try {
            setLoading(true);
            const { data } = await axios.get(`https://full-stack-ecommernce-app-backend.onrender.com/api/v1/product/product-list/${pg}`);
            setProducts(data?.products || []);   // ← safe fallback
        } catch (error) {
            toast.error("Failed to load products");
            setProducts([]);   // ← always set array even on error
        } finally {
            setLoading(false);
            setInitialLoading(false);
        }
    }, []);

    const filterProduct = useCallback(async (pg = 1) => {
        try {
            setLoading(true);
            const { data } = await axios.post('https://full-stack-ecommernce-app-backend.onrender.com/api/v1/product/product-filters', {
                checked,
                radio: radio ?? [],
                page: pg,
            });
            setProducts(data?.products || []);   // ← safe fallback
            setFilterTotal(data?.total || 0);    // ← safe fallback
        } catch (error) {
            toast.error("Failed to filter products");
            setProducts([]);   // ← always set array even on error
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        getAllCategory();
        getTotal();
        getAllProducts(1);
    }, []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (!checked.length && !radio) { setPage(1); getAllProducts(1); }
    }, [checked.length, radio]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (checked.length || radio) { setPage(1); filterProduct(1); }
    }, [checked, radio]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (isFilterActive) { filterProduct(page); }
        else { getAllProducts(page); }
    }, [page]);

    // ── Pagination ─────────────────────────────────────────────────
    const renderPagination = () => {
        if (totalPages <= 1) return null;
        const pages = [];

        if (page > 3) {
            pages.push(
                <button
                    key={1}
                    className={`hp-page-btn${page === 1 ? ' hp-page-btn--active' : ''}`}
                    onClick={() => handlePageChange(1)}
                >1</button>
            );
            if (page > 4) pages.push(<span key="start-ellipsis" className="hp-page-ellipsis">…</span>);
        }

        const start = Math.max(1, page - 2);
        const end = Math.min(totalPages, page + 2);
        for (let i = start; i <= end; i++) {
            pages.push(
                <button
                    key={i}
                    className={`hp-page-btn${page === i ? ' hp-page-btn--active' : ''}`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }

        if (page < totalPages - 2) {
            if (page < totalPages - 3) pages.push(<span key="end-ellipsis" className="hp-page-ellipsis">…</span>);
            pages.push(
                <button
                    key={totalPages}
                    className={`hp-page-btn${page === totalPages ? ' hp-page-btn--active' : ''}`}
                    onClick={() => handlePageChange(totalPages)}
                >{totalPages}</button>
            );
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
                                    {(categories || []).map((c) => (
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
                                        {(Prices || []).map((p) => (
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
                    ) : (products || []).length === 0 ? (
                        <div className="hp-empty">
                            <div className="hp-empty__icon">🔍</div>
                            <h4>No products found</h4>
                            <p>Try adjusting or clearing your filters</p>
                            <button className="hp-btn hp-btn--gold" onClick={handleReset}>Clear Filters</button>
                        </div>
                    ) : (
                        <div className="hp-grid">
                            {(products || []).map((p) => (
                                <div key={p._id} className="hp-card">
                                    <div className="hp-card__img-wrap">
                                        <img
                                            src={`https://full-stack-ecommernce-app-backend.onrender.com/api/v1/product/product-photo/${p._id}`}
                                            alt={p.name}
                                            className="hp-card__img"
                                        />
                                        <button className="hp-card__quick" onClick={() => navigate(`/product/${p.slug}`)}>
                                            Quick View
                                        </button>
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

                    {/* Pagination */}
                    {!loading && renderPagination()}
                </div>
            </section>
        </Layout>
    );
};

export default HomePage;

