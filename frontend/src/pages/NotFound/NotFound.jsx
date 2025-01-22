// 404Page.js
import React from 'react';

const NotFound = () => {
  return (
    <div className="text-center py-10">
      <h1 className="text-4xl font-bold text-red-500">404</h1>
      <p className="text-xl text-gray-600 mt-4">Page Not Found</p>
      <a href="/" className="text-blue-500 hover:underline mt-4 block">
        Go to Homepage
      </a>
    </div>
  );
};

export default NotFound;
