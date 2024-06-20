// src/components/DraggableRecipe/DraggableRecipe.js

import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Link } from 'react-router-dom';

const DraggableRecipe = ({ recipe, index, onShowDeleteModal }) => {
  console.log(recipe, 'DraggableRecipe');
  return (
    <Draggable key={recipe.id} draggableId={recipe.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`relative w-48 transition-opacity duration-200 ${snapshot.isDragging ? 'opacity-50' : 'opacity-100'}`}
        >
          <div className="relative">
            <div className="absolute top-1 left-1 bg-gray-600 opacity-90 p-1 rounded z-10">
              <i className="fas fa-grip-vertical text-white"></i>
            </div>
            <Link to={`/recipe/user/${recipe.id}`}>
              <div className="w-48 h-32 bg-cover bg-center rounded-lg">
                <img
                  src={recipe?.images ? recipe.images[0] : ''}
                  alt={`recipe-${index}`}
                  className={`w-full h-full object-cover rounded-lg`}
                />
              </div>
            </Link>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-1 text-white text-center w-full">
            {recipe.content}
          </div>
          <button
            onClick={() => onShowDeleteModal('recipe', recipe.id)}
            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center"
            style={{ transform: 'translate(50%, -50%)' }}
          >
            <i className="fas fa-trash-alt"></i>
          </button>
        </div>
      )}
    </Draggable>
  );
};

export default DraggableRecipe;
