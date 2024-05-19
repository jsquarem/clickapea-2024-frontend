import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import './ImageUploadModal.css';

const ImageUploadModal = ({ isOpen, onClose, onUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [hasCamera, setHasCamera] = useState(false);

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

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
  });

  const handleUpload = () => {
    onUpload(selectedFiles);
    setSelectedFiles([]);
    onClose();
  };

  const handleCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFiles([...selectedFiles, file]);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Upload Images</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div
          {...getRootProps()}
          className="border-dashed border-4 border-gray-300 p-6 rounded-lg text-center cursor-pointer"
        >
          <input {...getInputProps()} />
          <p className="text-gray-500">
            Drag and drop images here, or click to select files
          </p>
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
            <li key={file.path || file.name}>{file.path || file.name}</li>
          ))}
        </ul>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleUpload}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal;
