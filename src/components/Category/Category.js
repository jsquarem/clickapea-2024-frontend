import React, { useEffect } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import DraggableRecipe from '../DraggableRecipe/DraggableRecipe';
import { motion, useAnimation } from 'framer-motion';

const Category = ({
  category,
  index,
  recipes,
  categoryOrder,
  moveCategoryUp,
  moveCategoryDown,
  onShowDeleteModal,
  isEditMode,
  handleAddToCart,
  editAnimationCount,
}) => {
  console.log(recipes, 'Category');
  const controls = useAnimation();

  useEffect(() => {
    if (isEditMode && editAnimationCount > 0) {
      console.log('Category useEffect triggered for entering edit mode', {
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
        console.log('Category Animation completed.');
      };
      animate();
    }
  }, [isEditMode, controls, editAnimationCount]);

  return (
    <div className="mb-4 transition-transform duration-300 ease-in-out draggable-category">
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
            {isEditMode && category.title !== 'All Recipes' && (
              <motion.button
                onClick={() => onShowDeleteModal('category', category.id)}
                className="text-red-500 hover:text-red-700"
                animate={controls}
              >
                <i className="fas fa-trash-alt text-2xl hover:scale-125"></i>
              </motion.button>
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
                className={`flex overflow-x-auto gap-4 min-h-32 max-w-[17rem] lg:max-w-[64rem] pt-4 pb-2 ${
                  snapshot.isDraggingOver ? 'bg-blue-100' : ''
                }`}
                style={{
                  scrollbarWidth: 'auto',
                  WebkitOverflowScrolling: 'touch',
                  overflowY: 'hidden',
                }}
              >
                {recipes.map((recipe, recipeIndex) => (
                  <DraggableRecipe
                    key={recipe.id}
                    recipe={recipe}
                    index={recipeIndex}
                    onShowDeleteModal={onShowDeleteModal}
                    isEditMode={isEditMode}
                    handleAddToCart={handleAddToCart}
                    editAnimationCount={editAnimationCount}
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
