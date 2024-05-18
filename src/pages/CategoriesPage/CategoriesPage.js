import React, { useEffect, useState, useContext } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import AuthContext from '../../AuthContext';
import AddRecipeForm from '../../components/AddRecipeForm/AddRecipeForm';
import Category from '../../components/Category/Category';
import FlipMove from 'react-flip-move';
import {
  fetchCategories,
  reorderRecipes,
  moveRecipe,
  addCategory,
  deleteCategory,
  reorderCategories,
} from '../../utils/api';
import './CategoriesPage.css';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const sortCategoryOrder = (categoryOrder, categories) => {
  return [
    ...categoryOrder
      .filter((id) => categories[id]?.order !== 0)
      .sort((a, b) => {
        const orderA = categories[a]?.order ?? Number.MAX_SAFE_INTEGER;
        const orderB = categories[b]?.order ?? Number.MAX_SAFE_INTEGER;
        return orderA - orderB;
      }),
    ...categoryOrder.filter((id) => categories[id]?.order === 0),
  ];
};

const CategoriesPage = () => {
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
          console.log('Fetched categories:', data.categories);
          if (
            data.categories &&
            data.categories.recipes &&
            data.categories.categories &&
            data.categories.categoryOrder
          ) {
            setRecipes(data.categories.recipes);
            setCategories(data.categories.categories);
            setCategoryOrder(
              sortCategoryOrder(
                data.categories.categoryOrder,
                data.categories.categories
              )
            );
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

  useEffect(() => {
    setCategoryOrder((prevOrder) => sortCategoryOrder(prevOrder, categories));
  }, [categories]);

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

        setCategories((prevCategories) => ({
          ...prevCategories,
          [newCategory.id]: newCategory,
        }));

        try {
          await reorderRecipes(newCategory.id, newRecipeIds);
        } catch (error) {
          console.error('Error reordering recipes:', error);
        }
      } else {
        const startRecipeIds = Array.from(start.recipeIds);
        const [removedRecipeId] = startRecipeIds.splice(source.index, 1); // Correctly capture the recipe ID being moved
        const newStart = {
          ...start,
          recipeIds: startRecipeIds,
        };

        const finishRecipeIds = Array.from(finish.recipeIds);
        finishRecipeIds.splice(destination.index, 0, removedRecipeId);
        const newFinish = {
          ...finish,
          recipeIds: finishRecipeIds,
        };

        setCategories((prevCategories) => ({
          ...prevCategories,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        }));

        try {
          await moveRecipe(newStart.id, newFinish.id, removedRecipeId);
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
      setCategories((prevCategories) => ({
        ...prevCategories,
        [newCategory._id]: {
          id: newCategory._id,
          title: newCategory.name,
          recipeIds: [],
          order: newCategory.order,
        },
      }));
      setCategoryOrder((prevOrder) =>
        sortCategoryOrder([...prevOrder, newCategory._id], categories)
      );
      setNewCategoryName('');
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (categoryId === 'all-recipes') return;

    try {
      await deleteCategory(categoryId, user._id);

      setCategories((prevCategories) => {
        const updatedCategories = { ...prevCategories };
        delete updatedCategories[categoryId];
        return updatedCategories;
      });

      setCategoryOrder((prevOrder) =>
        sortCategoryOrder(
          prevOrder.filter((id) => id !== categoryId),
          categories
        )
      );
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const moveCategoryUp = async (index) => {
    if (index > 0) {
      const newCategoryOrder = Array.from(categoryOrder);
      const [movedCategory] = newCategoryOrder.splice(index, 1);
      newCategoryOrder.splice(index - 1, 0, movedCategory);
      console.log('Moving category up:', newCategoryOrder);
      setCategoryOrder(newCategoryOrder);

      try {
        await reorderCategories(user._id, newCategoryOrder);
      } catch (error) {
        console.error('Error reordering categories:', error);
      }
    }
  };

  const moveCategoryDown = async (index) => {
    if (index < categoryOrder.length - 1) {
      const newCategoryOrder = Array.from(categoryOrder);
      const [movedCategory] = newCategoryOrder.splice(index, 1);
      newCategoryOrder.splice(index + 1, 0, movedCategory);
      console.log('Moving category down:', newCategoryOrder);
      setCategoryOrder(newCategoryOrder);

      try {
        await reorderCategories(user._id, newCategoryOrder);
      } catch (error) {
        console.error('Error reordering categories:', error);
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

  console.log('Rendering categories:', categoryOrder);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="bg-gray-100 text-gray-800 p-6 w-full">
        <div className="flex flex-row justify-center items-start">
          <h1 className="text-4xl font-bold text-center pb-4">Your Recipes</h1>
          <div className="relative group ml-2 mt-1">
            <i className="fas fa-question-circle text-xl cursor-pointer"></i>
            <div className="absolute top-full right-0 transform mt-2 w-48 bg-black text-white text-center rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
              Drag recipes to the desired category. Click arrows to change
              category order.
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row mb-4 w-full justify-between space-y-4 md:space-y-0 md:space-x-8">
          <div className="w-full lg:w-1/3">
            <h2 className="text-2xl font-bold text-left">Add a Category</h2>
            <div className="mb-4 flex justify-center items-center">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="New Category Name"
                className="border p-2 rounded mr-2 flex-1 w-full md:w-auto"
              />
              <button
                onClick={handleAddCategory}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Add Category
              </button>
            </div>
          </div>
          <div className="w-full lg:w-1/2 text-left">
            <AddRecipeForm />
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
                      <Category
                        key={category.id} // Ensure proper key for FlipMove
                        category={category}
                        userId={user._id}
                        index={index}
                        recipes={categoryRecipes}
                        categoryOrder={categoryOrder}
                        setCategoryOrder={setCategoryOrder}
                        moveCategoryUp={moveCategoryUp}
                        moveCategoryDown={moveCategoryDown}
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

export default CategoriesPage;
