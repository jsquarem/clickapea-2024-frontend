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
              ? 'bg-[#31614f] text-[#1EB17C] shadow-inner-lg md:rounded'
              : !isEditing
                ? 'lg:hover:bg-[#234136] lg:hover:text-[#1EB17C] md:rounded'
                : ''
          }`}
          onClick={() => handleRowClick(index)}
        >
          <div
            className={`text-2xl w-10 text-center ${
              completed[index] && !isEditing ? 'text-[#1EB17C]' : ''
            }`}
          >
            {completed[index] && !isEditing ? (
              <i className="fas fa-check text-4xl font-bold drop-shadow-lg"></i>
            ) : (
              <div className="text-4xl font-bold">{index + 1}</div>
            )}
          </div>
          <div className="flex-1 ml-4">
            {isEditing ? (
              <div className="flex w-full gap-2">
                <textarea
                  value={instruction}
                  onChange={(e) => onInputChange(e, index)}
                  className="form-textarea w-full h-24"
                />
                <button
                  onClick={() => onRemove(index)}
                  className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold px-10 rounded flex items-center justify-center"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ) : (
              <p className="drop-shadow-lg">{instruction}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Instructions;
