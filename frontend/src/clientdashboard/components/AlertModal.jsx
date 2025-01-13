// components/AlertModal.js
import React from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from "mdb-react-ui-kit";

const AlertModal = ({ show, onClose }) => {
  return (
    <MDBModal show={show} tabIndex="-1">
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>Select Study Region</MDBModalTitle>
          </MDBModalHeader>
          <MDBModalBody>
            <p>
              Please select the study region before proceeding to the dashboard.
            </p>
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={onClose}>
              OK
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
};

export default AlertModal;


