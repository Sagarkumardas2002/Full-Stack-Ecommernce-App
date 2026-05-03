

import React, { useState } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "../../config/axios";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";
import { useAuth } from "../../context/auth";

// Test credentials — change these to a real test account in your DB
const TEST_EMAIL = "SamarRaj32@gmail.com";
const TEST_PASSWORD = "SmartDeveloper@3124";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [auth, setAuth] = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post("/api/v1/auth/login", { email, password });
            if (res && res.data.success) {
                toast.success(res.data.message);
                setAuth({ ...auth, user: res.data.user, token: res.data.token });
                localStorage.setItem("auth", JSON.stringify(res.data));
                navigate(location.state || "/");
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            const msg = error?.response?.data?.message;
            if (msg) {
                toast.error(msg);
            } else {
                toast.error("Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleTestLogin = () => {
        setEmail(TEST_EMAIL);
        setPassword(TEST_PASSWORD);
    };

    return (
        <Layout title="Login — TechVault">
            <div className="auth-page">
                <div className="auth-card">

                    {/* ── Header ── */}
                    <div className="auth-card__header">
                        <div className="auth-card__tag">Welcome Back</div>
                        <h1 className="auth-card__title">Sign in to <em>TechVault</em></h1>
                        <p className="auth-card__sub">Enter your credentials to continue</p>
                    </div>

                    {/* ── Body ── */}
                    <div className="auth-card__body">

                        <form onSubmit={handleSubmit}>

                            {/* Email */}
                            <div className="auth-field">
                                <label className="auth-field__label">Email Address</label>
                                <div className="auth-field__input-wrap">
                                    <span className="auth-field__icon">✉</span>
                                    <input
                                        type="email"
                                        className="auth-field__input"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="auth-field">
                                <label className="auth-field__label">Password</label>
                                <div className="auth-field__input-wrap">
                                    <span className="auth-field__icon">🔒</span>
                                    <input
                                        type={showPass ? "text" : "password"}
                                        className="auth-field__input"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="auth-field__eye"
                                        onClick={() => setShowPass(!showPass)}
                                        tabIndex={-1}
                                    >
                                        {showPass ? "🙈" : "👁"}
                                    </button>
                                </div>
                            </div>

                            <hr className="auth-divider" />

                            {/* Submit */}
                            <button
                                type="submit"
                                className="auth-btn-primary"
                                disabled={loading}
                            >
                                {loading ? <><span className="auth-spinner" /> Login in…</> : "Sign In →"}
                            </button>

                            {/* Test login */}
                            <button
                                type="button"
                                className="auth-btn-ghost"
                                onClick={handleTestLogin}
                                disabled={loading}
                            >
                                🧪 Use Test Account
                            </button>

                            {/* Forgot password */}
                            <div className="auth-footer">
                                <button type="button" onClick={() => navigate("/forgot-password")}>
                                    Forgot password?
                                </button>
                                &nbsp;·&nbsp;
                                Don't have an account?{" "}
                                <button type="button" onClick={() => navigate("/register")}>
                                    Register
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Login;