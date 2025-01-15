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
                        <h1 className="display-4 fw-bold fs-1">
                            Chat Anywhere, Share Locations and Collaborate in Real-Time. On a map.
                        </h1>
                        <p className="mb-4 text-muted">
                            Mappex is about creating connections and building communities wherever life takes you. Join us today and let’s navigate the world, together. Discover a whole new way to navigate and interact with the world around you.
                        </p>
                    </div>
                </div>
                <div className="container d-flex">
                    <Link to='/register'><button className="btn btn-primary p-2 px-4">Get Started</button></Link>
                    <Link to='/demo'><button className="btn btn-outline-secondary ms-3 p-2 px-4">Learn More</button></Link>
                </div>
            </div>

            <Aboutus />

            <br /><br /><br />
            <Footer />
        </>
    );
};








