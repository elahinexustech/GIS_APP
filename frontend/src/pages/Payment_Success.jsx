import React from 'react';
import { MDBContainer, MDBIcon, MDBBtn, MDBCard, MDBCardBody } from 'mdb-react-ui-kit';

import { Link } from 'react-router-dom';

export const Payment_Success = () => {
    return (

        <>


            <MDBContainer className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <MDBCard className="text-center shadow-lg" style={{ maxWidth: '600px' }}>
                    <MDBCardBody>
                        <MDBIcon fas icon="check-circle" size="4x" className="text-success mb-4" />
                        <h2 className="text-success">Payment Successful!</h2>
                        <p className="mb-4">
                            Thank you for your purchase! Your payment was processed successfully. You will receive a confirmation email shortly.
                        </p>
                        <Link to="/">
                            <MDBBtn color="primary" size="lg">
                                Back to Home <MDBIcon fas icon="arrow-right" className="ms-2" />
                            </MDBBtn>
                        </Link>
                    </MDBCardBody>
                </MDBCard>
            </MDBContainer>

        </>


    );
};

export default Payment_Success;










