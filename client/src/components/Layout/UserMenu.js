// import React from 'react'
// import { NavLink } from 'react-router-dom'

// const UserMenu = () => {
//     return (
//         <div className="container">
//             <div className="row justify-content-center">
//                 <div className="col-8 col-md-12  text-center">
//                     <h4 className=" fs-3 mt-3" style={{ color: "maroon" }}>Dashboard</h4>
//                     <div className="list-group">
//                         <NavLink to="/dashboard/user/profile" className="list-group-item list-group-item-action">Profile</NavLink>
//                         <NavLink to="/dashboard/user/orders" className="list-group-item list-group-item-action">Orders</NavLink>
//                     </div>
//                 </div>
//             </div>
//         </div>


//     )
// }

// export default UserMenu


// UserMenu.jsx
import { useNavigate, useLocation } from 'react-router-dom';
import './../../StylesDashboardPage/StylesUserDashboard/userMenu.css'
const UserMenu = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const items = [
        {
            label: 'Profile',
            sub: 'Edit personal details',
            path: '/dashboard/user/profile',
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
            ),
        },
        {
            label: 'Orders',
            sub: 'View & update order status',
            path: '/dashboard/user/orders',
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                    <rect x="9" y="3" width="6" height="4" rx="1" />
                    <line x1="9" y1="12" x2="15" y2="12" />
                    <line x1="9" y1="16" x2="13" y2="16" />
                </svg>
            ),
        },
    ];

    return (
        <div className="um-wrap">
            <p className="um-title">Dashboard</p>
            {items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <div
                        key={item.path}
                        className={`um-card${isActive ? ' active' : ''}`}
                        onClick={() => navigate(item.path)}
                    >
                        <div className="um-icon">{item.icon}</div>
                        <div>
                            <div className="um-label">{item.label}</div>
                            <div className="um-sub">{item.sub}</div>
                        </div>
                        <div className="um-arrow">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default UserMenu;