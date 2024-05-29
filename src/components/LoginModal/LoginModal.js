// src/components/LoginModal/LoginModal.js
import React, { useContext, useRef } from 'react';
import AuthContext from '../../AuthContext';
import useClickOutside from '../../hooks/useClickOutside';
import './LoginModal.css';

const LoginModal = ({ isOpen, onClose }) => {
  const { login } = useContext(AuthContext);
  const modalRef = useRef(null);

  useClickOutside(modalRef, onClose);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg max-w-md w-full text-center"
      >
        <h2 className="text-xl font-bold mb-4">
          You must be logged in to upload images
        </h2>
        <button
          onClick={login}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Log In
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
