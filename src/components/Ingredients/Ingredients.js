import React from 'react';
import './Ingredients.css';

const fractionMap = {
  "0.125": "1/8",
  "0.167": "1/6",
  "0.25": "1/4",
  "0.333": "1/3",
  "0.375": "3/8",
  "0.5": "1/2",
  "0.625": "5/8",
  "0.667": "2/3",
  "0.75": "3/4",
  "0.833": "5/6",
  "0.875": "7/8"
};

const decimalToFraction = (decimal) => {
  if (decimal === 0) return '0';
  if (decimal === 1) return '1';

  const tolerance = 0.01; // Increased tolerance for better rounding
  for (let key in fractionMap) {
    if (Math.abs(decimal - parseFloat(key)) < tolerance) {
      return fractionMap[key];
    }
  }

  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  let h1 = 1, h2 = 0, k1 = 0, k2 = 1, b = decimal;
  do {
    let a = Math.floor(b);
    let aux = h1; h1 = a * h1 + h2; h2 = aux;
    aux = k1; k1 = a * k1 + k2; k2 = aux;
    b = 1 / (b - a);
  } while (Math.abs(decimal - h1 / k1) > decimal * tolerance);

  let numerator = h1;
  let denominator = k1;

  const commonDivisor = gcd(numerator, denominator);
  numerator /= commonDivisor;
  denominator /= commonDivisor;

  if (denominator === 1) {
    return `${numerator}`;
  }

  if (numerator > denominator) {
    const wholeNumber = Math.floor(numerator / denominator);
    const remainder = numerator % denominator;
    if (remainder === 0) {
      return `${wholeNumber}`;
    } else {
      return `${wholeNumber} ${remainder}/${denominator}`;
    }
  }

  return `${numerator}/${denominator}`;
};

const Ingredients = ({ ingredients, isMetric }) => (
  <ul id="ingredients-list" className="list-disc list-inside mb-4">
    {ingredients.map((ingredient, index) => {
      const amount = isMetric ? ingredient.metric : ingredient.imperial;
      const other = ingredient.other;

      let displayAmount;
      if (amount && amount.quantity) {
        const roundedQuantity = Math.round(amount.quantity * 100) / 100;
        displayAmount = isMetric 
          ? `${roundedQuantity} ${amount.unit}` 
          : `${decimalToFraction(roundedQuantity)} ${amount.unit}`;
      } else if (other && other.quantity) {
        const roundedQuantity = Math.round(other.quantity * 100) / 100;
        displayAmount = isMetric 
          ? `${roundedQuantity} ${other.unit}` 
          : `${decimalToFraction(roundedQuantity)} ${other.unit}`;
      } else {
        displayAmount = '';
      }

      return (
        <li key={index}>
          {displayAmount} {ingredient.name}
        </li>
      );
    })}
  </ul>
);

export default Ingredients;
