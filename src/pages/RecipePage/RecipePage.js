import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
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

  const isSmallDevice = window.innerWidth <= 640; // Tailwind's sm breakpoint is 640px

  const [ref1, inView1] = useInView({ threshold: 0.1, triggerOnce: false });
  const [ref2, inView2] = useInView({ threshold: 0.1, triggerOnce: false });
  const [ref3, inView3] = useInView({ threshold: 0.1, triggerOnce: false });
  const [ref4, inView4] = useInView({ threshold: 0.1, triggerOnce: false });
  const [ref5, inView5] = useInView({ threshold: 0.1, triggerOnce: false });

  const [bgColor, setBgColor] = useState('bg-white');

  useEffect(() => {
    if (isSmallDevice) {
      if (inView2) setBgColor('bg-gradient-to-b from-transparent to-[#FCC474]');
      else if (inView3) setBgColor('bg-[#FCC474]');
      else if (inView4) setBgColor('bg-[#1EB17C]');
      else if (inView5) setBgColor('bg-[#FFD699]');
      else setBgColor('bg-white');
    }
  }, [inView2, inView3, inView4, inView5, isSmallDevice]);

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

  console.log(recipe, '<-recipe');
  console.log(recipe.dietary_restrictions, '<-recipe.dietary_restrictions');

  return (
    <div className="text-gray-800 text-left">
      <main
        className={`max-w-6xl mx-auto lg:p-6 mt-6 transition-colors duration-500 ${bgColor}`}
      >
        <div className="flex flex-col lg:gap-4">
          {/* Row 1 */}
          {isSmallDevice ? (
            <motion.div
              ref={ref1}
              initial="hidden"
              animate={inView1 ? 'visible' : 'hidden'}
              variants={{
                visible: { opacity: 1 },
                hidden: { opacity: 0.5 },
              }}
              transition={{ duration: 0.5 }}
              className="w-full flex flex-col lg:flex-row px-10"
            >
              <div className="w-full lg:w-6/12">
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
                  dietaryRestrictions={recipe.dietary_restrictions}
                  isEditing={isEditing}
                  onInputChange={handleInputChange}
                />
              </div>

              <div className="flex justify-center w-full lg:w-6/12 pb-10 lg:pb-0">
                <div className="flex flex-col gap-2 justify-center items-center lg:w-1/2 text-center">
                  <AddToMyRecipesButton
                    recipeId={recipe._id}
                    onUpdateRecipeId={handleUpdateRecipeId}
                  />
                  <AddToCartButton />
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSaveClick}
                        className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded items-center w-full"
                      >
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded items-center w-full"
                      >
                        <span>Cancel</span>
                      </button>
                      <div className="text-green-500 pt-2">{saveMessage}</div>
                    </>
                  ) : (
                    <div className="relative group w-full">
                      <button
                        onClick={handleEditClick}
                        className={`font-bold text py-2 px-4 rounded items-center w-full text-white ${isAuthenticated ? 'bg-[#37A0C5] hover:bg-blue-700' : 'bg-gray-500 cursor-not-allowed'}`}
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
              </div>
              {validationError && (
                <div className="text-red-500 pt-2">{validationError}</div>
              )}
            </motion.div>
          ) : (
            <div className="w-full flex flex-col lg:flex-row px-10">
              <div className="w-full lg:w-6/12">
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
                  dietaryRestrictions={recipe.dietary_restrictions}
                  isEditing={isEditing}
                  onInputChange={handleInputChange}
                />
              </div>

              <div className="flex justify-center w-full lg:w-6/12 pb-10 lg:pb-0">
                <div className="flex flex-col gap-2 justify-center items-center lg:w-1/2 text-center">
                  <AddToMyRecipesButton
                    recipeId={recipe._id}
                    onUpdateRecipeId={handleUpdateRecipeId}
                  />
                  <AddToCartButton />
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSaveClick}
                        className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded items-center w-full"
                      >
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded items-center w-full"
                      >
                        <span>Cancel</span>
                      </button>
                      <div className="text-green-500 pt-2">{saveMessage}</div>
                    </>
                  ) : (
                    <div className="relative group w-full">
                      <button
                        onClick={handleEditClick}
                        className={`font-bold text py-2 px-4 rounded items-center w-full text-white ${isAuthenticated ? 'bg-[#37A0C5] hover:bg-blue-700' : 'bg-gray-500 cursor-not-allowed'}`}
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
              </div>
              {validationError && (
                <div className="text-red-500 pt-2">{validationError}</div>
              )}
            </div>
          )}

          {/* Row 2 */}
          <div className="flex flex-col lg:gap-4">
            {isSmallDevice ? (
              <motion.div
                ref={ref2}
                initial="hidden"
                animate={inView2 ? 'visible' : 'hidden'}
                variants={{
                  visible: { opacity: 1 },
                  hidden: { opacity: 0.5 },
                }}
                transition={{ duration: 0.5 }}
                className="w-full grow lg:w-7/12 p-4"
              >
                <RecipeImageContainer
                  images={recipe.images}
                  recipeId={recipe._id}
                />
              </motion.div>
            ) : (
              <div className="w-full grow px-4 lg:px-0 pt-4">
                <RecipeImageContainer
                  images={recipe.images}
                  recipeId={recipe._id}
                />
              </div>
            )}

            {/* Row 3 */}
            {isSmallDevice ? (
              <motion.div
                ref={ref3}
                initial="hidden"
                animate={inView3 ? 'visible' : 'hidden'}
                variants={{
                  visible: { opacity: 1 },
                  hidden: { opacity: 0.5 },
                }}
                transition={{ duration: 0.5 }}
                className="w-full grow bg-[#FCC474] p-4  pt-4 text-2xl"
              >
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
                    setEditedRecipe({
                      ...editedRecipe,
                      ingredients: newIngredients,
                    });
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
                />
              </motion.div>
            ) : (
              <div className="w-full grow bg-[#FCC474] p-4 text-2xl">
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
                    setEditedRecipe({
                      ...editedRecipe,
                      ingredients: newIngredients,
                    });
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
                />
              </div>
            )}
          </div>

          <div className="flex flex-col lg:flex-row lg:gap-4">
            {/* Row 4 */}
            {isSmallDevice ? (
              <motion.div
                ref={ref4}
                initial="hidden"
                animate={inView4 ? 'visible' : 'hidden'}
                variants={{
                  visible: { opacity: 1 },
                  hidden: { opacity: 0.5 },
                }}
                transition={{ duration: 0.5 }}
                className="w-full lg:w-7/12 grow bg-[#1EB17C] p-4 text-2xl"
              >
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
                />
              </motion.div>
            ) : (
              <div className="w-full lg:w-7/12 grow bg-[#1EB17C] p-4 text-2xl">
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
                />
              </div>
            )}

            {/* Row 5 */}
            {isSmallDevice ? (
              <motion.div
                ref={ref5}
                initial="hidden"
                animate={inView5 ? 'visible' : 'hidden'}
                variants={{
                  visible: { opacity: 1 },
                  hidden: { opacity: 0.5 },
                }}
                transition={{ duration: 0.5 }}
                className="flex flex-col lg:gap-4 w-full lg:w-5/12"
              >
                <div className="bg-[#FFD699] p-4 grow">
                  <EquipmentContainer
                    equipment={
                      isEditing ? editedRecipe.equipment : recipe.equipment
                    }
                    isEditing={isEditing}
                    onInputChange={(e, index) => {
                      const newEquipment = [...editedRecipe.equipment];
                      newEquipment[index] = e.target.value;
                      setEditedRecipe({
                        ...editedRecipe,
                        equipment: newEquipment,
                      });
                    }}
                    onRemove={(index) => {
                      const newEquipment = editedRecipe.equipment.filter(
                        (_, i) => i !== index
                      );
                      setEditedRecipe({
                        ...editedRecipe,
                        equipment: newEquipment,
                      });
                    }}
                    addEquipment={() => {
                      const newEquipment = [...editedRecipe.equipment, ''];
                      setEditedRecipe({
                        ...editedRecipe,
                        equipment: newEquipment,
                      });
                    }}
                  />
                </div>
                <div className="bg-[#D8CDC3] p-4 grow">
                  <NutritionalInfoContainer
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
              </motion.div>
            ) : (
              <div className="flex flex-col lg:gap-4 w-full lg:w-5/12">
                <div className="bg-[#FFD699] p-4 grow">
                  <EquipmentContainer
                    equipment={
                      isEditing ? editedRecipe.equipment : recipe.equipment
                    }
                    isEditing={isEditing}
                    onInputChange={(e, index) => {
                      const newEquipment = [...editedRecipe.equipment];
                      newEquipment[index] = e.target.value;
                      setEditedRecipe({
                        ...editedRecipe,
                        equipment: newEquipment,
                      });
                    }}
                    onRemove={(index) => {
                      const newEquipment = editedRecipe.equipment.filter(
                        (_, i) => i !== index
                      );
                      setEditedRecipe({
                        ...editedRecipe,
                        equipment: newEquipment,
                      });
                    }}
                    addEquipment={() => {
                      const newEquipment = [...editedRecipe.equipment, ''];
                      setEditedRecipe({
                        ...editedRecipe,
                        equipment: newEquipment,
                      });
                    }}
                  />
                </div>
                <div className="bg-[#D8CDC3] p-4 grow">
                  <NutritionalInfoContainer
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
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecipePage;
