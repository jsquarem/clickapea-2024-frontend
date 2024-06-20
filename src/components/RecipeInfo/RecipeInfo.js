import React from 'react';
import DietaryBadge from '../../components/DietaryBadge/DietaryBadge';
import './RecipeInfo.css';

const RecipeInfo = ({
  title,
  author,
  recipeUrl,
  host,
  totalTime,
  servings,
  mealType,
  dietaryRestrictions,
  isEditing,
  isCreating,
  onInputChange,
}) => {
  return (
    <div className="mb-4 text-gray-600">
      {isEditing ? (
        <>
          <div className="editable-field py-1">
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => onInputChange('title', e.target.value)}
              className="form-input"
            />
          </div>
          <div className="editable-field py-1">
            <label>Author:</label>
            <input
              type="text"
              value={author}
              onChange={(e) => onInputChange('author', e.target.value)}
              className="form-input"
            />
          </div>
          {!isCreating ?? (
            <>
              <div className="editable-field py-1">
                <label>Source:</label>
                <input
                  type="text"
                  value={host}
                  onChange={(e) => onInputChange('host', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="editable-field py-1">
                <label>Recipe URL:</label>
                <input
                  type="text"
                  value={recipeUrl}
                  onChange={(e) => onInputChange('url', e.target.value)}
                  className="form-input"
                />
              </div>
            </>
          )}
          <div className="editable-field py-1">
            <label>Total Time (in minutes):</label>
            <input
              type="text"
              value={totalTime}
              onChange={(e) => onInputChange('total_time', e.target.value)}
              className="form-input"
            />
          </div>
          <div className="editable-field py-1">
            <label>Servings:</label>
            <input
              type="text"
              value={servings}
              onChange={(e) => onInputChange('yields', e.target.value)}
              className="form-input"
            />
          </div>
        </>
      ) : (
        <>
          {title && (
            <h2 className="font-bold text-3xl text-center lg:text-5xl lg:text-left pb-2">
              {title}
            </h2>
          )}
          <div className="flex flex-row w-full">
            <div className="w-5/12">
              {author && (
                <p>
                  <span className="font-bold">Author:</span> {author}
                </p>
              )}
              {recipeUrl && host && (
                <p>
                  <span className="font-bold">Source:</span>{' '}
                  <a
                    href={recipeUrl}
                    className="text-green-500 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {host}
                  </a>
                </p>
              )}
              {totalTime && (
                <p>
                  <span className="font-bold">Total Time:</span> {totalTime}
                </p>
              )}
              {servings && (
                <p>
                  <span className="font-bold">Servings:</span> {servings}
                </p>
              )}
            </div>
            <div className="w-7/12 flex flex-wrap gap-1 justify-center items-center">
              {dietaryRestrictions.map((restriction) => (
                <DietaryBadge key={restriction} name={restriction} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RecipeInfo;
