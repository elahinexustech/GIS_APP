import React from 'react';
import { MDBContainer, MDBCard, MDBCardBody, MDBCardText, MDBIcon, MDBBtn } from 'mdb-react-ui-kit';

export const Success = () => {
  return (
    <MDBContainer className="d-flex justify-content-center align-items-center vh-100">
      <MDBCard className="text-center p-4" style={{ maxWidth: '500px' }}>
        <MDBCardBody>
          <MDBIcon fas icon="check-circle" size="5x" className="text-success mb-3" />
          <h3 className="text-success mb-3">Payment Successful!</h3>
          <MDBCardText className="mb-4">
            Thank you for your payment. Your transaction was successful, and your subscription is now active!
          </MDBCardText>
          <MDBBtn color="success" href="/">
            Go to Dashboard
          </MDBBtn>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default Success;




