import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

import {BASE_URL} from '../../_CONST_';



export const SubscriptionDetails = () => {
    const [isBuyer, setIsBuyer] = useState(false);

    const checkIsBuyer = async () => {
        try {
            const resp = await axios.get(`${BASE_URL}/api/check-session/`, { withCredentials: true });
            if (resp.status === 200) {
                setIsBuyer(resp.data.is_buyer);
            }
        } catch (error) {
            toast.error('Failed to check subscription status.');
        }
    };

    useEffect(() => {
        checkIsBuyer();
    }, []);

    // Function to handle the Stripe checkout session creation
    const handleCheckout = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/users/addbuyer`, { withCredentials: true });
            if (response.status === 200) {
                toast.success('You have successfully subscribed as a buyer!');
                setIsBuyer(true); // Update state after successful subscription
            } else {
                toast.error('Failed to subscribe. Please try again.');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        }
    };

    return (
        <div className="container mt-5 text-center bg-light p-5 shadow-sm rounded">
            {isBuyer ? (
                <>
                    <span className='d-flex justify-content-center align-items-center flex-column'>
                        <i className="bi bi-check-circle h1 text-success"></i>
                        <p className="h1 fw-bold text-success">You are a buyer!</p>
                    </span>
                    <p className="lead text-secondary">
                        Thank you for subscribing as a buyer. Enjoy exclusive deals tailored just for you!
                    </p>
                    <p className="text-muted">
                        <i className="fas fa-smile-beam fa-lg text-success"></i> We’re thrilled to have you as part of our community.
                    </p>
                    <p className="font-italic text-dark">
                        <strong>Keep exploring the amazing offers!</strong>
                    </p>
                </>
            ) : (
                <>
                    <h2 className="mb-4 text-primary font-weight-bold">Join Our Buyers' Circle!</h2>
                    <p className="lead text-secondary">
                        Unlock exclusive access to the best deals in your region and beyond.
                    </p>
                    <p className="text-muted">
                        <i className="fas fa-shopping-cart fa-lg text-success"></i> Upgrade your account and share premium deals with your audience effortlessly.
                    </p>
                    <p className="font-italic text-dark">
                        <strong>And yes, it's completely free!</strong>
                        Experience the perks without any cost.
                    </p>
                    <button className="btn btn-lg btn-primary mt-3 px-4" onClick={handleCheckout}>
                        Subscribe Now
                    </button>
                </>
            )}
        </div>
    );
};

export default SubscriptionDetails;
