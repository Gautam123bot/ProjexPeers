import React from 'react';

const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50 z-50">
      <div className="text-center text-white p-6 bg-gray-800 rounded-lg shadow-lg">
        <div className="animate-spin rounded-full border-t-4 border-b-4 border-indigo-500 w-16 h-16 mx-auto"></div>
        <p className="mt-4 text-lg">{message}</p>
      </div>
    </div>
  );
};

export default Loader;
