import React, { useState } from 'react';
import './Instructions.css';

const Instructions = ({ instructions, isEditing, onInputChange, onRemove }) => {
  const [completed, setCompleted] = useState(
    Array(instructions.length).fill(false)
  );

  const handleRowClick = (index) => {
    if (!isEditing) {
      const newCompleted = [...completed];
      newCompleted[index] = !newCompleted[index];
      setCompleted(newCompleted);
    }
  };

  return (
    <div className="space-y-2">
      {instructions.map((instruction, index) => (
        <div
          key={index}
          className={`flex items-start p-2 ${
            !isEditing ? 'cursor-pointer' : ''
          } ${
            completed[index] && !isEditing
              ? 'bg-[#D8D1F0] text-[#8B85C3] shadow-inner rounded'
              : !isEditing
                ? 'lg:hover:bg-gray-200'
                : ''
          }`}
          onClick={() => handleRowClick(index)}
        >
          <div
            className={`text-2xl w-10 text-center ${
              completed[index] && !isEditing ? 'text-[#8B85C3]' : ''
            }`}
          >
            {completed[index] && !isEditing ? (
              <i className="fas fa-check"></i>
            ) : (
              <div>{index + 1}</div>
            )}
          </div>
          <div className="flex-1 ml-4">
            {isEditing ? (
              <div className="flex w-full gap-2">
                <textarea
                  value={instruction}
                  onChange={(e) => onInputChange(e, index)}
                  className="form-textarea w-11/12 h-24"
                />
                <button
                  onClick={() => onRemove(index)}
                  className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold px-4 rounded flex items-center justify-center"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ) : (
              <p>{instruction}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Instructions;
