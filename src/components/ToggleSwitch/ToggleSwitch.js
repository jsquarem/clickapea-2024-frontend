import React, { useState } from 'react';

const ToggleSwitch = ({ onToggle }) => {
  const [checked, setChecked] = useState(false);

  const handleChange = () => {
    setChecked(!checked);
    onToggle(!checked);
  };

  return (
    <div className="flex justify-between items-center space-x-2 md:space-x-4 text-lg">
      <span
        className={`text-2xl ${!checked ? 'font-bold text-[#37A0C5]' : 'text-gray-600'}`}
        style={{ width: '90px', textAlign: 'right' }}
      >
        <span className="inline">Imperial</span>
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
        className={`text-2xl ${checked ? 'font-bold text-[#37A0C5]' : 'text-gray-600'}`}
        style={{ width: '90px', textAlign: 'left' }}
      >
        <span className="inline">Metric</span>
      </span>
    </div>
  );
};

export default ToggleSwitch;
