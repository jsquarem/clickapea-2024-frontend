import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RecipeInfo from '../../components/RecipeInfo/RecipeInfo';
import AddToMyRecipesButton from '../../components/AddToMyRecipesButton/AddToMyRecipesButton';
import AddToCartButton from '../../components/AddToCartButton/AddToCartButton';
import AuthContext from '../../AuthContext';
import Loading from '../../components/Loading/Loading';
import {
  fetchRecipeById,
  fetchUserRecipeById,
  updateUserRecipeById,
} from '../../utils/api';
import './RecipePage.css';
import RecipeImageContainer from '../../components/RecipeImageContainer/RecipeImageContainer';
import IngredientsContainer from '../../components/IngredientsContainer/IngredientsContainer';
import InstructionsContainer from '../../components/InstructionsContainer/InstructionsContainer';
import EquipmentContainer from '../../components/EquipmentContainer/EquipmentContainer';
import NutritionalInfoContainer from '../../components/NutritionalInfoContainer/NutritionalInfoContainer';

const RecipePage = (props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, login } = useContext(AuthContext);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedRecipe, setEditedRecipe] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [completedIngredients, setCompletedIngredients] = useState([]);
  const [completedInstructions, setCompletedInstructions] = useState([]);
  const [saveMessage, setSaveMessage] = useState('');
  const cardPositions = useRef({});
  const cardTiltAngles = useRef({});

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

  useEffect(() => {
    if (!loading && recipe) {
      setInitialCardPositions();
    }
  }, [loading, recipe]);
  console.log(recipe, '<-recipe');

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
      const amount = editedRecipe.isMetric
        ? ingredient.metric
        : ingredient.imperial;
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
          <RecipeImageContainer
            images={recipe.images}
            scrollToCard={scrollToCard}
          />
          <IngredientsContainer
            ingredients={
              isEditing ? editedRecipe.ingredients : recipe.ingredients
            }
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
            onRemove={(index) => {
              const newIngredients = editedRecipe.ingredients.filter(
                (_, i) => i !== index
              );
              setEditedRecipe({ ...editedRecipe, ingredients: newIngredients });
            }}
            completedIngredients={completedIngredients}
            toggleCompletedIngredient={(index) => {
              setCompletedIngredients((prev) =>
                prev.includes(index)
                  ? prev.filter((i) => i !== index)
                  : [...prev, index]
              );
            }}
            addIngredient={() => {
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
            }}
            scrollToCard={scrollToCard}
          />

          {/* Row 3 */}
          <InstructionsContainer
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
            onRemove={(index) => {
              const newInstructions = editedRecipe.instructions.filter(
                (_, i) => i !== index
              );
              setEditedRecipe({
                ...editedRecipe,
                instructions: newInstructions,
              });
            }}
            completedInstructions={completedInstructions}
            toggleCompletedInstruction={(index) => {
              setCompletedInstructions((prev) =>
                prev.includes(index)
                  ? prev.filter((i) => i !== index)
                  : [...prev, index]
              );
            }}
            addInstruction={() => {
              const newInstructions = [...editedRecipe.instructions, ''];
              setEditedRecipe({
                ...editedRecipe,
                instructions: newInstructions,
              });
            }}
            scrollToCard={scrollToCard}
          />

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 lg:col-span-5">
            <EquipmentContainer
              equipment={isEditing ? editedRecipe.equipment : recipe.equipment}
              isEditing={isEditing}
              onInputChange={(e, index) => {
                const newEquipment = [...editedRecipe.equipment];
                newEquipment[index] = e.target.value;
                setEditedRecipe({ ...editedRecipe, equipment: newEquipment });
              }}
              onRemove={(index) => {
                const newEquipment = editedRecipe.equipment.filter(
                  (_, i) => i !== index
                );
                setEditedRecipe({ ...editedRecipe, equipment: newEquipment });
              }}
              addEquipment={() => {
                const newEquipment = [...editedRecipe.equipment, ''];
                setEditedRecipe({
                  ...editedRecipe,
                  equipment: newEquipment,
                });
              }}
              scrollToCard={scrollToCard}
            />
            <NutritionalInfoContainer
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
              scrollToCard={scrollToCard}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecipePage;
