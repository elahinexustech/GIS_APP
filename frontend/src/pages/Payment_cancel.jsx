import React from 'react';
import { MDBContainer, MDBIcon, MDBBtn, MDBCard, MDBCardBody } from 'mdb-react-ui-kit';

export const Payment_Cancel = () => {
  return (
    <MDBContainer className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <MDBCard className="text-center shadow-lg" style={{ maxWidth: '600px' }}>
        <MDBCardBody>
          <MDBIcon fas icon="times-circle" size="4x" className="text-danger mb-4" />
          <h2 className="text-danger">Payment Cancelled</h2>
          <p className="mb-4">
            Your payment has been cancelled. If this was a mistake, you can try again or contact support for assistance.
          </p>
          <MDBBtn href="/pricing" color="warning" size="lg">
            Try Again <MDBIcon fas icon="redo" className="ms-2" />
          </MDBBtn>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default Payment_Cancel;


