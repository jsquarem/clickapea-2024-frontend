import React from 'react';
import NutritionalInfo from '../NutritionalInfo/NutritionalInfo';

const NutritionalInfoContainer = ({
  nutrients,
  isEditing,
  onInputChange,
  scrollToCard,
}) => {
  return (
    <div id="card5">
      <h3 className="text-3xl lg:text-4xl font-semibold mb-2 cursor-pointer relative z-10 flex items-center">
        <a
          href="#card5"
          onClick={(e) => {
            e.preventDefault();
            scrollToCard('card5');
          }}
        >
          Nutrition
        </a>
        <img
          src="/assets/images/nutritional-pyramid.png"
          alt="Gallery"
          className="w-20 h-20 ml-2 -mt-4 transition-transform duration-300 ease-in-out card-hover-transform"
          style={{
            position: 'absolute',
            right: 0,
            top: -30,
          }}
        />
      </h3>
      <NutritionalInfo
        nutrients={nutrients}
        isEditing={isEditing}
        onInputChange={onInputChange}
      />
    </div>
  );
};

export default NutritionalInfoContainer;
