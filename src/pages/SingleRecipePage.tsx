import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchSingleRecipe } from "../services/mealDbService";
import Loader from "../components/common/Loader";
import { useRecipeSelection } from "../hooks/useRecipeSelection";
import NotFound from "./404";
import {
  ChevronLeft,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
} from "lucide-react";

const SingleRecipePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedRecipes, toggleRecipeSelection } = useRecipeSelection();
  const [activeTab, setActiveTab] = useState<"instructions" | "ingredients">(
    "instructions"
  );

  const {
    data: recipe,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["recipe", id],
    queryFn: () => fetchSingleRecipe(id || ""),
    enabled: !!id,
    staleTime: 30 * 60 * 1000,
  });

  const isSelected = selectedRecipes.some((r) => r.idMeal === id);

  const ingredients: { name: string; measure: string }[] = [];
  if (recipe) {
    for (let i = 1; i <= 20; i++) {
      const ingredientKey = `strIngredient${i}` as keyof typeof recipe;
      const measureKey = `strMeasure${i}` as keyof typeof recipe;

      const ingredient = recipe[ingredientKey] as string;
      const measure = recipe[measureKey] as string;

      if (ingredient && ingredient.trim() !== "") {
        ingredients.push({
          name: ingredient.trim(),
          measure: measure?.trim() || "As needed",
        });
      }
    }
  }

  const instructionParagraphs = recipe?.strInstructions
    ? recipe.strInstructions
        .split(/\r\n|\n\n|\n/)
        .filter((p) => p.trim() !== "")
    : [];

  const tags = recipe?.strTags
    ? recipe.strTags.split(",").map((tag) => tag.trim())
    : [];

  if (isLoading) {
    return (
      <div className="container relative mx-auto px-4 py-12 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isError || !recipe || !recipe.strMeal) {
    return <NotFound />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-blue-500"
        >
          <ChevronLeft size={20} className="mr-1" />
          <span>Back to All Recipes</span>
        </Link>

        <button
          onClick={() => toggleRecipeSelection(recipe)}
          className={`inline-flex items-center px-4 py-2 rounded-md ${
            isSelected
              ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
              : "bg-gray-50 text-gray-700 hover:bg-gray-100"
          }`}
        >
          {isSelected ? (
            <>
              <BookmarkCheck size={18} className="mr-2" />
              <span>Selected</span>
            </>
          ) : (
            <>
              <Bookmark size={18} className="mr-2" />
              <span>Select Recipe</span>
            </>
          )}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:flex-1">
            <div className="relative h-64 md:h-full">
              <img
                src={recipe.strMealThumb}
                alt={recipe.strMeal}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="md:flex-1 p-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              {recipe.strMeal}
            </h1>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                {recipe.strCategory || "Uncategorized"}
              </span>
              <span className="bg-yellow-50 text-yellow-700 text-xs px-2 py-1 rounded-full">
                {recipe.strArea || "International"}
              </span>
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="border-t border-b border-gray-100 py-4 mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">
                    {recipe.strCategory || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cuisine</p>
                  <p className="font-medium">
                    {recipe.strArea || "International"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ingredients</p>
                  <p className="font-medium">{ingredients.length}</p>
                </div>
                {recipe.strYoutube && (
                  <div>
                    <p className="text-sm text-gray-500">Video Tutorial</p>
                    <a
                      href={recipe.strYoutube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-500 hover:underline"
                    >
                      Watch <ExternalLink size={14} className="ml-1" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {recipe.strSource && (
              <div className="text-sm text-gray-500 mb-4">
                <span className="block mb-1">Source:</span>
                <a
                  href={recipe.strSource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline break-all"
                >
                  {recipe.strSource}
                </a>
              </div>
            )}

            <button
              onClick={() => toggleRecipeSelection(recipe)}
              className={`w-full py-3 rounded-md ${
                isSelected
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {isSelected ? "Remove from Selected" : "Add to Selected Recipes"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("instructions")}
          className={`px-4 py-2 -mb-px text-sm font-medium ${
            activeTab === "instructions"
              ? "text-blue-600 border-b-2 border-blue-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Instructions
        </button>
        <button
          onClick={() => setActiveTab("ingredients")}
          className={`px-4 py-2 -mb-px text-sm font-medium ${
            activeTab === "ingredients"
              ? "text-blue-600 border-b-2 border-blue-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Ingredients
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        {activeTab === "instructions" && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              How to Prepare
            </h2>
            {instructionParagraphs.map((paragraph, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  index > 0 ? "pt-4 border-t border-gray-100" : ""
                }`}
              >
                <p className="text-gray-600">{paragraph}</p>
              </div>
            ))}
            {recipe.strYoutube && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Video Tutorial
                </h3>
                <div className="aspect-video w-full rounded-lg overflow-hidden">
                  <iframe
                    src={recipe.strYoutube.replace("watch?v=", "embed/")}
                    title={`${recipe.strMeal} tutorial video`}
                    className="w-full h-full"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "ingredients" && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Ingredients
            </h2>
            <ul className="divide-y divide-gray-100">
              {ingredients.map((item, index) => (
                <li key={index} className="py-3 flex items-center">
                  <span className="font-medium text-gray-800">{item.name}</span>
                  <span className="ml-4 text-gray-500">{item.measure}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                {isSelected ? (
                  <>
                    <span className="font-semibold">
                      This recipe is in your selection.
                    </span>{" "}
                    Go to the Selected Recipes page to view your full shopping
                    list.
                  </>
                ) : (
                  <>
                    <span className="font-semibold">Want to make this?</span>{" "}
                    Add it to your selected recipes to include these ingredients
                    in your shopping list.
                  </>
                )}
              </p>
              <div className="mt-3">
                {isSelected ? (
                  <Link
                    to="/favorites"
                    className="inline-block px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                  >
                    View Selected Recipes
                  </Link>
                ) : (
                  <button
                    onClick={() => toggleRecipeSelection(recipe)}
                    className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                  >
                    Add to Selected
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleRecipePage;
