import React, { useState, useContext, useEffect, useRef } from 'react';
import AuthContext from '../../AuthContext';

const AddToProfileButton = () => {
  const { isAuthenticated, login } = useContext(AuthContext);
  const [categories, setCategories] = useState(["Breakfast", "Lunch", "Dinner"]); // Fake data for categories
  const [showDropdown, setShowDropdown] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const dropdownRef = useRef(null);

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
      setCategories([...categories, newCategory]);
      setNewCategory('');
      setAddingCategory(false);
    }
  };

  const handleCancelCategory = () => {
    setNewCategory('');
    setAddingCategory(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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
              {categories.length > 0 ? (
                <>
                  <ul>
                    {categories.map((category, index) => (
                      <li key={index} className="mb-2">{category}</li>
                    ))}
                  </ul>
                  <button 
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mt-2 w-full"
                    onClick={handleAddCategoryClick}>
                    Add New Category
                  </button>
                </>
              ) : (
                <button 
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded w-full"
                  onClick={handleAddCategoryClick}>
                  Add New Category
                </button>
              )}
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
