import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const NotFound: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center">
      <div className="bg-white rounded-[20px] shadow-sm p-8 md:p-12 max-w-2xl w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="bg-gray-50 h-40 w-40 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="120"
              height="120"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400"
            >
              <path d="M12 9v4"></path>
              <path d="M12 17h.01"></path>
              <circle cx="12" cy="12" r="10"></circle>
            </svg>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Page Not Found
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          Oops! We couldn't find the recipe you were looking for.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors w-full md:w-auto justify-center"
          >
            <ChevronLeft size={18} className="mr-2" />
            Back to Recipes
          </Link>

          <Link
            to="/favorites"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors w-full md:w-auto"
          >
            View Selected Recipes
          </Link>
        </div>
      </div>

      <div className="text-center mt-8 text-gray-500">
        <p>Try searching for another recipe or browse our collection.</p>
      </div>
    </div>
  );
};

export default NotFound;
