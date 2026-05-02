// import React from 'react'
// import Layout from './../../components/Layout/Layout'
// import AdminMenu from '../../components/Layout/AdminMenu'
// import { useAuth } from '../../context/auth'

// const AdminDashboard = () => {
//     const [auth] = useAuth();
//     return (
//         <Layout>
//             <div className="container-fluid mt-2" style={{ overflowX: 'hidden' }}>
//                 <div className="row">
//                     <div className="col-lg-3 col-md-4"> {/* Adjusted column width for smaller screens */}
//                         <AdminMenu />
//                     </div>
//                     <div className="col-lg-5 col-md-8 mt-sm-2 mt-lg-5" > {/* Adjusted column width for smaller screens */}
//                         <div className="card p-3 m-4" style={{ backgroundColor: "#F2F2F2" }}>
//                             <h4>Admin &nbsp; &nbsp;: <span className='text-primary'>{auth?.user?.name}</span></h4>
//                             <h5>Contact&nbsp;&nbsp;&nbsp;: <span className='text-primary'>{auth?.user?.phone}</span></h5>
//                             <h5>Email&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <span className='text-primary'>{auth?.user?.email}</span></h5>

//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </Layout>

//     )
// }

// export default AdminDashboard

import React from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from './../../components/Layout/Layout'
import { useAuth } from '../../context/auth'
import './../../StylesDashboardPage/AdminDashboard.css'
const AdminDashboard = () => {
    const [auth] = useAuth();
    const navigate = useNavigate();

    return (
        <Layout title={"Admin Dashboard — TechVault"}>
            <div className="ad-page">

                {/* ── Hero Banner ── */}
                <section className="ad-hero">
                    <div className="ad-hero__content">
                        <span className="ad-hero__tag">Admin Panel</span>
                        <h1 className="ad-hero__title">
                            Welcome, <em>{auth?.user?.name}</em>
                        </h1>
                        <p className="ad-hero__sub">
                            Manage your store — products, orders, categories &amp; users.
                        </p>
                    </div>
                    <div className="ad-hero__orb" />
                </section>

                {/* ── Body ── */}
                <div className="ad-body">

                    {/* ── Main Content ── */}
                    <main className="ad-main">

                        {/* ── Profile Strip ── */}
                        <div className="ad-profile">
                            <div className="ad-profile__left">
                                <div className="ad-avatar">
                                    {auth?.user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="ad-profile__meta">
                                    <span className="ad-profile__role">Administrator</span>
                                    <h3 className="ad-profile__name">{auth?.user?.name}</h3>
                                </div>
                            </div>

                            <div className="ad-profile__divider" />

                            {/* Inline fields */}
                            <div className="ad-profile__fields">

                                <div className="ad-pfield">
                                    <span className="ad-pfield__label">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                        Full Name
                                    </span>
                                    <span className="ad-pfield__value">{auth?.user?.name}</span>
                                </div>

                                <div className="ad-pfield__sep" />

                                <div className="ad-pfield">
                                    <span className="ad-pfield__label">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.8 19.79 19.79 0 0 1 1.61 5.2 2 2 0 0 1 3.6 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.6a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 18z" />
                                        </svg>
                                        Phone
                                    </span>
                                    <span className="ad-pfield__value">
                                        {auth?.user?.phone || <span className="ad-pfield__empty">Not provided</span>}
                                    </span>
                                </div>

                                <div className="ad-pfield__sep" />

                                <div className="ad-pfield">
                                    <span className="ad-pfield__label">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                            <polyline points="22,6 12,13 2,6" />
                                        </svg>
                                        Email Address
                                    </span>
                                    <span className="ad-pfield__value">{auth?.user?.email}</span>
                                </div>

                                <div className="ad-pfield__sep" />

                                <div className="ad-pfield">
                                    <span className="ad-pfield__label">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                        </svg>
                                        Role
                                    </span>
                                    <span className="ad-pfield__value ad-pfield__value--badge">
                                        Administrator
                                    </span>
                                </div>

                            </div>
                        </div>

                        {/* ── Quick Action Grid ── */}
                        <div className="ad-actions">

                            {/* 1 — Create Category */}
                            <div
                                className="ad-action-card ad-action-card--category"
                                onClick={() => navigate('/dashboard/admin/create-category')}
                            >
                                <div className="ad-action-card__glow" />
                                <div className="ad-action-card__icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                        <path d="M2 17l10 5 10-5" />
                                        <path d="M2 12l10 5 10-5" />
                                    </svg>
                                </div>
                                <div className="ad-action-card__body">
                                    <p className="ad-action-card__title">Create Category</p>
                                    <p className="ad-action-card__desc">Add new product categories to organise your store</p>
                                </div>
                                <div className="ad-action-card__arrow">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </div>
                            </div>

                            {/* 2 — Create Product */}
                            <div
                                className="ad-action-card ad-action-card--create"
                                onClick={() => navigate('/dashboard/admin/create-product')}
                            >
                                <div className="ad-action-card__glow" />
                                <div className="ad-action-card__icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="16" />
                                        <line x1="8" y1="12" x2="16" y2="12" />
                                    </svg>
                                </div>
                                <div className="ad-action-card__body">
                                    <p className="ad-action-card__title">Create Product</p>
                                    <p className="ad-action-card__desc">List a brand-new product in your store</p>
                                </div>
                                <div className="ad-action-card__arrow">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </div>
                            </div>

                            {/* 3 — Products */}
                            <div
                                className="ad-action-card ad-action-card--products"
                                onClick={() => navigate('/dashboard/admin/products')}
                            >
                                <div className="ad-action-card__glow" />
                                <div className="ad-action-card__icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                        <line x1="3" y1="6" x2="21" y2="6" />
                                        <path d="M16 10a4 4 0 0 1-8 0" />
                                    </svg>
                                </div>
                                <div className="ad-action-card__body">
                                    <p className="ad-action-card__title">Products</p>
                                    <p className="ad-action-card__desc">Browse, edit &amp; remove existing listings</p>
                                </div>
                                <div className="ad-action-card__arrow">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </div>
                            </div>

                            {/* 4 — Orders */}
                            <div
                                className="ad-action-card ad-action-card--orders"
                                onClick={() => navigate('/dashboard/admin/orders')}
                            >
                                <div className="ad-action-card__glow" />
                                <div className="ad-action-card__icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                                        <line x1="8" y1="6" x2="21" y2="6" />
                                        <line x1="8" y1="12" x2="21" y2="12" />
                                        <line x1="8" y1="18" x2="21" y2="18" />
                                        <line x1="3" y1="6" x2="3.01" y2="6" />
                                        <line x1="3" y1="12" x2="3.01" y2="12" />
                                        <line x1="3" y1="18" x2="3.01" y2="18" />
                                    </svg>
                                </div>
                                <div className="ad-action-card__body">
                                    <p className="ad-action-card__title">Orders</p>
                                    <p className="ad-action-card__desc">View &amp; update order status in real time</p>
                                </div>
                                <div className="ad-action-card__arrow">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </div>
                            </div>

                            {/* 5 — Users */}
                            <div
                                className="ad-action-card ad-action-card--users"
                                onClick={() => navigate('/dashboard/admin/users')}
                            >
                                <div className="ad-action-card__glow" />
                                <div className="ad-action-card__icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                </div>
                                <div className="ad-action-card__body">
                                    <p className="ad-action-card__title">Users</p>
                                    <p className="ad-action-card__desc">View &amp; manage all registered users</p>
                                </div>
                                <div className="ad-action-card__arrow">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </div>
                            </div>

                        </div>

                    </main>
                </div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;