import React from 'react';
import './RecipeInfo.css';

const RecipeInfo = ({ author, recipeUrl, host, totalTime, servings }) => (
  <div className="mb-4 text-gray-600">
    {author && <p>Author: {author}</p>}
    {recipeUrl && host && (
      <p>Source: <a href={recipeUrl} className="text-green-500 underline" target="_blank" rel="noopener noreferrer">{host}</a></p>
    )}
    {totalTime && <p>Total Time: {totalTime}</p>}
    {servings && <p>Servings: {servings}</p>}
  </div>
);

export default RecipeInfo;
