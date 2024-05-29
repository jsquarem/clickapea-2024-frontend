import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../../AuthContext';
import logoSrc from '../../assets/clickapea_logo_800_2400.png';

const Header = () => {
  const { isAuthenticated, user, login, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

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

  useEffect(() => {
    // Close the mobile menu when navigating to a new page
    setMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const getLinkClass = (path) => {
    const baseClass =
      'block text-green-500 font-bold text-left lg:text-center p-2 border-b border-green-300 lg:border-0 rounded transition-all';
    const hoverClass = 'hover:bg-green-600 hover:text-green-200';
    const activeClass = 'active:bg-green-800';
    const activePageClass = 'bg-green-800 inset';

    return location.pathname === path
      ? `${baseClass} ${hoverClass} ${activeClass} ${activePageClass}`
      : `${baseClass} ${hoverClass} ${activeClass}`;
  };

  return (
    <header className="bg-green-200 p-4 flex items-center justify-between relative">
      <Link to="/">
        <img src={logoSrc} alt="Clickapea Logo" className="h-24 lg:h-32" />
      </Link>
      <button
        className="block lg:hidden text-green-500 hover:text-green-700 focus:outline-none"
        onClick={toggleMenu}
      >
        <i className="fas fa-bars fa-2x"></i>
      </button>
      <nav
        className={`${
          menuOpen ? 'block' : 'hidden'
        } lg:flex lg:items-center lg:space-x-4 lg:ml-auto absolute lg:static top-full left-0 w-full lg:w-auto bg-green-200 lg:bg-transparent z-30 border-t-4 border-green-400 lg:border-0 drop-shadow-md`}
      >
        <Link to="/" className={getLinkClass('/')}>
          <div className="flex items-center lg:flex-col lg:items-center">
            <i className="fa-solid fa-house lg:mb-1 lg:text-lg"></i>
            <span className="ml-2 lg:ml-0">Home</span>
          </div>
        </Link>
        <Link to="/recipes" className={getLinkClass('/recipes')}>
          <div className="flex items-center lg:flex-col lg:items-center">
            <i className="fa-solid fa-book lg:mb-1 lg:text-lg"></i>
            <span className="ml-2 lg:ml-0">All Recipes</span>
          </div>
        </Link>
        {isAuthenticated && user && (
          <>
            <Link to="/categories" className={getLinkClass('/categories')}>
              <div className="flex items-center lg:flex-col lg:items-center">
                <i className="fa-solid fa-folder lg:mb-1 lg:text-lg"></i>
                <span className="ml-2 lg:ml-0">Categories</span>
              </div>
            </Link>
          </>
        )}
        <Link to="/create-recipe" className={getLinkClass('/create-recipe')}>
          <div className="flex items-center lg:flex-col lg:items-center">
            <i className="fa-solid fa-utensils lg:mb-1 lg:text-lg"></i>
            <span className="ml-2 lg:ml-0">Create Recipe</span>
          </div>
        </Link>
        {isAuthenticated && user ? (
          <>
            <div className="relative lg:ml-4 lg:p-0" ref={dropdownRef}>
              <img
                src={user.picture}
                alt="Profile"
                className="hidden lg:block h-16 w-16 rounded-full cursor-pointer"
                onClick={handleProfileClick}
              />
              {showDropdown && (
                <div className="absolute top-full mt-2 right-0 bg-white border rounded shadow-lg p-4 z-10 w-44">
                  <Link
                    to="/profile"
                    className="block text-green-500 hover:text-green-700 font-bold py-2"
                  >
                    <div className="flex items-center flex-row">
                      <i className="fa-regular fa-user"></i>{' '}
                      <span className="pl-2">Profile</span>
                    </div>
                  </Link>
                  <button
                    className="block bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-8 rounded w-full mt-2"
                    onClick={logout}
                  >
                    <i className="fa-solid fa-right-from-bracket"></i> Logout
                  </button>
                </div>
              )}
            </div>
            <div
              className={`${menuOpen ? 'block' : 'hidden'} lg:hidden text-left`}
            >
              <Link to="/profile" className={getLinkClass('/profile')}>
                <div className="flex items-center lg:flex-col lg:items-center">
                  <i className="fa-regular fa-user lg:mb-1 lg:text-lg"></i>
                  <span className="ml-2 lg:ml-0">Profile</span>
                </div>
              </Link>
              <div className="text-center mt-2 p-4">
                <button
                  onClick={logout}
                  className="nav-link block bg-red-300 hover:bg-red-500 text-white font-bold py-2 px-4 rounded mx-auto"
                >
                  <i className="fa-solid fa-right-from-bracket"></i> Logout
                </button>
              </div>
            </div>
          </>
        ) : (
          <div
            className={`${
              menuOpen ? 'block' : 'hidden'
            } lg:block lg:ml-4 text-center py-4`}
          >
            <button
              onClick={login}
              className="nav-link block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-auto"
            >
              <i className="fa-regular fa-user"></i> Login
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
