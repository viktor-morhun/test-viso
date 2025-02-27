import React, { useState } from "react";
import { Link } from "react-router-dom";
import RecipeCard from "../components/recipe/RecipeCard";
import { useRecipeSelection } from "../hooks/useRecipeSelection";
import { ChevronDown, ChevronUp } from "lucide-react";

interface IngredientWithMeasure {
  name: string;
  measures: string[];
  recipes: string[];
}

const SelectedRecipesPage: React.FC = () => {
  const { selectedRecipes, toggleRecipeSelection, clearSelections } =
    useRecipeSelection();
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(
    new Set()
  );
  const [expandedInstructions, setExpandedInstructions] = useState<Set<string>>(
    new Set()
  );

  const toggleIngredientChecked = (ingredientName: string) => {
    const newCheckedIngredients = new Set(checkedIngredients);
    if (newCheckedIngredients.has(ingredientName)) {
      newCheckedIngredients.delete(ingredientName);
    } else {
      newCheckedIngredients.add(ingredientName);
    }
    setCheckedIngredients(newCheckedIngredients);
  };

  const clearChecked = () => {
    setCheckedIngredients(new Set());
  };

  const toggleInstructions = (recipeId: string) => {
    const newExpandedInstructions = new Set(expandedInstructions);
    if (newExpandedInstructions.has(recipeId)) {
      newExpandedInstructions.delete(recipeId);
    } else {
      newExpandedInstructions.add(recipeId);
    }
    setExpandedInstructions(newExpandedInstructions);
  };

  const ingredientsMap = new Map<string, IngredientWithMeasure>();

  selectedRecipes.forEach((recipe) => {
    for (let i = 1; i <= 20; i++) {
      const ingredientKey = `strIngredient${i}` as keyof typeof recipe;
      const measureKey = `strMeasure${i}` as keyof typeof recipe;

      const ingredient = recipe[ingredientKey] as string;
      const measure = recipe[measureKey] as string;

      if (!ingredient || ingredient.trim() === "") continue;

      const ingredientName = ingredient.trim();
      const measureText = measure?.trim() || "";

      if (ingredientsMap.has(ingredientName.toLowerCase())) {
        const existingIngredient = ingredientsMap.get(
          ingredientName.toLowerCase()
        )!;

        if (measureText && !existingIngredient.measures.includes(measureText)) {
          existingIngredient.measures.push(measureText);
        }

        if (!existingIngredient.recipes.includes(recipe.strMeal)) {
          existingIngredient.recipes.push(recipe.strMeal);
        }
      } else {
        ingredientsMap.set(ingredientName.toLowerCase(), {
          name: ingredientName,
          measures: measureText ? [measureText] : [],
          recipes: [recipe.strMeal],
        });
      }
    }
  });

  const ingredients = Array.from(ingredientsMap.values());

  const totalIngredientInstances = selectedRecipes.reduce((count, recipe) => {
    let recipeCount = 0;
    for (let i = 1; i <= 20; i++) {
      const ingredientKey = `strIngredient${i}` as keyof typeof recipe;
      if (
        recipe[ingredientKey] &&
        (recipe[ingredientKey] as string).trim() !== ""
      ) {
        recipeCount++;
      }
    }
    return count + recipeCount;
  }, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Selected Recipes
        </h1>
        <Link
          to="/"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-center"
        >
          ← Back to All Recipes
        </Link>
      </div>

      {selectedRecipes.length > 0 ? (
        <>
          <div className="bg-blue-50 p-4 sm:p-6 rounded-lg mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
              <h2 className="text-xl font-semibold text-gray-800">
                Recipe Summary
              </h2>
              <div className="flex gap-2">
                {checkedIngredients.size > 0 && (
                  <button
                    onClick={clearChecked}
                    className="px-3 py-2 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 transition-colors text-sm"
                  >
                    Clear Checked
                  </button>
                )}
                <button
                  onClick={() => clearSelections()}
                  className="px-3 py-2 lg:cursor-pointer bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors text-sm"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-blue-500">
                  {selectedRecipes.length}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Total Recipes
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-blue-500">
                  {totalIngredientInstances}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Total Ingredient Uses
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-blue-500">
                  {ingredients.length}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Unique Ingredients
                </div>
              </div>
            </div>

            <h3 className="font-semibold text-lg mb-2 flex items-center">
              <span>Shopping List</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full ml-2">
                {ingredients.length - checkedIngredients.size} remaining
              </span>
            </h3>

            <div className="block sm:hidden">
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {ingredients
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((ingredient, index) => {
                    const isChecked = checkedIngredients.has(
                      ingredient.name.toLowerCase()
                    );
                    return (
                      <div
                        key={index}
                        className={`p-3 rounded-lg ${
                          isChecked ? "bg-gray-100" : "bg-white"
                        } shadow-sm`}
                      >
                        <div className="flex items-start gap-2">
                          <div className="pt-1 lg:pt-0 lg:my-auto px-2">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() =>
                                toggleIngredientChecked(
                                  ingredient.name.toLowerCase()
                                )
                              }
                              className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-400"
                            />
                          </div>
                          <div className="flex-1">
                            <div
                              className={`font-medium ${
                                isChecked
                                  ? "line-through text-gray-400"
                                  : "text-gray-800"
                              }`}
                            >
                              {ingredient.name}
                            </div>
                            <div
                              className={`text-sm ${
                                isChecked
                                  ? "line-through text-gray-400"
                                  : "text-gray-600"
                              }`}
                            >
                              {ingredient.measures.join(", ") || "As needed"}
                            </div>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {ingredient.recipes.map((recipe, idx) => (
                                <span
                                  key={idx}
                                  className={`inline-block px-2 py-0.5 text-xs ${
                                    isChecked
                                      ? "bg-gray-100 text-gray-400"
                                      : "bg-blue-100 text-blue-800"
                                  } rounded-full`}
                                >
                                  {recipe}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="hidden sm:block max-h-80 overflow-y-auto bg-white p-4 rounded-md">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 w-8"></th>{" "}
                    <th className="text-left py-2 px-4 font-semibold text-gray-700">
                      Ingredient
                    </th>
                    <th className="text-left py-2 px-4 font-semibold text-gray-700">
                      Quantity
                    </th>
                    <th className="text-left py-2 px-4 font-semibold text-gray-700">
                      Used In
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ingredients
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((ingredient, index) => {
                      const isChecked = checkedIngredients.has(
                        ingredient.name.toLowerCase()
                      );
                      return (
                        <tr
                          key={index}
                          className={`${index % 2 === 0 ? "bg-gray-50" : ""} ${
                            isChecked ? "bg-opacity-60" : ""
                          }`}
                        >
                          <td className="py-2 px-2">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() =>
                                toggleIngredientChecked(
                                  ingredient.name.toLowerCase()
                                )
                              }
                              className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-400"
                            />
                          </td>
                          <td className="py-2 px-4 text-gray-800">
                            <span
                              className={
                                isChecked ? "line-through text-gray-400" : ""
                              }
                            >
                              {ingredient.name}
                            </span>
                          </td>
                          <td className="py-2 px-4 text-gray-600">
                            <span
                              className={
                                isChecked ? "line-through text-gray-400" : ""
                              }
                            >
                              {ingredient.measures.join(", ") || "As needed"}
                            </span>
                          </td>
                          <td className="py-2 px-4 text-gray-600">
                            <div className="flex flex-wrap gap-1">
                              {ingredient.recipes.map((recipe, idx) => (
                                <span
                                  key={idx}
                                  className={`inline-block px-2 py-1 text-xs ${
                                    isChecked
                                      ? "bg-gray-100 text-gray-400"
                                      : "bg-blue-100 text-blue-800"
                                  } rounded-full`}
                                >
                                  {recipe}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            <h3 className="font-semibold text-lg mt-8 mb-2">
              Cooking Instructions
            </h3>
            <div className="bg-white rounded-md p-4 space-y-4">
              {selectedRecipes.map((recipe) => {
                const isExpanded = expandedInstructions.has(recipe.idMeal);
                return (
                  <div
                    key={recipe.idMeal}
                    className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0"
                  >
                    <button
                      onClick={() => toggleInstructions(recipe.idMeal)}
                      className="flex justify-between lg:cursor-pointer items-center w-full text-left py-2"
                    >
                      <h4 className="text-md font-medium text-gray-800">
                        {recipe.strMeal}
                      </h4>
                      <span className="text-blue-500 transition-transform duration-300">
                        {isExpanded ? (
                          <ChevronUp
                            size={18}
                            className="transform transition-transform duration-300"
                          />
                        ) : (
                          <ChevronDown
                            size={18}
                            className="transform transition-transform duration-300"
                          />
                        )}
                      </span>
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isExpanded ? "opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="mt-2 text-gray-600 text-sm">
                        {recipe.strInstructions
                          .split("\r\n")
                          .map((paragraph, idx) => (
                            <p key={idx} className="mb-2 max-w-[1000px]">
                              {paragraph}
                            </p>
                          ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Your Selected Recipes
          </h2>

          <div className="flex flex-col lg:flex-row lg:flex-wrap gap-5 w-full items-center lg:items-start">
            {selectedRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.idMeal}
                recipe={recipe}
                isSelected={true}
                onSelect={() => toggleRecipeSelection(recipe)}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-6">
            You haven't selected any recipes yet.
          </p>
          <Link
            to="/"
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Browse Recipes
          </Link>
        </div>
      )}
    </div>
  );
};

export default SelectedRecipesPage;
