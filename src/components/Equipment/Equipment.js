import React from 'react';
import './Equipment.css';

const Equipment = ({ equipment, isEditing, onInputChange }) => (
  <section className="mb-6">
    <h3 className="text-xl font-semibold mb-2">Equipment</h3>
    <ul className="list-disc list-inside grid grid-cols-2 gap-4">
      {equipment.map((item, index) => (
        <li key={index} className="flex items-center">
          {isEditing ? (
            <input
              type="text"
              value={item}
              onChange={(e) => onInputChange(e, index)}
              className="form-input w-full"
            />
          ) : (
            item
          )}
        </li>
      ))}
    </ul>
  </section>
);

export default Equipment;
