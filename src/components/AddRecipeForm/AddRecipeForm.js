import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add recipe');
      }

      navigate(`/recipe/${data._id}`);
    } catch (error) {
      console.error('Error adding recipe:', error);
      setError(error.message || 'Failed to add recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white shadow-md mt-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Add a New Recipe</h2>
      <div className="mb-4">
        <label htmlFor="url" className="block text-gray-700 text-sm font-bold mb-2">Recipe URL:</label>
        <input
          type="text"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter the recipe URL"
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add Recipe
        </button>
      </div>
      {loading && <div className="text-center mt-4">Loading...</div>}
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
    </form>
  );
};

export default AddRecipeForm;
