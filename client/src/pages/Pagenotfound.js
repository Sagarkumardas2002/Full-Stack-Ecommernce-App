import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import './../StylePages/Pagenotfound.css';

const Pagenotfound = () => {
    return (
        <Layout title={"Sagar's App - Page Not Found"}>
            <div className="pnf">

                {/* Floating background characters */}
                <div className="pnf-floating-chars">
                    <span className="pnf-fc" style={{ left: "8%", top: "60%", animationDuration: "9s", animationDelay: "0s", "--rot": "-12deg" }}>4</span>
                    <span className="pnf-fc" style={{ left: "82%", top: "70%", animationDuration: "11s", animationDelay: "2s", "--rot": "8deg", fontSize: "55px" }}>0</span>
                    <span className="pnf-fc" style={{ left: "20%", top: "75%", animationDuration: "13s", animationDelay: "4s", "--rot": "5deg", fontSize: "50px" }}>4</span>
                    <span className="pnf-fc" style={{ left: "70%", top: "65%", animationDuration: "10s", animationDelay: "1s", "--rot": "-6deg", fontSize: "65px" }}>?</span>
                    <span className="pnf-fc" style={{ left: "50%", top: "80%", animationDuration: "12s", animationDelay: "3s", "--rot": "10deg", fontSize: "45px" }}>4</span>
                    <span className="pnf-fc" style={{ left: "90%", top: "55%", animationDuration: "8s", animationDelay: "5s", "--rot": "-3deg", fontSize: "40px" }}>0</span>
                </div>

                {/* Tag */}
                <span className="pnf-tag">Error 404</span>

                {/* Giant outlined 404 */}
                <div className="pnf-title-wrap">
                    <div className="pnf-title-glow">404</div>
                    <h1 className="pnf-title">404</h1>
                </div>

                {/* Gold divider */}
                <hr className="pnf-divider" />

                {/* Heading */}
                <h2 className="pnf-heading">Oops! Page Not Found</h2>

                {/* Subtext */}
                <p className="pnf-sub">
                    The page you're looking for seems to have wandered off.
                    <br />
                    Let's get you back to familiar territory.
                </p>

                {/* Actions */}
                <div className="pnf-actions">
                    <Link to="/" className="pnf-btn">
                        ← Go Home
                    </Link>
                    <button onClick={() => window.history.back()} className="pnf-btn-ghost">
                        Go Back
                    </button>
                </div>

                {/* Dot indicators */}
                <div className="pnf-dots">
                    <div className="pnf-dot pnf-dot--active"></div>
                    <div className="pnf-dot"></div>
                    <div className="pnf-dot"></div>
                </div>

            </div>
        </Layout>
    );
};

export default Pagenotfound;