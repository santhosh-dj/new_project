import React from 'react';
import './Modal.css';

const Modal = ({ showModal, closeModal, title, children }) => {
  return (
    <>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>{title}</h2>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;