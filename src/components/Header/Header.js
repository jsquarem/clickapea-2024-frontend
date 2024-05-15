import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../AuthContext';
import logoSrc from '../../assets/clickapea_logo_800_2400.png';
import './Header.css';

const Header = () => {
  const { isAuthenticated, user, login, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <header className="bg-green-200 flex items-center pl-4 relative pr-8">
      <img src={logoSrc} alt="Clickapea Logo" className="h-32 mr-4" />
      <div className="ml-auto flex items-center space-x-4">
        {isAuthenticated && user && (
          <Link
            to="/categories"
            className="text-green-500 hover:text-green-200 font-bold text-center hover:bg-green-600 rounded p-2"
          >
            <div className="">
              <i className="fa-solid fa-list"></i>
              <br />
              Categories
            </div>
          </Link>
        )}
        <Link
          to="/add-recipe"
          className="text-green-500 hover:text-green-200 font-bold text-center hover:bg-green-600 rounded p-2"
        >
          <i className="fa-solid fa-utensils"></i>
          <br /> Add Recipe
        </Link>
        {isAuthenticated && user ? (
          <div className="relative" ref={dropdownRef}>
            <img
              src={user.picture}
              alt="Profile"
              className="h-10 w-10 rounded-full cursor-pointer"
              onClick={handleProfileClick}
            />
            {showDropdown && (
              <div className="absolute top-full mt-2 right-0 bg-white border rounded shadow-lg p-4 z-10">
                <button
                  className="bg-red-300 hover:bg-red-500 text-white font-bold py-2 px-8 rounded w-full"
                  onClick={logout}
                >
                  <i className="fa-solid fa-right-from-bracket"></i> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={login}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            <i className="fa-regular fa-user"></i> Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
