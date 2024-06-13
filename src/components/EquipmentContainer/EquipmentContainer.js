import React from 'react';
import Equipment from '../Equipment/Equipment';

const EquipmentContainer = ({
  equipment,
  isEditing,
  onInputChange,
  onRemove,
  addEquipment,
  scrollToCard,
}) => {
  return (
    <div id="card4">
      <h3 className="text-3xl lg:text-4xl font-semibold mb-2 cursor-pointer relative z-10 flex items-center">
        {isEditing ? (
          <button className="text-blue-500" onClick={addEquipment}>
            <i className="fas fa-plus"></i> Add Equipment
          </button>
        ) : (
          <a
            href="#card4"
            onClick={(e) => {
              e.preventDefault();
              scrollToCard('card4');
            }}
          >
            Equipment
          </a>
        )}
        <img
          src="/assets/images/kitchen-tool.png"
          alt="Gallery"
          className="w-20 h-20 ml-2 -mt-4 transition-transform duration-300 ease-in-out card-hover-transform"
          style={{
            position: 'absolute',
            right: 0,
            top: -30,
          }}
        />
      </h3>
      <Equipment
        equipment={equipment}
        isEditing={isEditing}
        onInputChange={onInputChange}
        onRemove={onRemove}
      />
    </div>
  );
};

export default EquipmentContainer;
