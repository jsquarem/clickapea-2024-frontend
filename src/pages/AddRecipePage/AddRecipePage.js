import React from 'react';
import AddRecipeForm from '../../components/AddRecipeForm/AddRecipeForm';
import './AddRecipePage.css';

const AddRecipePage = () => {
  return (
    <div className="text-gray-800 text-left">
      <main className="max-w-6xl mx-auto p-6">
        <AddRecipeForm />
      </main>
    </div>
  );
};

export default AddRecipePage;
