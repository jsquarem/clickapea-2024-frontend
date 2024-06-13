import React from 'react';
import Instructions from '../Instructions/Instructions';

const InstructionsContainer = ({
  instructions,
  isEditing,
  onInputChange,
  onRemove,
  completedInstructions,
  toggleCompletedInstruction,
  addInstruction,
  scrollToCard,
}) => {
  return (
    <div
      id="card3"
      className="bg-[#E6E6FA] p-4 rounded-lg w-full lg:col-span-7 relative transform transition-transform duration-300 ease-in-out"
    >
      <h3 className="text-xl font-semibold mb-2 cursor-pointer relative z-10 flex items-center">
        {isEditing ? (
          <button
            className="text-blue-500 hover:text-white hover:bg-blue-500 rounded-md p-2"
            onClick={addInstruction}
          >
            <i className="fas fa-plus"></i> Add Instruction
          </button>
        ) : (
          <a
            href="#card3"
            onClick={(e) => {
              e.preventDefault();
              scrollToCard('card3');
            }}
          >
            Instructions
          </a>
        )}
        <img
          src="/assets/images/workflow.png"
          alt="Gallery"
          className="w-20 h-20 ml-2 -mt-4 transition-transform duration-300 ease-in-out card-hover-transform"
          style={{
            position: 'absolute',
            right: 0,
            top: -30,
          }}
        />
      </h3>
      <Instructions
        instructions={instructions}
        isEditing={isEditing}
        onInputChange={onInputChange}
        onRemove={onRemove}
        onToggleComplete={toggleCompletedInstruction}
        completedInstructions={completedInstructions}
      />
    </div>
  );
};

export default InstructionsContainer;
