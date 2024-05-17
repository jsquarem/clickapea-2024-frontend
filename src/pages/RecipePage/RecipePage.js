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
import {
  fetchRecipeById,
  fetchUserRecipeById,
  updateUserRecipeById,
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

  useEffect(() => {
    if (props.recipe) {
      setRecipe(props.recipe);
      setLoading(false);
    } else {
      if (window.location.pathname.includes('/user/')) {
        loadUserRecipeById(id);
      } else {
        loadRecipeById(id);
      }
    }
  }, [id, props.recipe]);

  const loadRecipeById = async (recipeId) => {
    try {
      const data = await fetchRecipeById(recipeId);
      setRecipe(data);
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

  if (loading) {
    return <div>Loading...</div>;
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

  return (
    <div className="bg-gray-100 text-gray-800 text-left">
      <main className="max-w-6xl mx-auto p-6 bg-white shadow-md mt-6 rounded-lg">
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
                  <i className="fas fa-save mr-2"></i>
                  <span>Save</span>
                </button>
              ) : (
                <div className="relative group">
                  <button
                    onClick={handleEditClick}
                    className={`font-bold py-2 px-4 rounded inline-flex items-center w-full lg:w-auto text-white ${isAuthenticated ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-500 cursor-not-allowed'}`}
                  >
                    <i className="fas fa-edit mr-2"></i>
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
        <div className="flex flex-wrap lg:flex-nowrap mb-6">
          <div
            className={`w-full lg:w-1/2 h-64 lg:h-auto rounded-lg mb-4 lg:mb-0 ${
              recipe.image ? 'bg-cover bg-center' : 'bg-gray-300'
            }`}
            style={{
              backgroundImage: recipe.image ? `url("${recipe.image}")` : 'none',
            }}
          ></div>
          <section className="w-full lg:w-1/2 lg:pl-6">
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
    </div>
  );
};

export default RecipePage;
