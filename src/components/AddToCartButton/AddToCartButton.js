import React from 'react';

const AddToCartButton = () => {
  const handleAddToCart = () => {
    // For now, we'll just log to the console. Later we'll connect to a DB.
    console.log("Item added to cart");
  };

  return (
    <button 
      onClick={handleAddToCart}
      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
      Add to Shopping Cart
    </button>
  );
};

export default AddToCartButton;
