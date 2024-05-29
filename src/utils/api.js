import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Add a request interceptor to include the token in the headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const fetchCategories = async (userId) => {
  const response = await api.get(`/api/categories/recipes?userId=${userId}`);
  return response.data;
};

export const reorderRecipes = async (categoryId, newOrder) => {
  await api.post('/api/categories/reorder-recipes', {
    categoryId,
    newOrder,
  });
};

export const moveRecipe = async (
  sourceCategoryId,
  destCategoryId,
  recipeId
) => {
  await api.post('/api/categories/move-recipe', {
    sourceCategoryId,
    destCategoryId,
    recipeId,
  });
};

export const addCategory = async (name, userId) => {
  const response = await api.post('/api/categories', { name, user: userId });
  return response.data;
};

export const deleteCategory = async (categoryId, userId) => {
  await api.delete(`/api/categories/${categoryId}`, {
    data: { userId },
  });
};

export const fetchRecipeById = async (recipeId) => {
  const response = await api.get(`/api/recipes/${recipeId}`);
  return response.data;
};

export const fetchUserRecipeById = async (recipeId) => {
  const response = await api.get(`/api/recipes/user/${recipeId}`);
  return response.data;
};

export const updateUserRecipeById = async (recipeId, recipeData) => {
  const response = await api.put(`/api/recipes/user/${recipeId}`, recipeData);
  return response.data;
};

export const addRecipe = async (url) => {
  const response = await api.post('/api/recipes/add', { url });
  return response.data;
};

export const createRecipe = async (recipe) => {
  const response = await api.post('/api/recipes/new', recipe, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const fetchUserCategories = async (userId) => {
  const response = await api.get(`/api/categories?userId=${userId}`);
  return response.data;
};

export const addRecipeToCategory = async (categoryId, recipeId) => {
  const response = await api.post(`/api/categories/${categoryId}/recipes`, {
    recipeId,
  });
  return response.data;
};

export const removeRecipeFromCategory = async (categoryId, recipeId) => {
  const response = await api.delete(`/api/categories/${categoryId}/recipes`, {
    data: { recipeId },
  });
  return response.data;
};

export const reorderCategories = async (userId, newOrder) => {
  await api.post(`/api/categories/reorder`, {
    userId,
    newOrder,
  });
};

export const fetchAllRecipes = async () => {
  const response = await api.get('/api/recipes/all');
  return response.data;
};

export const uploadMainImage = async (recipeId, formData) => {
  const response = await api.post(
    `/api/recipes/${recipeId}/uploadMainImage`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

export const uploadAdditionalImage = async (recipeId, formData) => {
  const response = await api.post(
    `/api/recipes/user/${recipeId}/images`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

export default api;
