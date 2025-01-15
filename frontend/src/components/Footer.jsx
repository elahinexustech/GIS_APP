import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';

export const Footer = () => {
    const isLoggedIn = useContext(AuthContext);

    return (
        <footer className="footer-section bg-light py-5">
            <div className="container">
                {/* Main Footer Content */}
                <div className="row g-5 mb-5">
                    {/* Left Section */}
                    <div className="col-lg-4">
                        <div className="footer-logo-wrap mb-4 flex">
                            <a href="#" className="footer-logo h2 text-dark fw-bold">
                                MAPPAX<span className="text-primary">.</span>
                            </a>
                            <img src="./logo.jpeg" width="200" alt="Logo" />
                        </div>
                        <ul className="list-unstyled d-flex custom-social mt-4">
                            <li className="me-3">
                                <a href="#" className="text-dark">
                                    <i className="fab fa-facebook-f"></i>
                                </a>
                            </li>
                            <li className="me-3">
                                <a href="#" className="text-dark">
                                    <i className="fab fa-twitter"></i>
                                </a>
                            </li>
                            <li className="me-3">
                                <a href="#" className="text-dark">
                                    <i className="fab fa-instagram"></i>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-dark">
                                    <i className="fab fa-linkedin"></i>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Navigation Menu Section */}
                    <div className="col-lg-8">
                        <ul className="list-unstyled d-flex flex-wrap">
                            {/* Common Links */}
                            <li className="me-4">
                                <Link className="nav-link" to="/">Home</Link>
                            </li>
                            <li className="me-4">
                                <Link className="nav-link" to="/about-us">About Us</Link>
                            </li>
                            {isLoggedIn && (
                                <li className="me-4">
                                    <Link className="nav-link" to="/dashboard">Dashboard</Link>
                                </li>
                            )}
                            <li className="me-4">
                                <Link className="nav-link" to="/demo">Demo</Link>
                            </li>
                            <li className="me-4">
                                <Link className="nav-link" to="/support">Support</Link>
                            </li>
                            {isLoggedIn && (
                                <li className="nav-item dropdown me-4">
                                    <Link
                                        className="nav-link dropdown-toggle"
                                        to="#"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        Account
                                    </Link>
                                    <ul className="dropdown-menu">
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
                                        <li><hr className="dropdown-divider" /></li>
                                        <li>
                                            <button className="dropdown-item text-danger">
                                                Logout
                                            </button>
                                        </li>
                                    </ul>
                                </li>
                            )}
                        </ul>

                        {/* Buttons (Horizontal Layout) */}
                        <div className="d-flex align-items-center">
                            {isLoggedIn ? (
                                <button
                                    className="btn bg-secondary btn-sm me-4"
                                    onClick={() => { window.location = '/subscription-details'; }}
                                >
                                    Upgrade
                                </button>
                            ) : (
                                <>
                                    <Link className="btn bg-secondary btn-sm me-4" to="/login">Log in</Link>
                                    <Link className="btn bg-secondary btn-sm" to="/register">Sign up</Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
