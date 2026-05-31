


import React, { useState, useEffect, useCallback } from 'react'
import Layout from '../components/Layout/Layout'
import axios from '../config/axios';
import { Checkbox, Radio } from 'antd';
import { Prices } from '../components/Prices';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';
import toast from 'react-hot-toast';
import './../StylePages/HomePage.css'

const PER_PAGE = 8;

// ── Skeleton Card ──────────────────────────────────────────────────
const SkeletonCard = () => (
    <div className="hp-card hp-card--skeleton" aria-hidden="true">
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
    <div className="hp-grid" aria-busy="true" aria-label="Loading products">
        {Array.from({ length: PER_PAGE }).map((_, i) => (
            <SkeletonCard key={i} />
        ))}
    </div>
);

// ── Skeleton Sidebar ───────────────────────────────────────────────
const SkeletonSidebar = () => (
    <div aria-hidden="true">
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
    </div>
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
            const { data } = await axios.get("https://full-stack-ecommernce-app-backend.onrender.com/api/v1/category/get-category");
            if (data?.success) setCategories(data?.category || []);
        } catch (error) {
            toast.error("Failed to load categories");
        }
    };

    const getTotal = async () => {
        try {
            const { data } = await axios.get('https://full-stack-ecommernce-app-backend.onrender.com/api/v1/product/product-count');
            setTotal(data?.total || 0);
        } catch (error) {
            toast.error("Failed to get product count");
        }
    };

    const getAllProducts = useCallback(async (pg = 1) => {
        try {
            setLoading(true);
            const { data } = await axios.get(`https://full-stack-ecommernce-app-backend.onrender.com/api/v1/product/product-list/${pg}`);
            setProducts(data?.products || []);
        } catch (error) {
            toast.error("Failed to load products");
            setProducts([]);
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
            setProducts(data?.products || []);
            setFilterTotal(data?.total || 0);
        } catch (error) {
            toast.error("Failed to filter products");
            setProducts([]);
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
                    aria-label={`Page 1${page === 1 ? ', current page' : ''}`}
                    aria-current={page === 1 ? 'page' : undefined}
                >1</button>
            );
            if (page > 4) pages.push(<span key="start-ellipsis" className="hp-page-ellipsis" aria-hidden="true">…</span>);
        }

        const start = Math.max(1, page - 2);
        const end = Math.min(totalPages, page + 2);
        for (let i = start; i <= end; i++) {
            pages.push(
                <button
                    key={i}
                    className={`hp-page-btn${page === i ? ' hp-page-btn--active' : ''}`}
                    onClick={() => handlePageChange(i)}
                    aria-label={`Page ${i}${page === i ? ', current page' : ''}`}
                    aria-current={page === i ? 'page' : undefined}
                >
                    {i}
                </button>
            );
        }

        if (page < totalPages - 2) {
            if (page < totalPages - 3) pages.push(<span key="end-ellipsis" className="hp-page-ellipsis" aria-hidden="true">…</span>);
            pages.push(
                <button
                    key={totalPages}
                    className={`hp-page-btn${page === totalPages ? ' hp-page-btn--active' : ''}`}
                    onClick={() => handlePageChange(totalPages)}
                    aria-label={`Page ${totalPages}${page === totalPages ? ', current page' : ''}`}
                    aria-current={page === totalPages ? 'page' : undefined}
                >{totalPages}</button>
            );
        }

        return (
            // FIX: wrap in <nav> with aria-label
            <nav aria-label="Products pagination" className="hp-pagination">
                <button
                    className="hp-page-btn hp-page-btn--nav"
                    disabled={page === 1}
                    onClick={() => handlePageChange(page - 1)}
                    aria-label="Previous page"
                >‹ Prev</button>
                <div className="hp-page-numbers">{pages}</div>
                <button
                    className="hp-page-btn hp-page-btn--nav"
                    disabled={page === totalPages}
                    onClick={() => handlePageChange(page + 1)}
                    aria-label="Next page"
                >Next ›</button>
            </nav>
        );
    };

    return (
        <Layout title={"TechVault — Shop Premium Tech"}>

            {/* ── Hero Banner ── */}
            <section className="hp-hero" aria-label="Hero banner">
                <div className="hp-hero__content">
                    <span className="hp-hero__tag" aria-hidden="true">New Arrivals 2025</span>
                    <h1 className="hp-hero__title">
                        Premium Tech,<br />
                        <em>Unbeatable</em> Prices.
                    </h1>
                    <p className="hp-hero__sub">
                        Curated laptops, gadgets & accessories — handpicked for performance.
                    </p>
                    <div className="hp-hero__actions">
                        <button
                            className="hp-btn hp-btn--gold"
                            onClick={() => document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' })}
                        >
                            Shop Now
                        </button>
                        <button className="hp-btn hp-btn--ghost" onClick={() => navigate('/categories')}>
                            Browse Categories
                        </button>
                    </div>
                </div>
                {/* FIX: aria-hidden on decorative stats strip — screen readers don't need "4.8★" announced */}
                <div className="hp-hero__stats" aria-hidden="true">
                    <div className="hp-stat"><span className="hp-stat__num">500+</span><span className="hp-stat__lbl">Products</span></div>
                    <div className="hp-stat__divider" />
                    <div className="hp-stat"><span className="hp-stat__num">4.8★</span><span className="hp-stat__lbl">Avg Rating</span></div>
                    <div className="hp-stat__divider" />
                    <div className="hp-stat"><span className="hp-stat__num">24hr</span><span className="hp-stat__lbl">Delivery</span></div>
                </div>
            </section>

            {/* ── Main Shop Area ── */}
            <section className="hp-shop" id="products-section" aria-label="Shop products">

                {/* ── Sidebar ── */}
                <aside className="hp-sidebar" aria-label="Filter products">
                    {initialLoading ? <SkeletonSidebar /> : (
                        <>
                            <div className="hp-sidebar__section">
                                {/* FIX: was h6 — page goes h1(hero) → h2(products title) → sidebar labels
                                    h6 skipped h3/h4/h5. Changed to h2 since sidebar is a parallel section,
                                    or use <p role="heading" aria-level="2"> to match visually */}
                                <h2 className="hp-sidebar__title">Filter by Category</h2>
                                <div className="hp-sidebar__items">
                                    {(categories || []).map((c) => (
                                        <label
                                            key={c._id}
                                            className={`hp-check-item${checked.includes(c._id) ? ' hp-check-item--active' : ''}`}
                                        >
                                            <Checkbox
                                                checked={checked.includes(c._id)}
                                                onChange={(e) => handleFilter(e.target.checked, c._id)}
                                            />
                                            <span>{c.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="hp-sidebar__section">
                                <h2 className="hp-sidebar__title">Filter by Price</h2>
                                <div className="hp-sidebar__items">
                                    <Radio.Group
                                        onChange={(e) => setRadio(e.target.value)}
                                        value={radio}
                                        aria-label="Filter by price range"
                                    >
                                        {(Prices || []).map((p) => (
                                            <label
                                                key={p._id}
                                                className={`hp-check-item${radio === p.array ? ' hp-check-item--active' : ''}`}
                                            >
                                                <Radio value={p.array} />
                                                <span>{p.name}</span>
                                            </label>
                                        ))}
                                    </Radio.Group>
                                </div>
                            </div>

                            {isFilterActive && (
                                <button className="hp-reset-btn" onClick={handleReset}>
                                    <span aria-hidden="true">✕</span> Reset Filters
                                </button>
                            )}
                        </>
                    )}
                </aside>

                {/* ── Products Area ── */}
                <div className="hp-products">

                    {/* Header row */}
                    <div className="hp-products__header">
                        <div>
                            {/* FIX: was h2 — keep h2 here, it's the main products heading ✓ */}
                            <h2 className="hp-products__title">
                                {isFilterActive ? 'Filtered Results' : 'All Products'}
                            </h2>
                            {!loading && (
                                <p className="hp-products__count">
                                    Page {page} of {totalPages || 1} · {activeTotal} products
                                </p>
                            )}
                            {loading && <div className="skel skel--count" aria-hidden="true" />}
                        </div>
                        {isFilterActive && !loading && (
                            <button className="hp-clear-btn" onClick={handleReset}>Clear Filters</button>
                        )}
                    </div>

                    {/* Skeleton or Grid */}
                    {loading ? (
                        <SkeletonGrid />
                    ) : (products || []).length === 0 ? (
                            <div className="hp-empty" role="status">
                                <div className="hp-empty__icon" aria-hidden="true">🔍</div>
                                {/* FIX: was h4 — changed to h3 to avoid skipping levels under h2 */}
                                <h3 className="hp-empty__heading">No products found</h3>
                            <p>Try adjusting or clearing your filters</p>
                            <button className="hp-btn hp-btn--gold" onClick={handleReset}>Clear Filters</button>
                        </div>
                    ) : (
                                <div className="hp-grid" role="list" aria-label="Products">
                            {(products || []).map((p) => (
                                <article key={p._id} className="hp-card" role="listitem">
                                    <div className="hp-card__img-wrap">
                                        <img
                                            src={`https://full-stack-ecommernce-app-backend.onrender.com/api/v1/product/product-photo/${p._id}`}
                                            alt={p.name}
                                            className="hp-card__img"
                                            loading="lazy"
                                        />
                                        <button
                                            className="hp-card__quick"
                                            onClick={() => navigate(`/product/${p.slug}`)}
                                            aria-label={`Quick view ${p.name}`}
                                        >
                                            Quick View
                                        </button>
                                    </div>
                                    <div className="hp-card__body">
                                        <p className="hp-card__category">{p.category?.name || 'Product'}</p>
                                        {/* FIX: was h5 — changed to h3 (correct under h2 "All Products") */}
                                        <h3 className="hp-card__name">{p.name}</h3>
                                        <p className="hp-card__desc">{p.description?.substring(0, 55)}...</p>
                                        <div className="hp-card__footer">
                                            <span className="hp-card__price">₹{p.price?.toLocaleString('en-IN')}</span>
                                            <div className="hp-card__actions">
                                                <button
                                                    className="hp-card__btn hp-card__btn--detail"
                                                    onClick={() => navigate(`/product/${p.slug}`)}
                                                    aria-label={`View details of ${p.name}`}
                                                >Details</button>
                                                <button
                                                    className="hp-card__btn hp-card__btn--cart"
                                                    onClick={() => handleAddToCart(p)}
                                                    aria-label={`Add ${p.name} to cart`}
                                                >+ Cart</button>
                                            </div>
                                        </div>
                                    </div>
                                </article>
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