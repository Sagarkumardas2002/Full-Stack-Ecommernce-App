import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu'
import { useAuth } from '../../context/auth'
import toast from 'react-hot-toast'
import axios from 'axios'
import './../../StylesDashboardPage/StylesUserDashboard/Profile.css'

const Profile = () => {
    const [auth, setAuth] = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const { email, name, phone, address } = auth?.user || {};
        setName(name || "");
        setPhone(phone || "");
        setEmail(email || "");
        setAddress(address || "");
    }, [auth?.user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await axios.put('https://full-stack-ecommernce-app-backend.onrender.com/api/v1/auth/profile', {
                name, email, password, phone, address,
            });
            if (data?.error) {
                toast.error(data?.error);
            } else {
                setAuth({ ...auth, user: data?.updatedUser });
                let ls = JSON.parse(localStorage.getItem("auth"));
                ls.user = data.updatedUser;
                localStorage.setItem('auth', JSON.stringify(ls));
                toast.success("Profile updated successfully");
                setPassword("");
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title={"My Profile — TechVault"}>
            <div className="pf-page">

                {/* ── Hero ── */}
                <section className="pf-hero">
                    <div className="pf-hero__content">
                        <span className="pf-hero__tag">Account</span>
                        {/* FIX: h1 is correct here as page title */}
                        <h1 className="pf-hero__title">My <em>Profile</em></h1>
                    </div>
                </section>

                <div className="pf-layout">
                    <aside className="pf-sidebar">
                        <UserMenu />
                    </aside>

                    <main className="pf-main">
                        <div className="pf-card">
                            <div className="pf-card__header">
                                <div className="pf-card__avatar">
                                    {auth?.user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="pf-card__role">User Profile</p>
                                    {/* FIX: changed h3 to h2 — page has h1 above, h3 would skip h2 */}
                                    <h2 className="pf-card__name">{auth?.user?.name}</h2>
                                </div>
                            </div>

                            <div className="pf-card__divider" />

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="pf-form">

                                <div className="pf-form__row">
                                    {/* Name — FIX: htmlFor links label to input */}
                                    <div className="pf-field">
                                        <label htmlFor="pf-name" className="pf-field__label">
                                            <span className="pf-field__icon" aria-hidden="true">
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                    <circle cx="12" cy="7" r="4" />
                                                </svg>
                                            </span>
                                            Full Name
                                        </label>
                                        <input
                                            id="pf-name"
                                            type="text"
                                            className="pf-input"
                                            placeholder="Enter your name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            autoComplete="name"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="pf-field">
                                        <label htmlFor="pf-email" className="pf-field__label">
                                            <span className="pf-field__icon" aria-hidden="true">
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                                    <polyline points="22,6 12,13 2,6" />
                                                </svg>
                                            </span>
                                            Email Address
                                            <span className="pf-field__badge">Cannot change</span>
                                        </label>
                                        <input
                                            id="pf-email"
                                            type="email"
                                            className="pf-input pf-input--disabled"
                                            placeholder="Email"
                                            value={email}
                                            disabled
                                            autoComplete="email"
                                        />
                                    </div>
                                </div>

                                <div className="pf-form__row">
                                    {/* Password */}
                                    <div className="pf-field">
                                        <label htmlFor="pf-password" className="pf-field__label">
                                            <span className="pf-field__icon" aria-hidden="true">
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                                </svg>
                                            </span>
                                            New Password
                                            <span className="pf-field__badge pf-field__badge--opt">Optional</span>
                                        </label>
                                        <input
                                            id="pf-password"
                                            type="password"
                                            className="pf-input"
                                            placeholder="Leave blank to keep current"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            autoComplete="new-password"
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div className="pf-field">
                                        <label htmlFor="pf-phone" className="pf-field__label">
                                            <span className="pf-field__icon" aria-hidden="true">
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.8 19.79 19.79 0 0 1 1.61 5.2 2 2 0 0 1 3.6 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.6a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 18z" />
                                                </svg>
                                            </span>
                                            Phone Number
                                        </label>
                                        <input
                                            id="pf-phone"
                                            type="tel"
                                            className="pf-input"
                                            placeholder="Enter your phone number"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            autoComplete="tel"
                                        />
                                    </div>
                                </div>

                                {/* Address — full width */}
                                <div className="pf-field pf-field--full">
                                    <label htmlFor="pf-address" className="pf-field__label">
                                        <span className="pf-field__icon" aria-hidden="true">
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                                <circle cx="12" cy="10" r="3" />
                                            </svg>
                                        </span>
                                        Delivery Address
                                    </label>
                                    <input
                                        id="pf-address"
                                        type="text"
                                        className="pf-input"
                                        placeholder="Enter your full delivery address"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        autoComplete="street-address"
                                    />
                                </div>

                                <div className="pf-card__divider" />

                                {/* Submit */}
                                <div className="pf-form__footer">
                                    <p className="pf-form__hint">
                                        * Only fill in password if you want to change it
                                    </p>
                                    <button
                                        type="submit"
                                        className="pf-submit-btn"
                                        disabled={loading}
                                        aria-busy={loading}
                                    >
                                        {loading ? (
                                            <><span className="pf-spinner" aria-hidden="true" /> Saving…</>
                                        ) : (
                                            <>
                                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>

                            </form>
                        </div>
                    </main>
                </div>
            </div>
        </Layout>
    );
};

export default Profile;