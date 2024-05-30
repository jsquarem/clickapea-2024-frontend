import React from 'react';

const DeleteModal = ({
  onClose,
  onConfirm,
  title,
  text,
  confirmText,
  cancelText,
}) => {
  const handleClickOutside = (event) => {
    if (event.target.id === 'modal-background') {
      onClose();
    }
  };

  return (
    <div
      id="modal-background"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10"
      onClick={handleClickOutside}
    >
      <div className="bg-white p-6 rounded shadow-lg text-center w-1/2">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p>{text}</p>
        <div className="flex justify-center space-x-4 pt-4">
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            {confirmText}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
