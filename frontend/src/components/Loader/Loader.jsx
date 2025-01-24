import React from 'react';

const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-60 z-50">
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-xl transform transition-all scale-95 hover:scale-100 ease-in-out duration-300">
        <div className="animate-spin rounded-full border-t-4 border-b-4 border-indigo-500 w-16 h-16 mb-6"></div>
        <p className="text-xl font-semibold text-gray-800">{message}</p>
      </div>
    </div>
  );
};

export default Loader;
