import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../../CartContext';
import { Link } from 'react-router-dom';

const ShoppingCartPage = () => {
  const { cartItems, removeFromCart, updateItemQuantity } =
    useContext(CartContext);
  const [isMetric, setIsMetric] = useState(false);
  const [shoppingItemsList, setShoppingItemsList] = useState([]);
  const [customIngredient, setCustomIngredient] = useState('');

  const handleToggleUnits = () => {
    setIsMetric(!isMetric);
  };

  const toTitleCase = (str) => {
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  };

  const handleAddCustomIngredient = () => {
    if (customIngredient.trim() !== '') {
      const newIngredient = {
        name: customIngredient,
        quantity: '',
        unit: '',
        custom: true,
      };
      setShoppingItemsList([...shoppingItemsList, newIngredient]);
      setCustomIngredient('');
    }
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = [...shoppingItemsList];
    newIngredients.splice(index, 1);
    setShoppingItemsList(newIngredients);
  };

  const generateShoppingItemsList = () => {
    const ingredients = {};
    cartItems.forEach((item) => {
      item.ingredients.forEach((ingredient) => {
        if (!ingredient.name) return;

        const metric = ingredient.metric || {};
        const imperial = ingredient.imperial || {};
        const other = ingredient.other || {};
        const unit = isMetric
          ? metric.unit || other.unit
          : imperial.unit || other.unit;
        const quantity = isMetric
          ? metric.quantity || other.quantity
          : imperial.quantity || other.quantity;
        const key = `${ingredient.name.toLowerCase()}-${unit || 'no-unit'}`;

        if (ingredients[key]) {
          ingredients[key].quantity += quantity ? quantity * item.quantity : 0;
        } else {
          ingredients[key] = {
            name: ingredient.name,
            quantity: quantity ? quantity * item.quantity : '',
            unit,
          };
        }
      });
    });

    return Object.values(ingredients);
  };

  useEffect(() => {
    const initialIngredients = generateShoppingItemsList();
    setShoppingItemsList(initialIngredients);
  }, [cartItems, isMetric]);

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
          {shoppingItemsList.map((ingredient, index) => (
            <li key={index} className="flex justify-start items-center">
              <span>{toTitleCase(ingredient.name)}</span>
              <span className="flex items-center pr-4 ml-auto">
                {ingredient.quantity} {ingredient.unit}
              </span>
              <button
                onClick={() => handleRemoveIngredient(index)}
                className="text-red-500 text-lg ml-2"
              >
                <i className="fas fa-trash"></i>
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex">
          <input
            type="text"
            placeholder="Add custom ingredient"
            value={customIngredient}
            onChange={(e) => setCustomIngredient(e.target.value)}
            className="border p-2 mr-2 flex-grow"
          />
          <button
            onClick={handleAddCustomIngredient}
            className="bg-green-500 text-white p-2 rounded"
          >
            + Add Ingredient
          </button>
        </div>
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
              className="flex items-center"
            >
              <img
                src={item.images[0]}
                alt={item.title}
                className="w-12 h-12 mr-2"
              />
              {item.title}
            </Link>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                className="bg-gray-300 text-black px-2 py-1 rounded-lg text-lg"
              >
                -
              </button>
              <span className="mx-2 text-lg">{item.quantity}</span>
              <button
                onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                className="bg-gray-300 text-black px-2 py-1 rounded-lg text-lg"
              >
                +
              </button>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 text-lg"
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
