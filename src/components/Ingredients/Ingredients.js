import React from 'react';
import './Ingredients.css';
import { formatAmount, convertToMetric, convertToImperial } from '../../utils/conversionUtils';

const Ingredients = ({ ingredients, isMetric }) => (
  <ul id="ingredients-list" className="list-disc list-inside mb-4">
    {ingredients.map((ingredient, index) => {
      if (ingredient.amount.length === 0) {
        // Handle ingredients with no amount
        return (
          <li key={index}>
            {`${ingredient.name}`}
          </li>
        );
      }

      if (ingredient.amount.length === 1) {
        // If there's only one version of the ingredient, display it as is.
        const amountText = formatAmount(ingredient.amount[0], isMetric);
        return (
          <li key={index}>
            {`${amountText} ${ingredient.name}`}
          </li>
        );
      }

      // If there are multiple versions, choose based on the unit type.
      const amount = ingredient.amount.find(a =>
        isMetric ? isMetricUnit(a.unit) : isImperialUnit(a.unit)
      ) || (isMetric ? convertToMetric(ingredient.amount[0].quantity, ingredient.amount[0].unit) : convertToImperial(ingredient.amount[0].quantity, ingredient.amount[0].unit));

      const amountText = amount ? formatAmount(amount, isMetric) : '';
      return (
        <li key={index}>
          {amount ? `${amountText} ${ingredient.name}` : `${ingredient.name}`}
        </li>
      );
    })}
  </ul>
);

const isMetricUnit = (unit) => {
  return unit === 'gram' || unit === 'milliliter';
};

const isImperialUnit = (unit) => {
  return unit === 'cup' || unit === 'teaspoon' || unit === 'tablespoon' || unit === 'ounce' || unit === 'fluid ounce';
};

export default Ingredients;
