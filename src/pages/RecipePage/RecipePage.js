import React, { useState } from 'react';
import RecipeInfo from '../../components/RecipeInfo/RecipeInfo';
import ToggleSwitch from '../../components/ToggleSwitch/ToggleSwitch';
import Ingredients from '../../components/Ingredients/Ingredients';
import Equipment from '../../components/Equipment/Equipment';
import Instructions from '../../components/Instructions/Instructions';
import NutritionalInfo from '../../components/NutritionalInfo/NutritionalInfo';
import AddToProfileButton from '../../components/AddToProfileButton/AddToProfileButton';
import AddToCartButton from '../../components/AddToCartButton/AddToCartButton';
import data from '../../data/recipe.json';
import './RecipePage.css';

const RecipePage = () => {
  const [isMetric, setIsMetric] = useState(true);

  const handleToggle = (isMetric) => {
    setIsMetric(isMetric);
  };

  return (
    <div className="bg-gray-100 text-gray-800 text-left">
      <main className="max-w-6xl mx-auto p-6 bg-white shadow-md mt-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">{data.title}</h2>
        <div className="flex justify-between items-start mb-4">
          <RecipeInfo 
            author={data.author} 
            host={data.host} 
            totalTime={`${Math.floor(data.total_time / 60)} hrs ${data.total_time % 60} mins`} 
            servings={data.yields} 
          />
          <div className="flex space-x-2">
            <AddToProfileButton />
            <AddToCartButton />
          </div>
        </div>
        <div className="flex flex-wrap lg:flex-nowrap mb-6">
          <div className="w-full lg:w-1/2 h-64 lg:h-auto bg-cover-custom mb-4 lg:mb-0 rounded-lg" 
               style={{ backgroundImage: `url(${data.image})` }}>
          </div>
          <section className="w-full lg:w-1/2 lg:pl-6">
            <ToggleSwitch onToggle={handleToggle} />
            <Ingredients ingredients={data.ingredients} isMetric={isMetric} />
            <Equipment equipment={data.equipment} />
          </section>
        </div>
        <Instructions instructions={data.instructions} />
        <NutritionalInfo nutrients={data.nutrients} />
      </main>
    </div>
  );
};

export default RecipePage;
