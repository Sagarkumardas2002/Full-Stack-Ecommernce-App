

// // export default Register
// import React, { useState } from "react";
// import Layout from "../../components/Layout/Layout";
// import axios from "../../config/axios";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import "../../styles/AuthStyles.css";

// /* ─── Password strength logic ──────────────────── */
// const getStrength = (pwd) => {
//     if (!pwd) return { score: 0, label: "", cls: "" };
//     let score = 0;
//     if (pwd.length >= 8) score++;
//     if (/[A-Z]/.test(pwd)) score++;
//     if (/[0-9]/.test(pwd)) score++;
//     if (/[^A-Za-z0-9]/.test(pwd)) score++;

//     const map = [
//         { label: "Too weak", cls: "weak" },
//         { label: "Weak", cls: "weak" },
//         { label: "Fair", cls: "fair" },
//         { label: "Good", cls: "good" },
//         { label: "Strong", cls: "strong" },
//     ];
//     return { score, ...map[score] };
// };

// const rules = [
//     { id: "len", test: (p) => p.length >= 8, text: "At least 8 characters" },
//     { id: "upper", test: (p) => /[A-Z]/.test(p), text: "One uppercase letter" },
//     { id: "num", test: (p) => /[0-9]/.test(p), text: "One number" },
//     { id: "symbol", test: (p) => /[^A-Za-z0-9]/.test(p), text: "One special character (!@#$…)" },
// ];

// const Register = () => {
//     const [name, setName] = useState("");
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [phone, setPhone] = useState("");
//     const [address, setAddress] = useState("");
//     const [answer, setAnswer] = useState("");
//     const [showPass, setShowPass] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();

//     const strength = getStrength(password);
//     const allRulesPass = rules.every(r => r.test(password));

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!allRulesPass) {
//             toast.error("Please choose a stronger password");
//             return;
//         }

//         try {
//             setLoading(true);
//             const res = await axios.post("/api/v1/auth/register", {
//                 name, email, password, phone, address, answer,
//             });
//             if (res && res.data.success) {
//                 toast.success(res.data.message);
//                 navigate("/login");
//             } else {
//                 toast.error(res.data.message);
//             }
//         } catch (error) {
//             toast.error("Something went wrong");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Layout title="Register — TechVault">
//             <div className="auth-page">
//                 <div className="auth-card">

//                     {/* ── Header ── */}
//                     <div className="auth-card__header">
//                         <div className="auth-card__tag">New Account</div>
//                         <h1 className="auth-card__title">Join <em>TechVault</em></h1>
//                         <p className="auth-card__sub">Create your account to start shopping</p>
//                     </div>

//                     {/* ── Body ── */}
//                     <div className="auth-card__body">
//                         <form onSubmit={handleSubmit}>

//                             {/* Name */}
//                             <div className="auth-field">
//                                 <label className="auth-field__label">Full Name</label>
//                                 <div className="auth-field__input-wrap">
//                                     <span className="auth-field__icon">👤</span>
//                                     <input
//                                         type="text"
//                                         className="auth-field__input"
//                                         placeholder="Your full name"
//                                         value={name}
//                                         onChange={(e) => setName(e.target.value)}
//                                         required
//                                     />
//                                 </div>
//                             </div>

//                             {/* Email */}
//                             <div className="auth-field">
//                                 <label className="auth-field__label">Email Address</label>
//                                 <div className="auth-field__input-wrap">
//                                     <span className="auth-field__icon">✉</span>
//                                     <input
//                                         type="email"
//                                         className="auth-field__input"
//                                         placeholder="Enter your Email"
//                                         value={email}
//                                         onChange={(e) => setEmail(e.target.value)}
//                                         required
//                                     />
//                                 </div>
//                             </div>

//                             {/* Password + strength */}
//                             <div className="auth-field">
//                                 <label className="auth-field__label">Password</label>
//                                 <div className="auth-field__input-wrap">
//                                     <span className="auth-field__icon">🔒</span>
//                                     <input
//                                         type={showPass ? "text" : "password"}
//                                         className={`auth-field__input${password
//                                             ? allRulesPass ? " success" : " error"
//                                             : ""
//                                             }`}
//                                         placeholder="Create a strong password"
//                                         value={password}
//                                         onChange={(e) => setPassword(e.target.value)}
//                                         required
//                                     />
//                                     <button
//                                         type="button"
//                                         className="auth-field__eye"
//                                         onClick={() => setShowPass(!showPass)}
//                                         tabIndex={-1}
//                                     >
//                                         {showPass ? "🙈" : "👁"}
//                                     </button>
//                                 </div>

//                                 {/* Strength bars */}
//                                 {password && (
//                                     <div className="auth-strength">
//                                         <div className="auth-strength__bars">
//                                             {[1, 2, 3, 4].map(i => (
//                                                 <div
//                                                     key={i}
//                                                     className={`auth-strength__bar${i <= strength.score
//                                                         ? ` active-${strength.cls}`
//                                                         : ""
//                                                         }`}
//                                                 />
//                                             ))}
//                                         </div>
//                                         <div className={`auth-strength__label ${strength.cls}`}>
//                                             <span className="auth-rule__dot" />
//                                             {strength.label}
//                                         </div>
//                                     </div>
//                                 )}

//                                 {/* Rules checklist */}
//                                 {password && (
//                                     <div className="auth-rules">
//                                         {rules.map(r => (
//                                             <div
//                                                 key={r.id}
//                                                 className={`auth-rule ${r.test(password) ? "pass" : "fail"}`}
//                                             >
//                                                 <span className="auth-rule__dot" />
//                                                 {r.test(password) ? "✓" : "✗"} {r.text}
//                                             </div>
//                                         ))}
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Phone */}
//                             <div className="auth-field">
//                                 <label className="auth-field__label">Phone Number</label>
//                                 <div className="auth-field__input-wrap">
//                                     <span className="auth-field__icon">📞</span>
//                                     <input
//                                         type="tel"
//                                         className="auth-field__input"
//                                         placeholder="Your phone number"
//                                         value={phone}
//                                         onChange={(e) => setPhone(e.target.value)}
//                                         required
//                                     />
//                                 </div>
//                             </div>

//                             {/* Address */}
//                             <div className="auth-field">
//                                 <label className="auth-field__label">Delivery Address</label>
//                                 <div className="auth-field__input-wrap">
//                                     <span className="auth-field__icon">📍</span>
//                                     <input
//                                         type="text"
//                                         className="auth-field__input"
//                                         placeholder="Your delivery address"
//                                         value={address}
//                                         onChange={(e) => setAddress(e.target.value)}
//                                         required
//                                     />
//                                 </div>
//                             </div>

//                             {/* Secret word */}
//                             <div className="auth-field">
//                                 <label className="auth-field__label">Secret Word</label>
//                                 <div className="auth-field__input-wrap">
//                                     <span className="auth-field__icon">🔑</span>
//                                     <input
//                                         type="text"
//                                         className="auth-field__input"
//                                         placeholder="Password Recovery Key"
//                                         value={answer}
//                                         onChange={(e) => setAnswer(e.target.value)}
//                                         required
//                                     />
//                                 </div>
//                             </div>

//                             <hr className="auth-divider" />

//                             <button
//                                 type="submit"
//                                 className="auth-btn-primary"
//                                 disabled={loading || !allRulesPass}
//                             >
//                                 {loading
//                                     ? <><span className="auth-spinner" /> Creating account…</>
//                                     : "Create Account →"}
//                             </button>

//                             <div className="auth-footer">
//                                 Already have an account?{" "}
//                                 <button type="button" onClick={() => navigate("/login")}>
//                                     Login in
//                                 </button>
//                             </div>

//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </Layout>
//     );
// };

// export default Register;

import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import axios from "../../config/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";

/* ─── Password strength logic ──────────────────── */
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

const rules = [
    { id: "len", test: (p) => p.length >= 8, text: "At least 8 characters" },
    { id: "upper", test: (p) => /[A-Z]/.test(p), text: "One uppercase letter" },
    { id: "num", test: (p) => /[0-9]/.test(p), text: "One number" },
    { id: "symbol", test: (p) => /[^A-Za-z0-9]/.test(p), text: "One special character (!@#$…)" },
];

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [answer, setAnswer] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const strength = getStrength(password);
    const allRulesPass = rules.every(r => r.test(password));

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!allRulesPass) {
            toast.error("Please choose a stronger password");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post("/api/v1/auth/register", {
                name, email, password, phone, address, answer,
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
        <Layout title="Register — TechVault">
            <div className="auth-page">
                <div className="auth-card">

                    {/* ── Header ── */}
                    <div className="auth-card__header">
                        <div className="auth-card__tag">New Account</div>
                        <h1 className="auth-card__title">Join <em>TechVault</em></h1>
                        <p className="auth-card__sub">Create your account to start shopping</p>
                    </div>

                    {/* ── Body ── */}
                    <div className="auth-card__body">
                        <form onSubmit={handleSubmit} noValidate>

                            {/* Name */}
                            <div className="auth-field">
                                {/* FIX: added htmlFor="reg-name" to associate label with input */}
                                <label htmlFor="reg-name" className="auth-field__label">Full Name</label>
                                <div className="auth-field__input-wrap">
                                    {/* FIX: aria-hidden on decorative emoji icon */}
                                    <span className="auth-field__icon" aria-hidden="true">👤</span>
                                    <input
                                        id="reg-name"
                                        type="text"
                                        className="auth-field__input"
                                        placeholder="Your full name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        autoComplete="name"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="auth-field">
                                <label htmlFor="reg-email" className="auth-field__label">Email Address</label>
                                <div className="auth-field__input-wrap">
                                    <span className="auth-field__icon" aria-hidden="true">✉</span>
                                    <input
                                        id="reg-email"
                                        type="email"
                                        className="auth-field__input"
                                        placeholder="Enter your Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        autoComplete="email"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password + strength */}
                            <div className="auth-field">
                                <label htmlFor="reg-password" className="auth-field__label">Password</label>
                                <div className="auth-field__input-wrap">
                                    <span className="auth-field__icon" aria-hidden="true">🔒</span>
                                    <input
                                        id="reg-password"
                                        type={showPass ? "text" : "password"}
                                        className={`auth-field__input${password
                                            ? allRulesPass ? " success" : " error"
                                            : ""
                                            }`}
                                        placeholder="Create a strong password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete="new-password"
                                        aria-describedby="reg-password-rules"
                                        required
                                    />
                                    {/* FIX: aria-label on eye toggle, tabIndex removed (keyboard users need it) */}
                                    <button
                                        type="button"
                                        className="auth-field__eye"
                                        onClick={() => setShowPass(!showPass)}
                                        aria-label={showPass ? "Hide password" : "Show password"}
                                        aria-pressed={showPass}
                                    >
                                        <span aria-hidden="true">{showPass ? "🙈" : "👁"}</span>
                                    </button>
                                </div>

                                {/* Strength bars */}
                                {password && (
                                    <div className="auth-strength" aria-hidden="true">
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

                                {/* Rules checklist — announced to screen readers via aria-describedby */}
                                <div id="reg-password-rules" className="auth-rules" role="status" aria-live="polite">
                                    {password && rules.map(r => (
                                        <div
                                            key={r.id}
                                            className={`auth-rule ${r.test(password) ? "pass" : "fail"}`}
                                        >
                                            <span className="auth-rule__dot" aria-hidden="true" />
                                            <span aria-hidden="true">{r.test(password) ? "✓" : "✗"}</span>
                                            {" "}{r.text}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="auth-field">
                                <label htmlFor="reg-phone" className="auth-field__label">Phone Number</label>
                                <div className="auth-field__input-wrap">
                                    <span className="auth-field__icon" aria-hidden="true">📞</span>
                                    <input
                                        id="reg-phone"
                                        type="tel"
                                        className="auth-field__input"
                                        placeholder="Your phone number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        autoComplete="tel"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div className="auth-field">
                                <label htmlFor="reg-address" className="auth-field__label">Delivery Address</label>
                                <div className="auth-field__input-wrap">
                                    <span className="auth-field__icon" aria-hidden="true">📍</span>
                                    <input
                                        id="reg-address"
                                        type="text"
                                        className="auth-field__input"
                                        placeholder="Your delivery address"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        autoComplete="street-address"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Secret word */}
                            <div className="auth-field">
                                <label htmlFor="reg-answer" className="auth-field__label">Secret Word</label>
                                <div className="auth-field__input-wrap">
                                    <span className="auth-field__icon" aria-hidden="true">🔑</span>
                                    <input
                                        id="reg-answer"
                                        type="text"
                                        className="auth-field__input"
                                        placeholder="Password Recovery Key"
                                        value={answer}
                                        onChange={(e) => setAnswer(e.target.value)}
                                        autoComplete="off"
                                        required
                                    />
                                </div>
                            </div>

                            <hr className="auth-divider" />

                            <button
                                type="submit"
                                className="auth-btn-primary"
                                disabled={loading || !allRulesPass}
                                aria-busy={loading}
                            >
                                {loading
                                    ? <><span className="auth-spinner" aria-hidden="true" /> Creating account…</>
                                    : "Create Account →"}
                            </button>

                            <div className="auth-footer">
                                Already have an account?{" "}
                                <button type="button" onClick={() => navigate("/login")}>
                                    Log in
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Register;