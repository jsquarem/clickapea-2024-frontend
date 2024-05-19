import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addRecipe } from '../../utils/api';
import Loading from '../Loading/Loading';

const AddRecipeForm = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await addRecipe(url);
      navigate(`/recipe/${data._id}`);
    } catch (error) {
      console.error('Error adding recipe:', error);
      setError(error.message || 'Failed to add recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <h2 className="text-2xl font-bold">Add a New Recipe</h2>
      <div className="mb-4 flex justify-start items-center w-full">
        <input
          type="text"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border p-2 rounded mr-2 w-7/12 lg:w-3/4"
          placeholder="Enter the recipe URL"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-5/12 lg:w-1/4"
        >
          Add Recipe
        </button>
      </div>
      {loading && <Loading pageClasses="" />}
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
    </form>
  );
};

export default AddRecipeForm;
