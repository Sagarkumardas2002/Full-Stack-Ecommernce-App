import React from 'react';
import Layout from '../../components/Layout/Layout';
import UserMenu from '../../components/Layout/UserMenu';
import { useAuth } from '../../context/auth';

const Dashboard = () => {
    const [auth] = useAuth();

    const fields = [
        {
            label: 'Full Name',
            value: auth?.user?.name,
            icon: (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
            ),
        },
        {
            label: 'Email Address',
            value: auth?.user?.email,
            icon: (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <polyline points="2,4 12,13 22,4" />
                </svg>
            ),
        },
        {
            label: 'Delivery Address',
            value: auth?.user?.address || 'No address saved yet',
            icon: (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                </svg>
            ),
            muted: !auth?.user?.address,
        },
    ];

    return (
        <Layout title="Dashboard">
            <div className="db-page">

                {/* ── Hero banner — matches cart hero ── */}
                <div className="db-hero">
                    <div className="db-hero-left">
                        <div className="db-avatar">
                            {auth?.user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="db-hero-title">
                                Welcome back,{' '}
                                <span className="db-hero-accent">
                                    {auth?.user?.name?.split(' ')[0]}
                                </span>
                            </div>
                            <div className="db-hero-sub">Manage your profile and orders</div>
                        </div>
                    </div>
                    <div className="db-hero-pill">My Dashboard</div>
                </div>

                {/* ── Body ── */}
                <div className="db-body">

                    {/* LEFT — nav menu */}
                    <div className="db-left">
                        <UserMenu />
                    </div>

                    {/* RIGHT — profile card */}
                    <div className="db-card">

                        {/* Card header — matches summary header */}
                        <div className="db-card-header">
                            <div className="db-card-header-icon">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>
                            <div>
                                <div className="db-card-title">Account Details</div>
                                <div className="db-card-sub">Your personal information</div>
                            </div>
                        </div>

                        {/* Fields */}
                        <div className="db-fields">
                            {fields.map((f) => (
                                <div key={f.label} className="db-field">
                                    <div className="db-field-icon">{f.icon}</div>
                                    <div className="db-field-body">
                                        <div className="db-field-label">{f.label}</div>
                                        <div className={`db-field-value${f.muted ? ' db-field-value--muted' : ''}`}>
                                            {f.value}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="db-card-footer">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#c9a84c' }}>
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                            Your information is encrypted and secure
                        </div>

                    </div>
                </div>

                <style>{`

                    /* ── Page ── */
                    .db-page {
                        min-height: 100vh;
                        background: #f5f3ef;
                        font-family: "DM Sans", sans-serif;
                        color: #0b1120;
                    }

                    /* ── Hero — matches .tv-cart__hero ── */
                    .db-hero {
                        background: #fff;
                        border-bottom: 1px solid #e8e5df;
                        padding: 24px 40px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 16px;
                        flex-wrap: wrap;
                    }
                    .db-hero-left {
                        display: flex;
                        align-items: center;
                        gap: 16px;
                    }
                    .db-avatar {
                        width: 48px;
                        height: 48px;
                        border-radius: 50%;
                        background: linear-gradient(135deg, #c9a84c, #e8d48b);
                        color: #0b1120;
                        font-size: 20px;
                        font-weight: 700;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-family: "Playfair Display", serif;
                        flex-shrink: 0;
                        border: 2px solid rgba(201,168,76,0.3);
                    }
                    .db-hero-title {
                        font-family: "Playfair Display", serif;
                        font-size: 22px;
                        font-weight: 600;
                        color: #0b1120;
                        letter-spacing: -0.3px;
                    }
                    .db-hero-accent {
                        color: #c9a84c;
                    }
                    .db-hero-sub {
                        font-size: 13px;
                        color: #94a3b8;
                        margin-top: 2px;
                    }
                    .db-hero-pill {
                        display: inline-flex;
                        align-items: center;
                        padding: 7px 18px;
                        background: #0b1120;
                        border-radius: 999px;
                        font-size: 13px;
                        font-weight: 600;
                        color: #fff;
                    }

                    /* ── Body layout ── */
                    .db-body {
                        display: grid;
                        grid-template-columns: 260px 1fr;
                        gap: 20px;
                        max-width: 1100px;
                        margin: 0 auto;
                        padding: 28px 28px 80px;
                        align-items: start;
                    }

                    /* ── Card — matches .tv-cart__summary ── */
                    .db-card {
                        background: #ffffff;
                        border: 1px solid #e8e5df;
                        border-radius: 14px;
                        overflow: hidden;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.07);
                    }

                    /* Card header — matches .tv-cart__summary-header */
                    .db-card-header {
                        background: #faf9f6;
                        border-bottom: 2px solid #c9a84c;
                        padding: 18px 24px;
                        display: flex;
                        align-items: center;
                        gap: 12px;
                    }
                    .db-card-header-icon {
                        width: 34px;
                        height: 34px;
                        border-radius: 8px;
                        background: rgba(201,168,76,0.1);
                        border: 1px solid rgba(201,168,76,0.25);
                        color: #c9a84c;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-shrink: 0;
                    }
                    .db-card-title {
                        font-family: "Playfair Display", serif;
                        font-size: 16px;
                        font-weight: 600;
                        color: #0b1120;
                        margin-bottom: 1px;
                    }
                    .db-card-sub {
                        font-size: 11.5px;
                        color: #94a3b8;
                    }

                    /* Fields */
                    .db-fields {
                        display: flex;
                        flex-direction: column;
                    }
                    .db-field {
                        display: flex;
                        align-items: flex-start;
                        gap: 14px;
                        padding: 20px 24px;
                        border-bottom: 1px solid #f1f0ec;
                        transition: background 0.15s ease;
                    }
                    .db-field:last-child {
                        border-bottom: none;
                    }
                    .db-field:hover {
                        background: #faf9f6;
                    }
                    .db-field-icon {
                        width: 34px;
                        height: 34px;
                        border-radius: 8px;
                        background: rgba(201,168,76,0.08);
                        border: 1px solid rgba(201,168,76,0.2);
                        color: #c9a84c;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-shrink: 0;
                        margin-top: 1px;
                    }
                    .db-field-body {
                        display: flex;
                        flex-direction: column;
                        gap: 4px;
                    }
                    .db-field-label {
                        font-size: 10px;
                        font-weight: 700;
                        color: #c9a84c;
                        text-transform: uppercase;
                        letter-spacing: 1.4px;
                    }
                    .db-field-value {
                        font-size: 15px;
                        font-weight: 500;
                        color: #0b1120;
                        line-height: 1.4;
                    }
                    .db-field-value--muted {
                        color: #9ca3af;
                        font-style: italic;
                        font-size: 14px;
                    }

                    /* Footer */
                    .db-card-footer {
                        display: flex;
                        align-items: center;
                        gap: 7px;
                        padding: 14px 24px;
                        font-size: 11.5px;
                        color: #9ca3af;
                        border-top: 1px solid #f1f0ec;
                        background: #faf9f6;
                        font-weight: 500;
                    }

                    /* ── Responsive ── */
                    @media (max-width: 860px) {
                        .db-body {
                            grid-template-columns: 1fr;
                            padding: 20px 16px 60px;
                        }
                        .db-hero {
                            padding: 20px 20px;
                        }
                        .db-hero-title {
                            font-size: 18px;
                        }
                        .db-hero-pill {
                            display: none;
                        }
                    }
                `}</style>
            </div>
        </Layout>
    );
};

export default Dashboard;