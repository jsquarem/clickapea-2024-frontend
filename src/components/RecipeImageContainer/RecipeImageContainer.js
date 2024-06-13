import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUploadModal from '../ImageUploadModal/ImageUploadModal';
import { uploadRecipeImages } from '../../utils/api';
import { PLACEHOLDER_SVG } from '../../utils/constants';

const RecipeImageContainer = ({ images, recipeId, scrollToCard }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mainImage, setMainImage] = useState(images ? images[0] : '');
  const [displayImages, setDisplayImages] = useState(images || []);
  const [visibleImageCount, setVisibleImageCount] = useState(5);

  const handleUpdateRecipeId = (newRecipeId) => {
    navigate(`/recipe/user/${newRecipeId}`);
  };

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleImageUpload = async (files) => {
    const formData = new FormData();
    const newDisplayImages = [...displayImages];

    files.forEach((file) => {
      formData.append('images', file);
      const imageUrl = URL.createObjectURL(file);
      newDisplayImages.push(imageUrl);
    });

    try {
      const updatedRecipe = await uploadRecipeImages(recipeId, formData);
      setMainImage(updatedRecipe.images[0]);
      setDisplayImages(updatedRecipe.images);
      if (!window.location.pathname.includes('/user/')) {
        handleUpdateRecipeId(updatedRecipe._id);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  const handleNextImage = () => {
    if (currentImageIndex + visibleImageCount < displayImages.length) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleImageSelect = (image) => {
    setMainImage(image);
  };

  useEffect(() => {
    if (images.length > 0) {
      setMainImage(images[0]);
      setDisplayImages(images);
    }

    const handleResize = () => {
      setVisibleImageCount(window.innerWidth < 768 ? 2 : 5);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [images]);

  return (
    <div id="card1">
      <h3 className="text-3xl lg:text-4xl font-semibold mb-2 cursor-pointer relative z-10 flex items-center">
        <a
          href="#card1"
          onClick={(e) => {
            e.preventDefault();
            scrollToCard('card1');
          }}
        >
          Images
        </a>
        <img
          src="/assets/images/gallery.png"
          alt="Gallery"
          className="w-20 h-20 ml-2 -mt-4 transition-transform duration-300 ease-in-out card-hover-transform"
          style={{
            position: 'absolute',
            right: 0,
            top: -30,
          }}
        />
      </h3>
      <div className="h-full rounded-lg text-gray-300 relative z-0">
        <div className="relative">
          {mainImage ? (
            <img
              src={mainImage}
              alt="Main"
              className="rounded-lg cursor-pointer w-full max-h-[24rem] object-cover"
            />
          ) : (
            <div className="w-full max-h-[24rem] flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1024 1024"
                className="w-full h-full"
              >
                <path d={PLACEHOLDER_SVG} fill="currentColor" />
              </svg>
            </div>
          )}
          <div
            className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity rounded-lg cursor-pointer"
            onClick={handleImageClick}
          >
            <span className="text-white text-4xl">+</span>
          </div>
        </div>
        {displayImages.length > 0 && (
          <div className="w-full mt-4 flex justify-between items-center space-x-2">
            <button
              onClick={handlePrevImage}
              className={`h-20 w-12 ${currentImageIndex > 0 ? 'text-blue-500 hover:text-blue-200 hover:bg-blue-500' : 'opacity-50 cursor-not-allowed text-gray-500'} rounded-l-lg`}
              disabled={currentImageIndex <= 0}
            >
              <i className="fas fa-chevron-left text-2xl"></i>
            </button>
            <div className="flex flex-wrap justify-center space-x-2">
              {displayImages
                .slice(currentImageIndex, currentImageIndex + visibleImageCount)
                .map((image, index, arr) => (
                  <div
                    key={index}
                    className={`w-20 h-20 transform transition duration-300 ease-in-out hover:scale-110 cursor-pointer ${index === 0 ? 'rounded-l-lg' : ''} ${index === arr.length - 1 ? 'rounded-r-lg' : ''}`}
                    onClick={() => handleImageSelect(image)}
                  >
                    <img
                      src={image}
                      alt={`Additional ${index}`}
                      className={`w-full h-full object-cover rounded-lg ${mainImage === image ? 'border-4 border-[#fd7563]' : ''}`}
                    />
                  </div>
                ))}
            </div>
            <button
              onClick={handleNextImage}
              className={`h-20 w-12 ${currentImageIndex + visibleImageCount < displayImages.length ? 'text-blue-500 hover:text-blue-200 hover:bg-blue-500' : 'opacity-50 cursor-not-allowed text-gray-500'} rounded-r-lg`}
              disabled={
                currentImageIndex + visibleImageCount >= displayImages.length
              }
            >
              <i className="fas fa-chevron-right text-2xl"></i>
            </button>
          </div>
        )}
      </div>
      <ImageUploadModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onUpload={handleImageUpload}
      />
    </div>
  );
};

export default RecipeImageContainer;
