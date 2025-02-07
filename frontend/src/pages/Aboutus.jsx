import React from 'react';

export const Aboutus = () => {
    return (
        <div className="container my-5">
            <br />
            {/* Mappex Section */}
            <h1 className="text-center mb-4 fw-bold fs-1">Introducing Mappex</h1>
            <br />
            <div className="row row-cols-1 row-cols-md-3 g-4">
                {[
                    {
                        title: "Location Based Chat",
                        description: "Mappex is a real-time, map-based secure chat application. It allows users to connect with others in a geographic area or worldwide. Simply select an area and chat with others.",
                        icon: "bi-chat-dots"
                    },
                    {
                        title: "Create a Private Mappex Community",
                        description: "You can now customize your chat and create your own private Mappex community where you are in control of who is invited to your community.",
                        icon: "bi-people"
                    },
                    {
                        title: "Safe, Private and Secure",
                        description: "Mappex is private, anonymous, and your location is never made public. Your messages are encrypted and never saved.",
                        icon: "bi-shield-lock"
                    }
                ].map((feature, index) => (
                    <div className="col" key={index}>
                        <div className="card h-100 shadow-lg border-0 p-4" data-aos="fade-up" data-aos-delay={index * 100}>
                            <div className="card-body text-center d-flex flex-column justify-content-center">
                                <i className={`bi ${feature.icon} display-4 text-primary mb-3`}></i>
                                <h5 className="card-title fw-bold">{feature.title}</h5>
                                <p className="card-text">{feature.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Contact Section */}
            <h2 className="text-center mt-5 mb-4 fw-bold">Get in Touch</h2>
            <div className="row">
                {/* Contact Us */}
                <div className="col-md-6 mb-4">
                    <div className="card shadow border-0 rounded h-100">
                        <div className="card-body text-center">
                            <h5 className="card-title">Contact Us</h5>
                            <p className="card-text">
                                For any inquiries or more information, feel free to reach out to us!
                            </p>
                            <a href="mailto:info@example.com" className="btn btn-primary">
                                Support
                            </a>
                        </div>
                    </div>
                </div>

                {/* Follow Us */}
                <div className="col-md-6 mb-4">
                    <div className="card shadow border-0 rounded h-100">
                        <div className="card-body text-center">
                            <h5 className="card-title">Follow Us</h5>
                            <div>
                                <a href="https://facebook.com/mappexgeo" className="btn btn-primary m-1">
                                    <i className="bi bi-facebook fs-4"></i>
                                </a>
                                <a href="http://x.com/mappexgeo" className="btn btn-info m-1">
                                    <i className="bi bi-twitter fs-4"></i>
                                </a>
                                <a href="https://linkedIn.com/mappexgeo" className="btn btn-danger m-1">
                                    <i className="bi bi-linkedin fs-4"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
