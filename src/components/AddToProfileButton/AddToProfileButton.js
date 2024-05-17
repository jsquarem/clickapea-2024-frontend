import React, { useState, useContext, useEffect, useRef } from 'react';
import AuthContext from '../../AuthContext';
import {
  fetchUserCategories,
  addRecipeToCategory,
  removeRecipeFromCategory,
  addCategory,
} from '../../utils/api';

const AddToProfileButton = ({ recipeId, onUpdateRecipeId }) => {
  const { isAuthenticated, login, user } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [successfulCategories, setSuccessfulCategories] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      if (isAuthenticated && user && user._id) {
        const data = await fetchUserCategories(user._id);
        setCategories(data);
        const successCategories = data
          .filter((category) => category.recipes.includes(recipeId))
          .map((category) => category._id);
        setSuccessfulCategories(successCategories);
      }
    };
    fetchCategories();
  }, [isAuthenticated, user, recipeId]);

  const handleButtonClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogin = () => {
    login();
    setShowDropdown(false);
  };

  const handleAddCategoryClick = () => {
    setAddingCategory(true);
  };

  const handleSaveCategory = async () => {
    if (newCategory.trim() !== '' && user && user._id) {
      const data = await addCategory(newCategory, user._id);
      setCategories([...categories, data]);
      setNewCategory('');
      setAddingCategory(false);
    }
  };

  const handleCancelCategory = () => {
    setNewCategory('');
    setAddingCategory(false);
  };

  const handleCategoryClick = async (categoryId) => {
    const isInCategory = successfulCategories.includes(categoryId);
    if (isInCategory) {
      await removeRecipeFromCategory(categoryId, recipeId);
      setSuccessfulCategories(
        successfulCategories.filter((id) => id !== categoryId)
      );
    } else {
      const response = await addRecipeToCategory(categoryId, recipeId);
      const { userRecipeId } = response;
      setSuccessfulCategories([...successfulCategories, categoryId]);
      onUpdateRecipeId(userRecipeId);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !dropdownRef.current.contains(event.relatedTarget)
      ) {
        setShowDropdown(false);
        setAddingCategory(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleButtonClick}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center w-full"
      >
        <i className="fas fa-user-plus mr-2"></i>
        <span>Add to Profile</span>
      </button>
      {showDropdown && (
        <div className="absolute top-full mt-2 bg-white border rounded shadow-lg p-4 z-10 w-64">
          {!isAuthenticated ? (
            <button
              onClick={handleLogin}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded w-full"
            >
              Login to add recipe
            </button>
          ) : (
            <>
              <ul>
                {categories.map((category, index) => (
                  <li key={index} className="mb-2">
                    <button
                      onClick={() => handleCategoryClick(category._id)}
                      disabled={
                        !successfulCategories.includes(category._id) &&
                        successfulCategories.length > 0
                      }
                      className={`flex justify-between items-center w-full text-left p-2 rounded ${
                        successfulCategories.includes(category._id)
                          ? 'bg-green-100'
                          : ''
                      } ${
                        !successfulCategories.includes(category._id) &&
                        successfulCategories.length > 0
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'hover:bg-gray-200'
                      }`}
                    >
                      {category.name}
                      {successfulCategories.includes(category._id) && (
                        <i className="fas fa-check text-green-500"></i>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mt-2 w-full"
                onClick={handleAddCategoryClick}
              >
                Add New Category
              </button>
              {addingCategory && (
                <div className="mt-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New Category"
                    className="border p-2 w-full mb-2"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                      onClick={handleCancelCategory}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={handleSaveCategory}
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AddToProfileButton;
