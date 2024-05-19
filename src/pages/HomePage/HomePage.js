import React from 'react';
import { Link } from 'react-router-dom';
import AddRecipeForm from '../../components/AddRecipeForm/AddRecipeForm';

const HomePage = () => {
  return (
    <div>
      <header className="text-center py-8 bg-white">
        <h1 className="text-3xl lg:text-4xl font-bold">
          Welcome to Clickapea!
        </h1>
        <p className="text-xl text-gray-600">Your ultimate sous chef bestie</p>
      </header>

      <section className="py-8 bg-white max-w-6xl mx-auto">
        <div className="w-full flex justify-center pb-16">
          <div className="w-11/12 lg:w-1/2 text-center bg-gray-100 border border-gray-300 p-6 rounded-lg shadow-md">
            <AddRecipeForm />
          </div>
        </div>
        <h2 className="text-3xl font-semibold text-center mb-8">
          Key Features
        </h2>
        <div className="mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-2">Recipe Management</h3>
            <p className="text-gray-600 px-2">
              Organize and store all your favorite recipes in one place. Our
              easy-to-use interface allows you to quickly add, edit, and search
              for recipes.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-2">
              Ingredient Conversion
            </h3>
            <p className="text-gray-600 px-2">
              Effortlessly convert ingredients between metric and imperial
              units. Clickapea takes the guesswork out of measurements.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-2">
              Interactive Instructions
            </h3>
            <p className="text-gray-600 px-2">
              Follow step-by-step cooking instructions with ease. Our
              interactive guide ensures you never miss a step.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-2">Shopping List</h3>
            <p className="text-gray-600 px-2">
              Create and manage your shopping list directly from your recipes.
              Clickapea helps you stay organized and prepared.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-2">Save Recipes</h3>
            <p className="text-gray-600 px-2">
              Easily save recipes from all over the internet with just a web
              address. Clickapea fetches and processes all the details for you,
              making it simple to keep all your favorite recipes in one place.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-2">
              Nutritional Information
            </h3>
            <p className="text-gray-600 px-2">
              Get detailed nutritional information for all your recipes.
              Clickapea helps you make informed decisions about your meals.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <h2 className="text-3xl font-semibold text-center mb-8">Happy Users</h2>
        <div className="max-w-4xl mx-auto space-y-8">
          <blockquote className="text-center text-gray-600 italic">
            <p>
              “Clickapea has revolutionized my cooking experience. It's like
              having a personal sous chef!”
            </p>
            <footer className="mt-2">- Alex</footer>
          </blockquote>
          <blockquote className="text-center text-gray-600 italic">
            <p>
              “The ingredient conversion feature is a game-changer for me. No
              more struggling with measurements!”
            </p>
            <footer className="mt-2">- Jamie</footer>
          </blockquote>
        </div>
      </section>

      <footer className="py-12 bg-gray-900 text-white text-center">
        <Link
          to="/signup"
          className="inline-block bg-orange-500 text-white text-lg font-semibold py-3 px-6 rounded hover:bg-orange-600 transition"
        >
          Join Clickapea Today!
        </Link>
      </footer>
    </div>
  );
};

export default HomePage;
