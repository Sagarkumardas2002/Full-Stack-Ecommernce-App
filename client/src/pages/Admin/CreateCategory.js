// import React, { useEffect, useState } from 'react'
// import Layout from '../../components/Layout/Layout'
// import AdminMenu from '../../components/Layout/AdminMenu'
// import toast from 'react-hot-toast'
// import axios from 'axios'
// import CategoryForm from '../../components/Form/CategoryForm'
// import { Modal } from 'antd'

// const CreateCategory = () => {
//     const [categories, setCategories] = useState([]);
//     const [name, setName] = useState("");
//     const [visible, setVisible] = useState(false)
//     const [selected, setSelected] = useState(null);
//     const [updatedName, setUpdatedName] = useState("")

//     //handle form
//     const handleSubmit = async (e) => {
//         e.preventDefault()
//         try {
//             const { data } = await axios.post("/api/v1/category/create-category", {
//                 name,
//             })

//             if (data?.success) {
//                 toast.success(`${name} is created`);
//                 getAllCategory();
//                 setName('');//clears the input field when any product is created
//             }
//             else {
//                 toast.error(data.message);
//             }
//         }
//         catch (error) {
//             console.log(error)
//             toast.error('Something went wrong in input from ')
//         }
//     }

//     //get all categories
//     const getAllCategory = async () => {
//         try {
//             const { data } = await axios.get('/api/v1/category/get-category');
//             if (data?.success) {
//                 setCategories(data?.category);
//             }
//         }
//         catch (error) {
//             console.log(error)
//             toast.error("Something went wrong in getting category ")
//         }
//     };

//     useEffect(() => {
//         getAllCategory();
//     }, []);

//     //updated category
//     const handleUpdate = async (e) => {
//         e.preventDefault()
//         try {
//             const { data } = await axios.put(`/api/v1/category/update-category/${selected._id}`, { name: updatedName })
//             if (data.success) {
//                 toast.success(`${updatedName} is Updated`)
//                 setSelected(null)
//                 setUpdatedName("")
//                 setVisible(false)
//                 getAllCategory();
//                 setName('');
//             }
//             else {
//                 toast.error(data.message)
//             }

//         }
//         catch (error) {
//             toast.error('Something Went wrong ')
//         }
//     }

//     //delete Category
//     const handleDelete = async (pId) => {
//         try {
//             const { data } = await axios.delete(`/api/v1/category/delete-category/${pId}`)
//             if (data.success) {
//                 toast.success(`category is deleted`)
//                 getAllCategory();
//                 setName('');
//             }
//             else {
//                 toast.error(data.message)
//             }

//         }
//         catch (error) {
//             toast.error('Something Went wrong ')
//         }
//     }


//     return (

//         <Layout title={"Dashboard - Create Category"}>
//             <div className="container-fluid  p-3">
//                 <div className="row">
//                     <div className="col-lg-3 col-md-4 mx-lg-4">
//                         <AdminMenu />
//                     </div>
//                     <div className="col-lg-7 col-md-8">
//                         <h1 className='mx-4 mx-lg-0 mt-3 mt-lg-0'>Manage Category</h1>
//                         <div className='p-3 mx-3 mx-lg-0'>
//                             <CategoryForm handleSubmit={handleSubmit} value={name} setValue={setName} />
//                         </div>
//                         <div className='p-3'>
//                             <div className='table-responsive'> {/* Added responsive wrapper for the table */}
//                                 <table className='table'>
//                                     <thead>
//                                         <tr>
//                                             <th scope='col'>Home</th>
//                                             <th scope='col'>Actions</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {categories?.map((c) => (
//                                             <tr key={c._id}>
//                                                 <td>{c.name}</td>
//                                                 <td>
//                                                     <button className='btn btn-primary ms-3' onClick={() => {
//                                                         setVisible(true);
//                                                         setUpdatedName(c.name);
//                                                         setSelected(c);
//                                                     }}>Edit</button>
//                                                     <button className='btn btn-danger ms-3' onClick={() => { handleDelete(c._id) }}>Delete</button>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                         <Modal onCancel={() => setVisible(false)} footer={null} open={visible}>
//                             <CategoryForm value={updatedName} setValue={setUpdatedName} handleSubmit={handleUpdate} />
//                         </Modal>
//                     </div>
//                 </div>
//             </div>
//         </Layout>

//     )
// }

// export default CreateCategory
import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
import CategoryForm from '../../components/Form/CategoryForm'
import { Modal } from 'antd'
import './../../StylesDashboardPage/Createcategory.css'

const CreateCategory = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState(null);
    const [updatedName, setUpdatedName] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState(null); // holds {_id, name} of category to delete
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        {
            label: 'Create Category',
            path: '/dashboard/admin/create-category',
            icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
        },
        {
            label: 'Create Product',
            path: '/dashboard/admin/create-product',
            icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
        },
        {
            label: 'Products',
            path: '/dashboard/admin/products',
            icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
        },
        {
            label: 'Orders',
            path: '/dashboard/admin/orders',
            icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
        },
        {
            label: 'Users',
            path: '/dashboard/admin/users',
            icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
        },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post("https://full-stack-ecommernce-app-backend.onrender.com/api/v1/category/create-category", { name });
            if (data?.success) {
                toast.success(`${name} is created`);
                getAllCategory();
                setName('');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong in input form');
        }
    };

    const getAllCategory = async () => {
        try {
            const { data } = await axios.get('https://full-stack-ecommernce-app-backend.onrender.com/api/v1/category/get-category');
            if (data?.success) setCategories(data?.category);
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong in getting category");
        }
    };

    useEffect(() => { getAllCategory(); }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put(`https://full-stack-ecommernce-app-backend.onrender.com/api/v1/category/update-category/${selected._id}`, { name: updatedName });
            if (data.success) {
                toast.success(`${updatedName} is Updated`);
                setSelected(null);
                setUpdatedName("");
                setVisible(false);
                getAllCategory();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    const confirmDelete = (category) => {
        setDeleteConfirm(category);
    };

    const handleDelete = async () => {
        if (!deleteConfirm) return;
        try {
            const { data } = await axios.delete(`https://full-stack-ecommernce-app-backend.onrender.com/api/v1/category/delete-category/${deleteConfirm._id}`);
            if (data.success) {
                toast.success(`"${deleteConfirm.name}" deleted`);
                getAllCategory();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setDeleteConfirm(null);
        }
    };

    return (
        <Layout title={"Dashboard — Create Category"}>
            <div className="cc-page">

                {/* ── Hero ── */}
                <section className="cc-hero">
                    <div className="cc-hero__content">
                        <span className="cc-hero__tag">Admin Panel</span>
                        <h1 className="cc-hero__title">Manage <em>Categories</em></h1>
                        <p className="cc-hero__sub">Create, edit and remove product categories.</p>
                    </div>
                    <div className="cc-hero__orb" />
                </section>

                {/* ── Body ── */}
                <div className="cc-body">

                    {/* ── Sidebar ── */}
                    <aside className="cc-sidebar">
                        <div className="cc-sidebar__head">Admin Panel</div>
                        {navItems.map((item) => (
                            <div
                                key={item.path}
                                className={`cc-sidebar__item${location.pathname === item.path ? ' cc-sidebar__item--active' : ''}`}
                                onClick={() => navigate(item.path)}
                            >
                                <span className="cc-sidebar__icon">{item.icon}</span>
                                {item.label}
                            </div>
                        ))}
                    </aside>

                    {/* ── Left: Form card ── */}
                    <div className="cc-form-card">
                        <div className="cc-card-header">
                            <div className="cc-card-header__icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                    <path d="M2 17l10 5 10-5" />
                                    <path d="M2 12l10 5 10-5" />
                                </svg>
                            </div>
                            <div>
                                <p className="cc-card-header__label">New Category</p>
                                <h3 className="cc-card-header__title">Add Category</h3>
                            </div>
                        </div>
                        <div className="cc-card__divider" />
                        <div className="cc-form-wrap">
                            <CategoryForm handleSubmit={handleSubmit} value={name} setValue={setName} />
                        </div>

                        {/* Stats pill */}
                        <div className="cc-stats-row">
                            <div className="cc-stat">
                                <span className="cc-stat__num">{categories.length}</span>
                                <span className="cc-stat__label">Total Categories</span>
                            </div>
                        </div>
                    </div>

                    {/* ── Right: Table card ── */}
                    <div className="cc-table-card">
                        <div className="cc-card-header">
                            <div className="cc-card-header__icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <line x1="8" y1="6" x2="21" y2="6" />
                                    <line x1="8" y1="12" x2="21" y2="12" />
                                    <line x1="8" y1="18" x2="21" y2="18" />
                                    <line x1="3" y1="6" x2="3.01" y2="6" />
                                    <line x1="3" y1="12" x2="3.01" y2="12" />
                                    <line x1="3" y1="18" x2="3.01" y2="18" />
                                </svg>
                            </div>
                            <div>
                                <p className="cc-card-header__label">All Categories</p>
                                <h3 className="cc-card-header__title">Category List</h3>
                            </div>
                        </div>
                        <div className="cc-card__divider" />

                        {categories.length === 0 ? (
                            <div className="cc-empty">
                                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                    <path d="M2 17l10 5 10-5" />
                                    <path d="M2 12l10 5 10-5" />
                                </svg>
                                <p>No categories yet. Add your first one.</p>
                            </div>
                        ) : (
                            <div className="cc-table-wrap">
                                <table className="cc-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Category Name</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.map((c, i) => (
                                            <tr key={c._id}>
                                                <td className="cc-table__num">{i + 1}</td>
                                                <td className="cc-table__name">
                                                    <span className="cc-table__dot" />
                                                    {c.name}
                                                </td>
                                                <td className="cc-table__actions">
                                                    <button
                                                        className="cc-btn cc-btn--edit"
                                                        onClick={() => {
                                                            setVisible(true);
                                                            setUpdatedName(c.name);
                                                            setSelected(c);
                                                        }}
                                                    >
                                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                        </svg>
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="cc-btn cc-btn--delete"
                                                        onClick={() => confirmDelete(c)}
                                                    >
                                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <polyline points="3 6 5 6 21 6" />
                                                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                                            <path d="M10 11v6M14 11v6" />
                                                            <path d="M9 6V4h6v2" />
                                                        </svg>
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                </div>

                {/* ── Edit Modal ── */}
                <Modal
                    onCancel={() => setVisible(false)}
                    footer={null}
                    open={visible}
                    className="cc-modal"
                    title={
                        <div className="cc-modal__title">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            Edit Category
                        </div>
                    }
                >
                    <div className="cc-modal__body">
                        <CategoryForm value={updatedName} setValue={setUpdatedName} handleSubmit={handleUpdate} />
                    </div>
                </Modal>

                {/* ── Delete Confirm Dialog ── */}
                {deleteConfirm && (
                    <div className="cc-confirm-overlay" onClick={() => setDeleteConfirm(null)}>
                        <div className="cc-confirm-box" onClick={(e) => e.stopPropagation()}>
                            <div className="cc-confirm-box__icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                    <path d="M10 11v6M14 11v6" />
                                    <path d="M9 6V4h6v2" />
                                </svg>
                            </div>
                            <h3 className="cc-confirm-box__title">Delete Category?</h3>
                            <p className="cc-confirm-box__msg">
                                Are you sure you want to delete{' '}
                                <strong>"{deleteConfirm.name}"</strong>?{' '}
                                This action cannot be undone.
                            </p>
                            <div className="cc-confirm-box__actions">
                                <button
                                    className="cc-confirm-box__cancel"
                                    onClick={() => setDeleteConfirm(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="cc-confirm-box__confirm"
                                    onClick={handleDelete}
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </Layout>
    );
};

export default CreateCategory;