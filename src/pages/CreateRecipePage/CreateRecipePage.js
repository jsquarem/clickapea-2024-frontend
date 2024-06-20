import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import RecipeInfo from '../../components/RecipeInfo/RecipeInfo';
import ToggleSwitch from '../../components/ToggleSwitch/ToggleSwitch';
import Ingredients from '../../components/Ingredients/Ingredients';
import Equipment from '../../components/Equipment/Equipment';
import Instructions from '../../components/Instructions/Instructions';
import ImageUploadModal from '../../components/ImageUploadModal/ImageUploadModal';
import LoginModal from '../../components/LoginModal/LoginModal';
import Loading from '../../components/Loading/Loading';
import AuthContext from '../../AuthContext';
import { createRecipe } from '../../utils/api';
import { PLACEHOLDER_SVG } from '../../utils/constants';
import AddRecipeModal from '../../components/AddRecipeModal/AddRecipeModal';
import './CreateRecipePage.css';

const CreateRecipePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useContext(AuthContext);

  const initialIngredients = location.state?.ingredients || [];
  const initialInstructions = location.state?.instructions || [];
  const initialImage = location.state?.image || '';

  const [recipe, setRecipe] = useState({
    title: '',
    author: `${user ? user.name : ''}`,
    host: '',
    url: '',
    total_time: '',
    yields: '',
    image: initialImage,
    additional_images: [],
    ingredients: initialIngredients,
    equipment: [],
    instructions: initialInstructions,
  });

  const [isMetric, setIsMetric] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [saveMessage, setSaveMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [mainImage, setMainImage] = useState(initialImage);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [displayImages, setDisplayImages] = useState([initialImage]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [visibleImageCount, setVisibleImageCount] = useState(5);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [isLoadingScan] = useState(false);
  const [scanImage] = useState(null);
  const [isScanned] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setVisibleImageCount(window.innerWidth < 768 ? 2 : 5);
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (recipe.image) {
      setMainImage(recipe.image);
      setDisplayImages([
        recipe.image,
        ...recipe.additional_images.map((img) => img.url),
      ]);
    } else {
      setMainImage('');
      setDisplayImages([]);
    }
  }, [recipe]);

  useEffect(() => {
    console.log('isLoadingScan updated:', isLoadingScan);
  }, [isLoadingScan]);

  useEffect(() => {
    console.log('isScanned updated:', isScanned);
  }, [isScanned]);

  const handleToggle = (isMetric) => {
    setIsMetric(isMetric);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleSaveClick = async () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    if (recipe.title.trim() === '') {
      setValidationError('Title is required.');
      return;
    }

    if (validateInputs()) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('title', recipe.title);
        formData.append('author', recipe.author);
        formData.append('host', recipe.host);
        formData.append('url', recipe.url);
        formData.append('total_time', recipe.total_time);
        formData.append('yields', recipe.yields);
        if (mainImageFile) formData.append('image', mainImageFile);

        recipe.additional_images.forEach((image, index) => {
          if (image.file) {
            formData.append('additional_images', image.file);
          }
        });

        formData.append('ingredients', JSON.stringify(recipe.ingredients));
        formData.append('equipment', JSON.stringify(recipe.equipment));
        formData.append('instructions', JSON.stringify(recipe.instructions));

        const createdRecipe = await createRecipe(formData);
        setSaveMessage('Recipe created successfully.');
        navigate(`/recipe/user/${createdRecipe._id}`);
      } catch (error) {
        console.error('Error creating recipe:', error);
        setSaveMessage(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    } else {
      setValidationError(
        'Please correct the errors in the form before saving.'
      );
    }
  };

  const handleImageUpload = (files) => {
    const newDisplayImages = [...displayImages];
    const newFiles = [...recipe.additional_images];

    files.forEach((file, index) => {
      const imageUrl = URL.createObjectURL(file);
      const imageObj = { url: imageUrl, file };

      if (!mainImage && index === 0) {
        setMainImage(imageUrl);
        setMainImageFile(file);
        newDisplayImages.unshift(imageUrl);
      } else {
        newDisplayImages.push(imageUrl);
        newFiles.push(imageObj);
      }
    });

    setDisplayImages(newDisplayImages);
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      images: newDisplayImages[0],
      additional_images: newFiles,
    }));
  };

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleInputChange = (field, value, subField = null, index = null) => {
    const newRecipe = { ...recipe };
    if (subField) {
      newRecipe[field][subField] = value;
    } else if (index !== null) {
      newRecipe[field][index] = value;
    } else {
      newRecipe[field] = field === 'total_time' ? Number(value) : value;
    }
    setRecipe(newRecipe);

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
    recipe.ingredients.forEach((ingredient) => {
      const amount = isMetric ? ingredient.metric : ingredient.imperial;
      if (amount && isNaN(amount.quantity)) {
        isValid = false;
      }
    });
    if (isNaN(recipe.total_time)) {
      isValid = false;
    }
    return isValid;
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleNextImage = () => {
    if (currentImageIndex < displayImages.length - visibleImageCount) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleImageSelect = (image, e) => {
    e.stopPropagation();
    setMainImage(image);
  };

  const addIngredient = () => {
    setRecipe({
      ...recipe,
      ingredients: [
        ...recipe.ingredients,
        {
          name: '',
          metric: { quantity: '', unit: '' },
          imperial: { quantity: '', unit: '' },
          other: { quantity: '', unit: '' },
        },
      ],
    });
  };

  const addEquipment = () => {
    setRecipe({
      ...recipe,
      equipment: [...recipe.equipment, ''],
    });
  };

  const addInstruction = () => {
    setRecipe({
      ...recipe,
      instructions: [...recipe.instructions, ''],
    });
  };

  const removeIngredient = (index) => {
    const newIngredients = recipe.ingredients.filter((_, i) => i !== index);
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  const removeEquipment = (index) => {
    const newEquipment = recipe.equipment.filter((_, i) => i !== index);
    setRecipe({ ...recipe, equipment: newEquipment });
  };

  const removeInstruction = (index) => {
    const newInstructions = recipe.instructions.filter((_, i) => i !== index);
    setRecipe({ ...recipe, instructions: newInstructions });
  };

  if (loading) {
    return (
      <div className="min-h-[40vh] lg:min-h-[61vh]">
        <Loading />
      </div>
    );
  }

  return (
    <div className="text-gray-800 text-left">
      <main className="max-w-6xl mx-auto p-6 bg-white mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Create New Recipe</h2>
          {saveMessage && <div className="text-green-500">{saveMessage}</div>}
        </div>
        <div className="flex flex-col lg:flex-row w-full">
          <div className="flex justify-between items-start mb-4 w-full lg:w-1/2">
            <RecipeInfo
              author={recipe.author}
              host={recipe.host}
              recipeUrl={recipe.url}
              totalTime={recipe.total_time}
              servings={recipe.yields}
              isEditing={true}
              isCreating={true}
              onInputChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col w-full lg:w-1/2 pb-4">
            <div className="flex flex-row justify-end gap-2">
              <button
                onClick={toggleModal} // Add button to open AddRecipeModal
                className="hover:bg-[#c4985b] bg-yellow-500 text-white hover:text-[#db9585] lg:mx-auto font-bold w-6/12 lg:w-6/12 py-2 px-4 lg:py-5 lg:px-20 text-center rounded-lg"
              >
                Add Recipe
              </button>
              <button
                onClick={handleSaveClick}
                className="bg-[#1EB17C] hover:bg-[#67cfa9] text-white lg:mx-auto font-bold w-6/12 lg:w-4/12 py-2 px-4 lg:py-4 lg:px-20 rounded-lg text-center"
              >
                Save
              </button>
            </div>
            {validationError && (
              <div className="text-red-500 pt-2 text-right">
                {validationError}
              </div>
            )}
            {isScanned ? (
              <div className="w-full text-left p-2">
                <div className="flex flex-row">
                  <div className="flex justify-center items-center p-4">
                    <i className="fas fa-check text-5xl font-bold text-green-500"></i>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">
                      Recipe Successfully Scanned
                    </h3>
                    <p>
                      Just add additional details and images, double check the
                      ingredients and instructions are accurate, and click save
                      to add your new recipe!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
        <div className="flex flex-col mb-6 min-h-[38rem]">
          <div className="h-full text-gray-300 relative z-0">
            <div className="relative">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt="Main"
                  className="cursor-pointer w-full max-h-[40rem] object-cover"
                />
              ) : (
                // <div className="w-full max-h-[24rem] flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1024 1024"
                  className="cursor-pointer w-full max-h-[50rem] object-cover"
                >
                  <path d={PLACEHOLDER_SVG} fill="currentColor" />
                </svg>
                // </div>
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
                  className={`h-20 w-12 ${currentImageIndex > 0 ? 'text-[#37A0C5] hover:text-white hover:bg-[#37A0C5]' : 'opacity-50 cursor-not-allowed text-gray-500'} rounded-l-lg`}
                  disabled={currentImageIndex <= 0}
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
                  className={`h-20 w-12 ${currentImageIndex + visibleImageCount < displayImages.length ? 'text-[#37A0C5] hover:text-white hover:bg-[#37A0C5]' : 'opacity-50 cursor-not-allowed text-gray-500'} rounded-r-lg`}
                  disabled={
                    currentImageIndex + visibleImageCount >=
                    displayImages.length
                  }
                >
                  <i className="fas fa-chevron-right text-2xl"></i>
                </button>
              </div>
            )}
          </div>

          <section className="w-full mt-6 lg:mt-0">
            {recipe.ingredients.length > 0 ? (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-4xl font-semibold">
                    <button className="text-[#37A0C5]" onClick={addIngredient}>
                      <i className="fas fa-plus"></i> Add Ingredient
                    </button>
                  </h3>
                  <ToggleSwitch onToggle={handleToggle} />
                </div>
                <Ingredients
                  ingredients={recipe.ingredients}
                  isMetric={isMetric}
                  isEditing={true}
                  onInputChange={(e, index, field, subField) => {
                    const newIngredients = [...recipe.ingredients];
                    if (subField) {
                      newIngredients[index][field][subField] = e.target.value;
                    } else {
                      newIngredients[index][field] = e.target.value;
                    }
                    setRecipe({
                      ...recipe,
                      ingredients: newIngredients,
                    });
                  }}
                  onRemove={removeIngredient}
                />
              </>
            ) : (
              <section onClick={addIngredient} className="mb-6 cursor-pointer">
                <div className="mb-4 flex items-center justify-center h-96 hover:bg-gray-300 bg-gray-200 w-full rounded-lg border border-dashed border-gray-400">
                  <h3 className="text-4xl font-semibold text-center items-center text-[#37A0C5]">
                    <i className="fas fa-plus"></i> Add Ingredients
                  </h3>
                </div>
              </section>
            )}
            {recipe.equipment.length > 0 ? (
              <section className="mb-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-4xl font-semibold">
                    <button onClick={addEquipment} className="text-[#37A0C5]">
                      <i className="fas fa-plus"></i> Add Equipment
                    </button>
                  </h3>
                </div>
                <Equipment
                  equipment={recipe.equipment}
                  isEditing={true}
                  onInputChange={(e, index) => {
                    const newEquipment = [...recipe.equipment];
                    newEquipment[index] = e.target.value;
                    setRecipe({ ...recipe, equipment: newEquipment });
                  }}
                  onRemove={removeEquipment}
                />
              </section>
            ) : (
              <section onClick={addEquipment} className="mb-6 cursor-pointer">
                <div className="mb-4 h-48 flex items-center justify-center rounded-lg hover:bg-gray-300 bg-gray-200 border border-dashed border-gray-400">
                  <h3 className="text-4xl font-semibold">
                    <button className="text-[#37A0C5]">
                      <i className="fas fa-plus"></i> Add Equipment
                    </button>
                  </h3>
                </div>
              </section>
            )}
          </section>
        </div>

        {recipe.instructions.length > 0 ? (
          <div className="flex flex-col">
            <div className="w-full">
              <section className="mb-6 min-h-48">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-4xl font-semibold">
                    <button className="text-[#37A0C5]" onClick={addInstruction}>
                      <i className="fas fa-plus"></i> Add Instruction
                    </button>
                  </h3>
                </div>
                <Instructions
                  instructions={recipe.instructions}
                  isEditing={true}
                  onInputChange={(e, index) => {
                    const newInstructions = [...recipe.instructions];
                    newInstructions[index] = e.target.value;
                    setRecipe({
                      ...recipe,
                      instructions: newInstructions,
                    });
                  }}
                  onRemove={removeInstruction}
                />
              </section>
            </div>
            <div className="lg:w-1/3 lg:ml-6 mt-6 lg:mt-0"></div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row">
            <section
              onClick={addInstruction}
              className="mb-6 w-full cursor-pointer"
            >
              <div className="mb-4 flex items-center justify-center h-48 rounded-lg hover:bg-gray-300 bg-gray-200 border border-dashed border-gray-400 w-full">
                <h3 className="text-4xl font-semibold">
                  <button className="text-[#37A0C5]">
                    <i className="fas fa-plus"></i> Add Instructions
                  </button>
                </h3>
              </div>
            </section>
          </div>
        )}
      </main>

      <ImageUploadModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onUpload={handleImageUpload}
        isLoadingScan={isLoadingScan}
        scanImage={scanImage}
        scanMessage={''}
      />

      {showModal && (
        <AddRecipeModal isOpen={showModal} onClose={toggleModal} /> // Add AddRecipeModal component
      )}

      {/* <ImageUploadModal
        isOpen={isScanModalOpen}
        onClose={handleScanModalClose}
        onUpload={handleScanImageUpload}
        isLoadingScan={isLoadingScan}
        scanImage={scanImage}
        scanMessage={'Scanning Recipe:'}
      /> */}

      {!isAuthenticated && (
        <LoginModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </div>
  );
};

export default CreateRecipePage;
