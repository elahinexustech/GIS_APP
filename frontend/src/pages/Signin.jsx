import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../components/AuthContext.jsx";

import {BASE_URL} from '../../_CONST_';



export const Signin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setIsLoggedIn } = useContext(AuthContext);
    const [region, setRegion] = useState(null); // State for storing region
    const [loading, setLoading] = useState(false); // State for managing form disabled state
    const navigate = useNavigate();

    useEffect(() => {
        const searchParams = window.location.href; // Get the full URL
        const regionPart = searchParams.split("region=")[1]; // Extract the region part after 'region='
        // Handle the case if region exists and set it to state
        if (regionPart) {
            const region_coordinates = regionPart.split("&")[0]; // Get the coordinates (before any '&' in case of other params)
            setRegion(region_coordinates); // Save it in state
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Disable the form during submission

        try {
            const response = await axios.post(
                `${BASE_URL}/api/login/`,
                { email, password, region: localStorage.getItem("TEMP_LINK") }, // Include region in the login request
                { withCredentials: true }
            );

            if (response.status === 200) {

                if (response.data.is_buyer === false && region != null) {
                    localStorage.setItem("region", region);
                    localStorage.setItem("project", JSON.stringify(response.data.project));
                }
                localStorage.removeItem("TEMP_LINK");
                setIsLoggedIn(true);
                navigate("/map");
            }
        } catch (error) {
            console.error("Login error:", error.response?.data || error);
            toast.error("Login failed. Please try again.");
        } finally {
            setLoading(false); // Re-enable the form
        }
    };

    return (
        <>
            <div className="container my-5 py-5">
                <div className="row justify-content-center align-items-center">
                    <div className="col-md-6 d-none d-md-block">
                        <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                            className="img-fluid"
                            alt="Sign In Illustration"
                        />
                    </div>

                    <div className="col-md-6">
                        <h3 className="mb-4 text-center">Welcome Back!</h3>
                        <p className="text-center mb-5">Please sign in to your account</p>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group mb-4">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="form-control form-control-lg"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group mb-4">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    className="form-control form-control-lg"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="rememberMe"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg w-100 mb-4"
                                disabled={loading}
                            >
                                {loading ? "Signing In..." : "Sign In"}
                            </button>
                        </form>

                        <div className="text-center">
                            <p className="mb-0">
                                Don't have an account? <Link to="/register">Register here</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

export default Signin;
