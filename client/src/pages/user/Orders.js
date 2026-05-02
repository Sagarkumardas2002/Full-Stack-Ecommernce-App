// import React, { useState, useEffect } from 'react'
// import Layout from './../../components/Layout/Layout'
// import UserMenu from '../../components/Layout/UserMenu'
// import axios from 'axios'
// import { useAuth } from '../../context/auth'
// import moment from "moment";

// const Orders = () => {
//     const [orders, setOrders] = useState([]);
//     const [auth, setAuth] = useAuth();
//     const getOrders = async () => {
//         try {
//             const { data } = await axios.get("/api/v1/auth/orders");
//             setOrders(data);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     useEffect(() => {
//         if (auth?.token) getOrders();
//     }, [auth?.token]);



//     return (
//         // duplicate
//         <Layout title={"Sagar's Ecom-Your Orders"}>
//             <div className="container-fluid p-3 dashboard">
//                 <div className="row">
//                     <div className="col-lg-3 mb-3 mb-sm-0 mb-md-0 mb-lg-3">
//                         <UserMenu />
//                     </div>
//                     <div className="col-lg-8 ">
//                         <h1 className="text-center mb-4  mt-sm-6">All Orders</h1>
//                         {orders?.map((o, i) => {

//                             return (
//                                 <div className="border shadow p-2 mb-3 mt-2" style={{ backgroundColor: 'orange', borderRadius: "4px" }}>
//                                     <div className="table-responsive">
//                                         <table className="table ">
//                                             <thead>
//                                                 <tr >
//                                                     <th style={{ marginLeft: "-13px" }} scope="col">Status</th>
//                                                     <th scope="col">Buyer</th>
//                                                     <th scope="col">Date</th>
//                                                     <th scope="col">Payment</th>

//                                                 </tr>
//                                             </thead>
//                                             <tbody>
//                                                 <tr>
//                                                     <td>{o?.status}</td>
//                                                     <td>{o?.buyer?.name}</td>
//                                                     <td>{moment(o?.createdAt).format('DD/MM/YYYY')}</td>
//                                                     <td>{o?.payment.success ? "Success" : "Failed"}</td>

//                                                 </tr>
//                                             </tbody>
//                                         </table>
//                                     </div>
//                                     <div className="container  auto">
//                                         {o?.products?.map((p, i) => (

//                                             <div className="row mb-2 p-2 card flex-row" key={p._id}>
//                                                 <div className="col-12 col-md-4 ">
//                                                     <img
//                                                         src={`/api/v1/product/product-photo/${p._id}`}
//                                                         className="mb-2 mt-2 card-img-top"
//                                                         alt={p.name}
//                                                         style={{ border: "1px solid gray", borderRadius: "4px", width: "100%", height: "auto" }}
//                                                         onMouseOver={(e) => e.target.style.transform = 'scale(1.04)'}
//                                                         onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
//                                                     />
//                                                 </div>
//                                                 <div className='col-12 col-md-8'>
//                                                     <div className="mt-3">
//                                                         <p>{p.name}</p>
//                                                         <p>{p.description.substring(0, 60)}</p>

//                                                         <p className="quantity" style={{ fontSize: window.innerWidth < 768 ? "14px" : "inherit" }}>
//                                                             Quantity: {p.quantity}
//                                                         </p>
//                                                         <h5 className='text-danger' style={{ fontWeight: "bold" }}>Price : ₹ {p.price}</h5>
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                         ))}
//                                     </div>

//                                 </div>
//                             );
//                         })}
//                     </div>
//                 </div>
//             </div>
//         </Layout>

//     );
// }

// export default Orders


import React, { useState, useEffect } from 'react'
import Layout from './../../components/Layout/Layout'
import { useAuth } from '../../context/auth'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'
import './../../StylesDashboardPage/StylesUserDashboard/Order.css'

const statusClass = (status = "") => {
    const s = status.toLowerCase();
    if (s.includes("process")) return "or-status--processing";
    if (s.includes("ship")) return "or-status--shipped";
    if (s.includes("deliver")) return "or-status--delivered";
    if (s.includes("cancel")) return "or-status--cancelled";
    return "or-status--default";
};

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [auth] = useAuth();
    const navigate = useNavigate();

    const getOrders = async () => {
        try {
            const { data } = await axios.get("/api/v1/auth/orders");
            setOrders(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (auth?.token) getOrders();
    }, [auth?.token]);

    return (
        <Layout title={"My Orders — TechVault"}>
            <div className="or-page">

                {/* ── Hero ── */}
                <section className="or-hero">
                    <div className="or-hero__content">
                        <span className="or-hero__tag">Account</span>
                        <h1 className="or-hero__title">
                            My <em>Orders</em>
                        </h1>
                        <p className="or-hero__sub">
                            View and track all your purchases in one place.
                        </p>
                    </div>
                    <div className="or-hero__badge">
                        <div className="or-hero__badge-num">{orders.length}</div>
                        <div className="or-hero__badge-label">Total Orders</div>
                    </div>
                </section>

                {/* ── Body ── */}
                <div className="or-body">

                    {/* Sidebar */}
                    <aside className="or-sidebar">
                        <div className="um-wrap">
                            <p className="um-title">Dashboard</p>

                            <div
                                className="um-card"
                                onClick={() => navigate('/dashboard/user/profile')}
                            >
                                <div className="um-icon">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="um-label">Profile</div>
                                    <div className="um-sub">Edit personal details</div>
                                </div>
                                <svg className="um-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </div>

                            <div className="um-card um-card--active">
                                <div className="um-icon">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                                        <rect x="9" y="3" width="6" height="4" rx="1" />
                                        <line x1="9" y1="12" x2="15" y2="12" />
                                        <line x1="9" y1="16" x2="13" y2="16" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="um-label">Orders</div>
                                    <div className="um-sub">View & update order status</div>
                                </div>
                                <svg className="um-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </div>
                        </div>
                    </aside>

                    {/* Main */}
                    <main className="or-main">

                        {/* Section header */}
                        <div className="or-section-header">
                            <h2 className="or-section-title">Order History</h2>
                            {orders.length > 0 && (
                                <span className="or-section-count">{orders.length} orders</span>
                            )}
                        </div>

                        {/* Empty state */}
                        {orders.length === 0 && (
                            <div className="or-empty">
                                <div className="or-empty__icon">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                                        <rect x="9" y="3" width="6" height="4" rx="1" />
                                        <line x1="9" y1="12" x2="15" y2="12" />
                                        <line x1="9" y1="16" x2="13" y2="16" />
                                    </svg>
                                </div>
                                <h3 className="or-empty__title">No orders yet</h3>
                                <p className="or-empty__sub">Your completed purchases will appear here.</p>
                            </div>
                        )}

                        {/* Order cards */}
                        {orders.map((o, i) => (
                            <div className="or-card" key={o._id || i}>

                                {/* Meta bar */}
                                <div className="or-meta">
                                    <div className="or-meta__item">
                                        <span className="or-meta__label">Order #</span>
                                        <span className="or-meta__value">
                                            {o._id ? `…${o._id.slice(-8).toUpperCase()}` : `—`}
                                        </span>
                                    </div>

                                    <div className="or-meta__item">
                                        <span className="or-meta__label">Buyer</span>
                                        <span className="or-meta__value">{o?.buyer?.name || "—"}</span>
                                    </div>

                                    <div className="or-meta__item">
                                        <span className="or-meta__label">Date</span>
                                        <span className="or-meta__value">
                                            {moment(o?.createdAt).format('DD MMM YYYY')}
                                        </span>
                                    </div>

                                    <div className="or-meta__item">
                                        <span className="or-meta__label">Payment</span>
                                        <span className={`or-payment ${o?.payment?.success ? 'or-payment--success' : 'or-payment--failed'}`}>
                                            {o?.payment?.success ? (
                                                <>
                                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                    Paid
                                                </>
                                            ) : (
                                                <>
                                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                                    </svg>
                                                    Failed
                                                </>
                                            )}
                                        </span>
                                    </div>

                                    {/* Status — pushed to right */}
                                    <div className="or-meta__item">
                                        <span className="or-meta__label">Status</span>
                                        <span className={`or-status ${statusClass(o?.status)}`}>
                                            {o?.status || "Pending"}
                                        </span>
                                    </div>
                                </div>

                                {/* Products */}
                                <div className="or-products">
                                    {o?.products?.map((p) => (
                                        <div className="or-product" key={p._id}>
                                            <img
                                                src={`/api/v1/product/product-photo/${p._id}`}
                                                className="or-product__img"
                                                alt={p.name}
                                            />
                                            <div className="or-product__info">
                                                <p className="or-product__name">{p.name}</p>
                                                <p className="or-product__desc">
                                                    {p.description?.substring(0, 80)}{p.description?.length > 80 ? '…' : ''}
                                                </p>
                                                <span className="or-product__qty">Qty: {p.quantity ?? 1}</span>
                                            </div>
                                            <div className="or-product__price">₹{p.price?.toLocaleString('en-IN')}</div>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        ))}
                    </main>
                </div>
            </div>
        </Layout>
    );
};

export default Orders;