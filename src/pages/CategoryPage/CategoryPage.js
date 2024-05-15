import React, { useEffect, useState, useContext } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import AuthContext from '../../AuthContext';
import DraggableCategory from '../../components/DraggableCategory/DraggableCategory';
import FlipMove from 'react-flip-move';
import './CategoryPage.css';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);
  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;
  return result;
};

const CategoryPage = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [recipes, setRecipes] = useState({});
  const [categories, setCategories] = useState({});
  const [categoryOrder, setCategoryOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetch(
        `${process.env.REACT_APP_API_URL}/api/categories/recipes?userId=${user._id}`
      )
        .then((res) => res.json())
        .then((data) => {
          console.log('Fetched data:', data);
          if (
            data.categories &&
            data.categories.recipes &&
            data.categories.categories &&
            data.categories.categoryOrder
          ) {
            setRecipes(data.categories.recipes);
            setCategories(data.categories.categories);
            setCategoryOrder(data.categories.categoryOrder);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching categories:', error);
          setError('Failed to fetch categories');
          setLoading(false);
        });
    }
  }, [isAuthenticated, user]);

  const onDragEnd = (result) => {
    const { source, destination, type } = result;

    if (!destination) {
      return;
    }

    if (type === 'CATEGORY') {
      const newCategoryOrder = reorder(
        categoryOrder,
        source.index,
        destination.index
      );
      setCategoryOrder(newCategoryOrder);
    } else {
      const start = categories[source.droppableId];
      const finish = categories[destination.droppableId];

      if (start === finish) {
        const newRecipeIds = reorder(
          start.recipeIds,
          source.index,
          destination.index
        );
        const newCategory = {
          ...start,
          recipeIds: newRecipeIds,
        };

        setCategories({
          ...categories,
          [newCategory.id]: newCategory,
        });
      } else {
        const startRecipeIds = Array.from(start.recipeIds);
        const [removed] = startRecipeIds.splice(source.index, 1);
        const newStart = {
          ...start,
          recipeIds: startRecipeIds,
        };

        const finishRecipeIds = Array.from(finish.recipeIds);
        finishRecipeIds.splice(destination.index, 0, removed);
        const newFinish = {
          ...finish,
          recipeIds: finishRecipeIds,
        };

        setCategories({
          ...categories,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        });
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!isAuthenticated || !user)
    return <div>Please log in to view your categories</div>;

  if (!categoryOrder.length) {
    return <div>No categories found.</div>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="bg-gray-100 text-gray-800 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold mx-auto">Your Categories</h2>
          <div className="relative group z-10">
            <i className="fas fa-question-circle text-xl cursor-pointer"></i>
            <div className="absolute top-full right-0 transform mt-2 w-48 bg-black text-white text-center rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
              Drag recipes to the desired category. Click arrows to change
              category order.
            </div>
          </div>
        </div>
        <Droppable droppableId="all-categories" type="CATEGORY">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <FlipMove duration={300} easing="ease-in-out">
                {categoryOrder.map((categoryId, index) => {
                  const category = categories[categoryId];
                  if (!category) return null;
                  const categoryRecipes = category.recipeIds.map(
                    (recipeId) => recipes[recipeId]
                  );

                  return (
                    <div key={category.id}>
                      <DraggableCategory
                        category={category}
                        index={index}
                        recipes={categoryRecipes}
                        categoryOrder={categoryOrder}
                        setCategoryOrder={setCategoryOrder}
                      />
                    </div>
                  );
                })}
              </FlipMove>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};

export default CategoryPage;
