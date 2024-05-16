import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import DraggableRecipe from '../DraggableRecipe/DraggableRecipe';
import './Category.css';

const Category = ({
  category,
  index,
  recipes,
  categoryOrder,
  moveCategoryUp,
  moveCategoryDown,
  handleDeleteCategory,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4 transition-transform duration-300 ease-in-out draggable-category min">
      <div className="flex">
        <div className="flex flex-col items-center justify-center mr-4">
          <button
            onClick={() => moveCategoryUp(index)}
            className={`text-3xl mb-2 ${
              index === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-blue-500 hover:text-blue-700'
            }`}
            disabled={index === 0}
          >
            <i className="fas fa-arrow-up"></i>
          </button>
          <button
            onClick={() => moveCategoryDown(index)}
            className={`text-3xl ${
              index === categoryOrder.length - 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-blue-500 hover:text-blue-700'
            }`}
            disabled={index === categoryOrder.length - 1}
          >
            <i className="fas fa-arrow-down"></i>
          </button>
        </div>
        <div className="flex-grow min-h-24">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold mb-2 text-left">
              {category.title}
            </h3>
            {category.title !== 'All Recipes' && (
              <button
                onClick={() => handleDeleteCategory(category.id)}
                className="text-red-500 hover:text-red-700"
              >
                <i className="fas fa-trash-alt"></i>
              </button>
            )}
          </div>
          <Droppable
            droppableId={category.id}
            type="RECIPE"
            direction="horizontal"
          >
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`flex overflow-x-auto gap-4 min-h-32 w-full ${
                  snapshot.isDraggingOver ? 'bg-blue-100' : ''
                }`}
              >
                {recipes.map((recipe, recipeIndex) => (
                  <DraggableRecipe
                    key={recipe.id}
                    recipe={recipe}
                    index={recipeIndex}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </div>
    </div>
  );
};

export default Category;
