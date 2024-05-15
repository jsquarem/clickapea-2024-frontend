export const fetchCategories = async (userId) => {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/api/categories/recipes?userId=${userId}`
  );
  return response.json();
};

export const reorderRecipes = async (categoryId, newOrder) => {
  await fetch(
    `${process.env.REACT_APP_API_URL}/api/categories/reorder-recipes`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        categoryId,
        newOrder,
      }),
    }
  );
};

export const moveRecipe = async (
  sourceCategoryId,
  destCategoryId,
  recipeId
) => {
  await fetch(`${process.env.REACT_APP_API_URL}/api/categories/move-recipe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sourceCategoryId,
      destCategoryId,
      recipeId,
    }),
  });
};

export const addCategory = async (name, userId) => {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/api/categories`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, user: userId }),
    }
  );
  return response.json();
};

export const deleteCategory = async (categoryId, userId) => {
  await fetch(`${process.env.REACT_APP_API_URL}/api/categories/${categoryId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });
};
