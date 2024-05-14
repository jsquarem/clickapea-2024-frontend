import React, { useState } from 'react';
import './ToggleSwitch.css';

const ToggleSwitch = ({ onToggle }) => {
  const [checked, setChecked] = useState(false);

  const handleChange = () => {
    setChecked(!checked);
    onToggle(!checked);
  };

  return (
    <div className="mb-4 flex items-center justify-between pr-8">
      <h3 className="text-xl font-semibold">Ingredients</h3>
      <div className="mb-4 flex items-center">
        <span className="mr-2">Metric</span>
        <label className="toggle-switch">
          <input 
            type="checkbox" 
            checked={checked} 
            onChange={handleChange} 
          />
          <span className="slider"></span>
        </label>
        <span className="ml-2">Imperial</span>
      </div>
    </div>
  );
};

export default ToggleSwitch;
