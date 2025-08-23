import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6">
      <div className="bg-white shadow-lg rounded-xl p-10 text-center max-w-md">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">⚠️</h1>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
          Access Denied
        </h2>
        <p className="text-gray-600 mb-6">
          You must be logged in to view this page.  
          Please log in to proceed.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-gray-900 transition-colors"
        >
          Login to Proceed
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
