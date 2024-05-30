// src/pages/NotFoundPage.js

import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-[61vh] p-6">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-900">404</h1>
        <p className="text-2xl font-medium text-gray-700 mb-4">
          Page Not Found
        </p>
        <p className="text-lg text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
