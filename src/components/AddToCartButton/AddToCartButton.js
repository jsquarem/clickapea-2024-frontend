import React, { useContext, useState } from 'react';
import { CartContext } from '../../CartContext';
import AuthContext from '../../AuthContext';

const AddToCartButton = ({ recipe }) => {
  const { isAuthenticated, login } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      login();
    } else {
      addToCart(recipe);
      setAdded(true);
    }
  };

  return (
    <div className="relative group w-full">
      <button
        onClick={handleAddToCart}
        className={`font-bold py-2 px-4 rounded items-center w-full text-white ${isAuthenticated ? (added ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#EA8804] hover:bg-orange-700') : 'bg-gray-500 cursor-not-allowed'}`}
        disabled={added}
      >
        <i className="fas fa-shopping-cart mr-2"></i>
        <span>{added ? 'Added' : 'Add to Cart'}</span>
      </button>
      {!isAuthenticated && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
          Please log in to add to cart
        </div>
      )}
    </div>
  );
};

export default AddToCartButton;
