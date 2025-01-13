import React from "react";
import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Aboutus } from "./Aboutus";

export const Home = () => {
    return (
        <>

            <div className="hero py-5 bg-light">
                <div className="container">
                    <div className="row justify-content-between align-items-center">
                        {/* Hero Left Content */}
                        <div className="col-lg-5">
                            <div className="intro-excerpt">
                                <h1 className="display-4 fw-bold fs-2">
                                    For Business, Education and Life.
                                    <span className="d-block text-primary fs-1">Connect with others on a map.</span>
                                </h1>
                                <p className="mb-4 text-muted">
                                    By utilizing the Mappex AI–powered conversational interface, businesses can improve their workflow, customer service and team communication.
                                </p>
                            </div>
                        </div>

                        {/* Hero Right Image */}
                        <div className="col-lg-7">
                            <div className="hero-img-wrap text-center">
                                <img
                                    src="/logo.jpeg"
                                    alt="Hero"
                                    className="img-fluid rounded shadow"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Aboutus></Aboutus>

            <div className="container d-flex">
                <Link to='/register'><button className="btn btn-primary p-2 px-4">Get Started</button></Link>
                <Link to='/demo'><button className="btn btn-outline-secondary ms-3 p-2 px-4">Learn More</button></Link>
            </div>
            <br /><br /><br />
            <Footer />
        </>
    );
};








