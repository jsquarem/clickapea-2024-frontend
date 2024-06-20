import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllRecipes } from '../../utils/api';
import Loading from '../../components/Loading/Loading';
import SearchAndFilter from '../../components/SearchAndFilter/SearchAndFilter';
import {
  dietaryRestrictions,
  cuisines,
  mealTypes,
} from '../../utils/constants';

const RecipeListPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    dietaryRestrictions: [],
    cuisines: [],
    mealTypes: [],
  });
  const observerRef = useRef(null);

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const data = await fetchAllRecipes();
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

  useEffect(() => {
    if (recipes.length > 0) {
      const filtered = recipes.filter((recipe) => {
        const matchesSearch = recipe.title
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesDietaryRestrictions =
          selectedFilters.dietaryRestrictions.length === 0 ||
          (recipe.dietary_restrictions &&
            selectedFilters.dietaryRestrictions.every((filter) =>
              recipe.dietary_restrictions.includes(filter)
            ));
        const matchesCuisines =
          selectedFilters.cuisines.length === 0 ||
          (recipe.cuisines &&
            selectedFilters.cuisines.every((filter) =>
              recipe.cuisines.includes(filter)
            ));
        const matchesMealTypes =
          selectedFilters.mealTypes.length === 0 ||
          (recipe.meal_types &&
            selectedFilters.mealTypes.every((filter) =>
              recipe.meal_types.includes(filter)
            ));
        return (
          matchesSearch &&
          matchesDietaryRestrictions &&
          matchesCuisines &&
          matchesMealTypes
        );
      });
      setFilteredRecipes(filtered);
    }
  }, [recipes, search, selectedFilters]);

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

  const toggleFilter = (category, item) => {
    setSelectedFilters((prevFilters) => {
      const updatedCategory = prevFilters[category].includes(item)
        ? prevFilters[category].filter((i) => i !== item)
        : [...prevFilters[category], item];
      return { ...prevFilters, [category]: updatedCategory };
    });
  };

  const removeFilter = (category, item) => {
    setSelectedFilters((prevFilters) => {
      const updatedCategory = prevFilters[category].filter((i) => i !== item);
      return { ...prevFilters, [category]: updatedCategory };
    });
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedFilters({
      dietaryRestrictions: [],
      cuisines: [],
      mealTypes: [],
    });
  };

  if (loading) {
    return <Loading pageClasses="p-8" />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row">
      <SearchAndFilter
        search={search}
        setSearch={setSearch}
        filters={[
          {
            title: 'Dietary Restrictions',
            items: dietaryRestrictions,
            category: 'dietaryRestrictions',
          },
          { title: 'Cuisines', items: cuisines, category: 'cuisines' },
          { title: 'Meal Types', items: mealTypes, category: 'mealTypes' },
        ]}
        selectedFilters={selectedFilters}
        toggleFilter={toggleFilter}
        removeFilter={removeFilter}
        clearFilters={clearFilters}
      />
      <div className="p-4 lg:w-3/4 lg:max-h-[56vh] lg:overflow-y-auto">
        {filteredRecipes.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <h2 className="text-2xl text-gray-500">No Recipes Found</h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredRecipes.map((recipe) => (
              <Link
                key={recipe._id}
                to={`/recipe/${recipe._id}`}
                className="block relative overflow-hidden rounded-lg shadow-lg transform transition duration-300 ease-in-out hover:scale-105"
              >
                <div
                  className="h-48 bg-cover bg-center lazy-bg"
                  data-bg={recipe.images}
                >
                  <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white text-center p-2">
                    <h3 className="text-lg">{recipe.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeListPage;
