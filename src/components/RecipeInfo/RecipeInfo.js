import React from 'react';
import './RecipeInfo.css';

const RecipeInfo = ({
  title,
  author,
  recipeUrl,
  host,
  totalTime,
  servings,
  isEditing,
  isCreating,
  onInputChange,
}) => (
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
          <label>Total Time:</label>
          <input
            type="text"
            value={totalTime}
            onChange={(e) => onInputChange('total_time', e.target.value)}
            className="form-input"
          />
          {isNaN(totalTime) && (
            <span className="text-red-500 text-sm">
              Total time must be a number
            </span>
          )}
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
      </>
    )}
  </div>
);

export default RecipeInfo;
