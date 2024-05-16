import React from 'react';
import './Instructions.css';

const Instructions = ({ instructions, isEditing, onInputChange }) => (
  <section className="mb-6">
    <h3 className="text-xl font-semibold mb-2">Instructions</h3>
    <ol className="list-decimal list-inside space-y-2">
      {instructions.map((instruction, index) => (
        <li key={index}>
          {isEditing ? (
            <textarea
              value={instruction}
              onChange={(e) => onInputChange(e, index)}
              className="form-textarea w-full h-24"
            />
          ) : (
            instruction
          )}
        </li>
      ))}
    </ol>
  </section>
);

export default Instructions;
