import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './AuthContext.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Navbar = () => {
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
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
            <nav className="custom-navbar navbar navbar-expand-md navbar-dark bg-dark" aria-label="MAPPAX Navigation">
                <div className="container">
                    {/* Logo */}
                    <Link className="navbar-brand" to="/">
                        <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#94baf7' }}>MAPPEX</span>
                    </Link>

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarsMappax"
                        aria-controls="navbarsMappax"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon" />
                    </button>

                    <div className="collapse navbar-collapse" id="navbarsMappax">
                        <ul className="navbar-nav ms-auto mb-2 mb-md-0">
                            {/* Common Links */}
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Home</Link>
                            </li>
                            <li className="me-4">
                                <Link className="nav-link" to="/about-us">About Us</Link>
                            </li>
                            {isLoggedIn && (<li className="nav-item">
                                <Link className="nav-link" to="/dashboard">Dashboard</Link>
                            </li>)}
                            <li className="nav-item">
                                <Link className="nav-link" to="/demo">Demo</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/support">Support</Link>
                            </li>
                            {isLoggedIn && (
                                <li className="nav-item dropdown">
                                    <Link
                                        className="nav-link dropdown-toggle"
                                        to="#"
                                        id="navbarDropdown"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        Account
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
                            )}
                        </ul>

                        {/* Buttons */}
                        <div className="d-flex align-items-center ms-3">
                            {isLoggedIn ? (
                                <button className="btn bg-secondary btn-sm me-2" onClick={() => { window.location = '/subscription-details' }}>
                                    Upgrade
                                </button>
                            ) : (
                                <>
                                    <Link className="btn bg-secondary btn-sm me-2" to="/login">Log in</Link>
                                    <Link className="btn bg-secondary btn-sm" to="/register">Sign up</Link>
                                </>
                            )}
                        </div>

                        {/* Social Media Icons */}
                        <div className="d-flex align-items-center ms-4">
                            <a href="#" className="text-white me-3">
                                <i className="bi bi-facebook"></i>
                            </a>
                            <a href="#" className="text-white me-3">
                                <i className="bi bi-twitter"></i>
                            </a>
                            <a href="#" className="text-white">
                                <i className="bi bi-linkedin"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
            <ToastContainer />
        </>
    );
};
