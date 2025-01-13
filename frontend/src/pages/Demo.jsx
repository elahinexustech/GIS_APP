import React, { useState } from 'react';

const Demo = () => {

    return (
        <div className='container'>
            <br /><br />
            <div className="d-flex justify-content-center align-items-center flex-column">
                <h2>Get Started With Mappex</h2>
                <h1 className='text-center'>A simple step by step guide <br />for you to set up your first project.</h1>
            </div>

            <br /><hr /><br />
            <div className="d-flex justify-content-between align-items-center" style={{ width: '100%' }}>
                <section>
                    <h3>How to became a Buyer <br /> and Generate Projects!</h3>
                    <p style={{color: '#878787'}}>
                        Login to your account, <br />
                        Register as a buyer, <br />
                        Create a new project, <br />
                        Add markers to the map (Optional), <br />
                        Share the link with users, <br />
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
                    <h3>How to interact as Users!</h3>
                    <p style={{ color: '#878787' }}>
                        Login to your user account, <br />
                        Open the link the buyer shared with you, <br />
                        View the project details, <br />
                        Add markers to the map, <br />
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Demo;