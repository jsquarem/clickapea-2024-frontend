import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllRecipes } from '../../utils/api';

const RecipeListPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const data = await fetchAllRecipes();
        console.log(data); // Debugging: log the data to check image URLs
        setRecipes(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <form className="mb-4">
        <input
          type="text"
          placeholder="Search recipes..."
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </form>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {recipes.map((recipe) => (
          <Link
            key={recipe._id}
            to={`/recipe/${recipe._id}`}
            className="block relative overflow-hidden rounded-lg shadow-lg transform transition duration-300 ease-in-out hover:scale-105"
          >
            <div
              className="h-48 bg-cover bg-center"
              style={{ backgroundImage: `url("${recipe.image}")` }}
            >
              <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white text-center p-2">
                <h3 className="text-lg">{recipe.title}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecipeListPage;
