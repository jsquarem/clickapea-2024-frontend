import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import RecipeInfo from '../../components/RecipeInfo/RecipeInfo';
import ToggleSwitch from '../../components/ToggleSwitch/ToggleSwitch';
import Ingredients from '../../components/Ingredients/Ingredients';
import Equipment from '../../components/Equipment/Equipment';
import Instructions from '../../components/Instructions/Instructions';
import NutritionalInfo from '../../components/NutritionalInfo/NutritionalInfo';
import AddToProfileButton from '../../components/AddToProfileButton/AddToProfileButton';
import AddToCartButton from '../../components/AddToCartButton/AddToCartButton';
import './RecipePage.css';

const RecipePage = (props) => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [isMetric, setIsMetric] = useState(false); // Default to Imperial
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (props.recipe) {
      setRecipe(props.recipe);
      setLoading(false);
    } else {
      fetchRecipeById(id);
    }
  }, [id, props.recipe]);

  const fetchRecipeById = async (recipeId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/${recipeId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch recipe');
      }

      setRecipe(data);
    } catch (error) {
      console.error('Error fetching recipe:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (isMetric) => {
    setIsMetric(isMetric);
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
    const minutes = parseInt(totalTime, 10); // Ensure totalTime is an integer
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours ? `${hours} hrs ${remainingMinutes} mins` : `${remainingMinutes} mins`;
  };

  return (
    <div className="bg-gray-100 text-gray-800 text-left">
      <main className="max-w-6xl mx-auto p-6 bg-white shadow-md mt-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">{recipe.title}</h2>
        <div className="flex justify-between items-start mb-4">
          <RecipeInfo 
            author={recipe.author} 
            host={recipe.host} 
            recipeUrl={recipe.url}
            totalTime={formatTotalTime(recipe.total_time)} 
            servings={recipe.yields} 
          />
          <div className="flex space-x-2">
            <AddToProfileButton recipeId={recipe._id} />
            <AddToCartButton />
          </div>
        </div>
        <div className="flex flex-wrap lg:flex-nowrap mb-6">
          <div 
            className={`w-full lg:w-1/2 h-64 lg:h-auto rounded-lg mb-4 lg:mb-0 ${recipe.image ? 'bg-cover bg-center' : 'bg-gray-300'}`} 
            style={{ backgroundImage: recipe.image ? `url("${recipe.image}")` : 'none' }}
          >
          </div>
          <section className="w-full lg:w-1/2 lg:pl-6">
            <ToggleSwitch onToggle={handleToggle} />
            <Ingredients ingredients={recipe.ingredients} isMetric={isMetric} />
            <Equipment equipment={recipe.equipment} />
          </section>
        </div>
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-2/3">
            <Instructions instructions={recipe.instructions} />
          </div>
          <div className="lg:w-1/3 lg:ml-6 mt-6 lg:mt-0">
            <NutritionalInfo nutrients={recipe.nutrients} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecipePage;
