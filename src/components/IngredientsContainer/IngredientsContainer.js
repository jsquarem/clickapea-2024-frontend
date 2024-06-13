import React, { useState } from 'react';
import ToggleSwitch from '../ToggleSwitch/ToggleSwitch';
import Ingredients from '../Ingredients/Ingredients';

const IngredientsContainer = ({
  ingredients,
  isEditing,
  onInputChange,
  onRemove,
  completedIngredients,
  toggleCompletedIngredient,
  addIngredient,
  scrollToCard,
}) => {
  const [isMetric, setIsMetric] = useState(false);

  const handleToggle = (isMetric) => {
    setIsMetric(isMetric);
  };

  return (
    <div id="card2">
      <h3 className="text-3xl lg:text-4xl font-semibold mb-2 cursor-pointer relative z-10 flex items-center">
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
            right: 0,
            top: -30,
          }}
        />
      </h3>
      <div className="flex w-full justify-center pb-4">
        <ToggleSwitch onToggle={handleToggle} />
      </div>
      <Ingredients
        ingredients={ingredients}
        isMetric={isMetric}
        isEditing={isEditing}
        onInputChange={onInputChange}
        onRemove={onRemove}
        onToggleComplete={toggleCompletedIngredient}
        completedIngredients={completedIngredients}
      />
    </div>
  );
};

export default IngredientsContainer;
