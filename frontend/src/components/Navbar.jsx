// src/components/Navbar.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './AuthContext.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Navbar = () => {
    const { isLoggedIn, setIsLoggedIn, email, userId } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        if (confirm("Are you sure you want to logout!")) {
            try {
                await axios.post('http://127.0.0.1:8000/api/logout/', {}, { withCredentials: true });
                setIsLoggedIn(false);
                navigate('/login');
            } catch (error) {
                console.error("Error logging out:", error);
            }
        }
    };

    return (
        <>
            <nav className="custom-navbar navbar navbar-expand-md navbar-dark bg-dark" arial-label="Furni navigation bar">
                <div className="container">
                    <Link className="navbar-brand" to="/">
                        <img src="./logo.jpeg" alt="MAPPAX Logo" style={{ height: '40px', marginRight: '10px' }} />
                    </Link>

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarsFurni"
                        aria-controls="navbarsFurni"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarsFurni">
                        <ul className="custom-navbar-nav navbar-nav ms-auto mb-2 mb-md-0">
                            <li className="nav-item active">
                                <Link className="nav-link" to="/">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link className="nav-link" to="/about-us">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link className="nav-link" to="/demo">
                                    Demo
                                </Link>
                            </li>
                            {isLoggedIn ? (
                                <>
                                    <li>
                                        <Link className="nav-link" to="/dashboard">
                                            Dashboard
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="nav-link" to="/subscription-details">subscription details</Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link className="nav-link" to="/login">
                                            signin
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="nav-link" to="/register">
                                            signup
                                        </Link>
                                    </li>
                                </>
                            )}

                            <li>
                                <Link className="nav-link" to="/help">
                                    Help
                                </Link>
                            </li>
                        </ul>
                        {isLoggedIn ? (
                            <>
                                <ul className="custom-navbar-cta navbar-nav mb-2 mb-md-0 ms-5">
                                    <li className="nav-item dropdown">
                                        <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <img src="images/user.svg" alt="User Icon" />
                                        </Link>
                                        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                            <li>
                                                <Link className="dropdown-item" to="/profile">
                                                    <i className="bi bi-person-circle"></i> &nbsp; Profile
                                                </Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item" to="/map">
                                                    <i className="bi bi-map"></i> &nbsp; Map
                                                </Link>
                                            </li>
                                            <li>
                                                <hr className="dropdown-divider" />
                                            </li>
                                            <li>
                                                <button className="dropdown-item text-danger" onClick={handleLogout}>
                                                    Logout
                                                </button>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </>
                        ) : ""}
                    </div>
                </div>
            </nav>
            <ToastContainer />
        </>
    );
};
