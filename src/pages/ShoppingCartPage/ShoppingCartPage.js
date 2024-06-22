import React, { useContext, useState } from 'react';
import { CartContext } from '../../CartContext';
import { Link } from 'react-router-dom';

const ShoppingCartPage = () => {
  const { cartItems, removeFromCart, updateItemQuantity } =
    useContext(CartContext);
  const [isMetric, setIsMetric] = useState(false);

  const handleToggleUnits = () => {
    setIsMetric(!isMetric);
  };

  const groupedIngredients = () => {
    const ingredients = {};
    cartItems.forEach((item) => {
      item.ingredients.forEach((ingredient) => {
        const unit = isMetric
          ? ingredient.metric.unit
          : ingredient.imperial.unit;
        const quantity = isMetric
          ? ingredient.metric.quantity
          : ingredient.imperial.quantity;
        const key = `${ingredient.name}-${unit}`;

        if (ingredients[key]) {
          ingredients[key].quantity += quantity;
        } else {
          ingredients[key] = { ...ingredient, quantity };
        }
      });
    });

    return ingredients;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">Shopping Cart</h1>
      <button
        className="mb-4 bg-blue-500 text-white p-2 rounded"
        onClick={handleToggleUnits}
      >
        Toggle to {isMetric ? 'Imperial' : 'Metric'}
      </button>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
        <ul>
          {Object.keys(groupedIngredients()).map((key) => {
            const ingredient = groupedIngredients()[key];
            return (
              <li key={key} className="flex justify-between">
                <span>{ingredient.name}</span>
                <span>
                  {ingredient.quantity}{' '}
                  {isMetric ? ingredient.metric.unit : ingredient.imperial.unit}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="bg-white p-4 rounded shadow mt-4">
        <h2 className="text-2xl font-bold mb-4">Recipes</h2>
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between mb-2">
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
                onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
              >
                -
              </button>
              <span className="mx-2">{item.quantity}</span>
              <button
                onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
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
      </div>
    </div>
  );
};

export default ShoppingCartPage;
