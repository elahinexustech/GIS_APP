import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
    const [user, setUser] = useState(null); // State to store user details
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const navigate = useNavigate(); // For redirecting to login page

    // Function to check session and fetch user details
    const fetchUserDetails = async () => {
        try {
            const sessionResponse = await axios.get('http://127.0.0.1:8000/api/check-session/', { withCredentials: true });
            const userId = sessionResponse.data.user_id;

            if (userId) {
                const userResponse = await axios.get(`http://127.0.0.1:8000/api/users/${userId}/`, { withCredentials: true });
                setUser(userResponse.data); // Set user data in state
            } else {
                navigate('/login'); // Redirect to login
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
            navigate('/login'); // Redirect to login in case of error
        } finally {
            setIsLoading(false); // Set loading to false
        }
    };

    // Fetch user details on component mount
    useEffect(() => {
        fetchUserDetails();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post('http://127.0.0.1:8000/api/logout/', {}, { withCredentials: true });
            navigate('/login');
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!user) {
        return <div>No user data available</div>; // If no user data, show this message
    }

    return (
        <div className="container d-flex justify-content-center mt-5">
            <div className="card shadow-lg" style={{ maxWidth: '500px', width: '100%' }}>
                <div className="card-body">
                    <h2 className="text-center mb-4">User Profile</h2>
                    <p><strong>Email:</strong> {user.email}</p>
                    <button
                        type="button"
                        className="btn btn-danger btn-block w-100"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};
