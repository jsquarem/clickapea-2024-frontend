import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RecipeInfo from '../../components/RecipeInfo/RecipeInfo';
import ToggleSwitch from '../../components/ToggleSwitch/ToggleSwitch';
import Ingredients from '../../components/Ingredients/Ingredients';
import Equipment from '../../components/Equipment/Equipment';
import Instructions from '../../components/Instructions/Instructions';
import NutritionalInfo from '../../components/NutritionalInfo/NutritionalInfo';
import AddToProfileButton from '../../components/AddToProfileButton/AddToProfileButton';
import AddToCartButton from '../../components/AddToCartButton/AddToCartButton';
import AuthContext from '../../AuthContext';
import ImageUploadModal from '../../components/ImageUploadModal/ImageUploadModal';
import Loading from '../../components/Loading/Loading';
import {
  fetchRecipeById,
  fetchUserRecipeById,
  updateUserRecipeById,
  uploadAdditionalImage,
} from '../../utils/api';

import './RecipePage.css';

const RecipePage = (props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, login } = useContext(AuthContext);
  const [recipe, setRecipe] = useState(null);
  const [isMetric, setIsMetric] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedRecipe, setEditedRecipe] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [saveMessage, setSaveMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [visibleImageCount, setVisibleImageCount] = useState(5);
  const [mainImage, setMainImage] = useState('');
  const [displayImages, setDisplayImages] = useState([]);

  useEffect(() => {
    if (props.recipe) {
      setRecipe(props.recipe);
      setMainImage(props.recipe.image);
      setDisplayImages([props.recipe.image, ...props.recipe.additional_images]);
      setLoading(false);
    } else {
      if (window.location.pathname.includes('/user/')) {
        loadUserRecipeById(id);
      } else {
        loadRecipeById(id);
      }
    }

    const handleResize = () => {
      setVisibleImageCount(window.innerWidth < 768 ? 2 : 5);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [id, props.recipe]);

  const loadRecipeById = async (recipeId) => {
    try {
      const data = await fetchRecipeById(recipeId);
      setRecipe(data);
      setMainImage(data.image);

      const imagesArray = [data.image];
      if (Array.isArray(data.additional_images)) {
        imagesArray.push(...data.additional_images);
      }
      setDisplayImages(imagesArray);
    } catch (error) {
      console.error('Error fetching recipe:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadUserRecipeById = async (recipeId) => {
    try {
      const data = await fetchUserRecipeById(recipeId);
      setRecipe(data);
      setMainImage(data.image);

      const imagesArray = [data.image];
      if (Array.isArray(data.additional_images)) {
        imagesArray.push(...data.additional_images);
      }
      setDisplayImages(imagesArray);
    } catch (error) {
      console.error('Error fetching user recipe:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (isMetric) => {
    setIsMetric(isMetric);
  };

  const handleEditClick = () => {
    if (!isAuthenticated) {
      login();
    } else {
      setEditedRecipe({ ...recipe });
      setIsEditing(true);
    }
  };

  const handleSaveClick = async () => {
    if (validateInputs()) {
      try {
        const updatedRecipe = await updateUserRecipeById(
          recipe._id,
          editedRecipe
        );
        setRecipe(updatedRecipe);
        setEditedRecipe(updatedRecipe);
        setSaveMessage('Recipe saved successfully.');
        setIsEditing(false);
        setValidationError(null);
      } catch (error) {
        console.error('Error saving recipe:', error);
        setSaveMessage(`Error: ${error.message}`);
      }
    } else {
      setValidationError(
        'Please correct the errors in the form before saving.'
      );
    }
  };

  const handleInputChange = (field, value, subField = null, index = null) => {
    const newEditedRecipe = { ...editedRecipe };
    if (subField) {
      newEditedRecipe[field][subField] = value;
    } else if (index !== null) {
      newEditedRecipe[field][index] = value;
    } else {
      newEditedRecipe[field] = field === 'total_time' ? Number(value) : value;
    }
    setEditedRecipe(newEditedRecipe);

    if (field === 'total_time') {
      const isValid = value === '' || !isNaN(value);
      if (!isValid) {
        setValidationError('Total time must be a number.');
      } else {
        setValidationError(null);
      }
    }
  };

  const validateInputs = () => {
    let isValid = true;
    editedRecipe.ingredients.forEach((ingredient) => {
      const amount = isMetric ? ingredient.metric : ingredient.imperial;
      if (amount && isNaN(amount.quantity)) {
        isValid = false;
      }
    });
    if (isNaN(editedRecipe.total_time)) {
      isValid = false;
    }
    return isValid;
  };

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
    files.forEach((file) => {
      formData.append('images', file);
    });

    try {
      const updatedRecipe = await uploadAdditionalImage(recipe._id, formData);
      setRecipe(updatedRecipe);
      setDisplayImages([
        updatedRecipe.image,
        ...updatedRecipe.additional_images,
      ]);
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

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!recipe) {
    return <div>No recipe found.</div>;
  }

  const formatTotalTime = (totalTime) => {
    if (!totalTime) return 'N/A';
    const minutes = parseInt(totalTime, 10);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours
      ? `${hours} hrs ${remainingMinutes} mins`
      : `${remainingMinutes} mins`;
  };

  const canNavigatePrev = currentImageIndex > 0;
  const canNavigateNext =
    currentImageIndex + visibleImageCount < displayImages.length;

  return (
    <div className="text-gray-800 text-left">
      <main className="max-w-6xl mx-auto p-6 bg-white mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{recipe.title}</h2>
          {saveMessage && <div className="text-green-500">{saveMessage}</div>}
        </div>
        <div className="flex justify-between items-start mb-4">
          <RecipeInfo
            author={isEditing ? editedRecipe.author : recipe.author}
            host={isEditing ? editedRecipe.host : recipe.host}
            recipeUrl={isEditing ? editedRecipe.url : recipe.url}
            totalTime={
              isEditing
                ? editedRecipe.total_time
                : formatTotalTime(recipe.total_time)
            }
            servings={isEditing ? editedRecipe.yields : recipe.yields}
            isEditing={isEditing}
            onInputChange={handleInputChange}
          />
          <div className="flex flex-col">
            <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2">
              <AddToProfileButton
                recipeId={recipe._id}
                onUpdateRecipeId={handleUpdateRecipeId}
              />
              <AddToCartButton />
              {isEditing ? (
                <button
                  onClick={handleSaveClick}
                  className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded inline-flex items-center w-full lg:w-auto"
                >
                  <span>Save</span>
                </button>
              ) : (
                <div className="relative group">
                  <button
                    onClick={handleEditClick}
                    className={`font-bold py-2 px-4 rounded inline-flex items-center w-full lg:w-auto text-white ${isAuthenticated ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-500 cursor-not-allowed'}`}
                  >
                    <span>Edit</span>
                  </button>
                  {!isAuthenticated && (
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-full bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Please log in to edit
                    </div>
                  )}
                </div>
              )}
            </div>
            {validationError && (
              <div className="text-red-500 pt-2">{validationError}</div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap lg:flex-nowrap mb-6 min-h-[40rem]">
          <div className="w-full lg:w-1/2 lg:h-[32rem] h-full rounded-lg mb-4 lg:mb-0">
            <div className="relative h-full">
              <img
                src={mainImage}
                alt={recipe.title}
                className="rounded-lg cursor-pointer w-full h-[32rem] lg:h-full object-cover"
              />
              <div
                className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity rounded-lg cursor-pointer"
                onClick={handleImageClick}
              >
                <span className="text-white text-4xl">+</span>
              </div>
            </div>
            {displayImages.length > 1 && (
              <div className="w-full mt-4 flex justify-between items-center space-x-2">
                <button
                  onClick={handlePrevImage}
                  className={`h-full ${
                    canNavigatePrev
                      ? 'text-blue-500 hover:bg-blue-800'
                      : 'opacity-50 cursor-not-allowed text-gray-500'
                  } ${!canNavigatePrev ? '' : 'hover:bg-blue-100'} rounded-l-lg`}
                  disabled={!canNavigatePrev}
                >
                  <i className="fas fa-chevron-left text-2xl"></i>
                </button>
                <div className="flex flex-wrap justify-center space-x-2">
                  {displayImages
                    .slice(
                      currentImageIndex,
                      currentImageIndex + visibleImageCount
                    )
                    .map((image, index, arr) => (
                      <div
                        key={index}
                        className={`w-20 h-20 transform transition duration-300 ease-in-out hover:scale-105 cursor-pointer ${
                          index === 0 ? 'rounded-l-lg' : ''
                        } ${index === arr.length - 1 ? 'rounded-r-lg' : ''}`}
                        onClick={() => handleImageSelect(image)}
                      >
                        <img
                          src={image}
                          alt={`Additional ${index}`}
                          className={`w-full h-full object-cover ${
                            mainImage === image
                              ? 'border-4 border-blue-500'
                              : ''
                          }`}
                        />
                      </div>
                    ))}
                </div>
                <button
                  onClick={handleNextImage}
                  className={`h-full ${
                    canNavigateNext
                      ? 'text-blue-500 hover:bg-blue-800'
                      : 'opacity-50 cursor-not-allowed text-gray-500'
                  } ${!canNavigateNext ? '' : 'hover:bg-blue-100'} rounded-r-lg`}
                  disabled={!canNavigateNext}
                >
                  <i className="fas fa-chevron-right text-2xl"></i>
                </button>
              </div>
            )}
          </div>

          <section className="w-full lg:w-1/2 lg:pl-6 mt-6 lg:mt-0">
            <ToggleSwitch onToggle={handleToggle} />
            <Ingredients
              ingredients={
                isEditing ? editedRecipe.ingredients : recipe.ingredients
              }
              isMetric={isMetric}
              isEditing={isEditing}
              onInputChange={(e, index, field, subField) => {
                const newIngredients = [...editedRecipe.ingredients];
                if (subField) {
                  newIngredients[index][field][subField] = e.target.value;
                } else {
                  newIngredients[index][field] = e.target.value;
                }
                setEditedRecipe({
                  ...editedRecipe,
                  ingredients: newIngredients,
                });
              }}
            />
            <Equipment
              equipment={isEditing ? editedRecipe.equipment : recipe.equipment}
              isEditing={isEditing}
              onInputChange={(e, index) => {
                const newEquipment = [...editedRecipe.equipment];
                newEquipment[index] = e.target.value;
                setEditedRecipe({ ...editedRecipe, equipment: newEquipment });
              }}
            />
          </section>
        </div>
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-2/3">
            <Instructions
              instructions={
                isEditing ? editedRecipe.instructions : recipe.instructions
              }
              isEditing={isEditing}
              onInputChange={(e, index) => {
                const newInstructions = [...editedRecipe.instructions];
                newInstructions[index] = e.target.value;
                setEditedRecipe({
                  ...editedRecipe,
                  instructions: newInstructions,
                });
              }}
            />
          </div>
          <div className="lg:w-1/3 lg:ml-6 mt-6 lg:mt-0">
            <NutritionalInfo
              nutrients={isEditing ? editedRecipe.nutrients : recipe.nutrients}
              isEditing={isEditing}
              onInputChange={(e, field) => {
                setEditedRecipe({
                  ...editedRecipe,
                  nutrients: {
                    ...editedRecipe.nutrients,
                    [field]: e.target.value,
                  },
                });
              }}
            />
          </div>
        </div>
      </main>

      <ImageUploadModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onUpload={handleImageUpload}
      />
    </div>
  );
};

export default RecipePage;
