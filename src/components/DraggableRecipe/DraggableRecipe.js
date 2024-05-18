import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Link } from 'react-router-dom';

const DraggableRecipe = ({ recipe, index }) => {
  return (
    <Draggable key={recipe.id} draggableId={recipe.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`relative w-48 transition-opacity duration-200 ${snapshot.isDragging ? 'opacity-50' : 'opacity-100'}`}
        >
          <div className="absolute top-1 left-1 bg-gray-600 opacity-90 p-1 rounded z-10">
            <i className="fas fa-grip-vertical text-white"></i>
          </div>
          <Link to={`/recipe/user/${recipe.id}`}>
            <div
              className="w-48 h-32 bg-cover bg-center rounded-lg"
              style={{ backgroundImage: `url("${recipe.image}")` }}
            >
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center p-1">
                {recipe.content}
              </div>
            </div>
          </Link>
        </div>
      )}
    </Draggable>
  );
};

export default DraggableRecipe;
