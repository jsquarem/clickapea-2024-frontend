import React from 'react';
import './Equipment.css';

const equipmentImages = {
  "wooden spoon": "https://img.icons8.com/dusk/64/000000/spoon.png",
  "oven": "https://img.icons8.com/color/48/000000/oven.png",
  "whisk": "https://img.icons8.com/color/48/000000/whisk.png",
  "mixing bowl": "https://img.icons8.com/doodle/48/000000/mixing-bowl.png",
  "stand mixer": "https://img.icons8.com/color/48/000000/electric-mixer.png",
  "rolling pin": "https://img.icons8.com/color/48/000000/rolling-pin.png",
  "bowl": "https://img.icons8.com/dusk/64/000000/bowl.png"
};

const Equipment = ({ equipment }) => (
  <section className="mb-6">
    <h3 className="text-xl font-semibold mb-2">Equipment</h3>
    <ul className="list-disc list-inside grid grid-cols-2 gap-4">
      {equipment.map((item, index) => (
        <li key={index} className="flex items-center">
          <img src={equipmentImages[item]} alt={item} className="h-8 w-8 mr-2" />
          {item}
        </li>
      ))}
    </ul>
  </section>
);

export default Equipment;
