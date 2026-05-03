import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import AdminMenu from '../../components/Layout/AdminMenu';
import axios from 'axios';
import toast from 'react-hot-toast';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAllUsers = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(
                'https://full-stack-ecommernce-app-backend.onrender.com/api/v1/auth/all-users'
            );
            if (data?.success) {
                setUsers(data.users);
            } else {
                toast.error('Failed to fetch users');
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    const getRoleBadge = (role) => role === 1 ? 'Admin' : 'User';

    return (
        <Layout title="Dashboard - All Users">
            <div className="au-page">

                {/* ── Hero ── */}
                <div className="au-hero">
                    <div>
                        <div className="au-hero-title">All Users</div>
                        <div className="au-hero-sub">Manage registered accounts</div>
                    </div>
                    <div className="au-hero-pill">
                        {loading ? '...' : `${users.length} user${users.length !== 1 ? 's' : ''}`}
                    </div>
                </div>

                {/* ── Body ── */}
                <div className="au-body">

                    {/* LEFT — admin menu */}
                    <div className="au-left">
                        <AdminMenu />
                    </div>

                    {/* RIGHT — users table */}
                    <div className="au-right">

                        {/* Card */}
                        <div className="au-card">

                            {/* Card header */}
                            <div className="au-card-header">
                                <div className="au-card-header-icon">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="au-card-title">Registered Users</div>
                                    <div className="au-card-sub">All accounts on the platform</div>
                                </div>
                            </div>

                            {/* Loading skeletons */}
                            {loading ? (
                                <div className="au-skel-wrap">
                                    {[1, 2, 3, 4].map(n => (
                                        <div key={n} className="au-skel-row">
                                            <div className="au-skel au-skel-avatar" />
                                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                                <div className="au-skel" style={{ width: '40%', height: 12 }} />
                                                <div className="au-skel" style={{ width: '60%', height: 10 }} />
                                            </div>
                                            <div className="au-skel" style={{ width: 60, height: 24, borderRadius: 999 }} />
                                        </div>
                                    ))}
                                </div>
                            ) : users.length === 0 ? (
                                <div className="au-empty">
                                    <div className="au-empty-icon">👥</div>
                                    <div className="au-empty-title">No users found</div>
                                    <div className="au-empty-sub">Registered users will appear here</div>
                                </div>
                            ) : (
                                <>
                                    {/* Table header */}
                                    <div className="au-table-head">
                                        <span style={{ flex: '0 0 40px' }}>#</span>
                                        <span style={{ flex: 1 }}>Name</span>
                                        <span style={{ flex: 1 }}>Email</span>
                                        <span style={{ flex: 1 }}>Phone</span>
                                        <span style={{ flex: 1 }}>Address</span>
                                        <span style={{ flex: '0 0 70px', textAlign: 'center' }}>Role</span>
                                    </div>

                                    {/* Rows */}
                                    {users.map((u, i) => (
                                        <div key={u._id} className="au-row">
                                            <span className="au-row-num">{i + 1}</span>

                                            {/* Avatar + name */}
                                            <div className="au-row-name">
                                                <div className="au-mini-avatar">
                                                    {u.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="au-name-text">{u.name}</span>
                                            </div>

                                            <span className="au-row-cell">{u.email}</span>
                                            <span className="au-row-cell">{u.phone || '—'}</span>
                                            <span className="au-row-cell au-addr">{u.address || '—'}</span>

                                            <span style={{ flex: '0 0 70px', textAlign: 'center' }}>
                                                <span className={`au-badge ${u.role === 1 ? 'au-badge--admin' : 'au-badge--user'}`}>
                                                    {getRoleBadge(u.role)}
                                                </span>
                                            </span>
                                        </div>
                                    ))}
                                </>
                            )}

                            {/* Footer */}
                            {!loading && users.length > 0 && (
                                <div className="au-card-footer">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#c9a84c' }}>
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                    Showing {users.length} registered account{users.length !== 1 ? 's' : ''}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <style>{`
                    .au-page {
                        min-height: 100vh;
                        background: #f5f3ef;
                        font-family: "DM Sans", sans-serif;
                        color: #0b1120;
                    }

                    /* ── Hero ── */
                    .au-hero {
                        background: #fff;
                        border-bottom: 1px solid #e8e5df;
                        padding: 24px 40px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 16px;
                        flex-wrap: wrap;
                    }
                    .au-hero-title {
                        font-family: "Playfair Display", serif;
                        font-size: 22px;
                        font-weight: 600;
                        color: #0b1120;
                        letter-spacing: -0.3px;
                    }
                    .au-hero-sub {
                        font-size: 13px;
                        color: #94a3b8;
                        margin-top: 2px;
                    }
                    .au-hero-pill {
                        display: inline-flex;
                        align-items: center;
                        padding: 7px 18px;
                        background: #0b1120;
                        border-radius: 999px;
                        font-size: 13px;
                        font-weight: 600;
                        color: #fff;
                    }

                    /* ── Body ── */
                    .au-body {
                        display: grid;
                        grid-template-columns: 260px 1fr;
                        gap: 20px;
                        max-width: 1300px;
                        margin: 0 auto;
                        padding: 28px 28px 80px;
                        align-items: start;
                    }

                    /* ── Card ── */
                    .au-card {
                        background: #ffffff;
                        border: 1px solid #e8e5df;
                        border-radius: 14px;
                        overflow: hidden;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.07);
                    }
                    .au-card-header {
                        background: #faf9f6;
                        border-bottom: 2px solid #c9a84c;
                        padding: 18px 24px;
                        display: flex;
                        align-items: center;
                        gap: 12px;
                    }
                    .au-card-header-icon {
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
                    .au-card-title {
                        font-family: "Playfair Display", serif;
                        font-size: 16px;
                        font-weight: 600;
                        color: #0b1120;
                        margin-bottom: 1px;
                    }
                    .au-card-sub {
                        font-size: 11.5px;
                        color: #94a3b8;
                    }

                    /* ── Table head ── */
                    .au-table-head {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        padding: 10px 24px;
                        background: #faf9f6;
                        border-bottom: 1px solid #e8e5df;
                        font-size: 10px;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 1.2px;
                        color: #c9a84c;
                    }

                    /* ── Row ── */
                    .au-row {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        padding: 16px 24px;
                        border-bottom: 1px solid #f1f0ec;
                        transition: background 0.15s ease;
                        animation: auSlide 0.25s ease both;
                    }
                    .au-row:last-child { border-bottom: none; }
                    .au-row:hover { background: #faf9f6; }

                    @keyframes auSlide {
                        from { opacity: 0; transform: translateY(6px); }
                        to   { opacity: 1; transform: translateY(0); }
                    }

                    .au-row-num {
                        flex: 0 0 40px;
                        font-size: 12px;
                        font-weight: 700;
                        color: #9ca3af;
                    }
                    .au-row-name {
                        flex: 1;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        min-width: 0;
                    }
                    .au-mini-avatar {
                        width: 32px;
                        height: 32px;
                        border-radius: 50%;
                        background: linear-gradient(135deg, #c9a84c, #e8d48b);
                        color: #0b1120;
                        font-size: 13px;
                        font-weight: 700;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-shrink: 0;
                        font-family: "Playfair Display", serif;
                    }
                    .au-name-text {
                        font-size: 14px;
                        font-weight: 600;
                        color: #0b1120;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .au-row-cell {
                        flex: 1;
                        font-size: 13px;
                        color: #6b7280;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .au-addr {
                        color: #9ca3af;
                        font-size: 12px;
                    }

                    /* ── Badges ── */
                    .au-badge {
                        display: inline-flex;
                        align-items: center;
                        padding: 3px 10px;
                        border-radius: 999px;
                        font-size: 10.5px;
                        font-weight: 700;
                        letter-spacing: 0.3px;
                    }
                    .au-badge--admin {
                        background: rgba(201,168,76,0.12);
                        border: 1px solid rgba(201,168,76,0.3);
                        color: #c9a84c;
                    }
                    .au-badge--user {
                        background: #f1f0ec;
                        border: 1px solid #e8e5df;
                        color: #6b7280;
                    }

                    /* ── Empty ── */
                    .au-empty {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        padding: 60px 24px;
                        gap: 10px;
                        text-align: center;
                    }
                    .au-empty-icon {
                        font-size: 36px;
                        width: 72px;
                        height: 72px;
                        background: #faf9f6;
                        border: 1px solid #e8e5df;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .au-empty-title {
                        font-family: "Playfair Display", serif;
                        font-size: 18px;
                        font-weight: 600;
                        color: #0b1120;
                    }
                    .au-empty-sub {
                        font-size: 13px;
                        color: #9ca3af;
                    }

                    /* ── Skeleton ── */
                    .au-skel-wrap { padding: 8px 0; }
                    .au-skel-row {
                        display: flex;
                        align-items: center;
                        gap: 14px;
                        padding: 16px 24px;
                        border-bottom: 1px solid #f1f0ec;
                    }
                    .au-skel {
                        background: linear-gradient(90deg, #ece9e3 25%, #f5f3ef 50%, #ece9e3 75%);
                        background-size: 600px 100%;
                        animation: shimmer 1.4s infinite linear;
                        border-radius: 6px;
                    }
                    .au-skel-avatar {
                        width: 32px;
                        height: 32px;
                        border-radius: 50%;
                        flex-shrink: 0;
                    }
                    @keyframes shimmer {
                        0%   { background-position: -600px 0; }
                        100% { background-position:  600px 0; }
                    }

                    /* ── Footer ── */
                    .au-card-footer {
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
                    @media (max-width: 900px) {
                        .au-body {
                            grid-template-columns: 1fr;
                            padding: 20px 16px 60px;
                        }
                        .au-hero { padding: 20px; }
                        .au-table-head { display: none; }
                        .au-row {
                            flex-wrap: wrap;
                            gap: 8px;
                        }
                        .au-row-cell { flex: 0 0 calc(50% - 8px); }
                    }
                `}</style>
            </div>
        </Layout>
    );
};

export default Users;