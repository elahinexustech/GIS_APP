import React from 'react';

const Help = () => {
    return (
        <>
            <div className="hero container-fluid py-5 px-5 bg-light">
                <div className="container text-center">
                    <h1 className="display-4 mb-4">What is Mappex?</h1>
                    <p className="lead">
                        Mappex is a real-time, map-based secure chat application. It allows users to connect with others in a geographic area or worldwide. Simply select an area and chat with others.
                    </p>
                </div>
            </div>

            <div className="container py-5">
                <div className="row mb-5">
                    <div className="col-md-6">
                        <h2>Can I create a private Mappex community?</h2>
                        <p>
                            Yes, you can now customize your chat and create your own private Mappex community where you are in control of who is invited to your community.
                        </p>
                    </div>
                    <div className="col-md-6">
                        <img
                            src="/images/private-community.jpg"
                            alt="Private Community"
                            className="img-fluid rounded shadow-sm"
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <img
                            src="/images/security.jpg"
                            alt="Security"
                            className="img-fluid rounded shadow-sm"
                        />
                    </div>
                    <div className="col-md-6">
                        <h2>Is Mappex secure?</h2>
                        <p>
                            Mappex is private, anonymous, and your location is never made public. Your messages are encrypted and never saved.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Help;
