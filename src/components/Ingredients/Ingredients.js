import React, { useState } from 'react';
import Select from 'react-select';
import './Ingredients.css';

const fractionMap = {
  0.125: '1/8',
  0.167: '1/6',
  0.25: '1/4',
  0.333: '1/3',
  0.375: '3/8',
  0.5: '1/2',
  0.625: '5/8',
  0.667: '2/3',
  0.75: '3/4',
  0.833: '5/6',
  0.875: '7/8',
};

const decimalToFraction = (decimal) => {
  if (decimal === 0) return '0';
  if (decimal === 1) return '1';

  const tolerance = 0.01;
  for (let key in fractionMap) {
    if (Math.abs(decimal - parseFloat(key)) < tolerance) {
      return fractionMap[key];
    }
  }

  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  let h1 = 1,
    h2 = 0,
    k1 = 0,
    k2 = 1,
    b = decimal;
  do {
    let a = Math.floor(b);
    let aux = h1;
    h1 = a * h1 + h2;
    h2 = aux;
    aux = k1;
    k1 = a * k1 + k2;
    k2 = aux;
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

const Ingredients = ({ ingredients, isMetric, isEditing, onInputChange }) => {
  const [errors, setErrors] = useState({});

  const handleInputChange = (e, index, field, subField) => {
    let value;
    if (e.target) {
      value = e.target.value;
    } else {
      value = e.value;
    }

    const newIngredients = [...ingredients];
    if (subField) {
      newIngredients[index][field][subField] = value;
    } else {
      newIngredients[index][field] = value;
    }
    onInputChange(e, index, field, subField);

    // Validate quantity field
    if (subField === 'quantity') {
      const isValid = value === '' || !isNaN(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [index]: {
          ...prevErrors[index],
          quantity: !isValid,
        },
      }));
    }
  };

  const imperialUnits = [
    'teaspoon',
    'tsp',
    'tsp.',
    'tablespoon',
    'tbsp',
    'tbsp.',
    'cup',
    'cups',
    'pint',
    'pt',
    'pt.',
    'quart',
    'qt',
    'qt.',
    'gallon',
    'gal',
    'oz',
    'ounce',
    'ounces',
    'lb',
    'pound',
    'pounds',
    'in',
    'inch',
    'inches',
  ];

  const metricUnits = [
    'milliliter',
    'ml',
    'millilitres',
    'milliliters',
    'ml.',
    'liter',
    'litre',
    'liters',
    'litres',
    'l',
    'g',
    'gram',
    'grams',
    'gramme',
    'grammes',
    'kilogram',
    'kg',
    'kilograms',
    'kilogrammes',
    'cm',
    'centimeter',
    'centimetre',
    'centimeters',
    'centimetres',
    'mm',
    'millimeter',
    'millimetre',
    'millimeters',
    'millimetres',
  ];

  const groupedOptions = [
    {
      label: 'Imperial Units',
      options: imperialUnits
        .sort()
        .map((unit) => ({ value: unit, label: unit })),
    },
    {
      label: 'Metric Units',
      options: metricUnits.sort().map((unit) => ({ value: unit, label: unit })),
    },
  ];

  let displayAmount;

  return (
    <section className="mb-6">
      <ul id="ingredients-list" className="list-disc list-inside mb-4">
        {ingredients.map((ingredient, index) => {
          const amount = isMetric ? ingredient.metric : ingredient.imperial;
          const other = ingredient.other;

          displayAmount = '';
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
          }

          return (
            <div key={index} className="mb-2">
              <li className="items-center list-item">
                {isEditing ? (
                  <div className="flex flex-row w-full gap-2">
                    <div className="w-1/6">
                      <input
                        type="text"
                        value={amount?.quantity || ''}
                        onChange={(e) =>
                          handleInputChange(
                            e,
                            index,
                            isMetric ? 'metric' : 'imperial',
                            'quantity'
                          )
                        }
                        className="form-input w-full h-10"
                      />
                    </div>
                    <div className="w-1/4">
                      <Select
                        value={{
                          value: amount?.unit || '',
                          label: amount?.unit || '',
                        }}
                        onChange={(selectedOption) =>
                          handleInputChange(
                            { target: { value: selectedOption.value } },
                            index,
                            isMetric ? 'metric' : 'imperial',
                            'unit'
                          )
                        }
                        options={groupedOptions}
                        className="form-select w-full"
                        styles={{
                          control: (base) => ({
                            ...base,
                            height: '2.5rem',
                            minHeight: '2.5rem',
                          }),
                          valueContainer: (base) => ({
                            ...base,
                            height: '2.5rem',
                            display: 'flex',
                            alignItems: 'center',
                          }),
                          input: (base) => ({
                            ...base,
                            margin: 0,
                            padding: 0,
                          }),
                        }}
                      />
                    </div>
                    <div className="flex-grow">
                      <input
                        type="text"
                        value={ingredient.name}
                        onChange={(e) => handleInputChange(e, index, 'name')}
                        className="form-input w-full h-10"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    {displayAmount} {ingredient.name}
                  </>
                )}
              </li>
              {errors[index]?.quantity && (
                <span className="text-red-500 text-sm">
                  Quantity must be a number
                </span>
              )}
            </div>
          );
        })}
      </ul>
    </section>
  );
};

export default Ingredients;
