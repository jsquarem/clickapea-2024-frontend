import React, { useEffect, useState, useContext } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import AuthContext from '../../AuthContext';
import DraggableCategory from '../../components/DraggableCategory/DraggableCategory';
import FlipMove from 'react-flip-move';
import {
  fetchCategories,
  reorderRecipes,
  moveRecipe,
  addCategory,
  deleteCategory,
} from '../../api';
import './CategoryPage.css';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const CategoryPage = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [recipes, setRecipes] = useState({});
  const [categories, setCategories] = useState({});
  const [categoryOrder, setCategoryOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchCategories(user._id)
        .then((data) => {
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

  const onDragEnd = async (result) => {
    const { source, destination, type } = result;

    if (!destination) {
      return;
    }

    if (type === 'RECIPE') {
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

        try {
          await reorderRecipes(newCategory.id, newRecipeIds);
        } catch (error) {
          console.error('Error reordering recipes:', error);
        }
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

        try {
          await moveRecipe(newStart.id, newFinish.id, removed[0]);
          await reorderRecipes(newFinish.id, newFinish.recipeIds);
        } catch (error) {
          console.error('Error moving or reordering recipes:', error);
        }
      }
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName) return;

    try {
      const newCategory = await addCategory(newCategoryName, user._id);
      setCategories({
        ...categories,
        [newCategory._id]: {
          id: newCategory._id,
          title: newCategory.name,
          recipeIds: [],
          order: newCategory.order,
        },
      });
      setCategoryOrder([...categoryOrder, newCategory._id]);
      setNewCategoryName('');
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (categoryId === 'all-recipes') return;

    try {
      await deleteCategory(categoryId, user._id);

      const updatedCategories = { ...categories };
      delete updatedCategories[categoryId];

      setCategories(updatedCategories);
      setCategoryOrder(categoryOrder.filter((id) => id !== categoryId));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!isAuthenticated || !user)
    return <div>Please log in to view your categories</div>;

  if (!categoryOrder.length) {
    return <div>No categories found.</div>;
  }

  const sortedCategoryOrder = [
    ...categoryOrder
      .filter((id) => categories[id]?.order !== 0)
      .sort((a, b) => {
        const orderA = categories[a]?.order ?? Number.MAX_SAFE_INTEGER;
        const orderB = categories[b]?.order ?? Number.MAX_SAFE_INTEGER;
        return orderA - orderB;
      }),
    ...categoryOrder.filter((id) => categories[id]?.order === 0),
  ];

  console.log(sortedCategoryOrder, '<-sortedCategoryOrder');

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
        <div className="mb-4 flex justify-center">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="New Category Name"
            className="border p-2 rounded mr-2"
          />
          <button
            onClick={handleAddCategory}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Add Category
          </button>
        </div>
        <Droppable droppableId="all-categories" type="CATEGORY">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <FlipMove duration={300} easing="ease-in-out">
                {sortedCategoryOrder.map((categoryId, index) => {
                  const category = categories[categoryId];
                  if (!category) return null;
                  const categoryRecipes = category.recipeIds.map(
                    (recipeId) => recipes[recipeId]
                  );

                  return (
                    <div key={category.id}>
                      <DraggableCategory
                        category={category}
                        userId={user._id}
                        index={index}
                        recipes={categoryRecipes}
                        categoryOrder={categoryOrder}
                        setCategoryOrder={setCategoryOrder}
                        handleDeleteCategory={handleDeleteCategory}
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
