import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeInfo from '../../components/RecipeInfo/RecipeInfo';
import ToggleSwitch from '../../components/ToggleSwitch/ToggleSwitch';
import Ingredients from '../../components/Ingredients/Ingredients';
import Equipment from '../../components/Equipment/Equipment';
import Instructions from '../../components/Instructions/Instructions';
import ImageUploadModal from '../../components/ImageUploadModal/ImageUploadModal';
import Loading from '../../components/Loading/Loading';
import {
  createRecipe,
  uploadMainImage,
  uploadAdditionalImage,
} from '../../utils/api';

import './CreateRecipePage.css';

const CreateRecipePage = () => {
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({
    title: '',
    author: '',
    host: '',
    url: '',
    total_time: '',
    yields: '',
    image: '',
    additional_images: [],
    ingredients: [],
    equipment: [],
    instructions: [],
  });
  const [isMetric, setIsMetric] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [saveMessage, setSaveMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mainImage, setMainImage] = useState('');
  const [displayImages, setDisplayImages] = useState([]);

  const handleToggle = (isMetric) => {
    setIsMetric(isMetric);
  };

  const handleSaveClick = async () => {
    if (validateInputs()) {
      setLoading(true);
      try {
        const createdRecipe = await createRecipe(recipe);
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
      let updatedRecipe;
      if (!mainImage) {
        // If there's no main image, upload the main image
        updatedRecipe = await uploadMainImage(recipe._id, formData);
        setMainImage(updatedRecipe.image);
      } else {
        updatedRecipe = await uploadAdditionalImage(recipe._id, formData);
      }
      setRecipe(updatedRecipe);
      setDisplayImages([
        updatedRecipe.image,
        ...updatedRecipe.additional_images,
      ]);
    } catch (error) {
      console.error('Error uploading images:', error);
    }
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

  const addImage = () => {
    handleImageClick();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="text-gray-800 text-left">
      <main className="max-w-6xl mx-auto p-6 bg-white mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Create New Recipe</h2>
          {saveMessage && <div className="text-green-500">{saveMessage}</div>}
        </div>
        <div className="flex justify-between items-start mb-4">
          <RecipeInfo
            author={recipe.author}
            host={recipe.host}
            recipeUrl={recipe.url}
            totalTime={recipe.total_time}
            servings={recipe.yields}
            isEditing={true}
            onInputChange={handleInputChange}
          />
          <div className="flex flex-col">
            <button
              onClick={handleSaveClick}
              className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded inline-flex items-center w-full lg:w-auto"
            >
              <span>Save</span>
            </button>
            {validationError && (
              <div className="text-red-500 pt-2">{validationError}</div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap lg:flex-nowrap mb-6 min-h-[34rem]">
          <div className="w-full lg:w-1/2 lg:h-[32rem] h-full rounded-lg mb-4 lg:mb-0">
            <div className="relative h-full flex justify-center items-center bg-gray-100 border border-dashed border-gray-300 rounded-lg">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={recipe.title}
                  className="rounded-lg cursor-pointer w-full h-[32rem] lg:h-full object-cover"
                  onClick={handleImageClick}
                />
              ) : (
                <div
                  className="flex flex-col justify-center items-center text-gray-500 cursor-pointer"
                  onClick={handleImageClick}
                >
                  <span className="text-6xl">+</span>
                  <p className="text-lg">Click to add an image</p>
                </div>
              )}
              {mainImage && (
                <div
                  className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity rounded-lg cursor-pointer"
                  onClick={handleImageClick}
                >
                  <span className="text-white text-4xl">+</span>
                </div>
              )}
            </div>
            {displayImages.length > 1 && (
              <div className="w-full mt-4 flex justify-between items-center space-x-2">
                <div className="flex flex-wrap justify-center space-x-2">
                  {displayImages.map((image, index) => (
                    <div
                      key={index}
                      className={`w-20 h-20 transform transition duration-300 ease-in-out hover:scale-105 cursor-pointer`}
                      onClick={() => setMainImage(image)}
                    >
                      <img
                        src={image}
                        alt={`Additional ${index}`}
                        className={`w-full h-full object-cover ${
                          mainImage === image ? 'border-4 border-blue-500' : ''
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <section className="w-full lg:w-1/2 lg:pl-6 mt-6 lg:mt-0">
            <section className="mb-6">
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
            <section className="mb-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                  <button className="text-blue-500" onClick={addEquipment}>
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
          </section>
        </div>
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-2/3">
            <section className="mb-6">
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
      </main>

      <ImageUploadModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onUpload={handleImageUpload}
      />
    </div>
  );
};

export default CreateRecipePage;
