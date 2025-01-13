import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MDBCard, MDBCardBody, MDBSpinner, MDBBtn, MDBContainer } from 'mdb-react-ui-kit';

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
      <MDBContainer className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <MDBSpinner grow color="primary">
          <span className="visually-hidden">Loading...</span>
        </MDBSpinner>
      </MDBContainer>
    );
  }

  if (!user) {
    return <div>No user data available</div>; // If no user data, show this message
  }

  return (
    <MDBContainer className="d-flex justify-content-center mt-5">
      <MDBCard style={{ maxWidth: '500px', width: '100%' }}>
        <MDBCardBody>
          <h2 className="text-center mb-4">User Profile</h2>
          <p><strong>Name:</strong> {user.full_name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <MDBBtn color="danger" block onClick={handleLogout}>Logout</MDBBtn>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};









