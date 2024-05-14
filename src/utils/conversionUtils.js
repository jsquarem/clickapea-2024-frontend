import Fraction from 'fraction.js';
import convert from 'convert-units';

// Utility function to convert a decimal to a fraction rounded to the nearest denominator
const convertToFraction = (decimal) => {
  const fraction = new Fraction(decimal).simplify(1/8); // simplify to the nearest 1/8
  return fraction;
};

// Utility function to convert a fraction to a mixed number
const toMixedNumber = (fraction) => {
  const { s, n, d } = fraction; // sign, numerator, and denominator
  const wholeNumber = Math.floor(n / d);
  const remainder = n % d;
  
  if (remainder === 0) return `${s < 0 ? '-' : ''}${wholeNumber}`;
  if (wholeNumber === 0) return `${s < 0 ? '-' : ''}${fractionToSymbol(`${remainder}/${d}`)}`;
  return `${s < 0 ? '-' : ''}${wholeNumber} ${fractionToSymbol(`${remainder}/${d}`)}`;
};

// Utility function to convert common fractions to symbols
const fractionToSymbol = (fraction) => {
  const fractionSymbols = {
    '1/2': '½',
    '1/3': '⅓',
    '2/3': '⅔',
    '1/4': '¼',
    '3/4': '¾',
    '1/5': '⅕',
    '2/5': '⅖',
    '3/5': '⅗',
    '4/5': '⅘',
    '1/6': '⅙',
    '5/6': '⅚',
    '1/8': '⅛',
    '3/8': '⅜',
    '5/8': '⅝',
    '7/8': '⅞',
  };
  return fractionSymbols[fraction] || fraction;
};

// Utility function to convert and format the amount
const formatAmount = (amount, isMetric) => {
  const decimalQuantity = parseFloat(amount.quantity);
  if (isMetric) {
    return `${decimalQuantity} ${amount.unit}`;
  } else {
    const fraction = convertToFraction(decimalQuantity);
    const mixedNumber = toMixedNumber(fraction);
    return `${mixedNumber} ${amount.unit}`;
  }
};

// Utility function to convert metric to imperial units
const convertToImperial = (quantity, unit) => {
  const conversions = {
    gram: 'oz',
    milliliter: 'fl-oz'
  };

  if (conversions[unit]) {
    const convertedAmount = convert(quantity).from(unit).to(conversions[unit]);
    return { amount: convertedAmount, unit: conversions[unit] };
  }

  return { amount: quantity, unit };
};

// Utility function to convert imperial to metric units
const convertToMetric = (quantity, unit) => {
  const conversions = {
    cup: 'ml',
    teaspoon: 'ml',
    tablespoon: 'ml',
    ounce: 'g',
    'fluid ounce': 'ml'
  };

  if (conversions[unit]) {
    const convertedAmount = convert(quantity).from(unit).to(conversions[unit]);
    return { amount: convertedAmount, unit: conversions[unit] };
  }

  return { amount: quantity, unit };
};

// Specific conversions for certain ingredients
const convertTeaspoonToGram = (quantity) => {
  const convertedAmount = convert(quantity).from('tsp').to('g');
  return `${convertedAmount.toFixed(2)} gram`;
};

const convertGramToTeaspoonOrTablespoon = (quantity) => {
  const teaspoonAmount = convert(quantity).from('g').to('tsp');
  if (teaspoonAmount < 3) {
    return `${toMixedNumber(convertToFraction(teaspoonAmount))} teaspoon`;
  }
  const tablespoonAmount = convert(quantity).from('g').to('Tbs');
  return `${toMixedNumber(convertToFraction(tablespoonAmount))} tablespoon`;
};

export { convertToFraction, toMixedNumber, fractionToSymbol, formatAmount, convertToImperial, convertToMetric, convertTeaspoonToGram, convertGramToTeaspoonOrTablespoon };
