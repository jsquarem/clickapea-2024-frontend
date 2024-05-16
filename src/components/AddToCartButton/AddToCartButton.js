import React, { useContext } from 'react';
import AuthContext from '../../AuthContext';

const AddToCartButton = () => {
  const { isAuthenticated, login } = useContext(AuthContext);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      login();
    } else {
      console.log('Item added to cart');
      // Implement actual add to cart functionality here
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={handleAddToCart}
        className={`font-bold py-2 px-4 rounded inline-flex items-center w-full text-white ${isAuthenticated ? 'bg-orange-500 hover:bg-orange-700' : 'bg-gray-500 cursor-not-allowed'}`}
      >
        <i className="fas fa-shopping-cart mr-2"></i>
        <span>Add to Cart</span>
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
