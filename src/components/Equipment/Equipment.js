import React from 'react';
import './Equipment.css';

const Equipment = ({ equipment, isEditing, onInputChange, onRemove }) => (
  <ul className="list-disc list-inside grid grid-cols-2 gap-4">
    {equipment.map((item, index) => (
      <li key={index} className="flex items-center">
        {isEditing ? (
          <>
            <input
              type="text"
              value={item}
              onChange={(e) => onInputChange(e, index)}
              className="form-input w-full"
            />
            <button
              onClick={() => onRemove(index)}
              className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
            >
              <i className="fas fa-times"></i>
            </button>
          </>
        ) : (
          item
        )}
      </li>
    ))}
  </ul>
);

export default Equipment;
