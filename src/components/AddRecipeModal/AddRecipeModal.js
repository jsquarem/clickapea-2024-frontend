import React, { useState, useRef, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import AuthContext from '../../AuthContext';
import useClickOutside from '../../hooks/useClickOutside';
import AddRecipeForm from '../AddRecipeForm/AddRecipeForm';
import Loading from '../Loading/Loading';
import { addRecipe, scanRecipe } from '../../utils/api';
import './AddRecipeModal.css';

const AddRecipeModal = ({ isOpen, onClose }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [activeTab, setActiveTab] = useState('add'); // 'add' or 'scan'
  const [scanImage, setScanImage] = useState(null);
  const [isLoadingScan, setIsLoadingScan] = useState(false);
  const [scanMessage, setScanMessage] = useState('');
  const { isAuthenticated } = useContext(AuthContext);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  useClickOutside(modalRef, () => {
    if (!isLoadingScan) {
      onClose();
    }
  });

  const onDrop = (acceptedFiles) => {
    setSelectedFiles(acceptedFiles);
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: 'image/*',
    noClick: true,
  });

  const handleCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFiles([...selectedFiles, file]);
    }
  };

  const handleUpload = async () => {
    setIsLoadingScan(true);
    const file = selectedFiles[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setScanImage(imageUrl);

      const formData = new FormData();
      formData.append('imageFile', file);

      try {
        const result = await scanRecipe(formData);
        navigate('/create-recipe', { state: { ...result, image: imageUrl } });
        onClose(); // Close modal after navigating
      } catch (error) {
        console.error('Error scanning recipe:', error);
      } finally {
        setIsLoadingScan(false);
      }
    }
  };

  const handleAddRecipeSubmit = async (url) => {
    setIsLoadingScan(true);
    setScanMessage('');
    try {
      const data = await addRecipe(url);
      navigate(`/recipe/${data._id}`);
      onClose(); // Close modal after navigating
    } catch (error) {
      console.error('Error adding recipe:', error);
      setScanMessage(error.message || 'Failed to add recipe');
    } finally {
      setIsLoadingScan(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setSelectedFiles([]);
      setScanImage(null);
      setScanMessage('');
      setIsLoadingScan(false);
    }
  }, [isOpen]);

  // Cleanup effect to handle component unmounting
  useEffect(() => {
    return () => {
      setSelectedFiles([]);
      setScanImage(null);
      setScanMessage('');
      setIsLoadingScan(false);
    };
  }, []);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {isAuthenticated && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            ref={modalRef}
            className="bg-white p-6 rounded-lg max-w-lg w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('add')}
                  className={`p-2 ${activeTab === 'add' ? 'font-bold' : ''}`}
                >
                  Add Recipe
                </button>
                <button
                  onClick={() => setActiveTab('scan')}
                  className={`p-2 ${activeTab === 'scan' ? 'font-bold' : ''}`}
                >
                  Scan Recipe
                </button>
              </div>
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
            ) : activeTab === 'add' ? (
              <AddRecipeForm onSubmit={handleAddRecipeSubmit} />
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

export default AddRecipeModal;
