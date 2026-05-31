

// export default SearchInput
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSearch } from '../../context/ssearch';   // ← same context Search.js reads
import './../../StylePages/SearchInput.css';

const SearchInput = () => {
    const [values, setValues] = useSearch();           // { keyword: '', results: [] }
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();

        const trimmed = values.keyword.trim();
        if (!trimmed) return;

        try {
            setLoading(true);
            const { data } = await axios.get(
                `https://full-stack-ecommernce-app-backend.onrender.com/api/v1/product/search/${encodeURIComponent(trimmed)}`
            );

            if (data?.success) {
                // Store results in context — Search.js will pick them up via useSearch()
                setValues({ ...values, results: data.results });
                navigate('/search');
            } else {
                toast.error(data?.message || 'Search failed');
            }
        } catch (error) {
            console.error('Search error:', error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="tv-searchbar" onSubmit={handleSearch} role="search">
            <input
                type="search"
                className="tv-searchbar__input"
                placeholder="Search the latest products here…"
                value={values.keyword}
                onChange={(e) => setValues({ ...values, keyword: e.target.value })}
                aria-label="Search products"
                autoComplete="off"
                disabled={loading}
            />
            <button
                type="submit"
                className={`tv-searchbar__btn${loading ? ' tv-searchbar__btn--loading' : ''}`}
                aria-label="Search"
                disabled={loading}
            >
                {loading ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5"
                        style={{ animation: 'tv-spin 0.7s linear infinite' }}>
                        <circle cx="12" cy="12" r="9" strokeOpacity="0.25" />
                        <path d="M12 3a9 9 0 0 1 9 9" strokeLinecap="round" />
                    </svg>
                ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                        <circle cx="11" cy="11" r="7" />
                        <line x1="16.5" y1="16.5" x2="22" y2="22" />
                    </svg>
                )}
            </button>
        </form>
    );
};

export default SearchInput;