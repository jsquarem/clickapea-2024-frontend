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
import { createRecipe, scanRecipe } from '../../utils/api';
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
  const [mainImage, setMainImage] = useState(initialImage);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [displayImages, setDisplayImages] = useState([initialImage]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [visibleImageCount, setVisibleImageCount] = useState(5);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoadingScan, setIsLoadingScan] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [scanImage, setScanImage] = useState(null);
  const [isScanned, setIsScanned] = useState(false);

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
      image: newDisplayImages[0],
      additional_images: newFiles,
    }));
  };

  const handleScanRecipeClick = () => {
    setIsScanModalOpen(true);
  };

  const handleScanImageUpload = async (files) => {
    setIsLoadingScan(true);
    const file = files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setScanImage(imageUrl);
      // setIsScanModalOpen(false);

      const formData = new FormData();
      formData.append('imageFile', file);

      try {
        const result = await scanRecipe(formData);
        setRecipe((prevRecipe) => ({
          ...prevRecipe,
          ingredients: result.ingredients,
          instructions: result.instructions,
        }));
        handleImageUpload([file]); // Add the scanned image as the main or additional image
        setIsScanModalOpen(false);
      } catch (error) {
        console.error('Error scanning recipe:', error);
      } finally {
        setIsLoadingScan(false);
      }
    }
    setIsScanned(true);
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

  const handleMainImageClick = (e) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleScanModalClose = () => {
    setIsScanModalOpen(false);
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

  const canNavigatePrev = displayImages.length > 1 && currentImageIndex > 0;
  const canNavigateNext =
    displayImages.length > 1 &&
    currentImageIndex + visibleImageCount < displayImages.length;

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
                onClick={handleScanRecipeClick}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center w-full lg:w-auto"
              >
                <span>Scan Recipe</span>
              </button>
              <button
                onClick={handleSaveClick}
                className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded inline-flex items-center w-full lg:w-auto"
              >
                <span>Save</span>
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
        <div className="flex flex-wrap lg:flex-nowrap mb-6 min-h-[38rem]">
          <div className="w-full lg:w-1/2 lg:h-[32rem] h-full rounded-lg mb-4 lg:mb-0 cursor-pointer">
            <div
              className={`relative h-full pt-4 ${
                !mainImage
                  ? 'hover:bg-gray-300 bg-gray-200 border border-dashed border-gray-400'
                  : ''
              } rounded-lg flex justify-center items-center`}
              onClick={handleMainImageClick}
            >
              {mainImage ? (
                <>
                  <img
                    src={mainImage}
                    alt={recipe.title}
                    className="rounded-lg cursor-pointer w-full h-[18rem] lg:h-[32rem] object-cover"
                  />
                  <div
                    className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity rounded-lg cursor-pointer"
                    onClick={handleMainImageClick}
                  >
                    <span className="text-white text-4xl">+</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between h-[18rem] lg:h[24rem]">
                  <h3 className="text-3xl font-semibold text-blue-500">
                    <i className="fas fa-plus"></i> Add an Image
                  </h3>
                </div>
              )}
            </div>
            <div className="w-full mt-4 flex justify-between items-center space-x-2 min-h-28">
              <button
                onClick={handlePrevImage}
                className={`flex items-center justify-center h-20 w-12 rounded-l-lg ${
                  canNavigatePrev
                    ? 'text-blue-500 hover:text-blue-200 hover:bg-blue-500'
                    : 'opacity-50 cursor-not-allowed text-gray-500'
                } ${!canNavigatePrev ? '' : 'hover:bg-blue-100'}`}
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
                      className={`w-20 h-20 transform transition duration-300 ease-in-out hover:scale-105 cursor-pointer`}
                      onClick={(e) => handleImageSelect(image, e)}
                    >
                      <img
                        src={image}
                        alt={`Additional ${index}`}
                        className={`w-full h-full object-cover ${
                          mainImage === image
                            ? 'border-4 border-blue-500 rounded-lg'
                            : ''
                        }`}
                      />
                    </div>
                  ))}
              </div>
              <button
                onClick={handleNextImage}
                className={`h-20 flex items-center justify-center w-12 rounded-r-lg ${
                  canNavigateNext
                    ? 'text-blue-500 hover:text-blue-200 hover:bg-blue-500'
                    : 'opacity-50 cursor-not-allowed text-gray-500'
                } ${!canNavigateNext ? '' : 'hover:bg-blue-100'}`}
                disabled={!canNavigateNext}
              >
                <i className="fas fa-chevron-right text-2xl"></i>
              </button>
            </div>
          </div>

          <section className="w-full lg:w-1/2 lg:pl-6 mt-6 lg:mt-0">
            {recipe.ingredients.length > 0 ? (
              <section className="mb-6 min-h-96">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-semibold">
                    <button className="text-blue-500" onClick={addIngredient}>
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
              </section>
            ) : (
              <section onClick={addIngredient} className="mb-6 cursor-pointer">
                <div className="mb-4 flex items-center justify-center h-96 hover:bg-gray-300 bg-gray-200 w-full rounded-lg border border-dashed border-gray-400">
                  <h3 className="text-2xl font-semibold text-center items-center text-blue-500">
                    <i className="fas fa-plus"></i> Add Ingredients
                  </h3>
                </div>
              </section>
            )}
            {recipe.equipment.length > 0 ? (
              <section className="mb-6 min-h-48">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-semibold">
                    <button onClick={addEquipment} className="text-blue-500">
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
                  <h3 className="text-xl font-semibold">
                    <button className="text-blue-500">
                      <i className="fas fa-plus"></i> Add Equipment
                    </button>
                  </h3>
                </div>
              </section>
            )}
          </section>
        </div>

        {recipe.instructions.length > 0 ? (
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-2/3">
              <section className="mb-6 min-h-48">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-semibold">
                    <button className="text-blue-500" onClick={addInstruction}>
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
                <h3 className="text-xl font-semibold">
                  <button className="text-blue-500">
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

      <ImageUploadModal
        isOpen={isScanModalOpen}
        onClose={handleScanModalClose}
        onUpload={handleScanImageUpload}
        isLoadingScan={isLoadingScan}
        scanImage={scanImage}
        scanMessage={'Scanning Recipe:'}
      />

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
