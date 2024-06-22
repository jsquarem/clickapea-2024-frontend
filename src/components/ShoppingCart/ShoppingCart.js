import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../CartContext';

const ShoppingCart = () => {
  const { cartItems, removeFromCart, updateItemQuantity } =
    useContext(CartContext);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  return (
    <div className="relative">
      <button onClick={toggleDropdown} className="relative">
        <i className="fas fa-shopping-cart"></i>
        {cartItems.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
            {cartItems.length}
          </span>
        )}
      </button>
      {isDropdownVisible && (
        <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg z-30">
          {cartItems.length === 0 ? (
            <div className="p-4">Your cart is empty.</div>
          ) : (
            <div className="p-4 max-h-60 overflow-y-auto">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between mb-2"
                >
                  <Link
                    to={
                      item.isUserRecipe
                        ? `/recipe/user/${item.id}`
                        : `/recipe/${item.id}`
                    }
                  >
                    {item.title}
                  </Link>
                  <div className="flex items-center">
                    <button
                      onClick={() =>
                        updateItemQuantity(item.id, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateItemQuantity(item.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-2 text-red-500"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
              <Link
                to="/shopping-cart"
                className="text-blue-500 hover:text-blue-700"
              >
                View Full Cart
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;
