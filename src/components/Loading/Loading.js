// src/components/Loading/Loading.js

import React from 'react';

// const Loading = () => {
//   return (
//     <div className="flex justify-center items-center h-screen space-x-4">
//       <i className="fas fa-utensils text-green-500 animate-bounce delay-100"></i>
//       <i className="fas fa-blender text-green-600 animate-bounce delay-200"></i>
//       <i className="fas fa-cookie-bite text-green-700 animate-bounce delay-300"></i>
//       <i className="fas fa-wine-bottle text-green-800 animate-bounce delay-400"></i>
//       <i className="fas fa-pepper-hot text-green-900 animate-bounce delay-500"></i>
//       <i className="fas fa-apple-alt text-green-700 animate-bounce delay-600"></i>
//     </div>
//   );
// };

const icons = ['🍴', '🥄', '🍲', '🍳', '🧀', '🥖'];

const Loading = ({ pageClasses }) => {
  return (
    <div className={`flex justify-center items-center ${pageClasses}`}>
      <div className="flex space-x-4">
        {icons.map((icon, index) => (
          <div
            key={index}
            className={`text-4xl animate-bounce ${index * 150}ms delay-${index}`}
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {icon}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;
