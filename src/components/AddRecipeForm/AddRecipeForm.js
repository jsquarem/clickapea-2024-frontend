import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addRecipe } from '../../utils/api';

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
      <div className="mb-4 flex justify-center items-center">
        <input
          type="text"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border p-2 rounded mr-2 flex-1"
          placeholder="Enter the recipe URL"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add Recipe
        </button>
      </div>
      {loading && <div className="text-center mt-4">Loading...</div>}
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
    </form>
  );
};

export default AddRecipeForm;
