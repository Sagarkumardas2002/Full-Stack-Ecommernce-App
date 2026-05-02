

// import React, { useState, useEffect } from 'react'
// import Layout from '../components/Layout/Layout'
// import useCategory from '../hooks/useCategory'
// import { Link } from 'react-router-dom'
// import './../StylePages/categories.css'

// // Map category names to emojis
// const categoryIcons = {
//     "laptops": "💻",
//     "laptop": "💻",
//     "phones": "📱",
//     "phone": "📱",
//     "phone & tablet": "📱",
//     "tablets": "📟",
//     "headphones": "🎧",
//     "audio": "🎧",
//     "cameras": "📷",
//     "camera": "📷",
//     "smartwatch": "⌚",
//     "smart watches": "⌚",
//     "watches": "⌚",
//     "gaming": "🎮",
//     "accessories": "🔌",
//     "footwear": "👟",
//     "shoes": "👟",
//     "books": "📚",
//     "books & theory": "📚",
//     "electronic gadgets": "⚡",
//     "electronics": "⚡",
//     "gadgets": "🔋",
//     "glasses": "👓",
//     "glasses & specs": "👓",
//     "clothing": "👕",
//     "fashion": "👗",
//     "sports": "⚽",
//     "furniture": "🪑",
//     "home": "🏠",
//     "kitchen": "🍳",
//     "food": "🍕",
//     "beauty": "💄",
//     "toys": "🧸",
// };

// const getIcon = (name) => {
//     const key = name?.toLowerCase().trim();
//     return categoryIcons[key] || "📦";
// };

// // Skeleton card shown while loading
// const CategorySkeleton = () => (
//     <div className="cat-skeleton">
//         <div className="cat-skeleton__icon" />
//         <div className="cat-skeleton__body">
//             <div className="cat-skeleton__label" />
//             <div className="cat-skeleton__circle" />
//         </div>
//     </div>
// );

// const Categories = () => {
//     const categories = useCategory();
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         if (categories.length > 0) {
//             // Small delay so skeleton is visible even on fast loads
//             const t = setTimeout(() => setLoading(false), 400);
//             return () => clearTimeout(t);
//         }
//     }, [categories]);

//     return (
//         <Layout title={"All Categories — TechVault"}>
//             <div className="cat-page">

//                 {/* ── Hero ── */}
//                 <section className="cat-hero">
//                     <span className="cat-hero__tag">Browse Store</span>
//                     <h1 className="cat-hero__title">
//                         Shop by <em>Category</em>
//                     </h1>
//                     <p className="cat-hero__sub">
//                         Explore our curated collections — from cutting-edge tech to everyday essentials.
//                     </p>
//                 </section>

//                 {/* ── Grid ── */}
//                 <div className="cat-section">
//                     <div className="cat-section__header">
//                         <span className="cat-section__label">
//                             {loading ? 'Loading categories...' : `${categories.length} ${categories.length === 1 ? 'Category' : 'Categories'} Available`}
//                         </span>
//                         <div className="cat-section__line" />
//                     </div>

//                     {loading ? (
//                         <div className="cat-grid">
//                             {Array.from({ length: 6 }).map((_, i) => (
//                                 <CategorySkeleton key={i} />
//                             ))}
//                         </div>
//                     ) : categories.length === 0 ? (
//                         <div className="cat-empty">
//                             <div className="cat-empty__icon">📂</div>
//                             <h4>No categories yet</h4>
//                             <p>Check back soon — new collections are being added.</p>
//                         </div>
//                     ) : (
//                         <div className="cat-grid">
//                             {categories.map((c, index) => (
//                                 <Link
//                                     key={c._id}
//                                     to={`/category/${c.slug}`}
//                                     className="cat-card"
//                                 >
//                                     <div className="cat-card__icon-wrap">
//                                         <span className="cat-card__num">#{String(index + 1).padStart(2, '0')}</span>
//                                         {getIcon(c.name)}
//                                     </div>
//                                     <div className="cat-card__body">
//                                         <p className="cat-card__name">{c.name}</p>
//                                         <div className="cat-card__arrow">→</div>
//                                     </div>
//                                 </Link>
//                             ))}
//                         </div>
//                     )}
//                 </div>

//             </div>
//         </Layout>
//     )
// }

// export default Categories


import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import useCategory from '../hooks/useCategory'
import { Link } from 'react-router-dom'
import './../StylePages/categories.css'

// Map category names to emojis
const categoryIcons = {
    "laptops": "💻",
    "laptop": "💻",
    "phones": "📱",
    "phone": "📱",
    "phone & tablet": "📱",
    "tablets": "📟",
    "headphones": "🎧",
    "audio": "🎧",
    "cameras": "📷",
    "camera": "📷",
    "smartwatch": "⌚",
    "smart watches": "⌚",
    "watches": "⌚",
    "gaming": "🎮",
    "accessories": "🔌",
    "footwear": "👟",
    "shoes": "👟",
    "books": "📚",
    "books & theory": "📚",
    "electronic gadgets": "⚡",
    "electronics": "⚡",
    "gadgets": "🔋",
    "glasses": "👓",
    "glasses & specs": "👓",
    "clothing": "👕",
    "fashion": "👗",
    "sports": "⚽",
    "furniture": "🪑",
    "home": "🏠",
    "kitchen": "🍳",
    "food": "🍕",
    "beauty": "💄",
    "toys": "🧸",
};

const getIcon = (name) => {
    const key = name?.toLowerCase().trim();
    return categoryIcons[key] || "📦";
};

// Skeleton card shown while loading
const CategorySkeleton = () => (
    <div className="cat-skeleton">
        <div className="cat-skeleton__icon" />
        <div className="cat-skeleton__body">
            <div className="cat-skeleton__label" />
            <div className="cat-skeleton__circle" />
        </div>
    </div>
);

const Categories = () => {
    const categories = useCategory();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (categories.length > 0) {
            const t = setTimeout(() => setLoading(false), 400);
            return () => clearTimeout(t);
        }
    }, [categories]);

    return (
        <Layout title={"All Categories — TechVault"}>
            <div className="cat-page">

                {/* ── Hero ── */}
                <section className="cat-hero">
                    <span className="cat-hero__tag">Browse Store</span>
                    <h1 className="cat-hero__title">
                        Shop by <em>Category</em>
                    </h1>
                    <p className="cat-hero__sub">
                        Explore our curated collections — from cutting-edge tech to everyday essentials.
                    </p>
                </section>

                {/* ── Grid ── */}
                <div className="cat-section">
                    <div className="cat-section__header">
                        <span className="cat-section__label">
                            {loading
                                ? 'Loading categories...'
                                : `${categories.length} ${categories.length === 1 ? 'Category' : 'Categories'} Available`}
                        </span>
                        <div className="cat-section__line" />
                    </div>

                    {loading ? (
                        <div className="cat-grid">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <CategorySkeleton key={i} />
                            ))}
                        </div>
                    ) : (categories || []).length === 0 ? (
                        <div className="cat-empty">
                            <div className="cat-empty__icon">📂</div>
                            <h4>No categories yet</h4>
                            <p>Check back soon — new collections are being added.</p>
                        </div>
                    ) : (
                        <div className="cat-grid">
                            {(categories || []).map((c, index) => (
                                <Link
                                    key={c._id}
                                    to={`/category/${c.slug}`}
                                    className="cat-card"
                                >
                                    <div className="cat-card__icon-wrap">
                                        <span className="cat-card__num">#{String(index + 1).padStart(2, '0')}</span>
                                        {getIcon(c.name)}
                                    </div>
                                    <div className="cat-card__body">
                                        <p className="cat-card__name">{c.name}</p>
                                        <div className="cat-card__arrow">→</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </Layout>
    );
};

export default Categories;