import React from 'react';
import './NutritionalInfo.css';

const NutritionalInfo = ({ nutrients }) => (
  <section className="nutrition-label mt-6 lg:mt-0 lg:ml-6 bg-gray-50 border rounded p-4">
    <h3 className="text-xl font-semibold mb-2">Nutritional Information</h3>
    {Object.entries(nutrients).map(([key, value], index) => (
      <p key={index}>{value} {key === 'servingSize' ? 'Servings' : ''}</p>
    ))}
  </section>
);

export default NutritionalInfo;
