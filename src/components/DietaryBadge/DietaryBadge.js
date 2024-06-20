import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@mdi/react';
import {
  mdiLeaf,
  mdiSprout,
  mdiBreadSlice,
  mdiCheese,
  mdiPeanut,
  mdiCarrot,
  mdiFoodDrumstick,
  mdiHeart,
  mdiCandycane,
  mdiOil,
  mdiApple,
  mdiFish,
  mdiGlassMugVariant,
  mdiTree,
  mdiFoodHalal,
  mdiFoodKosher,
  mdiWeightLifter,
  mdiBabyCarriage,
  mdiCorn,
  mdiCarChildSeat,
  mdiShakerOutline,
  mdiEggOutline,
  mdiCheckCircle,
} from '@mdi/js';

const badgeStyles = {
  Vegetarian: {
    bgColor: 'bg-green-500',
    textColor: 'text-white',
    icon: mdiLeaf,
  },
  Vegan: {
    bgColor: 'bg-green-500',
    textColor: 'text-white',
    icon: mdiSprout,
  },
  'Gluten-Free': {
    bgColor: 'bg-blue-500',
    textColor: 'text-white',
    icon: mdiBreadSlice,
  },
  'Dairy-Free': {
    bgColor: 'bg-blue-500',
    textColor: 'text-white',
    icon: mdiCheese,
  },
  'Nut-Free': {
    bgColor: 'bg-orange-500',
    textColor: 'text-white',
    icon: mdiPeanut,
  },
  'Soy-Free': {
    bgColor: 'bg-yellow-500',
    textColor: 'text-black',
    icon: mdiLeaf,
  },
  'Egg-Free': {
    bgColor: 'bg-pink-500',
    textColor: 'text-white',
    icon: mdiEggOutline,
  },
  'Low-Carb': {
    bgColor: 'bg-red-500',
    textColor: 'text-white',
    icon: mdiCarrot,
  },
  Keto: {
    bgColor: 'bg-red-500',
    textColor: 'text-white',
    icon: mdiFoodDrumstick,
  },
  Paleo: {
    bgColor: 'bg-red-500',
    textColor: 'text-white',
    icon: mdiFoodDrumstick,
  },
  'Low-Sodium': {
    bgColor: 'bg-teal-500',
    textColor: 'text-white',
    icon: mdiShakerOutline,
  },
  'Low-Sugar': {
    bgColor: 'bg-teal-500',
    textColor: 'text-white',
    icon: mdiCandycane,
  },
  'Low-Fat': {
    bgColor: 'bg-teal-500',
    textColor: 'text-white',
    icon: mdiOil,
  },
  Halal: {
    bgColor: 'bg-purple-500',
    textColor: 'text-white',
    icon: mdiFoodHalal, // Placeholder, replace with correct icon if found
  },
  Kosher: {
    bgColor: 'bg-purple-500',
    textColor: 'text-white',
    icon: mdiFoodKosher, // Placeholder, replace with correct icon if found
  },
  Whole30: {
    bgColor: 'bg-yellow-500',
    textColor: 'text-black',
    icon: mdiApple,
  },
  Pescatarian: {
    bgColor: 'bg-teal-500',
    textColor: 'text-white',
    icon: mdiFish,
  },
  FODMAP: {
    bgColor: 'bg-yellow-500',
    textColor: 'text-black',
    icon: mdiSprout,
  },
  'Lactose-Free': {
    bgColor: 'bg-blue-500',
    textColor: 'text-white',
    icon: mdiGlassMugVariant,
  },
  'Shellfish-Free': {
    bgColor: 'bg-orange-500',
    textColor: 'text-white',
    icon: mdiCheckCircle,
  },
  'Peanut-Free': {
    bgColor: 'bg-orange-500',
    textColor: 'text-white',
    icon: mdiPeanut,
  },
  'Tree-Nut-Free': {
    bgColor: 'bg-orange-500',
    textColor: 'text-white',
    icon: mdiTree,
  },
  'Nightshade-Free': {
    bgColor: 'bg-yellow-500',
    textColor: 'text-black',
    icon: mdiLeaf,
  },
  'Anti-Inflammatory': {
    bgColor: 'bg-teal-500',
    textColor: 'text-white',
    icon: mdiLeaf,
  },
  'Diabetic-Friendly': {
    bgColor: 'bg-red-500',
    textColor: 'text-white',
    icon: mdiCandycane,
  },
  Mediterranean: {
    bgColor: 'bg-yellow-500',
    textColor: 'text-black',
    icon: mdiApple,
  },
  Organic: {
    bgColor: 'bg-green-500',
    textColor: 'text-white',
    icon: mdiSprout,
  },
  'Non-GMO': {
    bgColor: 'bg-green-500',
    textColor: 'text-white',
    icon: mdiLeaf,
  },
  'Heart-Healthy': {
    bgColor: 'bg-red-500',
    textColor: 'text-white',
    icon: mdiHeart,
  },
  'Kid-Friendly': {
    bgColor: 'bg-yellow-500',
    textColor: 'text-black',
    icon: mdiCarChildSeat,
  },
  'Pregnancy-Friendly': {
    bgColor: 'bg-pink-500',
    textColor: 'text-white',
    icon: mdiBabyCarriage,
  },
  'High-Protein': {
    bgColor: 'bg-red-500',
    textColor: 'text-white',
    icon: mdiWeightLifter,
  },
  'High-Fiber': {
    bgColor: 'bg-green-500',
    textColor: 'text-white',
    icon: mdiLeaf,
  },
  Raw: {
    bgColor: 'bg-green-500',
    textColor: 'text-white',
    icon: mdiSprout,
  },
  'Sugar-Free': {
    bgColor: 'bg-teal-500',
    textColor: 'text-white',
    icon: mdiCandycane,
  },
  'Corn-Free': {
    bgColor: 'bg-yellow-500',
    textColor: 'text-black',
    icon: mdiCorn,
  },
};

const DietaryBadge = ({ name }) => {
  console.log('DietaryBadge name:', name);
  const { bgColor, textColor, icon } = badgeStyles[name] || {};
  return (
    <span
      className={`badge ${bgColor} ${textColor} inline-flex items-center p-2 rounded`}
    >
      <Icon path={icon} size={1} className="mr-1" /> {name}
    </span>
  );
};

DietaryBadge.propTypes = {
  name: PropTypes.string.isRequired,
};

export default DietaryBadge;
