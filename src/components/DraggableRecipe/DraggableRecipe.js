import React, { useEffect } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';

const DraggableRecipe = ({
  recipe,
  index,
  onShowDeleteModal,
  isEditMode,
  handleAddToCart,
  editAnimationCount,
}) => {
  console.log('Rendering DraggableRecipe', { isEditMode, editAnimationCount });
  const controls = useAnimation();

  useEffect(() => {
    if (isEditMode && editAnimationCount > 0) {
      console.log('useEffect triggered for entering edit mode', {
        isEditMode,
        editAnimationCount,
      });
      const animate = async () => {
        for (let i = 0; i < editAnimationCount; i++) {
          console.log(`Cycle ${i + 1}: Scaling and tilting left.`);
          await controls.start({
            scale: 1.05,
            rotate: -10,
            transition: { duration: 0.2 },
            zIndex: 10,
          });
          console.log(`Cycle ${i + 1}: Scaling and tilting right.`);
          await controls.start({
            scale: 1.05,
            rotate: 10,
            transition: { duration: 0.2 },
            zIndex: 10,
          });
          console.log(`Cycle ${i + 1}: Resetting scale and rotation.`);
          await controls.start({
            scale: 1,
            rotate: 0,
            transition: { duration: 0.2 },
            zIndex: 10,
          });
          console.log(`Cycle ${i + 1}: Waiting for 1 second.`);
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
        }
        console.log('Animation completed.');
      };
      animate();
    }
  }, [isEditMode, controls, editAnimationCount]);

  return (
    <Draggable key={recipe.id} draggableId={recipe.id} index={index}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          animate={controls}
          className={`relative w-48 transition-opacity duration-200 ${index === 0 ? 'ml-4' : ''} ${snapshot.isDragging ? 'opacity-50' : 'opacity-100'}`}
          style={{ zIndex: isEditMode ? 10 : 'auto', overflow: 'visible' }} // Set z-index higher during edit mode and ensure overflow is visible
        >
          <div className="relative">
            {isEditMode && (
              <div className="absolute top-1 left-1 bg-gray-600 opacity-90 p-1 rounded z-10">
                <i className="fas fa-grip-vertical text-white"></i>
              </div>
            )}
            <Link to={`/recipe/user/${recipe.id}`}>
              <div className="w-48 h-32 bg-cover bg-center rounded-lg">
                <img
                  src={recipe?.images ? recipe.images[0] : ''}
                  alt={`recipe-${index}`}
                  className={`w-full h-full object-cover rounded-lg`}
                />
              </div>
            </Link>
            {!isEditMode && (
              <button
                onClick={() => handleAddToCart(recipe.id)}
                className="absolute -top-3 -left-3 bg-blue-500 text-white rounded-full w-8 h-8 hover:bg-blue-700 hover:w-9 hover:h-9 hover:text-lg p-1"
              >
                <i className="fas fa-cart-plus"></i>
              </button>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-1 text-white text-center w-full">
            {recipe.content}
          </div>
          {isEditMode && (
            <button
              onClick={() => onShowDeleteModal('recipe', recipe.id)}
              className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 hover:w-9 hover:h-9 hover:text-lg"
            >
              <i className="fas fa-trash-alt"></i>
            </button>
          )}
        </motion.div>
      )}
    </Draggable>
  );
};

export default DraggableRecipe;
