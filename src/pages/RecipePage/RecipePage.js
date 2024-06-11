import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RecipeInfo from '../../components/RecipeInfo/RecipeInfo';
import ToggleSwitch from '../../components/ToggleSwitch/ToggleSwitch';
import Ingredients from '../../components/Ingredients/Ingredients';
import Equipment from '../../components/Equipment/Equipment';
import Instructions from '../../components/Instructions/Instructions';
import NutritionalInfo from '../../components/NutritionalInfo/NutritionalInfo';
import AddToMyRecipesButton from '../../components/AddToMyRecipesButton/AddToMyRecipesButton';
import AddToCartButton from '../../components/AddToCartButton/AddToCartButton';
import AuthContext from '../../AuthContext';
import ImageUploadModal from '../../components/ImageUploadModal/ImageUploadModal';
import Loading from '../../components/Loading/Loading';
import {
  fetchRecipeById,
  fetchUserRecipeById,
  updateUserRecipeById,
  uploadAdditionalImage,
  uploadMainImage,
} from '../../utils/api';
import { PLACEHOLDER_SVG } from '../../utils/constants';
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
  const [completedIngredients, setCompletedIngredients] = useState([]);
  const [completedInstructions, setCompletedInstructions] = useState([]);
  const cardPositions = useRef({});
  const cardTiltAngles = useRef({});

  useEffect(() => {
    if (props.recipe) {
      console.log('props.recipe:', props.recipe);
      setRecipe(props.recipe);
      const image = props.recipe.image ? props.recipe.image : '';
      setMainImage(image);
      const imagesArray = [image, ...(props.recipe.additional_images || [])];
      setDisplayImages(imagesArray);
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

  useEffect(() => {
    if (!loading && recipe) {
      setInitialCardPositions();
    }
  }, [loading, recipe]);

  const setInitialCardPositions = () => {
    const cardIds = ['card1', 'card2', 'card3', 'card4', 'card5'];
    cardIds.forEach((cardId, index) => {
      const element = document.getElementById(cardId);
      if (element) {
        cardPositions.current[cardId] = element.offsetTop;
        const angle =
          (index % 2 === 0 ? -1 : 1) * (Math.floor(Math.random() * 5) + 1);
        cardTiltAngles.current[cardId] = angle;
      }
    });
  };

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
      const image = data.image ? data.image : '';
      setMainImage(image);

      const imagesArray = [image];
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
      setCompletedIngredients([]);
      setCompletedInstructions([]);
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
    const newDisplayImages = [...displayImages];
    const newFiles = [...(recipe.additional_images || [])];

    if (!mainImage && files.length > 0) {
      // If there is no main image and files are uploaded, upload the first image as the main image
      const mainImageFile = files[0];
      formData.append('images', mainImageFile);
      const imageUrl = URL.createObjectURL(mainImageFile);
      setMainImage(imageUrl);
      newDisplayImages.unshift(imageUrl);

      try {
        const updatedRecipe = await uploadMainImage(recipe._id, formData);
        setRecipe(updatedRecipe);
        setDisplayImages([
          updatedRecipe.image,
          ...updatedRecipe.additional_images,
        ]);
        if (!window.location.pathname.includes('/user/')) {
          handleUpdateRecipeId(updatedRecipe._id);
        }
      } catch (error) {
        console.error('Error uploading main image:', error);
      }
    } else {
      // If there is already a main image, upload all images as additional images
      files.forEach((file) => {
        formData.append('images', file);
        const imageUrl = URL.createObjectURL(file);
        newDisplayImages.push(imageUrl);
        newFiles.push(imageUrl);
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
        console.error('Error uploading additional images:', error);
      }
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

  const addIngredient = () => {
    const newIngredients = [
      ...editedRecipe.ingredients,
      {
        name: '',
        metric: { quantity: '', unit: '' },
        imperial: { quantity: '', unit: '' },
        other: { quantity: '', unit: '' },
      },
    ];
    setEditedRecipe({
      ...editedRecipe,
      ingredients: newIngredients,
    });
  };

  const addEquipment = () => {
    const newEquipment = [...editedRecipe.equipment, ''];
    setEditedRecipe({
      ...editedRecipe,
      equipment: newEquipment,
    });
  };

  const addInstruction = () => {
    const newInstructions = [...editedRecipe.instructions, ''];
    setEditedRecipe({
      ...editedRecipe,
      instructions: newInstructions,
    });
  };

  const removeIngredient = (index) => {
    const newIngredients = editedRecipe.ingredients.filter(
      (_, i) => i !== index
    );
    setEditedRecipe({ ...editedRecipe, ingredients: newIngredients });
  };

  const removeEquipment = (index) => {
    const newEquipment = editedRecipe.equipment.filter((_, i) => i !== index);
    setEditedRecipe({ ...editedRecipe, equipment: newEquipment });
  };

  const removeInstruction = (index) => {
    const newInstructions = editedRecipe.instructions.filter(
      (_, i) => i !== index
    );
    setEditedRecipe({ ...editedRecipe, instructions: newInstructions });
  };

  const toggleCompletedIngredient = (index) => {
    setCompletedIngredients((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleCompletedInstruction = (index) => {
    setCompletedInstructions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const scrollToCard = (cardId) => {
    const elementTop = cardPositions.current[cardId];
    if (elementTop !== undefined) {
      window.scrollTo({
        top: elementTop - 70,
        behavior: 'smooth',
      });
    }
  };

  const handleScroll = () => {
    if (window.innerWidth > 768) return; // Only apply tilt on mobile
    const scrollPosition = window.scrollY;
    const cardIds = ['card1', 'card2', 'card3', 'card4', 'card5'];
    cardIds.forEach((cardId) => {
      const element = document.getElementById(cardId);
      if (element) {
        const elementTop = cardPositions.current[cardId];
        const angle = cardTiltAngles.current[cardId];
        if (
          scrollPosition >= elementTop - 30 &&
          scrollPosition < elementTop + element.offsetHeight - 30
        ) {
          element.style.transform = `rotate(${angle}deg)`;
        } else {
          element.style.transform = `rotate(0deg)`;
        }
      }
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-[40vh] lg:min-h-[61vh]">
        <Loading />
      </div>
    );
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Row 1 */}
          <div className="bg-white p-4 rounded-lg lg:col-span-6">
            <RecipeInfo
              title={isEditing ? editedRecipe.title : recipe.title}
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
          </div>
          <div className="bg-white p-4 rounded-lg lg:col-span-6">
            <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2">
              <AddToMyRecipesButton
                recipeId={recipe._id}
                onUpdateRecipeId={handleUpdateRecipeId}
              />
              <AddToCartButton />
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveClick}
                    className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded inline-flex items-center w-full lg:w-auto"
                  >
                    <span>Save</span>
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded inline-flex items-center w-full lg:w-auto"
                  >
                    <span>Cancel</span>
                  </button>
                  <div className="text-green-500 pt-2">{saveMessage}</div>
                </>
              ) : (
                <div className="relative group">
                  <button
                    onClick={handleEditClick}
                    className={`font-bold py-2 px-4 rounded inline-flex items-center w-full lg:w-auto text-white ${isAuthenticated ? 'bg-[#37A0C5] hover:bg-blue-700' : 'bg-gray-500 cursor-not-allowed'}`}
                  >
                    <span>
                      <i className="fas fa-edit mr-2"></i>Edit
                    </span>
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

          {/* Row 2 */}
          <div
            id="card1"
            className="bg-[#ffbeb5] p-4 rounded-lg w-full lg:col-span-7 relative transform transition-transform duration-300 ease-in-out hover:scale-105"
          >
            <h3 className="text-xl font-semibold mb-2 cursor-pointer relative z-10 flex items-center">
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
                  right: 0, // Adjust this value to control how far it pokes out
                  top: -30, // Adjust this value to control how high it pokes out
                }}
              />
            </h3>
            <div className="h-full rounded-lg text-gray-300 relative z-0">
              <div className="relative">
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={recipe.title}
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
              {displayImages.length > 1 && (
                <div className="w-full mt-4 flex justify-between items-center space-x-2">
                  <button
                    onClick={handlePrevImage}
                    className={`h-20 w-12 ${canNavigatePrev ? 'text-blue-500 hover:text-blue-200 hover:bg-blue-500' : 'opacity-50 cursor-not-allowed text-gray-500'} ${!canNavigatePrev ? '' : 'hover:bg-blue-100'} rounded-l-lg`}
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
                    className={`h-20 w-12 ${canNavigateNext ? 'text-blue-500 hover:text-blue-200 hover:bg-blue-500' : 'opacity-50 cursor-not-allowed text-gray-500'} ${!canNavigateNext ? '' : 'hover:bg-blue-100'} rounded-r-lg`}
                    disabled={!canNavigateNext}
                  >
                    <i className="fas fa-chevron-right text-2xl"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
          <div
            id="card2"
            className="bg-[#FFF4C1] p-4 rounded-lg w-full lg:col-span-5 relative transform transition-transform duration-300 ease-in-out hover:scale-105"
          >
            <h3 className="text-xl font-semibold mb-2 cursor-pointer relative z-10 flex items-center">
              {isEditing ? (
                <button className="text-blue-500" onClick={addIngredient}>
                  <i className="fas fa-plus"></i> Add Ingredient
                </button>
              ) : (
                <a
                  href="#card2"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToCard('card2');
                  }}
                >
                  Ingredients
                </a>
              )}
              <img
                src="/assets/images/grocery.png"
                alt="Gallery"
                className="w-20 h-20 ml-2 -mt-4 transition-transform duration-300 ease-in-out card-hover-transform"
                style={{
                  position: 'absolute',
                  right: 0, // Adjust this value to control how far it pokes out
                  top: -30, // Adjust this value to control how high it pokes out
                }}
              />
            </h3>
            <div className="flex w-full justify-center">
              <ToggleSwitch onToggle={handleToggle} />
            </div>
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
              onRemove={removeIngredient}
              onToggleComplete={toggleCompletedIngredient}
              completedIngredients={completedIngredients}
            />
          </div>

          {/* Row 3 */}
          <div
            id="card3"
            className="bg-[#E6E6FA] p-4 rounded-lg w-full lg:col-span-7 relative transform transition-transform duration-300 ease-in-out hover:scale-105"
          >
            <h3 className="text-xl font-semibold mb-2 cursor-pointer relative z-10 flex items-center">
              {isEditing ? (
                <button
                  className="text-blue-500 hover:text-white hover:bg-blue-500 rounded-md p-2"
                  onClick={addInstruction}
                >
                  <i className="fas fa-plus"></i> Add Instruction
                </button>
              ) : (
                <a
                  href="#card3"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToCard('card3');
                  }}
                >
                  Instructions
                </a>
              )}
              <img
                src="/assets/images/workflow.png"
                alt="Gallery"
                className="w-20 h-20 ml-2 -mt-4 transition-transform duration-300 ease-in-out card-hover-transform"
                style={{
                  position: 'absolute',
                  right: 0, // Adjust this value to control how far it pokes out
                  top: -30, // Adjust this value to control how high it pokes out
                }}
              />
            </h3>
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
              onRemove={removeInstruction}
              onToggleComplete={toggleCompletedInstruction}
              completedInstructions={completedInstructions}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 lg:col-span-5">
            <div
              id="card4"
              className="bg-[#FFDAB9] p-4 rounded-lg w-full lg:col-span-7 relative transform transition-transform duration-300 ease-in-out hover:scale-105"
            >
              <h3 className="text-xl font-semibold mb-2 cursor-pointer relative z-10 flex items-center">
                {isEditing ? (
                  <button className="text-blue-500" onClick={addEquipment}>
                    <i className="fas fa-plus"></i> Add Equipment
                  </button>
                ) : (
                  <a
                    href="#card4"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToCard('card4');
                    }}
                  >
                    Equipment
                  </a>
                )}
                <img
                  src="/assets/images/kitchen-tool.png"
                  alt="Gallery"
                  className="w-20 h-20 ml-2 -mt-4 transition-transform duration-300 ease-in-out card-hover-transform"
                  style={{
                    position: 'absolute',
                    right: 0, // Adjust this value to control how far it pokes out
                    top: -30, // Adjust this value to control how high it pokes out
                  }}
                />
              </h3>
              <Equipment
                equipment={
                  isEditing ? editedRecipe.equipment : recipe.equipment
                }
                isEditing={isEditing}
                onInputChange={(e, index) => {
                  const newEquipment = [...editedRecipe.equipment];
                  newEquipment[index] = e.target.value;
                  setEditedRecipe({ ...editedRecipe, equipment: newEquipment });
                }}
                onRemove={removeEquipment}
                colorClass=""
              />
            </div>
            <div
              id="card5"
              className="bg-[#B0E0E6]  p-4 rounded-lg w-full lg:col-span-7 relative transform transition-transform duration-300 ease-in-out hover:scale-105"
            >
              <h3 className="text-xl font-semibold mb-2 cursor-pointer relative z-10 flex items-center">
                <a
                  href="#card5"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToCard('card5');
                  }}
                >
                  Nutrition
                </a>
                <img
                  src="/assets/images/nutritional-pyramid.png"
                  alt="Gallery"
                  className="w-20 h-20 ml-2 -mt-4 transition-transform duration-300 ease-in-out card-hover-transform"
                  style={{
                    position: 'absolute',
                    right: 0, // Adjust this value to control how far it pokes out
                    top: -30, // Adjust this value to control how high it pokes out
                  }}
                />
              </h3>
              <NutritionalInfo
                nutrients={
                  isEditing ? editedRecipe.nutrients : recipe.nutrients
                }
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
