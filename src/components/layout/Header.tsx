import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useRecipeSelection } from "../../hooks/useRecipeSelection";

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { selectedRecipes } = useRecipeSelection();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="flex justify-between items-center h-[92px] border-b border-gray-100 px-4 max-w-[1568px] mx-auto md:px-8 bg-white relative">
      <Link to="/" className="flex items-center gap-2.5">
        <div className="text-[22px] md:text-[24px] font-extrabold text-gray-800 flex items-center">
          <svg
            className="w-6 h-6 md:w-7 md:h-7 text-blue-500 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          Recipe Explorer
        </div>
      </Link>

      <nav className="hidden md:block">
        <ul className="flex items-center gap-8">
          <li>
            <Link
              to="/"
              className={`transition-colors ${
                location.pathname === "/"
                  ? "text-blue-500 font-medium"
                  : "text-gray-700 hover:text-blue-500 font-medium"
              }`}
            >
              All Recipes
            </Link>
          </li>
          <li>
            <Link
              to="/favorites"
              className={`transition-colors flex items-center ${
                location.pathname === "/favorites"
                  ? "text-blue-500 font-medium"
                  : "text-gray-700 hover:text-blue-500 font-medium"
              }`}
            >
              Selected Recipes
              {selectedRecipes.length > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-700 text-xs rounded-full px-2 py-0.5">
                  {selectedRecipes.length}
                </span>
              )}
            </Link>
          </li>
        </ul>
      </nav>

      <button
        className="md:hidden p-2 rounded-md hover:bg-gray-100"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-lg z-50 border-t border-gray-100 md:hidden">
          <ul className="px-4 py-3">
            <li className="py-2">
              <Link
                to="/"
                onClick={toggleMobileMenu}
                className={`block px-2 py-1 rounded ${
                  location.pathname === "/"
                    ? "text-blue-500 bg-blue-50 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                All Recipes
              </Link>
            </li>
            <li className="py-2">
              <Link
                to="/favorites"
                onClick={toggleMobileMenu}
                className={`block px-2 py-1 rounded lg:flex items-center justify-between ${
                  location.pathname === "/favorites"
                    ? "text-blue-500 bg-blue-50 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>Selected Recipes</span>
                {selectedRecipes.length > 0 && (
                  <span className="bg-blue-100 text-blue-700 text-xs rounded-full px-2 py-0.5">
                    {selectedRecipes.length}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
