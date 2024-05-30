import React, { useState, useEffect, useRef, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import AuthContext from '../../AuthContext';
import useClickOutside from '../../hooks/useClickOutside';
import LoginModal from '../LoginModal/LoginModal';
import Loading from '../Loading/Loading';
import './ImageUploadModal.css';

const ImageUploadModal = ({
  isOpen,
  onClose,
  onUpload,
  isLoadingScan,
  scanImage,
  scanMessage,
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [hasCamera, setHasCamera] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);
  const modalRef = useRef(null);

  useEffect(() => {
    const checkForCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasVideoInput = devices.some(
          (device) => device.kind === 'videoinput'
        );
        setHasCamera(hasVideoInput);
      } catch (error) {
        console.error('Error checking for camera:', error);
        setHasCamera(false);
      }
    };

    checkForCamera();
  }, []);

  const onDrop = (acceptedFiles) => {
    setSelectedFiles(acceptedFiles);
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: 'image/*',
    noClick: true,
  });

  const handleUpload = () => {
    onUpload(selectedFiles);
    setSelectedFiles([]);
  };

  const handleCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFiles([...selectedFiles, file]);
    }
  };

  useClickOutside(modalRef, () => {
    if (!isLoadingScan) {
      onClose();
    }
  });

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {!isAuthenticated && <LoginModal isOpen={isOpen} onClose={onClose} />}
      {isAuthenticated && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            ref={modalRef}
            className="bg-white p-6 rounded-lg max-w-md w-full"
          >
            <div className="flex justify-center items-center mb-4">
              {!scanImage ? (
                <h2 className="text-xl font-bold text-center">Upload Images</h2>
              ) : (
                ''
              )}
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 ml-auto"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            {isLoadingScan ? (
              <div className="flex flex-col items-center">
                <Loading />
                <h3 className="text-2xl font-semibold text-blue-500">
                  {scanMessage}
                </h3>
                {scanImage && (
                  <img
                    src={scanImage}
                    alt="Scanned"
                    className="rounded-lg mt-2 max-h-64"
                  />
                )}
              </div>
            ) : (
              <>
                <div
                  {...getRootProps()}
                  className="border-dashed border-4 border-gray-300 p-6 rounded-lg text-center cursor-pointer"
                >
                  <input {...getInputProps()} />
                  <p className="text-gray-500" onClick={open}>
                    Drag and drop images here, or click to select files
                  </p>
                </div>
                <div className="text-center mt-4">
                  <button
                    onClick={open}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded"
                  >
                    Browse
                  </button>
                </div>
                {hasCamera && (
                  <div className="text-center mt-4">
                    <label htmlFor="cameraInput" className="cursor-pointer">
                      <div className="bg-gray-200 p-2 rounded-lg">
                        <i className="fas fa-camera text-2xl text-gray-500"></i>
                        <p className="text-gray-500">Take a photo</p>
                      </div>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      capture="camera"
                      id="cameraInput"
                      style={{ display: 'none' }}
                      onChange={handleCapture}
                    />
                  </div>
                )}
                <ul className="mt-4">
                  {selectedFiles.map((file) => (
                    <li key={file.path || file.name}>
                      {file.path || file.name}
                    </li>
                  ))}
                </ul>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleUpload}
                    disabled={selectedFiles.length === 0}
                    className={`${
                      selectedFiles.length === 0
                        ? 'bg-gray-400'
                        : 'bg-blue-500 hover:bg-blue-700'
                    } text-white font-bold py-2 px-4 rounded`}
                  >
                    Upload
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageUploadModal;
