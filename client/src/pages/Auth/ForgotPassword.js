

import React, { useState } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "../../config/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";

/* ─── Password strength logic (same as Register) ── */
const rules = [
    { id: "len", test: (p) => p.length >= 8, text: "At least 8 characters" },
    { id: "upper", test: (p) => /[A-Z]/.test(p), text: "One uppercase letter" },
    { id: "num", test: (p) => /[0-9]/.test(p), text: "One number" },
    { id: "symbol", test: (p) => /[^A-Za-z0-9]/.test(p), text: "One special character" },
];

const getStrength = (pwd) => {
    if (!pwd) return { score: 0, label: "", cls: "" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    const map = [
        { label: "Too weak", cls: "weak" },
        { label: "Weak", cls: "weak" },
        { label: "Fair", cls: "fair" },
        { label: "Good", cls: "good" },
        { label: "Strong", cls: "strong" },
    ];
    return { score, ...map[score] };
};

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [answer, setAnswer] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const strength = getStrength(newPassword);
    const allRulesPass = rules.every(r => r.test(newPassword));

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!allRulesPass) {
            toast.error("Please choose a stronger password");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post("/api/v1/auth/forgot-password", {
                email,
                newPassword,
                answer,
            });
            if (res && res.data.success) {
                toast.success(res.data.message);
                navigate("/login");
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Reset Password — TechVault">
            <div className="auth-page">
                <div className="auth-card">

                    {/* ── Header ── */}
                    <div className="auth-card__header">
                        <div className="auth-card__tag">Account Recovery</div>
                        <h1 className="auth-card__title">Reset <em>Password</em></h1>
                        <p className="auth-card__sub">Enter your email and secret word to reset</p>
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

                            {/* Secret word */}
                            <div className="auth-field">
                                <label className="auth-field__label">Secret Word</label>
                                <div className="auth-field__input-wrap">
                                    <span className="auth-field__icon">🔑</span>
                                    <input
                                        type="text"
                                        className="auth-field__input"
                                        placeholder="Your secret recovery word"
                                        value={answer}
                                        onChange={(e) => setAnswer(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* New password + strength */}
                            <div className="auth-field">
                                <label className="auth-field__label">New Password</label>
                                <div className="auth-field__input-wrap">
                                    <span className="auth-field__icon">🔒</span>
                                    <input
                                        type={showPass ? "text" : "password"}
                                        className={`auth-field__input${newPassword
                                            ? allRulesPass ? " success" : " error"
                                            : ""
                                            }`}
                                        placeholder="Create a strong new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
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

                                {/* Strength bars */}
                                {newPassword && (
                                    <div className="auth-strength">
                                        <div className="auth-strength__bars">
                                            {[1, 2, 3, 4].map(i => (
                                                <div
                                                    key={i}
                                                    className={`auth-strength__bar${i <= strength.score
                                                        ? ` active-${strength.cls}`
                                                        : ""
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <div className={`auth-strength__label ${strength.cls}`}>
                                            <span className="auth-rule__dot" />
                                            {strength.label}
                                        </div>
                                    </div>
                                )}

                                {/* Rules checklist */}
                                {newPassword && (
                                    <div className="auth-rules">
                                        {rules.map(r => (
                                            <div
                                                key={r.id}
                                                className={`auth-rule ${r.test(newPassword) ? "pass" : "fail"}`}
                                            >
                                                <span className="auth-rule__dot" />
                                                {r.test(newPassword) ? "✓" : "✗"} {r.text}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <hr className="auth-divider" />

                            <button
                                type="submit"
                                className="auth-btn-primary"
                                disabled={loading || !allRulesPass}
                            >
                                {loading
                                    ? <><span className="auth-spinner" /> Resetting…</>
                                    : "Reset Password →"}
                            </button>

                            <div className="auth-footer">
                                Remember your password?{" "}
                                <button type="button" onClick={() => navigate("/login")}>
                                    Sign in
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ForgotPassword;