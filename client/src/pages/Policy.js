// import React from "react";
// import Layout from "./../components/Layout/Layout";

// const Policy = () => {
//     return (
//         <Layout title={"Our Policy -Sagar's Ecom App"}>
//             <div className="row contactus mb-5">
//                 <div className="col-md-6 my-2 mb-4">
//                     <img
//                         src="/images/policy.jpg"
//                         alt="contactus"
//                         style={{
//                             width: "100%", height: "auto", borderRadius: "4px"
//                         }}
//                     />
//                 </div>
//                 <div className="col-md-5 mx-4 " >
//                     <h2 className="sty ">Our policy</h2>
//                     <p className="styy"><strong> Rules for platform use, payment, shipping, and legal disclaimers.</strong></p>
//                     <hr />
//                     <ul>
//                         <li>Returns and Refunds Policy: Guidelines for returns, exchanges, refunds, and restocking fees.</li>
//                         <li>Payment Security Policy: Assurance of payment information security measures.</li>
//                         <li>Customer Service Policy: Contact info, response times, and support channels.</li>
//                         <li>Terms of Service: Legal agreement covering user conduct, rights, and dispute resolution.</li>
//                         <li>Age Restriction Policy: Minimum age requirements and verification processes.</li>
//                     </ul>
//                 </div>
//             </div>
//         </Layout>
//     );
// };

// export default Policy;


import React from "react";
import Layout from "./../components/Layout/Layout";
import './../StylePages/Policy.css';

const Policy = () => {
    return (
        <Layout title={"Our Policy - Sagar's Ecom App"}>

            {/* ── Hero ── */}
            <div className="policy-hero">
                <span className="policy-tag">Legal</span>
                <h1>
                    Our <em>Policies</em>
                </h1>
                <p>
                    Clear rules for platform use, payment, shipping, returns, and legal
                    disclaimers — all in one place.
                </p>
            </div>

            {/* ── Body ── */}
            <div className="policy-body">

                {/* Image column */}
                <div className="policy-img-col">
                    <img src="/images/policy.jpg" alt="Our policy" />
                </div>

                {/* Text column */}
                <div className="policy-text-col">
                    <h2>Our Policy</h2>
                    <p className="policy-sub">
                        Rules for platform use, payment, shipping &amp; legal disclaimers.
                    </p>
                    <hr className="policy-divider" />

                    <ul className="policy-list">

                        <li>
                            <span className="policy-num">1</span>
                            <div className="policy-list-content">
                                <strong>Returns &amp; Refunds</strong>
                                Guidelines for returns, exchanges, refunds, and restocking fees
                                to make shopping worry-free.
                            </div>
                        </li>

                        <li>
                            <span className="policy-num">2</span>
                            <div className="policy-list-content">
                                <strong>Payment Security</strong>
                                Your payment information is protected with industry-leading
                                security measures at every step.
                            </div>
                        </li>

                        <li>
                            <span className="policy-num">3</span>
                            <div className="policy-list-content">
                                <strong>Customer Service</strong>
                                Contact info, response times, and all available support
                                channels for your convenience.
                            </div>
                        </li>

                        <li>
                            <span className="policy-num">4</span>
                            <div className="policy-list-content">
                                <strong>Terms of Service</strong>
                                Legal agreement covering user conduct, rights, and dispute
                                resolution procedures.
                            </div>
                        </li>

                        <li>
                            <span className="policy-num">5</span>
                            <div className="policy-list-content">
                                <strong>Age Restrictions</strong>
                                Minimum age requirements and verification processes for a safe
                                shopping environment.
                            </div>
                        </li>

                    </ul>
                </div>

            </div>
        </Layout>
    );
};

export default Policy;