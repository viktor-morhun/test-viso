import React, { useState, useEffect } from "react";
import { useRecipes } from "../hooks/useRecipes";
import useDebounce from "../hooks/useDebounce";
import RecipeCard from "../components/recipe/RecipeCard";
import RecipeCardSkeleton from "../components/recipe/RecipeCardSkeleton";
import SearchBar from "../components/common/SearchBar";
import Loader from "../components/common/Loader";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../services/mealDbService";
import { Link } from "react-router-dom";
import { useRecipeSelection } from "../hooks/useRecipeSelection";

const AllRecipesPage: React.FC = () => {
  const [searchInput, setSearchInput] = useState("");

  const { selectedRecipes, toggleRecipeSelection, clearSelections } =
    useRecipeSelection();

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 24 * 60 * 60 * 1000,
  });

  const {
    recipes,
    isLoading,
    isPartialData,
    loadingProgress,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    pageNumbers,
    setSelectedCategory,
    selectedCategory,
    setSearchTerm,
    totalRecipes,
  } = useRecipes(10);

  const debouncedSearchTerm = useDebounce(searchInput, 500);

  useEffect(() => {
    setSearchTerm(debouncedSearchTerm);
  }, [debouncedSearchTerm, setSearchTerm]);

  const renderSkeletons = () => {
    if (recipes.length > 0) return null;

    return (
      <div className="flex flex-col lg:flex-row lg:flex-wrap gap-5 w-full items-center lg:items-start">
        {Array(6)
          .fill(0)
          .map((_, idx) => (
            <RecipeCardSkeleton key={idx} />
          ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">All Recipes</h1>
        {selectedRecipes.length > 0 && (
          <Link
            to="/favorites"
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Selected Recipes ({selectedRecipes.length})
            <span className="ml-2">→</span>
          </Link>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search for recipes..."
            className="w-full"
          />
        </div>

        <div className="md:w-64">
          <select
            className="w-full p-2 border rounded-md"
            value={selectedCategory || ""}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
          >
            <option value="">All Categories</option>
            {!categoriesLoading &&
              categories?.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
          </select>
        </div>
      </div>

      {selectedRecipes.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">
              Selected Recipes ({selectedRecipes.length})
            </h2>
            <button
              onClick={() => clearSelections()}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedRecipes.map((recipe) => (
              <span
                key={recipe.idMeal}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
              >
                {recipe.strMeal}
              </span>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <div className="text-sm">
              {selectedRecipes.length} recipes selected
            </div>
            <Link
              to="/favorites"
              className="px-4 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              View Selected
            </Link>
          </div>
        </div>
      )}

      {isLoading && recipes.length === 0 && !isPartialData && (
        <div className="flex flex-col relative items-center justify-center py-12">
          <Loader />
        </div>
      )}

      <div className="mb-4 flex flex-wrap justify-between items-center">
        <div className="text-sm text-gray-600">
          {isPartialData ? (
            <div className="flex items-center">
              <span>Showing partial results while loading more recipes...</span>
              <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                {loadingProgress.toFixed(0)}% loaded
              </span>
            </div>
          ) : (
            <span>
              Showing {recipes.length} of {totalRecipes} recipes
            </span>
          )}
        </div>

        {isPartialData && (
          <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
        )}
      </div>

      {isLoading && recipes.length === 0 && renderSkeletons()}

      {recipes.length > 0 ? (
        <div className="flex flex-col lg:flex-row lg:flex-wrap gap-5 w-full items-center lg:items-start">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.idMeal}
              recipe={recipe}
              isSelected={selectedRecipes.some(
                (r) => r.idMeal === recipe.idMeal
              )}
              onSelect={() => toggleRecipeSelection(recipe)}
            />
          ))}

          {isPartialData &&
            Array(4)
              .fill(0)
              .map((_, idx) => <RecipeCardSkeleton key={`loading-${idx}`} />)}
        </div>
      ) : !isLoading ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            No recipes found. Try adjusting your search or filters.
          </p>
        </div>
      ) : null}

      {isPartialData && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center transition-opacity duration-300 z-50">
          <svg
            className="animate-spin h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading more recipes...
        </div>
      )}

      {totalPages > 1 && (!isPartialData || !isLoading) && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-500 hover:bg-blue-50 lg:cursor-pointer"
              }`}
            >
              &laquo;
            </button>

            {pageNumbers.map((page, index) => (
              <button
                key={index}
                onClick={() =>
                  typeof page === "number" ? goToPage(page) : null
                }
                className={`mx-1 px-3 py-1 rounded ${
                  page === currentPage
                    ? "bg-blue-500 text-white"
                    : page === "..."
                    ? "text-gray-600 cursor-default"
                    : "text-blue-500 hover:bg-blue-50 lg:cursor-pointer"
                }`}
                disabled={page === "..."}
              >
                {page}
              </button>
            ))}

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-500 hover:bg-blue-50 lg:cursor-pointer"
              }`}
            >
              &raquo;
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default AllRecipesPage;
