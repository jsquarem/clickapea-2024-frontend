import React from 'react';
import './RecipeInfo.css';

const RecipeInfo = ({ author, host, totalTime, servings }) => (
  <div className="mb-4 text-gray-600">
    <p>Author: {author}</p>
    <p>Source: <a href={`https://${host}`} className="text-green-500 underline">{host}</a></p>
    <p>Total Time: {totalTime}</p>
    <p>Servings: {servings}</p>
  </div>
);

export default RecipeInfo;