

import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    useMemo,
} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSearch } from '../../context/ssearch';
import axios from '../../config/axios';
import './../../StylePages/SearchInput.css';

// ─────────────────────────────────────────────────────────────────────────────
// ALGORITHM HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Levenshtein distance between two strings */
function levenshtein(a, b) {
    const m = a.length, n = b.length;
    if (!m) return n;
    if (!n) return m;
    const dp = Array.from({ length: m + 1 }, (_, i) => [i]);
    for (let j = 1; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++)
        for (let j = 1; j <= n; j++)
            dp[i][j] = a[i - 1] === b[j - 1]
                ? dp[i - 1][j - 1]
                : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    return dp[m][n];
}

/**
 * Robust multi-signal scoring.
 * Returns 0–100. Higher = better match.
 *
 * Signals (in priority order):
 *  1. Exact full match          → 100
 *  2. Starts-with full query    → 90
 *  3. Contains full query       → 75
 *  4. Any word starts-with q   → 65
 *  5. All query tokens found    → 55  (e.g. "sam gal" → "Samsung Galaxy")
 *  6. Some query tokens found   → 35–50 (proportional)
 *  7. Fuzzy prefix match        → 20–38
 *  8. No match                  → 0
 */
function matchScore(name = '', query = '') {
    if (!name || !query) return 0;
    const n = name.toLowerCase().trim();
    const q = query.toLowerCase().trim();
    if (!q) return 0;

    // exact
    if (n === q) return 100;

    // full string prefix / contains
    if (n.startsWith(q)) return 90;
    if (n.includes(q)) return 75;

    const nameWords = n.split(/[\s\-_/]+/).filter(Boolean);
    const queryTokens = q.split(/[\s\-_/]+/).filter(Boolean);

    // any name-word starts with full query
    if (nameWords.some(w => w.startsWith(q))) return 65;

    // token intersection scoring
    if (queryTokens.length > 1) {
        const matched = queryTokens.filter(qt =>
            nameWords.some(nw => nw.startsWith(qt) || nw.includes(qt))
        );
        const ratio = matched.length / queryTokens.length;
        if (ratio === 1) return 55;
        if (ratio >= 0.5) return Math.round(35 + ratio * 20);
    } else {
        // single token — check if any name word includes it (substring)
        if (nameWords.some(w => w.includes(q))) return 50;
    }

    // fuzzy: levenshtein against each name word
    const fuzzyBest = nameWords.reduce((best, w) => {
        const window = w.substring(0, q.length + 2);
        const dist = levenshtein(q, window);
        const tolerance = Math.max(1, Math.floor(q.length * 0.35));
        if (dist <= tolerance) return Math.max(best, 38 - dist * 9);
        return best;
    }, 0);
    if (fuzzyBest > 0) return fuzzyBest;

    return 0;
}

/** Highlight matching substring inside text */
function Highlight({ text = '', query = '' }) {
    if (!query.trim()) return <>{text}</>;
    const q = query.toLowerCase().trim();
    const idx = text.toLowerCase().indexOf(q);
    if (idx === -1) return <>{text}</>;
    return (
        <>
            {text.slice(0, idx)}
            <em className="sb-match">{text.slice(idx, idx + q.length)}</em>
            {text.slice(idx + q.length)}
        </>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// STATIC SEEDS — generic tech product keywords
// ─────────────────────────────────────────────────────────────────────────────
const SUGGESTION_SEEDS = [
    'laptop', 'gaming laptop', 'ultrabook', 'macbook', 'chromebook',
    'desktop pc', 'gaming pc', 'all in one pc',
    'monitor', 'gaming monitor', '4k monitor', 'curved monitor',
    'keyboard', 'mechanical keyboard', 'gaming keyboard', 'wireless keyboard', 'rgb keyboard',
    'mouse', 'gaming mouse', 'wireless mouse', 'trackpad',
    'headphones', 'gaming headset', 'noise cancelling headphones', 'wireless headphones',
    'earbuds', 'true wireless earbuds', 'bluetooth earphones',
    'bluetooth speaker', 'portable speaker',
    'webcam', 'hd webcam', '4k webcam',
    'ssd', 'nvme ssd', 'external ssd', 'hard drive', 'portable hard drive',
    'ram', 'ddr5 ram', 'graphics card', 'gpu', 'rtx',
    'cpu cooler', 'liquid cooler', 'usb hub', 'laptop stand', 'monitor arm',
    'power bank', 'wireless charger', 'fast charger',
    'smartwatch', 'fitness band', 'tablet', 'ipad', 'android tablet',
    'phone case', 'screen protector', 'cable', 'hdmi cable',
];

// ─────────────────────────────────────────────────────────────────────────────
// RECENT SEARCHES — localStorage
// ─────────────────────────────────────────────────────────────────────────────
const RECENT_KEY = 'tv_recent_searches';
function getRecent() {
    try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch { return []; }
}
function addRecent(q) {
    if (!q?.trim()) return;
    const ex = getRecent().filter(r => r.toLowerCase() !== q.trim().toLowerCase());
    localStorage.setItem(RECENT_KEY, JSON.stringify([q.trim(), ...ex].slice(0, 8)));
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const SearchInput = ({ placeholder = 'Search products…', className = '' }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [values, setValues] = useSearch();

    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [activeIdx, setActiveIdx] = useState(-1);
    const [allProducts, setAllProducts] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dropdownStyle, setDropdownStyle] = useState({});

    const rootRef = useRef(null);
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);
    const debounceRef = useRef(null);
    const navigatingRef = useRef(false); // prevent re-open after navigate

    // ── Close dropdown cleanly whenever route changes ───────────────────────
    useEffect(() => {
        setOpen(false);
        setActiveIdx(-1);
        navigatingRef.current = false;
    }, [location.pathname]);

    // ── Compute dropdown position ───────────────────────────────────────────
    const isMobile = useCallback(() => window.innerWidth <= 480, []);

    const updateDropdownPos = useCallback(() => {
        if (!rootRef.current) return;

        if (!isMobile()) {
            // Desktop: pure CSS absolute — no inline style needed
            setDropdownStyle({});
            return;
        }

        // Mobile: position:fixed anchored exactly to the root element's rect
        const rect = rootRef.current.getBoundingClientRect();
        setDropdownStyle({
            position: 'fixed',
            top: `${rect.bottom + 6}px`,
            left: `${rect.left}px`,       // align left edge to bar
            width: `${Math.max(rect.width, 240)}px`, // min 240px wide
            right: 'auto',
        });
    }, [isMobile]);

    useEffect(() => {
        if (open) updateDropdownPos();
        else setDropdownStyle({});
    }, [open, updateDropdownPos]);

    useEffect(() => {
        if (!open) return;
        const onScroll = () => { if (isMobile()) updateDropdownPos(); };
        const onResize = () => updateDropdownPos();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
        };
    }, [open, isMobile, updateDropdownPos]);

    // ── Fetch catalogue once ────────────────────────────────────────────────
    useEffect(() => {
        (async () => {
            try {
                const [pRes, cRes] = await Promise.all([
                    axios.get('/api/v1/product/get-product'),
                    axios.get('/api/v1/category/get-category'),
                ]);
                setAllProducts(pRes.data?.products || []);
                setAllCategories(cRes.data?.category || []);
            } catch { /* silent — seeds still work */ }
        })();
    }, []);

    // ── Build dropdown sections ─────────────────────────────────────────────
    const { suggestions, products, categories } = useMemo(() => {
        const q = query.trim();

        // Empty query → recent
        if (!q) {
            return {
                suggestions: getRecent().map(r => ({ label: r, type: 'recent' })),
                products: [],
                categories: [],
            };
        }

        // ── Suggestions from seeds ──
        // Also inject dynamic suggestions from actual category/product names
        const dynamicSeeds = [
            ...allCategories.map(c => c.name),
            // add brand names extracted from products
            ...allProducts.map(p => p.name.split(' ')[0]).filter(Boolean),
        ].map(s => s.toLowerCase());
        const allSeeds = [...new Set([...SUGGESTION_SEEDS, ...dynamicSeeds])];

        const seeds = allSeeds
            .map(s => ({ label: s, score: matchScore(s, q), type: 'suggestion' }))
            .filter(s => s.score >= 20)
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);

        // ── Products ──
        const prods = allProducts
            .map(p => ({
                ...p,
                _score: Math.max(
                    matchScore(p.name, q),
                    matchScore(p.category?.name || '', q) * 0.5,
                    // also score brand (first word) separately for short queries
                    matchScore(p.name.split(' ')[0] || '', q) * 0.8,
                ),
            }))
            .filter(p => p._score >= 15)          // lower threshold → more hits
            .sort((a, b) => b._score - a._score)
            .slice(0, 4);                          // show up to 4 products

        // ── Categories ──
        const cats = allCategories
            .map(c => ({
                ...c,
                _score: matchScore(c.name, q),
                _count: allProducts.filter(p => p.category?._id === c._id).length,
            }))
            .filter(c => c._score >= 15)
            .sort((a, b) => b._score - a._score)
            .slice(0, 3);

        return { suggestions: seeds, products: prods, categories: cats };
    }, [query, allProducts, allCategories]);

    // Flat list for keyboard nav
    const flatItems = useMemo(() => {
        const items = [];
        suggestions.forEach(s => items.push({ kind: 'suggestion', data: s }));
        products.forEach(p => items.push({ kind: 'product', data: p }));
        categories.forEach(c => items.push({ kind: 'category', data: c }));
        return items;
    }, [suggestions, products, categories]);

    const hasResults = flatItems.length > 0;

    // ── Execute search ──────────────────────────────────────────────────────
    const executeSearch = useCallback(async (q) => {
        const trimmed = q?.trim();
        if (!trimmed) return;
        navigatingRef.current = true;
        setOpen(false);
        setActiveIdx(-1);
        addRecent(trimmed);
        setLoading(true);
        try {
            const res = await axios.get(`/api/v1/product/search/${encodeURIComponent(trimmed)}`);
            setValues(prev => ({
                ...prev,
                keyword: trimmed,
                results: res.data?.results || [],
                allProducts,
            }));
        } catch {
            setValues(prev => ({
                ...prev,
                keyword: trimmed,
                results: [],
                allProducts,
            }));
        } finally {
            setLoading(false);
            navigate('/search');
        }
    }, [setValues, navigate, allProducts]);

    // ── Input handlers ──────────────────────────────────────────────────────
    const handleChange = (e) => {
        const val = e.target.value;
        setQuery(val);
        setActiveIdx(-1);
        clearTimeout(debounceRef.current);
        if (!navigatingRef.current) {
            debounceRef.current = setTimeout(() => setOpen(true), 100);
        }
    };

    const handleFocus = () => {
        if (!navigatingRef.current) setOpen(true);
    };

    const handleKeyDown = (e) => {
        if (!open) {
            if (e.key === 'Enter') { executeSearch(query); return; }
            if (e.key === 'ArrowDown') { setOpen(true); return; }
            return;
        }
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setActiveIdx(i => Math.min(i + 1, flatItems.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setActiveIdx(i => (i <= 0 ? -1 : i - 1));
                break;
            case 'Enter':
                e.preventDefault();
                if (activeIdx >= 0 && flatItems[activeIdx]) {
                    handleSelect(flatItems[activeIdx]);
                } else {
                    executeSearch(query);
                }
                break;
            case 'Escape':
                setOpen(false);
                setActiveIdx(-1);
                inputRef.current?.blur();
                break;
            default: break;
        }
    };

    const handleSelect = useCallback((item) => {
        if (item.kind === 'product') {
            navigatingRef.current = true;
            setOpen(false);
            navigate(`/product/${item.data.slug}`);
        } else if (item.kind === 'category') {
            navigatingRef.current = true;
            setOpen(false);
            navigate(`/category/${item.data.slug || item.data._id}`);
        } else {
            const label = item.data.label;
            setQuery(label);
            executeSearch(label);
        }
    }, [navigate, executeSearch]);

    // ── Close on outside click ──────────────────────────────────────────────
    useEffect(() => {
        const handler = (e) => {
            if (
                !rootRef.current?.contains(e.target) &&
                !dropdownRef.current?.contains(e.target)
            ) {
                setOpen(false);
                setActiveIdx(-1);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // ── Scroll active item into view ────────────────────────────────────────
    useEffect(() => {
        if (activeIdx >= 0) {
            dropdownRef.current
                ?.querySelector(`[data-idx="${activeIdx}"]`)
                ?.scrollIntoView({ block: 'nearest' });
        }
    }, [activeIdx]);

    const showDropdown = open && !navigatingRef.current && (hasResults || query.trim().length === 0);

    // ─────────────────────────────────────────────────────────────────────────
    // RENDER
    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className={`sb-root ${className}`} ref={rootRef} role="search">

            {/* ── Search bar pill ── */}
            <div className="sb-input-row">
                <span className="sb-icon-search" aria-hidden="true">
                    {loading
                        ? <span className="sb-spinner" />
                        : <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    }
                </span>

                <input
                    ref={inputRef}
                    type="text"
                    className="sb-input"
                    value={query}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    placeholder={placeholder}
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                    aria-label="Search products"
                    aria-autocomplete="list"
                    aria-expanded={showDropdown}
                    aria-controls="sb-dropdown"
                    aria-activedescendant={activeIdx >= 0 ? `sb-item-${activeIdx}` : undefined}
                    role="combobox"
                />

                {query && (
                    <button
                        className="sb-clear"
                        tabIndex={-1}
                        aria-label="Clear search"
                        onClick={() => {
                            setQuery('');
                            navigatingRef.current = false;
                            setOpen(true);
                            inputRef.current?.focus();
                        }}
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                )}

                <button
                    className="sb-submit"
                    onClick={() => executeSearch(query)}
                    aria-label="Submit search"
                >
                    Search
                </button>
            </div>

            {/* ── Dropdown ── */}
            {showDropdown && (
                <div
                    id="sb-dropdown"
                    className="sb-dropdown"
                    ref={dropdownRef}
                    role="listbox"
                    aria-label="Search suggestions"
                    style={dropdownStyle}
                >
                    {/* Empty state */}
                    {!query.trim() && suggestions.length === 0 && (
                        <div className="sb-empty-hint">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            Start typing to see suggestions
                        </div>
                    )}

                    {/* Recent searches */}
                    {!query.trim() && suggestions.length > 0 && (() => {
                        let counter = 0;
                        return (
                            <>
                                <div className="sb-section-label">Recent searches</div>
                                {suggestions.map(s => {
                                    const idx = counter++;
                                    return (
                                        <SbItem key={s.label} id={`sb-item-${idx}`} dataIdx={idx}
                                            active={activeIdx === idx} icon="recent"
                                            onMouseEnter={() => setActiveIdx(idx)}
                                            onClick={() => handleSelect({ kind: 'suggestion', data: s })}>
                                            <span className="sb-item-main">{s.label}</span>
                                        </SbItem>
                                    );
                                })}
                            </>
                        );
                    })()}

                    {/* Suggestions */}
                    {query.trim() && suggestions.length > 0 && (
                        <>
                            <div className="sb-section-label">Suggestions</div>
                            {suggestions.map((s, i) => (
                                <SbItem key={s.label} id={`sb-item-${i}`} dataIdx={i}
                                    active={activeIdx === i} icon="search"
                                    onMouseEnter={() => setActiveIdx(i)}
                                    onClick={() => handleSelect({ kind: 'suggestion', data: s })}>
                                    <span className="sb-item-main">
                                        <Highlight text={s.label} query={query} />
                                    </span>
                                </SbItem>
                            ))}
                        </>
                    )}

                    {/* Products */}
                    {products.length > 0 && (() => {
                        const off = suggestions.length;
                        return (
                            <>
                                {suggestions.length > 0 && <div className="sb-divider" />}
                                <div className="sb-section-label">Products</div>
                                {products.map((p, i) => {
                                    const idx = off + i;
                                    return (
                                        <SbItem key={p._id} id={`sb-item-${idx}`} dataIdx={idx}
                                            active={activeIdx === idx} icon="product"
                                            onMouseEnter={() => setActiveIdx(idx)}
                                            onClick={() => handleSelect({ kind: 'product', data: p })}>
                                            <div className="sb-item-thumb">
                                                <img
                                                    src={`${axios.defaults.baseURL}/api/v1/product/product-photo/${p._id}`}
                                                    alt=""
                                                    aria-hidden="true"
                                                />
                                            </div>
                                            <div className="sb-item-text">
                                                <span className="sb-item-main">
                                                    <Highlight text={p.name} query={query} />
                                                </span>
                                                <span className="sb-item-sub">
                                                    {p.category?.name || 'Product'}
                                                </span>
                                            </div>
                                            <span className="sb-item-price">
                                                ₹{p.price?.toLocaleString('en-IN')}
                                            </span>
                                        </SbItem>
                                    );
                                })}
                            </>
                        );
                    })()}

                    {/* Categories */}
                    {categories.length > 0 && (() => {
                        const off = suggestions.length + products.length;
                        return (
                            <>
                                <div className="sb-divider" />
                                <div className="sb-section-label">Categories</div>
                                {categories.map((c, i) => {
                                    const idx = off + i;
                                    return (
                                        <SbItem key={c._id} id={`sb-item-${idx}`} dataIdx={idx}
                                            active={activeIdx === idx} icon="category"
                                            onMouseEnter={() => setActiveIdx(idx)}
                                            onClick={() => handleSelect({ kind: 'category', data: c })}>
                                            <div className="sb-item-text">
                                                <span className="sb-item-main">
                                                    <Highlight text={c.name} query={query} />
                                                </span>
                                                <span className="sb-item-sub">{c._count} products</span>
                                            </div>
                                        </SbItem>
                                    );
                                })}
                            </>
                        );
                    })()}

                    {/* Footer */}
                    {hasResults && (
                        <div className="sb-footer">
                            <kbd>↑</kbd><kbd>↓</kbd> navigate
                            <span className="sb-footer-sep" />
                            <kbd>↵</kbd> select
                            <span className="sb-footer-sep" />
                            <kbd>Esc</kbd> close
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────────────────────────────────────
const ICONS = {
    search: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    ),
    recent: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <polyline points="12 8 12 12 14 14" />
            <path d="M3.05 11a9 9 0 1 0 .5-4.5" />
            <polyline points="3 3 3 9 9 9" />
        </svg>
    ),
    product: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
        </svg>
    ),
    category: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
        </svg>
    ),
};

// ─────────────────────────────────────────────────────────────────────────────
// DROPDOWN ROW
// ─────────────────────────────────────────────────────────────────────────────
function SbItem({ id, dataIdx, active, icon, onMouseEnter, onClick, children }) {
    return (
        <div
            id={id}
            data-idx={dataIdx}
            className={`sb-item${active ? ' sb-item--active' : ''}`}
            role="option"
            aria-selected={active}
            onMouseEnter={onMouseEnter}
            onMouseDown={e => { e.preventDefault(); onClick(); }}
        >
            <div className={`sb-item-icon sb-item-icon--${icon}`}>{ICONS[icon]}</div>
            {children}
            <div className="sb-item-arrow" aria-hidden="true">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                </svg>
            </div>
        </div>
    );
}

export default SearchInput;