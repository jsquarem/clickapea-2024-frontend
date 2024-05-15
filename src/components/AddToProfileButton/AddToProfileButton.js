import React, { useState, useContext, useEffect, useRef } from 'react';
import AuthContext from '../../AuthContext';

const AddToProfileButton = ({ recipeId }) => {
  const { isAuthenticated, login, user } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [successfulCategories, setSuccessfulCategories] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetch(`${process.env.REACT_APP_API_URL}/api/categories?userId=${user._id}`)
        .then(res => res.json())
        .then(data => {
          setCategories(data);
          const successCategories = data.filter(category => category.recipes.includes(recipeId)).map(category => category._id);
          setSuccessfulCategories(successCategories);
        });
    }
  }, [user, recipeId]);

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

  const handleSaveCategory = () => {
    if (newCategory.trim() !== '') {
      fetch(`${process.env.REACT_APP_API_URL}/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newCategory, user: user._id })
      })
        .then(res => res.json())
        .then(data => setCategories([...categories, data]))
        .finally(() => {
          setNewCategory('');
          setAddingCategory(false);
        });
    }
  };

  const handleCancelCategory = () => {
    setNewCategory('');
    setAddingCategory(false);
  };

  const handleCategoryClick = (categoryId, recipeId) => {
    fetch(`${process.env.REACT_APP_API_URL}/api/categories/${categoryId}/recipes/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ recipeId })
    })
      .then(res => res.json())
      .then(() => {
        setSuccessfulCategories([...successfulCategories, categoryId]);
        setTimeout(() => {
          setShowDropdown(false);
        }, 2000); // Delay closing by 2 seconds
      });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !dropdownRef.current.contains(event.relatedTarget)) {
        setShowDropdown(false);
        setAddingCategory(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);
  

  console.log(recipeId, '<-recipeId');

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={handleButtonClick}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Add to Profile
      </button>
      {showDropdown && (
        <div className="absolute top-full mt-2 bg-white border rounded shadow-lg p-4 z-10 w-64">
          {!isAuthenticated ? (
            <button 
              onClick={handleLogin}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded w-full">
              Login to add recipe
            </button>
          ) : (
            <>
              <ul>
              {categories.map((category, index) => (
                <li key={index} className="mb-2">
                  <button 
                    onClick={() => handleCategoryClick(category._id, recipeId)} 
                    className={`flex justify-between items-center w-full text-left hover:bg-gray-200 p-2 rounded ${successfulCategories.includes(category._id) ? 'bg-green-100' : ''}`}>
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
                onClick={handleAddCategoryClick}>
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
                      onClick={handleCancelCategory}>
                      Cancel
                    </button>
                    <button 
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={handleSaveCategory}>
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
