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
        <Link 
          to="/add-recipe" 
          className="text-green-500 hover:text-green-700 font-bold mr-4"
        >
          <i class="fa-solid fa-utensils"></i> Add Recipe
        </Link>
      {isAuthenticated && user ? (
        <div className="relative ml-auto flex items-center pr-8" ref={dropdownRef}>
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
                onClick={logout}>
                <i className="fa-solid fa-right-from-bracket"></i> Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <button 
          onClick={login}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto pr">
          <i class="fa-regular fa-user"></i> Login
        </button>
      )}
    </header>
  );
};

export default Header;