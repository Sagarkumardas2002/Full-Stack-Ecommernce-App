// import React from 'react'
// import Layout from '../components/Layout/Layout'
// import { BiMailSend, BiPhoneCall, BiSupport } from "react-icons/bi"
// const Contact = () => {
//   return (
//     <Layout title={"Contact Us-Sagar's Ecom App"}>
//       <div className="row contactus ">
//         <div className="col-md-6 ">
//           <img
//             src="/images/contactus.jpeg"
//             alt="contactus"
//             style={{ width: "100%", borderRadius: "5px" }}
//           />
//         </div>
//         <div className="col-md-4">
//           <h1 className="bg-dark p-2 text-white text-center">CONTACT US</h1>
//           <p className="text-justify mt-2">
//             Any query and info about prodduct feel free to call anytime we 24X7
//             vaialible
//           </p>
//           <p className="mt-3">
//             <BiMailSend /> : www.help@ecommerceapp.com
//           </p>
//           <p className="mt-3">
//             <BiPhoneCall /> : 012-3456789
//           </p>
//           <p className="mt-3">
//             <BiSupport /> : 1800-0000-0000 (toll free)
//           </p>
//         </div>
//       </div>
//     </Layout>
//   )
// }

// export default Contact


import React from "react";
import Layout from "../components/Layout/Layout";
import './../StylePages/Contact.css';

const Contact = () => {
  return (
    <Layout title={"Contact Us - Sagar's Ecom App"}>

      {/* ── Hero ── */}
      <div className="contact-hero">
        <span className="contact-hero-tag">Get In Touch</span>
        <h1>
          We're Here <em>24 × 7</em>
        </h1>
        <p>
          Any query or info about our products — feel free to reach out
          anytime. We're always available to help you.
        </p>
      </div>

      {/* ── Body ── */}
      <div className="contact-body">

        {/* Image column */}
        <div className="contact-img-col">
          <img src="/images/contactus.jpeg" alt="Contact us" />
        </div>

        {/* Text column */}
        <div className="contact-text-col">
          <h2>Contact Us</h2>
          <p>
            Reach us through any of the channels below and we'll get back to
            you promptly.
          </p>

          <div className="contact-items">

            <div className="contact-item">
              <div className="contact-item__icon">✉️</div>
              <div className="contact-item__info">
                <div className="contact-item__label">Email</div>
                <div className="contact-item__val">help@ecommerceapp.com</div>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-item__icon">📞</div>
              <div className="contact-item__info">
                <div className="contact-item__label">Phone</div>
                <div className="contact-item__val">012-3456789</div>
              </div>
              <span className="contact-item__badge">24 × 7</span>
            </div>

            <div className="contact-item">
              <div className="contact-item__icon">🎧</div>
              <div className="contact-item__info">
                <div className="contact-item__label">Toll Free</div>
                <div className="contact-item__val">1800-0000-0000</div>
              </div>
              <span className="contact-item__badge">Free</span>
            </div>

          </div>
        </div>

      </div>
    </Layout>
  );
};

export default Contact;