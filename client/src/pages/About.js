// import React from "react";
// import Layout from "./../components/Layout/Layout";

// const About = () => {
//     return (
//         <Layout title={"About us-Sagar's Ecom App"}>
//             <div className="row contactus ">
//                 <div className="col-md-5 ">
//                     <img
//                         src="/images/about.jpeg"
//                         alt="contactus"
//                         style={{ width: "100%" }}
//                     />
//                 </div>
//                 <div className="col-md-6">
//                     <h3>Your Trust is Our Biggest profit ...</h3>
//                     <hr />
//                     <p className="text-justify mt-2">
//                         Your seamless shopping experience is our priority. With a keen eye on trends and a data-driven approach, we ensure smooth operations and happy customers. Trust in our expertise to navigate the digital realm, providing you with an online store that's both efficient and delightful to explore.
//                     </p>

//                     <p>Our eCommerce expertise ensures seamless shopping. With trends in mind and data-driven decisions, we prioritize your satisfaction. Trust us to provide an efficient and delightful online store experience.</p>
//                 </div>
//             </div>
//         </Layout >
//     );
// };

// export default About;

import React from "react";
import Layout from "./../components/Layout/Layout";
import './../StylePages/About.css'

const About = () => {
    return (
        <Layout title={"About us - Sagar's Ecom App"}>

            {/* ── Hero ── */}
            <div className="about-hero">
                <span className="about-tag">Our Story</span>
                <h1>
                    Your Trust is Our <em>Biggest Profit</em>
                </h1>
                <p>
                    Seamless shopping experiences crafted with care, driven by data, and
                    designed around you.
                </p>
            </div>

            {/* ── Body ── */}
            <div className="about-body">

                {/* Image column */}
                <div className="about-img-col">
                    <img src="/images/about.jpeg" alt="About us" />
                </div>

                {/* Text column */}
                <div className="about-text-col">
                    <h2>Who We Are</h2>
                    <hr />
                    <p>
                        Your seamless shopping experience is our priority. With a keen eye
                        on trends and a data-driven approach, we ensure smooth operations
                        and happy customers. Trust in our expertise to navigate the digital
                        realm, providing you with an online store that's both efficient and
                        delightful to explore.
                    </p>
                    <p>
                        Our eCommerce expertise ensures seamless shopping. With trends in
                        mind and data-driven decisions, we prioritize your satisfaction.
                        Trust us to provide an efficient and delightful online store
                        experience.
                    </p>

                    {/* Values grid */}
                    <div className="about-values">
                        <div className="about-val">
                            <div className="about-val__icon">🎯</div>
                            <div className="about-val__label">Customer First</div>
                            <div className="about-val__desc">Your satisfaction is our compass</div>
                        </div>
                        <div className="about-val">
                            <div className="about-val__icon">📊</div>
                            <div className="about-val__label">Data-Driven</div>
                            <div className="about-val__desc">Smart decisions, better results</div>
                        </div>
                        <div className="about-val">
                            <div className="about-val__icon">🚀</div>
                            <div className="about-val__label">Innovation</div>
                            <div className="about-val__desc">Always ahead of the curve</div>
                        </div>
                        <div className="about-val">
                            <div className="about-val__icon">🔒</div>
                            <div className="about-val__label">Trust</div>
                            <div className="about-val__desc">Secure and reliable always</div>
                        </div>
                    </div>
                </div>

            </div>
        </Layout>
    );
};

export default About;