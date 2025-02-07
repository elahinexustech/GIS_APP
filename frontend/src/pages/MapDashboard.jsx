import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";

export const MapDashboard = ({ regionCoordinates, generateLinkDisable }) => {
    const [polygonCoordinates, setPolygonCoordinates] = useState(); // State to store polygon coordinates
    const [canGenerateLink, setCanGenerateLink] = useState(false)


    useEffect(() => {

        const checkSession = async () => {
            try {
                const response = await axios.get("${BASE_URL}/api/check-session", {
                    withCredentials: true,
                });

                setCanGenerateLink(response.data.is_buyer)

            } catch (error) {
                console.error("Error checking session:", error);
            }
        };

        checkSession();

        if (regionCoordinates && regionCoordinates.length > 0) {
            setPolygonCoordinates(regionCoordinates);
        }
    }, [regionCoordinates]); // Re-run when regionCoordinates changes



    const onSubmit = async () => {
        if (polygonCoordinates.length === 0) {
            toast.error("No polygon coordinates available. Please draw a region first.");
            return;
        }

        try {
            const response = await axios.post(
                "${BASE_URL}/api/generate/link",
                {
                    coordinates: polygonCoordinates, // Use the polygon coordinates
                },
                {
                    withCredentials: true, // Include credentials if required
                }
            );

            if (response.status === 200) {
                toast.success(
                    <>
                        Link Generated! It's now available in your <Link to="/dashboard">Dashboard</Link> to share!
                    </>,
                );
            } else {
                toast.error("Failed to generate the link. Please try again.");
            }
        } catch (error) {
            console.error("Error generating link:", error);
            toast.error("An error occurred while generating the link.");
        }
    };




    return (
        <>
            <header>
                {/* Sidebar */}
                <nav id="sidebarMenu" className="collapse d-lg-block sidebar collapse bg-white">
                    <div className="position-sticky">
                        <div className="list-group list-group-flush mx-3 mt-4">
                            <Link to="/" className="list-group-item list-group-item-action py-2" aria-current="true">
                                <i className="fas fa-tachometer-alt fa-fw me-3" />
                                <span>Home</span>
                            </Link>

                            {canGenerateLink ? (
                                <div className="dropdown">
                                    <button
                                        className="btn btn-secondary dropdown-toggle w-100"
                                        type="button"
                                        id="dropdownMenuButton"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        Generate Link
                                    </button>
                                    <div className="dropdown-menu p-4" aria-labelledby="dropdownMenuButton">
                                        <button
                                            type="button"
                                            className="btn btn-primary w-100"
                                            onClick={onSubmit}>
                                            Generate Link
                                        </button>
                                    </div>
                                </div>
                            ) : ""

                            }

                            {!canGenerateLink && !(localStorage.getItem('region') || localStorage.getItem('project')) ? (
                                <>
                                    <br />
                                    <p className='fw-bold text-warning fst-italic'>Select a plan to continue generating coupons for your users: <Link to='/subscription-details'>Subscribe to a plan first!</Link></p>
                                </>
                            ) : ""

                            }


                            <hr />
                        </div>
                    </div>
                </nav>

                {/* Navbar */}
                <nav id="main-navbar" className="navbar navbar-expand-lg navbar-light bg-white fixed-top">
                    <div className="container-fluid">
                        {/* Toggle button */}
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#sidebarMenu"
                            aria-controls="sidebarMenu"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <i className="fas fa-bars" />
                        </button>

                        {/* Brand */}
                        <Link className="navbar-brand" to="/">
                            <img
                                src="/logo.jpeg"
                                height={25}
                                alt="Logo"
                                loading="lazy"
                            />
                        </Link>

                        {/* Right links */}
                        <ul className="navbar-nav ms-auto d-flex flex-row">
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle d-flex align-items-center"
                                    href="#"
                                    id="navbarDropdownMenuLink"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <img
                                        src="https://mdbootstrap.com/img/Photos/Avatars/img (31).jpg"
                                        className="rounded-circle"
                                        height={22}
                                        alt="User Avatar"
                                        loading="lazy"
                                    />
                                </a>

                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink">
                                    {/* Add dropdown items here */}
                                </ul>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>

            <ToastContainer />

        </>
    );
};
