import React from 'react';
import { Footer } from '../components/Footer';


const Demo = () => {
    return (
        <>
            <div className="container">
                <br /><br />
                <div className="d-flex justify-content-center align-items-center flex-column">
                    <h1 className="text-center fw-bold">
                        Chat Anywhere, Share Locations and Collaborate in Real-Time. <br />On a map.
                    </h1>
                    <p className="text-center mt-3" style={{ maxWidth: '800px', lineHeight: '1.6' }}>
                        Mappex is about creating connections and building communities wherever life takes you.
                        Join us today and let’s navigate the world, together. Discover a whole new way to navigate and interact with the world around you.
                    </p>
                </div>

                <br /><hr /><br />

                <div>
                    <h2 className="fw-bold">Why Choose Mappex?</h2>
                    <ul className="list-unstyled mt-4" style={{ lineHeight: '1.8', color: '#878787' }}>
                        <li>
                            <strong>Team Collaboration:</strong> Enable your team to collaborate on projects, events, or logistics with real-time map-based chat.
                        </li>
                        <li>
                            <strong>Customer Engagement:</strong> Connect with your audience by sharing locations, updates, or event information directly through the map.
                        </li>
                        <li>
                            <strong>Event Planning:</strong> Seamlessly organize and manage events with location tagging, route planning, and instant communication.
                        </li>
                        <li>
                            <strong>Delivery Coordination:</strong> Optimize routes and improve communication between drivers, dispatchers, and customers.
                        </li>
                    </ul>
                    <p className="text-center mt-4">
                        See our <a href="/support" style={{ textDecoration: 'none', color: '#007bff' }}>FAQ</a> for more information.
                    </p>
                </div>

                <br /><hr /><br />

                <div className="d-flex justify-content-between align-items-center" style={{ width: '100%' }}>


                    <section>
                        <h3>Sign up and launch your projects for free!</h3>
                        <p style={{ color: '#878787' }}>
                            Register and log into your account<br />
                            Create a new project<br />
                            Add markers to the map for feedback from your members (optional)<br />
                            Share the link with your members <br />
                            Members can create markers and up/down vote and comment on each marker already on the map<br />
                        </p>
                    </section>
                    <video width={'50%'} controls style={{ marginLeft: '1rem' }}>
                        <source src="/videos/MapsFuncsUsingBuyerAccount.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>

                <br /><hr /><br />

                <div className="d-flex justify-content-between align-items-center">
                    <video width={'50%'} controls>
                        <source src="/videos/MapsFuncsUsingUserAccount.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    <section>
                        <h3>How to interact as Members!</h3>
                        <p style={{ color: '#878787' }}>
                            Log into your member account<br />
                            Open the link the Subscriber shared with you<br />
                            View the project details<br />
                            Add markers to the map<br />
                        </p>
                    </section>
                </div>
            </div>
            <br /><br />
            <Footer></Footer>
        </>
    );
};

export default Demo;
