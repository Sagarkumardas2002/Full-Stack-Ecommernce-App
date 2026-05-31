

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Layout from '../components/Layout/Layout';
import { useSearch } from '../context/ssearch';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';
import toast from 'react-hot-toast';
import axios from '../config/axios';
import './../StylePages/Search.css';

const PER_PAGE = 12;
const RECENT_KEY = 'tv_recent_searches';
const MAX_RECENT = 6;

// ── Utility: tokenise a string ──────────────────────────────────────────────
const tokenise = (str = '') =>
    str.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);

// ── Levenshtein distance (for fuzzy matching) ───────────────────────────────
function levenshtein(a, b) {
    const m = a.length, n = b.length;
    if (!m) return n;
    if (!n) return m;
    const dp = Array.from({ length: m + 1 }, (_, i) => [i]);
    for (let j = 1; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            dp[i][j] = a[i - 1] === b[j - 1]
                ? dp[i - 1][j - 1]
                : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
    }
    return dp[m][n];
}

// ── Score one product against query tokens ──────────────────────────────────
function scoreProduct(product, queryTokens) {
    if (!queryTokens.length) return 0;

    const nameTokens = tokenise(product.name);
    const catTokens = tokenise(product.category?.name || '');
    const descTokens = tokenise(product.description || '');

    let score = 0;

    for (const qt of queryTokens) {
        // exact & prefix matches in name (highest weight)
        for (const nt of nameTokens) {
            if (nt === qt) { score += 100; continue; }
            if (nt.startsWith(qt) || qt.startsWith(nt)) { score += 60; continue; }
            const dist = levenshtein(qt, nt);
            const threshold = Math.max(1, Math.floor(qt.length * 0.35));
            if (dist <= threshold) score += Math.max(0, 40 - dist * 12);
        }
        // category match
        for (const ct of catTokens) {
            if (ct === qt) { score += 50; continue; }
            if (ct.startsWith(qt) || qt.startsWith(ct)) { score += 30; continue; }
        }
        // description match
        for (const dt of descTokens) {
            if (dt === qt) { score += 15; continue; }
            if (dt.startsWith(qt)) { score += 8; continue; }
        }
    }

    // bonus: all tokens matched name
    const allInName = queryTokens.every(qt =>
        nameTokens.some(nt => nt.includes(qt) || qt.includes(nt) || levenshtein(qt, nt) <= 1)
    );
    if (allInName) score *= 1.5;

    return score;
}

// ── Highlight matched tokens in a string ───────────────────────────────────
function HighlightText({ text = '', queryTokens = [], maxLen }) {
    const display = maxLen ? text.substring(0, maxLen) + (text.length > maxLen ? '…' : '') : text;
    if (!queryTokens.length) return <>{display}</>;

    const regex = new RegExp(
        `(${queryTokens.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
        'gi'
    );
    const parts = display.split(regex);

    return (
        <>
            {parts.map((part, i) =>
                regex.test(part)
                    ? <mark key={i} className="sr-highlight">{part}</mark>
                    : part
            )}
        </>
    );
}

// ── Similarity: products sharing category or price band ────────────────────
function getSimilarProducts(results, allProducts, queryTokens, count = 6) {
    if (!results.length || !allProducts?.length) return [];

    const resultIds = new Set(results.map(p => p._id));
    const topCategories = [...new Set(results.slice(0, 3).map(p => p.category?._id).filter(Boolean))];
    const prices = results.map(p => p.price).filter(Boolean);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / (prices.length || 1);
    const band = avgPrice * 0.5;

    const candidates = (allProducts || []).filter(p => !resultIds.has(p._id));

    return candidates
        .map(p => {
            let s = 0;
            if (topCategories.includes(p.category?._id)) s += 60;
            if (p.price && Math.abs(p.price - avgPrice) <= band) s += 30;
            s += scoreProduct(p, queryTokens) * 0.4;
            return { ...p, _simScore: s };
        })
        .filter(p => p._simScore > 20)
        .sort((a, b) => b._simScore - a._simScore)
        .slice(0, count);
}

// ── Recent searches helpers ─────────────────────────────────────────────────
function getRecentSearches() {
    try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch { return []; }
}
function saveRecentSearch(query) {
    if (!query?.trim()) return;
    const existing = getRecentSearches().filter(q => q !== query.trim());
    const updated = [query.trim(), ...existing].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
}
function removeRecentSearch(query) {
    const updated = getRecentSearches().filter(q => q !== query);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
}

// ── Pagination renderer ─────────────────────────────────────────────────────
function Pagination({ page, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;
    const pages = [];

    if (page > 3) {
        pages.push(
            <button key={1} className={`sr-page-btn${page === 1 ? ' sr-page-btn--active' : ''}`}
                onClick={() => onPageChange(1)} aria-label="Page 1">1</button>
        );
        if (page > 4) pages.push(<span key="s-ell" className="sr-page-ellipsis" aria-hidden="true">…</span>);
    }

    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    for (let i = start; i <= end; i++) {
        pages.push(
            <button key={i}
                className={`sr-page-btn${page === i ? ' sr-page-btn--active' : ''}`}
                onClick={() => onPageChange(i)}
                aria-label={`Page ${i}`}
                aria-current={page === i ? 'page' : undefined}
            >{i}</button>
        );
    }

    if (page < totalPages - 2) {
        if (page < totalPages - 3) pages.push(<span key="e-ell" className="sr-page-ellipsis" aria-hidden="true">…</span>);
        pages.push(
            <button key={totalPages}
                className={`sr-page-btn${page === totalPages ? ' sr-page-btn--active' : ''}`}
                onClick={() => onPageChange(totalPages)}
                aria-label={`Page ${totalPages}`}
            >{totalPages}</button>
        );
    }

    return (
        <nav aria-label="Search results pagination" className="sr-pagination">
            <button className="sr-page-btn sr-page-btn--nav" disabled={page === 1}
                onClick={() => onPageChange(page - 1)} aria-label="Previous page">‹ Prev</button>
            <div className="sr-page-numbers" role="list">{pages}</div>
            <button className="sr-page-btn sr-page-btn--nav" disabled={page === totalPages}
                onClick={() => onPageChange(page + 1)} aria-label="Next page">Next ›</button>
        </nav>
    );
}

// ── Product Card ────────────────────────────────────────────────────────────
function ProductCard({ p, queryTokens, onNavigate, onAddToCart, animDelay = 0, compact = false }) {
    return (
        <article
            className={`sr-card${compact ? ' sr-card--compact' : ''}`}
            style={{ animationDelay: `${animDelay}ms` }}
        >
            <div className="sr-card__img-wrap">
                <img
                    src={`${axios.defaults.baseURL}/api/v1/product/product-photo/${p._id}`}
                    alt={p.name}
                    className="sr-card__img"
                    loading="lazy"
                />
                <button className="sr-card__quick" onClick={() => onNavigate(p.slug)}
                    aria-label={`Quick view ${p.name}`}>
                    Quick View
                </button>
            </div>
            <div className="sr-card__body">
                <p className="sr-card__category">{p.category?.name || 'Product'}</p>
                <h3 className="sr-card__name">
                    <HighlightText text={p.name} queryTokens={queryTokens} />
                </h3>
                {!compact && (
                    <p className="sr-card__desc">
                        <HighlightText text={p.description || ''} queryTokens={queryTokens} maxLen={60} />
                    </p>
                )}
                <div className="sr-card__footer">
                    <span className="sr-card__price">₹{p.price?.toLocaleString('en-IN')}</span>
                    <div className="sr-card__actions">
                        <button className="sr-card__btn sr-card__btn--detail"
                            onClick={() => onNavigate(p.slug)}
                            aria-label={`View details of ${p.name}`}>Details</button>
                        <button className="sr-card__btn sr-card__btn--cart"
                            onClick={() => onAddToCart(p)}
                            aria-label={`Add ${p.name} to cart`}>+ Cart</button>
                    </div>
                </div>
            </div>
        </article>
    );
}

// ── Main Component ──────────────────────────────────────────────────────────
const Search = () => {
    const [values] = useSearch();
    const navigate = useNavigate();
    const [cart, setCart] = useCart();
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState('relevance');
    const [recentSearches, setRecentSearches] = useState(getRecentSearches);

    // Derive query string from context (support both {keyword} and {query} shapes)
    const rawQuery = values?.keyword || values?.query || '';

    // Save to recent on query change
    const savedQuery = useRef('');
    useEffect(() => {
        if (rawQuery && rawQuery !== savedQuery.current) {
            saveRecentSearch(rawQuery);
            savedQuery.current = rawQuery;
            setRecentSearches(getRecentSearches());
            setPage(1);
        }
    }, [rawQuery]);

    const queryTokens = useMemo(() => tokenise(rawQuery), [rawQuery]);

    // Score + sort results
    const scoredResults = useMemo(() => {
        const results = values?.results || [];
        return results.map(p => ({ ...p, _score: scoreProduct(p, queryTokens) }));
    }, [values?.results, queryTokens]);

    const sortedResults = useMemo(() => {
        const arr = [...scoredResults];
        switch (sortBy) {
            case 'price_asc': return arr.sort((a, b) => (a.price || 0) - (b.price || 0));
            case 'price_desc': return arr.sort((a, b) => (b.price || 0) - (a.price || 0));
            case 'name_asc': return arr.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            case 'relevance':
            default: return arr.sort((a, b) => b._score - a._score);
        }
    }, [scoredResults, sortBy]);

    const resultCount = sortedResults.length;
    const totalPages = Math.ceil(resultCount / PER_PAGE);

    const paginatedResults = useMemo(() =>
        sortedResults.slice((page - 1) * PER_PAGE, page * PER_PAGE),
        [sortedResults, page]
    );

    // Similar products (uses allProducts from context if available, else derives from results pool)
    const similarProducts = useMemo(() =>
        getSimilarProducts(sortedResults, values?.allProducts, queryTokens),
        [sortedResults, values?.allProducts, queryTokens]
    );

    // Related categories for empty state
    const suggestedCategories = useMemo(() => {
        if (resultCount > 0) return [];
        return [...new Set((values?.allProducts || [])
            .map(p => p.category?.name)
            .filter(Boolean)
        )].slice(0, 5);
    }, [resultCount, values?.allProducts]);

    const handleAddToCart = (p) => {
        const updatedCart = [...cart, { ...p, cartQty: 1 }];
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        toast.success('Added to cart');
    };

    const handlePageChange = (pg) => {
        setPage(pg);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleRemoveRecent = (q) => {
        removeRecentSearch(q);
        setRecentSearches(getRecentSearches());
    };

    return (
        <Layout title={"Search Results — TechVault"}>

            {/* ── Hero ── */}
            <section className="sr-hero" aria-label="Search results summary">
                <div className="sr-hero__content">
                    <span className="sr-hero__tag">Search Results</span>
                    <h1 className="sr-hero__title">
                        {resultCount > 0
                            ? <>Found <em>{resultCount}</em> result{resultCount !== 1 ? 's' : ''}</>
                            : 'No Results Found'
                        }
                    </h1>
                    {rawQuery && (
                        <p className="sr-hero__query">
                            for <span className="sr-hero__query-text">"{rawQuery}"</span>
                        </p>
                    )}
                    <p className="sr-hero__sub">
                        {resultCount > 0
                            ? `Showing page ${page} of ${totalPages}`
                            : `We couldn't find any products matching your search`
                        }
                    </p>
                </div>
            </section>

            {/* ── Recent Searches (shown when there are results) ── */}
            {recentSearches.length > 0 && resultCount > 0 && (
                <div className="sr-recents" role="navigation" aria-label="Recent searches">
                    <span className="sr-recents__label">Recent:</span>
                    <div className="sr-recents__chips">
                        {recentSearches.map(q => (
                            <span key={q} className="sr-recent-chip">
                                <button className="sr-recent-chip__text"
                                    onClick={() => navigate(`/search?q=${encodeURIComponent(q)}`)}>
                                    {q}
                                </button>
                                <button className="sr-recent-chip__remove"
                                    onClick={() => handleRemoveRecent(q)}
                                    aria-label={`Remove ${q} from recent searches`}>×</button>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <section className="sr-section">

                {/* ── Header + Sort ── */}
                {resultCount > 0 && (
                    <div className="sr-header">
                        <div>
                            <h2 className="sr-header__title">Matching Products</h2>
                            <p className="sr-header__count">
                                {resultCount} product{resultCount !== 1 ? 's' : ''}
                                {totalPages > 1 && ` · Page ${page} of ${totalPages}`}
                            </p>
                        </div>
                        <div className="sr-header__controls">
                            <div className="sr-sort">
                                <label htmlFor="sr-sort-select" className="sr-sort__label">Sort by</label>
                                <select
                                    id="sr-sort-select"
                                    className="sr-sort__select"
                                    value={sortBy}
                                    onChange={e => { setSortBy(e.target.value); setPage(1); }}
                                >
                                    <option value="relevance">Relevance</option>
                                    <option value="price_asc">Price: Low to High</option>
                                    <option value="price_desc">Price: High to Low</option>
                                    <option value="name_asc">Name: A–Z</option>
                                </select>
                            </div>
                            <button className="sr-back-btn" onClick={() => navigate('/')}>
                                ← Back to Shop
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Empty State ── */}
                {resultCount === 0 && (
                    <div className="sr-empty" role="status" aria-live="polite">
                        <div className="sr-empty__icon" aria-hidden="true">🔍</div>
                        <h3 className="sr-empty__heading">No products found</h3>
                        <p>
                            Try different keywords or check your spelling.<br />
                            Here are some categories you can browse:
                        </p>
                        {suggestedCategories.length > 0 && (
                            <div className="sr-empty__categories">
                                {suggestedCategories.map(cat => (
                                    <button
                                        key={cat}
                                        className="sr-empty__cat-chip"
                                        onClick={() => navigate(`/category/${cat.toLowerCase().replace(/\s+/g, '-')}`)}
                                    >{cat}</button>
                                ))}
                            </div>
                        )}
                        {recentSearches.length > 0 && (
                            <div className="sr-empty__recents">
                                <p className="sr-empty__recents-label">Your recent searches:</p>
                                <div className="sr-empty__recent-chips">
                                    {recentSearches.map(q => (
                                        <button key={q} className="sr-empty__recent-chip"
                                            onClick={() => navigate(`/search?q=${encodeURIComponent(q)}`)}>
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="sr-empty__actions">
                            <button className="sr-btn sr-btn--dark" onClick={() => navigate('/')}>
                                Browse All Products
                            </button>
                            <button className="sr-btn sr-btn--outline" onClick={() => navigate('/categories')}>
                                View Categories
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Product Grid + Similar Products ── */}
                {resultCount > 0 && (
                    <div className="sr-layout">

                        {/* Main results */}
                        <div className="sr-main">
                            <div className="sr-grid" role="list" aria-label="Search results">
                                {paginatedResults.map((p, i) => (
                                    <ProductCard
                                        key={p._id}
                                        p={p}
                                        queryTokens={queryTokens}
                                        onNavigate={(slug) => navigate(`/product/${slug}`)}
                                        onAddToCart={handleAddToCart}
                                        animDelay={i * 40}
                                    />
                                ))}
                            </div>
                            <Pagination
                                page={page}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>

                        {/* Similar Products sidebar */}
                        {similarProducts.length > 0 && (
                            <aside className="sr-similar" aria-label="Similar products">
                                <div className="sr-similar__header">
                                    <span className="sr-similar__tag">You might also like</span>
                                    <h2 className="sr-similar__title">Similar Products</h2>
                                </div>
                                <div className="sr-similar__list">
                                    {similarProducts.map((p, i) => (
                                        <ProductCard
                                            key={p._id}
                                            p={p}
                                            queryTokens={queryTokens}
                                            onNavigate={(slug) => navigate(`/product/${slug}`)}
                                            onAddToCart={handleAddToCart}
                                            animDelay={i * 60}
                                            compact
                                        />
                                    ))}
                                </div>
                            </aside>
                        )}

                    </div>
                )}

            </section>
        </Layout>
    );
};

export default Search;