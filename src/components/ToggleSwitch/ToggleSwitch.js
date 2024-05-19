import React, { useState } from 'react';

const ToggleSwitch = ({ onToggle }) => {
  const [checked, setChecked] = useState(false);

  const handleChange = () => {
    setChecked(!checked);
    onToggle(!checked);
  };

  return (
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-xl font-semibold">Ingredients</h3>
      <div className="flex items-center space-x-4 text-lg">
        <span
          className={`lg:mr-2 ${!checked ? 'font-bold text-blue-500' : 'text-gray-500'}`}
          style={{ width: '60px', textAlign: 'right' }}
        >
          Imperial
        </span>
        <label className="toggle-switch relative inline-block w-14 h-8">
          <input
            type="checkbox"
            checked={checked}
            onChange={handleChange}
            className="opacity-0 w-0 h-0"
          />
          <span className="slider absolute inset-0 cursor-pointer bg-gray-300 rounded-full transition duration-400"></span>
          <span
            className="slider-before absolute h-6 w-6 left-1 bottom-1 bg-white rounded-full transition-transform duration-400 transform"
            style={{
              transform: checked ? 'translateX(26px)' : 'translateX(0)',
            }}
          ></span>
        </label>
        <span
          className={`lg:ml-2 ${checked ? 'font-bold text-blue-500' : 'text-gray-500'}`}
          style={{ width: '60px', textAlign: 'left' }}
        >
          Metric
        </span>
      </div>
    </div>
  );
};

export default ToggleSwitch;
