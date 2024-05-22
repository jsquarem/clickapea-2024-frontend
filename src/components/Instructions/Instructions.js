import React from 'react';
import './Instructions.css';

const Instructions = ({ instructions, isEditing, onInputChange, onRemove }) => (
  <ol className="list-decimal list-inside space-y-2">
    {instructions.map((instruction, index) => (
      <li key={index} className="flex items-center">
        {isEditing ? (
          <>
            <textarea
              value={instruction}
              onChange={(e) => onInputChange(e, index)}
              className="form-textarea w-full h-24"
            />
            <button
              onClick={() => onRemove(index)}
              className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold px-2 rounded"
            >
              <i className="fas fa-times"></i>
            </button>
          </>
        ) : (
          instruction
        )}
      </li>
    ))}
  </ol>
);

export default Instructions;
