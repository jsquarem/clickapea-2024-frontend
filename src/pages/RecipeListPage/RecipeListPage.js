import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllRecipes } from '../../utils/api';
import Loading from '../../components/Loading/Loading';

const RecipeListPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const observerRef = useRef(null);

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const data = await fetchAllRecipes();
        console.log(data);
        setRecipes(data);
        setFilteredRecipes(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, []);

  const initializeObserver = () => {
    if (observerRef.current) observerRef.current.disconnect();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const imageUrl = target.getAttribute('data-bg');
          if (imageUrl) {
            target.style.backgroundImage = `url("${imageUrl}")`;
            observer.unobserve(target);
          }
        }
      });
    });

    observerRef.current = observer;
    const lazyImages = document.querySelectorAll('.lazy-bg');
    lazyImages.forEach((image) => observer.observe(image));
  };

  useEffect(() => {
    initializeObserver();
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [filteredRecipes]);

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setSearch(searchValue);

    if (searchValue === '') {
      setFilteredRecipes(recipes);
    } else {
      const filtered = recipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredRecipes(filtered);
    }
  };

  if (loading) {
    return <Loading pageClasses="p-8" />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <form className="my-4">
        <input
          type="text"
          placeholder="Search recipes..."
          value={search}
          onChange={handleSearchChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </form>
      <div className="p-4 lg:max-h-[56vh] lg:overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredRecipes.map((recipe) => (
            <Link
              key={recipe._id}
              to={`/recipe/${recipe._id}`}
              className="block relative overflow-hidden rounded-lg shadow-lg transform transition duration-300 ease-in-out hover:scale-105"
            >
              <div
                className="h-48 bg-cover bg-center lazy-bg"
                data-bg={recipe.image}
              >
                <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white text-center p-2">
                  <h3 className="text-lg">{recipe.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipeListPage;
