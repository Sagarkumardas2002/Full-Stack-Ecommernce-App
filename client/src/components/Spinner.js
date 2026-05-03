import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Spinner = ({ path = "login" }) => {
    const [count, setCount] = useState(3);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((prev) => prev - 1);
        }, 1000);
        if (count === 0) navigate(`/${path}`, { state: location.pathname });
        return () => clearInterval(interval);
    }, [count, navigate, location, path]);

    return (
        <div style={styles.page}>

            <div style={styles.card}>

                {/* Ring */}
                <div style={styles.ringWrap}>
                    <svg width="88" height="88" viewBox="0 0 90 90">
                        <circle cx="45" cy="45" r="38" fill="none"
                            stroke="#e8e5df" strokeWidth="5" />
                        <circle cx="45" cy="45" r="38" fill="none"
                            stroke="#c9a84c" strokeWidth="5"
                            strokeLinecap="round"
                            strokeDasharray="80 160"
                            style={{ animation: 'sp-spin 0.9s linear infinite', transformOrigin: '45px 45px' }}
                        />
                    </svg>
                    <div style={styles.countInner}>{count}</div>
                </div>

                {/* Text */}
                <div style={styles.title}>Redirecting you shortly</div>
                <div style={styles.sub}>
                    Taking you there in{' '}
                    <span style={styles.highlight}>
                        {count} second{count !== 1 ? 's' : ''}
                    </span>
                </div>

                {/* Progress dots */}
                <div style={styles.dots}>
                    {[0, 1, 2].map(i => (
                        <div key={i} style={{
                            ...styles.dot,
                            background: i >= count ? '#c9a84c' : '#e8e5df',
                            border: `1px solid ${i >= count ? '#c9a84c' : '#d4cfc6'}`,
                            transform: i >= count ? 'scale(1.25)' : 'scale(1)',
                        }} />
                    ))}
                </div>

            </div>

            <style>{`
                @keyframes sp-spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

const styles = {
    page: {
        minHeight: '100vh',
        background: '#f5f3ef',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"DM Sans", sans-serif',
        padding: '24px',
    },
    card: {
        background: '#ffffff',
        border: '1px solid #e8e5df',
        borderRadius: '14px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
        padding: '48px 56px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        minWidth: '320px',
    },
    ringWrap: {
        position: 'relative',
        width: '90px',
        height: '90px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '4px',
    },
    countInner: {
        position: 'absolute',
        fontSize: '28px',
        fontWeight: '700',
        color: '#0b1120',
        fontFamily: '"Playfair Display", serif',
        lineHeight: 1,
    },
    title: {
        fontSize: '20px',
        fontWeight: '600',
        color: '#0b1120',
        fontFamily: '"Playfair Display", serif',
        letterSpacing: '-0.3px',
    },
    sub: {
        fontSize: '13.5px',
        color: '#6b7280',
    },
    highlight: {
        color: '#c9a84c',
        fontWeight: '600',
    },
    dots: {
        display: 'flex',
        gap: '8px',
        marginTop: '8px',
    },
    dot: {
        width: '9px',
        height: '9px',
        borderRadius: '50%',
        transition: 'all 0.4s ease',
    },
};

export default Spinner;