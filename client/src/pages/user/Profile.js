// import React, { useState, useEffect } from 'react'
// import Layout from '../../components/Layout/Layout'
// import UserMenu from '../../components/Layout/UserMenu'
// import { useAuth } from '../../context/auth'
// import toast from 'react-hot-toast'
// import axios from 'axios'


// const Profile = () => {
//     // context
//     const [auth, setAuth] = useAuth();

//     //state
//     const [name, setName] = useState("")
//     const [email, setEmail] = useState("")
//     const [password, setPassword] = useState("")
//     const [phone, setPhone] = useState("")
//     const [address, setAddress] = useState("");

//     //get user data
//     useEffect(() => {
//         const { email, name, phone, address } = auth?.user;
//         setName(name);
//         setPhone(phone);
//         setEmail(email);
//         setAddress(address);
//     }, [auth?.user]);


//     //form handleSubmit
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const { data } = await axios.put('/api/v1/auth/profile', { name, email, password, phone, address, });
//             if (data?.error) {
//                 toast.error(data?.error)
//             }
//             else {
//                 setAuth({ ...auth, user: data?.updatedUser })
//                 let ls = localStorage.getItem("auth")
//                 ls = JSON.parse(ls);
//                 ls.user = data.updatedUser;
//                 localStorage.setItem('auth', JSON.stringify(ls))
//                 toast.success("Profile Updated Successfully.. ")
//             }
//         } catch (error) {
//             console.log(error);
//             toast.error("Something went wrong");
//         }
//     };

//     return (
//         <Layout>
//             <div className="container-fluid m-6 mt-3 mb-3">
//                 <div className="row">
//                     <div className="col-md-3 mb-4">
//                         <UserMenu />
//                     </div>
//                     <div className="col-md-9">
//                         <div className="form-container" >
//                             <form onSubmit={handleSubmit} >
//                                 <h3 className='title'>USER  PROFILE</h3>
//                                 <div className="mb-3">
//                                     <input type="text" value={name}
//                                         onChange={(e) => setName(e.target.value)}
//                                         className="form-control" id="exampleInputName" placeholder='Name' />
//                                 </div>
//                                 <div className="mb-3">
//                                     <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" id="exampleInputemail" placeholder='Email' disabled />
//                                 </div>
//                                 <div className="mb-3">
//                                     <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" id="exampleInputPassword" placeholder='Password' />
//                                 </div>
//                                 <div className="mb-3">
//                                     <input type="number" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-control" id="exampleInputPhone" placeholder='Number' />
//                                 </div>
//                                 <div className="mb-3">
//                                     <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="form-control" id="exampleInputAddress" placeholder='Address' />
//                                 </div>



//                                 <button type="submit" className="btn btn-primary">UPDATE</button>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </Layout>
//     )
// }

// export default Profile



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
            const { data } = await axios.put('/api/v1/auth/profile', {
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
                setPassword(""); // clear password after save
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
                        <h1 className="pf-hero__title">
                            My <em>Profile</em>
                        </h1>
                        <p className="pf-hero__sub">
                            Update your personal information and delivery address.
                        </p>
                    </div>
                    {/* Avatar bubble */}
                    <div className="pf-hero__avatar">
                        {auth?.user?.name?.charAt(0).toUpperCase()}
                    </div>
                </section>

                {/* ── Body ── */}
                <div className="pf-body">

                    {/* Sidebar */}
                    <aside className="pf-sidebar">
                        <UserMenu />
                    </aside>

                    {/* Main */}
                    <main className="pf-main">
                        <div className="pf-card">

                            {/* Card header */}
                            <div className="pf-card__header">
                                <div className="pf-card__avatar">
                                    {auth?.user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="pf-card__role">User Profile</p>
                                    <h3 className="pf-card__name">{auth?.user?.name}</h3>
                                </div>
                            </div>

                            <div className="pf-card__divider" />

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="pf-form">

                                <div className="pf-form__row">
                                    {/* Name */}
                                    <div className="pf-field">
                                        <label className="pf-field__label">
                                            <span className="pf-field__icon">
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                    <circle cx="12" cy="7" r="4" />
                                                </svg>
                                            </span>
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            className="pf-input"
                                            placeholder="Enter your name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="pf-field">
                                        <label className="pf-field__label">
                                            <span className="pf-field__icon">
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                                    <polyline points="22,6 12,13 2,6" />
                                                </svg>
                                            </span>
                                            Email Address
                                            <span className="pf-field__badge">Cannot change</span>
                                        </label>
                                        <input
                                            type="email"
                                            className="pf-input pf-input--disabled"
                                            placeholder="Email"
                                            value={email}
                                            disabled
                                        />
                                    </div>
                                </div>

                                <div className="pf-form__row">
                                    {/* Password */}
                                    <div className="pf-field">
                                        <label className="pf-field__label">
                                            <span className="pf-field__icon">
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                                </svg>
                                            </span>
                                            New Password
                                            <span className="pf-field__badge pf-field__badge--opt">Optional</span>
                                        </label>
                                        <input
                                            type="password"
                                            className="pf-input"
                                            placeholder="Leave blank to keep current"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div className="pf-field">
                                        <label className="pf-field__label">
                                            <span className="pf-field__icon">
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.8 19.79 19.79 0 0 1 1.61 5.2 2 2 0 0 1 3.6 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.6a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 18z" />
                                                </svg>
                                            </span>
                                            Phone Number
                                        </label>
                                        <input
                                            type="number"
                                            className="pf-input"
                                            placeholder="Enter your phone number"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Address — full width */}
                                <div className="pf-field pf-field--full">
                                    <label className="pf-field__label">
                                        <span className="pf-field__icon">
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                                <circle cx="12" cy="10" r="3" />
                                            </svg>
                                        </span>
                                        Delivery Address
                                    </label>
                                    <input
                                        type="text"
                                        className="pf-input"
                                        placeholder="Enter your full delivery address"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
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
                                    >
                                        {loading ? (
                                            <><span className="pf-spinner" /> Saving…</>
                                        ) : (
                                            <>
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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