import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../CartContext';

const ShoppingCart = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateItemQuantity } =
    useContext(CartContext);

  return (
    <div
      className={`w-full lg:w-1/5 fixed top-32 lg:top-40 right-0 h-[calc(100vh-4rem)] bg-white shadow-lg transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <button onClick={onClose} className="absolute top-4 right-4">
        <i className="fas fa-times"></i>
      </button>
      <div className="p-4 max-h-full overflow-y-auto">
        {cartItems.length === 0 ? (
          <div className="p-4">Your cart is empty.</div>
        ) : (
          <div className="p-4">
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
                  className="flex items-center"
                >
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-12 h-12 mr-2"
                  />
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
    </div>
  );
};

export default ShoppingCart;
