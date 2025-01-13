import React from 'react'

export const Footer = () => {
    return (

        <>
            <footer className="footer-section bg-light py-5">
                <div className="container">

                    {/* Main Footer Content */}
                    <div className="row g-5 mb-5">
                        {/* Left Section */}
                        <div className="col-lg-4">
                            <div className="footer-logo-wrap mb-4">
                                <a href="#" className="footer-logo h2 text-dark fw-bold">
                                    MAPPAX<span className="text-primary">.</span>
                                </a>
                            </div>
                            <p className="text-muted">
                                Donec facilisis quam ut purus rutrum lobortis. Donec vitae odio quis
                                nisl dapibus malesuada. Nullam ac aliquet velit. Aliquam vulputate
                                velit imperdiet dolor tempor tristique.
                            </p>
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

                        {/* Right Section */}
                        <div className="col-lg-8">
                            <div className="row links-wrap">
                                {[
                                    {
                                        title: "Company",
                                        links: ["About us", "Services", "Blog", "Contact us"],
                                    },
                                    {
                                        title: "Support",
                                        links: ["Support", "Knowledge base", "Live chat"],
                                    },
                                    {
                                        title: "More",
                                        links: ["Jobs", "Our team", "Leadership", "Privacy Policy"],
                                    },
                                    {
                                        title: "Products",
                                        links: ["Nordic Chair", "Kruzo Aero", "Ergonomic Chair"],
                                    },
                                ].map((section, index) => (
                                    <div className="col-6 col-sm-6 col-md-3" key={index}>
                                        <h5 className="fw-bold">{section.title}</h5>
                                        <ul className="list-unstyled">
                                            {section.links.map((link, linkIndex) => (
                                                <li key={linkIndex} className="mb-2">
                                                    <a href="#" className="text-muted">
                                                        {link}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer Bottom */}
                    <div className="border-top pt-4">
                        <div className="row align-items-center">
                            <div className="col-lg-6 text-center text-lg-start mb-3 mb-lg-0">
                                <p className="mb-0 text-muted">
                                    &copy; All Rights Reserved. Designed with love by{" "}
                                    <a href="https://untree.co" className="text-primary">Untree.co</a>. Distributed by{" "}
                                    <a href="https://themewagon.com" className="text-primary">ThemeWagon</a>.
                                </p>
                            </div>
                            <div className="col-lg-6 text-center text-lg-end">
                                <ul className="list-unstyled d-inline-flex">
                                    <li className="me-4">
                                        <a href="#" className="text-muted">Terms &amp; Conditions</a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-muted">Privacy Policy</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* End Footer Section */}
        </>




    )
}
