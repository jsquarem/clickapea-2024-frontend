import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useCycle } from 'framer-motion';
import AuthContext from '../../AuthContext';
import AddRecipeModal from '../../components/AddRecipeModal/AddRecipeModal';
import { MenuToggle } from '../../components/MenuToggle/MenuToggle';
import './Header.css';

const Header = () => {
  const { isAuthenticated, user, login, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [headerSticky, setHeaderSticky] = useState(false);
  const [isMobile] = useState(window.innerWidth <= 768);
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);
  const location = useLocation();
  const [isOpen, toggleOpen] = useCycle(false, true);

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const sidebar = {
    open: {
      height: 'auto',
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 20,
        restDelta: 2,
      },
    },
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        delay: 0.5,
        type: 'spring',
        stiffness: 400,
        damping: 40,
      },
    },
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current?.contains(event.target)) {
        setShowDropdown(false);
      }
      if (
        menuRef.current &&
        !menuRef.current?.contains(event.target) &&
        !hamburgerRef.current?.contains(event.target)
      ) {
        toggleOpen(0);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef, menuRef, hamburgerRef]);

  useEffect(() => {
    // Close the mobile menu when navigating to a new page
    toggleOpen(0);
  }, [location]);

  useEffect(() => {
    // Close dropdown and menu when user logs in
    setShowDropdown(false);
    toggleOpen(0);
  }, [isAuthenticated]);

  const handleScroll = () => {
    if (window.pageYOffset > 0) {
      setHeaderSticky(true);
    } else {
      setHeaderSticky(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getLinkClass = (path) => {
    const baseClass =
      'flex text-[#387961] font-bold text-left lg:text-center p-2 lg:border-0 lg:rounded';
    const hoverClass = 'hover:bg-[#387961] hover:text-[#76cfae]';
    const activeClass = 'active:bg-[#387961] active:text-[#76cfae]';
    const activePageClass = 'bg-[#387961] text-[#76cfae] inset';

    return location.pathname === path
      ? `${baseClass} ${hoverClass} ${activeClass} ${activePageClass}`
      : `${baseClass} ${hoverClass} ${activeClass}`;
  };

  return (
    <header
      className={`site-nav ${headerSticky && !isOpen ? 'bg-opacity' : 'bg-[#1EB17C]'} p-4 flex items-center justify-between sticky top-0 z-30`}
    >
      <Link to="/">
        <div className="flex flex-row justify-start items-center">
          <img
            src="/assets/images/clickapea_logo_725_550.png"
            alt="Clickapea Logo"
            className="h-24 lg:h-32"
          />
          {!isMobile ? (
            <div className="p-4">
              <h1 className="text-5xl lg:text-6xl font-bold tracking-wide text-[#387961]">
                Clickapea
              </h1>
            </div>
          ) : (
            ''
          )}
        </div>
      </Link>
      <button
        onClick={toggleModal}
        className="hover:bg-[#c4985b] lg:mx-auto bg-yellow-500 text-white hover:text-[#db9585] font-bold w-1/4 lg:w-1/6 py-1 px-1 lg:py-5 lg:px-10 rounded-lg"
      >
        Add Recipe
      </button>
      <MenuToggle toggle={toggleOpen} isOpen={isOpen} />
      <motion.nav
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        variants={sidebar}
        ref={menuRef}
        className={`${
          isOpen ? 'block' : 'hidden'
        } lg:flex lg:items-center lg:space-x-4 lg:ml-auto absolute lg:static top-full left-0 w-full lg:w-auto bg-[#76cfae] lg:bg-transparent z-30 border-t-1 border-[#387961] lg:border-0 drop-shadow-md`}
      >
        <Link to="/" className={getLinkClass('/')}>
          <div className="flex flex-row items-center lg:flex-col lg:items-center">
            <i className="fa-solid fa-house lg:mb-1 lg:text-lg"></i>
            <span className="ml-2 lg:ml-0">Home</span>
          </div>
        </Link>
        <Link to="/recipes" className={getLinkClass('/recipes')}>
          <div className="flex items-center lg:flex-col lg:items-center">
            <i className="fa-solid fa-image lg:mb-1 lg:text-lg"></i>
            <span className="ml-2 lg:ml-0">All Recipes</span>
          </div>
        </Link>
        {isAuthenticated && user && (
          <>
            <Link to="/my-recipes" className={getLinkClass('/my-recipes')}>
              <div className="flex items-center lg:flex-col lg:items-center">
                <i className="fa-solid fa-book lg:mb-1 lg:text-lg"></i>
                <span className="ml-2 lg:ml-0">My Recipes</span>
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
              className={`${isOpen ? 'block' : 'hidden'} lg:hidden text-left`}
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
              isOpen ? 'block' : 'hidden'
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
      </motion.nav>
      {showModal && <AddRecipeModal isOpen={showModal} onClose={toggleModal} />}
    </header>
  );
};

export default Header;
